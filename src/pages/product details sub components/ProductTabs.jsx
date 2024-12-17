import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewSection from "./ReviewSection";

const ProductTabs = ({ product, reviews, onNewReview, isLoggedIn }) => {
    const [activeTab, setActiveTab] = useState('details');

    const TabContent = () => {
        switch (activeTab) {
            case 'details':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            {product.specifications.map((spec, index) => (
                                <li key={index}>{spec.name}: {spec.value}</li>
                            ))}
                        </ul>
                    </motion.div>
                );
            case 'description':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        <p className="text-gray-700">{product.description}</p>
                    </motion.div>
                );
            case 'reviews':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <ReviewSection
                            productId={product.id}
                            reviews={reviews}
                            onNewReview={onNewReview}
                            isLoggedIn={isLoggedIn}
                        />
                    </motion.div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="mt-8 md:mt-12">
            <div className="border-b">
                <div className="flex flex-wrap -mb-px">
                    {['details', 'description', 'reviews'].map((tab) => (
                        <motion.button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`mr-2 py-2 px-4 font-medium text-sm md:text-base ${
                                activeTab === tab
                                    ? 'border-b-2 border-primary text-primary'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </motion.button>
                    ))}
                </div>
            </div>
            <div className="mt-4 md:mt-6">
                <AnimatePresence mode="wait">
                    <TabContent />
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProductTabs;