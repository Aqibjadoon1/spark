# Inner Components Restyle Design — Stitch Social

**Date:** 2026-07-06
**Scope:** Cards (TrendingCard, UserCard, NearbyCard, StatCard), Modal, Avatar, SearchBar
**Approach:** CSS classes in `src/styles/index.css` + JSX class name swaps (no structural/behavioral changes)

## Design References

- **Dark mode:** `src/design/newdesign/stitch_social_platform_ui_redesign/community_feed_neon_tokyo/code.html` (Cyber Noir)
- **Light mode:** `src/design/lightmode/stitch_social_platform_ui_redesign/community_feed_candy/code.html` (Candy)
- **Token system:** CSS custom properties in `src/styles/index.css` (already established)

## Constraints

- Only files modifiable: `src/styles/index.css`, component JSX files listed above
- No new files, no file deletions, no dependency changes
- CSS changes preferred over JSX changes
- No deletions or changes to existing JSX elements, props, imports, or routes
- JSX changes limited to `className` string replacements only

## 1. Cards (TrendingCard, UserCard, NearbyCard, StatCard)

### New CSS Classes (index.css)

| Class | Purpose | When |
|-------|---------|------|
| `.card-neubrutal` | Shared wrapper: bg, border, radius, shadow, hover lift | All 4 cards |
| `.card-trending-rank` | Rank badge: size, bg, text color, radius | TrendingCard |
| `.card-user-inner` | UserCard inner flex layout | UserCard |
| `.card-user-btn-primary` | Primary action button (Message, Add Friend, View Profile) | UserCard, NearbyCard |
| `.card-user-btn-secondary` | Secondary action button (Pending, ghost) | UserCard |
| `.card-nearby-distance` | Distance badge pill | NearbyCard |
| `.card-stat-value` | Stat number text | StatCard |
| `.card-stat-change-pos` | Positive change indicator | StatCard |
| `.card-stat-change-neg` | Negative change indicator | StatCard |

### CSS Tokens Used

- `var(--bg-surface)`, `var(--border-light)`, `var(--radius-lg)`, `var(--shadow-card)`
- `var(--color-text-primary)`, `var(--color-text-secondary)`, `var(--color-text-muted)`
- `var(--color-primary-container)`, `var(--color-on-primary-container)`
- `var(--color-success)`, `var(--color-error)`

### JSX Changes

Replace the shared neubrutalism wrapper in all 4 cards with `className="card-neubrutal"`.
Replace rank badge, distance badge, buttons, and stat value Tailwind with new classes.
No structural changes to JSX elements or props.

## 2. Modal

### New CSS Classes (index.css)

| Class | Purpose |
|-------|---------|
| `.modal-backdrop` | Fixed overlay: bg, blur, centering layout |
| `.modal-dialog` | Dialog card: bg, border, radius, shadow, size |
| `.modal-header` | Header bar: flex, padding, border-bottom |
| `.modal-title` | Title text style |
| `.modal-close-btn` | Close button: size, radius, colors, hover |
| `.modal-body` | Content padding |

### Size Variants

Handled via `sizes` object in JSX remains (adds `max-w-sm/md/lg` directly). Modal dialog gets `.modal-dialog` base + size utility classes remain as Tailwind `max-w-*`.

### CSS Tokens

- `var(--bg-overlay)`, `var(--bg-surface-container-high)`, `var(--border-medium)`, `var(--border-light)`
- `var(--radius-xl)`, `var(--radius-lg)`, `var(--shadow-modal)`
- `var(--color-text-primary)`, `var(--color-text-muted)`

## 3. Avatar

### New CSS Classes (index.css)

| Class | Purpose |
|-------|---------|
| `.avatar` | Container: relative, rounded-full, overflow-hidden, shrink-0 |
| `.avatar-placeholder` | Placeholder div: bg, text color, centering |
| `.avatar-online` | Online dot: position, size, bg, ring |

### Size Variants

Remain as Tailwind size classes (`w-8 h-8`, `w-10 h-10`, etc.) in JSX — no change needed.

### CSS Tokens

- `var(--color-primary-container)`, `var(--color-on-primary-container)`
- `var(--color-success)`, `var(--bg-page)`

## 4. SearchBar

### New CSS Classes (index.css)

| Class | Purpose |
|-------|---------|
| `.search-input` | Input field: bg, border, radius, text, placeholder, focus ring |
| `.search-icon` | Search icon position and color |
| `.search-clear` | Clear button position and hover color |

### CSS Tokens

- `var(--bg-surface-container-high)`, `var(--border-light)`, `var(--radius-sm)`
- `var(--color-text-primary)`, `var(--color-text-muted)`
- `var(--color-primary)` (focus ring)

## Implementation Order

1. Add all CSS classes to `src/styles/index.css` (in a single edit block per section)
2. Update TrendingCard.jsx — replace wrapper + rank badge
3. Update UserCard.jsx — replace wrapper + buttons
4. Update NearbyCard.jsx — replace wrapper + distance badge + buttons
5. Update StatCard.jsx — replace wrapper + stat value + change indicators
6. Update Modal.jsx — replace all 6 parts
7. Update Avatar.jsx — replace placeholder + online dot
8. Update SearchBar.jsx — replace input + icon + clear button
9. Verify: no visual regressions

## Verification Checklist

- [ ] Cards maintain hover lift effect (translate + shadow)
- [ ] Modal opens/closes correctly, escape key works
- [ ] Avatar renders initials, images, and online dot correctly across sizes
- [ ] SearchBar input accepts text, clears, fires onSearch on Enter
- [ ] Light and dark mode both look correct
- [ ] All existing button callbacks/props still work
- [ ] No console errors or warnings
