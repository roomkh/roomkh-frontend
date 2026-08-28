import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SellerGuard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#0070c0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const sellerStatus = user?.seller_status || user?.status || user?.sellerStatus;

  // Render review message if user applied but admin hasn't approved yet
  if (sellerStatus === 'PENDING') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
            ⏳
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Application Under Review</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Your seller application has been submitted and is currently being reviewed by our team. You will gain access to the seller dashboard once approved.
          </p>
        </div>
      </div>
    );
  }

  // Redirect unapproved users to the application page
  if (sellerStatus !== 'APPROVED') {
    return <Navigate to="/sell" replace />;
  }

  return <Outlet />;
}
