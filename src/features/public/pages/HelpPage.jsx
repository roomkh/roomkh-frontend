import React, { useState, useEffect } from 'react';
import {
  Search,
  Rocket,
  User,
  Wallet,
  Shield,
  ChevronDown,
  Send,
  ChevronRight,
  Headphones
} from 'lucide-react';
import HelpPageSkeleton from '../../../components/skeletons/HelpPageSkeleton';
import axiosInstance from '../../../config/axios';

const DEFAULT_TOPICS = [
  {
    id: 1,
    title: 'Getting Started',
    icon: Rocket,
    desc: 'Learn how to create an account, explore properties, and get started with RoomKH.',
  },
  {
    id: 2,
    title: 'Account & Profile',
    icon: User,
    desc: 'Manage your account settings, personal information, security, and notification preferences.',
  },
  {
    id: 3,
    title: 'Payments & Billing',
    icon: Wallet,
    desc: 'Learn about payments, billing, service fees, and available payment methods.',
  },
  {
    id: 4,
    title: 'Safety & Security',
    icon: Shield,
    desc: 'Learn how RoomKH protects your account and keeps property transactions secure.',
  },
];

const INITIAL_FAQS = [
  {
    id: 1,
    question: 'How do I create a RoomKH account?',
    answer: 'Click "Sign Up" at the top right corner of the page, fill in your details (name, email, and password), and confirm your email address to complete registration.',
  },
  {
    id: 2,
    question: 'Is it free to list a property?',
    answer: 'Basic property listings are free for verified owners and sellers. Premium placement and featured listing options are available for higher visibility.',
  },
  {
    id: 3,
    question: 'How does the seller approval process work?',
    answer: 'After submitting your seller request form, our admin team reviews your information within 1–2 business days. Once approved, you can start posting properties immediately.',
  },
  {
    id: 4,
    question: 'How do I contact a property owner?',
    answer: 'On any property detail page, click the "Contact Owner" or "Send Inquiry" button to message the owner directly or call their listed phone number.',
  },
  {
    id: 5,
    question: 'What should I do if I find a suspicious listing?',
    answer: 'Click the "Report Listing" button on the property page or contact our support team immediately via Live Chat or Telegram so our team can investigate.',
  },
  {
    id: 6,
    question: 'How do I reset my password?',
    answer: 'Go to the Login page, click "Forgot Password?", enter your registered email address, and follow the link sent to your inbox to reset your password.',
  },
  {
    id: 7,
    question: 'What payment methods are available?',
    answer: 'We support local bank transfers (ABA Bank, Wing, ACLEDA) and credit/debit card payments for premium property listings.',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [openFaqId, setOpenFaqId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch topics and FAQs from API if available
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get('/faqs')
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setFaqs(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const toggleFaq = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFaqs(INITIAL_FAQS);
      return;
    }
    const filtered = INITIAL_FAQS.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFaqs(filtered);
  };

  if (loading) {
    return <HelpPageSkeleton />;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* Breadcrumb */}
        <div className="text-xs text-gray-500">
          <span>Home</span> &gt; <span className="font-semibold text-gray-800">Help Center</span>
        </div>

        {/* Hero Search Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              How can we help you?
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-lg">
              We're here to help! Find answers to common questions or contact our support team for assistance.
            </p>

            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search for answers... (e.g., How do I list a property?)"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-blue-600 focus:bg-white transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Support Agent Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <img
              src="https://img.freepik.com/free-vector/customer-support-flat-illustration_23-2148889374.jpg"
              alt="Customer Support Illustration"
              className="max-h-56 w-auto object-contain"
            />
          </div>
        </div>

        {/* Popular Topics Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Popular Topics</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEFAULT_TOPICS.map((topic) => {
              const IconComp = topic.icon;
              const isSelected = selectedTopicId === topic.id;

              return (
                <div
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopicId(isSelected ? null : topic.id);
                  }}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50 border-blue-400 shadow-md'
                      : 'bg-white border-gray-100 shadow-sm hover:border-blue-200 hover:shadow'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-gray-900 mb-1.5">{topic.title}</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{topic.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQs Section + Contact Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* FAQ Accordion List */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>

            <div className="divide-y divide-gray-100">
              {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;

                return (
                  <div key={faq.id} className="py-3.5">
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full flex items-center justify-between text-left py-1 text-xs sm:text-sm font-semibold text-gray-800 hover:text-blue-600 transition cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs text-gray-500 leading-relaxed pr-6 animate-in fade-in duration-150">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Support Cards */}
          <div className="lg:col-span-4 space-y-6">

            {/* Live Chat & Direct Contact Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-900">Still need help?</h3>
              <p className="text-xs text-gray-500">Our team is here to help you</p>

              <div className="space-y-3 pt-2">
                <div className="text-xs text-gray-700">
                  <p className="font-bold">Live Chat</p>
                  <p className="text-[11px] text-gray-400">Monday – Sunday<br />8:00 AM – 8:00 PM</p>
                </div>

                <div className="text-xs text-gray-700">
                  <p className="font-bold">Email</p>
                  <p className="text-blue-600">support@roomkh.com</p>
                </div>

                <div className="text-xs text-gray-700">
                  <p className="font-bold">Call Us</p>
                  <p className="text-gray-600 font-medium">(+855) 12 345 678</p>
                </div>
              </div>
            </div>

            {/* Telegram Support Action Banner */}
            <a
              href="https://t.me/roomkh"
              target="_blank"
              rel="noreferrer"
              className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-gray-900">Telegram Support</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Chat with us instantly on Telegram <br />
                    <span className="text-blue-600 font-semibold">@RoomKHSupport</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">Tap to start chatting automatically.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition" />
            </a>

          </div>

        </div>

      </div>
    </div>
  );
}