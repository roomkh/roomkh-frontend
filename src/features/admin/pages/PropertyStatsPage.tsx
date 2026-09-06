import { useEffect, useState } from 'react';
import SelectDropdown from '../../../components/common/SelectDropdown';
import { BarChart3, TrendingUp, Home, CheckCircle2, Clock } from 'lucide-react';
import { getAdminPropertiesStats, getAdminProperties } from '../../../service/api';
import type { AdminPropertyStats, Property } from '../../../types';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import Pagination from '../../../components/common/Pagination';
import { useToast } from '../../../context/ToastContext';

const STATUS_OPTIONS = [
  { value: 'All Status', label: 'All Status' },
  { value: 'Active', label: 'Active' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Inactive', label: 'Inactive' },
];

export default function PropertyStatsPage() {
  const [stats, setStats] = useState<AdminPropertyStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [status, setStatus] = useState('All Status');

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsData, propsRes] = await Promise.all([
          getAdminPropertiesStats(),
          getAdminProperties({ page, size: 10, status }),
        ]);
        setStats(statsData);
        setProperties(Array.isArray(propsRes) ? (propsRes as Property[]) : []);
        setTotalPages(1);
      } catch {
        toast('error', 'Failed to load property statistics');
      } finally {
        setLoading(false);
      }
    };
    Promise.resolve().then(fetchData);
  }, [page, status, toast]);

  const statCards = [
    { label: 'Total Listings', value: stats?.total ?? 0, icon: Home, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
    { label: 'Active', value: stats?.active ?? 0, icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Pending Review', value: stats?.pending ?? 0, icon: Clock, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { label: 'Inactive', value: stats?.inactive ?? 0, icon: BarChart3, color: 'bg-rose-50 text-rose-600 border-rose-100' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800 font-sans antialiased">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Property Statistics</h2>
          <p className="text-xs text-slate-500 mt-0.5">Overview of listing health and distribution.</p>
        </div>
        <div className="flex items-center gap-2">
          <SelectDropdown
            value={status}
            onChange={(next) => { setStatus(next); setPage(1); }}
            options={STATUS_OPTIONS}
            align="right"
            panelClassName="w-44"
            triggerClassName="px-3 py-1.5 text-xs border-2 border-slate-200 rounded-lg bg-white text-slate-700"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">{card.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-0.5">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Percentage Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Listing Health</h3>
            <p className="text-[11px] text-slate-500">Percentage of active listings</p>
          </div>
          <span className="text-lg font-bold text-slate-900">
            {stats?.total ? ((stats.active || 0) / stats.total * 100).toFixed(1) : 0}%
          </span>
          <TrendingUp className="w-5 h-5 text-emerald-600" />
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${stats?.total ? ((stats.active || 0) / stats.total * 100) : 0}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
          <span>{stats?.active ?? 0} Active</span>
          <span>{stats?.total ?? 0} Total</span>
        </div>
      </div>

      {/* Recent Properties Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">Recent Listings</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Latest properties in the system</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 font-bold text-slate-400 uppercase bg-slate-50/60">
                <th className="py-3.5 px-6">PROPERTY</th>
                <th className="py-3.5 px-6">TYPE</th>
                <th className="py-3.5 px-6">PRICE</th>
                <th className="py-3.5 px-6">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {properties.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400">No properties found.</td>
                </tr>
              ) : (
                properties.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-6">
                      <button onClick={() => setSelectedProperty(item)} className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                        {item.title}
                      </button>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.location || item.address}</p>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold">{item.property_type}</span>
                    </td>
                    <td className="py-3.5 px-6 font-bold text-slate-900">${item.price?.toLocaleString() ?? 0}</td>
                    <td className="py-3.5 px-6">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        (item.status || '').toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {item.status || '-'}
                      </span>
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
                <p className="text-sm font-medium text-slate-900 mt-0.5">{selectedProperty.status || '-'}</p>
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
