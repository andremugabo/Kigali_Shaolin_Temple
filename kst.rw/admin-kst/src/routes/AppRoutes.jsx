import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

// Lazy load pages for performance
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const BlogListPage = lazy(() => import('../pages/Blogs/BlogListPage'));
const ClubListPage = lazy(() => import('../pages/Clubs/ClubListPage'));
const ProgramListPage = lazy(() => import('../pages/Programs/ProgramListPage'));
const GalleryPage = lazy(() => import('../pages/Gallery/GalleryPage'));
const UserListPage = lazy(() => import('../pages/Users/UserListPage'));
const ProfilePage = lazy(() => import('../pages/Users/ProfilePage'));
const AuditLogPage = lazy(() => import('../pages/AuditLogs/AuditLogPage'));
const HeroSlidesPage = lazy(() => import('../pages/HeroSlides/HeroSlidesPage'));
const AboutManagement = lazy(() => import('../pages/About/AboutManagement'));
const MessageListPage = lazy(() => import('../pages/Messages/MessageListPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Placeholder components for other pages
const PlaceholderPage = ({ title }) => (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title} Page</h2>
            <p className="text-gray-400 font-medium">This module is coming soon in the next phase of implementation.</p>
        </div>
    </div>
);

const AppRoutes = () => {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <MainLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />

                    <Route path="blogs" element={
                        <ProtectedRoute roles={['Super Admin', 'Admin', 'Content Manager', 'Blogger', 'Editor']}>
                            <BlogListPage />
                        </ProtectedRoute>
                    } />
                    <Route path="clubs" element={
                        <ProtectedRoute roles={['Super Admin', 'Admin', 'Content Manager', 'Editor']}>
                            <ClubListPage />
                        </ProtectedRoute>
                    } />
                    <Route path="programs" element={
                        <ProtectedRoute roles={['Super Admin', 'Admin', 'Content Manager', 'Editor']}>
                            <ProgramListPage />
                        </ProtectedRoute>
                    } />
                    <Route path="gallery" element={
                        <ProtectedRoute roles={['Super Admin', 'Admin', 'Content Manager', 'Editor']}>
                            <GalleryPage />
                        </ProtectedRoute>
                    } />
                    <Route path="about" element={
                        <ProtectedRoute roles={['Super Admin', 'Admin', 'Content Manager', 'Editor']}>
                            <AboutManagement />
                        </ProtectedRoute>
                    } />

                    <Route path="messages" element={
                        <ProtectedRoute roles={['Super Admin', 'Admin', 'Content Manager', 'Editor']}>
                            <MessageListPage />
                        </ProtectedRoute>
                    } />

                    <Route path="users" element={
                        <ProtectedRoute roles={['Super Admin', 'Admin']}>
                            <UserListPage />
                        </ProtectedRoute>
                    } />

                    <Route path="audit-logs" element={
                        <ProtectedRoute roles={['Super Admin']}>
                            <AuditLogPage />
                        </ProtectedRoute>
                    } />

                    <Route path="hero-slides" element={
                        <ProtectedRoute roles={['Super Admin', 'Admin']}>
                            <HeroSlidesPage />
                        </ProtectedRoute>
                    } />

                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
