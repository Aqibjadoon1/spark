# Inner Components Restyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle Cards (TrendingCard, UserCard, NearbyCard, StatCard), Modal, Avatar, and SearchBar to use the Stitch design token system via CSS classes in index.css + JSX class name swaps.

**Architecture:** CSS-only additions to `src/styles/index.css` (no new files). JSX changes are `className` string replacements only — no structural/behavioral changes. Modal already has CSS classes defined at `index.css:1314-1322`; just need to wire Modal.jsx to use them.

**Files modified:**
- `src/styles/index.css` — add card/avatar/search CSS classes
- `src/components/cards/TrendingCard.jsx`
- `src/components/cards/UserCard.jsx`
- `src/components/cards/NearbyCard.jsx`
- `src/components/cards/StatCard.jsx`
- `src/components/globals/Modal.jsx`
- `src/components/globals/Avatar.jsx`
- `src/components/globals/SearchBar.jsx`

**Token reference:** `--bg-surface`, `--border-light`, `--border-medium`, `--radius-sm`, `--radius-lg`, `--radius-xl`, `--shadow-card`, `--shadow-modal`, `--bg-overlay`, `--bg-surface-container-high`, `--bg-surface-container-highest`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-primary`, `--color-primary-container`, `--color-on-primary-container`, `--color-error`, `--bg-error-container`, `--color-success`, `--bg-page`

---

### Task 1: Add card/avatar/search CSS classes to index.css

**Files:**
- Modify: `src/styles/index.css:314` (after `.sidebar-logout` rules, before `/* ====== FEED PAGE ====== */`)

- [ ] **Step 1: Add Cards shared wrapper + component-specific classes**

Insert at line 314:
```css

/* ====== CARDS ====== */
.card-neubrutal {
  background: var(--bg-surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  padding: 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}
.card-neubrutal:hover {
  transform: translate(-2px, -2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.card-trending-rank {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; flex-shrink: 0;
}
.card-trending-rank--gold { background: var(--color-primary); color: var(--bg-page); }
.card-trending-rank--silver { background: var(--color-primary-container); color: var(--color-on-primary-container); }
.card-trending-rank--bronze { background: var(--color-error); color: white; }
.card-trending-rank--default { background: var(--bg-surface-container-high); color: var(--color-text-muted); }
.card-user-actions { display: flex; gap: 8px; margin-top: 16px; }
.card-user-btn {
  flex: 1; padding: 8px 16px; font-size: 13px; font-weight: 600;
  border-radius: var(--radius-sm); cursor: pointer; border: none;
  font-family: inherit; transition: opacity 0.15s;
}
.card-user-btn--solid { background: var(--color-primary-container); color: var(--color-on-primary-container); }
.card-user-btn--solid:hover { opacity: 0.9; }
.card-user-btn--outline { background: transparent; color: var(--color-text-primary); border: 1px solid var(--border-medium); }
.card-user-btn--outline:hover { background: var(--bg-surface-container-highest); }
.card-user-btn--disabled { background: var(--bg-surface-container-high); color: var(--color-text-muted); border: 1px solid var(--border-light); cursor: not-allowed; }
.card-nearby-distance {
  padding: 4px 12px; background: var(--color-primary-container);
  color: var(--color-on-primary-container); font-size: 12px; font-weight: 700;
  border-radius: 999px; border: 1px solid var(--border-light); flex-shrink: 0;
}
.card-stat-value { font-size: 24px; font-weight: 800; color: var(--color-text-primary); line-height: 1.2; }
.card-stat-change { display: inline-flex; align-items: center; gap: 2px; font-size: 12px; font-weight: 600; }
.card-stat-change--pos { color: var(--color-success); }
.card-stat-change--neg { color: var(--color-error); }

/* ====== AVATAR ====== */
.avatar { position: relative; border-radius: 50%; overflow: hidden; flex-shrink: 0; }
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-placeholder {
  width: 100%; height: 100%;
  background: var(--color-primary-container); color: var(--color-on-primary-container);
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 13px;
}
.avatar-online {
  position: absolute; bottom: 0; right: 0;
  width: 12px; height: 12px;
  background: var(--color-success); border-radius: 50%;
  border: 2px solid var(--bg-page);
}

/* ====== SEARCH BAR ====== */
.search-wrap { position: relative; width: 100%; }
.search-input {
  width: 100%; height: 44px; padding: 0 16px 0 40px;
  background: var(--bg-surface-container-high);
  border: 1px solid var(--border-light); border-radius: var(--radius-sm);
  font-size: 13px; color: var(--color-text-primary);
  outline: none; transition: border-color 0.15s, box-shadow 0.15s;
}
.search-input::placeholder { color: var(--color-text-muted); }
.search-input:focus { border-color: var(--color-primary); box-shadow: 0 0 0 2px rgba(255, 177, 195, 0.2); }
.search-icon {
  position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
  width: 16px; height: 16px; color: var(--color-text-muted); pointer-events: none;
}
.search-clear {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  color: var(--color-text-muted); background: none; border: none;
  cursor: pointer; padding: 4px; display: flex;
  transition: color 0.15s;
}
.search-clear:hover { color: var(--color-text-primary); }
```

- [ ] **Step 2: Verify insertion**

Read `src/styles/index.css` lines 310-320 to confirm.

---

### Task 2: Update TrendingCard.jsx

**Files:**
- Modify: `src/components/cards/TrendingCard.jsx`

- [ ] **Step 1: Replace wrapper + rank badge + text colors**

Changes:
1. Line 22 wrapper: replace `"bg-[#F3F3F3] dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-[45px] p-4 shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#000] transition-all duration-200 cursor-pointer flex gap-4"` with `"card-neubrutal flex gap-4"`
2. Lines 12-16 rankColors: replace `rankColors = { 1: 'bg-yellow text-dark', 2: 'bg-lime text-dark', 3: 'bg-red text-[#191A23] dark:text-white' }` with `rankColors = { 1: 'card-trending-rank--gold', 2: 'card-trending-rank--silver', 3: 'card-trending-rank--bronze' }`
3. Line 29 rank badge: replace `` `shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${rankColors[rank] || 'bg-gray-200 dark:bg-dark-border text-gray-500 dark:text-text-muted'}` `` with `` `card-trending-rank ${rankColors[rank] || 'card-trending-rank--default'}` ``
4. Line 35: remove `text-[#191A23] dark:text-white` from author name span (keep `text-sm font-medium truncate`)
5. Line 36: replace `text-gray-500 dark:text-text-muted` with `text-var-color-text-muted` — keep as minimal inline `style={{color:'var(--color-text-muted)'}}` since there's no utility class
6. Lines 38-39: remove `text-[#191A23] dark:text-white` from title and content (inherit body color)
7. Line 40: replace `text-gray-500 dark:text-text-muted` with `style={{color:'var(--color-text-muted)'}}`

---

### Task 3: Update UserCard.jsx

**Files:**
- Modify: `src/components/cards/UserCard.jsx`

- [ ] **Step 1: Replace wrapper + buttons + text colors**

Changes:
1. Line 8 wrapper: replace the long Tailwind string with `"card-neubrutal"`
2. Line 12: replace `text-[#191A23] dark:text-white` with nothing (inherits body color)
3. Line 13: replace `text-gray-500 dark:text-text-muted` with `style={{color:'var(--color-text-muted)'}}`
4. Line 16: replace wrapper div with `"card-user-actions"`
5. Line 20 (Message btn): replace className with `"card-user-btn card-user-btn--solid"`
6. Line 28 (Pending btn): replace className with `"card-user-btn card-user-btn--disabled"`
7. Line 36 (Add Friend btn): replace className with `"card-user-btn card-user-btn--outline"`

---

### Task 4: Update NearbyCard.jsx

**Files:**
- Modify: `src/components/cards/NearbyCard.jsx`

- [ ] **Step 1: Replace wrapper + distance badge + buttons + text colors**

Changes:
1. Line 8 wrapper: replace long Tailwind string with `"card-neubrutal"`
2. Line 13: replace `text-[#191A23] dark:text-white` with nothing
3. Line 14: replace `text-gray-500 dark:text-text-muted` with `style={{color:'var(--color-text-muted)'}}`
4. Line 17 distance badge: replace `"shrink-0 px-3 py-1 bg-lime/10 text-lime text-xs font-semibold rounded-full border border-lime/20"` with `"card-nearby-distance"`
5. Line 23 (Add Friend): replace className with `"card-user-btn card-user-btn--outline"`
6. Line 31 (View Profile): replace className with `"card-user-btn card-user-btn--solid"`

---

### Task 5: Update StatCard.jsx

**Files:**
- Modify: `src/components/cards/StatCard.jsx`

- [ ] **Step 1: Replace wrapper + stat text + change indicators**

Changes:
1. Line 9 wrapper: replace long Tailwind string with `"card-neubrutal"`
2. Line 15: replace `text-2xl font-bold text-[#191A23] dark:text-white` with `"card-stat-value"`
3. Line 17: replace `text-sm text-gray-500 dark:text-text-muted` with `style={{fontSize:14,color:'var(--color-text-muted)'}}`
4. Line 20-22 change indicator: replace the className with `` `${isPositive ? 'card-stat-change card-stat-change--pos' : isNegative ? 'card-stat-change card-stat-change--neg' : ''}` ``

---

### Task 6: Update Modal.jsx

**Files:**
- Modify: `src/components/globals/Modal.jsx`

- [ ] **Step 1: Replace Tailwind classes with existing CSS classes**

Changes:
1. Line 4 sizes: keep as-is (returned JSX uses them in max-w-*)
2. Line 28 backdrop: replace `"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"` with `"modal-backdrop"`
3. Line 35 dialog: replace `` `w-full ${sizes[size]} bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl shadow-2xl modal-anim` `` with `` `modal w-full ${sizes[size]}` ``
4. Line 37 header: replace `"flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-border"` with `"modal-header"`
5. Line 38 title: replace `"text-lg font-semibold"` with `"modal-title"`
6. Line 41 close btn: replace `"w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-white hover:bg-white/5 transition-colors"` with `"modal-close"`
7. Line 49 body: replace `"p-6"` with `"modal-body"`

---

### Task 7: Update Avatar.jsx

**Files:**
- Modify: `src/components/globals/Avatar.jsx`

- [ ] **Step 1: Replace placeholder + online dot classes**

Changes:
1. Line 18 wrapper: add `avatar` class — replace `className={`relative rounded-full overflow-hidden shrink-0 ${sizes[size]}`}` with `className={`avatar ${sizes[size]}`}`
2. Line 27 placeholder div: replace `"w-full h-full bg-lime/20 text-lime flex items-center justify-center font-semibold text-sm"` with `"avatar-placeholder"`
3. Line 35 online dot: replace `"absolute bottom-0 right-0 w-3 h-3 bg-lime rounded-full ring-2 ring-dark-bg"` with `"avatar-online"`

---

### Task 8: Update SearchBar.jsx

**Files:**
- Modify: `src/components/globals/SearchBar.jsx`

- [ ] **Step 1: Replace input, icon, and clear button classes**

Changes:
1. Line 9 wrapper: add `search-wrap` — replace `"relative w-full"` with `"search-wrap"`
2. Line 10 icon: replace `"absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"` with `"search-icon"`
3. Line 19 input: replace the entire Tailwind string with `"search-input"`
4. Line 25 clear btn: replace `"absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#09090B] dark:text-text-gray dark:hover:text-white transition-colors"` with `"search-clear"`

---

### Task 9: Verify

- [ ] **Step 1: Build check**

Run build command and check for errors:
```
npm run build
```
(Verify no build errors)

- [ ] **Step 2: Visual check checklist**
- Open app in browser (layout shell already restyled)
- Navigate to pages that use these components:
  - Feed page: TrendingCard, StatCard, SearchBar
  - Friends page: UserCard
  - NearbyFriends page: NearbyCard
  - Any page with modal trigger: Modal
  - Any page with avatars: Avatar
- Confirm: no visual regressions, light and dark mode both look correct
- Confirm: hover effects work on cards
- Confirm: modal opens/closes correctly
- Confirm: search input accepts text and clears
- Confirm: avatar renders initials, images, and online dot
