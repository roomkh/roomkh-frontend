import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import {
  Search,
  Rocket,
  User,
  Wallet,
  Shield,
  ChevronDown,
  Send,
  ChevronRight,
} from 'lucide-react';
import HelpPageSkeleton from '../../../components/skeletons/HelpPageSkeleton';
import axiosInstance from '../../../config/axios';
import { useLanguage } from '../../../context/LanguageContext';

interface Faq {
  id: number;
  question?: string;
  answer?: string;
  questionKey?: string;
  answerKey?: string;
}

const DEFAULT_TOPICS = [
  {
    id: 1,
    titleKey: 'help.gettingStarted',
    descKey: 'help.gettingStartedDesc',
    icon: Rocket,
  },
  {
    id: 2,
    titleKey: 'help.accountProfile',
    descKey: 'help.accountProfileDesc',
    icon: User,
  },
  {
    id: 3,
    titleKey: 'help.paymentsBilling',
    descKey: 'help.paymentsBillingDesc',
    icon: Wallet,
  },
  {
    id: 4,
    titleKey: 'help.safetySecurity',
    descKey: 'help.safetySecurityDesc',
    icon: Shield,
  },
];

const INITIAL_FAQS = [
  {
    id: 1,
    questionKey: 'help.faq1Question',
    answerKey: 'help.faq1Answer',
  },
  {
    id: 2,
    questionKey: 'help.faq2Question',
    answerKey: 'help.faq2Answer',
  },
  {
    id: 3,
    questionKey: 'help.faq3Question',
    answerKey: 'help.faq3Answer',
  },
  {
    id: 4,
    questionKey: 'help.faq4Question',
    answerKey: 'help.faq4Answer',
  },
  {
    id: 5,
    questionKey: 'help.faq5Question',
    answerKey: 'help.faq5Answer',
  },
  {
    id: 6,
    questionKey: 'help.faq6Question',
    answerKey: 'help.faq6Answer',
  },
  {
    id: 7,
    questionKey: 'help.faq7Question',
    answerKey: 'help.faq7Answer',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [faqs, setFaqs] = useState<Faq[]>(INITIAL_FAQS);
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

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

  const toggleFaq = (id: number) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFaqs(INITIAL_FAQS);
      return;
    }
    const filtered = INITIAL_FAQS.filter(
      (faq) =>
        faq.questionKey?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answerKey?.toLowerCase().includes(searchQuery.toLowerCase())
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
          <span>{t('propertyDetail.breadcrumbHome')}</span> &gt; <span className="font-semibold text-gray-800">{t('help.breadcrumb')}</span>
        </div>

        {/* Hero Search Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              {t('help.title')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-lg">
              {t('help.subtitle')}
            </p>

            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('help.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-blue-600 focus:bg-white transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
              >
                {t('help.searchBtn')}
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
          <h2 className="text-xl font-bold text-gray-900">{t('help.popularTopics')}</h2>

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
                    <h3 className="font-bold text-xs text-gray-900 mb-1.5">{t(topic.titleKey)}</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{t(topic.descKey)}</p>
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
            <h2 className="text-lg font-bold text-gray-900">{t('help.faqTitle')}</h2>

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
                      <span>{t(faq.questionKey ?? '')}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-2 text-xs text-gray-500 leading-relaxed pr-6 animate-in fade-in duration-150">
                        {t(faq.answerKey ?? '')}
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
