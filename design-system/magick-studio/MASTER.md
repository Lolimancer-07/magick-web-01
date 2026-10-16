# Design System Master File

## Deviations (Project Owner Intent - Sections 2.4, 3, & 4)
- **Visual Direction:** Playful, friendly, light-theme landing page and editor UI with chunky "clay" cards, vibrant pastel colors, and rounded typography based on the LearnHub reference.
- **Palette Override:**
  - `--beige: #ebe6e2;` (hero, why-choose-us, footer)
  - `--gray: #ebebeb;` (catalog, testimonials, card faces)
  - `--ink: #2e3645;` (text, borders, hard shadows)
  - `--muted: #5b6377;` (body copy darkened to pass 4.5:1 contrast)
  - `--green: #2abc60;` (primary buttons, highlight word, progress fill)
  - `--green-d: #17803f;` (green text on light backgrounds for small text contrast)
  - `--blue: #a4cad7;` (secondary buttons, CTA band, pill labels)
  - `--salmon: #eab1aa;` (logo chip, icon tiles, pill label)
  - `--lavender: #d6d5e7;` (icon tiles)
  - `--mint: #91ec91;` (icon tiles, floating star chip)
  - `--gold: #f5c518;` (testimonial stars)
- **Typography Override:** Display / headings / buttons: `Fredoka` (500, 600, 700); Body: `Nunito` (400, 600, 700) via `next/font/google`.
- **Card Styling:** Chunky clay cards with `2px solid var(--ink)` border, `18px` border-radius, `4px 4px 0 var(--ink)` hard offset shadow.
- **Buttons:** 2px solid `var(--ink)`, pill-ish radius (12-14px), display font (`Fredoka`). Primary is `--green`, secondary is `--blue`. Ink text on green buttons for 4.5:1 contrast.
- **Pills/Badges:** Fully rounded, 2px solid `var(--ink)`, small bold text.
- **Progress Bar:** Thick, fully rounded track with 2px ink border, `--green` fill.

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Magick Studio
**Generated:** 2026-10-16 16:26:25
**Category:** Playful Educational / Image Studio


---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#7C3AED` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#8B5CF6` | `--color-secondary` |
| On Secondary | `#000000` | `--color-on-secondary` |
| Accent/CTA | `#059669` | `--color-accent` |
| On Accent/CTA | `#000000` | `--color-on-accent` |
| Background | `#FAF5FF` | `--color-background` |
| Foreground | `#0F172A` | `--color-foreground` |
| Card | `#FFFFFF` | `--color-card` |
| Card Foreground | `#0F172A` | `--color-card-foreground` |
| Muted | `#F7F3FD` | `--color-muted` |
| Muted Foreground | `#475569` | `--color-muted-foreground` |
| Border | `#EFE7FC` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| On Destructive | `#FFFFFF` | `--color-on-destructive` |
| Ring | `#7C3AED` | `--color-ring` |

**Color Notes:** Study purple + correct green

### Typography

- **Heading Font:** Fredoka
- **Body Font:** Nunito
- **Mood:** playful, friendly, fun, creative, warm, approachable
- **Google Fonts:** [Fredoka + Nunito](https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #059669;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #7C3AED;
  border: 2px solid #7C3AED;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards

```css
.card {
  background: #FAF5FF;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #7C3AED;
  outline: none;
  box-shadow: 0 0 0 3px #7C3AED20;
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Claymorphism

**Keywords:** Soft 3D, chunky, playful, toy-like, bubbly, thick borders (3-4px), double shadows, rounded (16-24px)

**Best For:** Educational apps, children's apps, SaaS platforms, creative tools, fun-focused, onboarding, casual games

**Key Effects:** Inner+outer shadows (subtle, no hard lines), soft press (200ms ease-out), fluffy elements, smooth transitions

### Page Pattern

**Pattern Name:** Product Demo + Features

- **Conversion Strategy:** Use an interactive demo only when it explains value better than static media. Provide captions, transcript, visible play/pause controls, and a non-video fallback; do not autoplay under reduced motion. Pause media when offscreen or hidden and keep the final product state available as static content.
- **CTA Placement:** Video center + CTA right/bottom
- **Section Order:** Hero > Product video/mockup (center) > Feature breakdown per section > Comparison (optional) > CTA

---

## Anti-Patterns (Do NOT Use)

- ❌ Inconsistent styling
- ❌ Poor contrast ratios

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
