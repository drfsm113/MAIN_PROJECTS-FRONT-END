import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';

const AddToCartButton = ({ isInStock, isLoggedIn, onAddToCart }) => (
    <motion.button
        className={`w-full py-2 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-base md:text-lg flex items-center justify-center ${
            isInStock ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        whileHover={isInStock ? { scale: 1.02 } : {}}
        whileTap={isInStock ? { scale: 0.98 } : {}}
        disabled={!isInStock}
        onClick={onAddToCart}
    >
        <FaShoppingCart className="mr-2" />
        {isInStock ? (isLoggedIn ? 'Add to Cart' : 'Login to Add to Cart') : 'Out of Stock'}
    </motion.button>
);

export default AddToCartButton;