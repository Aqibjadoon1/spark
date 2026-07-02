# Feed Layout Rebuild & Unified Navigation Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace split navigation (UserLayout/MainLayout) with UnifiedLayout, rebuild Feed page with 3-column layout, add widget sidebar.

**Architecture:** UnifiedLayout wraps all authenticated routes with 280px left sidebar + content + optional 340px right sidebar. Feed gets 3-col; other pages get 2-col. Left sidebar uses text-nav pattern. Right sidebar shows widget cards on `/feed`.

**Tech Stack:** React 19, Vite, plain CSS, React Router, Redux, Firebase

---

### Task 1: Create LeftSidebar.jsx

**Files:**
- Create: `src/components/globals/LeftSidebar.jsx`

Full text-based navigation sidebar with SVG icons and active state. Items: Feed (⭐), Explore, Messages, Bookmarks, Notifications, Profile, Analytics, Settings, Logout.

- [ ] Create the component with `useNavigate`/`useLocation`/`useDispatch` + `signOut`
- [ ] Verify build

### Task 2: Create UnifiedLayout.jsx + Remove UserLayout.jsx

**Files:**
- Create: `src/layouts/UnifiedLayout.jsx`
- Remove: `src/layouts/UserLayout.jsx`

Navbar + 3-column grid (LeftSidebar | Outlet | conditional FeedRightSidebar). Right sidebar only on `/feed`.

- [ ] Create UnifiedLayout.jsx
- [ ] Delete UserLayout.jsx
- [ ] Verify build

### Task 3: Create FeedRightSidebar.jsx

**Files:**
- Create: `src/components/feed/FeedRightSidebar.jsx`

Widget cards: Trending Tags, Categories, Community Stats, Who to Follow.

- [ ] Create component
- [ ] Verify build

### Task 4: Rebuild Feed.jsx

**Files:**
- Modify: `src/pages/home/Feed.jsx`

Premium layout: heading, create post (glass card, PostForm), filters, timeline (PostCard), empty state (gradient icon, centered glass card), skeleton loaders. Preserve all business logic.

- [ ] Rewrite Feed.jsx with premium layout structure
- [ ] Verify build

### Task 5: Update index.css

**Files:**
- Modify: `src/styles/index.css`

Add: unified layout grid (280px minmax(700px,800px) 340px, max-width 1600px), left sidebar styles, feed page styles, widget styles, update responsive breakpoints. Remove old `.app-shell`/`.sidebar-left` classes.

- [ ] Add unified layout + left sidebar CSS
- [ ] Add feed page CSS (heading, create-post, filters, timeline, empty state)
- [ ] Add right sidebar widget CSS
- [ ] Remove old app-shell/sidebar-left styles
- [ ] Update responsive breakpoints
- [ ] Verify build

### Task 6: Update routes.jsx

**Files:**
- Modify: `src/routes/routes.jsx`

Replace UserLayout import with UnifiedLayout. Move feed route and all MainLayout routes under UnifiedLayout. Remove MainLayout route entry.

- [ ] Update routes to use UnifiedLayout for all authenticated user pages
- [ ] Remove MainLayout route entry (keep LandingLayout for `/`)
- [ ] Verify build
