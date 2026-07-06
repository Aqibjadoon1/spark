import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import useUsers from '../../hooks/useUsers';
import { uploadProfileImage } from '../../services/storageService';
import { showToast } from '../../redux/actions/uiActions';
import ProfileForm from '../../components/forms/ProfileForm';
import Loader from '../../components/globals/Loader';
import Avatar from '../../components/globals/Avatar';
import EmptyState from '../../components/feedback/EmptyState';

const EditProfile = () => {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const { user: authUser, loading: authLoading } = useAuth();
  const { updateProfile, loading: updateLoading } = useUsers();

  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.title = 'Edit Profile - Elite Social';
  }, []);

  const handlePhotoChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      reduxDispatch(showToast('Please select an image file', 'error'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      reduxDispatch(showToast('Image must be under 5MB', 'error'));
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  }, [reduxDispatch]);

  const handleSubmit = useCallback(
    async (formData) => {
      if (!authUser) return;
      setSaving(true);
      try {
        let photoURL = authUser.photoURL || '';

        if (photoFile) {
          const downloadURL = await uploadProfileImage(authUser.uid, photoFile);
          photoURL = downloadURL;
        }

        await updateProfile(authUser.uid, {
          ...formData,
          photoURL,
        });

        reduxDispatch(showToast('Profile updated successfully!', 'success'));
        navigate(`/profile/${authUser.uid}`);
      } catch (err) {
        reduxDispatch(showToast(err.message || 'Failed to update profile', 'error'));
      } finally {
        setSaving(false);
      }
    },
    [authUser, photoFile, updateProfile, reduxDispatch, navigate],
  );

  if (authLoading) {
    return (
      <div className="dashboard-content" style={{ maxWidth: '42rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
          <Loader text="Loading profile..." />
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          }
          title="Not signed in"
          description="You must be signed in to edit your profile."
          actionLabel="Sign In"
          onAction={() => navigate('/login')}
        />
      </div>
    );
  }

  return (
    <div className="dashboard-content" style={{ maxWidth: '42rem', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div className="section-header">
          <h1>Edit Profile</h1>
          <p>Update your personal information</p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
      </div>

      <div className="cp-card">
        <div className="cp-header">
          <div className="cp-header-top">
            <div style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }} onClick={() => fileInputRef.current?.click()}>
              <Avatar
                src={photoPreview || authUser.photoURL}
                name={authUser.displayName || authUser.email}
                size="md"
              />
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="cp-title">Edit Profile</h2>
              <p className="cp-subtitle">{authUser.displayName || 'Your Name'}</p>
              <button className="btn btn-ghost btn-sm" onClick={() => fileInputRef.current?.click()} style={{ padding: 0, marginTop: '0.25rem', fontSize: '0.75rem' }}>
                Change photo
              </button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            style={{ display: 'none' }}
            aria-label="Upload profile photo"
          />
        </div>

        <ProfileForm user={authUser} onSubmit={handleSubmit} isLoading={saving || updateLoading} />
      </div>
    </div>
  );
};

export default EditProfile;
