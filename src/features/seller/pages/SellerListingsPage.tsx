import { useState, useEffect } from "react";
import { getSellerDashboard, getSellerProperties } from "../services/sellerService";
import SellerListingTable from "../components/SellerListingTable";
import { Loader2 } from "lucide-react";

const SellerListingsPage = () => {
  const [activeTab, setActiveTab] = useState("ALL");
  const [stats, setStats] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashData, propData] = await Promise.all([
          getSellerDashboard(),
          getSellerProperties(),
        ]);
        setStats(dashData);
        setProperties(propData?.content || []);
      } catch (err) {
        console.error("Failed to load listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">My Listings</h1>
      <SellerListingTable
        properties={properties}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stats={stats}
      />
    </div>
  );
};

export default SellerListingsPage;