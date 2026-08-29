import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../../../components/property/PropertyCard';
import { useFavorites } from '../../../hooks/useFavorites';
import { useLanguage } from '../../../context/LanguageContext';

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { favorites } = useFavorites();

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t('propertyList.home')}</span>
          </button>
          <span>&gt;</span>
          <span className="font-semibold text-gray-800">{t('favorites.title')}</span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h1 className="text-2xl font-extrabold text-gray-900">{t('favorites.title')}</h1>
          <p className="text-xs text-gray-400 mt-1">{t('favorites.subtitle')}</p>

          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-gray-500 mb-4">{t('favorites.empty')}</p>
              <button
                onClick={() => navigate('/properties')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition cursor-pointer"
              >
                {t('propertyList.viewAll')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              {favorites.map((property) => (
                <PropertyCard key={property.id || property.slug} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
