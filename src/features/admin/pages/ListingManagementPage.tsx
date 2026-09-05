import { useEffect, useState, useCallback } from 'react';
import { Search, Download, Eye, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { getAdminProperties, exportAdminProperties, reviewAdminProperty, getAdminPropertyById, deleteAdminProperty } from '../../../service/api';
import type { Property } from '../../../types';
import ListingManagementPageSkeleton from '../../../components/skeletons/ListingManagementPageSkeleton';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import ConfirmModal from '../../../components/admin/AdminModal';
import Pagination from '../../../components/common/Pagination';
import { useToast } from '../../../context/ToastContext';

export default function ListingManagementPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('All Status');
  const [type, setType] = useState('All Types');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; property: Property | null; action: 'Approved' | 'Rejected' | null }>({
    isOpen: false,
    property: null,
    action: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; property: Property | null }>({ isOpen: false, property: null });
  const [actionLoading, setActionLoading] = useState<number | string | null>(null);

  const { toast } = useToast();

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminProperties({ page, size: 10, search: searchTerm, status, type });
      setProperties(Array.isArray(res) ? (res as Property[]) : []);
      setTotalPages(1);
    } catch (error) {
      console.error('Failed to load properties:', error);
      toast('error', 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, status, type, toast]);

  useEffect(() => {
    Promise.resolve().then(fetchListings);
  }, [fetchListings]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleExport = async () => {
    try {
      const blob = await exportAdminProperties({ status: status !== 'All Status' ? status : undefined });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `properties_export_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast('success', 'Properties exported successfully');
    } catch {
      toast('error', 'Export failed');
    }
  };

  const handleViewProperty = async (id: number | string) => {
    try {
      const res = await getAdminPropertyById(id);
      setSelectedProperty(res as Property);
    } catch {
      toast('error', 'Failed to load property details');
    }
  };

  const handleReview = async () => {
    if (!reviewModal.property || !reviewModal.action) return;
    const id = reviewModal.property.id as number | string;
    setActionLoading(id);
    try {
      await reviewAdminProperty(id, { status: reviewModal.action });
      toast('success', `Property ${reviewModal.action.toLowerCase()} successfully`);
      setReviewModal({ isOpen: false, property: null, action: null });
      fetchListings();
    } catch {
      toast('error', `Failed to ${reviewModal.action.toLowerCase()} property`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.property) return;
    const id = deleteModal.property.id as number | string;
    setActionLoading(id);
    try {
      await deleteAdminProperty(id);
      toast('success', 'Property deleted successfully');
      setDeleteModal({ isOpen: false, property: null });
      fetchListings();
    } catch {
      toast('error', 'Failed to delete property');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (itemStatus: string) => {
    const normalized = itemStatus.toLowerCase();
    if (normalized === 'active' || normalized === 'approved') return 'bg-emerald-50 text-emerald-700 border border-emerald-200/80';
    if (normalized === 'pending') return 'bg-amber-50 text-amber-700 border border-amber-200/80';
    if (normalized === 'inactive' || normalized === 'rejected') return 'bg-rose-50 text-rose-700 border border-rose-200/80';
    return 'bg-slate-100 text-slate-700 border border-slate-200/80';
  };

  if (loading) return <ListingManagementPageSkeleton />;

  return (
    <div className="space-y-6 text-slate-800 font-sans antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Listing Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Control and verify property submissions.</p>
        </div>
        <Button variant="secondary" onClick={handleExport} className="w-full sm:w-auto">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by title, location..."
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
              value={type}
              onChange={(e) => { setType(e.target.value); setPage(1); }}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option>All Types</option>
              <option>ROOM</option>
              <option>CONDO</option>
              <option>HOUSE</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 font-bold text-slate-400 uppercase bg-slate-50/60">
                <th className="py-3.5 px-6">PROPERTY</th>
                <th className="py-3.5 px-6">TYPE</th>
                <th className="py-3.5 px-6">PRICE</th>
                <th className="py-3.5 px-6">STATUS</th>
                <th className="py-3.5 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 text-slate-300" />
                      <span>No properties found matching your criteria.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                properties.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <button onClick={() => handleViewProperty(item.id as number | string)} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                        {item.title}
                      </button>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.location || item.address}</p>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {item.property_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">${item.price?.toLocaleString() ?? 0}</td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(item.status || '')}`}>
                        {item.status || '-'}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => handleViewProperty(item.id as number | string)} className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {item.status?.toLowerCase() === 'pending' && (
                          <>
                            <button onClick={() => setReviewModal({ isOpen: true, property: item, action: 'Approved' })} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer" title="Approve">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setReviewModal({ isOpen: true, property: item, action: 'Rejected' })} className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer" title="Reject">
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                        <button onClick={() => setDeleteModal({ isOpen: true, property: item })} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer" title="Delete">
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

      {/* Review Confirmation Modal */}
      <ConfirmModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, property: null, action: null })}
        onConfirm={handleReview}
        title={`${reviewModal.action} Property`}
        description={reviewModal.property ? `Are you sure you want to ${reviewModal.action?.toLowerCase()} "${reviewModal.property.title}"?` : ''}
        confirmLabel={reviewModal.action || 'Confirm'}
        variant={reviewModal.action === 'Approved' ? 'success' : 'danger'}
        loading={actionLoading !== null}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, property: null })}
        onConfirm={handleDelete}
        title="Delete Property"
        description={deleteModal.property ? `Are you sure you want to delete "${deleteModal.property.title}"? This action cannot be undone.` : ''}
        confirmLabel="Delete"
        variant="danger"
        loading={actionLoading !== null}
      />

      {/* Property Detail Modal */}
      <Modal
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        title={selectedProperty?.title || 'Property Details'}
        size="lg"
        footer={<Button variant="secondary" onClick={() => setSelectedProperty(null)}>Close</Button>}
      >
        {selectedProperty && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Property Type</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedProperty.property_type || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Purpose</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedProperty.purpose || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Price</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">${selectedProperty.price?.toLocaleString() ?? 0}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Status</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(selectedProperty.status || '')}`}>
                  {selectedProperty.status || '-'}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Location</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedProperty.location || selectedProperty.address || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Bedrooms</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedProperty.bedrooms || '-'}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase">Bathrooms</p>
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedProperty.bathrooms || '-'}</p>
              </div>
            </div>
            {selectedProperty.description && (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase mb-1">Description</p>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedProperty.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
