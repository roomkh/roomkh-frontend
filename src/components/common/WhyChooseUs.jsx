import React from 'react';
import { ShieldCheck, Tag, Lock, Headphones } from 'lucide-react';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Listing",
    desc: "Every property is verified for your peace of mind."
  },
  {
    icon: Tag,
    title: "Best Prices",
    desc: "Compare prices and find the best deals."
  },
  {
    icon: Lock,
    title: "Secure Transactions",
    desc: "Buy with confidence through trusted owners."
  },
  {
    icon: Headphones,
    title: "Expert Support",
    desc: "Our support team is ready to help throughout your journey."
  }
];

export default function WhyChooseUs() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-10 font-sans">
      <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
          Why choosing RoomKH?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {FEATURES.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.title} className="flex gap-3.5 items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {item.desc}
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