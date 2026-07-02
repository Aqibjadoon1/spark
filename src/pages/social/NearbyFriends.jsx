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

  useEffect(() => {
    document.title = 'Nearby Friends - Spark';
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
    map.invalidateSize();
    setMapInit(true);

    return () => {
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

    if (points.length > 1) {
      map.fitBounds(points, { padding: [50, 50], maxZoom: 15 });
    }
  }, [nearbyUsers, latitude, longitude, mapInit]);

  const geoDenied =
    geoError && (geoError.includes('denied') || geoError.includes('permission') || geoError.includes('not allowed'));

  return (
    <div className="dashboard-content animate-in" style={{ maxWidth: '72rem', margin: '0 auto' }}>
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

        {nearbyUsers.length === 0 ? (
          <EmptyState
            icon={
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            }
            title="No users found"
            description="No nearby users available right now."
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {nearbyUsers.map((u) => (
              <div key={u.uid} className="panel-card animate-in">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'var(--color-primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '700', flexShrink: 0, color: 'var(--color-text-secondary)' }}>
                    {(u.displayName || 'U')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: '600' }}>{u.displayName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{formatDistance(u.distance)} away</p>
                  </div>
                  <span className={`badge ${u.online ? 'badge-success' : 'badge-muted'}`} style={{ fontSize: '0.625rem' }}>
                    {u.online ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => handleViewProfile(u.uid)}>Profile</button>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => handleSendRequest(u.uid)}>Add Friend</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NearbyFriends;
