# CA.Services Website

A landing page for CA.Services — student-owned window & pressure washing, built with plain HTML, CSS, and JavaScript. No build tools, no dependencies — just static files.

## Files

- `index.html` — page content and structure
- `style.css` — all styling (dark navy / white palette, Poppins font)
- `script.js` — mobile menu, FAQ accordion, and booking form behavior

## Before you launch: 3 things to update

1. **Booking form** — the form currently posts to a placeholder Formspree endpoint. To make it actually send you emails:
   - Go to [formspree.io](https://formspree.io) and create a free account
   - Create a new form, copy the endpoint URL it gives you (looks like `https://formspree.io/f/abc123`)
   - In `index.html`, find `action="https://formspree.io/f/YOUR_FORM_ID"` and replace `YOUR_FORM_ID` with your real ID
   - (Any similar form backend — Formspree, Getform, Web3Forms — works the same way, since this is a static site with no server of its own)

2. **Instagram link** — in `index.html`, search for `YOUR_INSTAGRAM_HANDLE` in the footer and replace it with your actual Instagram username.

3. **Pricing** — the three packages in the Pricing section use placeholder prices ($99 / $129 / $199). Update these in `index.html` to match your real rates.

## Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `ca-services-website`).
2. Upload these files (`index.html`, `style.css`, `script.js`) to the root of the repository — either by dragging them into the GitHub web UI, or via git:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/ca-services-website.git
   git push -u origin main
   ```
3. In the repository, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to `Deploy from a branch`.
5. Set **Branch** to `main` and folder to `/ (root)`, then click **Save**.
6. After a minute or two, your site will be live at:
   `https://YOUR_USERNAME.github.io/ca-services-website/`

## Local preview

Just open `index.html` in a browser — no server required. (For live-reload while editing, you can also use the VS Code "Live Server" extension or run `python3 -m http.server` in this folder.)
