import { lazy } from 'react';
import LandingLayout from '../layouts/LandingLayout';
import UnifiedLayout from '../layouts/UnifiedLayout';
import AuthLayout from '../layouts/AuthLayout';
import SimpleAuthLayout from '../layouts/SimpleAuthLayout';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../hoc/ProtectedRoute';
import AdminRoute from '../hoc/AdminRoute';
import UserRoute from '../hoc/UserRoute';
import GuestRoute from '../hoc/GuestRoute';

const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPassword'));
const LandingPage = lazy(() => import('../pages/home/LandingPage'));
const Feed = lazy(() => import('../pages/home/Feed'));
const TrendingPosts = lazy(() => import('../pages/home/TrendingPosts'));
const PostDetail = lazy(() => import('../pages/social/PostDetail'));
const PublicProfile = lazy(() => import('../pages/social/PublicProfile'));
const EditProfile = lazy(() => import('../pages/social/EditProfile'));
const Friends = lazy(() => import('../pages/social/Friends'));
const NearbyFriends = lazy(() => import('../pages/social/NearbyFriends'));
const Settings = lazy(() => import('../pages/social/Settings'));
const Bookmarks = lazy(() => import('../pages/social/Bookmarks'));
const Messages = lazy(() => import('../pages/social/Messages'));
const Notifications = lazy(() => import('../pages/social/Notifications'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminTasks = lazy(() => import('../pages/admin/AdminTasks'));
const AdminNotes = lazy(() => import('../pages/admin/AdminNotes'));
const UserDashboard = lazy(() => import('../pages/user/UserDashboard'));
const UserTasks = lazy(() => import('../pages/user/UserTasks'));
const UserNotes = lazy(() => import('../pages/user/UserNotes'));
const NotFound = lazy(() => import('../pages/shared/NotFound'));

const routes = [
  {
    path: '/',
    element: <LandingLayout />,
    children: [
      { index: true, element: <LandingPage /> },
    ],
  },
  {
    path: '/',
    element: <UnifiedLayout />,
    children: [
      { path: 'feed', element: <ProtectedRoute><Feed /></ProtectedRoute> },
      { path: 'trending', element: <ProtectedRoute><TrendingPosts /></ProtectedRoute> },
      { path: 'post/:id', element: <ProtectedRoute><PostDetail /></ProtectedRoute> },
      { path: 'profile/:uid', element: <ProtectedRoute><PublicProfile /></ProtectedRoute> },
      { path: 'profile/edit', element: <ProtectedRoute><EditProfile /></ProtectedRoute> },
      { path: 'friends', element: <ProtectedRoute><Friends /></ProtectedRoute> },
      { path: 'nearby', element: <ProtectedRoute><NearbyFriends /></ProtectedRoute> },
      { path: 'settings', element: <ProtectedRoute><Settings /></ProtectedRoute> },
      { path: 'bookmarks', element: <ProtectedRoute><Bookmarks /></ProtectedRoute> },
      { path: 'messages', element: <ProtectedRoute><Messages /></ProtectedRoute> },
      { path: 'notifications', element: <ProtectedRoute><Notifications /></ProtectedRoute> },
      {
        path: 'dashboard',
        element: <UserRoute><UserDashboard /></UserRoute>,
      },
      { path: 'dashboard/tasks', element: <UserRoute><UserTasks /></UserRoute> },
      { path: 'dashboard/notes', element: <UserRoute><UserNotes /></UserRoute> },
    ],
  },
  { path: 'login', element: <GuestRoute><AuthLayout /></GuestRoute>, children: [{ index: true, element: <Login /> }] },
  { path: 'register', element: <GuestRoute><AuthLayout /></GuestRoute>, children: [{ index: true, element: <Register /> }] },
  { path: 'forgot-password', element: <GuestRoute><SimpleAuthLayout /></GuestRoute>, children: [{ index: true, element: <ForgotPassword /> }] },
  { path: 'reset-password', element: <GuestRoute><SimpleAuthLayout /></GuestRoute>, children: [{ index: true, element: <ResetPassword /> }] },
  {
    path: '/admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <AdminUsers /> },
      { path: 'tasks', element: <AdminTasks /> },
      { path: 'notes', element: <AdminNotes /> },
    ],
  },
  { path: '*', element: <NotFound /> },
];

export default routes;
