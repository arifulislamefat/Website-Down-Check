# Is It Down Right Now — Cloudflare Pages version

Free, custom domain included, and ads are allowed on Cloudflare's free tier
(unlike Vercel's free Hobby tier, which forbids monetization).

## What's in here
- `public/index.html` — the frontend (dark/cyan theme matching your original)
- `functions/api/check.js` — the serverless function that does the real check
  server-side (this is what avoids CORS issues and gives accurate latency)

## 1. Push this to GitHub
Create a new repo and push this folder to it. Cloudflare Pages deploys straight
from a GitHub repo and auto-redeploys on every push.

## 2. Deploy on Cloudflare Pages
1. Sign up at dash.cloudflare.com (free, no card required).
2. Go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select your repo.
4. Build settings:
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: **public**
5. Click **Save and Deploy**. Cloudflare auto-detects the `functions/` folder
   and wires up `/api/check` for you — no extra config needed.

You'll get a free `*.pages.dev` URL immediately, same as your `base44.app` one.

## 3. Connect your custom domain (free)
1. In the Pages project, go to **Custom domains → Set up a domain**.
2. Enter your domain.
3. If your domain's DNS is already on Cloudflare, it connects in one click.
   If it's registered elsewhere, Cloudflare gives you a CNAME record to add
   at your registrar — takes a few minutes to a few hours to propagate.
4. SSL certificate is issued automatically.

## 4. Add Google AdSense (once approved)
1. Apply at adsense.google.com using your new custom domain.
2. Google gives you a verification snippet — paste it in the `<head>` of
   `public/index.html` where the `<!-- ADSENSE -->` comment is.
3. Once approved, create `public/ads.txt` containing the line Google gives
   you (looks like `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`).
4. Add your ad unit `<ins>` tag inside the `#ad-slot` div in `index.html`.
5. Commit and push — Cloudflare redeploys automatically.

## Notes
- The check endpoint times out at 10 seconds and treats any status code
  under 500 as "up." Adjust the threshold in `functions/api/check.js` if you
  want stricter/looser rules.
- Free tier limit is 100,000 requests/day on Workers — resets daily, way
  more than this kind of tool typically needs to worry about.
