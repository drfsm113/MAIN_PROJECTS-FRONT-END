import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaSearchMinus } from 'react-icons/fa';

const PageNotFound = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-secondary-100 to-primary-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl w-full space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <FaSearchMinus className="mx-auto h-16 w-16 text-yellow-500" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        404 - Page Not Found
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 sm:text-base">
                        Oops! The page you're looking for doesn't exist or has been moved.
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
                                Search Our Site
                            </h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>Try searching for the content you were looking for:</p>
                            </div>
                            <div className="mt-3">
                                <form className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="search"
                                        id="search"
                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                                        placeholder="Enter your search"
                                    />
                                    <button
                                        type="submit"
                                        className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                                    >
                                        Search
                                    </button>
                                </form>
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
                                Explore Our Site
                            </h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>Or you can return to our homepage and start from there:</p>
                            </div>
                            <div className="mt-3">
                                <Link to="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Go to Homepage
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        If you believe this is a mistake, please{' '}
                        <a href="mailto:support@example.com" className="font-medium text-indigo-600 hover:text-indigo-500">
                            contact our support team
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;