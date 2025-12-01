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

    return new Response('Not found', { status: 404 });
  },
};

/**
 * Handle POST /callback - Exchange authorization code for access token
 * Called by Decap CMS after user approves on GitHub
 */
async function handleCallback(request, env) {
  try {
    const body = await request.json();
    const { code } = body;

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
