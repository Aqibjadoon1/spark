import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { deleteDoc, doc } from 'firebase/firestore';
import useUsers from '../../hooks/useUsers';
import { db } from '../../firebase/firebaseSDK';
import * as userService from '../../services/userService';
import SearchBar from '../../components/globals/SearchBar';
import Modal from '../../components/globals/Modal';
import SelectInput from '../../components/inputs/SelectInput';
import Skeleton from '../../components/globals/Skeleton';
import EmptyState from '../../components/feedback/EmptyState';
import Pagination from '../../components/globals/Pagination';
import Button from '../../components/buttons/Button';
import { showToast } from '../../redux/actions/uiActions';

const PAGE_SIZE = 10;

const roleOptions = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'moderator', label: 'Moderator' },
];

const AdminUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useUsers();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingRole, setEditingRole] = useState(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u) =>
        (u.displayName?.toLowerCase() || '').includes(q) ||
        (u.email?.toLowerCase() || '').includes(q),
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleRoleChange = async (uid, newRole) => {
    try {
      await userService.updateUserProfile(uid, { role: newRole });
      dispatch(showToast(`Role updated to ${newRole}`, 'success'));
      setEditingRole(null);
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, 'users', deleteTarget.uid));
      dispatch(showToast('User deleted successfully', 'success'));
      setDeleteTarget(null);
    } catch (err) {
      dispatch(showToast(err.message, 'error'));
    }
  };

  if (error) {
    return <p style={{ color: 'red', fontSize: '0.875rem' }}>Error loading users: {error}</p>;
  }

  return (
    <div className="dashboard-content">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="section-header">
          <h1>Manage Users</h1>
          <p>{users.length} total users</p>
        </div>
        <SearchBar value={search} onChange={handleSearch} placeholder="Search by name or email..." />
      </div>

      {loading ? (
        <Skeleton variant="card" count={5} />
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={
            <svg width="64" height="64" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M3 18c1.5-3 4-4 7-4s5.5 1 7 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            </svg>
          }
          title={search ? 'No users match your search' : 'No users found'}
          description={search ? 'Try a different name or email' : 'Users will appear here once they register'}
        />
      ) : (
        <>
          <div className="panel-card" style={{ padding: 0, overflow: 'auto' }}>
            <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Role</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((user) => (
                  <tr key={user.uid} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '700' }}>
                          {(user.displayName || user.email || 'U')[0].toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '500' }}>{user.displayName || 'Unnamed'}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#888' }}>{user.email}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {editingRole === user.uid ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <SelectInput
                            options={roleOptions}
                            value={user.role || 'user'}
                            onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                            style={{ width: '8rem' }}
                          />
                          <button className="btn btn-ghost btn-sm" onClick={() => setEditingRole(null)}>Cancel</button>
                        </div>
                      ) : (
                        <span className={`badge ${user.role === 'admin' ? 'badge-primary' : user.role === 'moderator' ? 'badge-teal' : 'badge-muted'}`}
                          style={{ cursor: 'pointer' }} onClick={() => setEditingRole(user.uid)}>
                          {user.role || 'user'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`badge ${user.online ? 'badge-success' : 'badge-muted'}`}>
                        {user.online ? 'Online' : 'Offline'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <button className="btn btn-icon btn-sm" onClick={() => setDeleteTarget(user)} title="Delete">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                          <path d="M4 5H16M7.5 5V3.5C7.5 3.22386 7.72386 3 8 3H12C12.2761 3 12.5 3.22386 12.5 3.5V5M15 7L14.5 16.5H5.5L5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div style={{ marginTop: '1rem' }}>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User" size="sm">
        <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Are you sure you want to delete <strong>{deleteTarget?.displayName || deleteTarget?.email}</strong>? This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} style={{ flex: 1 }}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} style={{ flex: 1 }}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUsers;
