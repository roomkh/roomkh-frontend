import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { getSellerDashboard, getSellerProperties } from "../services/sellerService";
import SellerListingTable from "../components/SellerListingTable";
import { 
  Loader2, 
  Home, 
  ChevronRight, 
  PlusCircle, 
  AlertCircle, 
  RefreshCw 
} from "lucide-react";

interface SellerStats {
  total_properties?: number;
  active_count?: number;
  pending_count?: number;
  draft_count?: number;
}

interface Property {
  id: string | number;
  title: string;
  status: "ACTIVE" | "PENDING" | "DRAFT" | string;
  price?: number;
  created_at?: string;
  [key: string]: any;
}

const SellerListingsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashData, propData] = await Promise.all([
        getSellerDashboard(),
        getSellerProperties(),
      ]);
      setStats(dashData);
      setProperties(Array.isArray(propData) ? propData : []);
    } catch (err) {
      console.error("Failed to load listings:", err);
      setError("Failed to load property listings. Please check your connection and try again.");
    } finally { // ✅ FIXED: Changed 'fontally' to 'finally'
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter listings based on active status tab
  const filteredProperties = useMemo(() => {
    if (activeTab === "ALL") return properties;
    return properties.filter(
      (property) => property.status?.toUpperCase() === activeTab.toUpperCase()
    );
  }, [properties, activeTab]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Fetching property listings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-slate-500">
          <Link 
            to="/seller" 
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Seller Dashboard</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="font-medium text-slate-900">My Listings</span>
        </nav>

        {/* Page Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Listings</h1>
            <p className="text-sm text-slate-500 mt-1">
              View, edit, and filter all your published and draft properties.
            </p>
          </div>

          <Link
            to="/seller/add-property"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Property
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3 text-red-800 text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-900 underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        )}

        {/* Listings Table Component */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          <SellerListingTable
            properties={filteredProperties}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            stats={stats}
          />
        </div>
      </main>
    </div>
  );
};

export default SellerListingsPage;