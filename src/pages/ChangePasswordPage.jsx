import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChangePassword = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmNewPassword) {
            setError('New passwords do not match');
            return;
        }

        // Implement change password logic here

        setSuccess('Password changed successfully!');
    };

    return (
        <div className="min-h-screen  flex items-center justify-center">
            <motion.div
                className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Change<span className="text-primary"> Password</span>
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <label htmlFor="currentPassword" className="block text-gray-700 font-semibold">
                            Current Password
                        </label>
                        <input
                            id="currentPassword"
                            type="password"
                            className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
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
                        transition={{ duration: 0.3, delay: 0.2 }}
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

                    {/* Error and Success Messages */}
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

                    {/* Submit Button */}
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
                        >
                            Change Password
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>
        </div>
    );
};

export default ChangePasswordPage;
