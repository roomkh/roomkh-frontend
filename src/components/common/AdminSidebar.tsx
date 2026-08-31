import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/owners', icon: Building2, label: 'Owners' },
  { to: '/admin/listings', icon: Home, label: 'Listings' },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.full_name || user?.fullName || user?.name || 'Admin';
  const displayEmail = user?.email || '';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`bg-white border-r border-slate-200/80 flex flex-col shrink-0 h-screen sticky top-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-full flex flex-col justify-between">
        {/* Top Section: Logo & Nav Links */}
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center px-4 border-b border-slate-100">
            <div
              className={`flex items-center gap-3 w-full ${
                isCollapsed ? 'justify-center' : 'px-2'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 shrink-0 shadow-2xs">
                <Home className="w-5 h-5" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-base font-extrabold text-slate-900 leading-tight truncate">
                    RoomKH
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium truncate">
                    Management System
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-6 space-y-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-3 rounded-2xl text-xs font-semibold transition-all group relative ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/80 shadow-2xs'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  } ${isCollapsed ? 'justify-center px-0' : 'px-3.5'}`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}

                {/* Tooltip on Hover when Collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-semibold rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Collapse Arrow Button & User Profile */}
        <div>
          {/* Clean Arrow Collapse/Expand Toggle Button */}
          <div className="px-3 py-2 border-t border-slate-100 flex justify-center">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* User Profile & Logout */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <div
              className={`flex items-center gap-3 p-2 rounded-xl ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {displayName}
                  </p>
                  {displayEmail && (
                    <p className="text-[10px] text-slate-400 truncate">
                      {displayEmail}
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              title={isCollapsed ? 'Logout' : undefined}
              className={`w-full mt-1 flex items-center gap-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer ${
                isCollapsed ? 'justify-center px-0' : 'px-3'
              }`}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}