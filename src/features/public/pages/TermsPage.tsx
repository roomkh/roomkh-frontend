import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Terms of Service</h1>
        <div className="prose prose-sm text-gray-600 space-y-4">
          <p>
            Welcome to RoomKH. By accessing or using our platform, you agree to be bound by these Terms of Service.
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">1. Acceptance of Terms</h2>
          <p>
            By creating an account or using any part of the Service, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please do not use the Service.
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">2. Use of Service</h2>
          <p>
            RoomKH provides a platform for property listings, searches, and related services. You agree to use the Service only for lawful purposes and in accordance with these Terms.
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">3. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">4. Listings and Content</h2>
          <p>
            Users are solely responsible for the content they post on the platform. RoomKH does not guarantee the accuracy, completeness, or usefulness of any listing content.
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">5. Limitation of Liability</h2>
          <p>
            RoomKH shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the Service.
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">6. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes by updating the date at the top of these Terms.
          </p>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link
            to="/register"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            &larr; Back to Register
          </Link>
        </div>
      </div>
    </div>
  );
}
