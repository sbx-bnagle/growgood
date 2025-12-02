/**
 * Cloudflare Worker - GitHub OAuth Proxy for Decap CMS
 * 
 * This worker exchanges a GitHub authorization code for an access token.
 * It keeps the Client Secret secure by running server-side on Cloudflare.
 * 
 * Deploy with:
 *   wrangler secret put GITHUB_CLIENT_ID
 *   wrangler secret put GITHUB_CLIENT_SECRET
 *   wrangler deploy
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request),
      });
    }

    // POST /callback - Exchange code for token
    if (url.pathname === '/callback' && request.method === 'POST') {
      return handleCallback(request, env);
    }

    // /auth - Initiate OAuth flow by redirecting to GitHub (accept GET or POST)
    if (url.pathname === '/auth' && (request.method === 'GET' || request.method === 'POST')) {
      return handleAuth(request, env);
    }

    // Root: redirect to /auth to help with misconfigured endpoints
    if (url.pathname === '/' && request.method === 'GET') {
      const redirectUrl = `${url.origin}/auth`;
      return Response.redirect(redirectUrl, 302);
    }

    // GET /callback - Handle redirect from GitHub (for browser-based flow)
    if (url.pathname === '/callback' && request.method === 'GET') {
      return handleCallbackGet(request, env);
    }

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(request) },
      });
    }

    // Helpful diagnostic response for unknown routes
    return new Response(JSON.stringify({
      error: 'Not found',
      path: url.pathname,
      method: request.method,
      info: 'Worker deployed but route not handled. Ensure auth_endpoint points to /auth and callback to /callback'
    }, null, 2), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  },
};

/**
 * Handle POST /callback - Exchange authorization code for access token
 * Called by Decap CMS after user approves on GitHub
 */
async function handleCallback(request, env) {
  try {
    // Accept code from JSON body, form-encoded body, or query string
    const ct = request.headers.get('content-type') || '';
    let code;

    if (ct.includes('application/json')) {
      try {
        const body = await request.json();
        code = body.code || body?.payload?.code;
      } catch (err) {
        // ignore JSON parse error and try other parsers
      }
    } else if (ct.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      code = params.get('code') || params.get('payload');
    } else {
      // try parsing as JSON or form-encoded as a fallback
      const text = await request.text();
      try {
        const maybe = JSON.parse(text || '{}');
        code = maybe.code || maybe?.payload?.code;
      } catch (err) {
        const params = new URLSearchParams(text);
        code = params.get('code') || params.get('payload');
      }
    }

    // Also allow code via query string (some flows redirect with GET)
    try {
      const url = new URL(request.url);
      if (!code) code = url.searchParams.get('code');
    } catch (e) {}

    if (!code) {
      return jsonResponse({ error: 'Missing authorization code' }, 400);
    }

    const clientId = env.GITHUB_CLIENT_ID;
    const clientSecret = env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('Missing GitHub OAuth credentials in environment');
      return jsonResponse({ error: 'Server misconfigured' }, 500);
    }

    // Exchange code for access token with GitHub
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('GitHub token exchange failed:', tokenResponse.status);
      return jsonResponse({ error: 'Token exchange failed' }, 500);
    }

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub error:', tokenData.error_description);
      return jsonResponse({ error: tokenData.error_description || 'GitHub error' }, 401);
    }

    if (!tokenData.access_token) {
      console.error('No access token in response');
      return jsonResponse({ error: 'No access token received' }, 500);
    }

    // Return token to Decap CMS
    return jsonResponse(
      {
        token: tokenData.access_token,
        provider: 'github',
      },
      200
    );
  } catch (error) {
    console.error('Error in callback handler:', error);
    return jsonResponse({ error: error.message || 'Internal server error' }, 500);
  }
}

/**
 * Handle GET /auth - Redirect user to GitHub authorize URL to start OAuth
 */
async function handleAuth(request, env) {
  try {
    const url = new URL(request.url);
    const origin = url.origin;
    const clientId = env.GITHUB_CLIENT_ID;

    if (!clientId) {
      return new Response('Server misconfigured: missing GITHUB_CLIENT_ID', { status: 500 });
    }

    // Allow optional scope and state via query string
    const scope = url.searchParams.get('scope') || 'repo';
    const state = url.searchParams.get('state') || '';

    const redirectUri = `${origin}/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope,
    });
    if (state) params.set('state', state);

    const githubAuthUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;

    return Response.redirect(githubAuthUrl, 302);
  } catch (err) {
    console.error('Error initiating auth:', err);
    return new Response('Error initiating authorization', { status: 500 });
  }
}

/**
 * Handle GET /callback - Browser redirect from GitHub OAuth
 * Useful for manual testing or alternative flows
 */
async function handleCallbackGet(request, env) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      return new Response(
        `Authorization failed: ${error}. ${url.searchParams.get('error_description') || ''}`,
        { status: 401, headers: { 'Content-Type': 'text/plain' } }
      );
    }

    if (!code) {
      return new Response('Missing authorization code', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    const clientId = env.GITHUB_CLIENT_ID;
    const clientSecret = env.GITHUB_CLIENT_SECRET;

    // Exchange code for token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new Response(`Error: ${tokenData.error_description}`, {
        status: 401,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Return token as HTML/JS for browser-based flow
    // Decap CMS will handle this and store it
    return new Response(
      `
      <html>
        <body>
          <h1>Authorization Successful</h1>
          <p>Token received. Closing window...</p>
          <script>
            window.opener.postMessage({
              type: 'authorization:github',
              payload: {
                token: '${tokenData.access_token}',
                provider: 'github'
              }
            }, window.location.origin);
            window.close();
          </script>
        </body>
      </html>
      `,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (error) {
    console.error('Error in GET callback:', error);
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

/**
 * Helper: JSON response with CORS headers
 */
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders({}),
    },
  });
}

/**
 * CORS headers to allow requests from your GitHub Pages domain
 */
function corsHeaders(request) {
  // Restrict to your domain(s) for security
  const origin = request.headers?.get('origin') || '*';
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}
