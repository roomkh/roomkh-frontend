import { useState, useEffect } from 'react';
import SelectDropdown from '../../../components/common/SelectDropdown';
import type { ChangeEvent, FormEvent } from 'react';
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
import placeholderImg from '../../../assets/images/placeholder-property.jpg';
import { submitSellerRequest } from '../../seller/services/sellerService';
import { useLanguage } from '../../../context/LanguageContext';

const HOW_IT_WORKS_STEPS = [
  {
    stepNumber: 1,
    icon: FileEdit,
    titleKey: 'sell.submitRequest',
    descKey: 'sell.submitRequestDesc',
  },
  {
    stepNumber: 2,
    icon: UserCheck,
    titleKey: 'sell.adminReview',
    descKey: 'sell.adminReviewDesc',
  },
  {
    stepNumber: 3,
    icon: MailCheck,
    titleKey: 'sell.approval',
    descKey: 'sell.approvalDesc',
  },
  {
    stepNumber: 4,
    icon: Home,
    titleKey: 'sell.createProperty',
    descKey: 'sell.createPropertyDesc',
  },
  {
    stepNumber: 5,
    icon: Users,
    titleKey: 'sell.receiveInquiries',
    descKey: 'sell.receiveInquiriesDesc',
  },
];

export default function SellPage() {
  const { t } = useLanguage();
  const POSITION_OPTIONS = [
    { value: 'Seller', label: t('sell.formPositionSeller') },
    { value: 'Agent', label: t('sell.formPositionAgent') },
    { value: 'PROPERTY_OWNER', label: t('sell.formPositionOwner') },
  ];

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

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.agreedTerms) {
      setStatusMessage({ type: 'error', text: t('sell.formMustAgree') });
      return;
    }

    setSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    try {
      await submitSellerRequest(formData);
      setStatusMessage({
        type: 'success',
        text: t('sell.submitSuccess'),
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
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      const serverError = e.response?.data?.message || t('sell.submitFailed');
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
          <span>{t('propertyDetail.breadcrumbHome')}</span> &gt; <span className="font-semibold text-gray-800">{t('sell.breadcrumb')}</span>
        </div>

        {/* Hero Banner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-6 sm:p-10 rounded-2xl border border-gray-100 shadow-sm">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {t('sell.heroTitle')} <br />
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              {t('sell.heroDesc')}
            </p>
            
            {/* Warning Box */}
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg space-y-1">
              <p className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{t('sell.adminApproval')}</span>
              </p>
              <p className="text-[11px] text-red-500">
                {t('sell.adminApprovalDesc')}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <img
              src={placeholderImg}
              alt="Modern Cityscape"
              className="rounded-xl object-cover h-64 w-full shadow-sm"
            />
          </div>
        </div>

        {/* Why Sell With RoomKH */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{t('sell.whyTitle')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Eye, titleKey: 'sell.highVisibility', descKey: 'sell.highVisibilityDesc' },
              { icon: ShieldCheck, titleKey: 'sell.verifiedBuyers', descKey: 'sell.verifiedBuyersDesc' },
              { icon: Clock, titleKey: 'sell.easyFast', descKey: 'sell.easyFastDesc' },
              { icon: TrendingUp, titleKey: 'sell.betterResults', descKey: 'sell.betterResultsDesc' },
            ].map((card) => {
              const IconComp = card.icon;
              return (
                <div key={card.titleKey} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm mb-3">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-xs text-gray-800">{t(card.titleKey)}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{t(card.descKey)}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works Section with Dotted Connectors */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-8">{t('sell.howItWorks')}</h2>
          
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
                  <h3 className="font-bold text-xs text-gray-900 mb-1.5">{t(item.titleKey)}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed max-w-[200px]">
                    {t(item.descKey)}
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
              <h3 className="font-bold text-sm text-gray-800 mb-2">{t('sell.contactTitle')}</h3>
              <p className="text-xs text-gray-500">
                {t('sell.contactDesc')}
              </p>
            </div>
            <a
              href="https://t.me/roomkh"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition cursor-pointer"
            >
              <span>{t('sell.contactTelegram')}</span>
              <Send className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 className="font-bold text-sm text-gray-800 mb-2">{t('sell.alreadyApproved')}</h3>
              <p className="text-xs text-gray-500">
                {t('sell.alreadyApprovedDesc')}
              </p>
            </div>
            <a
              href="/login"
              className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition cursor-pointer"
            >
              <span>{t('sell.goToLogin')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Form and Guidelines Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{t('sell.requestTitle')}</h2>
              <p className="text-xs text-gray-400">{t('sell.requestDesc')}</p>
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
                  <label className="text-xs font-medium text-gray-700 mb-1 block">{t('sell.formFullName')}</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder={t('sell.formFullNamePlaceholder')}
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">{t('sell.formEmail')}</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder={t('sell.formEmailPlaceholder')}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">{t('sell.formPhone')}</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder={t('sell.formPhonePlaceholder')}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full text-xs border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">{t('sell.formPosition')}</label>
                  <SelectDropdown
                    value={formData.position}
                    onChange={(next) => setFormData((prev) => ({ ...prev, position: next }))}
                    options={POSITION_OPTIONS}
                    ariaLabel={t('sell.formPosition')}
                    triggerClassName="w-full text-xs border-2 border-gray-200 rounded-lg p-2.5 bg-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">{t('sell.formCompany')}</label>
                <input
                  type="text"
                  name="companyName"
                  placeholder={t('sell.formCompanyPlaceholder')}
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full text-xs border border-gray-200 rounded-lg p-2.5 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">{t('sell.formReason')}</label>
                <textarea
                  name="reason"
                  rows={4}
                  required
                  placeholder={t('sell.formReasonPlaceholder')}
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
                  <span>{t('sell.formTerms')}</span>
                </label>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition cursor-pointer flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? t('sell.submitting') : t('sell.submitRequestBtn')}</span>
              </button>
              </div>
            </form>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-gray-800">{t('sell.guidelinesTitle')}</h3>
              <ul className="space-y-3 text-xs text-gray-500">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{t('sell.guideline1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{t('sell.guideline2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{t('sell.guideline3')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{t('sell.guideline4')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{t('sell.guideline5')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-gray-800">{t('sell.needHelpTitle')}</h3>
              </div>
              <p className="text-xs text-gray-500">{t('sell.needHelpDesc')}</p>
              
              <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-gray-100">
                <p className="font-bold">{t('sell.liveChat')}</p>
                <p className="text-gray-400 text-[11px]">{t('sell.chatHours')}</p>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-bold">{t('sell.email')}</p>
                <p className="text-blue-600">{t('sell.emailAddress')}</p>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p className="font-bold">{t('sell.callUs')}</p>
                <p className="text-gray-500">{t('sell.phoneNumber')}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
