import { Outlet, useLocation } from 'react-router-dom';
import SellerSidebar from '../components/common/SellerSidebar';

const PAGE_TITLES: Record<string, string> = {
  '/seller': 'Dashboard',
  '/seller/listings': 'My Listings',
  '/seller/add-property': 'Add Property',
};

export default function SellerLayout() {
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Seller Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <SellerSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">{title}</h1>
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Seller
            </span>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
