# Web App Theme Architecture & Looseleaf Design System Plan

> **Specification Document**: Portfolio Multi-Theme System & Looseleaf Hand-Drawn Design Language  
> **Source Inspiration**: [Looseleaf by Kevin Ngo](https://kevintngo.github.io/looseleaf/#/components) & [Lightswind UI](https://lightswind.com/)  
> **Aligned Architecture Decisions**: Confirmed via `/grill-me` design tree  
> **Target Codebase**: Next.js App Router, Tailwind CSS v4, shadcn/ui, TypeScript  

---

## 1. Executive Summary & Vision

The portfolio web application supports four distinct theme modes:
1. **Light Space**: Clean, modern high-key white and neutral zinc aesthetic (`#FAFAFB`).
2. **Obsidian Dark**: Pure black `#000000` with subtle zinc borders and high-contrast typography.
3. **Cyberpunk**: High-octane dark navy (`#060810`), neon blue glowing borders, and rose-red `#E11D48` accents.
4. **Looseleaf**: A tactile, hand-drawn sketchbook universe inspired by Kevin Ngo's [Looseleaf UI](https://kevintngo.github.io/looseleaf/#/components). Featuring warm parchment paper backgrounds, a subtle 24px notebook graph grid, authentic 2px charcoal ink outlines, wobbly hand-drawn border radii, tactile drop-shadows, and full hand-drawn typography (via `Caveat` / `Patrick Hand`).

---

## 2. Cross-Theme Token Matrix

| Design Token | Light Space | Obsidian Dark | Cyberpunk Neon | Looseleaf Paper |
| :--- | :--- | :--- | :--- | :--- |
| **`--background`** | `#FAFAFB` (Soft White) | `#000000` (Pitch Black) | `#060810` (Deep Space Navy) | `#FBF9F3` (Warm Parchment Paper) |
| **`--foreground`** | `#09090B` (Jet Black) | `#F4F4F5` (Bright Off-White) | `#F4F4F5` (Bright White) | `#1C1917` (Charcoal Calligraphy Ink) |
| **`--card`** | `#FFFFFF` (Pure White) | `#0D0D0F` (Dark Obsidian) | `#0C1020` (Midnight Card) | `#FFFDF8` (Sketch Sheet Ivory) |
| **`--card-foreground`**| `#09090B` | `#F4F4F5` | `#F4F4F5` | `#1C1917` |
| **`--popover`** | `#FFFFFF` | `#09090B` | `#0C1020` | `#FFFDF8` |
| **`--primary`** | `#09090B` (Dark Zinc) | `#FFFFFF` (Solid White) | `#E11D48` (Vivid Crimson) | `#1C1917` (Ink Black Stamp) |
| **`--primary-foreground`**| `#FFFFFF` | `#09090B` | `#FFFFFF` | `#FBF9F3` |
| **`--secondary`** | `#F4F4F5` (Subtle Zinc) | `#18181B` (Zinc Charcoal) | `#121829` (Subtle Navy) | `#F4EFE6` (Recycled Kraft Paper) |
| **`--secondary-foreground`**| `#18181B` | `#F4F4F5` | `#F4F4F5` | `#292524` |
| **`--muted`** | `#F4F4F5` | `#18181B` | `#121829` | `#F3ECE0` (Aged Paper Muted) |
| **`--muted-foreground`**| `#71717A` (Mid Zinc) | `#A1A1AA` (Soft Grey) | `#818CF8` (Electric Lavender)| `#78716C` (Graphite Pencil Grey) |
| **`--accent`** | `#E4E4E7` | `#27272A` | `#1E293B` | `#E7DFD3` (Pressed Fibre Accent) |
| **`--accent-foreground`**| `#09090B` | `#FFFFFF` | `#38BDF8` (Sky Blue) | `#1C1917` |
| **`--destructive`** | `#E11D48` | `#E11D48` | `#F43F5E` | `#DC2626` (Red Ink Correction) |
| **`--border`** | `#E4E4E7` (Hairline Grey) | `rgba(39, 39, 42, 0.8)` | `rgba(77, 138, 255, 0.3)` | `#2D2A26` (Solid Pen Stroke 2px) |
| **`--input`** | `#E4E4E7` | `rgba(39, 39, 42, 0.9)` | `rgba(77, 138, 255, 0.35)` | `#2D2A26` |
| **`--ring`** | `#3B82F6` | `#3B82F6` | `#E11D48` | `#2563EB` (Ballpoint Blue Ring) |
| **`--radius`** | `0.5rem` (8px standard) | `0.5rem` (8px standard) | `0.5rem` (8px standard) | `255px 15px 225px 15px/15px 225px 15px 255px` (Wobbly hand-drawn edge) |

---

## 3. Looseleaf Aesthetics & Structural Mechanics

### 3.1 Notebook Grid & Paper Texture
```css
[data-theme="looseleaf"] body {
  background-color: var(--background);
  background-image: 
    linear-gradient(rgba(37, 99, 235, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(37, 99, 235, 0.05) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

### 3.2 Hand-Drawn Wobbly Borders & Ink Drop-Shadows
- **Cards**: `border: 2px solid #2D2A26; border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px; box-shadow: 3px 3px 0px 0px #1C1917;`
- **Buttons**: Tactile ink stamp click action: `active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#1C1917]`.
- **Badges & Pills**: Hand-drawn pill borders with slight tape/highlighter tinting.

### 3.3 Typography Stack (Zero-Shift Google Fonts)
- Preloaded in `layout.tsx` via `next/font/google`:
  - Font: `Caveat` (`display: "swap"`, `subsets: ["latin"]`)
  - CSS Variable: `--font-handwriting`
- In `looseleaf` mode, `--font-sans` and `--font-heading` dynamically map to `--font-handwriting`, transforming all headings, buttons, navigation items, and body text into a unified hand-sketched notebook style.

---

## 4. Implementation Steps

1. **`portfolio/src/app/layout.tsx`**:
   - Import `Caveat` from `next/font/google` and attach variable `--font-handwriting` to `html` or `body`.
   - Update theme initialization cookie parser to accept `looseleaf`.
2. **`portfolio/src/components/layout/ThemeProvider.tsx`**:
   - Update `Theme` type: `"dark" | "light" | "cyberpunk" | "looseleaf"`.
   - Update `CYCLE`: `["light", "dark", "cyberpunk", "looseleaf"]`.
   - Update `applyTheme` to handle `looseleaf` class and `data-theme="looseleaf"`.
3. **`portfolio/src/components/ui/ThemeToggleButton.tsx`**:
   - Import `NotebookPen` from `lucide-react`.
   - Add `looseleaf` metadata and cycle target.
4. **`portfolio/src/app/app.css`**:
   - Add `@custom-variant looseleaf (&:where([data-theme="looseleaf"], [data-theme="looseleaf"] *, .looseleaf, .looseleaf *));`.
   - Define `[data-theme="looseleaf"]` CSS variables, paper grid pattern, wobbly borders, and ink shadows.
5. **`portfolio/components.json`**:
   - Add `"@looseleaf": "https://kevintngo.github.io/looseleaf/r/{name}.json"` in `registries`.
6. **Validation**:
   - Verify TypeScript compilation (`tsc --noEmit`).
   - Verify SSR hydration and anti-flash behavior.
