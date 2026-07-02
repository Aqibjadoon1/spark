# Feed Layout Rebuild & Unified Navigation

## Motivation

The current app has split navigation: `UserLayout` (icon sidebar for feed/dashboard) vs `MainLayout` (no sidebar for profile/settings/etc.). The feed page has a large empty center area, the post composer lives in the wrong place, and the right sidebar is empty. This spec unifies navigation under one layout and rebuilds the feed page as a premium social media experience.

## Scope

- Replace `UserLayout` and `MainLayout` with single `UnifiedLayout`
- Rebuild `Feed.jsx` with premium components and proper hierarchy
- Add a full text-based left sidebar as the primary navigation for all pages
- Add widget content to the right sidebar (feed page only)
- Preserve ALL existing functionality: state, auth, routing, backend, hooks

## Layout

### Desktop Grid

```
┌──────────────────────────────────────────────────────────────┐
│                        Navbar (64px)                        │
├──────────┬────────────────────────────────┬─────────────────┤
│          │                                │                 │
│  Left    │         Feed Content           │  Right Sidebar  │
│ Sidebar  │         (760px)                │  (340px)        │
│ (280px)  │                                │                 │
│  Sticky  │  • Feed Heading                │  • Trending Tags│
│          │  • Create Post                 │  • Categories   │
│  Nav:    │  • Filters                     │  • Suggested Us.│
│  Feed ⭐ │  • Timeline/Posts              │  • Community    │
│  Explore │  • Pagination                  │  • Online Frien.│
│  Msgs    │  • Empty/Skeleton              │  • Who to Follow│
│  Bmarks  │                                │                 │
│  Notif   │                                │                 │
│  Profile │                                │                 │
│  Analytics│                               │                 │
│  Settings│                                │                 │
│  Logout  │                                │                 │
└──────────┴────────────────────────────────┴─────────────────┘
```

- Grid: `280px minmax(700px, 800px) 340px`
- Max width: `1600px`, `margin: 0 auto`
- Left sidebar: `position: sticky; top: 80px`
- Right sidebar: `position: sticky; top: 80px`

### Responsive

- `< 1200px`: Hide right sidebar, grid becomes `280px 1fr`
- `< 768px`: Hide left sidebar, grid becomes `1fr`, bottom nav appears
- No horizontal overflow at any width

## Left Sidebar

### Navigation Items (unified across all pages)

1. **Feed** — `/feed` (⭐ icon, highlighted when active)
2. **Explore** — `/trending`
3. **Messages** — `/messages` (placeholder)
4. **Bookmarks** — `/bookmarks`
5. **Notifications** — `/notifications` (placeholder)
6. **Profile** — `/profile`
7. **Analytics** — `/dashboard` (Dashboard renamed)
8. **Settings** — `/settings`

### Styling

- `#0B0B12` background, `1px solid rgba(255,255,255,0.06)` right border
- Each item: `flex`, `gap: 10px`, `padding: 10px 12px`, `border-radius: 8px`
- Default: `color: rgba(255,255,255,0.55)`, `font-size: 13px`, `font-weight: 600`
- Hover: `background: rgba(255,255,255,0.03)`, `color: rgba(255,255,255,0.85)`
- Active: `background: rgba(161,92,255,0.10)`, `color: #A15CFF`
- Icons: `16x16` SVG, `flex-shrink: 0`
- `position: sticky; top: 64px;`, `height: calc(100vh - 64px)`, `overflow-y: auto`
- Logo/brand section at top with "SPARK" text

## Main Feed (Feed.jsx)

### Component Hierarchy

```
Feed
├── Feed Heading (h1 "Feed" + subtitle)
├── CreatePost Card (glass, avatar, PostForm, gradient btn)
├── Filter Bar (SelectInput: category + sort)
├── Content Area:
│   ├── Loading → Skeleton (post variant, count 3)
│   ├── Empty → PremiumEmptyState (gradient icon, message, CTA)
│   └── Loaded → PostCard list + Pagination
```

### CreatePost

- Glass card: `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.06)`, `border-radius: 20px`, `backdrop-filter: blur(20px)`, `box-shadow: 0 20px 50px rgba(0,0,0,0.35)`
- Padding: `24px`
- Avatar + form side by side
- Submit button matches auth gradient (`#7B4DFF → #FF3FA7`)
- Hover lift effect on card

### PostCard (existing component, unchanged)

- Wrapped in glass card styling
- Spacing: `32px` between posts
- Hover: `transform: translateY(-2px)`, shadow elevation

### Empty State

- Centered, `padding: 80px 24px`
- Gradient icon (star/sparkle SVG with linear gradient stroke)
- Heading: "No posts yet"
- Subtitle: "Be the first to start the conversation."
- Glass card wrapper, large Create Post button (scrolls to top)

## Right Sidebar (Feed page only)

### Widgets (glass cards, same styling as above)

1. **Trending Tags** — Top tags from posts data, "More" link
2. **Popular Categories** — Category buttons, click to filter
3. **Suggested Users** — Placeholder cards with avatar + name + Follow btn
4. **Community Stats** — Total posts, active users, online now (hardcoded placeholders)
5. **Who to Follow** — Suggested users list

- All cards: `padding: 16px`, same glass/radius/blur as CreatePost
- Section headers with title + "See all" link

## Routes

Routes in `UnifiedLayout`:
- `/feed` → Feed page (3-column with right sidebar widgets)
- `/trending` → TrendingPosts (2-column, no right sidebar)
- `/post/:id` → PostDetail (2-column)
- `/profile/:uid` → PublicProfile (2-column)
- `/profile/edit` → EditProfile (2-column)
- `/nearby` → NearbyFriends (2-column)
- `/settings` → Settings (2-column)
- `/dashboard` → UserDashboard (2-column)
- `/dashboard/tasks` → UserTasks (2-column)
- `/dashboard/notes` → UserNotes (2-column)
- `/bookmarks` → Bookmarks (2-column, placeholder)
- `/messages` → Messages (2-column, placeholder)

Right sidebar visibility controlled by route (only shown for `/feed`).

## Files to Create

1. `src/layouts/UnifiedLayout.jsx` — Unified 3-column layout with sidebar + conditional right panel
2. `src/components/globals/LeftSidebar.jsx` — Full navigation sidebar component
3. `src/components/feed/FeedRightSidebar.jsx` — Widget sidebar for feed page

## Files to Modify

1. `src/pages/home/Feed.jsx` — Premium rebuild (composer, timeline, empty state)
2. `src/styles/index.css` — Grid layout, sidebar, feed, widget styles
3. `src/routes/routes.jsx` — Replace UserLayout/MainLayout with UnifiedLayout
4. `src/layouts/MainLayout.jsx` — Simplify to bare minimum or remove

## Files to Remove

1. `src/layouts/UserLayout.jsx` — Functionality merged into UnifiedLayout

## Constraints

- Preserve ALL existing imports, hooks, Redux, Firebase, auth, routing
- No changes to PostCard.jsx, PostForm.jsx, Pagination.jsx, SelectInput.jsx, Skeleton.jsx
- Use existing CSS custom properties where possible, add new classes in index.css
- Follow existing color palette: `#090914` bg, `#0F0F18` surfaces, `rgba(255,255,255,0.04)` glass, `#7B4DFF → #FF3FA7` buttons
- Font: Nunito body, Rajdhani headings
