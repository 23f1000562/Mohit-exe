---
name: Bitwise Architect
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#39393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1b1b1c'
  surface-container: '#1f1f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#b9ccb2'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#303031'
  outline: '#84967e'
  outline-variant: '#3b4b37'
  surface-tint: '#00e639'
  primary: '#ebffe2'
  on-primary: '#003907'
  primary-container: '#00ff41'
  on-primary-container: '#007117'
  inverse-primary: '#006e16'
  secondary: '#bdf4ff'
  on-secondary: '#00363d'
  secondary-container: '#00e3fd'
  on-secondary-container: '#00616d'
  tertiary: '#fff7f9'
  on-tertiary: '#5b005b'
  tertiary-container: '#ffcef4'
  on-tertiary-container: '#ad00ad'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#72ff70'
  primary-fixed-dim: '#00e639'
  on-primary-fixed: '#002203'
  on-primary-fixed-variant: '#00530e'
  secondary-fixed: '#9cf0ff'
  secondary-fixed-dim: '#00daf3'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#004f58'
  tertiary-fixed: '#ffd7f5'
  tertiary-fixed-dim: '#ffabf3'
  on-tertiary-fixed: '#380038'
  on-tertiary-fixed-variant: '#810081'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  headline-xl:
    fontFamily: Space Mono
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -1px
  headline-lg:
    fontFamily: Space Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Space Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Courier Prime
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
  code-block:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
spacing:
  base_grid: 8px
  margin_sm: 16px
  margin_md: 32px
  margin_lg: 64px
  gutter: 24px
  max_width: 1200px
---

## Brand & Style

The design system is rooted in **Retro-Futurism and 8-bit Brutalism**. It bridges the nostalgic aesthetic of 1980s computing with the high-precision world of AI and Machine Learning. The target audience includes tech recruiters, developers, and AI researchers who value technical depth and creative personality.

The interface prioritizes high-contrast, boxy layouts that mimic early terminal interfaces and handheld gaming systems. Key stylistic hallmarks include:
- **Hard edges:** No rounded corners or soft transitions.
- **Scanlines:** A subtle overlay to simulate CRT monitors.
- **Dithered Gradients:** Simulating depth through pixel patterns rather than smooth color blends.
- **Micro-Interactions:** Snappy, immediate feedback that mirrors hardware-level response times.

## Colors

The color strategy uses a **Deep Dark Mode** foundation to let neon accents pop with maximum luminosity. It follows a classic 16-color palette logic where saturation is high and tonal range is stepped rather than continuous.

- **Primary (Neon Green):** Reserved for "Active" states, terminal inputs, and successful AI model completions.
- **Secondary (Neon Cyan):** Used for navigation links, secondary data points, and UI decorations.
- **Tertiary (Magenta/Pink):** A rare accent for "Critical" errors or high-energy breakpoints.
- **Neutrals:** A range of low-saturation grays (`#0D0D0D` to `#4A4A4A`) provides the structural backbone, ensuring the neon elements remain legible and atmospheric.

## Typography

This design system exclusively utilizes **Monospaced Typefaces** to maintain the grid-aligned aesthetic of a terminal. 

- **Headlines:** Use `Space Mono` for its geometric, futuristic feel. Headings should be set in all caps or "CamelCase" to mimic variable naming conventions.
- **Body:** `JetBrains Mono` is used for high legibility in technical descriptions and blog content, providing a modern developer feel.
- **Labels:** `Courier Prime` is used for small metadata, timestamps, and "System Status" indicators, evoking typewriter-style output.

**Styling Rule:** Avoid all italicization. Use bold weights or color shifts (e.g., changing text to Primary Green) to signify emphasis.

## Layout & Spacing

The layout is built on a **Rigid 8px Pixel Grid**. Everything from padding to column widths must be a multiple of 8 to ensure visual alignment with the "pixelated" style.

- **Desktop:** 12-column grid with heavy 4px borders between sections. Containers should feel like "windows" in an early OS.
- **Mobile:** Single column. Margins reduce to 16px. Elements should maintain their boxy appearance; do not collapse borders for the sake of screen real estate.
- **Rhythm:** Use "Chunky" spacing. Avoid subtle 4px or 2px gaps. If two elements are related, use 16px; if they are distinct sections, use 64px.

## Elevation & Depth

In this design system, depth is achieved through **Hard-Edged Layering** and **Dithering**, rather than shadows.

- **The Z-Index Stack:**
  1. **Background:** Pure black with a faint, repeating dot pattern.
  2. **Panels:** Surface gray (`#1A1A1B`) with a 2px solid border (`#4A4A4A`).
  3. **Elevated Elements:** Elements that need to stand out (like Tooltips or Popups) use a "Dithered Drop Shadow"—a 1px checkered pattern of black and transparent pixels shifted 8px right and 8px down.
- **Internal Glows:** Instead of shadows, use "Neon Outlines." An active window might have a 1px inner border of Neon Green to signify focus.

## Shapes

The shape language is strictly **Geometric and Orthogonal**. 
- **Corners:** Absolutely no border-radii are permitted. All corners must be a sharp 90-degree angle.
- **Borders:** Use stepped border widths. Default borders are 2px. Primary action borders are 4px. 
- **Insets:** To create a "pressed" look for input fields, use a 2px top/left border of a darker shade and a 2px bottom/right border of a lighter shade.

## Components

### Buttons
Buttons are "Chunky." They use a solid background of Neon Green with black text. On hover, the button shifts its position 4px down and 4px right, while a "ghost" outline remains in the original position to simulate a physical mechanical press.

### Chips / Tags
Used for Tech Stack (e.g., "Python", "PyTorch"). These are small boxes with a 1px solid border and no background. When active, they fill with the accent color.

### Input Fields
Designed to look like terminal prompts. They begin with a `>` character. The cursor is a solid blinking block.

### Cards
Cards are "Containers." They must have a header bar that contains a "title" on the left and a "minimize/close" icon representation (three pixels) on the right, even if the icons are non-functional. This reinforces the "OS" metaphor.

### Progress Bars
Used for skill levels or AI training visualizations. Instead of a smooth fill, use a series of discrete blocks (e.g., `[|||||||....]`) to maintain the 8-bit feel.

### Scanline Overlay
Apply a global CSS overlay with a repeating linear gradient of `rgba(0,0,0,0.1)` and `transparent` every 4px to give the entire UI a hardware-monitor texture.