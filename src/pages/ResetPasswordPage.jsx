// ResetPasswordPage.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/accounts/api/';

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { uidb64, token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!uidb64 || !token) {
            setError('Invalid password reset link.');
        }
    }, [uidb64, token]);
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
    
        // Validation for new password criteria
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
    
        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match');
            return;
        }
    
        setIsSubmitting(true);
    
        try {
            const response = await axios.post(`${API_URL}password-reset-confirm/`, {
                uidb64: uidb64, // Send uidb64 in the body
                token: token,   // Send token in the body
                new_password: newPassword,
                confirm_password: confirmNewPassword
            });
            setSuccess(response.data.message || 'Password reset successfully!');
            setTimeout(() => {
                navigate('/login', { replace: true }); // Correct way to redirect with replace
            }, 3000); // Redirect to login after 3 seconds
        } catch (err) {
            setError(err.response?.data?.non_field_errors?.[0] || 'An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // const handleResetPassword = async (e) => {
    //     e.preventDefault();
    //     setError('');
    //     setSuccess('');

    //     if (newPassword !== confirmNewPassword) {
    //         setError('Passwords do not match');
    //         return;
    //     }

    //     setIsSubmitting(true);

    //     try {
    //         const response = await axios.post(`${API_URL}password-reset-confirm/${uidb64}/${token}/`, {
    //             new_password: newPassword,
    //             confirm_password: confirmNewPassword
    //         });
    //         setSuccess(response.data.message || 'Password reset successfully!');
    //         setTimeout(() => navigate('/login'), 3000); // Redirect to login after 3 seconds
    //     } catch (err) {
    //         setError(err.response?.data?.error || 'An error occurred. Please try again.');
    //     } finally {
    //         setIsSubmitting(false);
    //     }
    // };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Reset <span className="text-primary">Password</span>
                </h2>
                <form onSubmit={handleResetPassword} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <label htmlFor="newPassword" className="block text-gray-700 font-semibold">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <label htmlFor="confirmNewPassword" className="block text-gray-700 font-semibold">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmNewPassword"
                            type="password"
                            className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
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
                            {isSubmitting ? 'Resetting...' : 'Reset Password'}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';

// const ResetPasswordPage = () => {
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmNewPassword, setConfirmNewPassword] = useState('');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const handleResetPassword = (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');

//         if (newPassword !== confirmNewPassword) {
//             setError('Passwords do not match');
//             return;
//         }

//         // Implement password reset logic here

//         setSuccess('Password reset successfully!');
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
//                     Reset <span  className="text-primary">Password</span>
//                 </h2>
//                 <form onSubmit={handleResetPassword} className="space-y-6">
//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         <label htmlFor="newPassword" className="block text-gray-700 font-semibold">
//                             New Password
//                         </label>
//                         <input
//                             id="newPassword"
//                             type="password"
//                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                             value={newPassword}
//                             onChange={(e) => setNewPassword(e.target.value)}
//                             required
//                         />
//                     </motion.div>

//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.1 }}
//                     >
//                         <label htmlFor="confirmNewPassword" className="block text-gray-700 font-semibold">
//                             Confirm New Password
//                         </label>
//                         <input
//                             id="confirmNewPassword"
//                             type="password"
//                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                             value={confirmNewPassword}
//                             onChange={(e) => setConfirmNewPassword(e.target.value)}
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
//                             Reset Password
//                         </motion.button>
//                     </motion.div>
//                 </form>
//             </motion.div>
//         </div>
//     );
// };

// export default ResetPasswordPage;
