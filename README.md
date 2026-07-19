# BRD AI Studio

A polished Next.js workspace that turns a project brief into a collaborative Business Requirements Document (BRD). Three AI agents produce requirements, a solution approach, and risk/governance guidance. The product remains usable in demo mode if no API key is configured.

## Run locally

1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY` for live AI generations.
3. Run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this folder to a new GitHub repository.
2. In [Vercel](https://vercel.com/new), import the repository.
3. Add `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) under **Environment Variables**.
4. Click **Deploy**. Vercel detects Next.js automatically.

## GitHub

```bash
git init
git add .
git commit -m "Create BRD AI Studio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/brd-ai-studio.git
git push -u origin main
```

Never commit `.env.local`; it is already ignored.
