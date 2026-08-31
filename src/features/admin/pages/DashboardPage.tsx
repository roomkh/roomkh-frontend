import { useEffect, useState } from 'react';
import {
  UserPlus,
  Building2,
  List,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { getAdminDashboardStats, getAdminProperties, reviewAdminProperty } from '../../../service/api';
import type { AdminDashboardStats, Property } from '../../../types';
import DashboardPageSkeleton from '../../../components/skeletons/DashboardPageSkeleton';

const REVENUE_COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc'];

function LineChart({ data }: { data: AdminDashboardStats['platform_growth_chart'] }) {
  const { labels, user_signups, listings_added } = data;
  const width = 600;
  const height = 200;
  const pad = { top: 10, right: 10, bottom: 28, left: 10 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;

  const allValues = [...user_signups, ...listings_added];
  const maxVal = Math.max(...allValues, 1);
  const xStep = chartW / Math.max(labels.length - 1, 1);
  const y = (val: number) => chartH - (val / maxVal) * chartH;

  const userPoints = user_signups.map((v, i) => `${pad.left + i * xStep},${pad.top + y(v)}`).join(' ');
  const listingPoints = listings_added.map((v, i) => `${pad.left + i * xStep},${pad.top + y(v)}`).join(' ');
  const userArea = `${userPoints} ${pad.left + (user_signups.length - 1) * xStep},${pad.top + chartH} ${pad.left},${pad.top + chartH}`;

  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-52 overflow-visible">
      {yTicks.map((tick) => (
        <line
          key={tick}
          x1={pad.left}
          x2={width - pad.right}
          y1={pad.top + chartH * tick}
          y2={pad.top + chartH * tick}
          stroke="#f1f5f9"
          strokeWidth="1"
        />
      ))}
      <polygon points={userArea} fill="rgba(148, 163, 184, 0.08)" />
      <polyline points={userPoints} fill="none" stroke="#94a3b8" strokeWidth="2.5" />
      <polyline points={listingPoints} fill="none" stroke="#4f46e5" strokeWidth="2.5" />
      {user_signups.map((v, i) => (
        <circle key={`u-${i}`} cx={pad.left + i * xStep} cy={pad.top + y(v)} r="3" fill="#94a3b8" />
      ))}
      {listings_added.map((v, i) => (
        <circle key={`l-${i}`} cx={pad.left + i * xStep} cy={pad.top + y(v)} r="3" fill="#4f46e5" />
      ))}
      <g className="text-[10px] text-slate-400 font-medium">
        {labels.map((label, i) => (
          <text
            key={i}
            x={pad.left + i * xStep}
            y={height - 8}
            textAnchor="middle"
            fill="#94a3b8"
          >
            {i % 2 === 0 ? label : ''}
          </text>
        ))}
      </g>
    </svg>
  );
}

function DonutChart({ data, monthlyRevenue }: { data: AdminDashboardStats['revenue_source_chart']; monthlyRevenue?: number }) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = 15.9155;

  const segments = data.map((item, i) => {
    const percent = item.value / total;
    const offset = data.slice(0, i).reduce((sum, prev) => sum + (prev.value / total) * 100, 0);
    return { ...item, percent, offset, color: REVENUE_COLORS[i % REVENUE_COLORS.length] };
  });

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 36 36" className="w-44 h-44 transform -rotate-90">
        <circle cx="18" cy="18" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="4.5" strokeDasharray="100 100" />
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth="4.5"
            strokeDasharray={`${seg.percent * 100} ${100 - seg.percent * 100}`}
            strokeDashoffset={-seg.offset}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold text-slate-900">
          ${monthlyRevenue?.toLocaleString() ?? '42,850'}
        </span>
        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">MRR</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [pendingListings, setPendingListings] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, propertiesRes] = await Promise.all([
        getAdminDashboardStats(),
        getAdminProperties({ page: 1, size: 5, status: 'Pending' }),
      ]);
      setStats(statsData);
      setPendingListings(Array.isArray(propertiesRes) ? propertiesRes : []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleReview = async (id: number | string, status: 'Approved' | 'Rejected') => {
    try {
      await reviewAdminProperty(id, { status });
      fetchDashboardData();
    } catch (error) {
      console.error(`Failed to review property ${id}:`, error);
    }
  };

  if (loading) return <DashboardPageSkeleton />;

  const cards = stats?.cards;
  const growth = cards?.user_growth ?? 12.5;
  const ownerGrowth = cards?.owner_growth ?? 3.2;

  return (
    <div className="space-y-6 text-slate-800 font-sans antialiased">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time statistics, growth metrics, and pending approvals.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-1.5 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +{growth}%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Total Users</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{cards?.total_users?.toLocaleString() ?? 0}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-500 gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              {cards?.seekers_count ?? 0} Seekers
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-300" />
              {cards?.owners_count ?? 0} Owners
            </span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200/60 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              +{ownerGrowth}%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Total Owners</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{cards?.total_owners?.toLocaleString() ?? 0}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Pending <span className="font-semibold text-amber-600 ml-1">{cards?.pending_owners ?? 0}</span></span>
            <span>Churn <span className="font-semibold text-slate-700 ml-1">{cards?.churn_rate ?? 0}%</span></span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <List className="w-5 h-5" />
            </div>
            <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-200/60">
              {cards?.pending_listings ?? pendingListings.length} Pending
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Total Listings</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">{cards?.total_listings?.toLocaleString() ?? 0}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${cards?.active_percentage ?? 92}%` }} />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 whitespace-nowrap">{cards?.active_percentage ?? 92}% Active</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-100">
              EST. MRR
            </span>
          </div>
          <div className="mt-4">
            <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">Monthly Revenue</p>
            <p className="text-2xl font-bold text-slate-900 mt-0.5">${cards?.monthly_revenue?.toLocaleString() ?? '42,850.00'}</p>
          </div>
          <div className="mt-3 pt-2.5 px-3 py-1.5 bg-slate-50 rounded-lg flex items-center justify-between text-[11px] text-slate-500">
            <span>Prev: ${cards?.last_month_revenue?.toLocaleString() ?? '38,000'}</span>
            <span className="flex items-center text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              {cards?.last_month_revenue && cards?.monthly_revenue
                ? (((cards.monthly_revenue - cards.last_month_revenue) / cards.last_month_revenue) * 100).toFixed(1)
                : '12.7'}%
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      {stats?.platform_growth_chart && stats?.revenue_source_chart && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Platform Growth</h3>
                <p className="text-[11px] text-slate-500">User signups vs listings added over time</p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                  User Signups
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  Listings Added
                </span>
              </div>
            </div>
            <LineChart data={stats.platform_growth_chart} />
          </div>

          <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs">
            <div>
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Revenue By Source</h3>
              <p className="text-[11px] text-slate-500">Contribution per source (USD)</p>
            </div>
            <DonutChart data={stats.revenue_source_chart} monthlyRevenue={cards?.monthly_revenue} />
            <div className="mt-4 space-y-2">
              {stats.revenue_source_chart.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: REVENUE_COLORS[i % REVENUE_COLORS.length] }} />
                    <span className="text-slate-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pending Listings Table */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Pending Applications</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Property listings awaiting admin approval</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            {pendingListings.length} items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/60">
                <th className="py-3.5 px-6">Listing</th>
                <th className="py-3.5 px-6">Location</th>
                <th className="py-3.5 px-6">Price</th>
                <th className="py-3.5 px-6 text-right">Status & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {pendingListings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <List className="w-8 h-8 text-slate-300" />
                      <span>No pending applications requiring review.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                pendingListings.map((property) => (
                  <tr key={property.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">{property.title || 'Untitled'}</td>
                    <td className="py-4 px-6 text-slate-600">{property.location || property.address || '-'}</td>
                    <td className="py-4 px-6 font-bold text-slate-900">${property.price?.toLocaleString() ?? 0}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="bg-amber-50 text-amber-700 border border-amber-200/80 text-[11px] font-semibold px-2.5 py-1 rounded-md">
                          Pending
                        </span>
                        <button
                          onClick={() => handleReview(property.id as number | string, 'Approved')}
                          className="bg-indigo-600 text-white hover:bg-indigo-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReview(property.id as number | string, 'Rejected')}
                          className="bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5 text-slate-400" />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
