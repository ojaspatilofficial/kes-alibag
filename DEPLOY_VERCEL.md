# Deploying to Vercel — step by step

The project is ready for Vercel as it is. Nothing needs to be renamed or moved.

| Part | Where it runs on Vercel |
| --- | --- |
| Website (React) | Built by `npm run build` into `dist/`, served from Vercel’s CDN |
| Images, favicon, PDFs in `public/` | Served from the CDN together with the website (already in the GitHub repo) |
| API + admin (`server/`) | One serverless function, `api/index.js` (routes `/api/*` and `/uploads/*`) |
| Content (institutions, board, documents…) | MongoDB Atlas, database `kes_alibag` — **already seeded** |
| Files uploaded in the admin dashboard | Vercel Blob storage (step 4) |

Repository: <https://github.com/ojaspatilofficial/kes-alibag> (branch `main`).

---

## 1. MongoDB Atlas — allow Vercel to connect

Vercel has no fixed IP address, so Atlas must accept connections from anywhere (logins are still protected by the
database user and password).

1. Open [cloud.mongodb.com](https://cloud.mongodb.com) → your project → **Network Access**.
2. **Add IP Address** → **Allow access from anywhere** (`0.0.0.0/0`) → **Confirm**.
3. Wait until the entry shows **Active** (about a minute).

## 2. Import the project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Find **`ojaspatilofficial/kes-alibag`** → **Import**. (If it is not listed, click *Adjust GitHub App Permissions*
   and give Vercel access to the repository.)
3. On the configuration screen, leave the defaults — they come from `vercel.json`:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` · **Output Directory:** `dist` · **Install Command:** `npm install`
4. Open **Environment Variables** on the same screen and add the variables from step 3 **before** pressing Deploy.

## 3. Environment variables

Add each one for **Production, Preview and Development**.

| Name | Value |
| --- | --- |
| `MONGODB_URI` | Your Atlas string **with the database name**: `mongodb+srv://<user>:<password>@cluster0.ebffdzi.mongodb.net/kes_alibag?retryWrites=true&w=majority&appName=Cluster0` — copy it from your local `.env` |
| `JWT_SECRET` | A long random text. Copy `JWT_SECRET` from your local `.env`, or generate one: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | Copy from your local `.env` (see the note below) |
| `SITE_URL` | The public address, e.g. `https://kes-alibag.vercel.app` (change it later if you add your own domain) |

> **About the admin password:** the admin account already exists in Atlas — it was created from your local `.env`.
> `ADMIN_USERNAME` / `ADMIN_PASSWORD` are only used when the database has **no** admin yet, so on the live site you
> log in with the password from your local `.env`. Change it any time in **Admin → Settings → Change admin password**.

Never put these values in the code or commit `.env` — it is in `.gitignore`.

Then press **Deploy**. The first build takes 1–2 minutes.

## 4. File uploads — connect a Blob store

Without this the website works, but uploading PDFs/photos in the admin shows
“File uploads are not set up yet”.

1. In the Vercel project → **Storage** → **Create Database** → **Blob** → name it e.g. `kes-alibag-files` → **Create**.
2. **Connect** it to the project for all environments. This adds `BLOB_READ_WRITE_TOKEN` automatically.
3. **Deployments** → the latest deployment → **⋯** → **Redeploy** (needed so the new variable is picked up).

Each upload must be **under 4 MB** on Vercel (the dashboard checks this). Compress large PDFs before uploading.

## 5. Check the live site

Open your Vercel URL and check:

- [ ] `/` — home page with the emblem, building photo and stats
- [ ] `/institutions` — 68 institutions, search for “Roha”
- [ ] `/about/board` — 9 portraits
- [ ] `/api/health` — shows `{"ok":true}` (the API and database are connected)
- [ ] `/admin` — log in, open **Results & Publications**, open an empty slot, upload a small PDF, save, and see it on `/results`

## 6. Your own domain (optional)

1. Project → **Settings → Domains** → add the domain (e.g. `www.kesalibag.edu.in`) and set the DNS records Vercel shows.
2. Change `SITE_URL` to the new address and **Redeploy** (it is used in `sitemap.xml` and `robots.txt`).

## 7. Day-to-day

- **Content** (institutions, results, notices, photos, board, settings) is changed in `/admin` — no redeploy needed.
- **Code changes:** push to `main` on GitHub → Vercel builds and deploys automatically. Other branches get preview URLs.

## Troubleshooting

| What you see | Fix |
| --- | --- |
| Pages load but lists are empty / `/api/health` says the database is not reachable | Atlas **Network Access** (step 1), or a wrong `MONGODB_URI` (check the password and `/kes_alibag`). Redeploy after changing variables. |
| Admin login says “Admin login is not set up” | Add `JWT_SECRET` (step 3) and redeploy. |
| “Wrong username or password” | Use the password from your local `.env` (the account already exists in Atlas). |
| Upload says “not set up yet” | Connect the Blob store (step 4) and redeploy. |
| Upload says “file is too big” | Keep files under 4 MB. |
| Build fails | Project → Settings → General → **Node.js Version 22.x**, then redeploy. |
| Old content after an admin change | Refresh the page; the site loads fresh data on each visit. |

## Security reminder

The Atlas password was shared in a chat during setup. For safety, change it in Atlas → **Database Access** → your
user → **Edit → Edit Password**, then update `MONGODB_URI` in your local `.env` **and** in Vercel, and redeploy.
