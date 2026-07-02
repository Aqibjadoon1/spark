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

  const inputClass = 'w-full px-4 py-2.5 bg-white dark:bg-dark-bg text-[#191A23] dark:text-white rounded-xl border-gray-200 dark:border-white/10 focus:border-lime focus:outline-none focus:ring-2 focus:ring-lime/20 placeholder-gray-400 text-sm transition-all';

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="profile-name" className="block text-sm font-medium text-[#191A23]/70 dark:text-white/70 mb-1.5">Display Name</label>
        <input id="profile-name" type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className={inputClass} placeholder="Your display name" aria-label="Display name" />
      </div>

      <div>
        <label htmlFor="profile-bio" className="block text-sm font-medium text-[#191A23]/70 dark:text-white/70 mb-1.5">Bio</label>
        <textarea id="profile-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Tell us about yourself" aria-label="Bio" />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-gray-400 dark:text-text-gray mb-3">Social Links</legend>
        <div className="space-y-3">
          {[
            { id: 'twitter', label: 'Twitter', val: twitter, set: setTwitter, placeholder: 'https://twitter.com/yourhandle' },
            { id: 'github', label: 'GitHub', val: github, set: setGithub, placeholder: 'https://github.com/yourhandle' },
            { id: 'linkedin', label: 'LinkedIn', val: linkedin, set: setLinkedin, placeholder: 'https://linkedin.com/in/yourhandle' },
            { id: 'website', label: 'Website', val: website, set: setWebsite, placeholder: 'https://yoursite.com' },
          ].map(({ id, label, val, set, placeholder }) => (
            <div key={id}>
              <label htmlFor={`profile-${id}`} className="block text-xs text-gray-500 dark:text-text-muted mb-1">{label}</label>
              <input id={`profile-${id}`} type="url" value={val} onChange={(e) => set(e.target.value)} className={inputClass} placeholder={placeholder} aria-label={label} />
            </div>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="profile-visibility" className="block text-sm font-medium text-[#191A23]/70 dark:text-white/70 mb-1.5">Profile Visibility</label>
        <select id="profile-visibility" value={visibility} onChange={(e) => setVisibility(e.target.value)} className={inputClass} aria-label="Profile visibility">
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-gray-400 dark:text-text-gray mb-3">Location</legend>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-3 sm:col-span-1">
            <label htmlFor="profile-city" className="block text-xs text-gray-500 dark:text-text-muted mb-1">City</label>
            <input id="profile-city" type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="City" aria-label="City" />
          </div>
          <div>
            <label htmlFor="profile-lat" className="block text-xs text-gray-500 dark:text-text-muted mb-1">Latitude</label>
            <input id="profile-lat" type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} className={inputClass} placeholder="0.00" aria-label="Latitude" />
          </div>
          <div>
            <label htmlFor="profile-lng" className="block text-xs text-gray-500 dark:text-text-muted mb-1">Longitude</label>
            <input id="profile-lng" type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} className={inputClass} placeholder="0.00" aria-label="Longitude" />
          </div>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%', padding: '14px 28px', border: 'none', borderRadius: 14,
          background: 'linear-gradient(135deg, #7B4DFF, #FF3FA7)', color: '#FFF',
          fontSize: 15, fontWeight: 700, fontFamily: "'Nunito', sans-serif",
          cursor: isLoading ? 'not-allowed' : 'pointer',
          boxShadow: isLoading ? 'none' : '0 10px 35px var(--shadow-glow-pink)',
          opacity: isLoading ? 0.5 : 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
        onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; e.currentTarget.style.transform = 'none'; }}
      >
        {isLoading && (
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.6s linear infinite' }}>
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
            <path fill="#FFF" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        Save Profile
      </button>
    </form>
  );
};

export default ProfileForm;
