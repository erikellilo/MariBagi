# Notion Design System Analysis

> Source: https://www.notion.so/  
> Measured: May 17, 2026  
> Analysis by DesignMD

---

---
name: Notion
url: https://www.notion.so/
colors:
  primary: '#097fe8'
  primary-active: '#005bab'
  text-accent: '#0075de'
  background: '#ffffff'
  surface: '#f6f5f4'
  surface-muted: '#f0efed'
  text-primary: '#000000'
  text-muted: '#615d59'
  text-subtle: '#a39e98'
  text-inverse: '#f6f5f4'
  border: '#dfdcd9'
  dark-surface: '#02093a'
  focus-ring: 'rgba(35, 131, 226, 0.35)'
typography:
  display:
    family: NotionInter
    size: 54px
    weight: 600
    line-height: 1.2
  heading:
    family: NotionInter
    size: 40px
    weight: 600
    line-height: 1.2
  body:
    family: NotionInter
    size: 16px
    weight: 400
    line-height: 1.5
  caption:
    family: NotionInter
    size: 14px
    weight: 400
    line-height: 1.5
  quote:
    family: Lyon Text
    size: 22px
    weight: 400
    line-height: 1.25
spacing:
  base: 4px
  scale: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64]
radius:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 20px
  full: 9999px
elevation:
  card: 'rgba(25, 25, 25, 0.027) 0px 8px 12px 0px, rgba(25, 25, 25, 0.027) 0px 2px 6px 0px'
  card-hover: 'rgba(0, 0, 0, 0.01) 0px 1px 3px 0px, rgba(0, 0, 0, 0.02) 0px 3px 7px 0px, rgba(0, 0, 0, 0.02) 0px 7px 15px 0px, rgba(0, 0, 0, 0.04) 0px 14px 28px 0px'
motion:
  duration-base: '250ms'
  easing-standard: 'cubic-bezier(0.4, 0, 0.2, 1)'
components:
  button-primary:
    bg: '{colors.primary}'
    text: '{colors.background}'
    radius: '{radius.sm}'
    padding: '8px 16px'
  card:
    bg: '{colors.background}'
    radius: '{radius.lg}'
    shadow: '{elevation.card}'
    padding: '24px'
  input:
    bg: '{colors.background}'
    border: '1px solid {colors.border}'
    radius: '{radius.sm}'
    padding: '8px 12px'
---

## 1. Visual Theme & Atmosphere
Notion's design system operates on a functional, dual-mode aesthetic. A dark, immersive hero section with a deep navy background (`#02093a`) and off-white text (`#f6f5f4`) creates initial focus. This transitions into a bright, exceptionally clean primary interface using a `#ffffff` background, pure black text (`#000000`), and light gray surfaces (`#f6f5f4`). The system feels structured and blocky, reflecting the product's organizational nature, yet is softened by a consistent radius scale (`8px`, `12px`) and approachable, hand-drawn style illustrations that inject personality.

The entire user experience is unified by the `NotionInter` font, used for everything from 54px display headings to 14px captions. This typographic consistency, combined with a disciplined 4px-based spacing scale, results in a calm, organized, and highly legible environment. Subtle but meaningful motion, including autoplaying videos and numerous CSS keyframe animations like `fadeIn`, gives the interface a responsive and modern feel without being distracting.

**Key Characteristics:**
*   **Dual-Tone Layout:** Dark, focused hero (`#02093a`) followed by a bright white (`#ffffff`) main content area.
*   **Universal Font:** `NotionInter` is used for all UI text, ensuring typographic consistency.
*   **Approachable Illustrations:** Quirky, hand-drawn style icons and graphics soften the structured layout.
*   **Softened Structure:** Consistent use of `8px` and `12px` border radii on cards and containers.
*   **Subtle Depth:** Multi-layered, soft shadows (`rgba(25, 25, 25, 0.027)...`) create gentle elevation.
*   **Systematic Spacing:** A strict 4px base unit governs all layout and component padding.
*   **Functional Blue:** A clear action blue (`#097fe8`) is reserved for primary CTAs and interactive elements.

## 2. Color Palette & Roles
The palette is built on a high-contrast foundation of black and white, with a functional blue for actions and a warm, muted neutral scale for surfaces and secondary text.

### Primary & Accent
*   **Primary Blue (`#097fe8`)**: The main call-to-action color, used for primary buttons and the "New" badge.
*   **Link Blue (`#0075de`)**: Used for all inline text links, providing clear affordance.
*   **Active Blue (`#005bab`)**: The active/pressed state for primary buttons, providing clear feedback.

### Dark Theme (Hero)
*   **Deep Navy (`#02093a`)**: The background color for the immersive hero section.
*   **Inverse Text (`#f6f5f4`)**: The primary text color used on dark backgrounds for high contrast.

### Neutral Scale
*   **Primary Text (`#000000`)**: Used for all headings and body copy on light backgrounds.
*   **Muted Text (`#615d59`)**: For secondary information and descriptive text. Passes AA contrast on light surfaces.
*   **Subtle Text (`#a39e98`)**: Used for disabled states, placeholders, and tertiary info. Fails AA contrast for body text on white.

### Surface & Borders
*   **Background (`#ffffff`)**: The default page and primary card background.
*   **Light Surface (`#f6f5f4`)**: A subtle off-white used for secondary cards and UI regions to differentiate them from the main background.
*   **Muted Surface (`#f0efed`)**: A slightly darker warm gray for background elements.
*   **Border (`#dfdcd9`)**: The default border color for inputs and subtle dividers.

## 3. Typography Rules
Notion's typography is disciplined and modern, relying almost exclusively on its custom `NotionInter` typeface. A secondary serif, `Lyon Text`, is used sparingly for pull quotes to add a touch of editorial character.

*   **Font Family**:
    *   **Primary**: `NotionInter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif`
    *   **Serif**: `Lyon Text, Georgia, YuMincho, "Yu Mincho", "Hiragino Mincho ProN", serif`
    *   **Monospace**: `Nitti, Menlo, Courier, monospace`

*   **Hierarchy**:

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |:---|
| Display | NotionInter | 54px | 600 | 1.2 | -0.02em | For primary page headlines. |
| H1 | NotionInter | 40px | 600 | 1.2 | -0.02em | Section titles. |
| H2 | NotionInter | 24px | 500 | 1.3 | -0.01em | Sub-section titles. |
| H3 | NotionInter | 20px | 500 | 1.4 | -0.01em | Card titles and minor headings. |
| Body | NotionInter | 16px | 400 | 1.5 | Normal | Default text for all paragraphs. |
| Caption | NotionInter | 14px | 400 | 1.5 | Normal | UI labels, helper text. |
| Quote | Lyon Text | 22px | 400 | 1.25 | Normal | Reserved for testimonials. |
| Code | Nitti | 14px | 400 | 1.5 | Normal | For inline code snippets. |

*   **Principles**:
    *   **Single-Family Dominance**: `NotionInter` creates a cohesive and branded feel across the entire product and marketing site.
    *   **Clear Weight Hierarchy**: `600` is reserved for major headings, `500` for subheadings, and `400` for all body and UI text. This simple system is easy to follow.
    *   **Readability First**: Generous line heights (1.5 for body text) and a clean sans-serif ensure excellent readability for long-form content.

## 4. Component Stylings

### Buttons

**Primary Button**
The primary CTA, a solid blue button with white text. Used for the most important actions.

```css
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: var(--color-primary, #097fe8);
  color: var(--color-text-inverse, #ffffff);
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-out;
}

.btn-primary:hover {
  background-color: #006dd1; /* inferred from screenshot */
}

.btn-primary:active {
  background-color: var(--color-primary-active, #005bab);
}

.btn-primary:disabled {
  background-color: #f0efed;
  color: #a39e98;
  cursor: not-allowed;
}
```

**Secondary Button**
A ghost button used on dark backgrounds, typically in the hero or navigation.

```css
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background-color: transparent;
  color: var(--color-text-inverse, #f6f5f4);
  font-size: 16px;
  font-weight: 500;
  border: 1px solid rgba(246, 245, 244, 0.5); /* inferred from screenshot */
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-out, border-color 0.2s ease-out;
}

.btn-secondary:hover {
  background-color: rgba(246, 245, 244, 0.1);
  border-color: #f6f5f4;
}

.btn-secondary:active {
  background-color: rgba(246, 245, 244, 0.2);
}

.btn-secondary:disabled {
  color: rgba(246, 245, 244, 0.4);
  border-color: rgba(246, 245, 244, 0.2);
  cursor: not-allowed;
}
```

### Cards & Containers

A standard card used for testimonials, feature blocks, and content containers. It lifts off the page with a subtle, multi-layered shadow.

```css
.card {
  background-color: var(--color-background, #ffffff);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--elevation-card, rgba(25, 25, 25, 0.027) 0px 8px 12px 0px, rgba(25, 25, 25, 0.027) 0px 2px 6px 0px);
  transition: box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1), transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--elevation-card-hover, rgba(0, 0, 0, 0.01) 0px 1px 3px 0px, rgba(0, 0, 0, 0.02) 0px 3px 7px 0px, rgba(0, 0, 0, 0.02) 0px 7px 15px 0px, rgba(0, 0, 0, 0.04) 0px 14px 28px 0px);
}
```

### Inputs & Forms

Standard text input field with a clear focus state.

```css
.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary, #000000);
  margin-bottom: 8px;
}

.text-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-text-primary, #000000);
  background-color: var(--color-background, #ffffff);
  border: 1px solid var(--color-border, #dfdcd9);
  border-radius: 4px;
  transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;
}

.text-input:focus {
  outline: none;
  border-color: #3681b1; /* inferred from screenshot */
  box-shadow: rgba(35, 131, 226, 0.57) 0px 0px 0px 1px inset, var(--color-focus-ring, rgba(35, 131, 226, 0.35)) 0px 0px 0px 2px;
}

.text-input:disabled {
  background-color: var(--color-surface, #f6f5f4);
  color: var(--color-text-subtle, #a39e98);
  cursor: not-allowed;
}
```

### Navigation

The primary navigation link style, used in the header.

```css
.nav-link {
  color: var(--color-text-inverse, #f6f5f4);
  font-size: 16px;
  font-weight: 400;
  padding: 8px 12px;
  text-decoration: none;
  border-radius: 4px;
  transition: color 0.2s ease-out, background-color 0.2s ease-out;
}

.nav-link:hover {
  color: #ffffff; /* inferred from screenshot */
  background-color: rgba(246, 245, 244, 0.1);
}

.nav-link.active,
.nav-link[aria-current="page"] {
  color: #ffffff; /* inferred from screenshot */
  font-weight: 500;
}
```

### Links

The standard inline text link.

```css
.link {
  color: var(--color-text-accent, #0075de);
  text-decoration: none;
  transition: text-decoration-color 0.2s ease-out;
}

.link:hover {
  text-decoration: underline;
  text-decoration-color: var(--color-text-accent, #0075de);
}

.link:visited {
  color: var(--color-text-accent, #0075de);
}
```

### Badges
(none observed in source)

## 5. Layout Principles

### Spacing System
The system is built on a 4px base unit. All padding, margins, and layout gaps use multiples of this base.
*   **Scale**: `[4, 8, 12, 16, 20, 24, 32, 40, 48, 64]` (all in px)
*   **Usage Context**:
    *   `4px`: Micro-spacing, icon-to-text gaps.
    *   `8px`: Inner padding for small components like buttons.
    *   `12px`, `16px`: Inner padding for larger components like inputs and cards.
    *   `24px`, `32px`: Gaps between elements, like cards in a grid.
    *   `48px`, `64px`: Vertical spacing between large content sections.

### Grid & Container
*   **Max Width**: 1200px (inferred from screenshot)
*   **Columns**: 12 (inferred from screenshot)
*   **Gutter**: 24px (inferred from screenshot)
*   **Section Padding**: 64px vertical, 24px horizontal (inferred from screenshot)

### Whitespace Philosophy
Whitespace is used generously to create a sense of calm and order. Large content sections are clearly demarcated by significant vertical space, and content within cards is given ample breathing room, preventing a cluttered feel and improving focus.

### Border Radius Scale
*   **4px (`sm`)**: Buttons, inputs, and other small interactive elements.
*   **8px (`md`)**: Medium-sized cards and UI containers.
*   **12px (`lg`)**: Primary content cards and large containers.
*   **20px (`xl`)**: Decorative containers or large media.
*   **9999px (`full`)**: Pills and circular elements like avatars.

## 6. Depth & Elevation
Depth is created through a sophisticated, multi-layered shadow system. Shadows are soft and subtle, suggesting elevation without feeling heavy. The z-index scale is pragmatic, with large gaps for future-proofing.

| Level | Treatment | Use | z-index |
| :--- | :--- | :--- | :---: |
| Flat | `box-shadow: none;` | Default page elements, text. | 1 |
| Card | `rgba(25, 25, 25, 0.027) 0px 8px 12px 0px, ...` | Default state for cards and containers. | 2 |
| Card Hover | `rgba(0, 0, 0, 0.01) 0px 1px 3px 0px, ...` | Hover state for cards, dropdowns. | 3 |
| Navigation | `(same as Card)` | Sticky navigation bar. | 100 |
| Modal | `(same as Card Hover, but stronger)` | Overlays, dialogs, consent manager. | 1000+ |

**Shadow Philosophy**: Notion's shadows are designed to be almost imperceptible, creating a soft lift rather than a hard edge. They are composed of multiple, low-opacity layers to mimic real-world lighting, enhancing the sense of a tangible, layered interface. Elevation is used sparingly to draw attention to interactive or primary content blocks.

## 7. Do's and Don'ts

### Do
*   Use `NotionInter` for all interface text from 14px to 54px.
*   Apply an `8px` or `12px` border-radius to all content containers and cards.
*   Use `#000000` text on `#ffffff` backgrounds for maximum (AAA) contrast.
*   Adhere to the 4px spacing scale: `4, 8, 12, 16, 24, 32, 48, 64`.
*   Reserve the primary blue (`#097fe8`) for the single most important CTA on a page.
*   Use the multi-layered shadow `rgba(25, 25, 25, 0.027)...` for all elevated cards.
*   Ensure all form inputs use the blue `box-shadow` on `:focus`.
*   Use `#615d59` for secondary text; it passes AA on `#ffffff` and `#f6f5f4`.
*   Keep at least `48px` of vertical space between major content sections.

### Don't
*   Don't use `#a39e98` for body text on a `#ffffff` background; its 2.67:1 contrast ratio fails AA.
*   Don't create sharp-cornered (`0px` radius) containers.
*   Don't introduce new font families for UI elements; stick to `NotionInter`.
*   Don't use spacing values outside the established 4px scale (e.g., `10px` or `18px`).
*   Don't apply shadows to text or small, inline elements.
*   Don't use more than one Primary Button (`#097fe8`) per screen view.
*   Don't forget the `:hover` state on cards, which uses a larger shadow and a `translateY(-2px)` transform.
*   Don't use colors other than `#0075de` for inline text links.

## 8. Responsive Behavior
_Note: Breakpoints below are measured directly from the source CSS._

*   **Breakpoints**:

| Breakpoint Name | Width | Key Changes |
| :--- | :--- | :--- |
| Mobile Small | 375px+ | Single-column layout, typography scales down. |
| Mobile Large | 600px+ | Larger touch targets, increased padding. |
| Tablet | 840px+ | Two-column layouts for cards, navigation may still be collapsed. |
| Desktop | 1080px+ | Full navigation is visible, multi-column layouts are standard. |
| Desktop Large | 1280px+ | Increased horizontal padding, wider content grid. |
| Desktop XL | 1440px+ | Max-width content area with generous whitespace on the sides. |

*   **Touch Targets**:
    *   All buttons and interactive links should have a minimum tap area of 44x44px.
    *   Maintain at least 8px of space between adjacent tap targets.

*   **Collapsing Strategy**:
    *   **Navigation**: The main navigation bar collapses into a hamburger menu icon on mobile. The primary "Get Notion free" CTA remains visible.
    *   **Cards**: Multi-column card grids stack into a single vertical column on screens narrower than 840px.
    *   **Typography**: Display and heading font sizes are reduced by 15-20% on mobile breakpoints.
    *   **Padding**: Section padding is reduced from 64px to 32px on mobile.

## 9. Agent Prompt Guide

### Quick Color Reference
*   `primary`: `#097fe8` (Buttons)
*   `text-accent`: `#0075de` (Links)
*   `background`: `#ffffff`
*   `surface`: `#f6f5f4`
*   `text-primary`: `#000000`
*   `text-muted`: `#615d59`
*   `border`: `#dfdcd9`
*   `dark-surface`: `#02093a` (Hero background)
*   `text-inverse`: `#f6f5f4` (Text on dark surfaces)
*   `focus-ring`: `rgba(35, 131, 226, 0.35)`

### Iteration Guide
1.  **CTAs**: Primary buttons always use the `#097fe8` background with `#ffffff` text and a `4px` radius.
2.  **Typography**: All UI text must be `NotionInter`. Body text is `16px` weight `400`. Headings are `20px+` weight `500` or `600`.
3.  **Spacing**: Use only these values for margin/padding: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64` (in px).
4.  **Radius**: Use `4px` for buttons/inputs, `8px` or `12px` for cards. No sharp corners.
5.  **Cards**: Default cards have a `#ffffff` background, `12px` radius, and the standard `elevation.card` box-shadow.
6.  **Inputs**: All text inputs must have a `1px solid #dfdcd9` border and use the blue `box-shadow` for their `:focus` state.
7.  **Shadows**: Use the pre-defined `elevation.card` and `elevation.card-hover` shadows. Do not create new ones.
8.  **Contrast**: Main body text must be `#000000` on `#ffffff`. Avoid using `#a39e98` for anything smaller than `18px` bold text on a white background.
9.  **Links**: All inline links must be `#0075de` and have a standard underline on hover.
10. **Mobile**: Below `840px`, switch to a single-column layout for all content grids. Reduce section padding from `64px` to `32px`.