import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSellerDashboardData } from "../services/sellerService";
import { Loader2, Home, PlusCircle, FileText, TrendingUp, Eye, MessageSquare } from "lucide-react";

const SellerDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getSellerDashboardData();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Properties", value: stats?.total_properties || 0, icon: Home, color: "bg-blue-50 text-blue-600" },
    { label: "Active", value: stats?.active_count || 0, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600" },
    { label: "Pending", value: stats?.pending_count || 0, icon: FileText, color: "bg-amber-50 text-amber-600" },
    { label: "Draft", value: stats?.draft_count || 0, icon: FileText, color: "bg-slate-100 text-slate-600" },
    { label: "Total Views", value: stats?.total_views || 0, icon: Eye, color: "bg-purple-50 text-purple-600" },
    { label: "Inquiries", value: stats?.total_inquiries || 0, icon: MessageSquare, color: "bg-pink-50 text-pink-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
        <Link
          to="/seller/add-property"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-4 h-4" />
          Add Property
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                  <p className="text-xl font-bold text-slate-900">{card.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/seller/listings"
            className="px-4 py-2 border border-blue-600 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-50 transition"
          >
            View My Listings
          </Link>
          <Link
            to="/seller/add-property"
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Add New Property
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
