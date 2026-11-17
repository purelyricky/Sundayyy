# Sunday

Sunday is a calm AI workspace for teams: chat with your company knowledge, build agents,
connect sources and manage everything from an admin panel.

This folder is the **web app** only. It runs against a built-in **mock backend**
(`mock-api/`), so every screen works end to end with demo data and nothing real is
connected.

## Run it

```bash
bun install          # or: npm install
bun run demo         # starts the mock API (8080) and the web app (3000)
```

Open <http://localhost:3000> and sign in with any email and password
(for example `admin@sunday.dev`).

You can also start the two halves separately:

```bash
bun run mock         # mock API on http://localhost:8080
bun run dev          # Next.js dev server on http://localhost:3000
```

## What the mock backend does

- Serves login, user profile, settings, agents, models, projects, connectors, users,
  groups, document sets and the rest of the admin surface from in-memory seed data
  (`mock-api/seed.mjs`).
- Streams chat replies (search steps, citations, markdown) so the chat UI behaves like the real thing.
- Keeps state in memory while it runs: new chats, renamed chats, projects and agents you
  create persist until you restart it.

Unknown endpoints return an empty response and are logged to the mock's console as
`[unhandled]`, so gaps are easy to spot.

## Layout

- `src/` the Next.js app
- `lib/opal`, `lib/shared` the design system and tokens
- `mock-api/` the stand-in backend
