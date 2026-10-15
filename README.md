# Neural Hive Lab

A responsive, client-side React + Vite mini-project for an interactive K-means clustering playground.

## Run locally

1. Install Node.js LTS from https://nodejs.org/
2. Extract the ZIP and open a terminal in this folder.
3. Run:

   ```bash
   npm install
   npm run dev
   ```

4. Open the local URL printed by Vite (usually http://localhost:5173).

Run `npm run build` to create the production site in `dist/`.

## Deploy to Vercel using GitHub

1. Create a new empty GitHub repository at https://github.com/new (e.g. `neural-hive-lab`). Do not initialize it with a README.
2. In a terminal inside the extracted project folder, run:

   ```bash
   git init
   git add .
   git commit -m "Build Neural Hive Lab"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/neural-hive-lab.git
   git push -u origin main
   ```

   Replace `YOUR-USERNAME` with your GitHub username. Follow GitHub's browser sign-in prompt if requested.
3. Visit https://vercel.com/new and sign in with GitHub.
4. Import your `neural-hive-lab` repository.
5. Confirm these settings (Vercel usually detects Vite automatically):
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
6. Click **Deploy**. Vercel will provide a public URL.

## Notes

- No API keys or environment variables are required.
- The clustering demo runs entirely in the browser.
- This is a standalone feature prototype. It does not modify the existing Neural Hive club website automatically. To integrate it into the club's actual website, you need access to that website's source repository and should merge the component/styles into its existing structure.
