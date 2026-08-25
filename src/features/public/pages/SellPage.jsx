import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Eye,
  ShieldCheck,
  Clock,
  TrendingUp,
  FileEdit,
  UserCheck,
  MailCheck,
  Home,
  Users,
  Send,
  ArrowRight,
  CheckCircle2,
  Headphones
} from 'lucide-react';
import SellPageSkeleton from '../../../components/skeletons/SellPageSkeleton';
import { submitSellerRequest } from '../../seller/services/sellerService';

const HOW_IT_WORKS_STEPS = [
  {
    stepNumber: 1,
    icon: FileEdit,
    title: 'Submit Request',
    desc: 'Complete the seller application form with your personal information.',
  },
  {
    stepNumber: 2,
    icon: UserCheck,
    title: 'Admin Review',
    desc: 'Our team reviews your request and supporting documents within 1–2 business days.',
  },
  {
    stepNumber: 3,
    icon: MailCheck,
    title: 'Approval',
    desc: "You'll receive an approval once your seller account has been approved.",
  },
  {
    stepNumber: 4,
    icon: Home,
    title: 'Create Property',
    desc: 'Log in and publish unlimited property listings.',
  },
  {
    stepNumber: 5,
    icon: Users,
    title: 'Receive Inquiries',
    desc: 'Start receiving messages and viewing requests from potential buyers.',
  },
];

export default function SellPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: 'Seller',
    companyName: '',
    reason: '',
    agreedTerms: false,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreedTerms) {
      setStatusMessage({ type: 'error', text: 'You must agree to the Terms & Conditions.' });
      return;
    }

    setSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      await submitSellerRequest(formData);
      setStatusMessage({
        type: 'success',
        text: 'Your request has been submitted successfully! Our team will review it within 1-2 business days.',
      });
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: 'Seller',
        companyName: '',
        reason: '',
        agreedTerms: false,
      });
    } catch (err) {
      const serverError = err.response?.data?.message || 'Failed to submit request. Please try again.';
      setStatusMessage({ type: 'error', text: serverError });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <SellPageSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500">
          <span>Home</span> &gt; <span className="font-semibold text-gray-800">Sell</span>
        </div>

        {/* Hero Banner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-sm">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Sell Your Property <br />with RoomKH
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Before you can publish your property, please submit a seller request. Our admin team will review your information and approve your account so you can start listing properties on RoomKH.
            </p>
            
            {/* Warning Box */}
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg space-y-1">
              <p className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Admin Approval Required</span>
              </p>
              <p className="text-[11px] text-red-500">
                To keep our marketplace safe and trustworthy, every seller must be verified before creating property listings.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
              alt="Modern Cityscape"
              className="rounded-xl object-cover h-64 w-full shadow-sm"
            />
          </div>
        </div>

        {/* Why Sell With RoomKH */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Why Sell With RoomKH?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Eye, title: 'High Visibility', desc: 'Reach thousands of buyers searching for properties across Cambodia every day.' },
              { icon: ShieldCheck, title: 'Verified Buyers', desc: 'Connect only with genuine and verified buyers.' },
              { icon: Clock, title: 'Easy & Fast Process', desc: 'Submit your request once and start listing after approval.' },
              { icon: TrendingUp, title: 'Better Results', desc: 'Sell your property faster with greater visibility and professional tools.' },
            ].map((card) => {
              const IconComp = card.icon;
              return (
                <div key={card.title} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm mb-3">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-xs text-gray-800">{card.title}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works Section with Dotted Connectors */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-8">How it works</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-4 relative">
            {HOW_IT_WORKS_STEPS.map((item, index) => {
              const IconComp = item.icon;
              const isLast = index === HOW_IT_WORKS_STEPS.length - 1;

              return (
                <div key={item.stepNumber} className="flex flex-col items-center text-center relative">
                  {/* Step Number Badge & Connector Line */}
                  <div className="w-full flex items-center justify-center relative mb-6">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center z-10 shadow-sm">
                      {item.stepNumber}
                    </div>

                    {!isLast && (
                      <div className="hidden lg:flex items-center absolute left-[60%] w-[80%] top-1/2 -translate-y-1/2 z-0">
                        <div className="w-full border-t-2 border-dashed border-gray-300" />
                        <div className="w-2 h-2 border-t-2 border-r-2 border-gray-400 transform rotate-45 -ml-1 flex-shrink-0" />
                      </div>
                    )}
                  </div>

                  {/* Icon Badge */}
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100/50">
                    <IconComp className="w-6 h-6 stroke-[1.8]" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-xs text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Callouts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-sm text-gray-800 mb-2">You Can Contact to Us for Request</h3>
              <p className="text-xs text-gray-500">
                If you don't have an email address or non-completed information, you can contact us through Telegram below:
              </p>
            </div>
            <a
              href="https://t.me/roomkh"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition cursor-pointer"
            >
              <span>Click here to our Telegram contact</span>
              <Send className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-sm text-gray-800 mb-2">Already Approved?</h3>
              <p className="text-xs text-gray-500">
                If your seller account has already been approved, simply log in and start creating property listings.
              </p>
            </div>
            <a
              href="/login"
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition cursor-pointer"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Form and Guidelines Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Request to Sell and Rent Your Property</h2>
              <p className="text-xs text-gray-400">Please provide accurate information so our team can review and verify your seller account.</p>
            </div>

            {statusMessage.text && (
              <div
                className={`p-3 rounded-lg text-xs font-medium ${
                  statusMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Position</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-600 bg-transparent cursor-pointer"
                  >
                    <option value="Seller">Seller</option>
                    <option value="Agent">Agent</option>
                    <option value="PROPERTY_OWNER">Owner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Business / Company Name (Optional)</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Enter your business or company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full text-xs border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Why do you want to sell properties on RoomKH?</label>
                <textarea
                  name="reason"
                  rows={4}
                  required
                  placeholder="Tell us more about yourself and your properties"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full text-xs border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-600">
                  <input
                    type="checkbox"
                    name="agreedTerms"
                    checked={formData.agreedTerms}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span>I agree to the Terms &amp; Conditions and Privacy Policy</span>
                </label>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Request'}</span>
              </button>
              </div>
            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-800">Request Guidelines</h3>
              <ul className="space-y-3 text-xs text-gray-500">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Every seller must be approved before listing properties.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Ensure all submitted information is accurate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Approval usually takes 1-2 business days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>You will receive a confirmation email after approval.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>Your personal information is kept secure and confidential.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-gray-800">Need Help?</h3>
              </div>
              <p className="text-xs text-gray-500">Our team is here to help you</p>
              
              <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-100">
                <p className="font-bold">Live Chat</p>
                <p className="text-gray-400 text-[11px]">Monday – Sunday<br />8:00 AM – 8:00 PM</p>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-bold">Email</p>
                <p className="text-blue-600">support@roomkh.com</p>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-bold">Call Us</p>
                <p className="text-gray-500">(+855) 12 345 678</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}