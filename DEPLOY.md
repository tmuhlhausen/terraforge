# TerraForge — Deployment Tutorial

**Repo:** https://github.com/tmuhlhausen/terraforge

## 1. Get the full source

If any JS modules are missing on GitHub, use the complete local package or clone and replace:

```bash
git clone https://github.com/tmuhlhausen/terraforge.git
cd terraforge
```

Ensure these exist:
- `index.html`
- `css/main.css`
- `js/app.js` `js/config.js` `js/globe.js` `js/sim.js` `js/ui.js`
- `README.md` `OPERATOR.md` `LEGAL.md`

## 2. Local test

```bash
python3 -m http.server 8765
# open http://localhost:8765
```

## 3. One-click cloud deploy

### Netlify (easiest)
1. https://app.netlify.com → Add new site → Import from Git
2. Choose GitHub → `tmuhlhausen/terraforge`
3. Build command: leave empty · Publish directory: `.`
4. Deploy

Or: **Deploy manually** → drag the project folder onto Netlify Drop.

### Cloudflare Pages
1. dash.cloudflare.com → Workers & Pages → Create → Pages
2. Connect GitHub → `terraforge`
3. Framework preset: **None** · Build command: empty · Output: `/`
4. Save and Deploy

### Vercel
1. vercel.com → Add New → Project → Import `terraforge`
2. Framework: Other · no build command
3. Deploy

### GitHub Pages
1. Repo Settings → Pages → Source: Deploy from branch `main` / root
2. Site at `https://tmuhlhausen.github.io/terraforge/`
   (may need relative paths; static modules work from root)

## 4. Revenue setup (after live)

1. Open the live site
2. Settings (⚙) → **Treasury wallet** = company address
3. Save

Fees credit that wallet ledger.

## 5. Custom domain

In Netlify/Cloudflare/Vercel: Domain settings → add domain → update DNS as instructed.

## 6. Solo ops

No server to babysit. No mod team. Update code → git push → host redeploys.

See OPERATOR.md and LEGAL.md before taking real funds.
