import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const Achievements = lazy(() => import('@/pages/Achievements'));
const Consultation = lazy(() => import('@/pages/Consultation'));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminContacts = lazy(() => import('@/pages/admin/AdminContacts'));
const AdminConsultations = lazy(() => import('@/pages/admin/AdminConsultations'));
const AdminAnalytics = lazy(() => import('@/pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));
const AdminHomepage = lazy(() => import('@/pages/admin/AdminHomepage'));
const AdminTeam = lazy(() => import('@/pages/admin/AdminTeam'));
const AdminMarketDashboard = lazy(() => import('@/pages/admin/AdminMarketDashboard'));
const AdminAchievements = lazy(() => import('@/pages/admin/AdminAchievements'));
const AdminCalendar = lazy(() => import('@/pages/admin/AdminCalendar'));
const AdminFounder = lazy(() => import('@/pages/admin/AdminFounder'));
const AdminInvestmentPlans = lazy(() => import('@/pages/admin/AdminInvestmentPlans'));
const AdminPresentations = lazy(() => import('@/pages/admin/AdminPresentations'));

const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Analytics />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/consultation" element={<Consultation />} />
            </Route>
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin/login" element={<Navigate to="/admin-login" replace />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/contacts"
              element={
                <ProtectedRoute>
                  <AdminContacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/consultations"
              element={
                <ProtectedRoute>
                  <AdminConsultations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute>
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/homepage"
              element={
                <ProtectedRoute>
                  <AdminHomepage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/team"
              element={
                <ProtectedRoute>
                  <AdminTeam />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/market-dashboard"
              element={
                <ProtectedRoute>
                  <AdminMarketDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/achievements"
              element={
                <ProtectedRoute>
                  <AdminAchievements />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/calendar"
              element={
                <ProtectedRoute>
                  <AdminCalendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/founder"
              element={
                <ProtectedRoute>
                  <AdminFounder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/presentations"
              element={
                <ProtectedRoute>
                  <AdminPresentations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/plans"
              element={
                <ProtectedRoute>
                  <AdminInvestmentPlans />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
