// src/components/LoginPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import AuthService from "../Services/AuthService";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import {
    setTokens,
    setUser,
    setLoading,
    setError,
    clearError,
    selectIsLoading,
    selectError
} from "../store/reducers/authSlice";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);

    useEffect(() => {
        // Clear any existing errors when component mounts
        dispatch(clearError());

        // Clear loading state when component unmounts
        return () => dispatch(setLoading(false));
    }, [dispatch]);

    const handleLogin = useCallback(async (e) => {
        e.preventDefault();
        setSuccess('');
        dispatch(clearError());
        dispatch(setLoading(true));

        try {
            console.log('Attempting login with:', { email });
            const response = await AuthService.login(email, password);
            console.log('Login response:', response);

            if (response.success) {
                dispatch(setTokens({
                    accessToken: response.access,
                    refreshToken: response.refresh
                }));
                dispatch(setUser({
                    user: response.user_detail,
                    userRole: response.role
                }));

                setSuccess('Logged in successfully!');
                const from = location.state?.from || "/profile";
                // const from = location.state?.from?.pathname || "/profile";
                console.log('Redirecting to:', from);
                setTimeout(() => navigate(from, { replace: true }), 1500);
            } else {
                dispatch(setError(response.message || 'Failed to log in. Please try again.'));
            }
        } catch (err) {
            console.error('Login error:', err);
            dispatch(setError('Failed to log in. Please check your credentials.'));
        } finally {
            dispatch(setLoading(false));
        }
    }, [email, password, dispatch, navigate, location]);

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <input
                            id="email"
                            type="email"
                            placeholder="Email Address"
                            className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="relative"
                    >
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <InputAdornment position="end" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-red-600 text-sm font-semibold"
                        >
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-green-600 text-sm font-semibold"
                        >
                            {success}
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                    >
                        <motion.button
                            type="submit"
                            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </motion.button>
                    </motion.div>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary hover:text-primary-dark">
                            Register
                        </Link>
                    </p>
                    <p className="text-sm text-gray-600">
                        <Link to="/forgot-password" className="text-primary hover:text-primary-dark">
                            Forgot your password?
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
// ========================old==================
// import React, { useState } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { motion } from 'framer-motion';
// import AuthService from "../Services/AuthService";
// import { updateUser } from "../store/actions/userActions";
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { IconButton, InputAdornment } from '@mui/material';
// import backgroundImage from '../assets/image_transparent_Craiyon.png';
// const LoginPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useDispatch();
//
//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');
//
//         try {
//             const response = await AuthService.login(email, password);
//             if (response.success) {
//                 // Store tokens in localStorage
//                 localStorage.setItem('access_token', response.access);
//                 localStorage.setItem('refresh_token', response.refresh);
//
//                 // Store user details
//                 localStorage.setItem('user_details', JSON.stringify(response.user_detail));
//                 localStorage.setItem('user_slug', JSON.stringify(response.user_detail?.slug));
//
//                 dispatch(updateUser({
//                     user: response.user_detail,
//                     userRole: response.role
//                 }));
//
//                 setSuccess('Logged in successfully!');
//                 const from = location.state?.from?.pathname || "/profile";
//                 setTimeout(() => navigate(from, { replace: true }), 1500);
//             } else {
//                 setError(response.message || 'Failed to log in. Please try again.');
//             }
//         } catch (err) {
//             setError('Failed to log in. Please check your credentials.');
//         }
//     };
//
//     const handleClickShowPassword = () => {
//         setShowPassword(!showPassword);
//     };
//
//     const handleMouseDownPassword = (event) => {
//         event.preventDefault();
//     };
//     const backgroundStyle = {
//         backgroundImage: `url(${backgroundImage})`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundRepeat: 'no-repeat',
//     };
//     return (
//         <div className="min-h-screen flex items-center justify-center">
//             <motion.div
//                 className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
//                 <form onSubmit={handleLogin} className="space-y-6">
//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         <input
//                             id="email"
//                             type="email"
//                             placeholder="Email Address"
//                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </motion.div>
//
//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.1 }}
//                         className="relative"
//                     >
//                         <input
//                             id="password"
//                             type={showPassword ? 'text' : 'password'}
//                             placeholder="Password"
//                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                         <InputAdornment position="end" className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                             <IconButton
//                                 aria-label="toggle password visibility"
//                                 onClick={handleClickShowPassword}
//                                 onMouseDown={handleMouseDownPassword}
//                                 edge="end"
//                             >
//                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                             </IconButton>
//                         </InputAdornment>
//                     </motion.div>
//
//                     {error && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.3 }}
//                             className="text-red-600 text-sm font-semibold"
//                         >
//                             {error}
//                         </motion.div>
//                     )}
//                     {success && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.3 }}
//                             className="text-green-600 text-sm font-semibold"
//                         >
//                             {success}
//                         </motion.div>
//                     )}
//
//                     <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.5 }}
//                     >
//                         <motion.button
//                             type="submit"
//                             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-200"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                         >
//                             Login
//                         </motion.button>
//                     </motion.div>
//                 </form>
//
//                 <div className="mt-6 text-center space-y-2">
//                     <p className="text-sm text-gray-600">
//                         Don't have an account?{' '}
//                         <Link to="/register" className="text-primary hover:text-primary-dark">
//                             Register
//                         </Link>
//                     </p>
//                     <p className="text-sm text-gray-600">
//                         <Link to="/forgot-password" className="text-primary hover:text-primary-dark">
//                             Forgot your password?
//                         </Link>
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };
//
// export default LoginPage;
// ========
// import React, { useState } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { motion } from 'framer-motion';
// import AuthService from "../Services/AuthService";
// import { updateUser } from "../store/actions/userActions";
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import { IconButton, InputAdornment } from '@mui/material';
//
// const LoginPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [showPassword, setShowPassword] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useDispatch();
//
//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');
//
//         try {
//             const userData = await AuthService.login(email, password);
//             dispatch(updateUser({
//                 user: userData,
//                 userRole: userData.role
//             }));
//             setSuccess('Logged in successfully!');
//             const from = location.state?.from?.pathname || "/profile";
//             setTimeout(() => navigate(from, { replace: true }), 1500);
//         } catch (err) {
//             setError('Failed to log in. Please check your credentials.');
//         }
//     };
//
//     const handleClickShowPassword = () => {
//         setShowPassword(!showPassword);
//     };
//
//     const handleMouseDownPassword = (event) => {
//         event.preventDefault();
//     };
//
//     return (
//         <div className="min-h-screen flex items-center justify-center">
//             <motion.div
//                 className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
//                 <form onSubmit={handleLogin} className="space-y-6">
//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         <input
//                             id="email"
//                             type="email"
//                             placeholder="Email Address"
//                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </motion.div>
//
//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.1 }}
//                         className="relative"
//                     >
//                         <input
//                             id="password"
//                             type={showPassword ? 'text' : 'password'}
//                             placeholder="Password"
//                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary pr-10"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                         <InputAdornment position="end" className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                             <IconButton
//                                 aria-label="toggle password visibility"
//                                 onClick={handleClickShowPassword}
//                                 onMouseDown={handleMouseDownPassword}
//                                 edge="end"
//                             >
//                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                             </IconButton>
//                         </InputAdornment>
//                     </motion.div>
//
//                     {error && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.3 }}
//                             className="text-red-600 text-sm font-semibold"
//                         >
//                             {error}
//                         </motion.div>
//                     )}
//                     {success && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.3 }}
//                             className="text-green-600 text-sm font-semibold"
//                         >
//                             {success}
//                         </motion.div>
//                     )}
//
//                     <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.5 }}
//                     >
//                         <motion.button
//                             type="submit"
//                             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-200"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                         >
//                             Login
//                         </motion.button>
//                     </motion.div>
//                 </form>
//
//                 <div className="mt-6 text-center space-y-2">
//                     <p className="text-sm text-gray-600">
//                         Don't have an account?{' '}
//                         <Link to="/register" className="text-primary hover:text-primary-dark">
//                             Register
//                         </Link>
//                     </p>
//                     <p className="text-sm text-gray-600">
//                         <Link to="/forgot-password" className="text-primary hover:text-primary-dark">
//                             Forgot your password?
//                         </Link>
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };
//
// export default LoginPage;
//


// =================
// import React, { useState } from 'react';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { motion } from 'framer-motion';
// import AuthService from "../Services/AuthService";
// import {updateUser} from "../store/actions/userActions";
//
// const LoginPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useDispatch();
//
//     const handleLogin = async (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');
//
//         try {
//             const userData = await AuthService.login(email, password);
//             dispatch(updateUser({
//                 user: userData,
//                 userRole: userData.role
//             }));
//             setSuccess('Logged in successfully!');
//             const from = location.state?.from?.pathname || "/";
//             setTimeout(() => navigate(from, { replace: true }), 1500);
//         } catch (err) {
//             setError('Failed to log in. Please check your credentials.');
//         }
//     };
//
//     return (
//         <div className="min-h-screen flex items-center justify-center">
//             <motion.div
//                 className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
//                 <form onSubmit={handleLogin} className="space-y-6">
//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         <input
//                             id="email"
//                             type="email"
//                             placeholder="Email Address"
//                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </motion.div>
//
//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.1 }}
//                     >
//                         <input
//                             id="password"
//                             type="password"
//                             placeholder="Password"
//                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </motion.div>
//
//                     {error && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.3 }}
//                             className="text-red-600 text-sm font-semibold"
//                         >
//                             {error}
//                         </motion.div>
//                     )}
//                     {success && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.3 }}
//                             className="text-green-600 text-sm font-semibold"
//                         >
//                             {success}
//                         </motion.div>
//                     )}
//
//                     <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.5 }}
//                     >
//                         <motion.button
//                             type="submit"
//                             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-200"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                         >
//                             Login
//                         </motion.button>
//                     </motion.div>
//                 </form>
//
//                 <div className="mt-6 text-center space-y-2">
//                     <p className="text-sm text-gray-600">
//                         Don't have an account?{' '}
//                         <Link to="/register" className="text-primary hover:text-primary-dark">
//                             Register
//                         </Link>
//                     </p>
//                     <p className="text-sm text-gray-600">
//                         <Link to="/forgot-password" className="text-primary hover:text-primary-dark">
//                             Forgot your password?
//                         </Link>
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };
//
// export default LoginPage;
// // //<editor-fold desc="design">
// // import React, { useState } from 'react';
// // import { motion } from 'framer-motion';
// // import { Link } from 'react-router-dom';
// //
// // const LoginPage = () => {
// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');
// //     const [error, setError] = useState('');
// //     const [success, setSuccess] = useState('');
// //
// //     const handleLogin = (e) => {
// //         e.preventDefault();
// //         setError('');
// //         setSuccess('');
// //
// //         // Implement login logic here
// //
// //         setSuccess('Logged in successfully!');
// //     };
// //
// //     return (
// //         <div className="min-h-screen  flex items-center justify-center">
// //             <motion.div
// //                 className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
// //                 initial={{ opacity: 0, scale: 0.95 }}
// //                 animate={{ opacity: 1, scale: 1 }}
// //                 transition={{ duration: 0.5 }}
// //             >
// //                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
// //                     Login
// //                 </h2>
// //                 <form onSubmit={handleLogin} className="space-y-6">
// //                     {/* Email Input */}
// //                     <motion.div
// //                         initial={{ opacity: 0, y: -30 }}
// //                         animate={{ opacity: 1, y: 0 }}
// //                         transition={{ duration: 0.3 }}
// //                     >
// //                         {/*<label htmlFor="email" className="block text-gray-700 font-semibold">*/}
// //                         {/*    Email Address*/}
// //                         {/*</label>*/}
// //                         <input
// //                             id="email"
// //                             type="email"
// //                             placeholder="Email Address"
// //                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
// //                             value={email}
// //                             onChange={(e) => setEmail(e.target.value)}
// //                             required
// //                         />
// //                     </motion.div>
// //
// //                     {/* Password Input */}
// //                     <motion.div
// //                         initial={{ opacity: 0, y: -30 }}
// //                         animate={{ opacity: 1, y: 0 }}
// //                         transition={{ duration: 0.3, delay: 0.1 }}
// //                     >
// //                         {/*<label htmlFor="password" className="block text-gray-700 font-semibold">*/}
// //                         {/*    Password*/}
// //                         {/*</label>*/}
// //                         <input
// //                             id="password"
// //                             type="password"
// //                             placeholder="Password"
// //                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
// //                             value={password}
// //                             onChange={(e) => setPassword(e.target.value)}
// //                             required
// //                         />
// //                     </motion.div>
// //
// //                     {/* Error and Success Messages */}
// //                     {error && (
// //                         <motion.div
// //                             initial={{ opacity: 0 }}
// //                             animate={{ opacity: 1 }}
// //                             transition={{ duration: 0.3 }}
// //                             className="text-red-600 text-sm font-semibold"
// //                         >
// //                             {error}
// //                         </motion.div>
// //                     )}
// //                     {success && (
// //                         <motion.div
// //                             initial={{ opacity: 0 }}
// //                             animate={{ opacity: 1 }}
// //                             transition={{ duration: 0.3 }}
// //                             className="text-green-600 text-sm font-semibold"
// //                         >
// //                             {success}
// //                         </motion.div>
// //                     )}
// //
// //                     {/* Submit Button */}
// //                     <motion.div
// //                         initial={{ opacity: 0, y: 30 }}
// //                         animate={{ opacity: 1, y: 0 }}
// //                         transition={{ duration: 0.3, delay: 0.5 }}
// //                     >
// //                         <motion.button
// //                             type="submit"
// //                             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-200"
// //                             whileHover={{ scale: 1.05 }}
// //                             whileTap={{ scale: 0.95 }}
// //                         >
// //                             Login
// //                         </motion.button>
// //                     </motion.div>
// //                 </form>
// //
// //                 {/* Links */}
// //                 <div className="mt-6 text-center space-y-2">
// //                     <p className="text-sm text-gray-600">
// //                         Don't have an account?{' '}
// //                         <Link to="/register" className="text-primary hover:text-primary-dark">
// //                             Register
// //                         </Link>
// //                     </p>
// //                     <p className="text-sm text-gray-600">
// //                         <Link to="/forgot-password" className="text-primary hover:text-primary-dark">
// //                             Forgot your password?
// //                         </Link>
// //                     </p>
// //                 </div>
// //             </motion.div>
// //         </div>
// //     );
// // };
// //
// // export default LoginPage;
// // //</editor-fold>
// //
// // // import React, { useState } from 'react';
// // // import { Link, useNavigate } from 'react-router-dom';
// // // import { motion } from 'framer-motion';
// // //
// // // const LoginPage = () => {
// // //     const [email, setEmail] = useState('');
// // //     const [password, setPassword] = useState('');
// // //     const [error, setError] = useState('');
// // //     const navigate = useNavigate();
// // //
// // //     const handleLogin = (e) => {
// // //         e.preventDefault();
// // //         setError('');
// // //
// // //         if (email && password) {
// // //             // Perform login logic here
// // //             navigate('/dashboard');
// // //         } else {
// // //             setError('Please fill in all fields');
// // //         }
// // //     };
// // //
// // //     return (
// // //         <div className="min-h-screen  flex items-center justify-center">
// // //             <motion.div
// // //                 className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
// // //                 initial={{ opacity: 0, scale: 0.95 }}
// // //                 animate={{ opacity: 1, scale: 1 }}
// // //                 transition={{ duration: 0.5 }}
// // //             >
// // //                 <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
// // //                     Welcome <span  className="text-primary" >Back</span>
// // //                 </h2>
// // //                 <form onSubmit={handleLogin} className="space-y-6">
// // //                     {/* Email Input */}
// // //                     <motion.div
// // //                         initial={{ opacity: 0, y: -30 }}
// // //                         animate={{ opacity: 1, y: 0 }}
// // //                         transition={{ duration: 0.3 }}
// // //                     >
// // //                         <label htmlFor="email" className="block text-gray-700 font-semibold">
// // //                             Email Address
// // //                         </label>
// // //                         <input
// // //                             id="email"
// // //                             type="email"
// // //                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
// // //                             value={email}
// // //                             onChange={(e) => setEmail(e.target.value)}
// // //                             required
// // //                         />
// // //                     </motion.div>
// // //
// // //                     {/* Password Input */}
// // //                     <motion.div
// // //                         initial={{ opacity: 0, y: -30 }}
// // //                         animate={{ opacity: 1, y: 0 }}
// // //                         transition={{ duration: 0.3, delay: 0.1 }}
// // //                     >
// // //                         <label htmlFor="password" className="block text-gray-700 font-semibold">
// // //                             Password
// // //                         </label>
// // //                         <input
// // //                             id="password"
// // //                             type="password"
// // //                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
// // //                             value={password}
// // //                             onChange={(e) => setPassword(e.target.value)}
// // //                             required
// // //                         />
// // //                     </motion.div>
// // //
// // //                     {/* Error Message */}
// // //                     {error && (
// // //                         <motion.div
// // //                             initial={{ opacity: 0 }}
// // //                             animate={{ opacity: 1 }}
// // //                             transition={{ duration: 0.3 }}
// // //                             className="text-red-600 text-sm font-semibold"
// // //                         >
// // //                             {error}
// // //                         </motion.div>
// // //                     )}
// // //
// // //                     {/* Login Button */}
// // //                     <motion.div
// // //                         initial={{ opacity: 0, y: 30 }}
// // //                         animate={{ opacity: 1, y: 0 }}
// // //                         transition={{ duration: 0.3, delay: 0.2 }}
// // //                     >
// // //                         <motion.button
// // //                             type="submit"
// // //                             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-200"
// // //                             whileHover={{ scale: 1.05 }}
// // //                             whileTap={{ scale: 0.95 }}
// // //                         >
// // //                             Log In
// // //                         </motion.button>
// // //                     </motion.div>
// // //                 </form>
// // //
// // //                 {/* Links */}
// // //                 <div className="mt-6 text-center">
// // //                     <p className="text-sm text-gray-600">
// // //                         Don't have an account?{' '}
// // //                         <Link to="/register" className="text-primary hover:text-primary-dark">
// // //                             Register
// // //                         </Link>
// // //                     </p>
// // //                 </div>
// // //             </motion.div>
// // //         </div>
// // //     );
// // // };
// // //
// // // export default LoginPage;
// // //
// // // // import React from 'react';
// // // // import { useNavigate } from 'react-router-dom';
// // // // import FormComponent from "../components/FormComponent";
// // // //
// // // // const LoginPage = () => {
// // // //     const navigate = useNavigate();
// // // //
// // // //     const handleLogin = async (formData) => {
// // // //         console.log('Login Data:', formData);
// // // //         // Simulate a login process
// // // //         await new Promise(resolve => setTimeout(resolve, 1000));
// // // //         navigate('/dashboard'); // Redirect to the dashboard or another page after login
// // // //     };
// // // //
// // // //     const fields = [
// // // //         { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email' },
// // // //         { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' }
// // // //     ];
// // // //
// // // //     return (
// // // //         <FormComponent
// // // //             title="Login to Your Account"
// // // //             fields={fields}
// // // //             submitHandler={handleLogin}
// // // //             submitButtonText="Login"
// // // //             linkText="Don't have an account? Register here"
// // // //             linkHref="/register"
// // // //             columns={false} // Use single column layout
// // // //         />
// // // //     );
// // // // };
// // // //
// // // // export default LoginPage;
// // // //
// // // // // import React from 'react';
// // // // // import { useNavigate } from 'react-router-dom';
// // // // // import FormComponent from "../components/FormComponent";
// // // // //
// // // // // const LoginPage = () => {
// // // // //     const navigate = useNavigate();
// // // // //
// // // // //     const handleLogin = async (formData) => {
// // // // //         console.log('Login Data:', formData);
// // // // //         // Simulate a login process
// // // // //         await new Promise(resolve => setTimeout(resolve, 1000));
// // // // //         navigate('/dashboard'); // Redirect to dashboard or home after login
// // // // //     };
// // // // //
// // // // //     const fields = [
// // // // //         { name: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email' },
// // // // //         { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' }
// // // // //     ];
// // // // //
// // // // //     return (
// // // // //         <FormComponent
// // // // //             title="Login"
// // // // //             fields={fields}
// // // // //             submitHandler={handleLogin}
// // // // //             submitButtonText="Login"
// // // // //             linkText="Don't have an account? Register here"
// // // // //             linkHref="/register"
// // // // //         />
// // // // //     );
// // // // // };
// // // // //
// // // // // export default LoginPage;
// // // // //
// // // // // // import FormComponent from "../components/FormComponent";
// // // // // // import React from 'react';
// // // // // // import { useNavigate } from 'react-router-dom';
// // // // // //
// // // // // // const LoginPage = () => {
// // // // // //     const navigate = useNavigate();
// // // // // //
// // // // // //     const handleLogin = (formData) => {
// // // // // //         // Handle login logic here
// // // // // //         console.log('Login Data:', formData);
// // // // // //         navigate('/dashboard'); // Redirect to dashboard or home after login
// // // // // //     };
// // // // // //
// // // // // //     const fields = [
// // // // // //         { name: 'email', label: 'Email Address', type: 'email' },
// // // // // //         { name: 'password', label: 'Password', type: 'password' }
// // // // // //     ];
// // // // // //
// // // // // //     return (
// // // // // //         <FormComponent
// // // // // //             title="Login"
// // // // // //             fields={fields}
// // // // // //             submitHandler={handleLogin}
// // // // // //             submitButtonText="Login"
// // // // // //             linkText="Don't have an account?"
// // // // // //             linkHref="/register"
// // // // // //         />
// // // // // //     );
// // // // // // };
// // // // // //
// // // // // // export default LoginPage;
// // // // // //
// // // // // // // import React, { useState } from 'react';
// // // // // // // import { Link, useNavigate } from 'react-router-dom';
// // // // // // // import { motion } from 'framer-motion';
// // // // // // //
// // // // // // // const LoginPage = () => {
// // // // // // //     const [email, setEmail] = useState('');
// // // // // // //     const [password, setPassword] = useState('');
// // // // // // //     const [error, setError] = useState('');
// // // // // // //     const navigate = useNavigate();
// // // // // // //
// // // // // // //     const handleLogin = (e) => {
// // // // // // //         e.preventDefault();
// // // // // // //         setError('');
// // // // // // //
// // // // // // //         // Simple validation (replace with actual login logic)
// // // // // // //         if (email && password) {
// // // // // // //             // Navigate to dashboard or another page upon successful login
// // // // // // //             navigate('/dashboard');
// // // // // // //         } else {
// // // // // // //             setError('Please fill in all fields');
// // // // // // //         }
// // // // // // //     };
// // // // // // //
// // // // // // //     return (
// // // // // // //         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
// // // // // // //             <motion.div
// // // // // // //                 className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
// // // // // // //                 initial={{ opacity: 0, scale: 0.95 }}
// // // // // // //                 animate={{ opacity: 1, scale: 1 }}
// // // // // // //                 transition={{ duration: 0.5 }}
// // // // // // //             >
// // // // // // //                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
// // // // // // //                     Log In
// // // // // // //                 </h2>
// // // // // // //                 <form onSubmit={handleLogin} className="space-y-6">
// // // // // // //                     {/* Email Input */}
// // // // // // //                     <motion.div
// // // // // // //                         initial={{ opacity: 0, x: -30 }}
// // // // // // //                         animate={{ opacity: 1, x: 0 }}
// // // // // // //                         transition={{ duration: 0.3 }}
// // // // // // //                     >
// // // // // // //                         <label htmlFor="email" className="block text-gray-700 font-semibold">
// // // // // // //                             Email Address
// // // // // // //                         </label>
// // // // // // //                         <input
// // // // // // //                             id="email"
// // // // // // //                             type="email"
// // // // // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // // // //                             value={email}
// // // // // // //                             onChange={(e) => setEmail(e.target.value)}
// // // // // // //                             required
// // // // // // //                         />
// // // // // // //                     </motion.div>
// // // // // // //
// // // // // // //                     {/* Password Input */}
// // // // // // //                     <motion.div
// // // // // // //                         initial={{ opacity: 0, x: -30 }}
// // // // // // //                         animate={{ opacity: 1, x: 0 }}
// // // // // // //                         transition={{ duration: 0.3, delay: 0.1 }}
// // // // // // //                     >
// // // // // // //                         <label htmlFor="password" className="block text-gray-700 font-semibold">
// // // // // // //                             Password
// // // // // // //                         </label>
// // // // // // //                         <input
// // // // // // //                             id="password"
// // // // // // //                             type="password"
// // // // // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // // // //                             value={password}
// // // // // // //                             onChange={(e) => setPassword(e.target.value)}
// // // // // // //                             required
// // // // // // //                         />
// // // // // // //                     </motion.div>
// // // // // // //
// // // // // // //                     {/* Error Message */}
// // // // // // //                     {error && (
// // // // // // //                         <motion.div
// // // // // // //                             initial={{ opacity: 0 }}
// // // // // // //                             animate={{ opacity: 1 }}
// // // // // // //                             transition={{ duration: 0.3 }}
// // // // // // //                             className="text-red-600 text-sm font-semibold"
// // // // // // //                         >
// // // // // // //                             {error}
// // // // // // //                         </motion.div>
// // // // // // //                     )}
// // // // // // //
// // // // // // //                     {/* Login Button */}
// // // // // // //                     <motion.div
// // // // // // //                         initial={{ opacity: 0, y: 30 }}
// // // // // // //                         animate={{ opacity: 1, y: 0 }}
// // // // // // //                         transition={{ duration: 0.3, delay: 0.2 }}
// // // // // // //                     >
// // // // // // //                         <button
// // // // // // //                             type="submit"
// // // // // // //                             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-150"
// // // // // // //                         >
// // // // // // //                             Log In
// // // // // // //                         </button>
// // // // // // //                     </motion.div>
// // // // // // //                 </form>
// // // // // // //
// // // // // // //                 {/* Links */}
// // // // // // //                 <div className="mt-6 text-center">
// // // // // // //                     <p className="text-sm text-gray-500">
// // // // // // //                         Don't have an account?{' '}
// // // // // // //                         <Link to="/register" className="text-primary hover:text-primary-dark">
// // // // // // //                             Register
// // // // // // //                         </Link>
// // // // // // //                     </p>
// // // // // // //                     <p className="text-sm text-gray-500 mt-2">
// // // // // // //                         Forgot your password?{' '}
// // // // // // //                         <Link to="/forgot-password" className="text-primary hover:text-primary-dark">
// // // // // // //                             Reset it
// // // // // // //                         </Link>
// // // // // // //                     </p>
// // // // // // //                 </div>
// // // // // // //             </motion.div>
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // };
// // // // // // //
// // // // // // // export default LoginPage;
// // // // // // //
// // // // // // // // import React, { useState } from 'react';
// // // // // // // // import { useNavigate } from 'react-router-dom';
// // // // // // // //
// // // // // // // // const LoginPage = () => {
// // // // // // // //     const [email, setEmail] = useState('');
// // // // // // // //     const [password, setPassword] = useState('');
// // // // // // // //     const [error, setError] = useState('');
// // // // // // // //     const navigate = useNavigate();
// // // // // // // //
// // // // // // // //     const handleLogin = (e) => {
// // // // // // // //         e.preventDefault();
// // // // // // // //         setError('');
// // // // // // // //
// // // // // // // //         // Simple validation (You can replace with actual authentication logic)
// // // // // // // //         if (email === 'user@example.com' && password === 'password') {
// // // // // // // //             navigate('/dashboard');
// // // // // // // //         } else {
// // // // // // // //             setError('Invalid email or password');
// // // // // // // //         }
// // // // // // // //     };
// // // // // // // //
// // // // // // // //     return (
// // // // // // // //         <div className="min-h-screen bg-gray-100 flex justify-center items-center">
// // // // // // // //             <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
// // // // // // // //                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
// // // // // // // //                     Welcome Back
// // // // // // // //                 </h2>
// // // // // // // //                 <form onSubmit={handleLogin}>
// // // // // // // //                     {/* Email Input */}
// // // // // // // //                     <div className="mb-4">
// // // // // // // //                         <label htmlFor="email" className="block text-gray-700 font-semibold">
// // // // // // // //                             Email Address
// // // // // // // //                         </label>
// // // // // // // //                         <input
// // // // // // // //                             id="email"
// // // // // // // //                             type="email"
// // // // // // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // // // // //                             value={email}
// // // // // // // //                             onChange={(e) => setEmail(e.target.value)}
// // // // // // // //                             required
// // // // // // // //                         />
// // // // // // // //                     </div>
// // // // // // // //
// // // // // // // //                     {/* Password Input */}
// // // // // // // //                     <div className="mb-4">
// // // // // // // //                         <label htmlFor="password" className="block text-gray-700 font-semibold">
// // // // // // // //                             Password
// // // // // // // //                         </label>
// // // // // // // //                         <input
// // // // // // // //                             id="password"
// // // // // // // //                             type="password"
// // // // // // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // // // // //                             value={password}
// // // // // // // //                             onChange={(e) => setPassword(e.target.value)}
// // // // // // // //                             required
// // // // // // // //                         />
// // // // // // // //                     </div>
// // // // // // // //
// // // // // // // //                     {/* Error Message */}
// // // // // // // //                     {error && (
// // // // // // // //                         <div className="mb-4 text-red-600 text-sm font-semibold">
// // // // // // // //                             {error}
// // // // // // // //                         </div>
// // // // // // // //                     )}
// // // // // // // //
// // // // // // // //                     {/* Login Button */}
// // // // // // // //                     <div className="mt-6">
// // // // // // // //                         <button
// // // // // // // //                             type="submit"
// // // // // // // //                             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-150"
// // // // // // // //                         >
// // // // // // // //                             Sign In
// // // // // // // //                         </button>
// // // // // // // //                     </div>
// // // // // // // //                 </form>
// // // // // // // //
// // // // // // // //                 {/* Other Links */}
// // // // // // // //                 <div className="mt-4 text-center">
// // // // // // // //                     <p className="text-sm text-gray-500">
// // // // // // // //                         Don’t have an account?{' '}
// // // // // // // //                         <a href="/signup" className="text-primary hover:text-primary-dark">
// // // // // // // //                             Sign Up
// // // // // // // //                         </a>
// // // // // // // //                     </p>
// // // // // // // //                     <p className="text-sm text-gray-500 mt-2">
// // // // // // // //                         Forgot your password?{' '}
// // // // // // // //                         <a href="/reset-password" className="text-primary hover:text-primary-dark">
// // // // // // // //                             Reset Password
// // // // // // // //                         </a>
// // // // // // // //                     </p>
// // // // // // // //                 </div>
// // // // // // // //             </div>
// // // // // // // //         </div>
// // // // // // // //     );
// // // // // // // // };
// // // // // // // //
// // // // // // // // export default LoginPage;
// // // // // // // //
// // // // // // // // //
// // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // import { motion } from 'framer-motion';
// // // // // // // // // import { TextField, Button, IconButton, InputAdornment, Typography } from '@mui/material';
// // // // // // // // // import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
// // // // // // // // // import { Link, useNavigate } from 'react-router-dom';
// // // // // // // // //
// // // // // // // // // const LoginPage = () => {
// // // // // // // // //     const [email, setEmail] = useState('');
// // // // // // // // //     const [password, setPassword] = useState('');
// // // // // // // // //     const [showPassword, setShowPassword] = useState(false);
// // // // // // // // //     const navigate = useNavigate();
// // // // // // // // //
// // // // // // // // //     const handleSubmit = (e) => {
// // // // // // // // //         e.preventDefault();
// // // // // // // // //         console.log('Login submitted', { email, password });
// // // // // // // // //         // Here you would typically handle the login logic
// // // // // // // // //         // For now, let's just simulate a successful login
// // // // // // // // //         navigate('/dashboard'); // Redirect to dashboard after login
// // // // // // // // //     };
// // // // // // // // //
// // // // // // // // //     return (
// // // // // // // // //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/90 to-secondary/90 p-4">
// // // // // // // // //             <motion.div
// // // // // // // // //                 initial={{ opacity: 0, scale: 0.9 }}
// // // // // // // // //                 animate={{ opacity: 1, scale: 1 }}
// // // // // // // // //                 transition={{ duration: 0.5 }}
// // // // // // // // //                 className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md"
// // // // // // // // //             >
// // // // // // // // //                 <Typography variant="h4" component="h1" className="text-center text-white font-bold mb-8">
// // // // // // // // //                     Welcome Back
// // // // // // // // //                 </Typography>
// // // // // // // // //                 <form onSubmit={handleSubmit} className="space-y-6">
// // // // // // // // //                     <TextField
// // // // // // // // //                         fullWidth
// // // // // // // // //                         label="Email"
// // // // // // // // //                         variant="outlined"
// // // // // // // // //                         type="email"
// // // // // // // // //                         value={email}
// // // // // // // // //                         onChange={(e) => setEmail(e.target.value)}
// // // // // // // // //                         required
// // // // // // // // //                         InputProps={{
// // // // // // // // //                             startAdornment: (
// // // // // // // // //                                 <InputAdornment position="start">
// // // // // // // // //                                     <Email className="text-gray-400" />
// // // // // // // // //                                 </InputAdornment>
// // // // // // // // //                             ),
// // // // // // // // //                         }}
// // // // // // // // //                         sx={{
// // // // // // // // //                             '& .MuiOutlinedInput-root': {
// // // // // // // // //                                 '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
// // // // // // // // //                                 '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
// // // // // // // // //                                 '&.Mui-focused fieldset': { borderColor: 'white' },
// // // // // // // // //                             },
// // // // // // // // //                             '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
// // // // // // // // //                             '& input': { color: 'white' },
// // // // // // // // //                         }}
// // // // // // // // //                     />
// // // // // // // // //                     <TextField
// // // // // // // // //                         fullWidth
// // // // // // // // //                         label="Password"
// // // // // // // // //                         variant="outlined"
// // // // // // // // //                         type={showPassword ? 'text' : 'password'}
// // // // // // // // //                         value={password}
// // // // // // // // //                         onChange={(e) => setPassword(e.target.value)}
// // // // // // // // //                         required
// // // // // // // // //                         InputProps={{
// // // // // // // // //                             startAdornment: (
// // // // // // // // //                                 <InputAdornment position="start">
// // // // // // // // //                                     <Lock className="text-gray-400" />
// // // // // // // // //                                 </InputAdornment>
// // // // // // // // //                             ),
// // // // // // // // //                             endAdornment: (
// // // // // // // // //                                 <InputAdornment position="end">
// // // // // // // // //                                     <IconButton
// // // // // // // // //                                         onClick={() => setShowPassword(!showPassword)}
// // // // // // // // //                                         edge="end"
// // // // // // // // //                                         className="text-gray-400"
// // // // // // // // //                                     >
// // // // // // // // //                                         {showPassword ? <VisibilityOff /> : <Visibility />}
// // // // // // // // //                                     </IconButton>
// // // // // // // // //                                 </InputAdornment>
// // // // // // // // //                             ),
// // // // // // // // //                         }}
// // // // // // // // //                         sx={{
// // // // // // // // //                             '& .MuiOutlinedInput-root': {
// // // // // // // // //                                 '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
// // // // // // // // //                                 '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
// // // // // // // // //                                 '&.Mui-focused fieldset': { borderColor: 'white' },
// // // // // // // // //                             },
// // // // // // // // //                             '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
// // // // // // // // //                             '& input': { color: 'white' },
// // // // // // // // //                         }}
// // // // // // // // //                     />
// // // // // // // // //                     <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
// // // // // // // // //                         <Button
// // // // // // // // //                             type="submit"
// // // // // // // // //                             variant="contained"
// // // // // // // // //                             fullWidth
// // // // // // // // //                             className="bg-accent hover:bg-accent-dark text-white py-3 rounded-full transition duration-300 ease-in-out transform hover:shadow-lg"
// // // // // // // // //                         >
// // // // // // // // //                             Sign In
// // // // // // // // //                         </Button>
// // // // // // // // //                     </motion.div>
// // // // // // // // //                 </form>
// // // // // // // // //                 <div className="mt-6 text-center">
// // // // // // // // //                     <Link to="/forgot-password" className="text-sm text-white hover:underline">
// // // // // // // // //                         Forgot password?
// // // // // // // // //                     </Link>
// // // // // // // // //                 </div>
// // // // // // // // //                 <div className="mt-8 text-center">
// // // // // // // // //                     <Typography variant="body2" className="text-gray-300">
// // // // // // // // //                         Don't have an account?{' '}
// // // // // // // // //                         <Link to="/register" className="text-accent hover:underline">
// // // // // // // // //                             Sign up
// // // // // // // // //                         </Link>
// // // // // // // // //                     </Typography>
// // // // // // // // //                 </div>
// // // // // // // // //             </motion.div>
// // // // // // // // //         </div>
// // // // // // // // //     );
// // // // // // // // // };
// // // // // // // // //
// // // // // // // // // export default LoginPage;