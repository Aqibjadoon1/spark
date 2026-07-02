# Nexus — Social Network

A production-quality social networking web application built with React 19 + Firebase.

**Aesthetic:** Positivus × Digital Kensei — dark hero sections, lime green (#B9FF66) accents, hard-shadow glass morphism cards, oversized typography.

## Prerequisites

- Node.js 18+
- npm 9+
- A Firebase project with Authentication, Firestore, and Storage enabled

## Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication**:
   - Email/Password sign-in provider
   - Google sign-in provider
4. Create a **Firestore Database** (start in test mode, then apply rules)
5. Enable **Storage** (default bucket)
6. Register a web app to get your Firebase config

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Installation

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Firestore Rules Deployment

Deploy the Firestore security rules from `.firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

Or copy/paste the rules from below into the Firebase Console Firestore Rules tab.

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid;
    }
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.authorId
                           || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
    match /notes/{noteId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Build for Production

```bash
npm run build
```

Output is in the `dist/` directory.

## Tech Stack

- **Frontend:** React 19, Vite, React Router DOM v6, Redux Classic, Tailwind CSS v4
- **Backend:** Firebase Authentication, Firestore, Storage
- **State Management:** Classic Redux (createStore, applyMiddleware, combineReducers, redux-thunk)
- **Styling:** Tailwind CSS (no custom CSS files)

## Architecture

```
src/
├── firebase/       # Firebase initialization
├── hooks/          # All Firebase logic (useAuth, usePosts, useUsers, etc.)
├── hoc/            # Route guard HOCs (ProtectedRoute, AdminRoute, etc.)
├── layouts/        # Page layouts
├── pages/          # Page components by domain
├── components/     # Reusable UI components
├── redux/          # Classic Redux store
├── routes/         # Route configuration
├── services/       # Firebase SDK wrappers
├── constants/      # App constants
├── utils/          # Pure utility functions
└── helpers/        # Cross-cutting helpers
```

## Features

- **Authentication:** Email/password + Google OAuth, forgot/reset password, remember me, role-based access
- **Feed:** Real-time paginated post feed with category filter and sort options
- **Posts:** Create, edit, delete posts; emoji reactions; comments; view counting
- **Trending:** Algorithmic trending score with recency boost, top 20 ranked posts
- **Search:** Debounced client-side search across posts and users
- **Nearby Friends:** GPS-based friend discovery with fallback city input
- **Tasks:** CRUD task management with status/priority/filter/search (Admin + User)
- **Notes:** CRUD notes management with archive/pin/categories (Admin + User)
- **Admin Dashboard:** User management, role editing, site-wide content moderation
- **Dark/Light Theme:** Persistent theme toggle with localStorage
- **Responsive:** Desktop, tablet, mobile with native app feel
- **Accessible:** Keyboard navigation, ARIA labels, WCAG AA contrast

## Documentation

- See [DOCUMENTATION.md](DOCUMENTATION.md) for comprehensive technical documentation
- See [REPORT.md](REPORT.md) for development progress and known issues
