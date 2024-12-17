// src/components/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const auth = useSelector((state) => state.auth);
    const location = useLocation();

    useEffect(() => {
        console.log('ProtectedRoute - Current auth state:', auth);
        console.log('ProtectedRoute - Required role:', requiredRole);
    }, [auth, requiredRole]);

    if (!auth.accessToken) {
        console.log('ProtectedRoute - No access token, redirecting to login');
        // User is not logged in, redirect to login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // if (requiredRole && auth.userRole !== requiredRole) {
    //     console.log(`ProtectedRoute - User role (${auth.userRole}) doesn't match required role (${requiredRole}), redirecting to unauthorized`);
    //     // User doesn't have the required role, redirect to unauthorized page
    //     return <Navigate to="/unauthorized" replace />;
    // }

    console.log('ProtectedRoute - Access granted');
    // User is authenticated and has the required role (if specified)
    return children;
};

export default ProtectedRoute;
// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
//
// const ProtectedRoute = ({ children, requiredRole = null }) => {
//     const user = useSelector(state => state.user.user);
//     const userRole = useSelector(state => state.user.userRole);
//     const accessToken = useSelector(state => state.user.accessToken);
//     const location = useLocation();
//
//     // Check if the user is logged in based on the presence of user object or access token
//     const isLoggedIn = !!user || !!accessToken;
//
//     if (!isLoggedIn) {
//         // Redirect to the login page, saving the current location
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }
//
//     if (requiredRole && userRole !== requiredRole) {
//         // If a specific role is required and the user doesn't have it, redirect to an unauthorized page
//         return <Navigate to="/unauthorized" replace />;
//     }
//
//     return children;
// };
//
// export default ProtectedRoute;
// ========================
// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useSelector } from 'react-redux';
//
// const ProtectedRoute = ({ children, requiredRole = null }) => {
//     const isLoggedIn = useSelector(state => state.user.user !== null);
//     const userRole = useSelector(state => state.user.userRole);
//     const location = useLocation();
//
//     if (!isLoggedIn) {
//         // Redirect them to the login page, but save the current location they were
//         // trying to go to when they were redirected. This allows us to send them
//         // along to that page after they login, which is a nicer user experience
//         // than dropping them off on the home page.
//         return <Navigate to="/login" state={{ from: location }} replace />;
//     }
//
//     if (requiredRole && userRole !== requiredRole) {
//         // If a specific role is required and the user doesn't have it, redirect to an unauthorized page
//         return <Navigate to="/unauthorized" replace />;
//     }
//
//     return children;
// };
//
// export default ProtectedRoute;