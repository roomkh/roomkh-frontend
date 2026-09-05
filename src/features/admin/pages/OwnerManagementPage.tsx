import { useEffect, useState, useCallback } from 'react';
import { Search, Mail, Phone, Building2, CheckCircle2 } from 'lucide-react';
import { getAdminOwners, getAdminOwnersStats, updateAdminUserStatus } from '../../../service/api';
import type { Owner, AdminOwnerStats } from '../../../types';
import OwnerManagementPageSkeleton from '../../../components/skeletons/OwnerManagementPageSkeleton';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ConfirmModal from '../../../components/admin/AdminModal';
import Pagination from '../../../components/common/Pagination';
import { useToast } from '../../../context/ToastContext';

export default function OwnerManagementPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [stats, setStats] = useState<AdminOwnerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('All Status');
  const [plan, setPlan] = useState('All Plans');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [approveModal, setApproveModal] = useState<{ isOpen: boolean; owner: Owner | null }>({ isOpen: false, owner: null });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { toast } = useToast();

  const fetchOwnersData = useCallback(async () => {
    try {
      setLoading(true);
      const [ownersRes, statsRes] = await Promise.all([
        getAdminOwners({ page, size: 10, search: searchTerm, status, plan }),
        getAdminOwnersStats(),
      ]);
      setOwners(Array.isArray(ownersRes) ? (ownersRes as Owner[]) : []);
      setTotalPages(1);
      setStats(statsRes);
    } catch (error) {
      console.error('Failed to load owners:', error);
      toast('error', 'Failed to load owners');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, status, plan, toast]);

  useEffect(() => {
    Promise.resolve().then(fetchOwnersData);
  }, [fetchOwnersData]);

  const handleApproveOwner = async () => {
    if (!approveModal.owner) return;
    setActionLoading(`approve-${approveModal.owner.id}`);
    try {
      await updateAdminUserStatus(approveModal.owner.id as number | string, 'Active');
      toast('success', 'Owner approved successfully');
      setApproveModal({ isOpen: false, owner: null });
      fetchOwnersData();
    } catch {
      toast('error', 'Failed to approve owner');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusToggle = async (ownerId: number | string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setActionLoading(`status-${ownerId}`);
    try {
      await updateAdminUserStatus(ownerId, newStatus);
      toast('success', `Owner status updated to ${newStatus}`);
      fetchOwnersData();
    } catch {
      toast('error', 'Failed to update owner status');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (ownerStatus: string) => {
    const normalized = ownerStatus.toLowerCase();
    if (normalized === 'active') return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
    if (normalized === 'pending') return 'bg-amber-50 text-amber-700 border border-amber-200/80';
    return 'bg-rose-50 text-rose-700 border border-rose-200/80';
  };

  const getPlanBadge = (ownerPlan: string) => {
    const normalized = ownerPlan.toLowerCase();
    if (normalized === 'enterprise') return 'bg-purple-50 text-purple-700 border border-purple-200/80';
    if (normalized === 'business') return 'bg-blue-50 text-blue-700 border border-blue-200/80';
    return 'bg-slate-100 text-slate-700 border border-slate-200/80';
  };

  if (loading) return <OwnerManagementPageSkeleton />;

  return (
    <div className="space-y-6 text-slate-800 font-sans antialiased">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Owners Management</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage property owner profiles and plans.</p>
      </div>

      {/* Stats Cards */}
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
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search by owner name, email..."
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
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

            <select
              value={plan}
              onChange={(e) => { setPlan(e.target.value); setPage(1); }}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                <th className="py-3.5 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {owners.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Building2 className="w-8 h-8 text-slate-300" />
                      <span>No owners found matching your criteria.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                owners.map((owner) => (
                  <tr key={owner.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <button onClick={() => setSelectedOwner(owner)} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                        {owner.name || owner.full_name}
                      </button>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {owner.phone_number || owner.phone || '-'}
                      </p>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {owner.email}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getPlanBadge(owner.plan || 'Basic')}`}>
                        {owner.plan || 'Basic'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">{owner.properties_count || 0}</td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(owner.status || '')}`}>
                        {owner.status || '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-end gap-1.5">
                        {owner.status?.toLowerCase() === 'pending' && (
                          <button
                            onClick={() => setApproveModal({ isOpen: true, owner })}
                            disabled={actionLoading === `approve-${owner.id}`}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
                            title="Approve Owner"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusToggle(owner.id as number | string, owner.status || '')}
                          disabled={actionLoading === `status-${owner.id}`}
                          className="text-indigo-600 font-semibold hover:underline disabled:opacity-50 cursor-pointer"
                        >
                          {actionLoading === `status-${owner.id}` ? '...' : owner.status === 'Active' ? 'Deactivate' : 'Activate'}
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

      {/* Owner Detail Modal */}
      <Modal isOpen={!!selectedOwner} onClose={() => setSelectedOwner(null)} title="Owner Details" size="md" footer={<Button variant="secondary" onClick={() => setSelectedOwner(null)}>Close</Button>}>
        {selectedOwner && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-lg font-bold">
                {(selectedOwner.name || selectedOwner.full_name || 'O').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{selectedOwner.name || selectedOwner.full_name}</p>
                <p className="text-xs text-slate-500">{selectedOwner.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Phone</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedOwner.phone_number || selectedOwner.phone || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Plan</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getPlanBadge(selectedOwner.plan || 'Basic')}`}>
                  {selectedOwner.plan || 'Basic'}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Properties</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedOwner.properties_count || 0}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Status</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(selectedOwner.status || '')}`}>
                  {selectedOwner.status || '-'}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Approve Owner Modal */}
      <ConfirmModal
        isOpen={approveModal.isOpen}
        onClose={() => setApproveModal({ isOpen: false, owner: null })}
        onConfirm={handleApproveOwner}
        title="Approve Owner"
        description={approveModal.owner ? `Approve ${approveModal.owner.name || approveModal.owner.full_name} as a verified property owner?` : ''}
        confirmLabel="Approve"
        variant="success"
        loading={actionLoading !== null}
      />
    </div>
  );
}
