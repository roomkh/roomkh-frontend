import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginBg from '../../../assets/images/logi-bg.jpg';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Search, 
  Home, 
  KeyRound, 
  ArrowRight 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from '../../../context/LanguageContext';
import { LOGO_URL } from '../../../config/constants';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(t('register.passwordMismatch'));
      return;
    }

    if (!formData.agreeTerms) {
      setErrorMessage(t('register.mustAgree'));
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      const serverMsg = e.response?.data?.message || e.message || t('register.failed');
      setErrorMessage(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  const { googleLogin: authGoogleLogin } = useAuth();

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const credential = (tokenResponse as { id_token?: string }).id_token;
      if (!credential) {
        setErrorMessage('Google sign-in failed: no credential received');
        return;
      }
      try {
        await authGoogleLogin(credential);
        navigate('/');
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Google sign-in failed');
      }
    },
    onError: () => {
      setErrorMessage('Google sign-in was cancelled or failed');
    },
  });

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 font-sans bg-white">
      
      {/* Left Feature Column */}
      <div className="hidden lg:flex lg:col-span-7 relative bg-gray-50 flex-col justify-between p-12 overflow-hidden border-r border-gray-100">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity- filter grayscale"
          style={{
            backgroundImage: `url(${loginBg})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/90 via-white/70 to-blue-50/40 z-0" />

        <div className="relative z-10 space-y-3">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={LOGO_URL} alt="RoomKH Logo" className="h-10 w-auto object-contain" />
            <div>
              <span className="font-extrabold text-lg text-blue-900 tracking-tight block leading-none">
                RoomKH
              </span>
              <span className="text-[10px] text-gray-500 font-medium">Property Ecosystem</span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg space-y-8 my-auto py-12">
          <div className="space-y-4">
            <span className="inline-block bg-blue-100/70 text-blue-700 text-[11px] font-bold px-3 py-1 rounded-full">
              {t('register.badge')}
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {t('register.heroTitle')} <br />
              <span className="text-blue-600">{t('register.heroTitleAccent')}</span>
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed">
              {t('register.heroDesc')}
            </p>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-gray-800">{t('register.feature1Title')}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {t('register.feature1Desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-gray-800">{t('register.feature2Title')}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {t('register.feature2Desc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center flex-shrink-0 shadow-xs">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-gray-800">{t('register.feature3Title')}</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  {t('register.feature3Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[11px] text-gray-400">
          © 2026 RoomKH. All rights reserved.
        </div>
      </div>

      {/* Right Form Container */}
      <div className="lg:col-span-5 bg-[#0066cc] flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
              <img src={LOGO_URL} alt="RoomKH Icon" className="w-7 h-7 object-contain filter brightness-0 invert" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight pt-1">
              {t('register.title')}
            </h2>
            <p className="text-xs text-gray-400">
              {t('register.subtitle')}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl text-center font-medium">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">{t('register.fullNameLabel')}</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder={t('register.fullNamePlaceholder')}
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">{t('register.emailLabel')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder={t('register.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">{t('register.phoneLabel')}</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder={t('register.phonePlaceholder')}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">{t('register.passwordLabel')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder={t('register.passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-blue-600 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block">{t('register.confirmPasswordLabel')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder={t('register.confirmPasswordPlaceholder')}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 outline-none focus:border-blue-600 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-600">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>
                  {t('register.agreeTerms')}{' '}
                  <Link to="/terms" className="text-blue-600 font-bold hover:underline">
                    {t('register.termsOfService')}
                  </Link>{' '}
                  {t('register.and')}{' '}
                  <Link to="/privacy" className="text-blue-600 font-bold hover:underline">
                    {t('register.privacyPolicy')}
                  </Link>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? t('register.creatingAccount') : t('register.signUp')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-bold text-gray-400 tracking-wider uppercase absolute">
              {t('login.or')}
            </span>
          </div>

          {/* Social Register */}
          <button
            type="button"
            onClick={() => handleGoogleSignIn()}
            className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.98] text-gray-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2.5 cursor-pointer shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t('register.googleSignUp')}</span>
          </button>

          {/* Bottom Login Link */}
          <div className="text-center pt-1">
            <p className="text-xs text-gray-500">
              {t('register.hasAccount')}{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:underline">
                {t('register.signIn')}
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
