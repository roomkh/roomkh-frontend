// src/routes/AppRoutes.tsx
import { Suspense, lazy } from 'react';
import type { ComponentType } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePageSkeleton from '../components/skeletons/HomePageSkeleton';
import SellPageSkeleton from '../components/skeletons/SellPageSkeleton';
import PropertyListPageSkeleton from '../components/skeletons/PropertyListPageSkeleton';
import PropertyDetailSkeleton from '../components/skeletons/PropertyDetailSkeleton';
import AboutPageSkeleton from '../components/skeletons/AboutPageSkeleton';
import HelpPageSkeleton from '../components/skeletons/HelpPageSkeleton';
import LoadingSpinner from '../components/common/LoadingSpinner';
import SellerGuard from './SellerGuard';

const HomePage = lazy(() => import('../features/public/pages/HomePage'));
const SellPage = lazy(() => import('../features/public/pages/SellPage'));
const PropertyListPage = lazy(() => import('../features/public/pages/PropertyListPage'));
const PropertyDetailPage = lazy(() => import('../features/public/pages/PropertyDetailPage'));
const AboutPage = lazy(() => import('../features/public/pages/AboutPage'));
const HelpPage = lazy(() => import('../features/public/pages/HelpPage'));
const FavoritesPage = lazy(() => import('../features/public/pages/FavoritesPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const SellerDashboard = lazy(() => import('../features/seller/pages/SellPage'));
const SellerListingsPage = lazy(() => import('../features/seller/pages/SellerListingsPage'));
const AddPropertyPage = lazy(() => import('../features/seller/pages/AddPropertyPage'));

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
      <Route path="/" element={withSkeleton(HomePage, HomePageSkeleton)} />
      <Route path="/sell" element={withSkeleton(SellPage, SellPageSkeleton)} />
      <Route path="/buy" element={withSkeleton(PropertyListPage, PropertyListPageSkeleton)} />
      <Route path="/rent" element={withSkeleton(PropertyListPage, PropertyListPageSkeleton)} />
      
      <Route path="/properties" element={withSkeleton(PropertyListPage, PropertyListPageSkeleton)} />
      <Route path="/properties/:id" element={withSkeleton(PropertyDetailPage, PropertyDetailSkeleton)} />
      <Route path="/about" element={withSkeleton(AboutPage, AboutPageSkeleton)} />
      
      <Route path="/help" element={withSkeleton(HelpPage, HelpPageSkeleton)} />
      <Route path="/favorites" element={withSkeleton(FavoritesPage, LoadingSpinner)} />
      <Route path="/login" element={withSkeleton(LoginPage, LoadingSpinner)} />
      <Route path="/register" element={withSkeleton(RegisterPage, LoadingSpinner)} />

      <Route element={<SellerGuard />}>
        <Route path="/seller" element={withSkeleton(SellerDashboard, LoadingSpinner)} />
        <Route path="/seller/listings" element={withSkeleton(SellerListingsPage, LoadingSpinner)} />
        <Route path="/seller/add-property" element={withSkeleton(AddPropertyPage, LoadingSpinner)} />
      </Route>
    </Routes>
  );
}
