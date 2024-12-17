import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <FaLock className="mx-auto h-16 w-16 text-red-500" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Access Denied
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 sm:text-base">
                        Oops! It looks like you don't have permission to access this page.
                    </p>
                </motion.div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white overflow-hidden shadow rounded-lg"
                    >
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Need Access?
                            </h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>If you believe you should have access to this page, please contact your administrator.</p>
                            </div>
                            <div className="mt-3">
                                <a href="mailto:admin@example.com" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Contact Admin
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white overflow-hidden shadow rounded-lg"
                    >
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Return to Safety
                            </h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>You can always go back to the homepage or your dashboard.</p>
                            </div>
                            <div className="mt-3">
                                <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                    Go to Homepage
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default UnauthorizedPage;