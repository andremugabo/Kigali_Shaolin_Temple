import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, roles }) => {
    const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
