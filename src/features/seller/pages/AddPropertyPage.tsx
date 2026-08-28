import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createProperty } from "../services/sellerService";
import AddPropertyForm from "../components/AddPropertyForm";

const AddPropertyPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (formData: any) => {
    try {
      setLoading(true);
      await createProperty(formData);
      navigate("/seller/listings");
    } catch (err) {
      console.error("Failed to add property:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-12">
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex border-b border-gray-200 text-sm font-medium -mb-px">
          <Link to="/seller" className="pb-3 px-1 text-gray-500 hover:text-gray-700 mr-6">
            Seller Home
          </Link>
          <span className="pb-3 px-1 border-b-2 border-blue-600 text-blue-600 font-semibold">
            Add Property
          </span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl font-bold text-slate-900">Add New Property</h1>

        {/* Form Component */}
        <AddPropertyForm onSubmit={handleFormSubmit} loading={loading} />
      </main>
    </div>
  );
};

export default AddPropertyPage;