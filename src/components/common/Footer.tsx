import { Link } from 'react-router-dom';
import { LOGO_URL } from '../../config/constants';
import { MapPin, Phone, Mail, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0066cc] text-white pt-12 pb-6 px-6 md:px-12 text-xs font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-blue-400/40">
          
          {/* Column 1: Brand & Logo */}
          <div className="sm:col-span-2 md:col-span-1 space-y-4 ">
            <img src={LOGO_URL} alt="RoomKH Logo" className="w-12 h-12 bg-white rounded-l object-cover shadow-lg mb-2" />

            <p className="text-blue-100/90 text-[11px] leading-relaxed max-w-xs">
              {t('footer.desc')}
            </p>

             {/* Social Icons */}
             <div className="flex items-center gap-3 pt-1 text-white">
                <a href="#" aria-label="Facebook" className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition">
                  <FacebookIcon />
                </a>
                <a href="#" aria-label="Chat" className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition">
                  <ChatIcon />
                </a>
                <a href="https://t.me/roomkh" target="_blank" rel="noreferrer" aria-label="Telegram" className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center hover:bg-white/20 transition">
                  <TelegramIcon />
                </a>
              </div>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-white text-xs">{t('footer.explore')}</h4>
            <ul className="space-y-2 text-blue-100/80 text-[11px]">
              <li><Link to="/buy" className="hover:text-white transition">{t('footer.buy')}</Link></li>
              <li><Link to="/rent" className="hover:text-white transition">{t('footer.rent')}</Link></li>
              <li><Link to="/sell" className="hover:text-white transition">{t('footer.sell')}</Link></li>
              <li><Link to="/location" className="hover:text-white transition">{t('footer.location')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-white text-xs">{t('footer.company')}</h4>
            <ul className="space-y-2 text-blue-100/80 text-[11px]">
              <li><Link to="/about" className="hover:text-white transition">{t('footer.aboutUs')}</Link></li>
              <li><Link to="/careers" className="hover:text-white transition">{t('footer.careers')}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">{t('footer.contactUs')}</Link></li>
              <li><Link to="/partner" className="hover:text-white transition">{t('footer.partnerWithUs')}</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-white text-xs">{t('footer.support')}</h4>
            <ul className="space-y-2 text-blue-100/80 text-[11px]">
              <li><Link to="/help" className="hover:text-white transition">{t('footer.helpCenter')}</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition">{t('footer.faqs')}</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">{t('footer.termsConditions')}</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">{t('footer.privacyPolicy')}</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-wider text-white text-xs">{t('footer.contact')}</h4>
            <ul className="space-y-2.5 text-blue-100/90 text-[11px]">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
                <span>{t('footer.phone')}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
                <span>{t('footer.email')}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-5 flex flex-col sm:flex-row justify-between items-center text-blue-100/80 text-[11px] gap-2">
          <p>{t('footer.rights')}</p>
          <p className="flex items-center gap-1">
            {t('footer.madeWith')} <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> {t('footer.inCambodia')}
          </p>
        </div>
      </div>
    </footer>
  );
}
