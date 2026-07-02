# Documentation

## Requirement Analysis

The application is a social networking platform built with React, featuring:
- User authentication and profile management
- Social feed with posts, comments, and reactions
- Real-time trending content discovery
- Geolocation-based friend discovery
- Private messaging
- Full theme support (dark/light)

## System Architecture

### Tech Stack
- **Frontend**: React 18, React Router v6, Redux
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Build Tool**: Vite
- **Styling**: CSS Custom Properties (no UI framework)

### Data Flow
```
User Action → Component → Custom Hook → Firebase Service → Firestore
                                    ↕
                              Redux Store (optional)
```

## Folder Structure

```
src/
├── assets/             # Static assets
├── components/         # Reusable UI components
│   ├── buttons/        # Button variants (Button, IconButton, LinkButton)
│   ├── cards/          # Card components (PostCard, UserCard, StatCard, etc.)
│   ├── feedback/       # Feedback components (Toast, EmptyState, ErrorBoundary)
│   ├── forms/          # Form components (AuthForm, PostForm, ProfileForm, CommentForm)
│   ├── globals/        # Global components (Navbar, Sidebar, Modal, Avatar, etc.)
│   ├── hero/           # Landing page hero section
│   ├── layout/         # Layout components (Header, PageHeader, SectionHeader, DashboardHeader)
│   └── ui/             # UI utilities (ThemeToggle, SplashScreen, LoadingScreen)
├── constants/          # App constants (routes, roles, collections)
├── context/            # React context providers (ThemeContext)
├── firebase/           # Firebase configuration and SDK initialization
├── helpers/            # Firebase helper utilities
├── hoc/                # Higher-order components (ProtectedRoute, GuestRoute, AdminRoute, UserRoute)
├── hooks/              # Custom React hooks
├── layouts/            # Page layout components
├── pages/              # Page components (organized by domain)
│   ├── admin/          # Admin pages
│   ├── auth/           # Authentication pages
│   ├── home/           # Home pages (Feed, Landing, Trending)
│   ├── shared/         # Shared pages (404)
│   ├── social/         # Social pages (Messages, Profile, etc.)
│   └── user/           # User dashboard pages
├── redux/              # State management
│   ├── actions/        # Redux actions
│   ├── datatypes/      # Action type constants
│   ├── reducers/       # Redux reducers
│   └── store.js        # Redux store configuration
├── routes/             # Route definitions
├── services/           # Firebase service layer
├── styles/             # Global CSS
└── utils/              # Utility functions
```

## Routing Strategy

### Route Structure
- `/` - Landing page (public)
- `/login`, `/register` - Auth pages (guest only)
- `/feed` - Main feed (authenticated)
- `/trending` - Explore/trending posts (authenticated)
- `/post/:id` - Post detail (authenticated)
- `/profile/:uid` - User profile (authenticated)
- `/profile/edit` - Edit profile (authenticated)
- `/messages` - Private messages (authenticated)
- `/notifications` - Notifications (authenticated)
- `/nearby` - Nearby friends (authenticated)
- `/bookmarks` - Bookmarks (authenticated)
- `/settings` - Settings (authenticated)
- `/dashboard` - User dashboard (authenticated, user role)
- `/admin` - Admin panel (authenticated, admin role)
- `*` - 404 Not Found

### Route Guards
- **ProtectedRoute**: Redirects unauthenticated users to `/login` with `redirect` query param
- **GuestRoute**: Redirects authenticated users to `/feed`
- **UserRoute**: Requires user role
- **AdminRoute**: Requires admin role

### Deep Linking
Every page has a unique URL. Shared links navigate directly to content. Protected routes preserve the original destination and redirect back after login.

## State Management Approach

The app uses a hybrid approach:
1. **Custom Hooks** (usePosts, useAuth, useUsers, etc.): Handle local state and Firebase subscriptions
2. **Redux**: Global state for auth and cross-component communication
3. **useReducer**: Local complex state within hooks

## Component Organization

Components are organized by function:
- **Page Components**: Route-level pages, compose layouts + features
- **Feature Components**: PostCard, ProfileForm, etc.
- **UI Components**: Buttons, Avatar, Modal, Loader
- **Layout Components**: Define page structure (sidebar, content area, right panel)

## Reusable Hooks

| Hook | Purpose |
|------|---------|
| useAuth | Authentication state, login, register, logout |
| usePosts | Post CRUD, reactions, comments, real-time subscription |
| useUsers | User profiles, friend requests |
| useTheme | Dark/light theme toggle |
| useDebounce | Debounced value for search inputs |
| useGeolocation | Browser geolocation API wrapper |
| useModal | Modal open/close state management |
| useFirestore | Generic Firestore CRUD operations |
| useSearch | Debounced search with filtering |
| useTrending | Trending score calculation |
| useTasks | Task CRUD (user dashboard) |
| useNotes | Note CRUD (user dashboard) |

## Design Decisions

1. **CSS Custom Properties**: Enables seamless dark/light theme switching without CSS framework lock-in.
2. **Firebase Service Layer**: All Firebase calls go through service functions, keeping hooks clean.
3. **Mock Data + Real Data**: Dummy posts provide immediate UX while real data streams in via Firestore.
4. **Local Storage for Messages**: Allows instant messaging UI without requiring a real-time database.
5. **Haversine Distance**: Used for Nearby Friends - calculates great-circle distance between two GPS coordinates.

## Trending Algorithm

### Scoring Formula
```
trending_score = (reactionCount * 2) + viewCount
```

Where:
- `reactionCount`: Total number of reactions (likes, hearts, fires)
- `viewCount`: Number of post views
- Reactions are weighted 2x because they indicate stronger engagement

Posts are sorted by descending score. This algorithm favors posts with high engagement relative to views, surfacing content that resonates most with the community.

### Why This Approach
- Simple to compute and understand
- Reactions indicate active engagement vs passive views
- Works well with Firestore's lack of complex aggregation
- Can be computed client-side from existing data

## Search Implementation

Search is implemented as client-side filtering with debouncing:
1. User types in search input
2. Input is debounced by 300ms (useDebounce hook)
3. Filter runs against combined posts (dummy + real)
4. Matches against: title, content, authorName, tags
5. Results are sorted by the selected sort mode (trending/newest/popular)
6. Category filter can be combined with search

## Future Enhancements

- Server-side search with Algolia or Firebase Extensions
- Real-time chat with Firestore
- Push notifications via Firebase Cloud Messaging
- Image optimizations (lazy loading, WebP, CDN)
- Pagination for feed and profile posts
- User blocking and reporting system
- Content moderation tools for admins
- Post analytics for authors
