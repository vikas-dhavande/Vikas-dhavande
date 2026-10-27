# Portfolio application

This folder contains the Next.js application for the portfolio. The repository
root also contains the GitHub profile README and repository-level project
documents; application code, assets, and configuration live here.

## Project map

```text
portfolio/
├── public/                 # Static assets served from the site root
├── src/
│   ├── app/                # Next.js App Router pages, layouts, and API routes
│   ├── components/
│   │   ├── blog/           # Components used by blog pages
│   │   ├── layout/         # Homepage sections and site-wide layout
│   │   ├── shadcn-space/   # Reusable composed blocks and animations
│   │   └── ui/             # Reusable interface primitives
│   ├── data/               # Local JSON content and fallback data
│   ├── hooks/              # Shared React hooks
│   └── lib/                # Appwrite clients, data services, types, and utilities
├── package.json            # Application scripts and dependencies
├── next.config.mjs         # Next.js configuration
├── tsconfig.json           # TypeScript configuration and @/* alias
└── testing.md              # Testing strategy and guidance
```

### Where to make changes

- **Pages and endpoints:** add route entry points under `src/app/`. A folder
  becomes a URL segment when it contains a `page.tsx` or `route.ts` file.
- **Homepage sections and shared site layout:** use `src/components/layout/`.
- **Blog-specific presentation:** use `src/components/blog/`.
- **Reusable UI primitives:** use `src/components/ui/`; composed blocks and
  animations belong in `src/components/shadcn-space/`.
- **Portfolio and blog seed content:** update the JSON files in `src/data/`.
- **Data access and shared logic:** use `src/lib/`; keep data types alongside
  their domain service.
- **Static images, icons, and fonts:** put files in `public/` and reference them
  from the site root (for example, `/vikas.png`).

## Request and data flow

The home page (`src/app/page.tsx`) loads portfolio content through
`src/lib/portfolio-service.ts` and passes it to the relevant page sections.
That service uses local portfolio JSON by default and can use Appwrite when its
portfolio database and collection IDs are configured.

Blog routes are under `src/app/blog/`. Blog pages use
`src/lib/blog-service.ts`, which reads from Appwrite when configured and falls
back to the local blog JSON. Shared Appwrite client setup lives in
`src/lib/appwrite.ts`.

## Routes

| URL | Entry point |
| --- | --- |
| `/` | `src/app/page.tsx` |
| `/blog` | `src/app/blog/page.tsx` |
| `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` |
| `/profile` | `src/app/profile/page.tsx` |
| `/auth/oauth-callback` | `src/app/auth/oauth-callback/page.tsx` |
| `/api/refresh` | `src/app/api/refresh/route.ts` |

## Local development

Use Node.js and pnpm, then run these commands from this folder:

```bash
pnpm install
pnpm dev
```

Create `.env.local` from `.env.example` to configure Appwrite. Blog database
settings are optional; without them the local blog data is used. Portfolio
database settings are also optional. Variables prefixed with `NEXT_PUBLIC_`
are exposed to the browser and must not contain secrets.

Other available commands:

```bash
pnpm build
pnpm start
```

The package currently has no dedicated automated test command. See
[`testing.md`](./testing.md) for the testing strategy and guidance; use
`pnpm build` to verify the production application build.
