# Design reference

Source: https://lightswind.com/
Page: Lightswind UI – Beautifully Animated React Components & Modern UI Kits

Measured from 514 rendered elements at 1536 x 791px. This is a sample of the current document and state, not the original design source.

## Color palette

Only observed CSS colors are listed. Usage labels describe where a color was found. Hex is an sRGB preview; retain the original CSS value for its color space and transparency.

Usage | Original CSS value | sRGB hex | Observed root properties | Occurrences
--- | --- | --- | --- | ---
Text | rgb(244, 244, 245) | #F4F4F5 |  | 92
Text | rgb(161, 161, 170) | #A1A1AA |  | 66
Text | rgb(255, 255, 255) | #FFFFFF | --lw-primary-color, --tw-ring-offset-color, --footer-card-link-hover, --footer-card-btn-bg, --footer-card-heading | 15
Text | rgb(113, 113, 122) | #71717A | --footer-card-subtle | 14
Text | rgba(255, 255, 255, 0.6) | #FFFFFF99 |  | 5
Text | rgba(255, 255, 255, 0.8) | #FFFFFFCC |  | 4
Text | rgb(0, 0, 0) | #000000 | --footer-card-bg-gradient | 2
Text | rgb(251, 191, 36) | #FBBF24 |  | 2
Text | rgb(166, 166, 166) | #A6A6A6 |  | 2
Text | rgb(245, 245, 245) | #F5F5F5 |  | 1
Text | rgb(96, 165, 250) | #60A5FA |  | 1
Text | rgba(255, 255, 255, 0.75) | #FFFFFFBF |  | 1
Text | rgb(209, 213, 219) | #D1D5DB |  | 1
Text | rgb(243, 244, 246) | #F3F4F6 |  | 1
Text | rgb(9, 9, 11) | #09090B | --footer-card-btn-text | 1
Text | rgb(225, 29, 72) | #E11D48 | --primarylw, --island-theme | 1
Surface | rgba(24, 24, 27, 0.9) | #18181BE6 |  | 81
Surface | rgb(0, 0, 0) | #000000 | --footer-card-bg-gradient | 8
Surface | rgb(251, 191, 36) | #FBBF24 |  | 4
Surface | rgb(255, 255, 255) | #FFFFFF | --lw-primary-color, --tw-ring-offset-color, --footer-card-link-hover, --footer-card-btn-bg, --footer-card-heading | 2
Surface | rgb(52, 211, 153) | #34D399 |  | 1
Surface | rgba(0, 0, 0, 0.3) | #0000004D |  | 1
Surface | rgb(59, 130, 246) | #3B82F6 |  | 1
Surface | color(srgb 0.882353 0.113725 0.282353) | #E11D48 |  | 1
Surface | color(srgb 0.882353 0.113725 0.282353 / 0.15) | #E11D4826 |  | 1
Surface | rgba(59, 130, 246, 0.15) | #3B82F626 |  | 1
Surface | rgba(24, 24, 27, 0.3) | #18181B4D |  | 1
Surface | rgba(255, 255, 255, 0.06) | #FFFFFF0F | --footer-pill-bg | 1
Surface | rgba(9, 9, 11, 0.5) | #09090B80 |  | 1
Surface | rgb(23, 23, 23) | #171717 |  | 1
Border | rgba(39, 39, 42, 0.8) | #27272ACC | --footer-card-border, --footer-card-box-border, --footer-pill-border | 82
Border | rgb(26, 26, 26) | #1A1A1A |  | 6
Border | rgb(39, 39, 42) | #27272A |  | 2
Border | rgba(59, 130, 246, 0.3) | #3B82F64D |  | 1
Border | rgb(31, 41, 55) | #1F2937 |  | 1
Border | rgb(55, 65, 81) | #374151 |  | 1
Border | rgba(39, 39, 42, 0.9) | #27272AE6 |  | 1
Gradient | rgb(255, 255, 255) | #FFFFFF | --lw-primary-color, --tw-ring-offset-color, --footer-card-link-hover, --footer-card-btn-bg, --footer-card-heading | 1
Gradient | rgba(255, 255, 255, 0.6) | #FFFFFF99 |  | 1
Gradient | rgb(255, 109, 27) | #FF6D1B |  | 1
Gradient | rgb(255, 238, 85) | #FFEE55 |  | 1
Gradient | rgb(91, 255, 137) | #5BFF89 |  | 1
Gradient | rgb(77, 138, 255) | #4D8AFF |  | 1
Gradient | rgb(107, 95, 255) | #6B5FFF |  | 1
Gradient | rgb(255, 100, 249) | #FF64F9 |  | 1
Gradient | rgb(255, 101, 101) | #FF6565 |  | 1
Icon | rgba(255, 255, 255, 0.85) | #FFFFFFD9 |  | 27
Icon | rgba(255, 255, 255, 0.8) | #FFFFFFCC |  | 8
Icon | rgb(161, 161, 170) | #A1A1AA |  | 6
Icon | rgb(113, 113, 122) | #71717A | --footer-card-subtle | 3
Icon | rgb(255, 255, 255) | #FFFFFF | --lw-primary-color, --tw-ring-offset-color, --footer-card-link-hover, --footer-card-btn-bg, --footer-card-heading | 2
Icon | rgba(255, 255, 255, 0.6) | #FFFFFF99 |  | 2
Icon | rgb(96, 165, 250) | #60A5FA |  | 2
Icon | rgb(0, 0, 0) | #000000 | --footer-card-bg-gradient | 2
Icon | rgb(243, 244, 246) | #F3F4F6 |  | 1

## Typography

Role | Family | Size | Weight | Line height | Tracking | Text transform
--- | --- | --- | --- | --- | --- | ---
Heading | geistSans, "geistSans Fallback" | 48px | 700 | 48px | -1.2px | none
Section heading | geistSans, "geistSans Fallback" | 48px | 700 | 48px | -2.4px | none
Subheading | geistSans, "geistSans Fallback" | 14px | 600 | 20px | normal | none
Body | geistSans, "geistSans Fallback" | 18px | 400 | 28px | normal | none
Small text | geistSans, "geistSans Fallback" | 12px | 400 | 16px | normal | none
Button | geistSans, "geistSans Fallback" | 16px | 400 | 24px | normal | none

## Spacing

Value | Occurrences
--- | ---
2px | 2
4px | 18
6px | 2
8px | 57
10px | 5
12px | 328
14px | 2
16px | 7
20px | 4
24px | 7
32px | 2
74.7px | 1
74.7125px | 1
160px | 6
193.3px | 2
330.8px | 2

## Layout gaps

Value | Occurrences
--- | ---
4px | 10
6px | 6
8px | 14
16px | 8

## Corner radii

Value | Occurrences
--- | ---
6px | 4
12px | 16
24px | 324
9999px | 68

## Shadows

Value | Occurrences
--- | ---
rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(59, 130, 246, 0.8) 0px 0px 6px 0px | 1
rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px | 1
rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(245, 158, 11, 0.2) 0px 4px 6px -1px, rgba(245, 158, 11, 0.2) 0px 2px 4px -2px | 1
rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px | 1

## Motion durations

Value | Occurrences
--- | ---
0.3s | 171
0.15s | 145
0.2s | 2
2s | 1

## Motion easing

Value | Occurrences
--- | ---
cubic-bezier(0, 0, 0.2, 1) | 162
cubic-bezier(0.4, 0, 0.2, 1) | 148
ease | 8
linear | 1

### Accessible keyframe names

- neon-pulse
- neon-bounce
- tiny-bar-loader-anime
- GlassLoginAnimateBg
- GradientAnimatedBgTurn
- marquee-right-left
- bg-spin
- skeletonLoader
- skeletonBarsLoader
- AnimatedCartBtntruck
- AnimatedCartBtnbox
- AnimatedCartBtntxt1

## Component recipes

Computed styles for the captured state. Selectors identify sampled elements; text and placeholders come from the page. Form values are excluded. These style specimens do not reconstruct child markup or uncaptured interaction states.

### Button 1

Observed text or placeholder: Components

```css
button.flex.items-center {
  align-items: center;
  backdrop-filter: none;
  background-color: rgba(0, 0, 0, 0);
  background-image: none;
  border-bottom-color: rgb(229, 231, 235);
  border-bottom-style: solid;
  border-bottom-width: 0px;
  border-left-color: rgb(229, 231, 235);
  border-left-style: solid;
  border-left-width: 0px;
  border-radius: 0px;
  border-right-color: rgb(229, 231, 235);
  border-right-style: solid;
  border-right-width: 0px;
  border-top-color: rgb(229, 231, 235);
  border-top-style: solid;
  border-top-width: 0px;
  box-shadow: none;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  font-family: geistSans, "geistSans Fallback";
  font-size: 14px;
  font-weight: 500;
  gap: 4px;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 20px;
  opacity: 1;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  text-transform: none;
}
```

Ancestor backgrounds (outermost first):

Layer | Background color | Background image | Opacity
--- | --- | --- | ---
1 | rgb(0, 0, 0) | none | 1
2 | rgba(9, 9, 11, 0.5) | none | 1

### Button 2

Observed text or placeholder: Login

```css
button.whitespace-nowrap.ring-offset-background {
  align-items: center;
  backdrop-filter: none;
  background-color: rgb(255, 255, 255);
  background-image: none;
  border-bottom-color: rgb(229, 231, 235);
  border-bottom-style: solid;
  border-bottom-width: 0px;
  border-left-color: rgb(229, 231, 235);
  border-left-style: solid;
  border-left-width: 0px;
  border-radius: 9999px;
  border-right-color: rgb(229, 231, 235);
  border-right-style: solid;
  border-right-width: 0px;
  border-top-color: rgb(229, 231, 235);
  border-top-style: solid;
  border-top-width: 0px;
  box-shadow: none;
  color: rgb(0, 0, 0);
  display: flex;
  font-family: geistSans, "geistSans Fallback";
  font-size: 12px;
  font-weight: 600;
  gap: 6px;
  justify-content: center;
  letter-spacing: normal;
  line-height: 16px;
  opacity: 1;
  padding-bottom: 0px;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 0px;
  text-transform: none;
}
```

Ancestor backgrounds (outermost first):

Layer | Background color | Background image | Opacity
--- | --- | --- | ---
1 | rgb(0, 0, 0) | none | 1
2 | rgba(9, 9, 11, 0.5) | none | 1

### Button 3

Observed text or placeholder: Browse Components

```css
button.btn-gradient.relative {
  align-items: center;
  backdrop-filter: none;
  background-color: rgb(255, 255, 255);
  background-image: none;
  border-bottom-color: rgba(0, 0, 0, 0);
  border-bottom-style: solid;
  border-bottom-width: 2.4px;
  border-left-color: rgba(0, 0, 0, 0);
  border-left-style: solid;
  border-left-width: 2.4px;
  border-radius: 9999px;
  border-right-color: rgba(0, 0, 0, 0);
  border-right-style: solid;
  border-right-width: 2.4px;
  border-top-color: rgba(0, 0, 0, 0);
  border-top-style: solid;
  border-top-width: 2.4px;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px;
  color: rgb(0, 0, 0);
  display: flex;
  font-family: geistSans, "geistSans Fallback";
  font-size: 16px;
  font-weight: 500;
  gap: normal;
  justify-content: center;
  letter-spacing: -0.2px;
  line-height: 24px;
  opacity: 1;
  padding-bottom: 8px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 8px;
  text-transform: none;
}
```

Ancestor backgrounds (outermost first):

Layer | Background color | Background image | Opacity
--- | --- | --- | ---
1 | rgb(0, 0, 0) | none | 1
2 | rgb(0, 0, 0) | none | 1
3 | rgb(0, 0, 0) | none | 1

### Input 1

Observed text or placeholder: Enter your email

```css
input.footer-newsletter-input.w-full {
  align-items: normal;
  backdrop-filter: none;
  background-color: rgba(255, 255, 255, 0.06);
  background-image: none;
  border-bottom-color: rgba(39, 39, 42, 0.9);
  border-bottom-style: solid;
  border-bottom-width: 0.8px;
  border-left-color: rgba(39, 39, 42, 0.9);
  border-left-style: solid;
  border-left-width: 0.8px;
  border-radius: 9999px;
  border-right-color: rgba(39, 39, 42, 0.9);
  border-right-style: solid;
  border-right-width: 0.8px;
  border-top-color: rgba(39, 39, 42, 0.9);
  border-top-style: solid;
  border-top-width: 0.8px;
  box-shadow: none;
  color: rgb(255, 255, 255);
  display: inline-block;
  font-family: geistSans, "geistSans Fallback";
  font-size: 13px;
  font-weight: 500;
  gap: normal;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 24px;
  opacity: 1;
  padding-bottom: 8px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 8px;
  text-transform: none;
}
```

Ancestor backgrounds (outermost first):

Layer | Background color | Background image | Opacity
--- | --- | --- | ---
1 | rgb(0, 0, 0) | none | 1
2 | rgb(0, 0, 0) | none | 1
3 | rgba(255, 255, 255, 0.04) | none | 1

### Card 1

Observed text or placeholder: Beeper

```css
article.group.relative {
  align-items: normal;
  backdrop-filter: none;
  background-color: rgb(23, 23, 23);
  background-image: none;
  border-bottom-color: rgb(229, 231, 235);
  border-bottom-style: solid;
  border-bottom-width: 0px;
  border-left-color: rgb(229, 231, 235);
  border-left-style: solid;
  border-left-width: 0px;
  border-radius: 12px;
  border-right-color: rgb(229, 231, 235);
  border-right-style: solid;
  border-right-width: 0px;
  border-top-color: rgb(229, 231, 235);
  border-top-style: solid;
  border-top-width: 0px;
  box-shadow: none;
  color: rgb(255, 255, 255);
  display: block;
  font-family: geistSans, "geistSans Fallback";
  font-size: 16px;
  font-weight: 400;
  gap: normal;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 24px;
  opacity: 1;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  text-transform: none;
}
```

Ancestor backgrounds (outermost first):

Layer | Background color | Background image | Opacity
--- | --- | --- | ---
1 | rgb(0, 0, 0) | none | 1
2 | rgb(0, 0, 0) | none | 1
3 | rgb(0, 0, 0) | none | 1
4 | rgb(0, 0, 0) | none | 1
5 | rgba(0, 0, 0, 0.6) | none | 1

### Card 2

Observed text or placeholder: Subscribe Subscribe to our newsletter and join the growing Lightswind developer community. Lightswind UI A PRODUCT BY MU

```css
footer.footer-card.bg-background {
  align-items: normal;
  backdrop-filter: none;
  background-color: rgb(0, 0, 0);
  background-image: none;
  border-bottom-color: rgb(255, 255, 255);
  border-bottom-style: none;
  border-bottom-width: 0px;
  border-left-color: rgb(255, 255, 255);
  border-left-style: none;
  border-left-width: 0px;
  border-radius: 0px;
  border-right-color: rgb(255, 255, 255);
  border-right-style: none;
  border-right-width: 0px;
  border-top-color: rgba(39, 39, 42, 0.8);
  border-top-style: solid;
  border-top-width: 0.8px;
  box-shadow: none;
  color: rgb(255, 255, 255);
  display: block;
  font-family: geistSans, "geistSans Fallback";
  font-size: 16px;
  font-weight: 400;
  gap: normal;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 24px;
  opacity: 1;
  padding-bottom: 0px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 0px;
  text-transform: none;
}
```

Ancestor backgrounds (outermost first):

Layer | Background color | Background image | Opacity
--- | --- | --- | ---
1 | rgb(0, 0, 0) | none | 1

### Card 3

Observed text or placeholder: Subscribe Subscribe to our newsletter and join the growing Lightswind developer community.

```css
div.footer-newsletter-card.p-4 {
  align-items: normal;
  backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.04);
  background-image: none;
  border-bottom-color: rgba(39, 39, 42, 0.8);
  border-bottom-style: solid;
  border-bottom-width: 0.8px;
  border-left-color: rgba(39, 39, 42, 0.8);
  border-left-style: solid;
  border-left-width: 0.8px;
  border-radius: 20px;
  border-right-color: rgba(39, 39, 42, 0.8);
  border-right-style: solid;
  border-right-width: 0.8px;
  border-top-color: rgba(39, 39, 42, 0.8);
  border-top-style: solid;
  border-top-width: 0.8px;
  box-shadow: none;
  color: rgb(255, 255, 255);
  display: block;
  font-family: geistSans, "geistSans Fallback";
  font-size: 16px;
  font-weight: 400;
  gap: normal;
  justify-content: normal;
  letter-spacing: normal;
  line-height: 24px;
  opacity: 1;
  padding-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  text-transform: none;
}
```

Ancestor backgrounds (outermost first):

Layer | Background color | Background image | Opacity
--- | --- | --- | ---
1 | rgb(0, 0, 0) | none | 1
2 | rgb(0, 0, 0) | none | 1

## Layout measurements

Element | Width | Display | Columns | Gap | Padding (T R B L)
--- | --- | --- | --- | --- | ---
header | 1526px | block | none | normal | 0px 0px 0px 0px
main | 1526px | block | none | normal | 0px 0px 0px 0px
section | 1526px | block | none | normal | 0px 0px 0px 0px
article | 284px | block | none | normal | 0px 0px 0px 0px
section | 1526px | block | none | normal | 0px 0px 0px 0px
section | 1526px | block | none | normal | 160px 0px 160px 0px
section | 1526px | block | none | normal | 0px 0px 0px 0px
section | 1526px | flex | none | normal | 160px 16px 160px 16px
section | 1526px | block | none | normal | 0px 0px 0px 0px
section | 1526px | block | none | normal | 160px 32px 160px 32px

## Responsive conditions

- `(forced-colors: active)`
- `(min-width: 640px)`
- `(min-width: 768px)`
- `(min-width: 1024px)`
- `(min-width: 1280px)`
- `(min-width: 1536px)`
- `(min-width: 1920px)`
- `(hover: none) and (pointer: coarse)`
- `(max-width: 600px)`
- `(prefers-reduced-motion)`

## CSS custom properties

Names and values read from the root element; no new token names or ramps were generated.

Property | Value
--- | ---
--border | 0 0% 10%
--tw-ring-offset-shadow | 0 0 #0000
--footer-card-border | rgba(39,39,42,0.8)
--tw-ring-shadow | 0 0 #0000
--card | 0 0% 5%
--footer-pill-bg | rgba(255,255,255,0.06)
--footer-card-btn-text | #09090b
--accent | 0 0% 15%
--greedy | #173eff
--footer-card-notice-strong | #f87171
--scrollbar-track | 0 0% 10%
--primary-foreground | 0 0% 0%
--footer-shadow | none
--footer-card-btn-hover | #e4e4e7
--darklw | #11131B
--card-foreground | 0 0% 100%
--scrollbar-hover | 0 0% 35%
--secondary-foreground | 0 0% 100%
--tw-border-spacing-x | 0
--muted | 0 0% 15%
--background | 0 0% 0%
--footer-card-bg-gradient | #000000
--tw-scale-y | 1
--footer-sponsor-hover-bg | rgba(239,68,68,0.25)
--accent-foreground | 0 0% 100%
--primarylw | #e11d48
--tw-ring-color | rgb(59 130 246/0.5)
--footer-card-notice-border | rgba(239,68,68,0.22)
--tw-translate-y | 0
--lw-primary-color | hsl(0 0% 100%)
--footer-sponsor-text | #f87171
--popover | 0 0% 5%
--footer-sponsor-bg | rgba(239,68,68,0.15)
--ring | 0 0% 20%
--tw-rotate | 0
--border-angle | 0deg
--footer-sponsor-hover-border | rgba(239,68,68,0.6)
--tw-ring-offset-color | #fff
--footer-card-link-hover | #ffffff
--footer-sponsor-border | rgba(239,68,68,0.4)
--footer-card-box-border | rgba(39,39,42,0.8)
--island-theme | #e11d48
--footer-card-subtle | #71717a
--footer-divider | rgba(39,39,42,0.6)
--muted-foreground | 0 0% 65%
--tw-skew-x | 0
--footer-card-btn-bg | #ffffff
--radius | 0.5rem
--popover-foreground | 0 0% 100%
--scrollbar-thumb | 0 0% 25%
--tw-shadow | 0 0 #0000
--tw-translate-x | 0
--tw-ring-offset-width | 0px
--footer-pill-text | #d4d4d8
--footer-card-heading | #ffffff
--input | 0 0% 20%
--tw-scroll-snap-strictness | proximity
--footer-pill-border | rgba(39,39,42,0.8)
--destructive | 0 62% 30%
--tw-scale-x | 1

## Capture coverage

- 0 stylesheet(s) could not be inspected. Computed styles are still measured.
- Sampling excludes hidden elements and Sitepeel tools. Offscreen rendered elements may be included. Counts refer to the sample, not the entire website.
- Colors are CSS values, not a screenshot pixel palette. Images, compositing and gradients can affect their visible appearance.
- Hover, focus, active states, other viewport sizes, iframe documents and shadow trees need separate captures.
- No inferred brand personality, invented colors, placeholder copy or unobserved code is presented as a page measurement.
- 3 canvas element(s) detected. CSS extraction does not expose canvas drawing, WebGL shaders or JavaScript animation internals.
