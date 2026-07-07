# Pages Restyle Design — Notifications + Settings

**Date:** 2026-07-06
**Scope:** `src/pages/social/Notifications.jsx`, `src/pages/social/Settings.jsx`
**Approach:** CSS classes in `src/styles/index.css` + JSX inline style-to-className swaps. No structural/behavioral changes.

## Design References

Same as prior phase: Cyber Noir (dark) and Candy (light) HTML files.

## Notifications Page

### Current State
- Uses `feed`, `feed-heading`, `feed-title`, `feed-subtitle`, `feed-post-wrapper` (restyled)
- Filter buttons, badges, notification items: all inline `style={{}}`
- Already references CSS variables in inline styles (e.g., `var(--border-light)`)

### New CSS Classes (index.css)

| Class | Purpose | Properties |
|-------|---------|------------|
| `.notif-filters` | Filter bar wrapper | flex, gap, wrap, align |
| `.notif-filter` | Filter pill button | padding, radius, border, bg, text, transition |
| `.notif-filter--active` | Active filter state | gradient bg, white text, shadow |
| `.notif-filter-badge` | Unread count badge | inline-flex, min-width, height, radius, bg |
| `.notif-filter-badge--active` | Badge on active filter | translucent white bg |
| `.notif-mark-all` | "Mark all read" button | margin auto, pill shape |
| `.notif-item` | Notification row wrapper | padding, flex, gap, cursor, opacity for read |
| `.notif-icon-avatar` | Notification avatar circle | size, radius, gradient bg, centered content |
| `.notif-body` | Text body wrapper | flex-1, min-width 0 |
| `.notif-message` | Message text | font-size, color, line-height |
| `.notif-time` | Timestamp | font-size, color, margin |
| `.notif-icon` | Icon container | size, radius, bg, centered |
| `.notif-empty` | Empty state text | text-align, padding, color |

### JSX Changes
- Replace inline `style={{}}` on filter buttons with `.notif-filter` / `.notif-filter--active`
- Replace inline badge spans with `.notif-filter-badge`
- Replace notification item wrapper inline styles with `.notif-item`
- Replace avatar container with `.notif-icon-avatar`
- Replace icon container with `.notif-icon`
- Replace message/time spans with `.notif-message` / `.notif-time`
- Replace empty state with `.notif-empty`
- Replace "Mark all read" button inline styles with `.notif-mark-all`

## Settings Page

### Current State
- Uses `dashboard-content`, `section-header`, `panel-card`, `panel-card-title`, `btn` (restyled)
- Toggle switches, select, sections, delete dialog: all inline `style={{}}`
- Uses CSS variables inline

### New CSS Classes (index.css)

| Class | Purpose | Properties |
|-------|---------|------------|
| `.settings-page` | Page wrapper max-width + margin |
| `.settings-header` | Header bar flex layout |
| `.settings-section` | Section group gap |
| `.settings-label` | Label text |
| `.settings-description` | Helper text below label |
| `.settings-select` | Select dropdown | width, padding, bg, radius, border, text |
| `.settings-toggle-row` | Toggle row flex layout |
| `.settings-toggle` | Toggle button | relative, inline-flex, size, radius, transition, cursor |
| `.settings-toggle--on` | Active toggle bg | primary color |
| `.settings-toggle--off` | Inactive toggle bg | placeholder color |
| `.settings-toggle-circle` | Toggle knob | inline-block, size, radius, bg, shadow, transition, transform |
| `.settings-toggle-circle--on` | Knob position on | translateX 1.5rem |
| `.settings-toggle-circle--off` | Knob position off | translateX 0.25rem |
| `.settings-danger-zone` | Section with danger border |
| `.settings-danger-title` | Danger zone title |
| `.settings-delete-backdrop` | Delete confirm overlay | fixed, inset-0, flex, bg-overlay, z-index |
| `.settings-delete-dialog` | Delete confirm card | bg, radius, padding, max-width, shadow, border |
| `.settings-delete-title` | Delete dialog title |
| `.settings-delete-text` | Delete dialog body text |

### JSX Changes
- Replace wrapper `style={{maxWidth: '42rem', margin: '0 auto'}}` with `.settings-page`
- Replace header div inline styles with `.settings-header`
- Replace section gap wrapper with `.settings-section`
- Replace labels with `.settings-label`
- Replace descriptions with `.settings-description`
- Replace select with `.settings-select`
- Replace toggle rows with `.settings-toggle-row`
- Replace toggle button inline styles with `.settings-toggle` + state modifier
- Replace toggle circle inline styles with `.settings-toggle-circle` + state modifier
- Replace delete confirmation overlay/dialog inline styles with CSS classes
- The danger zone section uses `.panel-card` already — add `.settings-danger-zone` class

### Note on Delete Confirmation
Settings has its own inline delete confirmation dialog (lines 210-235). This could use the restyled `<Modal>` component from `src/components/globals/Modal.jsx`, but to keep changes minimal, we'll just extract the inline styles to CSS classes instead of replacing with the Modal component. No structural JSX changes means no import changes.
