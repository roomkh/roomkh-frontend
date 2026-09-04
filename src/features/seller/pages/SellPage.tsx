import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSellerDashboardData } from "../services/sellerService";
import { 
  Loader2, 
  Home, 
  PlusCircle, 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  AlertCircle,
  ArrowUpRight,
  ListFilter,
  Clock,
  FileEdit
} from "lucide-react";

interface DashboardStats {
  total_properties?: number;
  active_count?: number;
  pending_count?: number;
  draft_count?: number;
  total_views?: number;
  total_inquiries?: number;
}

const SellerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSellerDashboardData();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
      setError("Unable to load performance metrics. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(fetchStats);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading dashboard performance...</p>
      </div>
    );
  }

  const statCards = [
    { 
      label: "Total Properties", 
      value: stats?.total_properties ?? 0, 
      icon: Home, 
      color: "bg-blue-50 text-blue-600 border-blue-100" 
    },
    { 
      label: "Active Listings", 
      value: stats?.active_count ?? 0, 
      icon: TrendingUp, 
      color: "bg-emerald-50 text-emerald-600 border-emerald-100" 
    },
    { 
      label: "Pending Review", 
      value: stats?.pending_count ?? 0, 
      icon: Clock, 
      color: "bg-amber-50 text-amber-600 border-amber-100" 
    },
    { 
      label: "Drafts", 
      value: stats?.draft_count ?? 0, 
      icon: FileEdit, 
      color: "bg-slate-100 text-slate-600 border-slate-200" 
    },
    { 
      label: "Total Views", 
      value: stats?.total_views ?? 0, 
      icon: Eye, 
      color: "bg-purple-50 text-purple-600 border-purple-100" 
    },
    { 
      label: "Inquiries Received", 
      value: stats?.total_inquiries ?? 0, 
      icon: MessageSquare, 
      color: "bg-rose-50 text-rose-600 border-rose-100" 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Seller Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview of your property listings, views, and buyer inquiries.
          </p>
        </div>
        <div>
          <Link
            to="/seller/add-property"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Error Alert State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between text-red-700 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
            <button 
              onClick={fetchStats}
            className="text-xs font-semibold underline hover:text-red-800"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.label} 
              className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between"
            >
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {card.value.toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/seller/listings"
            className="group p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 transition-colors">
                <ListFilter className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  View My Listings
                </p>
                <p className="text-xs text-slate-500">Manage active and drafted properties</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>

          <Link
            to="/seller/add-property"
            className="group p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-600 transition-colors">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Add New Property
                </p>
                <p className="text-xs text-slate-500">Create a new real estate listing</p>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;