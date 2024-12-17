import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import ErrorBoundary from "../utils/ErrorBoundary";

// Lazy load components
const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
const OrdersPage = lazy(() => import('../pages/admin/OrdersPage'));
// const ProductsPage = lazy(() => import('../pages/admin/ProductsPage'));
const CustomersPage = lazy(() => import('../pages/admin/CustomersPage'));
const ReportsPage = lazy(() => import('../pages/admin/ReportsPage'));
const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'));
const CategoryManagement = lazy(() => import('../pages/admin/CategoryManagement/CategoryManagement'));
const ProductManagementComponent = lazy(() => import('../pages/admin/ProductManagementComponent/ProductManagementComponent'));

// Authentication check (replace with actual logic)
const isAuthenticated = () => {
    // Replace this with your actual authentication check
    return !!localStorage.getItem('authToken'); // Example using localStorage
};

const AdminRoutes = () => (
    <Routes>
        {/* If authenticated, show admin layout; otherwise, redirect to login */}
        {isAuthenticated() ? (
            <Route
                path="/*"
                element={
                    <AdminLayout>
                        <ErrorBoundary>
                            <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
                                <Routes>
                                    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                                    <Route path="/dashboard" element={<DashboardPage />} />
                                    <Route path="/orders" element={<OrdersPage />} />
                                    {/*<Route path="/products" element={<ProductsPage />} />*/}
                                    <Route path="/customers" element={<CustomersPage />} />
                                    <Route path="/reports" element={<ReportsPage />} />
                                    <Route path="/settings" element={<SettingsPage />} />
                                    {/* Nested routes for Category Management */}
                                    <Route path="/categories" element={<CategoryManagement />} />
                                    <Route path="/products" element={<ProductManagementComponent />} />
                                </Routes>
                            </Suspense>
                        </ErrorBoundary>
                    </AdminLayout>
                }
            />
        ) : (
            <Route path="/*" element={<Navigate to="/admin/login" replace />} />
        )}
    </Routes>
);

export default AdminRoutes;

// import React, { Suspense, lazy } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import AdminLayout from '../layouts/AdminLayout';
//
// // Lazy load components
// const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
// const OrdersPage = lazy(() => import('../pages/admin/OrdersPage'));
// const ProductsPage = lazy(() => import('../pages/admin/ProductsPage'));
// const CustomersPage = lazy(() => import('../pages/admin/CustomersPage'));
// const ReportsPage = lazy(() => import('../pages/admin/ReportsPage'));
// const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'));
//
// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { hasError: false };
//     }
//
//     static getDerivedStateFromError() {
//         return { hasError: true };
//     }
//
//     componentDidCatch(error, errorInfo) {
//         console.error("Error caught by ErrorBoundary:", error, errorInfo);
//     }
//
//     render() {
//         if (this.state.hasError) {
//             return <div className="p-4 text-center">Something went wrong.</div>;
//         }
//
//         return this.props.children;
//     }
// }
//
// const AdminRoutes = () => (
//     <AdminLayout>
//         <ErrorBoundary>
//             <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
//                 <Routes>
//                     {/* Default route redirects to /dashboard */}
//                     <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
//                     <Route path="/dashboard" element={<DashboardPage />} />
//                     <Route path="/orders" element={<OrdersPage />} />
//                     <Route path="/products" element={<ProductsPage />} />
//                     <Route path="/customers" element={<CustomersPage />} />
//                     <Route path="/reports" element={<ReportsPage />} />
//                     <Route path="/settings" element={<SettingsPage />} />
//                 </Routes>
//             </Suspense>
//         </ErrorBoundary>
//     </AdminLayout>
// );
//
// export default AdminRoutes;

// import React, { Suspense, lazy } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import AdminLayout from '../layouts/AdminLayout';
//
// // Lazy load components
// const DashboardPage = lazy(() => import('../pages/admin/DashboardPage'));
// const OrdersPage = lazy(() => import('../pages/admin/OrdersPage'));
// const ProductsPage = lazy(() => import('../pages/admin/ProductsPage'));
// const CustomersPage = lazy(() => import('../pages/admin/CustomersPage'));
// const ReportsPage = lazy(() => import('../pages/admin/ReportsPage'));
// const SettingsPage = lazy(() => import('../pages/admin/SettingsPage'));
//
// const AdminRoutes = () => (
//     <AdminLayout>
//         <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
//             <Routes>
//                 <Route path="/dashboard" element={<DashboardPage />} />
//                 <Route path="/orders" element={<OrdersPage />} />
//                 <Route path="/products" element={<ProductsPage />} />
//                 <Route path="/customers" element={<CustomersPage />} />
//                 <Route path="/reports" element={<ReportsPage />} />
//                 <Route path="/settings" element={<SettingsPage />} />
//             </Routes>
//         </Suspense>
//     </AdminLayout>
// );
//
// export default AdminRoutes;