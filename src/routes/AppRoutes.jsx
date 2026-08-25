// src/routes/AppRoutes.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePageSkeleton from '../components/skeletons/HomePageSkeleton';
import SellPageSkeleton from '../components/skeletons/SellPageSkeleton';
import PropertyListPageSkeleton from '../components/skeletons/PropertyListPageSkeleton';
import PropertyDetailSkeleton from '../components/skeletons/PropertyDetailSkeleton';
import AboutPageSkeleton from '../components/skeletons/AboutPageSkeleton';
import HelpPageSkeleton from '../components/skeletons/HelpPageSkeleton';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = lazy(() => import('../features/public/pages/HomePage'));
const SellPage = lazy(() => import('../features/public/pages/SellPage'));
const PropertyListPage = lazy(() => import('../features/public/pages/PropertyListPage'));
const PropertyDetailPage = lazy(() => import('../features/public/pages/PropertyDetailPage'));
const AboutPage = lazy(() => import('../features/public/pages/AboutPage'));
const HelpPage = lazy(() => import('../features/public/pages/HelpPage'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));

function withSkeleton(Page, Skeleton) {
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
      <Route path="/login" element={withSkeleton(LoginPage, LoadingSpinner)} />
      <Route path="/register" element={withSkeleton(RegisterPage, LoadingSpinner)} />
    </Routes>
  );
}
