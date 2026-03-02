# ProjectGrade

ProjectGrade is a React + Supabase app for:
- AI-assisted project grading
- Professor discovery
- Research-idea generation

## Local setup

1. Install dependencies:

```sh
npm install
```

2. Configure environment variables in `.env`:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

3. Start the dev server:

```sh
npm run dev
```

4. Open the URL printed by Vite (usually `http://localhost:5173`).

## Quality checks

```sh
npm run lint
npm run test
npm run build
```

## Guest mode

The app includes a guest mode for trying the dashboard and flows without creating an account.

## Supabase Edge Functions

The AI functions expect these server-side environment variables:
- `AI_GATEWAY_URL`
- `AI_GATEWAY_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (required for `grade-project`)
