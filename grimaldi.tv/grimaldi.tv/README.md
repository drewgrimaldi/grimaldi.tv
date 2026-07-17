# grimaldi.tv

Frontend for The Drew Grimaldi Podcast. Originally built in Base44; this is
the exported source, rewired to run on **Cloudflare Pages** (hosting) +
**Supabase** (auth, database, file storage) instead of Base44's hosted
backend.

## What changed from the Base44 export

- `src/api/base44Client.js` is now a **compatibility shim** — it exposes the
  exact same `base44.entities.X.list/filter/create/update/delete`,
  `base44.auth.*`, `base44.integrations.Core.*` calls the pages already used,
  but backed by Supabase under the hood. This is why almost every
  page/component below didn't need to be rewritten.
- `src/lib/AuthContext.jsx` no longer gates the entire site behind a login
  wall (that was a Base44-specific "is this user registered for this app"
  check that doesn't apply here). The site is public by default; auth is
  only used to detect `role === 'admin'` so the edit/delete buttons show up
  for you.
- **Fixed a bug from the original app**: `Login.jsx`, `Register.jsx`,
  `ForgotPassword.jsx`, `ResetPassword.jsx`, and `Live.jsx` existed as files
  in the Base44 export but were never actually routed in `App.jsx` — they
  were dead code. They're wired up now (`/login`, `/register`,
  `/forgot-password`, `/reset-password`, `/Live`).
- **Security fix**: the original `base44/functions/fetchStudioBlogPosts/entry.ts`
  had a live Base44 API key hardcoded in source
  (`3da46b3306644063ad0c6e097a7c11b0`, for app `69b9e7055b92775b87793d2c` —
  your studio.grimaldi.tv project). That's moved to an env var
  (`STUDIO_BLOG_API_KEY`) in `functions/api/functions/[name].js`.
  **Rotate that key in studio.grimaldi.tv's Base44 settings before this repo
  goes anywhere public**, since it's been sitting in plain text.
- The 6 Base44 serverless functions became:
  - `sendEmail`, `sendPollResponse`, `notifyPremiumSignup`, `fetchStudioBlogPosts`,
    `getSubstackFeed` → Cloudflare Pages Functions (`functions/api/functions/[name].js`),
    deployed automatically with the site.
  - `cleanupPremiumSubscribers`, `expireSubscriptions` → a separate cron-triggered
    Cloudflare Worker (`workers/premium-subscriptions-cron/`), since Pages
    Functions don't support cron.

## Setup

### 1. Supabase

1. Create a project at supabase.com (you said you already started one).
2. SQL Editor → paste and run `supabase/schema.sql`. This creates all 12
   content tables + a `profiles` table + RLS policies + a public storage
   bucket for uploads.
3. Auth → Providers → enable **Google** if you want the "Continue with
   Google" buttons on Login/Register to work (Client ID/Secret from Google
   Cloud Console, redirect URL is shown in the Supabase dashboard).
4. Auth → Email Templates → **Confirm signup**: for the 6-digit code UI in
   `Register.jsx` to work, change the template to include `{{ .Token }}`
   instead of the default magic-link button. (If you'd rather keep
   Supabase's default magic-link flow, that's fine too — just swap
   `Register.jsx`'s OTP screen for "check your email" copy.)
5. Settings → API → copy the Project URL and `anon public` key into
   `.env.local` (see `.env.example`). Copy the `service_role` key too, but
   that one only goes into Cloudflare's server-side env vars — **never**
   into `VITE_`-prefixed vars or anything shipped to the browser.
6. Once you've signed up through the site once, make yourself admin:
   ```sql
   update profiles set role = 'admin' where id = '<your-auth-user-uuid>';
   ```
   (Find your UUID in Supabase → Authentication → Users.)

### 2. Local dev

```bash
npm install
cp .env.example .env.local   # fill in your Supabase URL + anon key
npm run dev
```

### 3. Deploy to Cloudflare Pages

1. Push this repo to the GitHub repo you already connected.
2. In Cloudflare dashboard → Workers & Pages → Create → Pages → connect that
   GitHub repo.
   - Build command: `npm run build`
   - Output directory: `dist`
3. Settings → Environment variables:
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (same as your `.env.local`)
   - `SUPABASE_SERVICE_ROLE_KEY` — not currently used by the Pages Functions
     in this repo, but here if you add admin-only server routes later
   - `RESEND_API_KEY` — sign up at resend.com (or swap `sendViaResend` in
     `functions/api/functions/[name].js` for your email provider of choice)
   - `ADMIN_NOTIFY_EMAIL` = `drew@grimaldi.tv`
   - `STUDIO_BLOG_API_KEY`, `STUDIO_BLOG_APP_ID` — the rotated key from the
     security note above
4. Deploy. Pages Functions in `functions/` ship automatically with the site.

### 4. Deploy the cron worker (subscription cleanup)

```bash
cd workers/premium-subscriptions-cron
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler deploy
```

## Project structure

```
src/
  api/base44Client.js     <- Supabase-backed compatibility shim
  lib/
    supabaseClient.js     <- raw supabase-js client
    AuthContext.jsx        <- simplified, public-site auth
  components/              <- unchanged from Base44 export (home/press/episodes/funny/ui)
  pages/                    <- unchanged, plus Login/Register/Live now actually routed
supabase/schema.sql         <- run this in Supabase SQL Editor
functions/api/functions/    <- Cloudflare Pages Functions (email, substack feed, etc.)
workers/premium-subscriptions-cron/  <- separate cron Worker
```

## Known gaps vs. the original Base44 app

- `Meme` and `PremiumEpisode` entities exist in the schema for parity but
  aren't wired into any page (they weren't in the original either — likely
  legacy/in-progress features on the Base44 side).
- Google OAuth and the 6-digit email OTP flow need the Supabase dashboard
  configuration steps above before they'll work — they will not work out of
  the box on a fresh Supabase project.
- Base44's `pages.config.js` referenced `Premium.jsx` and `AdminPremium.jsx`
  pages that don't exist anywhere in the export (stale/deleted). Not carried
  over here; flagging in case that was expected functionality you lost track of.
