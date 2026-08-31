import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-sm text-gray-600 space-y-4">
          <p>
            At RoomKH, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, list a property, or contact us. This includes your name, email, phone number, and any content you post.
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, communicate with you, and comply with legal obligations.
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">3. Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share information with service providers, law enforcement, or as required by law.
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data. You may also object to or restrict certain processing of your data.
          </p>
          <h2 className="text-lg font-bold text-gray-900 mt-6">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@roomkh.com.
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
