import { useEffect, useState, useCallback } from 'react';
import { Search, Shield, Mail, Phone, UserCircle, Trash2 } from 'lucide-react';
import { getAdminUsers, getAdminUsersStats, updateAdminUserStatus } from '../../../service/api';
import type { AdminUser, AdminUserStats } from '../../../types';
import UserManagementPageSkeleton from '../../../components/skeletons/UserManagementPageSkeleton';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ConfirmModal from '../../../components/admin/AdminModal';
import Pagination from '../../../components/common/Pagination';
import { useToast } from '../../../context/ToastContext';

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminUserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('All Roles');
  const [status, setStatus] = useState('All Status');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [roleModal, setRoleModal] = useState<{ isOpen: boolean; user: AdminUser | null; newRole: string }>({ isOpen: false, user: null, newRole: 'USER' });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: AdminUser | null }>({ isOpen: false, user: null });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchUsersData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        getAdminUsers({ page, size: 10, search: searchTerm, role, status }),
        getAdminUsersStats(),
      ]);
      setUsers(Array.isArray(usersRes) ? (usersRes as AdminUser[]) : []);
      setTotalPages(1);
      setStats(statsRes);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast('error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, role, status, toast]);

  useEffect(() => {
    Promise.resolve().then(fetchUsersData);
  }, [fetchUsersData]);

  const handleStatusUpdate = async (userId: number | string, newStatus: string) => {
    setActionLoading(`status-${userId}`);
    try {
      await updateAdminUserStatus(userId, newStatus);
      toast('success', `User status updated to ${newStatus}`);
      fetchUsersData();
    } catch {
      toast('error', 'Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async () => {
    if (!roleModal.user) return;
    setActionLoading(`role-${roleModal.user.id}`);
    try {
      await updateAdminUserStatus(roleModal.user.id, roleModal.newRole);
      toast('success', `User role updated to ${roleModal.newRole}`);
      setRoleModal({ isOpen: false, user: null, newRole: 'USER' });
      fetchUsersData();
    } catch {
      toast('error', 'Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;
    setActionLoading(`delete-${deleteModal.user.id}`);
    try {
      await updateAdminUserStatus(deleteModal.user.id, 'Inactive');
      toast('success', 'User deactivated successfully');
      setDeleteModal({ isOpen: false, user: null });
      fetchUsersData();
    } catch {
      toast('error', 'Failed to deactivate user');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (userStatus: string) => {
    const normalized = userStatus.toLowerCase();
    if (normalized === 'active') return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
    if (normalized === 'pending') return 'bg-amber-50 text-amber-700 border border-amber-200/80';
    return 'bg-rose-50 text-rose-700 border border-rose-200/80';
  };

  if (loading) return <UserManagementPageSkeleton />;

  return (
    <div className="space-y-6 text-slate-800 font-sans antialiased">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Users Management</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage user accounts and verification statuses.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">TOTAL USERS</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.total || users.length}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">ACTIVE USERS</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.active || 0}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">PENDING APPROVAL</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.pending || 0}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">INACTIVE USERS</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.inactive || 0}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value); setPage(1); }}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option>All Roles</option>
              <option>USER</option>
              <option>SELLER</option>
              <option>ADMIN</option>
            </select>

            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setPage(1); }}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 font-bold text-slate-400 uppercase bg-slate-50/60">
                <th className="py-3.5 px-6">USER</th>
                <th className="py-3.5 px-6">ROLE</th>
                <th className="py-3.5 px-6">EMAIL</th>
                <th className="py-3.5 px-6">STATUS</th>
                <th className="py-3.5 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <UserCircle className="w-8 h-8 text-slate-300" />
                      <span>No users found matching your criteria.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <button onClick={() => setSelectedUser(user)} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                        {user.full_name || user.name}
                      </button>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {user.phone_number || user.phone || '-'}
                      </p>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {user.email}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(user.status || user.account_status || '')}`}>
                        {user.status || user.account_status || '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStatusUpdate(user.id, user.status === 'Active' ? 'Inactive' : 'Active')}
                          disabled={actionLoading === `status-${user.id}`}
                          className="text-indigo-600 font-semibold hover:underline disabled:opacity-50 cursor-pointer"
                        >
                          {actionLoading === `status-${user.id}` ? 'Saving...' : user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => setRoleModal({ isOpen: true, user, newRole: user.role === 'ADMIN' ? 'USER' : 'ADMIN' })}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Change Role"
                        >
                          <Shield className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, user })}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Deactivate User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {/* User Detail Modal */}
      <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="User Details" size="md" footer={<Button variant="secondary" onClick={() => setSelectedUser(null)}>Close</Button>}>
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-bold">
                {(selectedUser.full_name || selectedUser.name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{selectedUser.full_name || selectedUser.name}</p>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Role</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedUser.role}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Status</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(selectedUser.status || selectedUser.account_status || '')}`}>
                  {selectedUser.status || selectedUser.account_status || '-'}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Phone</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedUser.phone_number || selectedUser.phone || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Auth Provider</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedUser.auth_provider || '-'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Role Change Modal */}
      <ConfirmModal
        isOpen={roleModal.isOpen}
        onClose={() => setRoleModal({ isOpen: false, user: null, newRole: 'USER' })}
        onConfirm={handleRoleChange}
        title="Change User Role"
        description={roleModal.user ? `Change ${roleModal.user.full_name || roleModal.user.name}'s role to ${roleModal.newRole}?` : ''}
        confirmLabel={`Change to ${roleModal.newRole}`}
        variant="primary"
        loading={actionLoading !== null}
      />

      {/* Delete/Deactivate Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={handleDeleteUser}
        title="Deactivate User"
        description={deleteModal.user ? `Are you sure you want to deactivate "${deleteModal.user.full_name || deleteModal.user.name}"? They will no longer be able to log in.` : ''}
        confirmLabel="Deactivate"
        variant="danger"
        loading={actionLoading !== null}
      />
    </div>
  );
}
