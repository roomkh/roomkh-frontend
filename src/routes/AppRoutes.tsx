import { Suspense, lazy } from 'react';
import type { ComponentType } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePageSkeleton from '../components/skeletons/HomePageSkeleton';
import SellPageSkeleton from '../components/skeletons/SellPageSkeleton';
import PropertyListPageSkeleton from '../components/skeletons/PropertyListPageSkeleton';
import SearchPageSkeleton from '../components/skeletons/SearchPageSkeleton';
import PropertyDetailSkeleton from '../components/skeletons/PropertyDetailSkeleton';
import AboutPageSkeleton from '../components/skeletons/AboutPageSkeleton';
import HelpPageSkeleton from '../components/skeletons/HelpPageSkeleton';
import DashboardPageSkeleton from '../components/skeletons/DashboardPageSkeleton';
import UserManagementPageSkeleton from '../components/skeletons/UserManagementPageSkeleton';
import OwnerManagementPageSkeleton from '../components/skeletons/OwnerManagementPageSkeleton';
import ListingManagementPageSkeleton from '../components/skeletons/ListingManagementPageSkeleton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MainLayout from '../layouts/MainLayout';
import SellerLayout from '../layouts/SellerLayout';
import AdminGuard from './AdminGuard';
import AdminRedirectGuard from './AdminRedirectGuard';
import SellerGuard from './SellerGuard';
import UserGuard from './UserGuard';

const HomePage = lazy(() => import('../features/public/pages/HomePage'));
const SellPage = lazy(() => import('../features/public/pages/SellPage'));
const PropertyListPage = lazy(() => import('../features/public/pages/PropertyListPage'));
const SearchPage = lazy(() => import('../features/public/pages/SearchPage'));
const PropertyDetailPage = lazy(() => import('../features/public/pages/PropertyDetailPage'));
const AboutPage = lazy(() => import('../features/public/pages/AboutPage'));
const HelpPage = lazy(() => import('../features/public/pages/HelpPage'));
const FavoritesPage = lazy(() => import('../features/public/pages/FavoritesPage'));
const TermsPage = lazy(() => import('../features/public/pages/TermsPage'));
const PrivacyPage = lazy(() => import('../features/public/pages/PrivacyPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const SellerDashboard = lazy(() => import('../features/seller/pages/SellPage'));
const SellerListingsPage = lazy(() => import('../features/seller/pages/SellerListingsPage'));
const AddPropertyPage = lazy(() => import('../features/seller/pages/AddPropertyPage'));
const ProfilePage = lazy(() => import('../features/user/pages/ProfilePage'));
const SettingsPage = lazy(() => import('../features/user/pages/SettingsPage'));
const DashboardPage = lazy(() => import('../features/admin/pages/DashboardPage'));
const UserManagementPage = lazy(() => import('../features/admin/pages/UserManagementPage'));
const OwnerManagementPage = lazy(() => import('../features/admin/pages/OwnerManagementPage'));
const ListingManagementPage = lazy(() => import('../features/admin/pages/ListingManagementPage'));
const SellerRequestsPage = lazy(() => import('../features/admin/pages/SellerRequestsPage'));
const PropertyStatsPage = lazy(() => import('../features/admin/pages/PropertyStatsPage'));

function withSkeleton(Page: ComponentType, Skeleton: ComponentType) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Page />
    </Suspense>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Admin routes - NO MainLayout wrapper, completely separate */}
      <Route element={<AdminGuard />}>
        <Route path="/admin" element={withSkeleton(DashboardPage, DashboardPageSkeleton)} />
        <Route path="/admin/users" element={withSkeleton(UserManagementPage, UserManagementPageSkeleton)} />
        <Route path="/admin/owners" element={withSkeleton(OwnerManagementPage, OwnerManagementPageSkeleton)} />
        <Route path="/admin/listings" element={withSkeleton(ListingManagementPage, ListingManagementPageSkeleton)} />
        <Route path="/admin/seller-requests" element={withSkeleton(SellerRequestsPage, LoadingSpinner)} />
        <Route path="/admin/property-stats" element={withSkeleton(PropertyStatsPage, DashboardPageSkeleton)} />
      </Route>

      {/* Public routes with MainLayout - admin gets redirected to /admin */}
      <Route element={<AdminRedirectGuard />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={withSkeleton(HomePage, HomePageSkeleton)} />
          <Route path="/sell" element={withSkeleton(SellPage, SellPageSkeleton)} />
          <Route path="/buy" element={withSkeleton(PropertyListPage, PropertyListPageSkeleton)} />
          <Route path="/rent" element={withSkeleton(PropertyListPage, PropertyListPageSkeleton)} />
          <Route path="/tourism" element={withSkeleton(PropertyListPage, PropertyListPageSkeleton)} />
          
          <Route path="/search" element={withSkeleton(SearchPage, SearchPageSkeleton)} />
          <Route path="/properties" element={withSkeleton(PropertyListPage, PropertyListPageSkeleton)} />
          <Route path="/properties/:id" element={withSkeleton(PropertyDetailPage, PropertyDetailSkeleton)} />
          <Route path="/about" element={withSkeleton(AboutPage, AboutPageSkeleton)} />
          
          <Route path="/help" element={withSkeleton(HelpPage, HelpPageSkeleton)} />
          <Route path="/terms" element={withSkeleton(TermsPage, AboutPageSkeleton)} />
          <Route path="/privacy" element={withSkeleton(PrivacyPage, AboutPageSkeleton)} />
          <Route path="/forgot-password" element={withSkeleton(ForgotPasswordPage, LoadingSpinner)} />
          <Route path="/favorites" element={withSkeleton(FavoritesPage, LoadingSpinner)} />
          <Route path="/login" element={withSkeleton(LoginPage, LoadingSpinner)} />
          <Route path="/register" element={withSkeleton(RegisterPage, LoadingSpinner)} />

          <Route element={<UserGuard />}>
            <Route path="/profile" element={withSkeleton(ProfilePage, LoadingSpinner)} />
            <Route path="/settings" element={withSkeleton(SettingsPage, LoadingSpinner)} />
          </Route>
        </Route>
      </Route>

      {/* Seller routes - separate layout with sidebar */}
      <Route element={<SellerGuard />}>
        <Route element={<SellerLayout />}>
          <Route path="/seller" element={withSkeleton(SellerDashboard, LoadingSpinner)} />
          <Route path="/seller/listings" element={withSkeleton(SellerListingsPage, LoadingSpinner)} />
          <Route path="/seller/add-property" element={withSkeleton(AddPropertyPage, LoadingSpinner)} />
        </Route>
      </Route>
    </Routes>
  );
}
