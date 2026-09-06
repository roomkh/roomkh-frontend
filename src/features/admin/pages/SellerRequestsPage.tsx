import { useEffect, useState, useCallback } from 'react';
import SelectDropdown from '../../../components/common/SelectDropdown';
import { Search, CheckCircle2, XCircle, Eye, MessageSquare } from 'lucide-react';
import { fetchAdminSellerRequests, reviewSellerRequestStatus } from '../services/adminService';
import type { AdminSellerRequest } from '../../../types';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ConfirmModal from '../../../components/admin/AdminModal';
import Pagination from '../../../components/common/Pagination';
import { useToast } from '../../../context/ToastContext';

const STATUS_OPTIONS = [
  { value: 'All Status', label: 'All Status' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

export default function SellerRequestsPage() {
  const [requests, setRequests] = useState<AdminSellerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('All Status');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<AdminSellerRequest | null>(null);
  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; request: AdminSellerRequest | null; action: 'Approved' | 'Rejected' | null }>({
    isOpen: false,
    request: null,
    action: null,
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState('');

  const { toast } = useToast();

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchAdminSellerRequests(status === 'All Status' ? undefined : status);
      setRequests(Array.isArray(res) ? res : []);
      setTotalPages(1);
    } catch {
      toast('error', 'Failed to load seller requests');
    } finally {
      setLoading(false);
    }
  }, [status, toast]);

  useEffect(() => {
    Promise.resolve().then(fetchRequests);
  }, [fetchRequests]);

  const handleReview = async () => {
    if (!reviewModal.request || !reviewModal.action) return;
    setActionLoading(reviewModal.request.id.toString());
    try {
      await reviewSellerRequestStatus(reviewModal.request.id, { status: reviewModal.action, admin_note: adminNote });
      toast('success', `Seller request ${reviewModal.action.toLowerCase()} successfully`);
      setReviewModal({ isOpen: false, request: null, action: null });
      setAdminNote('');
      fetchRequests();
    } catch {
      toast('error', `Failed to ${reviewModal.action.toLowerCase()} request`);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (reqStatus: string) => {
    const normalized = reqStatus.toLowerCase();
    if (normalized === 'approved' || normalized === 'active') return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
    if (normalized === 'pending') return 'bg-amber-50 text-amber-700 border border-amber-200/80';
    return 'bg-rose-50 text-rose-700 border border-rose-200/80';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800 font-sans antialiased">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Seller Requests</h2>
        <p className="text-xs text-slate-500 mt-0.5">Review and manage seller upgrade applications.</p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search by name, email, business..."
              className="w-full pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <SelectDropdown
            value={status}
            onChange={(next) => { setStatus(next); setPage(1); }}
            options={STATUS_OPTIONS}
            align="right"
            panelClassName="w-44"
            triggerClassName="px-3 py-1.5 text-xs border-2 border-slate-200 rounded-lg bg-white text-slate-700"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 font-bold text-slate-400 uppercase bg-slate-50/60">
                <th className="py-3.5 px-6">APPLICANT</th>
                <th className="py-3.5 px-6">BUSINESS</th>
                <th className="py-3.5 px-6">POSITION</th>
                <th className="py-3.5 px-6">SUBMITTED</th>
                <th className="py-3.5 px-6">STATUS</th>
                <th className="py-3.5 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare className="w-8 h-8 text-slate-300" />
                      <span>No seller requests found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <button onClick={() => setSelectedRequest(req)} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                        {req.full_name}
                      </button>
                      <p className="text-[10px] text-slate-400 mt-0.5">{req.email}</p>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">{req.business_name || '-'}</td>
                    <td className="py-3.5 px-6 text-slate-600">{req.position || '-'}</td>
                    <td className="py-3.5 px-6 text-slate-600">{req.submitted_at ? new Date(req.submitted_at).toLocaleDateString() : '-'}</td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => setSelectedRequest(req)} className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer" title="View Details">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {req.status.toLowerCase() === 'pending' && (
                          <>
                            <button onClick={() => setReviewModal({ isOpen: true, request: req, action: 'Approved' })} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer" title="Approve">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setReviewModal({ isOpen: true, request: req, action: 'Rejected' })} className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer" title="Reject">
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
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

      {/* Request Detail Modal */}
      <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title="Seller Request Details" size="md" footer={<Button variant="secondary" onClick={() => setSelectedRequest(null)}>Close</Button>}>
        {selectedRequest && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Full Name</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedRequest.full_name}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Email</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedRequest.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Phone</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedRequest.phone_number || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Business Name</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedRequest.business_name || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Position</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedRequest.position || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Status</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Reason</p>
              <p className="text-sm text-slate-600 leading-relaxed">{selectedRequest.reason || '-'}</p>
            </div>
            {selectedRequest.admin_note && (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Admin Note</p>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedRequest.admin_note}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Review Confirmation Modal */}
      <ConfirmModal
        isOpen={reviewModal.isOpen}
        onClose={() => { setReviewModal({ isOpen: false, request: null, action: null }); setAdminNote(''); }}
        onConfirm={handleReview}
        title={`${reviewModal.action} Seller Request`}
        description={reviewModal.request ? `Are you sure you want to ${reviewModal.action?.toLowerCase()} ${reviewModal.request.full_name}'s seller request?` : ''}
        confirmLabel={reviewModal.action || 'Confirm'}
        variant={reviewModal.action === 'Approved' ? 'success' : 'danger'}
        loading={actionLoading !== null}
      >
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">Admin Note (optional)</label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Add a note for the applicant..."
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            rows={3}
          />
        </div>
      </ConfirmModal>
    </div>
  );
}
