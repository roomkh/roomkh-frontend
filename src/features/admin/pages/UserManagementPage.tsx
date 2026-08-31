import { useEffect, useState, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAdminUsers, getAdminUsersStats, updateAdminUserStatus } from '../../../service/api';
import type { AdminUser, AdminUserStats } from '../../../types';
import UserManagementPageSkeleton from '../../../components/skeletons/UserManagementPageSkeleton';

export default function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminUserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('All Roles');
  const [status, setStatus] = useState('All Status');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsersData = useCallback(async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        getAdminUsers({ page, size: 10, search: searchTerm, role, status }),
        getAdminUsersStats(),
      ]);
      setUsers(Array.isArray(usersRes) ? usersRes : []);
      setTotalPages(1);
      setStats(statsRes);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, role, status]);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  const handleStatusUpdate = async (userId: number | string, newStatus: string) => {
    try {
      await updateAdminUserStatus(userId, newStatus);
      fetchUsersData();
    } catch (error) {
      console.error(`Failed to update status for user ${userId}:`, error);
    }
  };

  if (loading) return <UserManagementPageSkeleton />;

  return (
    <div className="space-y-6 text-slate-800 font-sans antialiased">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Users Management</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage user accounts and verification statuses.</p>
      </div>

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
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
            >
              <option>All Roles</option>
              <option>USER</option>
              <option>SELLER</option>
              <option>ADMIN</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
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
                <th className="py-3.5 px-6 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">{user.full_name || user.name}</td>
                  <td className="py-3.5 px-6">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-semibold text-[10px]">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600">{user.email}</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        user.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : user.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {user.status || user.account_status || '-'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={() =>
                        handleStatusUpdate(user.id, user.status === 'Active' ? 'Inactive' : 'Active')
                      }
                      className="text-indigo-600 font-semibold hover:underline"
                    >
                      Toggle Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-1.5 rounded border border-slate-200 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded border border-slate-200 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}