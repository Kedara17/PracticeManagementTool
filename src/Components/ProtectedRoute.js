import React from 'react';
import { Navigate } from 'react-router-dom';
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('oauth2'); // Replace with your actual auth check logic

    if (!isAuthenticated) {
        return <Navigate to="/" />; // Redirect to login page if not authenticated
    }

    return children;
};

export default ProtectedRoute;
