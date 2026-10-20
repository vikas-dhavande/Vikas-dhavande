# Codebase Audit Report — starter-for-nextjs

**Date:** 2025  
**Scope:** Full `src/` tree read-only investigation  
**Purpose:** Pre-refactor audit for clean folder structure, business/UI separation, dead code removal, consistent conventions, error handling, state management, env config, API structure, and component modularity.

---

## Executive Summary

The project is a **Next.js 15 App Router** application with two distinct concerns that currently coexist in the same component tree: (1) a **production landing page** with auth, theming, and a real Appwrite backend; and (2) a **Next.js Caching Studio / demo** that documents caching patterns with mock data. These two concerns need to be cleanly separated. The critical issues are:

- **The `src/app/layout.js` is plain JavaScript** while every other file is TypeScript — this is the root layout and must be converted.
- **`src/lib/appwrite-server.ts` is entirely unused** — none of its exports (`serverAccount`, `serverDatabases`, `serverUsers`, `createSessionClient`) are imported anywhere outside the file itself.
- **The `APPWRITE_API_KEY` is committed to `.env`** in plaintext. The `.env.example` documents only 2 of the 4 environment variables actually used.
- **`src/assets/logo/logo.tsx`** (the "Shadcnspace" brand SVG) is never imported anywhere in the app.
- **`src/components/shadcn-space/blocks/hero-33/index.tsx`** is a 2-line stub (`const Hero33Page = () => null`) that renders nothing.
- **`src/components/shadcn-space/breadcrumb/breadcrumb-05.tsx`** is never imported anywhere.
- **`src/components/ui/sheet.tsx`** (192 lines) is never imported anywhere.
- Hardcoded hex color literals (`#000000`, `rgba(39,39,42,0.8)`, `#E11D48`, etc.) are scattered through at least 8 component files instead of using the CSS custom properties already defined in `app.css`.
- No `src/types/`, `src/hooks/`, `src/utils/`, `src/constants/`, `src/config/`, or `src/store/` directories exist.
- `src/lib/utils.ts` is a 1-line re-export (`export { cn } from "cn"`) — barely a module.

---

## 1. Complete File Inventory

### `src/app/` — Routes

| File | Lines | Purpose | Imported/Used | Quality |
|------|-------|---------|---------------|---------|
| `app/layout.js` | 76 | Root layout, ThemeProvider, blocking anti-flash script | ✅ Root, auto-loaded | **needs-cleanup** — JavaScript not TypeScript; inline `themeScript` string can be extracted |
| `app/app.css` | 267 | Global design system: CSS vars, Tailwind, themes, animations, utility classes | ✅ Imported by layout.js | **good** — well-organized design tokens |
| `app/page.tsx` | 36 | Home page: reads auth/avatar cookies, renders Navbar+Hero+LogoCloud+Photo+Form+Footer | ✅ Root route `/` | **good** |
| `app/actions.ts` | 49 | Server actions: revalidateTag, revalidatePath, setCookiePreference, clearCookie | ✅ Used by ThemeProvider, AuthModal, RevalidationControls, Navbar | **good** |
| `app/hero-33/page.tsx` | 7 | Demo route `/hero-33` — renders `Hero33Page` which is a null stub | ✅ Routable but renders nothing | **dead-code** |
| `app/login-01/page.tsx` | 10 | Standalone login page at `/login-01` — uses `LoginForm` | ✅ Routable | **needs-cleanup** — redundant; login is already a modal from Navbar |
| `app/logo-cloud-01/page.tsx` | 7 | Demo route `/logo-cloud-01` — renders `LogoCloudDemo` | ✅ Routable | **needs-cleanup** — demo-only route, no nav link |
| `app/profile/page.tsx` | 163 | Caching Studio: session/cookie isolation demo page | ✅ Linked from `caching/Header.tsx` | **good** (Caching Studio concern) |
| `app/search/page.tsx` | 172 | Caching Studio: instant navigation / searchParams prefetch demo | ✅ Linked from `caching/Header.tsx` | **good** (Caching Studio concern) |
| `app/shop/[slug]/layout.tsx` | ~80 | Caching Studio: static shell maximization demo with sidebar | ✅ Auto-loaded for `/shop/*` | **good** (Caching Studio concern) |
| `app/shop/[slug]/page.tsx` | ~90 | Caching Studio: product detail with data-cache by slug | ✅ Used by shop layout | **good** (Caching Studio concern) |

### `src/lib/` — Libraries

| File | Lines | Purpose | Imported/Used | Quality |
|------|-------|---------|---------------|---------|
| `lib/appwrite.js` | 51 | Client-side Appwrite: Account, Databases, OAuth, email auth | ✅ Used by `login.tsx`, `Navbar.tsx` | **needs-cleanup** — JavaScript, no types; `databases` exported but never imported anywhere |
| `lib/appwrite-server.ts` | 31 | Server-side Appwrite: admin client, session client | ❌ **Never imported anywhere** | **dead-code** — entire file unused |
| `lib/data-service.ts` | 336 | Mock data + `'use cache'` functions for Caching Studio | ✅ Used by profile, search, shop pages | **good** (Caching Studio concern) |
| `lib/utils.ts` | 1 | Re-exports `cn` from the `cn` package | ✅ Imported by marquee.tsx | **needs-cleanup** — trivial re-export; `cn` is imported directly from `"cn"` in most ui/ files |

### `src/components/layout/` — App Shell

| File | Lines | Purpose | Imported/Used | Quality |
|------|-------|---------|---------------|---------|
| `layout/ThemeProvider.tsx` | 72 | Theme context: `useTheme`, `cycleTheme`, DOM class manipulation | ✅ layout.js | **good** |
| `layout/Navbar.tsx` | 274 | Sticky nav: auth state, Blobatar, logout, mobile menu, AuthModal, ThemeToggle | ✅ page.tsx | **needs-cleanup** — 274 lines, mixes auth logic with UI; hardcoded hex colors throughout |
| `layout/HeroSection.tsx` | 88 | Full-viewport hero with video background, motion animations | ✅ page.tsx | **good** |
| `layout/Footer.tsx` | 135 | Footer with brand, nav columns, social links | ✅ page.tsx | **needs-cleanup** — all links are `href="#..."` dead hash anchors; hardcoded hex colors |
| `layout/FormSection.tsx` | 91 | Newsletter signup form (placeholder, no real submission) | ✅ page.tsx | **needs-cleanup** — uses raw `<input>` instead of UI primitives; hardcoded hex colors; no real form action |
| `layout/PhotoSection.tsx` | 103 | Media showcase grid with hardcoded mock data | ✅ page.tsx | **needs-cleanup** — hardcoded data array in component body |

### `src/components/ui/` — UI Primitives

| File | Lines | Purpose | Imported/Used | Quality |
|------|-------|---------|---------------|---------|
| `ui/AuthModal.tsx` | 56 | Modal wrapper (react-aria) that renders `LoginForm` | ✅ Navbar.tsx | **good** — but business logic (cookie setting, `setCookiePreferenceAction`) lives here, not in Navbar |
| `ui/ThemeToggleButton.tsx` | 46 | Theme cycle button with tooltip | ✅ Navbar.tsx | **good** |
| `ui/button.tsx` | 89 | React Aria `Button` + `LinkButton` with CVA variants | ✅ Multiple files | **good** |
| `ui/badge.tsx` | 57 | Badge with CVA variants | ✅ Multiple files | **good** |
| `ui/card.tsx` | 99 | Card primitives | ✅ login.tsx, caching demos | **good** |
| `ui/field.tsx` | 238 | Form field primitives (Field, FieldLabel, FieldGroup, etc.) | ✅ login.tsx | **good** |
| `ui/input.tsx` | 30 | React Aria Input wrapper | ✅ login.tsx | **good** |
| `ui/checkbox.tsx` | 42 | React Aria Checkbox | ✅ login.tsx | **good** |
| `ui/label.tsx` | 32 | React Aria Label | ✅ field.tsx | **good** |
| `ui/separator.tsx` | 24 | React Aria Separator | ✅ field.tsx | **good** |
| `ui/breadcrumb.tsx` | 146 | React Aria Breadcrumb primitives | ✅ breadcrumb-05.tsx | **needs-cleanup** — only used by dead-code component |
| `ui/dropdown-menu.tsx` | 250 | React Aria Menu primitives | ✅ breadcrumb-05.tsx | **needs-cleanup** — only used by dead-code component |
| `ui/sheet.tsx` | 192 | React Aria Sheet/Drawer primitives | ❌ **Never imported anywhere** | **dead-code** |

### `src/components/shadcn-space/` — Shadcnspace Blocks

| File | Lines | Purpose | Imported/Used | Quality |
|------|-------|---------|---------------|---------|
| `shadcn-space/animations/marquee.tsx` | 121 | Marquee animation component | ✅ logo-cloud.tsx | **good** |
| `shadcn-space/blocks/hero-33/index.tsx` | 2 | Stub: `const Hero33Page = () => null` | ✅ hero-33/page.tsx | **dead-code** — renders nothing |
| `shadcn-space/blocks/login-01/login.tsx` | 281 | Full login/signup form with OAuth + email/password | ✅ AuthModal, login-01/page.tsx | **needs-cleanup** — 281 lines, mixes auth API calls with UI |
| `shadcn-space/blocks/logo-cloud-01/logo-cloud.tsx` | 67 | Logo cloud marquee with brand logos | ✅ page.tsx, logo-cloud-01/page.tsx | **good** |
| `shadcn-space/breadcrumb/breadcrumb-05.tsx` | 47 | Breadcrumb with dropdown demo | ❌ **Never imported anywhere** | **dead-code** |

### `src/components/caching/` — Caching Studio Components

| File | Lines | Purpose | Imported/Used | Quality |
|------|-------|---------|---------------|---------|
| `caching/Header.tsx` | 102 | Caching Studio header/nav | ✅ profile, search, shop pages | **good** (Studio concern) |
| `caching/CacheStatusBadge.tsx` | 83 | Colored badge indicating cache strategy | ✅ Multiple caching pages | **good** (Studio concern) |
| `caching/CodeSnippet.tsx` | 66 | Code display with copy button | ✅ Multiple caching pages | **needs-cleanup** — `highlightLines` prop declared but never used/implemented |
| `caching/DataLevelCacheDemo.tsx` | 91 | Demo: data-level caching | ✅ Likely main caching page (not `app/page.tsx`) | **good** (Studio concern) |
| `caching/UILevelCacheDemo.tsx` | 123 | Demo: UI-level caching | ✅ Likely main caching page | **good** (Studio concern) |
| `caching/StreamingUncachedDemo.tsx` | 120 | Demo: streaming uncached data | ✅ Likely main caching page | **good** (Studio concern) |
| `caching/RandomTimestampsDemo.tsx` | 114 | Demo: cached vs uncached timestamps | ✅ Likely main caching page | **good** (Studio concern) |
| `caching/RuntimeApisDemo.tsx` | 137 | Demo: runtime API + cached function | ✅ Likely main caching page | **good** (Studio concern) |
| `caching/StaticShellVisualizer.tsx` | 136 | Demo: PPR layer diagram | ✅ Likely main caching page | **good** (Studio concern) |
| `caching/RevalidationControls.tsx` | 253 | Interactive cache controller | ✅ profile/page.tsx | **good** (Studio concern) |

### `src/assets/` and `src/static/`

| File | Lines | Purpose | Imported/Used | Quality |
|------|-------|---------|---------------|---------|
| `assets/logo/logo.tsx` | 36 | Shadcnspace brand SVG component | ❌ **Never imported anywhere** | **dead-code** |
| `static/appwrite-icon.svg` | 8 | Appwrite icon SVG | ❌ Not imported | **dead-code** |
| `static/nextjs-icon.svg` | 24 | Next.js icon SVG | ❌ Not imported | **dead-code** |

---

## 2. Folder Structure Analysis

### Current Structure

```
src/
  app/
    actions.ts              ← server actions (good placement)
    app.css                 ← global styles (good)
    layout.js               ← ROOT LAYOUT — should be .tsx
    page.tsx
    hero-33/page.tsx        ← demo-only route
    login-01/page.tsx       ← redundant standalone login page
    logo-cloud-01/page.tsx  ← demo-only route
    profile/page.tsx        ← Caching Studio page
    search/page.tsx         ← Caching Studio page
    shop/[slug]/            ← Caching Studio route
  assets/
    logo/logo.tsx           ← DEAD CODE, never imported
  components/
    caching/                ← 10 Caching Studio components (good isolation)
    layout/                 ← 6 app-shell components (OK but mixed concerns)
    shadcn-space/           ← 5 external block components
      animations/
      blocks/hero-33/       ← DEAD STUB
      blocks/login-01/      ← AUTH FEATURE, misplaced here
      blocks/logo-cloud-01/
      breadcrumb/           ← DEAD CODE
    ui/                     ← 13 primitive components (good)
  lib/
    appwrite.js             ← CLIENT SDK (should be .ts, in lib/appwrite/)
    appwrite-server.ts      ← SERVER SDK — COMPLETELY UNUSED
    data-service.ts         ← Caching Studio mock data (misplaced at root lib/)
    utils.ts                ← 1-line re-export
  static/
    appwrite-icon.svg       ← DEAD (never imported)
    nextjs-icon.svg         ← DEAD (never imported)
```

### What Is Misplaced

- `src/lib/appwrite.js` and `src/lib/appwrite-server.ts` should live in `src/lib/appwrite/` as `client.ts` and `server.ts`.
- `src/components/shadcn-space/blocks/login-01/login.tsx` is a feature component (auth), not a generic block; it belongs in `src/components/features/auth/`.
- `src/lib/data-service.ts` is specific to the Caching Studio, not a general service; it should be in `src/lib/api/caching-data.ts` or `src/app/(caching)/lib/`.
- `src/components/layout/ThemeProvider.tsx` contains a custom hook (`useTheme`) — the hook should be in `src/hooks/useTheme.ts` and only the provider stays in `components/`.

### Missing Directories

| Directory | Reason needed |
|-----------|--------------|
| `src/types/` | No shared TypeScript interfaces — `AppwriteUser`, `Theme`, `CacheBadgeType` etc. are all inline |
| `src/hooks/` | `useTheme` is buried in ThemeProvider.tsx; auth state logic in Navbar belongs as `useAuth` |
| `src/constants/` | `CYCLE` (theme array), `THEME_META`, Appwrite endpoint string, cookie key names are all inline |
| `src/config/` | No centralized env config validation/export |
| `src/store/` | ThemeContext is in a component file; as the app grows this needs a dedicated store directory |
| `src/lib/api/` | No service layer — Appwrite calls made directly in component or `appwrite.js` |
| `src/utils/` | No pure utility functions (cn re-export doesn't count) |

---

## 3. Business Logic vs UI Separation

### `components/layout/Navbar.tsx` (274 lines)
**Business logic inside component:**
- `account.get()` — Appwrite API call, lines 42–51 directly in component body
- `account.deleteSession("current")` — session deletion, lines 77–79
- `localStorage.getItem/removeItem("avatar_seed")` — storage reads, lines 32, 55, 82
- `clearCookieAction("avatar_seed")` — server action call, line 84
- `refreshUser()` — manual re-fetch helper, lines 57–61

**Should move to:**
- `src/hooks/useAuth.ts` — a custom hook that encapsulates `user`, `loading`, `logout()`, `refreshUser()`, and syncs with localStorage/cookies
- `src/hooks/useAvatarSeed.ts` — manages avatar seed from localStorage/cookie
- `src/lib/api/auth.ts` — wraps `account.get()`, `account.deleteSession()`

### `components/shadcn-space/blocks/login-01/login.tsx` (281 lines)
**Business logic inside component:**
- `signInWithEmail`, `signUpWithEmail`, `signInWithGithub`, `signInWithGoogle` — all Appwrite auth calls, lines 60–72
- `account.get()` — user fetch after login, line 63
- Error handling and loading state for each auth path

**Should move to:**
- `src/lib/api/auth.ts` — `loginWithEmail(email, password)`, `registerWithEmail(name, email, password)`, `loginWithGithub()`, `loginWithGoogle()`
- Component becomes pure UI that calls these functions

### `components/ui/AuthModal.tsx` (56 lines)
**Business logic inside component:**
- `localStorage.setItem("avatar_seed", userName)` — storage write in modal's `onSuccess`, line 32
- `setCookiePreferenceAction("avatar_seed", ...)` — server action call, line 36

**Should move to:**
- `src/hooks/useAvatarSeed.ts` — `persistSeed(name)` that handles both localStorage and cookie

### `components/layout/FormSection.tsx` (91 lines)
**Business logic inside component:**
- Has a form submission handler (`handleSubmit`) but it does nothing except set a local state — no actual API call. It's a placeholder.

**Recommendation:** When real newsletter API is added, extract to `src/lib/api/newsletter.ts`.

---

## 4. Duplicate and Dead Code

### Dead Code (never imported, never routed to meaningfully)

| Item | Evidence |
|------|----------|
| `src/lib/appwrite-server.ts` | Zero imports found across entire codebase |
| `src/components/ui/sheet.tsx` | Zero imports found across entire codebase |
| `src/components/shadcn-space/breadcrumb/breadcrumb-05.tsx` | Zero imports found |
| `src/components/shadcn-space/blocks/hero-33/index.tsx` | File is `const Hero33Page = () => null` — explicitly renders nothing |
| `src/assets/logo/logo.tsx` | Zero imports found |
| `src/static/appwrite-icon.svg` | Zero imports found |
| `src/static/nextjs-icon.svg` | Zero imports found |
| `databases` export in `lib/appwrite.js` | Exported but never imported anywhere |
| `highlightLines` prop in `CodeSnippet.tsx` | Declared in interface, never used in the component body |

### Duplicate Patterns

1. **Logo markup duplicated across 4 files**: The circular gradient logo (`from-[#FF6D1B] via-[#E11D48] to-[#6B5FFF]` with "W") appears inline in `Navbar.tsx`, `Footer.tsx`, `login.tsx`, and `HeroSection.tsx` (implicitly via section). This should be a single `<BrandLogo />` or `<WebproLogo />` component.

2. **`cn` import path inconsistency**: Most `ui/` files import `cn` directly from `"cn"` (the package). `marquee.tsx` imports from `"@/lib/utils"`. Both resolve to the same thing but it's inconsistent and the `utils.ts` re-export is redundant.

3. **`account.get()` called in two places**: Once in `Navbar.tsx` (on mount), once in `login.tsx` (after auth success). Both could go through a shared auth service.

4. **Hardcoded `"guest-session-42"` default**: Used in `caching/Header.tsx` line 7 and `app/profile/page.tsx` line 13. Should be a constant.

5. **Cookie key `"avatar_seed"` hardcoded in 3 places**: `AuthModal.tsx` line 32, `Navbar.tsx` line 82, `page.tsx` line 12. Should be a constant.

6. **Cookie key `"theme"` hardcoded in 5+ places**: layout.js, ThemeProvider.tsx, profile/page.tsx, RevalidationControls.tsx, caching/Header.tsx. Should be a constant.

---

## 5. Naming Convention Audit

### File Naming
| Convention | Files Following It | Files Violating It |
|-----------|-------------------|-------------------|
| PascalCase for components | `ThemeProvider.tsx`, `AuthModal.tsx`, `Navbar.tsx`, etc. | `marquee.tsx` (lowercase), `logo-cloud.tsx` (kebab-case), `breadcrumb-05.tsx` (kebab with number) |
| Kebab-case for route segments | All `app/` route folders | N/A |
| `.tsx` for React files | Most files | `layout.js` (should be `.tsx`), `appwrite.js` (should be `.ts`) |
| `index.tsx` for folder entry | `hero-33/index.tsx` | Inconsistent — other blocks don't use index files |

### Component/Export Naming
| Issue | File | Example |
|-------|------|---------|
| Default export component name doesn't match filename | `logo-cloud.tsx` | File: `logo-cloud.tsx`, Export: `LogoCloud` and `default LogoCloud` — named differently on page vs component |
| Route page component named generically | `login-01/page.tsx` | `const Page = () => ...` — too generic |
| Route page component named generically | `hero-33/page.tsx` | `const page = () => ...` — all lowercase |
| Route page component named generically | `logo-cloud-01/page.tsx` | `const page = () => ...` — all lowercase |

### Variable/Function Naming
- `CYCLE` in ThemeProvider.tsx — good (screaming snake for constant array)
- `themeScript` in layout.js — good (camelCase for inline script string)
- `handleAuthSuccess`, `handleLogout` — good (verb + noun pattern)
- `roleName` — fine
- `u` used as parameter name in `account.get().then((u) => ...)` — too terse, should be `userData` or `appwriteUser`

---

## 6. Error Handling Audit

### Server Actions (`src/app/actions.ts`)
All 4 server actions are wrapped in try/catch and return `{ success, message }` — **good**.

### Appwrite Client (`src/lib/appwrite.js`)
| Function | Try/Catch | Error Feedback |
|----------|-----------|----------------|
| `signInWithEmail` | ❌ No try/catch — throws raw Appwrite error | Caller must handle |
| `signUpWithEmail` | ❌ No try/catch | Caller must handle |
| `signInWithGithub` | ❌ No try/catch; calls `window.location.origin` — will throw on server | N/A (client-only) |
| `signInWithGoogle` | ❌ No try/catch | N/A (client-only) |

**Verdict**: The client SDK functions don't wrap errors. This is intentional if callers handle them, but inconsistent — `login.tsx` catches errors from these calls, but if a future caller forgets, the error propagates raw.

### Login Form (`login.tsx`)
- `handleSubmit`: has try/catch, sets `error` state, shows error to user — **good**
- `handleGithub` / `handleGoogle`: no try/catch. OAuth redirect is fire-and-forget, but if `createOAuth2Session` throws before redirect, the error is silently swallowed. `setOauthLoading` is set to a loading state but **never reset on failure** (lines 109–113).

### Navbar (`Navbar.tsx`)
- `account.get()` on mount: `.catch(() => setUser(null))` — catches error but **silently ignores it**. Network errors are swallowed.
- `handleLogout`: `account.deleteSession("current")` in try/catch — good, with comment explaining why.
- `localStorage.removeItem` in logout: try/catch — good.
- `clearCookieAction("avatar_seed").catch(() => {})` — silent failure, no feedback. Acceptable for a non-critical path.

### Caching Studio (`lib/data-service.ts`)
All functions are mock-only (simulated delays with `setTimeout`). No real error handling needed. No Appwrite calls here.

### `AuthModal.tsx`
- `setCookiePreferenceAction("avatar_seed", userName).catch(() => {})` — silent failure. Acceptable for non-critical path.
- `localStorage.setItem("avatar_seed", userName)` in try/catch — good.

### `RevalidationControls.tsx`
- All server action calls use async/await with result checking (`res.success`) and update UI log — **good**.

### Summary of Missing Error Handling

| Location | Issue |
|----------|-------|
| `lib/appwrite.js: signInWithGithub/Google` | `oauthLoading` state never reset on failure |
| `Navbar.tsx` `account.get()` on mount | Network errors silently set user to null with no user feedback |
| `FormSection.tsx` `handleSubmit` | Fake submission — no real API call, no error possible, but also no actual function |
| `app/profile/page.tsx` `getCachedUserProfile` | Called inside `<Suspense>` async component — errors will throw to nearest error boundary, but **no `error.tsx`** files exist in any route segment |

---

## 7. State Management Audit

### All `useState` Usage

| File | State Variables | Issue |
|------|----------------|-------|
| `Navbar.tsx` | `user`, `avatarSeed`, `loading`, `dropdownOpen`, `mobileMenuOpen`, `isPending` | **6 state variables in one component** — `user`+`loading`+`avatarSeed` should be in a custom hook `useAuth` |
| `ThemeProvider.tsx` | `theme` | Good — context provider, correct location |
| `login.tsx` | `mode`, `name`, `email`, `password`, `loading`, `oauthLoading`, `error` | **7 state variables** — form state could be consolidated with `useReducer` |
| `RevalidationControls.tsx` | `isPending`, `lastAction`, `actionHistory` | Fine for a demo component |
| `CodeSnippet.tsx` | `copied` | Good — simple local UI state |
| `StaticShellVisualizer.tsx` | `activeTab` | Good — simple local UI state |
| `FormSection.tsx` | `email`, `projectName`, `submitted` | Fine for a placeholder form |

### Prop Drilling Assessment

| Chain | Depth | Issue |
|-------|-------|-------|
| `page.tsx → Navbar` (initialUser, initialAvatarSeed) | 1 level | **Fine** — SSR hydration props, 1 level is acceptable |
| `Navbar → AuthModal → LoginForm → onSuccess callback` | 2 levels | Borderline — callback chain works but is implicit |
| `app/profile/page.tsx → RevalidationControls` (currentTheme, currentSession) | 1 level | Fine |

No state is drilled more than 2 levels. The main concern is `user` state living in `Navbar` while potentially needing to be accessed by other components (e.g., a future `/settings` page). This should be in a React Context (`AuthContext`) now before it becomes a problem.

### State That Should Be Server State

| State | Current Location | Should Be |
|-------|-----------------|-----------|
| Auth user | `useState` in `Navbar.tsx`, initialized from cookie | Remains as is — Next.js 15 cookie pattern is correct |
| Theme | `useState` in `ThemeProvider.tsx` | Correct — kept in context |
| Avatar seed | `useState` in `Navbar.tsx` | Should be part of auth state / `useAuth` hook |

---

## 8. Environment Config Audit

### Variables Actually Used

| Variable | Where Used | In `.env.example`? | Comment |
|----------|-----------|-------------------|---------|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | `appwrite.js:3`, `appwrite-server.ts:10` | ✅ | Public, safe |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | `appwrite.js:4`, `appwrite-server.ts:11` | ✅ | Public, safe |
| `APPWRITE_API_KEY` | `appwrite-server.ts:12` | ❌ **Missing from `.env.example`** | Server-only secret key |
| `APPWRITE_PROJECT_NAME` | Defined in `.env`, not used in code | ❌ Not in `.env.example` | Informational only, not consumed by code |

### Critical Issues

1. **`APPWRITE_API_KEY` is a full admin API key committed to `.env`** with value starting `standard_d86776304a1b37f1002...`. This is a high-privilege key and must be rotated. The `.gitignore` should ensure `.env` is excluded but this key should be considered compromised if the repo is/was public.

2. **`.env.example` is out of date** — only documents 2 of 4 env vars. Missing `APPWRITE_API_KEY` and `APPWRITE_PROJECT_NAME`.

3. **No env validation**: No runtime check that env vars are present. `appwrite.js` calls `.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)` — if undefined, this will silently create an invalid client.

4. **Hardcoded Appwrite endpoint fallback**: None exists — if `NEXT_PUBLIC_APPWRITE_ENDPOINT` is missing, the Appwrite client silently becomes misconfigured.

### Hardcoded Config That Should Be In Constants/Config

| Hardcoded Value | Files | Should Be |
|----------------|-------|-----------|
| `"dark"` default theme | layout.js, ThemeProvider.tsx | `src/constants/theme.ts: DEFAULT_THEME` |
| `"guest-session-42"` | caching/Header.tsx, profile/page.tsx | `src/constants/demo.ts: DEFAULT_SESSION_ID` |
| Cookie names (`"theme"`, `"avatar_seed"`, `"auth_user"`) | layout.js, page.tsx, AuthModal.tsx, Navbar.tsx, ThemeProvider.tsx | `src/constants/cookies.ts: COOKIE_KEYS` |
| `maxAge: 60 * 60 * 24 * 7` | actions.ts | `src/constants/cookies.ts: COOKIE_MAX_AGE` |
| `window.location.origin` in OAuth | appwrite.js | Computed but could be `src/config/app.ts: APP_URL` |
| Google/GitHub icon URLs (`https://images.shadcnspace.com/assets/svgs/...`) | login.tsx | `src/constants/oauth.ts` |

---

## 9. API Structure Audit

### All Appwrite SDK Calls

| Call | File | Client Type | Try/Catch |
|------|------|-------------|-----------|
| `account.createEmailPasswordSession(email, password)` | `lib/appwrite.js` | Client | ❌ |
| `account.create(ID.unique(), email, password, name)` | `lib/appwrite.js` | Client | ❌ |
| `account.createOAuth2Session("github", ...)` | `lib/appwrite.js` | Client | ❌ |
| `account.createOAuth2Session("google", ...)` | `lib/appwrite.js` | Client | ❌ |
| `account.get()` | `lib/appwrite.js` exported; called in `Navbar.tsx:42`, `login.tsx:63` | Client | ✅ by callers |
| `account.deleteSession("current")` | `Navbar.tsx:77` | Client | ✅ |

### Is There a Service Layer? No.

The Appwrite client is imported directly from `lib/appwrite.js` into components. There is no intermediary service layer. The `signIn*` / `signUp*` functions in `appwrite.js` are a rudimentary service layer but they don't handle errors and they live in the client config file, not in a dedicated API module.

### What's Missing

- `src/lib/api/auth.ts` — functions: `getCurrentUser()`, `loginWithEmail()`, `registerWithEmail()`, `loginWithOAuth()`, `logout()`
- No Appwrite database calls are made by the main app (only by `appwrite-server.ts` which is unused). The Caching Studio uses mock data.
- No error type definitions for Appwrite errors (the `AppwriteException` class)

### API Patterns Used (Inconsistently)

| Pattern | Usage |
|---------|-------|
| Direct SDK call in component | `account.get()` in `Navbar.tsx` |
| Wrapper function in lib | `signInWithEmail` in `appwrite.js` |
| No pattern for server-side Appwrite | `appwrite-server.ts` is entirely unused |

---

## 10. Component Modularity Audit

### Components Over 150 Lines

| File | Lines | Issues |
|------|-------|--------|
| `Navbar.tsx` | 274 | Does auth state management, avatar logic, dropdown UI, mobile menu UI, and logout — should be split |
| `login.tsx` | 281 | OAuth auth calls + email form UI + mode switching — should extract auth logic to service |
| `RevalidationControls.tsx` | 253 | Complex but cohesive — OK for a demo component |
| `dropdown-menu.tsx` | 250 | UI primitive — many small exports, fine |
| `field.tsx` | 238 | UI primitive library — many small exports, fine |
| `app/profile/page.tsx` | 163 | Page component — `ProfileDetails` inner component should be extracted to `components/features/caching/` |
| `app/search/page.tsx` | 172 | Page component — `SearchResults` + `SearchResultsSkeleton` should be extracted |
| `StaticShellVisualizer.tsx` | 136 | OK — cohesive demo component |
| `breadcrumb.tsx` | 146 | UI primitive library — fine |
| `sheet.tsx` | 192 | UI primitive library — fine (but unused) |

### Repeated UI Patterns That Should Be Extracted

1. **Brand Logo `"W"` gradient circle** — appears in `Navbar.tsx`, `Footer.tsx`, `login.tsx`. Should be `<WebproLogo size="sm|md" />`.

2. **Section header pattern** — "pill badge + h2 + description" used in `PhotoSection.tsx`, `FormSection.tsx`, `HeroSection.tsx`. Could be `<SectionHeader badge="..." title="..." description="..." />`.

3. **Frosted pill badge** — `inline-flex items-center gap-2 rounded-full border border-[rgba(39,39,42,0.8)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs text-[#d4d4d8]` appears in 5+ components. Should use the existing `<Badge variant="outline" />` with correct className.

4. **Online status dot** — green dot `bg-[#34D399]` indicating status appears in Navbar (avatar), Footer ("All systems operational"), FormSection (success badge). Should be `<StatusDot />`.

---

## 11. Proposed Folder Structure

Every file mapped to its new location. Files marked `(DELETE)` are dead code.

```
src/
  app/                          # Next.js routes only
    (main)/                     # Route group for landing app
      page.tsx                  # ← src/app/page.tsx (unchanged)
      layout.tsx                # ← src/app/layout.js (rename .js→.tsx)
    (caching)/                  # Route group for Caching Studio
      layout.tsx                # ← new: wraps caching pages with Header
      page.tsx                  # ← new: Caching Studio overview (currently missing main page)
      profile/page.tsx          # ← src/app/profile/page.tsx
      search/page.tsx           # ← src/app/search/page.tsx
      shop/[slug]/
        layout.tsx              # ← src/app/shop/[slug]/layout.tsx
        page.tsx                # ← src/app/shop/[slug]/page.tsx
    hero-33/                    # (DELETE) — stub route renders nothing
    login-01/                   # (DELETE) — redundant with modal
    logo-cloud-01/              # (DELETE) — demo-only with no nav link
    actions.ts                  # ← src/app/actions.ts (unchanged)
    app.css                     # ← src/app/app.css (unchanged)

  components/
    ui/                         # Pure presentational, no business logic
      button.tsx                # ← unchanged
      badge.tsx                 # ← unchanged
      card.tsx                  # ← unchanged
      checkbox.tsx              # ← unchanged
      dropdown-menu.tsx         # ← unchanged (keep: used by breadcrumb if breadcrumb is kept)
      field.tsx                 # ← unchanged
      input.tsx                 # ← unchanged
      label.tsx                 # ← unchanged
      separator.tsx             # ← unchanged
      breadcrumb.tsx            # ← unchanged (keep: used by breadcrumb-05 if kept)
      sheet.tsx                 # (DELETE or KEEP if mobile nav moves here)
      WebproLogo.tsx            # ← NEW: extracted brand logo from Navbar/Footer/login
      StatusDot.tsx             # ← NEW: reusable status indicator dot
      ThemeToggleButton.tsx     # ← src/components/ui/ThemeToggleButton.tsx
      
    layout/                     # App shell components
      Navbar.tsx                # ← src/components/layout/Navbar.tsx (refactored, slim)
      Footer.tsx                # ← src/components/layout/Footer.tsx
      HeroSection.tsx           # ← src/components/layout/HeroSection.tsx
      PhotoSection.tsx          # ← src/components/layout/PhotoSection.tsx
      FormSection.tsx           # ← src/components/layout/FormSection.tsx
      
    features/
      auth/
        AuthModal.tsx           # ← src/components/ui/AuthModal.tsx
        LoginForm.tsx           # ← src/components/shadcn-space/blocks/login-01/login.tsx
      theme/
        ThemeProvider.tsx       # ← src/components/layout/ThemeProvider.tsx
      caching/
        Header.tsx              # ← src/components/caching/Header.tsx
        CacheStatusBadge.tsx    # ← src/components/caching/CacheStatusBadge.tsx
        CodeSnippet.tsx         # ← src/components/caching/CodeSnippet.tsx
        DataLevelCacheDemo.tsx  # ← src/components/caching/DataLevelCacheDemo.tsx
        UILevelCacheDemo.tsx    # ← src/components/caching/UILevelCacheDemo.tsx
        StreamingUncachedDemo.tsx  # ← src/components/caching/StreamingUncachedDemo.tsx
        RandomTimestampsDemo.tsx   # ← src/components/caching/RandomTimestampsDemo.tsx
        RuntimeApisDemo.tsx     # ← src/components/caching/RuntimeApisDemo.tsx
        StaticShellVisualizer.tsx  # ← src/components/caching/StaticShellVisualizer.tsx
        RevalidationControls.tsx   # ← src/components/caching/RevalidationControls.tsx
      shared/
        Marquee.tsx             # ← src/components/shadcn-space/animations/marquee.tsx
        LogoCloud.tsx           # ← src/components/shadcn-space/blocks/logo-cloud-01/logo-cloud.tsx
        
  hooks/
    useTheme.ts                 # ← extracted from ThemeProvider.tsx: useTheme() hook
    useAuth.ts                  # ← NEW: wraps account.get(), logout, avatar seed sync
    useAvatarSeed.ts            # ← NEW: manages avatar_seed in localStorage + cookie

  types/
    auth.ts                     # AppwriteUser, AuthState interfaces
    theme.ts                    # Theme type ("dark" | "light" | "cyberpunk")
    cache.ts                    # CacheBadgeType, BlogPost, UserItem, ProductItem, StockTickerItem

  lib/
    appwrite/
      client.ts                 # ← src/lib/appwrite.js (rename, add TypeScript)
      server.ts                 # ← src/lib/appwrite-server.ts (keep, but wire up)
    api/
      auth.ts                   # NEW: getCurrentUser, loginWithEmail, registerWithEmail, loginWithOAuth, logout
      caching.ts                # ← src/lib/data-service.ts (renamed, moved)
    utils.ts                    # ← src/lib/utils.ts (keep for cn re-export, or delete and import cn directly)

  constants/
    cookies.ts                  # COOKIE_KEYS, COOKIE_MAX_AGE
    theme.ts                    # DEFAULT_THEME, THEME_CYCLE, THEME_META
    demo.ts                     # DEFAULT_SESSION_ID (Caching Studio constants)
    oauth.ts                    # OAUTH_ICON_URLS

  config/
    env.ts                      # Validated env var exports with clear error on missing vars

  store/
    AuthContext.tsx              # NEW: React Context for auth state (user, loading, logout)
```

### Files to Delete

```
src/lib/appwrite-server.ts                            ← Never used
src/components/ui/sheet.tsx                           ← Never used
src/components/shadcn-space/blocks/hero-33/index.tsx  ← Null stub
src/components/shadcn-space/breadcrumb/breadcrumb-05.tsx ← Never imported
src/assets/logo/logo.tsx                              ← Never imported
src/static/appwrite-icon.svg                          ← Never imported
src/static/nextjs-icon.svg                            ← Never imported
src/app/hero-33/page.tsx                              ← Routes to null component
src/app/login-01/page.tsx                             ← Redundant with modal
src/app/logo-cloud-01/page.tsx                        ← Demo-only orphan
```

---

## 12. Implementation Order

This order minimizes breakage by establishing foundations first, then wiring up consumers.

### Phase 1: Foundation (no breakage risk)
1. **Create `src/types/`** — define `AuthUser` (rename `AppwriteUser`), `Theme`, `CacheBadgeType`, data interfaces from `data-service.ts`. No files change, just new files added.
2. **Create `src/constants/`** — extract `COOKIE_KEYS`, `DEFAULT_THEME`, `THEME_CYCLE`, `THEME_META`, `DEFAULT_SESSION_ID`. Update all consumers in a single pass.
3. **Create `src/config/env.ts`** — validates and exports env vars with runtime errors. Update `lib/appwrite.js` and `lib/appwrite-server.ts` to import from here.
4. **Fix `src/app/layout.js` → `layout.tsx`** — convert to TypeScript, extract `themeScript` string to a constant.

### Phase 2: Service Layer
5. **Create `src/lib/appwrite/client.ts`** — TypeScript conversion of `appwrite.js` with proper types. Keep same exports temporarily so existing imports don't break immediately.
6. **Create `src/lib/api/auth.ts`** — wraps all Appwrite auth calls (`getCurrentUser`, `loginWithEmail`, `registerWithEmail`, `loginWithOAuth`, `logout`). Add try/catch at this layer.
7. **Move `lib/data-service.ts` → `lib/api/caching.ts`** — rename only, no code changes.

### Phase 3: Hooks
8. **Create `src/hooks/useTheme.ts`** — move `useTheme()` out of `ThemeProvider.tsx`. Update `ThemeToggleButton.tsx` and `Navbar.tsx` to import from new path.
9. **Create `src/hooks/useAuth.ts`** — using `lib/api/auth.ts`. Replaces the inline auth logic in `Navbar.tsx`.
10. **Create `src/hooks/useAvatarSeed.ts`** — extract avatar seed logic from `Navbar.tsx` and `AuthModal.tsx`.

### Phase 4: Components
11. **Create `src/components/ui/WebproLogo.tsx`** — extract shared logo markup. Update `Navbar.tsx`, `Footer.tsx`, `login.tsx`.
12. **Move `login.tsx` → `components/features/auth/LoginForm.tsx`** — update import in `AuthModal.tsx`.
13. **Move `AuthModal.tsx` → `components/features/auth/AuthModal.tsx`** — update import in `Navbar.tsx`.
14. **Move `ThemeProvider.tsx` → `components/features/theme/ThemeProvider.tsx`** — update import in `layout.tsx`.
15. **Refactor `Navbar.tsx`** — replace inline auth/avatar logic with `useAuth()` and `useAvatarSeed()` hooks. Target: under 150 lines.
16. **Move caching components** → `components/features/caching/`. Update all page-level imports.
17. **Move marquee + logo-cloud** → `components/features/shared/`. Update `page.tsx` imports.

### Phase 5: Route Cleanup
18. **Create route groups** — `app/(main)/` and `app/(caching)/`. Move pages into groups.
19. **Delete dead code** — `sheet.tsx`, `appwrite-server.ts` (unless wired up), hero-33, login-01, logo-cloud-01 routes, breadcrumb-05, logo.tsx, static SVGs.

### Phase 6: Hardcoded Values → CSS Variables
20. **Replace inline hex colors in components** — `Navbar.tsx`, `Footer.tsx`, `FormSection.tsx`, `PhotoSection.tsx`, `login.tsx`. Use existing CSS custom properties from `app.css` (`--border`, `--background`, `--primarylw`, `--muted-foreground`, etc.) where possible, or add new tokens.

### Phase 7: Error Handling + Docs
21. **Add `error.tsx` files** to routes that make async Appwrite calls. Add loading.tsx where missing.
22. **Fix `oauthLoading` state** in `login.tsx` — reset on failure.
23. **Add `.env.example` entries** for `APPWRITE_API_KEY` and `APPWRITE_PROJECT_NAME`.
24. **Update `AuthContext` / `store/`** — if auth state needs to be accessed by multiple components beyond Navbar.
25. **Add JSDoc comments** to `lib/api/auth.ts` and `types/*.ts`.

---

## Summary of Key Findings

| Category | Critical Issues |
|----------|----------------|
| Dead code | 7 files fully dead (`sheet.tsx`, `appwrite-server.ts`, `breadcrumb-05.tsx`, `hero-33/index.tsx`, `logo.tsx`, 2 SVGs) |
| Security | `APPWRITE_API_KEY` committed to `.env` (full admin key); missing from `.env.example` |
| Type safety | Root `layout.js` is plain JS; `appwrite.js` is plain JS — no TypeScript |
| Architecture | No hooks/, no types/, no constants/, no config/, no store/ directories |
| Business logic in UI | `Navbar.tsx` (274 lines) and `login.tsx` (281 lines) mix API calls with UI rendering |
| Duplicate code | Brand logo markup copy-pasted in 3+ files |
| Hardcoded config | Cookie key names, default theme, color hex values scattered across 10+ files |
| Error handling | Missing `error.tsx` boundaries; OAuth loading state never reset on failure |
| Unused server SDK | `appwrite-server.ts` has an admin key wired up but zero callers |
