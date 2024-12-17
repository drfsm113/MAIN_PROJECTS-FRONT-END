import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import WebsiteLayout from '../layouts/WebsiteLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from "../utils/ErrorBoundary";
import { useSelector } from 'react-redux';
import ProtectedRoute from "../Guard/ProtectedRoute";
import Wishlist from "../pages/Wishlist";

const HomePage = lazy(() => import('../pages/HomePage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
const ChangePasswordPage = lazy(() => import('../pages/ChangePasswordPage'));
const UnauthorizedPage = lazy(() => import('../pages/UnauthorizedPage'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));

const WebsiteRoutes = () => {
    const isLoggedIn = useSelector(state => state.auth.user !== null);

    return (
        <WebsiteLayout>
            <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/product/:slug/" element={<ProductDetailPage />} />

                        {/* Protected routes */}
                        <Route path="/cart" element={
                            <ProtectedRoute>
                                <CartPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/wishlist" element={
                            <ProtectedRoute>
                                <Wishlist />
                            </ProtectedRoute>
                        } />

                        <Route path="/checkout" element={
                            <ProtectedRoute>
                                <CheckoutPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } />
                        <Route path="/change-password" element={
                            <ProtectedRoute>
                                <ChangePasswordPage />
                            </ProtectedRoute>
                        } />

                        {/* Authentication routes */}
                        <Route path="/login" element={
                            isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />
                        } />
                        <Route path="/register" element={
                            isLoggedIn ? <Navigate to="/" replace /> : <RegisterPage />
                        } />
                        <Route path="/forgot-password" element={
                            isLoggedIn ? <Navigate to="/" replace /> : <ForgotPasswordPage />
                        } />
                        <Route path="/reset-password/:uidb64/:token/" element={
                            isLoggedIn ? <Navigate to="/" replace /> : <ResetPasswordPage />
                        } />

                        {/* Unauthorized and Not Found pages */}
                        <Route path="/unauthorized" element={<UnauthorizedPage />} />
                        {/* Catch-all route for undefined paths */}
                        <Route path="*" element={<PageNotFound />} />
                    </Routes>
                </Suspense>
            </ErrorBoundary>
        </WebsiteLayout>
    );
};

export default WebsiteRoutes;
// ===========================
// import React, { Suspense, lazy } from 'react';
// import { Routes, Route } from 'react-router-dom';
// import WebsiteLayout from '../layouts/WebsiteLayout';
// import LoadingSpinner from '../components/LoadingSpinner';
// import ErrorBoundary from "../utils/ErrorBoundary";
//
//
// const HomePage = lazy(() => import('../pages/HomePage'));
// const CartPage = lazy(() => import('../pages/CartPage'));
// const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
// const ProductsPage = lazy(() => import('../pages/ProductsPage'));
// const ContactPage = lazy(() => import('../pages/ContactPage'));
// const AboutPage = lazy(() => import('../pages/AboutPage'));
// const ProfilePage = lazy(() => import('../pages/ProfilePage'));
// const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'));
// const LoginPage = lazy(() => import('../pages/LoginPage'));
// const RegisterPage = lazy(() => import('../pages/RegisterPage'));
// const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage'));
// const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage'));
// const ChangePasswordPage = lazy(() => import('../pages/ChangePasswordPage'));
//
// const WebsiteRoutes = () => (
//     <WebsiteLayout>
//         <ErrorBoundary>
//         <Suspense fallback={<LoadingSpinner />}>
//             <Routes>
//                 <Route path="/" element={<HomePage />} />
//                 <Route path="/products" element={<ProductsPage />} />
//                 <Route path="/contact" element={<ContactPage />} />
//                 <Route path="/cart" element={<CartPage />} />
//                 <Route path="/checkout" element={<CheckoutPage />} />
//                 <Route path="/about" element={<AboutPage />} />
//                 <Route path="/profile" element={<ProfilePage />} />
//                 <Route path="/product" element={<ProductDetailPage />} />
//                 <Route path="/login" element={<LoginPage />} />
//                 <Route path="/register" element={<RegisterPage />} />
//                 <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//                 <Route path="/reset-password" element={<ResetPasswordPage />} />
//                 <Route path="/change-password" element={<ChangePasswordPage />} />
//             </Routes>
//         </Suspense>
//         </ErrorBoundary>
//     </WebsiteLayout>
// );
//
// export default WebsiteRoutes;