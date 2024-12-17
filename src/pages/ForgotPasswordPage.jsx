// ForgotPasswordPage.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/accounts/api/';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        try {
            const response = await axios.post(`${API_URL}password-reset/`, { email });
            setSuccess(response.data.message || 'Password reset link sent to your email!');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Forgot <span className="text-primary">Password</span>
                </h2>
                <form onSubmit={handleForgotPassword} className="space-y-6">
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                        </motion.button>
                    </motion.div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link to="/login" className="text-primary hover:text-primary-dark">
                            Log In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';

// const ForgotPasswordPage = () => {
//     const [email, setEmail] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const handleForgotPassword = (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         // Implement password reset logic here

//         setSuccess('Password reset link sent to your email!');
//     };

//     return (
//         <div className="min-h-screen  flex items-center justify-center">
//             <motion.div
//                 className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
//                     Forgot <span  className="text-primary">Password</span>
//                 </h2>
//                 <form onSubmit={handleForgotPassword} className="space-y-6">
//                     {/* Email Input */}
//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         {/*<label htmlFor="email" className="block text-gray-700 font-semibold">*/}
//                         {/*    Email Address*/}
//                         {/*</label>*/}
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

//                     {/* Error and Success Messages */}
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

//                     {/* Submit Button */}
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
//                             Send Reset Link
//                         </motion.button>
//                     </motion.div>
//                 </form>

//                 {/* Links */}
//                 <div className="mt-6 text-center">
//                     <p className="text-sm text-gray-600">
//                         Remember your password?{' '}
//                         <Link to="/login" className="text-primary hover:text-primary-dark">
//                             Log In
//                         </Link>
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

export default ForgotPasswordPage;
