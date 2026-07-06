# Firebase Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move all app data (dummy users, posts, messages, notifications, analytics) into Firebase Firestore with auto-seeding, separate dummy/real collections, and full real-time functionality.

**Architecture:** Firestore collections `dummy_users`, `dummy_posts` with subcollections for comments, `conversations` with `messages` subcollection, `notifications` collection, `analytics` collection (daily docs). Seed runs automatically on first app init when `dummy_users` is empty.

**Tech Stack:** Firebase Firestore v12, React 19, React Hooks, Redux

---
### Task 0: Update Collection Constants

**Files:**
- Modify: `src/constants/firestoreCollections.js`

- [ ] **Step 1: Add new collection names**

```js
export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  TASKS: 'tasks',
  NOTES: 'notes',
  DUMMY_USERS: 'dummy_users',
  DUMMY_POSTS: 'dummy_posts',
  CONVERSATIONS: 'conversations',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics',
};
```

- [ ] **Step 2: Commit**

```bash
git add src/constants/firestoreCollections.js
git commit -m "feat: add dummy_users, dummy_posts, conversations, notifications, analytics collection constants"
```

---

### Task 1: Create seedData.js — Auto-Seed Dummy Data

**Files:**
- Create: `src/services/seedData.js`

- [ ] **Step 1: Write seedData.js**

```js
import { collection, getDocs, addDoc, doc, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import { COLLECTIONS } from '../constants/firestoreCollections';

const USERS = [
  { displayName: 'Sarah Chen', email: 'sarah@example.com', photoURL: '', bio: 'Full-stack developer passionate about AI', role: 'user', location: { lat: 40.7128, lng: -74.006, city: 'New York' } },
  { displayName: 'Marcus Johnson', email: 'marcus@example.com', photoURL: '', bio: 'Rust enthusiast and WASM wizard', role: 'user', location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco' } },
  { displayName: 'Emily Watson', email: 'emily@example.com', photoURL: '', bio: 'CSS artist and design system advocate', role: 'user', location: { lat: 51.5074, lng: -0.1278, city: 'London' } },
  { displayName: 'David Kim', email: 'david@example.com', photoURL: '', bio: 'Frontend engineer building design systems', role: 'user', location: { lat: 35.6762, lng: 139.6503, city: 'Tokyo' } },
  { displayName: 'Alex Rivera', email: 'alex@example.com', photoURL: '', bio: 'Edge computing and cloud infrastructure', role: 'user', location: { lat: 25.7617, lng: -80.1918, city: 'Miami' } },
];

const POSTS = [
  { title: 'The Future of AI in Web Development', content: 'AI is transforming how we build for the web. From intelligent code completion to automated accessibility audits, the tools we use are becoming smarter by the day.', tags: ['ai', 'webdev', 'future'], category: 'technology' },
  { title: 'Rust for Frontend Devs in 2026', content: 'After spending six months with Rust, I can confidently say it is worth the hype. The type system catches bugs that would slip through in JavaScript.', tags: ['rust', 'wasm', 'frontend'], category: 'technology' },
  { title: 'CSS Container Queries Are Finally Here', content: 'Container queries solve one of the biggest pain points in responsive design. No more media queries based on viewport — components can adapt to their parent container.', tags: ['css', 'responsive', 'design'], category: 'technology' },
  { title: 'Building a Design System with React', content: 'A design system is more than a component library — it is a shared language between design and engineering.', tags: ['design-system', 'react', 'frontend'], category: 'technology' },
  { title: 'Why Edge Computing Matters Now', content: 'Edge computing is not just about latency — it is about where your code runs. With edge functions, you can personalize content closer to your users.', tags: ['edge', 'cloud', 'performance'], category: 'technology' },
];

const COMMENTS = [
  'Great insights! Thanks for sharing.',
  'I completely agree with this perspective.',
  'Have you considered the performance implications?',
  'This is exactly what I needed to read today.',
  'Well written and thoroughly explained.',
];

const DUMMY_NOTIFICATIONS = [
  { type: 'like', fromUserName: 'Sarah Chen', fromUserPhoto: '', targetId: '', targetType: 'post', message: 'liked your post' },
  { type: 'follow', fromUserName: 'Marcus Johnson', fromUserPhoto: '', targetId: '', targetType: 'user', message: 'started following you' },
  { type: 'comment', fromUserName: 'Emily Watson', fromUserPhoto: '', targetId: '', targetType: 'comment', message: 'commented on your post' },
];

export const seedDummyData = async () => {
  const dummyUsersSnap = await getDocs(collection(db, COLLECTIONS.DUMMY_USERS));
  if (!dummyUsersSnap.empty) return;

  const batch = writeBatch(db);
  const userIds = [];

  for (const user of USERS) {
    const ref = doc(collection(db, COLLECTIONS.DUMMY_USERS));
    batch.set(ref, {
      ...user,
      friends: [],
      friendRequests: [],
      online: false,
      createdAt: serverTimestamp(),
    });
    userIds.push(ref.id);
  }

  await batch.commit();

  for (let i = 0; i < POSTS.length; i++) {
    const post = POSTS[i];
    const authorId = userIds[i % userIds.length];
    const author = USERS[i % USERS.length];

    const postRef = await addDoc(collection(db, COLLECTIONS.DUMMY_POSTS), {
      authorId,
      authorName: author.displayName,
      authorPhoto: '',
      title: post.title,
      content: post.content,
      image: '',
      tags: post.tags,
      category: post.category,
      reactions: {},
      commentsCount: 2,
      viewCount: Math.floor(Math.random() * 1000) + 100,
      reactionCount: Math.floor(Math.random() * 300) + 50,
      isEdited: false,
      createdAt: new Date(Date.now() - (i + 1) * 3600000),
    });

    const commentsRef = collection(db, COLLECTIONS.DUMMY_POSTS, postRef.id, 'comments');
    for (let j = 0; j < 2; j++) {
      const commentAuthor = USERS[(i + j + 1) % USERS.length];
      await addDoc(commentsRef, {
        authorId: userIds[(i + j + 1) % userIds.length],
        authorName: commentAuthor.displayName,
        authorPhoto: '',
        content: COMMENTS[(i * 2 + j) % COMMENTS.length],
        createdAt: new Date(Date.now() - (i + 1) * 3600000 + j * 60000),
      });
    }
  }

  const convRef = await addDoc(collection(db, COLLECTIONS.CONVERSATIONS), {
    participants: [userIds[0], userIds[1]],
    lastMessage: { text: 'Sounds great!', senderId: userIds[1], createdAt: serverTimestamp() },
    createdAt: serverTimestamp(),
  });

  const messagesRef = collection(db, COLLECTIONS.CONVERSATIONS, convRef.id, 'messages');
  const seedMessages = [
    { senderId: userIds[0], senderName: USERS[0].displayName, senderPhoto: '', text: 'Hey! How is the project going?', read: true, createdAt: new Date(Date.now() - 1800000) },
    { senderId: userIds[1], senderName: USERS[1].displayName, senderPhoto: '', text: 'Going well! Almost done with the redesign.', read: true, createdAt: new Date(Date.now() - 1750000) },
    { senderId: userIds[0], senderName: USERS[0].displayName, senderPhoto: '', text: 'Have you seen the new React docs?', read: true, createdAt: new Date(Date.now() - 1700000) },
    { senderId: userIds[1], senderName: USERS[1].displayName, senderPhoto: '', text: 'Sounds great!', read: false, createdAt: new Date(Date.now() - 600000) },
  ];

  for (const msg of seedMessages) {
    await addDoc(messagesRef, msg);
  }

  for (const notif of DUMMY_NOTIFICATIONS) {
    await addDoc(collection(db, COLLECTIONS.NOTIFICATIONS), {
      userId: userIds[0],
      type: notif.type,
      fromUserId: userIds[1],
      fromUserName: notif.fromUserName,
      fromUserPhoto: notif.fromUserPhoto,
      targetId: '',
      targetType: notif.targetType,
      message: notif.message,
      read: false,
      createdAt: serverTimestamp(),
    });
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add src/services/seedData.js
git commit -m "feat: add auto-seed script for dummy users, posts, comments, conversations, notifications"
```

---

### Task 2: Update postService.js — Support Both Collections

**Files:**
- Modify: `src/services/postService.js`

- [ ] **Step 1: Add `collectionName` param support to all functions**

Replace the hardcoded `'posts'` references with a param pattern. All CRUD functions get a `collectionName` param (default: `'posts'`).

```js
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import { COLLECTIONS } from '../constants/firestoreCollections';

const getPostRef = (collectionName = COLLECTIONS.POSTS) => collection(db, collectionName);
const getPostDocRef = (postId, collectionName = COLLECTIONS.POSTS) => doc(db, collectionName, postId);

export const createPost = async (postData, collectionName = COLLECTIONS.POSTS) => {
  try {
    const data = {
      authorId: postData.authorId,
      authorName: postData.authorName,
      authorPhoto: postData.authorPhoto,
      title: postData.title,
      content: postData.content,
      image: postData.image || '',
      tags: postData.tags || [],
      category: postData.category || '',
      reactions: {},
      commentsCount: 0,
      viewCount: 0,
      reactionCount: 0,
      isEdited: false,
      createdAt: serverTimestamp(),
    };
    return await addDoc(getPostRef(collectionName), data);
  } catch (error) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
};

export const updatePost = async (postId, updates, collectionName = COLLECTIONS.POSTS) => {
  try {
    await updateDoc(getPostDocRef(postId, collectionName), { ...updates, isEdited: true });
  } catch (error) {
    throw new Error(`Failed to update post: ${error.message}`);
  }
};

export const deletePost = async (postId, collectionName = COLLECTIONS.POSTS) => {
  try {
    await deleteDoc(getPostDocRef(postId, collectionName));
  } catch (error) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
};

export const getPosts = async (category, sortBy = 'createdAt', limitCount = 10, collectionName = COLLECTIONS.POSTS) => {
  try {
    const constraints = [];
    if (category) constraints.push(where('category', '==', category));
    constraints.push(orderBy(sortBy, 'desc'), limitCount);
    const q = query(getPostRef(collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data(), ...doc.data() }));
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }
};

export const getPostById = async (postId, collectionName = COLLECTIONS.POSTS) => {
  try {
    const snapshot = await getDoc(getPostDocRef(postId, collectionName));
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    throw new Error(`Failed to fetch post: ${error.message}`);
  }
};

export const subscribeToPosts = (callback, category, collectionName = COLLECTIONS.POSTS) => {
  try {
    const constraints = [];
    if (category) constraints.push(where('category', '==', category));
    constraints.push(orderBy('createdAt', 'desc'));
    const q = query(getPostRef(collectionName), ...constraints);
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      throw new Error(`Post subscription error: ${error.message}`);
    });
  } catch (error) {
    throw new Error(`Failed to subscribe to posts: ${error.message}`);
  }
};

export const reactToPost = async (postId, emoji, userId, collectionName = COLLECTIONS.POSTS) => {
  try {
    await updateDoc(getPostDocRef(postId, collectionName), {
      [`reactions.${emoji}`]: increment(1),
      reactionCount: increment(1),
    });
  } catch (error) {
    throw new Error(`Failed to react to post: ${error.message}`);
  }
};

export const removeReaction = async (postId, emoji, userId, collectionName = COLLECTIONS.POSTS) => {
  try {
    await updateDoc(getPostDocRef(postId, collectionName), {
      [`reactions.${emoji}`]: increment(-1),
      reactionCount: increment(-1),
    });
  } catch (error) {
    throw new Error(`Failed to remove reaction: ${error.message}`);
  }
};

export const addComment = async (postId, comment, collectionName = COLLECTIONS.POSTS) => {
  try {
    const commentsRef = collection(db, collectionName, postId, 'comments');
    await addDoc(commentsRef, { ...comment, createdAt: serverTimestamp() });
    await updateDoc(getPostDocRef(postId, collectionName), { commentsCount: increment(1) });
  } catch (error) {
    throw new Error(`Failed to add comment: ${error.message}`);
  }
};

export const incrementViewCount = async (postId, collectionName = COLLECTIONS.POSTS) => {
  try {
    await updateDoc(getPostDocRef(postId, collectionName), { viewCount: increment(1) });
  } catch (error) {
    throw new Error(`Failed to increment view count: ${error.message}`);
  }
};

export const getComments = async (postId, collectionName = COLLECTIONS.POSTS) => {
  try {
    const commentsRef = collection(db, collectionName, postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(`Failed to fetch comments: ${error.message}`);
  }
};
```

- [ ] **Step 2: Update all call sites to pass collectionName where needed**

In `src/pages/home/Feed.jsx`, `handleCreatePost` should use `'posts'` for real posts:
```js
const post = await createPost({ ... }, COLLECTIONS.POSTS);
```

In `src/pages/social/PostDetail.jsx` — check and update the `addComment` / `incrementViewCount` calls to pass the correct collection name.

- [ ] **Step 3: Commit**

```bash
git add src/services/postService.js
git commit -m "feat: add collectionName param to postService functions"
```

---

### Task 3: Update usePosts.js — Merge Real + Dummy Posts

**Files:**
- Modify: `src/hooks/usePosts.js`

- [ ] **Step 1: Replace single subscription with dual subscription**

```js
import { useReducer, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import * as postService from '../services/postService';
import {
  FETCH_POSTS_START,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  CREATE_POST_START,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  SET_POSTS,
  CLEAR_POSTS,
} from '../redux/datatypes/postTypes';
import { COLLECTIONS } from '../constants/firestoreCollections';

const initialState = {
  posts: [],
  loading: false,
  error: null,
  currentPost: null,
};

function postsReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_POSTS':
      return { ...state, posts: action.payload, loading: false, error: null };
    case 'SET_CURRENT_POST':
      return { ...state, currentPost: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

const usePosts = () => {
  const [state, localDispatch] = useReducer(postsReducer, initialState);
  const reduxDispatch = useDispatch();

  useEffect(() => {
    localDispatch({ type: 'SET_LOADING', payload: true });

    let unsub1, unsub2;
    let realPosts = [];
    let dummyPosts = [];

    const mergeAndDispatch = () => {
      const merged = [...realPosts, ...dummyPosts].sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : a.createdAt?.toDate?.()?.getTime() || 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : b.createdAt?.toDate?.()?.getTime() || 0;
        return bTime - aTime;
      });
      localDispatch({ type: 'SET_POSTS', payload: merged });
      reduxDispatch({ type: SET_POSTS, payload: merged });
    };

    const q1 = query(collection(db, COLLECTIONS.POSTS), orderBy('createdAt', 'desc'));
    unsub1 = onSnapshot(q1, (snapshot) => {
      realPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      mergeAndDispatch();
    }, (error) => {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
    });

    const q2 = query(collection(db, COLLECTIONS.DUMMY_POSTS), orderBy('createdAt', 'desc'));
    unsub2 = onSnapshot(q2, (snapshot) => {
      dummyPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      mergeAndDispatch();
    }, (error) => {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
    });

    return () => {
      if (unsub1) unsub1();
      if (unsub2) unsub2();
    };
  }, [reduxDispatch]);

  const fetchPosts = useCallback(async (category) => {
    reduxDispatch({ type: FETCH_POSTS_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const real = await postService.getPosts(category, undefined, undefined, COLLECTIONS.POSTS);
      const dummy = await postService.getPosts(category, undefined, undefined, COLLECTIONS.DUMMY_POSTS);
      const posts = [...real, ...dummy].sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return bTime - aTime;
      });
      reduxDispatch({ type: FETCH_POSTS_SUCCESS, payload: posts });
      localDispatch({ type: 'SET_POSTS', payload: posts });
    } catch (error) {
      reduxDispatch({ type: FETCH_POSTS_FAILURE, payload: error.message });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [reduxDispatch]);

  const createPost = useCallback(async (data) => {
    reduxDispatch({ type: CREATE_POST_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const post = await postService.createPost(data, COLLECTIONS.POSTS);
      reduxDispatch({ type: CREATE_POST_SUCCESS, payload: post });
      return post;
    } catch (error) {
      reduxDispatch({ type: CREATE_POST_FAILURE, payload: error.message });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const updatePost = useCallback(async (id, data) => {
    reduxDispatch({ type: FETCH_POSTS_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      await postService.updatePost(id, data);
      reduxDispatch({ type: UPDATE_POST_SUCCESS, payload: { id, ...data } });
    } catch (error) {
      reduxDispatch({ type: UPDATE_POST_FAILURE, payload: error.message });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const deletePost = useCallback(async (id) => {
    reduxDispatch({ type: FETCH_POSTS_START });
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      await postService.deletePost(id);
      reduxDispatch({ type: DELETE_POST_SUCCESS, payload: id });
    } catch (error) {
      reduxDispatch({ type: DELETE_POST_FAILURE, payload: error.message });
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [reduxDispatch]);

  const reactToPost = useCallback(async (id, emoji, collectionName) => {
    try {
      await postService.reactToPost(id, emoji, undefined, collectionName);
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const removeReaction = useCallback(async (id, emoji, collectionName) => {
    try {
      await postService.removeReaction(id, emoji, undefined, collectionName);
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const addComment = useCallback(async (id, comment, collectionName) => {
    try {
      await postService.addComment(id, comment, collectionName);
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const getPostById = useCallback(async (id, collectionName) => {
    localDispatch({ type: 'SET_LOADING', payload: true });
    try {
      const post = await postService.getPostById(id, collectionName);
      localDispatch({ type: 'SET_CURRENT_POST', payload: post });
      return post;
    } catch (error) {
      localDispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);

  const incrementViews = useCallback(async (id, collectionName) => {
    try {
      await postService.incrementViewCount(id, collectionName);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  }, []);

  const clearPosts = useCallback(() => {
    localDispatch({ type: 'SET_POSTS', payload: [] });
    reduxDispatch({ type: CLEAR_POSTS });
  }, [reduxDispatch]);

  return {
    posts: state.posts,
    loading: state.loading,
    error: state.error,
    currentPost: state.currentPost,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    reactToPost,
    removeReaction,
    addComment,
    getPostById,
    incrementViews,
    clearPosts,
  };
};

export default usePosts;
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/usePosts.js
git commit -m "feat: merge real and dummy posts in usePosts hook"
```

---

### Task 4: Update Feed.jsx — Remove Hardcoded Dummy Posts

**Files:**
- Modify: `src/pages/home/Feed.jsx`

- [ ] **Step 1: Remove `dummyPosts` constant and adjust `allPosts`**

Delete lines 11-17 (the `dummyPosts` array). Change `const allPosts = [...dummyPosts, ...posts]` to just `const allPosts = [...posts]`. The dummy posts are now included in the `posts` array from the hook (merged in `usePosts`).

Keep everything else unchanged.

- [ ] **Step 2: Commit**

```bash
git add src/pages/home/Feed.jsx
git commit -m "feat: remove hardcoded dummy posts, use merged real+dummy from hook"
```

---

### Task 5: Create notificationService.js

**Files:**
- Create: `src/services/notificationService.js`

- [ ] **Step 1: Write notificationService.js**

```js
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import { COLLECTIONS } from '../constants/firestoreCollections';

const notifRef = () => collection(db, COLLECTIONS.NOTIFICATIONS);

export const createNotification = async (data) => {
  try {
    const docRef = await addDoc(notifRef(), {
      userId: data.userId,
      type: data.type,
      fromUserId: data.fromUserId,
      fromUserName: data.fromUserName,
      fromUserPhoto: data.fromUserPhoto || '',
      targetId: data.targetId || '',
      targetType: data.targetType || '',
      message: data.message,
      read: false,
      createdAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

export const markNotificationRead = async (notifId) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, notifId), { read: true });
  } catch (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
};

export const markAllNotificationsRead = async (userId) => {
  try {
    const q = query(notifRef(), where('userId', '==', userId), where('read', '==', false));
    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map((d) => updateDoc(doc(db, COLLECTIONS.NOTIFICATIONS, d.id), { read: true }));
    await Promise.all(updates);
  } catch (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }
};

export const subscribeToNotifications = (userId, callback) => {
  try {
    const q = query(notifRef(), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(notifs);
    }, (error) => {
      throw new Error(`Notification subscription error: ${error.message}`);
    });
  } catch (error) {
    throw new Error(`Failed to subscribe to notifications: ${error.message}`);
  }
};

export const getUnreadCount = async (userId) => {
  try {
    const q = query(notifRef(), where('userId', '==', userId), where('read', '==', false));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    throw new Error(`Failed to get unread count: ${error.message}`);
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add src/services/notificationService.js
git commit -m "feat: add notificationService for Firestore notifications"
```

---

### Task 6: Rewrite Notifications.jsx — Use Firestore + Category Filters

**Files:**
- Modify: `src/pages/social/Notifications.jsx`

- [ ] **Step 1: Rewrite Notifications.jsx**

```jsx
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { subscribeToNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/notificationService';

const iconMap = {
  like: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="#FF3C9D" stroke="#FF3C9D" strokeWidth="2"/></svg>,
  follow: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" stroke="#7B4DFF" strokeWidth="2"/></svg>,
  comment: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="#A15CFF" strokeWidth="2"/></svg>,
  mention: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" stroke="#4A6CFF" strokeWidth="2"/></svg>,
  system: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#A15CFF" strokeWidth="2"/></svg>,
};

const NOTIF_COLORS = {
  like: '#FF3C9D',
  follow: '#7B4DFF',
  comment: '#A15CFF',
  mention: '#4A6CFF',
  system: '#A15CFF',
};

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const d = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString();
};

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => { document.title = 'Notifications | Spark'; }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToNotifications(user.uid, setNotifications);
    return () => unsub();
  }, [user?.uid]);

  const filtered = activeFilter === 'all'
    ? notifications
    : notifications.filter((n) => n.type === activeFilter);

  const unreadAll = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id) => {
    try { await markNotificationRead(id); } catch {}
  };

  const handleMarkAllRead = async () => {
    try { await markAllNotificationsRead(user?.uid); } catch {}
  };

  return (
    <div className="feed">
      <div className="feed-heading">
        <h1 className="feed-title">Notifications</h1>
        <p className="feed-subtitle">Stay updated with your community</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {['all', 'like', 'follow', 'comment', 'mention', 'system'].map((type) => (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border-light)',
              background: activeFilter === type ? 'linear-gradient(135deg, #7B4DFF, #FF3C9D)' : 'var(--bg-glass)',
              color: activeFilter === type ? '#fff' : 'var(--color-text-primary)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {type === 'all' ? `All (${unreadAll})` : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
        {unreadAll > 0 && (
          <button onClick={handleMarkAllRead} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 20, border: '1px solid var(--border-light)', background: 'var(--bg-glass)', color: 'var(--color-text-primary)', fontSize: 12, cursor: 'pointer' }}>
            Mark all read
          </button>
        )}
      </div>

      {filtered.map((n) => (
        <div
          key={n.id}
          onClick={() => { if (!n.read) handleMarkRead(n.id); }}
          className="feed-post-wrapper"
          style={{
            padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
            opacity: n.read ? 0.6 : 1,
          }}
        >
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: `linear-gradient(135deg, ${NOTIF_COLORS[n.type] || '#7B4DFF'}, var(--border-medium))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            fontSize: 13, fontWeight: 700, color: 'var(--color-text-white)',
          }}>
            {(n.fromUserName || '?').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.4 }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>{n.fromUserName}</strong>{' '}{n.message}
              {n.targetId && <><br /><span style={{ color: 'var(--color-primary-light)', fontSize: 13 }}>related content</span></>}
            </p>
            <span style={{ fontSize: 12, color: 'var(--color-text-placeholder)', marginTop: 2, display: 'block' }}>
              {formatTime(n.createdAt)}
            </span>
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: 'var(--bg-glass)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            {iconMap[n.type]}
          </div>
        </div>
      ))}
      {filtered.length === 0 && (
        <p style={{ color: 'var(--color-text-placeholder)', textAlign: 'center', padding: 40 }}>No notifications yet</p>
      )}
    </div>
  );
};

export default Notifications;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/social/Notifications.jsx
git commit -m "feat: rewrite Notifications with Firestore backend and category filters"
```

---

### Task 7: Create messageService.js

**Files:**
- Create: `src/services/messageService.js`

- [ ] **Step 1: Write messageService.js**

```js
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import { COLLECTIONS } from '../constants/firestoreCollections';

export const createConversation = async (participants) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CONVERSATIONS), {
      participants,
      lastMessage: { text: '', senderId: '', createdAt: serverTimestamp() },
      createdAt: serverTimestamp(),
    });
    return docRef;
  } catch (error) {
    throw new Error(`Failed to create conversation: ${error.message}`);
  }
};

export const sendMessage = async (conversationId, senderId, senderName, senderPhoto, text) => {
  try {
    const msgRef = collection(db, COLLECTIONS.CONVERSATIONS, conversationId, 'messages');
    const msgDoc = await addDoc(msgRef, {
      senderId,
      senderName,
      senderPhoto: senderPhoto || '',
      text,
      read: false,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, conversationId), {
      lastMessage: { text, senderId, createdAt: serverTimestamp() },
    });
    return msgDoc;
  } catch (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
};

export const subscribeToConversations = (userId, callback) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CONVERSATIONS),
      where('participants', 'array-contains', userId),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(convs);
    }, (error) => {
      throw new Error(`Conversation subscription error: ${error.message}`);
    });
  } catch (error) {
    throw new Error(`Failed to subscribe to conversations: ${error.message}`);
  }
};

export const subscribeToMessages = (conversationId, callback) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CONVERSATIONS, conversationId, 'messages'),
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(msgs);
    }, (error) => {
      throw new Error(`Messages subscription error: ${error.message}`);
    });
  } catch (error) {
    throw new Error(`Failed to subscribe to messages: ${error.message}`);
  }
};

export const markMessagesRead = async (conversationId, userId) => {
  try {
    const q = query(
      collection(db, COLLECTIONS.CONVERSATIONS, conversationId, 'messages'),
      where('read', '==', false),
      where('senderId', '!=', userId)
    );
    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map((d) => updateDoc(doc(db, COLLECTIONS.CONVERSATIONS, conversationId, 'messages', d.id), { read: true }));
    await Promise.all(updates);
  } catch (error) {
    throw new Error(`Failed to mark messages read: ${error.message}`);
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add src/services/messageService.js
git commit -m "feat: add messageService for Firestore conversations and messages"
```

---

### Task 8: Rewrite Messages.jsx — Use Firestore Instead of localStorage

**Files:**
- Modify: `src/pages/social/Messages.jsx`

- [ ] **Step 1: Rewrite Messages.jsx**

```jsx
import { useState, useEffect, useRef } from 'react';
import useAuth from '../../hooks/useAuth';
import {
  subscribeToConversations,
  subscribeToMessages,
  sendMessage,
  createConversation,
  markMessagesRead,
} from '../../services/messageService';
import { subscribeToNotifications } from '../../services/notificationService';

const formatTime = (timestamp) => {
  if (!timestamp) return '';
  const d = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = Date.now() - d.getTime();
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString();
};

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => { document.title = 'Messages | Spark'; }, []);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToConversations(user.uid, setConversations);
    return () => unsub();
  }, [user?.uid]);

  useEffect(() => {
    if (!selectedId) return;
    const unsub = subscribeToMessages(selectedId, setMessages);
    markMessagesRead(selectedId, user?.uid);
    return () => unsub();
  }, [selectedId, user?.uid]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selected = conversations.find((c) => c.id === selectedId);

  const handleSend = async () => {
    if (!input.trim() || !selectedId) return;
    try {
      await sendMessage(selectedId, user?.uid, user?.displayName || user?.name || 'User', user?.photoURL || '', input.trim());
      setInput('');
    } catch {}
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const unreadCount = (convId) => {
    return 0;
  };

  const getOtherParticipant = (conv) => {
    if (!conv?.participants || !user?.uid) return { name: 'Unknown', avatar: '?', color: '#7B4DFF', online: false };
    const otherId = conv.participants.find((p) => p !== user?.uid);
    return { name: conv.lastMessage?.senderId === otherId ? 'User' : 'Unknown', avatar: otherId?.charAt(0)?.toUpperCase() || '?', color: '#7B4DFF', online: false, uid: otherId };
  };

  return (
    <div className="feed" style={{ height: 'calc(100vh - 140px)' }}>
      <div className="feed-heading">
        <h1 className="feed-title">Messages</h1>
        <p className="feed-subtitle">Private conversations</p>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0, background: 'var(--bg-glass)', borderRadius: 20, border: '1px solid var(--border-light)', overflow: 'hidden' }}>
        <div style={{ width: 280, flexShrink: 0, borderRight: '1px solid var(--border-light)', overflowY: 'auto' }}>
          {conversations.map((c) => {
            const other = getOtherParticipant(c);
            return (
              <div
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                style={{
                  padding: '12px 16px', cursor: 'pointer',
                  background: selectedId === c.id ? 'var(--bg-sidebar-active)' : 'transparent',
                  borderLeft: selectedId === c.id ? '2px solid var(--color-primary-light)' : '2px solid transparent',
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${other.color}, var(--border-medium))`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: 'var(--color-text-white)',
                  }}>
                    {other.avatar}
                  </div>
                  {other.online && (
                    <div style={{
                      position: 'absolute', bottom: 0, right: 0, width: 10, height: 10,
                      borderRadius: '50%', background: '#00C9B1',
                      border: '2px solid var(--bg-surface)',
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-primary)' }}>{other.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-text-placeholder)' }}>{c.lastMessage?.createdAt ? formatTime(c.lastMessage.createdAt) : ''}</span>
                  </div>
                  <p style={{
                    fontSize: 12, color: 'var(--color-text-subtitle)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0,
                  }}>
                    {c.lastMessage?.text || 'No messages yet'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {selected ? (
            <>
              <div style={{
                padding: '14px 20px', borderBottom: '1px solid var(--border-light)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${getOtherParticipant(selected).color}, var(--border-medium))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'var(--color-text-white)', flexShrink: 0,
                }}>
                  {getOtherParticipant(selected).avatar}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{getOtherParticipant(selected).name}</div>
                </div>
              </div>

              <div style={{
                flex: 1, padding: 20, overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}>
                {messages.map((msg) => {
                  const fromMe = msg.senderId === user?.uid;
                  return (
                    <div key={msg.id} style={{ display: 'flex', justifyContent: fromMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '70%', padding: '10px 16px',
                        borderRadius: fromMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: fromMe ? 'linear-gradient(135deg, #7B4DFF, #A15CFF)' : 'var(--border-light)',
                        fontSize: 13,
                        color: fromMe ? 'var(--color-text-white)' : 'var(--color-text-primary)',
                        lineHeight: 1.5,
                      }}>
                        <p style={{ margin: 0 }}>{msg.text}</p>
                        <div style={{
                          fontSize: 10,
                          color: fromMe ? 'var(--color-text-secondary)' : 'var(--color-text-placeholder)',
                          textAlign: 'right', marginTop: 4,
                        }}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              <div style={{
                padding: '12px 20px', borderTop: '1px solid var(--border-light)',
                display: 'flex', gap: 10,
              }}>
                <input
                  type="text" value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  style={{
                    flex: 1, padding: '12px 16px', borderRadius: 14,
                    background: 'var(--bg-surface-raised)',
                    border: '1px solid var(--border-light)',
                    color: 'var(--color-text-white)', fontSize: 13, outline: 'none',
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  style={{
                    padding: '10px 24px', borderRadius: 14, border: 'none',
                    background: 'linear-gradient(135deg, #7B4DFF, #FF3C9D)',
                    color: 'var(--color-text-white)', fontSize: 13, fontWeight: 600,
                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                    opacity: input.trim() ? 1 : 0.4,
                    boxShadow: input.trim() ? '0 4px 15px rgba(255,70,180,0.20)' : 'none',
                  }}
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-text-placeholder)', fontSize: 14,
            }}>
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/social/Messages.jsx
git commit -m "feat: rewrite Messages with Firestore backend replacing localStorage"
```

---

### Task 9: Create analyticsService.js

**Files:**
- Create: `src/services/analyticsService.js`

- [ ] **Step 1: Write analyticsService.js**

```js
import { doc, setDoc, getDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import { COLLECTIONS } from '../constants/firestoreCollections';

const getDateKey = () => new Date().toISOString().split('T')[0];

const ensureDailyDoc = async (dateKey) => {
  const ref = doc(db, COLLECTIONS.ANALYTICS, dateKey);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      date: dateKey,
      postCategories: { technology: 0, lifestyle: 0, sports: 0, entertainment: 0, general: 0 },
      userActivity: { registrations: 0, logins: 0, postsCreated: 0, commentsMade: 0 },
      createdAt: serverTimestamp(),
    });
  }
  return ref;
};

export const trackPostCreated = async (category) => {
  try {
    const dateKey = getDateKey();
    const ref = await ensureDailyDoc(dateKey);
    const field = `postCategories.${category}`;
    await updateDoc(ref, { [field]: increment(1), 'userActivity.postsCreated': increment(1) });
  } catch (error) {
    console.error('Analytics trackPostCreated error:', error);
  }
};

export const trackLogin = async () => {
  try {
    const dateKey = getDateKey();
    const ref = await ensureDailyDoc(dateKey);
    await updateDoc(ref, { 'userActivity.logins': increment(1) });
  } catch (error) {
    console.error('Analytics trackLogin error:', error);
  }
};

export const trackRegistration = async () => {
  try {
    const dateKey = getDateKey();
    const ref = await ensureDailyDoc(dateKey);
    await updateDoc(ref, { 'userActivity.registrations': increment(1) });
  } catch (error) {
    console.error('Analytics trackRegistration error:', error);
  }
};

export const trackComment = async () => {
  try {
    const dateKey = getDateKey();
    const ref = await ensureDailyDoc(dateKey);
    await updateDoc(ref, { 'userActivity.commentsMade': increment(1) });
  } catch (error) {
    console.error('Analytics trackComment error:', error);
  }
};

export const getAnalytics = async (dateKey) => {
  try {
    const ref = doc(db, COLLECTIONS.ANALYTICS, dateKey || getDateKey());
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    throw new Error(`Failed to fetch analytics: ${error.message}`);
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add src/services/analyticsService.js
git commit -m "feat: add analyticsService for tracking post categories and user activity"
```

---

### Task 10: Wire Up Seed + Analytics in App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Import and call seed + track login**

```jsx
import { useState, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/firebaseSDK';
import { setUser, setAuthLoading } from './redux/actions/authActions';
import routes from './routes/routes.jsx';
import Loader from './components/globals/Loader';
import SplashScreen from './components/ui/SplashScreen';
import { seedDummyData } from './services/seedData';
import { trackLogin } from './services/analyticsService';
import { COLLECTIONS } from './constants/firestoreCollections';

const AppRoutes = () => useRoutes(routes);

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(s => s.auth);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    seedDummyData();
  }, []);

  useEffect(() => {
    dispatch(setAuthLoading(true));
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snap = await getDoc(doc(db, COLLECTIONS.USERS, user.uid));
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: snap.exists() ? snap.data().role : 'user',
        }));
        trackLogin();
      } else {
        dispatch(setUser(null));
      }
      dispatch(setAuthLoading(false));
    });
    return () => unsub();
  }, [dispatch]);

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;
  if (loading) return <Loader fullScreen />;
  return (
    <Suspense fallback={<Loader fullScreen />}>
      <AppRoutes />
    </Suspense>
  );
};

export default App;
```

- [ ] **Step 2: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire up seed data and login analytics tracking in App"
```

---

### Task 11: Integrate Analytics Tracking into Post/Login/Register Flows

**Files:**
- Modify: `src/pages/auth/Register.jsx` – call `trackRegistration()` on success
- Modify: `src/pages/home/Feed.jsx` – call `trackPostCreated(category)` after createPost

- [ ] **Step 1: Add trackRegistration to Register.jsx**

Import:
```js
import { trackRegistration } from '../../services/analyticsService';
```

After successful registration (before toast), add:
```js
trackRegistration();
```

- [ ] **Step 2: Add trackPostCreated to Feed.jsx**

Import:
```js
import { trackPostCreated } from '../../services/analyticsService';
```

In `handleCreatePost`, after successful `createPost`, add:
```js
if (data.category) trackPostCreated(data.category);
```

- [ ] **Step 3: Add trackComment to PostDetail.jsx**

Import in PostDetail.jsx:
```js
import { trackComment } from '../../services/analyticsService';
```

In the comment handler, after `addComment` succeeds:
```js
trackComment();
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/auth/Register.jsx src/pages/home/Feed.jsx src/pages/social/PostDetail.jsx
git commit -m "feat: integrate analytics tracking into post creation, registration, and comments"
```

---

### Task 12: Update Firestore Security Rules

**Files:**
- Modify: `firestore.rules`

- [ ] **Step 1: Add rules for new collections**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == uid;
    }
    match /dummy_users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && (request.auth.uid == resource.data.authorId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'moderator']);
    }
    match /posts/{postId}/comments/{commentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    match /dummy_posts/{postId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /dummy_posts/{postId}/comments/{commentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    match /tasks/{taskId} {
      allow read, write: if request.auth != null;
    }
    match /notes/{noteId} {
      allow read, write: if request.auth != null;
    }
    match /conversations/{convId} {
      allow read, write: if request.auth != null && request.auth.uid in resource.data.participants;
    }
    match /conversations/{convId}/messages/{msgId} {
      allow read, write: if request.auth != null;
    }
    match /notifications/{notifId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow write: if request.auth != null;
    }
    match /analytics/{date} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add firestore.rules
git commit -m "feat: update Firestore rules for new collections (dummy_users, dummy_posts, conversations, notifications, analytics)"
```

---

### Task 13: Redeploy to Vercel

- [ ] **Step 1: Deploy**

```bash
npx vercel -y --prod
```
