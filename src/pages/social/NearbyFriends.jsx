import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useGeolocation from '../../hooks/useGeolocation';
import useUsers from '../../hooks/useUsers';
import useAuth from '../../hooks/useAuth';
import { showToast } from '../../redux/actions/uiActions';
import Loader from '../../components/globals/Loader';
import EmptyState from '../../components/feedback/EmptyState';
import './NearbyFriends.css';

const MOCK_NEARBY_USERS = [
  { uid: 'mock1', displayName: 'Alex Rivera', photoURL: '', email: 'alex@example.com', online: true, lat: 40.7128, lng: -74.006 },
  { uid: 'mock2', displayName: 'Jordan Kim', photoURL: '', email: 'jordan@example.com', online: false, lat: 40.7282, lng: -73.7949 },
  { uid: 'mock3', displayName: 'Sam Taylor', photoURL: '', email: 'sam@example.com', online: true, lat: 40.6892, lng: -74.0445 },
  { uid: 'mock4', displayName: 'Morgan Chen', photoURL: '', email: 'morgan@example.com', online: false, lat: 40.758, lng: -73.9855 },
  { uid: 'mock5', displayName: 'Casey Patel', photoURL: '', email: 'casey@example.com', online: true, lat: 40.7484, lng: -73.9857 },
];

const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const formatDistance = (km) => {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)}km`;
};

const NearbyFriends = () => {
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const { latitude, longitude, error: geoError, loading: geoLoading, getCurrentPosition } = useGeolocation();
  const { users, fetchUsers, sendFriendRequest } = useUsers();
  const { user: authUser } = useAuth();

  const [locating, setLocating] = useState(false);
  const [geoInitiated, setGeoInitiated] = useState(false);
  const [mapInit, setMapInit] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersLayer = useRef(null);
  const resizeObsRef = useRef(null);

  useEffect(() => {
    document.title = 'Nearby Friends - Elite Social';
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!geoInitiated) {
      getCurrentPosition();
      setGeoInitiated(true);
    }
  }, [getCurrentPosition, geoInitiated]);

  const nearbyUsers = useMemo(() => {
    let candidates = [];

    if (latitude != null && longitude != null) {
      const realUsers = users
        .filter((u) => u.uid !== authUser?.uid && u.location?.lat != null && u.location?.lng != null)
        .map((u) => ({
          ...u,
          distance: haversineDistance(latitude, longitude, u.location.lat, u.location.lng),
        }));

      const mockWithDistances = MOCK_NEARBY_USERS.filter((m) => m.uid !== authUser?.uid).map((m) => ({
        ...m,
        distance: haversineDistance(latitude, longitude, m.lat, m.lng),
      }));

      candidates = [...realUsers, ...mockWithDistances];
    } else {
      candidates = MOCK_NEARBY_USERS.filter((m) => m.uid !== authUser?.uid).map((m) => ({
        ...m,
        distance: Math.random() * 5 + 0.1,
      }));
    }

    return candidates.sort((a, b) => a.distance - b.distance);
  }, [users, latitude, longitude, authUser]);

  const handleSendRequest = useCallback(
    async (toUid) => {
      if (!authUser) {
        reduxDispatch(showToast('Sign in to send friend requests', 'warning'));
        return;
      }
      try {
        await sendFriendRequest(toUid, authUser?.uid);
        reduxDispatch(showToast('Friend request sent!', 'success'));
      } catch {
        reduxDispatch(showToast('Failed to send friend request', 'error'));
      }
    },
    [authUser, sendFriendRequest, reduxDispatch],
  );

  const handleViewProfile = useCallback(
    (uid) => {
      navigate(`/profile/${uid}`);
    },
    [navigate],
  );

  const handleLocateMe = useCallback(() => {
    setLocating(true);
    getCurrentPosition();
    setTimeout(() => setLocating(false), 2000);
  }, [getCurrentPosition]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    const map = L.map(mapRef.current, {
      center: [40.7128, -74.006],
      zoom: 13,
      zoomControl: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    mapInstance.current = map;
    setTimeout(() => map.invalidateSize(), 50);
    setMapInit(true);

    resizeObsRef.current = new ResizeObserver(() => {
      if (mapInstance.current) mapInstance.current.invalidateSize();
    });
    resizeObsRef.current.observe(mapRef.current);

    return () => {
      if (resizeObsRef.current) resizeObsRef.current.disconnect();
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current && !geoLoading) {
      setTimeout(() => mapInstance.current.invalidateSize(), 100);
    }
  }, [geoLoading]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    if (markersLayer.current) {
      markersLayer.current.clearLayers();
    } else {
      markersLayer.current = L.layerGroup().addTo(map);
    }

    const layer = markersLayer.current;
    const hasLocation = latitude != null && longitude != null;

    if (hasLocation) {
      const selfIcon = L.divIcon({
        className: '',
        html: '<div class="nf-user-marker self">S</div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      L.marker([latitude, longitude], { icon: selfIcon })
        .addTo(layer)
        .bindPopup('<div class="nf-marker-popup"><strong>You</strong></div>');

      map.setView([latitude, longitude], 13);
    }

    nearbyUsers.forEach((u) => {
      const lat = u.lat ?? u.location?.lat;
      const lng = u.lng ?? u.location?.lng;
      if (lat == null || lng == null) return;

      const initial = (u.displayName || 'U')[0].toUpperCase();
      const cls = u.online ? 'nf-user-marker online' : 'nf-user-marker';
      const icon = L.divIcon({
        className: '',
        html: `<div class="${cls}">${initial}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      L.marker([lat, lng], { icon }).addTo(layer)
        .bindPopup(
          `<div class="nf-marker-popup"><strong>${u.displayName}</strong>${u.distance != null ? `<br/><span>${formatDistance(u.distance)} away</span>` : ''}<br/><a href="/profile/${u.uid}">View Profile</a></div>`
        );
    });

    const points = [];
    if (hasLocation) points.push(L.latLng(latitude, longitude));
    nearbyUsers.forEach((u) => {
      const lat = u.lat ?? u.location?.lat;
      const lng = u.lng ?? u.location?.lng;
      if (lat != null && lng != null) points.push(L.latLng(lat, lng));
    });

    setTimeout(() => { if (mapInstance.current) mapInstance.current.invalidateSize(); }, 100);

    if (points.length > 1) {
      map.fitBounds(points, { padding: [50, 50], maxZoom: 15 });
    }
  }, [nearbyUsers, latitude, longitude, mapInit]);

  const geoDenied =
    geoError && (geoError.includes('denied') || geoError.includes('permission') || geoError.includes('not allowed'));

  return (
    <div className="dashboard-content animate-in nf-page">
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <h1>Nearby Friends</h1>
        <p style={{ marginBottom: '0.75rem' }}>Discover people around you</p>
        <button
          className="btn btn-primary"
          onClick={handleLocateMe}
          disabled={locating}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {locating ? 'Finding...' : 'Find Friends Near Me'}
        </button>
      </div>

      <div className="nf-wrapper">
        <div className="nf-map-col">
          <div className="nf-map-container" ref={mapRef}>
            {geoLoading && !locating && (
              <div className="nf-map-loader">
                <Loader text="Detecting your location..." />
              </div>
            )}
          </div>

          {geoDenied && (
            <EmptyState
              icon={
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              }
              title="Location access denied"
              description="Allow location access to see nearby users on the map, then click Find Friends Near Me."
            />
          )}
        </div>

        <div className="nf-friend-sidebar">
          <div className="nf-friend-header">
            <span>Nearby Users</span>
            <span className="nf-friend-count">{nearbyUsers.length} found</span>
          </div>
          {nearbyUsers.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
              No nearby users available right now.
            </div>
          ) : (
            <div className="nf-friend-list">
              {nearbyUsers.map((u) => (
                <div key={u.uid} className="nf-friend-card" onClick={() => handleViewProfile(u.uid)}>
                  <div className="nf-friend-avatar">
                    {(u.displayName || 'U')[0].toUpperCase()}
                  </div>
                  <div className="nf-friend-info">
                    <div className="nf-friend-name">{u.displayName}</div>
                    <div className="nf-friend-distance">{formatDistance(u.distance)} away &middot; {u.online ? 'Online' : 'Offline'}</div>
                  </div>
                  <div className="nf-friend-actions">
                    <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); handleViewProfile(u.uid); }}>Profile</button>
                    <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); handleSendRequest(u.uid); }}>Add</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbyFriends;
