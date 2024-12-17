import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import { addToCart } from "../store/Slices/CartSlice";

const AddToCartButton = ({ product, selectedVariant, quantity, currentPath }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.auth.user !== null);

    const handleAddToCart = () => {
        if (isLoggedIn) {
            const cartItem = {
                quantity,
                ...(product.is_variant && product.variants.length > 0
                    ? { product_variant_slug: selectedVariant.slug }
                    : { product_slug: product.slug })
            };
            dispatch(addToCart(cartItem));
        } else {
            navigate('/login', { state: { from: currentPath } });
        }
    };

    return (
        <motion.button
            className={`w-full py-2 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-base md:text-lg flex items-center justify-center ${
                product.is_in_stock ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            whileHover={product.is_in_stock ? { scale: 1.02 } : {}}
            whileTap={product.is_in_stock ? { scale: 0.98 } : {}}
            disabled={!product.is_in_stock}
            onClick={handleAddToCart}
        >
            <FaShoppingCart className="mr-2" />
            {product.is_in_stock ? (isLoggedIn ? 'Add to Cart' : 'Login to Add to Cart') : 'Out of Stock'}
        </motion.button>
    );
};

export default AddToCartButton;