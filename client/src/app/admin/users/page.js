'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ConfirmModal from '@/components/common/ConfirmModal';
import styles from '../admin.module.css';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [roleChange, setRoleChange] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get(`/users?limit=30&search=${search}`);
      setUsers(res.data.users || []);
      setPagination(res.data.pagination || {});
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search]);

  const handleToggleRole = async () => {
    if (!roleChange) return;
    try {
      await api.put(`/users/${roleChange._id}`, { role: roleChange.newRole });
      fetchUsers();
    } catch (e) {
      alert(e.message || 'Failed to change role');
    } finally {
      setRoleChange(null);
    }
  };

  const handleToggleActive = async (user) => {
    await api.put(`/users/${user._id}`, { isActive: !user.isActive });
    fetchUsers();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/users/${deleteId}`);
      fetchUsers();
    } catch (e) {
      alert(e.message || 'Failed to delete user');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div>
      <div className={styles.pageHeader}>
        <div><h1 className={styles.pageTitle}>Users</h1><p className={styles.pageSub}>{pagination.total || 0} total users</p></div>
      </div>

      <div className={styles.searchBar}>
        <input className="form-input" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? <div className="loading-center"><div className="spinner" /></div> : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead><tr>
              <th>User</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: user.role === 'admin' ? '#3b82f6' : '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: user.role === 'admin' ? 'white' : 'var(--color-text)' }}>
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </div>
                      <strong>{user.firstName} {user.lastName}</strong>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{user.email}</td>
                  <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{user.phone || '—'}</td>
                  <td>
                    <button onClick={() => setRoleChange({ _id: user._id, email: user.email, newRole: user.role === 'admin' ? 'user' : 'admin' })} className={`badge ${user.role === 'admin' ? 'badge-info' : 'badge-neutral'}`} style={{ cursor: 'pointer' }}>
                      {user.role}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleToggleActive(user)} className={`badge ${user.isActive ? 'badge-success' : 'badge-error'}`} style={{ cursor: 'pointer' }}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ fontSize: 12 }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td><button className={styles.deleteBtn} onClick={() => setDeleteId(user._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
      />

      <ConfirmModal
        isOpen={!!roleChange}
        onClose={() => setRoleChange(null)}
        onConfirm={handleToggleRole}
        title="Change User Role"
        message={roleChange ? `Change ${roleChange.email} role to ${roleChange.newRole}?` : ''}
        confirmLabel="Change Role"
        type="primary"
      />
    </div>
  );
}
