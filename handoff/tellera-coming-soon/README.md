# Tellera — Coming Soon (deploy bundle)

A small static site: the Tellera "coming soon" page and everything it needs.
No build step, no server-side code, no dependencies to install.

## Contents

```
index.html                 The page (this is the site root document)
styles/tokens.css          Design tokens (colors, type, prism gradients)
styles/coming-soon.css     Page styles
assets/fonts/              Nunito Sans (self-hosted, 3 weights)
```

`index.html` also loads **Spectral** and **IBM Plex Mono** from Google Fonts
over HTTPS. If external font CDNs are not allowed on this property, self-host
those two families and swap the `<link>` in `index.html` for local
`@font-face` rules — the layout degrades gracefully to system fonts if the
CDN is ever blocked.

## Deploy to tellera.com

1. Publish the **contents of this folder** at the web root so that
   `index.html` is served for `https://tellera.com/`.
   - Works on any static host: S3 + CloudFront, Cloudflare Pages, Netlify,
     Vercel, Nginx/Apache docroot, GitHub Pages, etc.
   - Keep the folder structure intact — paths are root-absolute
     (`/styles/...`, `/assets/...`).
2. Point DNS for `tellera.com` (and `www`) at the host
   (A / ALIAS / CNAME per your provider).
3. Terminate HTTPS (ACM, Let's Encrypt, Cloudflare, …) and redirect
   `http → https` and `www → apex` (or apex → www, your call).

### Nginx example

```nginx
server {
    listen 443 ssl http2;
    server_name tellera.com;
    root /var/www/tellera-coming-soon;   # this folder
    index index.html;
    location / { try_files $uri $uri/ =404; }
}
```

## Notes

- Fully responsive (desktop + mobile); respects `prefers-reduced-motion`.
- No analytics, cookies, forms, or tracking included.
- To preview locally: run `python -m http.server 8000` in this folder and
  open `http://localhost:8000/`.

Questions on the design/markup: Shawn Siegel.
