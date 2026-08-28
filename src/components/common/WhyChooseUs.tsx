import { ShieldCheck, Tag, Lock, Headphones } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function WhyChooseUs() {
  const { t } = useLanguage();

  const FEATURES = [
    {
      icon: ShieldCheck,
      titleKey: 'why.verifiedTitle',
      descKey: 'why.verifiedDesc',
    },
    {
      icon: Tag,
      titleKey: 'why.pricesTitle',
      descKey: 'why.pricesDesc',
    },
    {
      icon: Lock,
      titleKey: 'why.secureTitle',
      descKey: 'why.secureDesc',
    },
    {
      icon: Headphones,
      titleKey: 'why.supportTitle',
      descKey: 'why.supportDesc',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-10 font-sans">
      <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          {t('why.title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.titleKey} className="flex gap-3.5 items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-800">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {t(item.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
