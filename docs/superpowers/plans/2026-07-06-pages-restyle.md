# Pages Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle Notifications.jsx and Settings.jsx pages to use CSS classes instead of inline styles.

**Architecture:** CSS classes added to `src/styles/index.css`, JSX class name swaps. Same pattern as the cards/modal/avatar restyle. No structural or behavioral JSX changes.

**Files modified:**
- `src/styles/index.css` — add notification/settings CSS classes
- `src/pages/social/Notifications.jsx`
- `src/pages/social/Settings.jsx`

---

### Task 1: Add page CSS classes to index.css

**Files:**
- Modify: `src/styles/index.css:397` (after `search-clear:hover` rule, before `/* ====== FEED PAGE ====== */`)

- [ ] **Step 1: Add Notifications and Settings CSS classes**

Insert at line 397 (before `/* ====== FEED PAGE ====== */`):
```css

/* ====== NOTIFICATIONS ====== */
.notif-filters { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
.notif-filter {
  padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-light);
  background: var(--bg-glass); color: var(--color-text-primary);
  font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  font-family: inherit;
}
.notif-filter--active {
  background: linear-gradient(135deg, #7B4DFF, #FF3C9D);
  color: #fff; border: 1px solid transparent;
  box-shadow: 0 2px 8px rgba(123,77,255,0.3);
}
.notif-filter-badge {
  display: inline-flex; align-items: center; justify-content: center;
  margin-left: 6px; min-width: 18px; height: 18px; border-radius: 9px;
  background: var(--color-primary-light); font-size: 10px; font-weight: 700; padding: 0 4px;
}
.notif-filter-badge--active { background: rgba(255,255,255,0.25); }
.notif-mark-all {
  margin-left: auto; padding: 6px 14px; border-radius: 20px;
  border: 1px solid var(--border-light); background: var(--bg-glass);
  color: var(--color-text-primary); font-size: 12px; cursor: pointer; font-family: inherit;
}
.notif-item {
  padding: 16px 20px; cursor: pointer; display: flex; align-items: center; gap: 14px;
}
.notif-item--read { opacity: 0.6; }
.notif-icon-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  font-size: 13px; font-weight: 700;
}
.notif-body { flex: 1; min-width: 0; }
.notif-message { font-size: 14px; color: var(--color-text-primary); line-height: 1.4; }
.notif-time { font-size: 12px; color: var(--color-text-placeholder); margin-top: 2px; display: block; }
.notif-icon {
  width: 36px; height: 36px; border-radius: 10px; background: var(--bg-glass);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.notif-empty { color: var(--color-text-placeholder); text-align: center; padding: 40px; }

/* ====== SETTINGS ====== */
.settings-page { max-width: 42rem; margin: 0 auto; }
.settings-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; }
.settings-section { display: flex; flex-direction: column; gap: 1.5rem; }
.settings-label { font-size: 0.875rem; font-weight: 500; color: var(--color-text-secondary); display: block; margin-bottom: 0.75rem; }
.settings-description { font-size: 0.75rem; color: var(--color-text-muted); margin-bottom: 0.75rem; }
.settings-select {
  width: 100%; padding: 0.625rem 1rem;
  background: var(--bg-surface-raised); border-radius: 0.75rem;
  border: 1px solid var(--border-medium); font-size: 0.875rem;
  color: var(--color-text-primary);
}
.settings-toggle-row { display: flex; align-items: center; justify-content: space-between; }
.settings-toggle { display: inline-flex; height: 1.5rem; width: 2.75rem; border-radius: 9999px; transition: background-color 0.2s; cursor: pointer; border: none; padding: 0; }
.settings-toggle--on { background-color: var(--color-primary); }
.settings-toggle--off { background-color: var(--color-text-placeholder); }
.settings-toggle-circle {
  display: inline-block; height: 1rem; width: 1rem;
  border-radius: 50%; background-color: var(--color-text-white);
  transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  margin-top: 0.25rem;
}
.settings-toggle-circle--on { transform: translateX(1.5rem); }
.settings-toggle-circle--off { transform: translateX(0.25rem); }
.settings-page-label { font-size: 0.875rem; color: var(--color-text-secondary); }
.settings-danger-zone { border: 1px solid var(--color-danger) !important; }
.settings-danger-title { color: var(--color-danger) !important; }
.settings-delete-backdrop { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; background: var(--bg-overlay); padding: 1rem; }
.settings-delete-dialog { background: var(--bg-surface); border-radius: 0.75rem; padding: 1.5rem; max-width: 24rem; width: 100%; box-shadow: 0 25px 50px var(--shadow-card); border: 1px solid var(--border-light); }
.settings-delete-title { font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--color-text-primary); }
.settings-delete-text { font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 1.5rem; }
.settings-delete-actions { display: flex; gap: 0.75rem; }
```

---

### Task 2: Update Notifications.jsx

**Files:**
- Modify: `src/pages/social/Notifications.jsx`

- [ ] **Step 1: Replace filter bar wrapper** (line ~101)
Replace:
```
<div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
```
With:
```
<div className="notif-filters">
```

- [ ] **Step 2: Replace filter button inline styles** (lines ~109-116)
Replace the entire `style={{}}` block on the filter button with conditional classNames:
```
className={`notif-filter${activeFilter === type ? ' notif-filter--active' : ''}`}
```

- [ ] **Step 3: Replace unread badge** (lines ~119-128)
Replace the `style={{}}` on the unread count span with:
```
className={`notif-filter-badge${activeFilter === type ? ' notif-filter-badge--active' : ''}`}
```

- [ ] **Step 4: Replace "Mark all read" button** (lines ~133)
Replace `style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border-light)', background: 'var(--bg-glass)', color: 'var(--color-text-primary)', fontSize: 12, cursor: 'pointer' }}` with:
```
className="notif-mark-all"
```

- [ ] **Step 5: Replace empty state** (line ~140)
Replace the `<p>` with inline style with:
```
<p className="notif-empty">No notifications yet</p>
```

- [ ] **Step 6: Replace notification item** (lines ~147-149)
Replace the `className` + `style` on the notification wrapper div:
```
className={`feed-post-wrapper notif-item${n.read ? ' notif-item--read' : ''}`}
```
Remove the inline `style={{}}` entirely.

- [ ] **Step 7: Replace icon avatar** (lines ~152-159)
Replace the inline `style={{}}` div with:
```
<div className="notif-icon-avatar" style={{background: `linear-gradient(135deg, ${NOTIF_COLORS[n.type] || '#7B4DFF'}, var(--border-medium))`, color: 'var(--color-text-white)'}}>
```
(The gradient background can't be extracted to CSS since it uses dynamic JS values)

- [ ] **Step 8: Replace notification body** (line ~160)
Replace `style={{ flex: 1, minWidth: 0 }}` with `className="notif-body"`

- [ ] **Step 9: Replace message** (line ~161)
Replace `style={{ fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.4 }}` with `className="notif-message"`
Also keep the `<strong>` with inline style (dynamic styling).

- [ ] **Step 10: Replace timestamp** (line ~164)
Replace `style={{ fontSize: 12, color: 'var(--color-text-placeholder)', marginTop: 2, display: 'block' }}` with `className="notif-time"`

- [ ] **Step 11: Replace icon container** (lines ~168-173)
Replace `style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}` with `className="notif-icon"`

---

### Task 3: Update Settings.jsx

**Files:**
- Modify: `src/pages/social/Settings.jsx`

- [ ] **Step 1: Replace page wrapper** (line ~115)
Replace `className="dashboard-content" style={{ maxWidth: '42rem', margin: '0 auto' }}` with `className="dashboard-content settings-page"`

- [ ] **Step 2: Replace header** (line ~116)
Replace `style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}` with `className="settings-header"`

- [ ] **Step 3: Replace section gap wrapper** (line ~132)
Replace `style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}` with `className="settings-section"`

- [ ] **Step 4: Replace Appearance label** (line ~136)
Replace `style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.75rem' }}` with `className="settings-label"`

- [ ] **Step 5: Replace Privacy label** (line ~155)
Replace the label `style={{}}` with `className="settings-label"` (keep htmlFor and other attributes)

- [ ] **Step 6: Replace Privacy description** (line ~158)
Replace `style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}` with `className="settings-description"`

- [ ] **Step 7: Replace select** (line ~165)
Replace `style={{ width: '100%', padding: '0.625rem 1rem', background: 'var(--bg-surface-raised)', borderRadius: '0.75rem', border: '1px solid var(--border-medium)', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}` with `className="settings-select"`

- [ ] **Step 8: Replace toggle rows** (line ~183)
Replace `style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}` with `className="settings-toggle-row"`

- [ ] **Step 9: Replace toggle label** (line ~184)
Replace `style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}` with `className="settings-page-label"`

- [ ] **Step 10: Replace toggle button** (lines ~187-193)
Replace the inline `style={toggleStyle(notifications[key])}` with:
```
className={`settings-toggle${notifications[key] ? ' settings-toggle--on' : ' settings-toggle--off'}`}
```

- [ ] **Step 11: Replace toggle circle** (line ~192)
Replace `style={toggleCircleStyle(notifications[key])}` with:
```
className={`settings-toggle-circle${notifications[key] ? ' settings-toggle-circle--on' : ' settings-toggle-circle--off'}`}
```

- [ ] **Step 12: Mark danger zone section** (line ~199)
Add `settings-danger-zone` to the panel-card className:
```
className="panel-card settings-danger-zone"
```
And remove `style={{ border: '1px solid var(--color-danger)' }}`

- [ ] **Step 13: Replace danger title** (line ~200)
Replace `className="panel-card-title" style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}` with `className="panel-card-title settings-danger-title"`

- [ ] **Step 14: Replace danger description** (line ~201)
Replace `style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}` with `className=""` or remove it (inherits body text style)

- [ ] **Step 15: Replace delete backdrop** (line ~211)
Replace `style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-overlay)', padding: '1rem' }}` with `className="settings-delete-backdrop"`

- [ ] **Step 16: Replace delete dialog** (line ~212)
Replace `style={{ background: 'var(--bg-surface)', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '24rem', width: '100%', boxShadow: '0 25px 50px var(--shadow-card)', border: '1px solid var(--border-light)' }}` with `className="settings-delete-dialog"`

- [ ] **Step 17: Replace delete title** (line ~213)
Replace the inline style h3 with:
```
<h3 className="settings-delete-title">Delete Account?</h3>
```

- [ ] **Step 18: Replace delete text** (line ~214)
Replace `style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}` with `className="settings-delete-text"`

- [ ] **Step 19: Replace delete button row** (line ~217)
Replace `style={{ display: 'flex', gap: '0.75rem' }}` with `className="settings-delete-actions"`

---

### Task 4: Verify build

- [ ] **Step 1: Build check**
```
npm run build
```
Expected: ✓ built successfully, 0 errors.

- [ ] **Step 2: Visual check**
- Open app and navigate to Notifications page — filter buttons, items, badges look correct
- Navigate to Settings page — appearance section, privacy select, notification toggles, danger zone, delete dialog all look correct
- Toggle theme between light/dark — verify CSS variables adapt
