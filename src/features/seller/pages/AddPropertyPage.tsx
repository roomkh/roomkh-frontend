import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProperty } from "../services/sellerService";
import AddPropertyForm from "../components/AddPropertyForm";
import { 
  ChevronRight, 
  ArrowLeft, 
  AlertCircle, 
  Home, 
  PlusCircle, 
  X 
} from "lucide-react";

const AddPropertyPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFormSubmit = async (formData: any) => {
    try {
      setLoading(true);
      setError(null);
      await createProperty(formData);
      navigate("/seller/listings");
    } catch (err: any) {
      console.error("Failed to add property:", err);
      setError(
        err?.response?.data?.message || 
        "An unexpected error occurred while creating the listing. Please check your inputs and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans pb-16">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-slate-500">
          <Link 
            to="/seller" 
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Seller Dashboard</span>
          </Link>
          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="font-medium text-slate-900">Add Property</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Property</h1>
            </div>
            <p className="text-sm text-slate-500 pl-11">
              Fill in the details below to publish your real estate listing on the marketplace.
            </p>
          </div>

          <button
            onClick={() => navigate("/seller")}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Error State Banner */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between gap-3 text-red-800 text-sm animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold">Failed to save listing</p>
                <p className="text-red-700 mt-0.5">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => setError(null)}
              className="p-1 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Form Container Wrapper */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          <AddPropertyForm onSubmit={handleFormSubmit} loading={loading} />
        </div>
      </main>
    </div>
  );
};

export default AddPropertyPage;