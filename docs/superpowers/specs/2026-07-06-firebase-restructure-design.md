# Firebase Restructure — Dummy Data + Full Firestore Integration

## Goal

Move all app data from localStorage/hardcoded sources into Firebase Firestore, add auto-seeded dummy users/posts, and make notifications, messages, and analytics fully functional with categories.

## Collections (Approach 2 — Separate Namespaces)

| Collection | Purpose |
|---|---|
| `users/{uid}` | Real user profiles (existing) |
| `dummy_users/{uid}` | Dummy user profiles (new) |
| `posts/{postId}` | Real posts with comments subcollection (existing) |
| `dummy_posts/{postId}` | Dummy posts with comments subcollection (new) |
| `conversations/{convId}` | Chat conversations with `messages` subcollection (new, replaces localStorage) |
| `notifications/{notifId}` | All notifications scoped by `userId` (new, replaces hardcoded) |
| `analytics/{YYYY-MM-DD}` | Daily aggregated stats (new) |

### User Schema (`users` / `dummy_users`)

```
{
  displayName, email, photoURL, bio,
  role: 'user' | 'admin' | 'moderator',
  friends: [uid, ...],
  friendRequests: [uid, ...],
  visibility: 'public' | 'private',
  notificationPreferences: { likes, comments, friendRequests, messages },
  location: { lat, lng, city },
  socialLinks: { twitter, github, linkedin, website },
  online: boolean,
  createdAt: serverTimestamp
}
```

### Post Schema (`posts` / `dummy_posts`)

```
{
  authorId, authorName, authorPhoto,
  title, content, image,
  tags: [],
  category: 'general' | 'technology' | 'lifestyle' | 'entertainment' | 'sports',
  reactions: { '❤️': 0, '🔥': 0, '👍': 0 },
  reactionCount: 0,
  commentsCount: 0,
  viewCount: 0,
  isEdited: false,
  createdAt: serverTimestamp
}
```

### Comment Schema (`posts/{postId}/comments` / `dummy_posts/{postId}/comments`)

```
{
  authorId, authorName, authorPhoto,
  content,
  createdAt: serverTimestamp
}
```

### Conversation Schema

`conversations/{convId}`:
```
{
  participants: [uid1, uid2, ...],
  lastMessage: { text, senderId, createdAt },
  createdAt: serverTimestamp
}
```

`conversations/{convId}/messages/{msgId}`:
```
{
  senderId, senderName, senderPhoto,
  text,
  read: false,
  createdAt: serverTimestamp
}
```

### Notification Schema

```
{
  userId,           // recipient
  type: 'like' | 'follow' | 'comment' | 'mention' | 'system',
  fromUserId,
  fromUserName,
  fromUserPhoto,
  targetId,
  targetType: 'post' | 'user' | 'comment',
  message,
  read: false,
  createdAt: serverTimestamp
}
```

### Analytics Schema

`analytics/{YYYY-MM-DD}`:
```
{
  date: string,
  postCategories: { technology: 0, lifestyle: 0, sports: 0, entertainment: 0, general: 0 },
  userActivity: { registrations: 0, logins: 0, postsCreated: 0, commentsMade: 0 }
}
```

## Auto-Seed (`seedData.js`)

On app init, check if `dummy_users` collection is empty. If so, batch-write:
- 5 dummy users with realistic names, avatars, bios, locations
- 5 dummy posts assigned to random dummy users
- 2-3 comments per dummy post
- 1 conversation between 2 dummy users with 3-4 messages
- 2-3 notifications for a dummy user

Uses `writeBatch` for atomicity. Runs once per Firestore project lifetime.

## Services

### New services
- **`messageService.js`** — CRUD for conversations + messages subcollection, real-time subscription
- **`notificationService.js`** — create, mark read, mark all read, subscribe by userId, filter by type
- **`analyticsService.js`** — `trackPostCreated(category)`, `trackLogin()`, `trackRegistration()`, `trackComment()` — all use `increment()` on the daily doc
- **`seedData.js`** — auto-seed logic, called from App.jsx

### Updated services
- **`postService.js`** — add `collectionName` param (`'posts'` | `'dummy_posts'`) to all CRUD functions; Feed queries both collections and merges results
- **`usePosts.js`** — subscribe to both `posts` + `dummy_posts`, merge + sort by `createdAt`
- **`useUsers.js`** — also subscribe to `dummy_users` for nearby friends, friend suggestions

## Feed Behavior

- Feed subscribes to both `posts` and `dummy_posts` collections
- Merges results into a single sorted array (by `createdAt` desc)
- Dummy posts are rendered with the same `PostCard` component
- A small "Dummy" badge/tag can optionally distinguish them

## Firestore Rules Update

```
match /dummy_users/{uid}      { read/write if authenticated }
match /dummy_posts/{pid}      { read/write if authenticated }
match /dummy_posts/{pid}/comments/{cid} { read/write if authenticated }
match /conversations/{cid}    { read/write if participant }
match /conversations/{cid}/messages/{mid} { read/write if participant }
match /notifications/{nid}    { read/write if userId == auth.uid }
match /analytics/{date}       { read if authenticated; write if admin }
```

## Component Updates

| Component | Change |
|---|---|
| `Feed.jsx` | Remove `dummyPosts` constant, use merged real+dummy from hook |
| `Messages.jsx` | Remove localStorage, use `messageService` with real-time listener |
| `Notifications.jsx` | Remove hardcoded data, use `notificationService` with filter tabs |
| `Bookmarks.jsx` | (future — no changes) |
| `AdminDashboard.jsx` | Display analytics from `analytics` collection |

## Implementation Order

1. `seedData.js` + dummy collections + auto-seed in `App.jsx`
2. Update `postService.js` to support both `posts` / `dummy_posts`
3. Update `usePosts.js` to merge both collections
4. Update `Feed.jsx` to remove hardcoded dummy posts
5. `notificationService.js` + `Notifications.jsx` rewrite
6. `messageService.js` + `Messages.jsx` rewrite
7. `analyticsService.js` + integrate into post creation, login, registration
8. Firestore rules update
