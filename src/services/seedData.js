import { collection, getDocs, addDoc, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseSDK';
import { COLLECTIONS } from '../constants/firestoreCollections';

const DUMMY_USERS = [
  { displayName: 'Sarah Chen', email: 'sarah@example.com', photoURL: '', bio: 'Full-stack developer passionate about AI', role: 'user', location: { lat: 40.7128, lng: -74.006, city: 'New York' } },
  { displayName: 'Marcus Johnson', email: 'marcus@example.com', photoURL: '', bio: 'Rust enthusiast and WASM wizard', role: 'user', location: { lat: 37.7749, lng: -122.4194, city: 'San Francisco' } },
  { displayName: 'Emily Watson', email: 'emily@example.com', photoURL: '', bio: 'CSS artist and design system advocate', role: 'user', location: { lat: 51.5074, lng: -0.1278, city: 'London' } },
  { displayName: 'David Kim', email: 'david@example.com', photoURL: '', bio: 'Frontend engineer building design systems', role: 'user', location: { lat: 35.6762, lng: 139.6503, city: 'Tokyo' } },
  { displayName: 'Alex Rivera', email: 'alex@example.com', photoURL: '', bio: 'Edge computing and cloud infrastructure', role: 'user', location: { lat: 25.7617, lng: -80.1918, city: 'Miami' } },
];

const DUMMY_POSTS = [
  { title: 'The Future of AI in Web Development', content: 'AI is transforming how we build for the web. From intelligent code completion to automated accessibility audits, the tools we use are becoming smarter by the day.', tags: ['ai', 'webdev', 'future'], category: 'technology' },
  { title: 'Rust for Frontend Devs in 2026', content: 'After spending six months with Rust, I can confidently say it is worth the hype. The type system catches bugs that would slip through in JavaScript.', tags: ['rust', 'wasm', 'frontend'], category: 'technology' },
  { title: 'CSS Container Queries Are Finally Here', content: 'Container queries solve one of the biggest pain points in responsive design. No more media queries based on viewport — components can adapt to their parent container.', tags: ['css', 'responsive', 'design'], category: 'technology' },
  { title: 'Building a Design System with React', content: 'A design system is more than a component library — it is a shared language between design and engineering.', tags: ['design-system', 'react', 'frontend'], category: 'technology' },
  { title: 'Why Edge Computing Matters Now', content: 'Edge computing is not just about latency — it is about where your code runs. With edge functions, you can personalize content closer to your users.', tags: ['edge', 'cloud', 'performance'], category: 'technology' },
];

const DUMMY_COMMENTS = [
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

  for (const user of DUMMY_USERS) {
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

  for (let i = 0; i < DUMMY_POSTS.length; i++) {
    const post = DUMMY_POSTS[i];
    const authorId = userIds[i % userIds.length];
    const author = DUMMY_USERS[i % DUMMY_USERS.length];

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
      const commentAuthor = DUMMY_USERS[(i + j + 1) % DUMMY_USERS.length];
      await addDoc(commentsRef, {
        authorId: userIds[(i + j + 1) % userIds.length],
        authorName: commentAuthor.displayName,
        authorPhoto: '',
        content: DUMMY_COMMENTS[(i * 2 + j) % DUMMY_COMMENTS.length],
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
    { senderId: userIds[0], senderName: DUMMY_USERS[0].displayName, senderPhoto: '', text: 'Hey! How is the project going?', read: true, createdAt: new Date(Date.now() - 1800000) },
    { senderId: userIds[1], senderName: DUMMY_USERS[1].displayName, senderPhoto: '', text: 'Going well! Almost done with the redesign.', read: true, createdAt: new Date(Date.now() - 1750000) },
    { senderId: userIds[0], senderName: DUMMY_USERS[0].displayName, senderPhoto: '', text: 'Have you seen the new React docs?', read: true, createdAt: new Date(Date.now() - 1700000) },
    { senderId: userIds[1], senderName: DUMMY_USERS[1].displayName, senderPhoto: '', text: 'Sounds great!', read: false, createdAt: new Date(Date.now() - 600000) },
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
