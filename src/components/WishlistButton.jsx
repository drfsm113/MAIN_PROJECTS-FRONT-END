// components/WishlistButton.js
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { toggleWishlistItem } from "../store/Slices/WishlistSlice";

const WishlistButton = ({ product, selectedVariant, currentPath }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.auth.user !== null);
    const wishlistItems = useSelector(state => state.wishlist.items);

    const checkIsInWishlist = useCallback(() => {
        return wishlistItems.some(item =>
            item.product?.slug === product?.slug &&
            (!product?.is_variant || (selectedVariant && item.variant?.slug === selectedVariant?.slug))
        );
    }, [wishlistItems, product.slug, product.is_variant, selectedVariant]);

    const [isInWishlist, setIsInWishlist] = useState(checkIsInWishlist());

    useEffect(() => {
        setIsInWishlist(checkIsInWishlist());
    }, [checkIsInWishlist, wishlistItems]);

    const handleToggleWishlist = async () => {
        if (isLoggedIn) {
            setIsInWishlist(prev => !prev); // Optimistically update the local state

            await dispatch(toggleWishlistItem({
                product_slug: product?.slug,
                ...(product?.is_variant && selectedVariant && { variant_slug: selectedVariant?.slug })
            }));
        } else {
            navigate('/login', { state: { from: currentPath } });
        }
    };

    return (
        <motion.button
            className={`flex items-center ${
                isInWishlist ? 'text-primary' : 'text-secondary'
            } ${
                product.is_in_stock ? 'hover:text-primary-dark' : 'opacity-50 cursor-not-allowed'
            } transition-colors duration-300`}
            onClick={handleToggleWishlist}
            whileHover={product.is_in_stock ? { scale: 1.05 } : {}}
            whileTap={product.is_in_stock ? { scale: 0.95 } : {}}
            disabled={!product.is_in_stock}
        >
            <FaHeart className={`mr-2 ${isInWishlist ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </span>
            <span className="sm:hidden">
                {isInWishlist ? 'Remove' : 'Wishlist'}
            </span>
        </motion.button>
    );
};

export default WishlistButton;

// import React, { useEffect, useState, useCallback } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FaHeart } from 'react-icons/fa';
// import { toggleWishlistItem } from "../store/Slices/WishlistSlice";
//
// const WishlistButton = ({ product, selectedVariant, currentPath }) => {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const isLoggedIn = useSelector(state => state.auth.user !== null);
//     const wishlistItems = useSelector(state => state.wishlist.items);
//
//     const checkIsInWishlist = useCallback(() => {
//         return wishlistItems.some(item =>
//             item.product?.slug === product?.slug &&
//             (!product?.is_variant || (selectedVariant && item.variant?.slug === selectedVariant?.slug))
//         );
//     }, [wishlistItems, product.slug, product.is_variant, selectedVariant]);
//
//     const [isInWishlist, setIsInWishlist] = useState(checkIsInWishlist());
//
//     useEffect(() => {
//         setIsInWishlist(checkIsInWishlist());
//     }, [checkIsInWishlist, wishlistItems]);
//
//     const handleToggleWishlist = () => {
//         if (isLoggedIn) {
//             dispatch(toggleWishlistItem({
//                 product_slug: product?.slug,
//                 ...(product?.is_variant && selectedVariant && { variant_slug: selectedVariant?.slug })
//             })).then(() => {
//                 setIsInWishlist(prev => !prev); // Toggle the local state after the action is dispatched
//             });
//         } else {
//             navigate('/login', { state: { from: currentPath } });
//         }
//     };
//
//     return (
//         <motion.button
//             className={`flex items-center ${
//                 isInWishlist ? 'text-red-500' : 'text-primary'
//             } ${
//                 product.is_in_stock ? 'hover:text-primary-dark' : 'opacity-50 cursor-not-allowed'
//             } transition-colors duration-300`}
//             onClick={handleToggleWishlist}
//             whileHover={product.is_in_stock ? { scale: 1.05 } : {}}
//             whileTap={product.is_in_stock ? { scale: 0.95 } : {}}
//             disabled={!product.is_in_stock}
//         >
//             <FaHeart className={`mr-2 ${isInWishlist ? 'animate-pulse' : ''}`} />
//             <span className="hidden sm:inline">
//                 {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
//             </span>
//             <span className="sm:hidden">
//                 {isInWishlist ? 'Remove' : 'Wishlist'}
//             </span>
//         </motion.button>
//     );
// };
//
// export default WishlistButton;