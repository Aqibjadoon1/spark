import { useState, useEffect } from 'react';

const ProfileForm = ({ user, onSubmit, isLoading = false }) => {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [city, setCity] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
      setTwitter(user.socialLinks?.twitter || '');
      setGithub(user.socialLinks?.github || '');
      setLinkedin(user.socialLinks?.linkedin || '');
      setWebsite(user.socialLinks?.website || '');
      setVisibility(user.visibility || 'public');
      setCity(user.location?.city || '');
      setLat(user.location?.lat ?? '');
      setLng(user.location?.lng ?? '');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    onSubmit?.({
      displayName: displayName.trim(),
      bio: bio.trim(),
      socialLinks: { twitter: twitter.trim(), github: github.trim(), linkedin: linkedin.trim(), website: website.trim() },
      visibility,
      location: { city: city.trim(), lat: lat ? parseFloat(lat) : null, lng: lng ? parseFloat(lng) : null },
    });
  };

  return (
    <form className="cp-form" onSubmit={handleSubmit} noValidate>
      <div className="cp-field">
        <label className="cp-label" htmlFor="profile-name">Display Name</label>
        <input
          id="profile-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="cp-input"
          placeholder="Your display name"
          aria-label="Display name"
        />
      </div>

      <div className="cp-field">
        <label className="cp-label" htmlFor="profile-bio">Bio</label>
        <textarea
          id="profile-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="cp-textarea"
          placeholder="Tell us about yourself"
          aria-label="Bio"
          style={{ height: 120 }}
        />
      </div>

      <div className="cp-row">
        {[
          { id: 'twitter', label: 'Twitter', val: twitter, set: setTwitter, placeholder: 'https://twitter.com/yourhandle' },
          { id: 'github', label: 'GitHub', val: github, set: setGithub, placeholder: 'https://github.com/yourhandle' },
          { id: 'linkedin', label: 'LinkedIn', val: linkedin, set: setLinkedin, placeholder: 'https://linkedin.com/in/yourhandle' },
          { id: 'website', label: 'Website', val: website, set: setWebsite, placeholder: 'https://yoursite.com' },
        ].map(({ id, label, val, set, placeholder }) => (
          <div className="cp-field" key={id}>
            <label className="cp-label" htmlFor={`profile-${id}`}>{label}</label>
            <input
              id={`profile-${id}`}
              type="url"
              value={val}
              onChange={(e) => set(e.target.value)}
              className="cp-input"
              placeholder={placeholder}
              aria-label={label}
            />
          </div>
        ))}
      </div>

      <div className="cp-field">
        <label className="cp-label" htmlFor="profile-visibility">Profile Visibility</label>
        <div className="cp-select-wrap">
          <select
            id="profile-visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="cp-select"
            aria-label="Profile visibility"
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
          <svg className="cp-select-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="cp-row">
        <div className="cp-field">
          <label className="cp-label" htmlFor="profile-city">City</label>
          <input
            id="profile-city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="cp-input"
            placeholder="City"
            aria-label="City"
          />
        </div>
        <div className="cp-field">
          <label className="cp-label" htmlFor="profile-lat">Latitude</label>
          <input
            id="profile-lat"
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            className="cp-input"
            placeholder="0.00"
            aria-label="Latitude"
          />
        </div>
        <div className="cp-field">
          <label className="cp-label" htmlFor="profile-lng">Longitude</label>
          <input
            id="profile-lng"
            type="number"
            step="any"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            className="cp-input"
            placeholder="0.00"
            aria-label="Longitude"
          />
        </div>
      </div>

      <div className="cp-footer">
        <button
          type="submit"
          disabled={isLoading}
          className="cp-btn-primary"
        >
          {isLoading && (
            <svg className="cp-btn-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
              <path fill="#FFF" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          Save Profile
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
