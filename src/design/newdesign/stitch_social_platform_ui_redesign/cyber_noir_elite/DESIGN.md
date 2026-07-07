---
name: Cyber Noir Elite
colors:
  surface: '#131319'
  surface-dim: '#131319'
  surface-bright: '#393840'
  surface-container-lowest: '#0e0e14'
  surface-container-low: '#1b1b22'
  surface-container: '#1f1f26'
  surface-container-high: '#2a2930'
  surface-container-highest: '#35343b'
  on-surface: '#e4e1ea'
  on-surface-variant: '#e5bcc4'
  inverse-surface: '#e4e1ea'
  inverse-on-surface: '#303037'
  outline: '#ac878f'
  outline-variant: '#5c3f45'
  surface-tint: '#ffb1c3'
  primary: '#ffb1c3'
  on-primary: '#66002c'
  primary-container: '#ff4b89'
  on-primary-container: '#590026'
  inverse-primary: '#bb0058'
  secondary: '#dcfdff'
  on-secondary: '#00373a'
  secondary-container: '#00f1fd'
  on-secondary-container: '#006a6f'
  tertiary: '#a1d800'
  on-tertiary: '#263500'
  tertiary-container: '#759e00'
  on-tertiary-container: '#202e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9e0'
  primary-fixed-dim: '#ffb1c3'
  on-primary-fixed: '#3f0019'
  on-primary-fixed-variant: '#8f0041'
  secondary-fixed: '#6ff6ff'
  secondary-fixed-dim: '#00dce6'
  on-secondary-fixed: '#002022'
  on-secondary-fixed-variant: '#004f53'
  tertiary-fixed: '#b8f600'
  tertiary-fixed-dim: '#a1d800'
  on-tertiary-fixed: '#141f00'
  on-tertiary-fixed-variant: '#384e00'
  background: '#131319'
  on-background: '#e4e1ea'
  surface-variant: '#35343b'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0em
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.15em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
spacing:
  base: 4px
  gutter: 16px
  margin-mobile: 20px
  margin-desktop: 40px
  container-max: 1280px
---

## Brand & Style
The design system embodies a "Neon Tokyo" aesthetic, merging the exclusivity of an elite social platform with an aggressive, high-tech cyber-noir atmosphere. The brand personality is provocative, nocturnal, and technologically superior. It targets a high-status, tech-literate audience that values edge and digital craftsmanship.

The visual style is a hybrid of **Minimalism** and **Retro / Vaporwave**, characterized by deep obsidian surfaces, sharp geometric precision, and luminous accents. High-contrast "glowing" elements simulate hardware interfaces, while subtle scanline overlays provide a sense of analog-digital fusion. The emotional response is one of immersion in a premium, private, and futuristic digital underworld.

## Colors
The palette is rooted in a "Deep Cyber-Noir" base.
- **Primary (Electric Pink):** Used for critical actions, notifications, and high-energy highlights.
- **Secondary (Cyan):** Used for data visualization, technical info, and secondary interactive elements.
- **Tertiary (Acid Green):** Reserved for success states, status indicators, and "active" system feedback.
- **Background (#05050a):** A pure, near-black void that allows glow effects to pop.

Apply a subtle 2px scanline texture (linear-gradient overlay at 10% opacity) across the primary background to simulate a high-resolution CRT monitor. Interactive elements utilize a `0 0 15px` glow effect using their respective hex colors.

## Typography
The typography strategy prioritizes a technical, "engineered" look. 
- **Headlines:** Use **Space Grotesk** for its aggressive, geometric character. High-weight headlines should feel structural and imposing.
- **Body:** Use **Geist** for high legibility and a modern, developer-centric feel.
- **Labels/Data:** Use **JetBrains Mono** for all metadata, timestamps, and utility labels. 

All uppercase labels should have increased letter spacing to enhance the "interface" aesthetic. Display titles should utilize a slight "glitch" shadow (1px offset cyan/pink) in high-impact marketing contexts.

## Layout & Spacing
The layout follows a **Fluid Grid** model based on a 4px hard grid.
- **Grid:** 12-column layout for desktop; 4-column for mobile.
- **Gutters:** Tight 16px gutters to maintain a dense, information-rich environment.
- **Margins:** Generous side margins (40px) on desktop to center the "cockpit" of the UI.

Elements should be aligned with mathematical precision. Use rigid vertical rhythm. Components like sidebars and navigation should feel like docked modules within a futuristic HUD.

## Elevation & Depth
Depth is not communicated through traditional soft shadows, but through **Tonal Layers** and **Luminous Outlines**.
- **Surface Tiers:** Background is #05050a. Surfaces (cards, panels) are #0d0d14. Hovered states shift to #1a1a24.
- **Borders:** Use 1px solid borders. Neutral borders are #222; active/focused borders use the Primary or Secondary colors with a `drop-shadow` glow.
- **Glows:** Higher elevation is represented by increased glow intensity rather than shadow size. A "modal" doesn't cast a shadow; it illuminates the layers beneath it.

## Shapes
The shape language is **Sharp (0)**. 
Corners are strictly 90 degrees to reflect an aggressive, industrial, and high-tech aesthetic. Avoid any rounding. 

**Exceptions:** 
- Small iconography may have slight softening for legibility.
- Buttons may feature "clipped corners" (45-degree chamfers) for a specialized military-tech appearance, achieved via CSS clip-path rather than border-radius.

## Components
- **Buttons:** Sharp 0px corners. Primary buttons have a solid Pink background with white text and a pink outer glow. Secondary buttons use a Cyan 1px border with no fill.
- **Input Fields:** Bottom-border only or full 1px border in #222. On focus, the border turns Cyan and triggers a subtle scanline flicker effect.
- **Chips/Tags:** Monospaced text (JetBrains Mono) inside a #1a1a24 box. Use Acid Green for "Online" or "Success" tags.
- **Cards:** No shadows. 1px border (#222). Header section of cards should have a subtle diagonal-stripe pattern background (Primary color at 5% opacity).
- **Lists:** Separated by 1px dimmed lines. Hovering a list item should trigger a "glitch" transition or a horizontal Cyan highlight bar (2px wide) on the left edge.
- **Status Indicators:** Use Tertiary (Acid Green) with a pulsing animation to indicate "Live" or "Active" social presence.