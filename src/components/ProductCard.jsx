import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, EyeIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ product }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            className="relative bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Offer Badge */}
            {product.offer && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.offer}
                </div>
            )}

            {/* Heart Icon */}
            <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                <HeartIcon className="h-6 w-6 text-red-500" />
            </div>

            {/* Product Image */}
            <img src={product.image} alt={product.name} className="w-full h-36 object-cover rounded-lg mb-4" />

            {/* Product Details */}
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
            <p className="text-xl font-bold text-primary mb-3">{product.price}</p>
            <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className={`h-5 w-5 ${i < product.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-sm font-medium text-gray-600">{product.rating}</span>
            </div>
            <div className="flex items-center text-gray-500 mb-4">
                <EyeIcon className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">{product.views} views</span>
            </div>

            {/* Cart Icon */}
            <div className="absolute bottom-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors duration-300">
                <ShoppingCartIcon className="h-6 w-6" />
            </div>
        </motion.div>
    );
};

export default ProductCard;
