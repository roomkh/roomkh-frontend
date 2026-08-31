import { useEffect, useState, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAdminOwners, getAdminOwnersStats } from '../../../service/api';
import type { Owner, AdminOwnerStats } from '../../../types';
import OwnerManagementPageSkeleton from '../../../components/skeletons/OwnerManagementPageSkeleton';

export default function OwnerManagementPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [stats, setStats] = useState<AdminOwnerStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('All Status');
  const [plan, setPlan] = useState('All Plans');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOwnersData = useCallback(async () => {
    try {
      setLoading(true);
      const [ownersRes, statsRes] = await Promise.all([
        getAdminOwners({ page, size: 10, search: searchTerm, status, plan }),
        getAdminOwnersStats(),
      ]);
      setOwners(Array.isArray(ownersRes) ? ownersRes : []);
      setTotalPages(1);
      setStats(statsRes);
    } catch (error) {
      console.error('Failed to load owners:', error);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, status, plan]);

  useEffect(() => {
    fetchOwnersData();
  }, [fetchOwnersData]);

  if (loading) return <OwnerManagementPageSkeleton />;

  return (
    <div className="space-y-6 text-slate-800 font-sans antialiased">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Owners Management</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage property owner profiles and plans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">TOTAL OWNERS</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.total || owners.length}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">ACTIVE OWNERS</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.active || 0}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">PENDING APPROVAL</p>
          <p className="text-2xl font-bold text-slate-900 mt-0.5">{stats?.pending || 0}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
          <p className="text-[11px] font-semibold text-slate-400 uppercase">INACTIVE OWNERS</p>
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
              placeholder="Search by owner name, email..."
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
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

            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
            >
              <option>All Plans</option>
              <option>Basic</option>
              <option>Business</option>
              <option>Enterprise</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 font-bold text-slate-400 uppercase bg-slate-50/60">
                <th className="py-3.5 px-6">OWNER</th>
                <th className="py-3.5 px-6">EMAIL</th>
                <th className="py-3.5 px-6">PLAN</th>
                <th className="py-3.5 px-6">PROPERTIES</th>
                <th className="py-3.5 px-6">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {owners.map((owner) => (
                <tr key={owner.id} className="hover:bg-slate-50/60">
                  <td className="py-3.5 px-6 font-semibold text-slate-900">{owner.name || owner.full_name}</td>
                  <td className="py-3.5 px-6 text-slate-600">{owner.email}</td>
                  <td className="py-3.5 px-6">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                      {owner.plan || 'Basic'}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 font-bold text-slate-900">{owner.properties_count || 0}</td>
                  <td className="py-3.5 px-6">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        owner.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {owner.status || '-'}
                    </span>
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