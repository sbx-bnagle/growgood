# Decap CMS GitHub OAuth with Cloudflare Workers + GitHub Pages

This setup allows you to use Decap CMS with GitHub OAuth while hosting on GitHub Pages, using Cloudflare Workers as a secure OAuth proxy.

## Architecture

- **GitHub Pages**: Static site hosting (your blog/site)
- **Cloudflare Worker**: OAuth proxy that securely exchanges auth codes for tokens
- **GitHub OAuth App**: Authenticates users and provides authorization

The Worker keeps your Client Secret safe by running server-side on Cloudflare's edge.

## Prerequisites

- Cloudflare account (free tier works)
- Wrangler CLI: `npm install -g wrangler`
- Node.js 16+

## Quick Start

### 1. Create a GitHub OAuth App

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: `GrowGood CMS`
   - **Homepage URL**: `https://growgood.example.com` (your GitHub Pages domain)
   - **Authorization callback URL**: `https://auth.growgood.example.com/callback`
     - Or use Cloudflare Worker default: `https://<project-name>.<account>.workers.dev/callback`
4. Click **Register application**
5. Copy **Client ID** and **Client Secret** (save securely!)

### 2. Deploy the Cloudflare Worker

```bash
# Authenticate with Cloudflare
wrangler login

# Set your secrets
wrangler secret put GITHUB_CLIENT_ID
# Paste your Client ID and press Enter

wrangler secret put GITHUB_CLIENT_SECRET
# Paste your Client Secret and press Enter

# Deploy
wrangler deploy
```

After deployment, you'll see a URL like:
```
https://growgood-github-oauth.<your-account>.workers.dev/
```

### 3. Update GitHub OAuth App (if needed)

If you used the Worker's default URL:
1. Go back to your OAuth App settings
2. Update **Authorization callback URL** to the Worker URL:
   ```
   https://growgood-github-oauth.<your-account>.workers.dev/callback
   ```

### 4. Update `admin/config.yml`

Replace the `auth_endpoint`:

```yaml
backend:
  name: github
  repo: sbx-bnagle/growgood
  branch: main
  auth_endpoint: "https://growgood-github-oauth.<your-account>.workers.dev/callback"
```

### 5. Test

1. Navigate to `https://growgood.example.com/admin/`
2. Click **Login with GitHub**
3. You should be redirected to GitHub to authorize
4. After authorization, you should be logged into Decap CMS

## Local Development & Testing

### Test the Worker Locally

```bash
wrangler dev
```

This starts a local server at `http://localhost:8787`.

### Update GitHub OAuth App for Local Testing

1. Go to your OAuth App settings
2. Add/update **Authorization callback URL** to:
   ```
   http://localhost:8787/callback
   ```

### Test Decap CMS Locally

1. In another terminal, start your Jekyll site:
   ```bash
   jekyll serve  # or `bundle exec jekyll serve`
   ```
2. Open `http://localhost:4000/admin/`
3. Try logging in with GitHub

## Optional: Custom Domain for Worker

If you want a cleaner URL like `auth.growgood.example.com`:

1. In Cloudflare dashboard → **Workers & Pages** → your worker → **Settings**
2. Add a **Route**: `auth.growgood.example.com/*` → your worker
3. Update `admin/config.yml`:
   ```yaml
   auth_endpoint: "https://auth.growgood.example.com/callback"
   ```
4. Update GitHub OAuth App callback URL accordingly

## Troubleshooting

### "Invalid request" or "Missing authorization code"
- Check that the callback URL matches exactly between GitHub OAuth App and Decap CMS config
- Verify Client ID and Secret are correct and set as secrets in Wrangler

### "Authorization failed" from GitHub
- Check that the OAuth App's **Authorization callback URL** matches what Decap CMS is using
- Ensure the OAuth App is active in GitHub settings

### CORS errors in browser console
- The Worker includes CORS headers by default
- If issues persist, check that your site domain is correct in `admin/config.yml`

### Worker deployment fails
- Run `wrangler whoami` to confirm you're authenticated
- Ensure `wrangler.toml` is in the project root
- Try `wrangler deploy --name growgood-github-oauth`

## File Structure

```
growgood/
├── admin/
│   └── config.yml          # Updated with auth_endpoint
├── workers/
│   └── github-oauth.js     # OAuth proxy worker
├── wrangler.toml           # Worker config
└── docs/
    └── CLOUDFLARE_OAUTH.md (this file)
```

## Security Notes

- **Client Secret**: Never commit to Git. Use Wrangler secrets (stored securely on Cloudflare).
- **CORS**: The Worker allows requests from any origin by default. For production, restrict to your domain in `corsHeaders()`.
- **Tokens**: Access tokens are returned to the browser and stored by Decap CMS in local storage. Use HTTPS only in production.

## References

- [Decap CMS Docs](https://decapcms.org/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [GitHub OAuth App Docs](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)
