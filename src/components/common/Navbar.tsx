import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Settings, Globe, LogIn, UserPlus } from 'lucide-react';
import logo from '../../assets/images/logoImg-removebg-preview.png';
import cambodiaFlag from '../../assets/images/cambodia_square_icon_64.png';
import unitedKingdomFlag from '../../assets/images/united_kingdom_square_icon_64.png';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const LANGUAGES = [
  { code: 'km', label: 'Khmer', flag: cambodiaFlag },
  { code: 'en', label: 'English', flag: unitedKingdomFlag },
];

const NAV_ITEMS = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/sell', labelKey: 'nav.sell' },
  { to: '/about', labelKey: 'nav.about' },
  { to: '/help', labelKey: 'nav.help' },
];

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const selectedLang = LANGUAGES.find((lang) => lang.code === language) || LANGUAGES[1];
  const isActive = (path: string) => location.pathname === path;
  const displayName = user?.full_name || user?.fullName || user?.name || user?.email || 'Account';
  const displayEmail = user?.email || '';
  const avatarUrl = user?.avatar_url || user?.avatarUrl || user?.photo_url || user?.photoUrl;

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
        setUserDropdownOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLangDropdownOpen(false);
        setUserDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const chooseLanguage = (code: string) => {
    setLanguage(code);
    setLangDropdownOpen(false);
  };

  return (
    <header
      ref={navRef}
      className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-200 shadow-sm font-sans"
    >
      <div className="max-w-6xl mx-auto py-3 px-4 sm:px-6 lg:px-12 flex justify-between items-center">
        <Link
          to="/"
          className="flex items-center gap-2 group transition-transform active:scale-95 duration-150"
        >
          <img
            src={logo}
            alt="RoomKH Logo"
            className="h-12 sm:h-14 w-auto object-contain group-hover:opacity-90 transition-opacity"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-600">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative py-1 transition-colors duration-150 ${
                  active ? 'text-blue-600 font-bold' : 'hover:text-blue-600'
                }`}
              >
                {t(item.labelKey)}
                {active && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full animate-in fade-in zoom-in-50 duration-200" />
                )}
              </Link>
            );
          })}
          {(user?.seller_status === 'APPROVED' || user?.sellerStatus === 'APPROVED') && (
            <Link
              to="/seller"
              className={`relative py-1 transition-colors duration-150 ${
                isActive('/seller') ? 'text-blue-600 font-bold' : 'hover:text-blue-600'
              }`}
            >
              Seller Dashboard
            </Link>
          )}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => {
                setLangDropdownOpen((prev) => !prev);
                setUserDropdownOpen(false);
              }}
              className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl hover:bg-gray-100/80 active:scale-95 transition-all duration-150 border border-transparent hover:border-gray-200 cursor-pointer text-xs font-semibold text-gray-700"
              aria-label={t('nav.changeLanguage', { language: selectedLang.label })}
            >
              <img
                src={selectedLang.flag}
                alt={selectedLang.label}
                className="w-6 h-6 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-200"
              />
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-gray-400 uppercase border-b border-gray-50 mb-1 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> {t('nav.selectLanguage')}
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => chooseLanguage(lang.code)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                      selectedLang.code === lang.code
                        ? 'bg-blue-50/80 text-blue-600 font-bold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <img
                      src={lang.flag}
                      alt={lang.label}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-200"
                    />
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="relative border-l border-gray-200 pl-3">
              <button
                onClick={() => {
                  setUserDropdownOpen((prev) => !prev);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-2.5 py-1 px-2 rounded-xl hover:bg-gray-100/80 active:scale-95 transition-all duration-150 cursor-pointer"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-sm"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 border border-blue-200 shadow-sm flex items-center justify-center text-xs font-extrabold">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-bold leading-tight text-gray-800">{displayName}</p>
                  {displayEmail && <p className="text-[10px] text-gray-400 leading-none">{displayEmail}</p>}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-800">{displayName}</p>
                    {displayEmail && <p className="text-[10px] text-gray-400 truncate">{displayEmail}</p>}
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <User className="w-3.5 h-3.5 text-gray-400" /> {t('nav.profile')}
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50/80 hover:text-blue-600 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Settings className="w-3.5 h-3.5 text-gray-400" /> {t('nav.settings')}
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-gray-100">
                    <button
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                    >
                      <LogOut className="w-3.5 h-3.5" /> {t('nav.logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-bold text-gray-700 hover:text-blue-600 hover:bg-gray-100/80 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('nav.login')}</span>
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-sm hover:shadow transition cursor-pointer flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t('nav.signup')}</span>
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-gray-100/80 transition-all active:scale-90 focus:outline-none cursor-pointer"
          aria-label={t('nav.toggle')}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-xl border-t border-gray-100 px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-3 duration-200">
          <nav className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive(item.to)
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            {(user?.seller_status === 'APPROVED' || user?.sellerStatus === 'APPROVED') && (
              <Link
                to="/seller"
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  isActive('/seller')
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Seller Dashboard
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">{t('nav.language')}</span>
              <div className="flex gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => chooseLanguage(lang.code)}
                    aria-label={t('nav.switchLanguage', { language: lang.label })}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      selectedLang.code === lang.code
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    <img
                      src={lang.flag}
                      alt={lang.label}
                      className="w-6 h-6 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-200"
                    />
                  </button>
                ))}
              </div>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2.5">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm"
                    />
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 border border-blue-200 shadow-sm flex items-center justify-center text-xs font-extrabold">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div>
                    <p className="text-xs font-bold leading-tight text-gray-800">{displayName}</p>
                    {displayEmail && <p className="text-[10px] text-gray-400">{displayEmail}</p>}
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  className="text-xs text-red-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-bold text-gray-700 bg-gray-100 rounded-xl transition hover:bg-gray-200"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-xs font-bold text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 transition"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
