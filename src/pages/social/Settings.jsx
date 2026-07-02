import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import useTheme from '../../hooks/useTheme';
import useUsers from '../../hooks/useUsers';
import { showToast } from '../../redux/actions/uiActions';
import Loader from '../../components/globals/Loader';
import EmptyState from '../../components/feedback/EmptyState';

const Settings = () => {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const { user: authUser, loading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const { updateProfile } = useUsers();

  const [visibility, setVisibility] = useState('public');
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    friendRequests: true,
    messages: true,
  });
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    document.title = 'Settings - Spark';
  }, []);

  useEffect(() => {
    if (authUser) {
      setVisibility(authUser.visibility || 'public');
      if (authUser.notificationPreferences) {
        setNotifications((prev) => ({ ...prev, ...authUser.notificationPreferences }));
      }
    }
  }, [authUser]);

  const handleSaveSettings = useCallback(async () => {
    if (!authUser) return;
    setSaving(true);
    try {
      await updateProfile(authUser.uid, {
        visibility,
        notificationPreferences: notifications,
      });
      reduxDispatch(showToast('Settings saved!', 'success'));
    } catch (err) {
      reduxDispatch(showToast(err.message || 'Failed to save settings', 'error'));
    } finally {
      setSaving(false);
    }
  }, [authUser, visibility, notifications, updateProfile, reduxDispatch]);

  const handleDeleteAccount = useCallback(async () => {
    reduxDispatch(showToast('Account deletion coming soon', 'info'));
    setShowDeleteConfirm(false);
  }, [reduxDispatch]);

  if (authLoading) {
    return (
      <div className="dashboard-content" style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
          <Loader text="Loading settings..." />
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="dashboard-content" style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <EmptyState
          icon={
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
          title="Not signed in"
          description="You must be signed in to access settings."
          actionLabel="Sign In"
          onAction={() => navigate('/login')}
        />
      </div>
    );
  }

  const toggleStyle = (enabled) => ({
    position: 'relative',
    display: 'inline-flex',
    height: '1.5rem',
    width: '2.75rem',
    borderRadius: '9999px',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
    backgroundColor: enabled ? 'var(--color-primary)' : 'var(--color-text-placeholder)',
  });

  const toggleCircleStyle = (enabled) => ({
    display: 'inline-block',
    height: '1rem',
    width: '1rem',
    transform: `translateX(${enabled ? '1.5rem' : '0.25rem'})`,
    borderRadius: '50%',
    backgroundColor: 'var(--color-text-white)',
    transition: 'transform 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    marginTop: '0.25rem',
  });

  return (
    <div className="dashboard-content" style={{ maxWidth: '42rem', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div className="section-header">
          <h1>Settings</h1>
          <p>Customize your experience</p>
        </div>
        <button className="btn btn-primary" onClick={handleSaveSettings} disabled={saving}>
          {saving && (
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.25rem' }}>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          Save Settings
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <section className="panel-card">
          <h2 className="panel-card-title" style={{ marginBottom: '1rem' }}>Appearance</h2>
          <div>
            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.75rem' }}>Theme</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {['dark', 'light'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`btn ${theme === t ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1 }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="panel-card">
          <h2 className="panel-card-title" style={{ marginBottom: '1rem' }}>Privacy</h2>
          <div>
            <label htmlFor="settings-visibility" style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-secondary)', display: 'block', marginBottom: '0.375rem' }}>
              Profile Visibility
            </label>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              Private profiles hide personal details and posts from non-friends.
            </p>
            <select
              id="settings-visibility"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              style={{ width: '100%', padding: '0.625rem 1rem', background: 'var(--bg-surface-raised)', borderRadius: '0.75rem', border: '1px solid var(--border-medium)', fontSize: '0.875rem', color: 'var(--color-text-primary)' }}
              aria-label="Profile visibility"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </section>

        <section className="panel-card">
          <h2 className="panel-card-title" style={{ marginBottom: '1rem' }}>Notifications</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { key: 'likes', label: 'Likes' },
              { key: 'comments', label: 'Comments' },
              { key: 'friendRequests', label: 'Friend Requests' },
              { key: 'messages', label: 'Messages' },
            ].map(({ key, label }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{label}</span>
                <button
                  onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))}
                  style={toggleStyle(notifications[key])}
                  role="switch"
                  aria-checked={notifications[key]}
                  aria-label={`${label} notifications`}
                >
                  <span style={toggleCircleStyle(notifications[key])} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="panel-card" style={{ border: '1px solid var(--color-danger)' }}>
          <h2 className="panel-card-title" style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>Danger Zone</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </button>
        </section>
      </div>

      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-overlay)', padding: '1rem' }}>
          <div style={{ background: 'var(--bg-surface)', borderRadius: '0.75rem', padding: '1.5rem', maxWidth: '24rem', width: '100%', boxShadow: '0 25px 50px var(--shadow-card)', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>Delete Account?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
              This action is permanent and cannot be undone. All your data will be removed.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="btn btn-danger"
                style={{ flex: 1 }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
