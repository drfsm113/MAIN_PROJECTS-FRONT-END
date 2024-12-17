import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/Slices/CartSlice';

const formatPrice = (price) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
};

const CartPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalPrice, totalItems, loading, error } = useSelector((state) => state.cart);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleUpdateQuantity = async (item, newQuantity) => {
        setIsUpdating(true);
        await dispatch(updateCartItem({ slug: item.slug, quantity: newQuantity }));
        setIsUpdating(false);
    };

    const handleRemoveItem = async (item) => {
        setIsUpdating(true);
        await dispatch(removeFromCart(item.slug));
        setIsUpdating(false);
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    const handleContinueShopping = () => {
        navigate('/products');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-primary text-4xl"
                >
                    <FaSpinner />
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xl mb-4"
                >
                    {error}
                </motion.div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary-dark transition duration-300"
                    onClick={() => dispatch(fetchCart())}
                >
                    Try Again
                </motion.button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-8 text-primary text-center"
            >
                Your Shopping Cart
            </motion.h1>
            {items.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center py-16 bg-white rounded-lg shadow-lg"
                >
                    <FaShoppingCart className="mx-auto text-6xl text-secondary mb-4" />
                    <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleContinueShopping}
                        className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300 shadow-md"
                    >
                        <FaArrowLeft className="mr-2" />
                        Continue Shopping
                    </motion.button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={item.slug}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow duration-300"
                                >
                                    <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-md mr-4 shadow-sm" />
                                    <div className="flex-grow mt-4 sm:mt-0">
                                        <h3 className="text-lg font-semibold text-primary">{item.product.name}</h3>
                                        <p className="text-secondary font-medium">${formatPrice(item.price)}</p>
                                        {item.product_variant && <p className="text-sm text-gray-500">{item.product_variant.name}</p>}
                                    </div>
                                    <div className="flex items-center mt-4 sm:mt-0">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleUpdateQuantity(item, Math.max(1, item.quantity - 1))}
                                            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300"
                                            disabled={isUpdating}
                                        >
                                            <FaMinus className="text-primary" />
                                        </motion.button>
                                        <span className="mx-4 font-semibold text-primary">{item.quantity}</span>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                                            className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300"
                                            disabled={isUpdating}
                                        >
                                            <FaPlus className="text-primary" />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleRemoveItem(item)}
                                            className="ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                                            disabled={isUpdating}
                                        >
                                            <FaTrash />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleClearCart}
                            className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
                        >
                            Clear Cart
                        </motion.button>
                    </div>
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white p-6 rounded-lg shadow-lg sticky top-4"
                        >
                            <h2 className="text-2xl font-semibold mb-4 text-primary">Order Summary</h2>
                            <div className="flex justify-between mb-2 text-gray-600">
                                <span>Subtotal ({totalItems} items):</span>
                                <span className="font-medium">${formatPrice(totalPrice)}</span>
                            </div>
                            <div className="flex justify-between mb-2 text-gray-600">
                                <span>Shipping:</span>
                                <span className="font-medium">Free</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-semibold text-primary">
                                    <span>Total:</span>
                                    <span>${formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCheckout}
                                className="w-full mt-6 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-300 shadow-md"
                            >
                                Proceed to Checkout
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleContinueShopping}
                                className="w-full mt-4 bg-secondary text-white py-3 rounded-lg hover:bg-secondary-dark transition duration-300 shadow-md"
                            >
                                Continue Shopping
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
// ============================
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft, FaSpinner } from 'react-icons/fa';
// import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/Slices/CartSlice';
//
// const formatPrice = (price) => {
//     const numPrice = typeof price === 'string' ? parseFloat(price) : price;
//     return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
// };
//
// const CartPage = () => {
//     const dispatch = useDispatch();
//     const { items, totalPrice, totalItems, loading, error } = useSelector((state) => state.cart);
//     const [isUpdating, setIsUpdating] = useState(false);
//
//     useEffect(() => {
//         dispatch(fetchCart());
//     }, [dispatch]);
//
//     const handleUpdateQuantity = async (item, newQuantity) => {
//         setIsUpdating(true);
//         await dispatch(updateCartItem({ slug: item.slug, quantity: newQuantity }));
//         setIsUpdating(false);
//     };
//
//     const handleRemoveItem = async (item) => {
//         setIsUpdating(true);
//         await dispatch(removeFromCart(item.slug));
//         setIsUpdating(false);
//     };
//
//     const handleClearCart = () => {
//         dispatch(clearCart());
//     };
//
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen bg-gray-100">
//                 <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                     className="text-primary text-4xl"
//                 >
//                     <FaSpinner />
//                 </motion.div>
//             </div>
//         );
//     }
//
//     if (error) {
//         return (
//             <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//                 <motion.div
//                     initial={{ opacity: 0, y: -50 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="text-red-500 text-xl mb-4"
//                 >
//                     {error}
//                 </motion.div>
//                 <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="bg-primary text-white px-6 py-3 rounded-lg shadow-lg hover:bg-primary-dark transition duration-300"
//                     onClick={() => dispatch(fetchCart())}
//                 >
//                     Try Again
//                 </motion.button>
//             </div>
//         );
//     }
//
//     return (
//         <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
//             <motion.h1
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="text-4xl font-bold mb-8 text-primary text-center"
//             >
//                 Your Shopping Cart
//             </motion.h1>
//             {items.length === 0 ? (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                     className="text-center py-16 bg-white rounded-lg shadow-lg"
//                 >
//                     <FaShoppingCart className="mx-auto text-6xl text-secondary mb-4" />
//                     <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
//                     <Link
//                         to="/products"
//                         className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300 shadow-md"
//                     >
//                         <FaArrowLeft className="mr-2" />
//                         Continue Shopping
//                     </Link>
//                 </motion.div>
//             ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     <div className="lg:col-span-2">
//                         <AnimatePresence>
//                             {items.map((item) => (
//                                 <motion.div
//                                     key={item.slug}
//                                     layout
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     transition={{ duration: 0.3 }}
//                                     className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow-md mb-4 hover:shadow-lg transition-shadow duration-300"
//                                 >
//                                     <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-md mr-4 shadow-sm" />
//                                     <div className="flex-grow mt-4 sm:mt-0">
//                                         <h3 className="text-lg font-semibold text-primary">{item.product.name}</h3>
//                                         <p className="text-secondary font-medium">${formatPrice(item.price)}</p>
//                                         {item.product_variant && <p className="text-sm text-gray-500">{item.product_variant.name}</p>}
//                                     </div>
//                                     <div className="flex items-center mt-4 sm:mt-0">
//                                         <motion.button
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.9 }}
//                                             onClick={() => handleUpdateQuantity(item, Math.max(1, item.quantity - 1))}
//                                             className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300"
//                                             disabled={isUpdating}
//                                         >
//                                             <FaMinus className="text-primary" />
//                                         </motion.button>
//                                         <span className="mx-4 font-semibold text-primary">{item.quantity}</span>
//                                         <motion.button
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.9 }}
//                                             onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
//                                             className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300"
//                                             disabled={isUpdating}
//                                         >
//                                             <FaPlus className="text-primary" />
//                                         </motion.button>
//                                         <motion.button
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.9 }}
//                                             onClick={() => handleRemoveItem(item)}
//                                             className="ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
//                                             disabled={isUpdating}
//                                         >
//                                             <FaTrash />
//                                         </motion.button>
//                                     </div>
//                                 </motion.div>
//                             ))}
//                         </AnimatePresence>
//                         <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={handleClearCart}
//                             className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 shadow-md"
//                         >
//                             Clear Cart
//                         </motion.button>
//                     </div>
//                     <div className="lg:col-span-1">
//                         <motion.div
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: 0.3 }}
//                             className="bg-white p-6 rounded-lg shadow-lg sticky top-4"
//                         >
//                             <h2 className="text-2xl font-semibold mb-4 text-primary">Order Summary</h2>
//                             <div className="flex justify-between mb-2 text-gray-600">
//                                 <span>Subtotal ({totalItems} items):</span>
//                                 <span className="font-medium">${formatPrice(totalPrice)}</span>
//                             </div>
//                             <div className="flex justify-between mb-2 text-gray-600">
//                                 <span>Shipping:</span>
//                                 <span className="font-medium">Free</span>
//                             </div>
//                             <div className="border-t pt-2 mt-2">
//                                 <div className="flex justify-between font-semibold text-primary">
//                                     <span>Total:</span>
//                                     <span>${formatPrice(totalPrice)}</span>
//                                 </div>
//                             </div>
//                             <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 className="w-full mt-6 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-300 shadow-md"
//                             >
//                                 Proceed to Checkout
//                             </motion.button>
//                         </motion.div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default CartPage;
// // ===========================
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
// import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../store/Slices/CartSlice';
//
// const formatPrice = (price) => {
//     const numPrice = typeof price === 'string' ? parseFloat(price) : price;
//     return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
// };
//
// const CartPage = () => {
//     const dispatch = useDispatch();
//     const { items, totalPrice, totalItems, loading, error } = useSelector((state) => state.cart);
//
//     useEffect(() => {
//         dispatch(fetchCart());
//     }, [dispatch]);
//
//     const handleUpdateQuantity = (item, newQuantity) => {
//         dispatch(updateCartItem({ slug: item.slug, quantity: newQuantity }));
//     };
//
//     const handleRemoveItem = (item) => {
//         dispatch(removeFromCart(item.slug));
//     };
//
//     const handleClearCart = () => {
//         dispatch(clearCart());
//     };
//
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <motion.div
//                     className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                 />
//             </div>
//         );
//     }
//
//     if (error) {
//         return (
//             <div className="flex flex-col items-center justify-center h-screen">
//                 <motion.div
//                     initial={{ opacity: 0, y: -50 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="text-red-500 text-xl mb-4"
//                 >
//                     {error}
//                 </motion.div>
//                 <motion.button
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//                     onClick={() => dispatch(fetchCart())}
//                 >
//                     Try Again
//                 </motion.button>
//             </div>
//         );
//     }
//
//     return (
//         <div className="container mx-auto px-4 py-8">
//             <motion.h1
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="text-3xl font-bold mb-8 text-gray-800"
//             >
//                 Your Shopping Cart
//             </motion.h1>
//             {items.length === 0 ? (
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                     className="text-center py-16"
//                 >
//                     <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
//                     <p className="text-xl text-gray-600 mb-8">Your cart is empty</p>
//                     <Link
//                         to="/products"
//                         className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
//                     >
//                         <FaArrowLeft className="mr-2" />
//                         Continue Shopping
//                     </Link>
//                 </motion.div>
//             ) : (
//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                     <div className="lg:col-span-2">
//                         <AnimatePresence>
//                             {items.map((item) => (
//                                 <motion.div
//                                     key={item.slug}
//                                     layout
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     transition={{ duration: 0.3 }}
//                                     className="flex flex-col sm:flex-row items-center bg-white p-4 rounded-lg shadow-md mb-4"
//                                 >
//                                     <img src={item.product.image} alt={item.product.name} className="w-24 h-24 object-cover rounded-md mr-4" />
//                                     <div className="flex-grow mt-4 sm:mt-0">
//                                         <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
//                                         <p className="text-gray-600">${formatPrice(item.price)}</p>
//                                         {item.product_variant && <p className="text-sm text-gray-500">{item.product_variant.name}</p>}
//                                     </div>
//                                     <div className="flex items-center mt-4 sm:mt-0">
//                                         <motion.button
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.9 }}
//                                             onClick={() => handleUpdateQuantity(item, Math.max(1, item.quantity - 1))}
//                                             className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300"
//                                         >
//                                             <FaMinus />
//                                         </motion.button>
//                                         <span className="mx-4 font-semibold">{item.quantity}</span>
//                                         <motion.button
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.9 }}
//                                             onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
//                                             className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300"
//                                         >
//                                             <FaPlus />
//                                         </motion.button>
//                                         <motion.button
//                                             whileHover={{ scale: 1.1 }}
//                                             whileTap={{ scale: 0.9 }}
//                                             onClick={() => handleRemoveItem(item)}
//                                             className="ml-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
//                                         >
//                                             <FaTrash />
//                                         </motion.button>
//                                     </div>
//                                 </motion.div>
//                             ))}
//                         </AnimatePresence>
//                         <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             onClick={handleClearCart}
//                             className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
//                         >
//                             Clear Cart
//                         </motion.button>
//                     </div>
//                     <div className="lg:col-span-1">
//                         <motion.div
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: 0.3 }}
//                             className="bg-white p-6 rounded-lg shadow-md"
//                         >
//                             <h2 className="text-2xl font-semibold mb-4 text-gray-800">Order Summary</h2>
//                             <div className="flex justify-between mb-2 text-gray-600">
//                                 <span>Subtotal ({totalItems} items):</span>
//                                 <span>${formatPrice(totalPrice)}</span>
//                             </div>
//                             <div className="flex justify-between mb-2 text-gray-600">
//                                 <span>Shipping:</span>
//                                 <span>Free</span>
//                             </div>
//                             <div className="border-t pt-2 mt-2">
//                                 <div className="flex justify-between font-semibold text-gray-800">
//                                     <span>Total:</span>
//                                     <span>${formatPrice(totalPrice)}</span>
//                                 </div>
//                             </div>
//                             <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
//                             >
//                                 Proceed to Checkout
//                             </motion.button>
//                         </motion.div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default CartPage;
// ==============================
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { FaTrash, FaHeart } from 'react-icons/fa';
// import { AiOutlineHeart } from 'react-icons/ai';
//
// const CartPage = () => {
//     const [cartItems, setCartItems] = useState([
//         { id: 1, name: 'Gold Necklace', price: 499.99, quantity: 1, image: 'https://via.placeholder.com/150', variant: '24K Gold' },
//         { id: 2, name: 'Silver Earrings', price: 89.99, quantity: 2, image: 'https://via.placeholder.com/150', variant: 'Sterling Silver' },
//         { id: 3, name: 'Platinum Ring', price: 799.99, quantity: 1, image: 'https://via.placeholder.com/150', variant: 'Platinum' },
//     ]);
//
//     const handleQuantityChange = (id, value) => {
//         setCartItems(cartItems.map(item =>
//             item.id === id ? { ...item, quantity: value } : item
//         ));
//     };
//
//     const handleRemoveItem = (id) => {
//         setCartItems(cartItems.filter(item => item.id !== id));
//     };
//
//     const handleAddToWishlist = (item) => {
//         // Implement add to wishlist functionality here
//         alert(`Added ${item.name} to wishlist`);
//     };
//
//     const calculateTotal = () => {
//         return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
//     };
//
//     return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
//             {cartItems.length === 0 ? (
//                 <div className="text-center">
//                     <motion.h2
//                         className="text-4xl font-bold text-gray-800 mb-6"
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         Your Cart is Empty
//                     </motion.h2>
//                     <Link to="/products">
//                         <motion.button
//                             className="bg-primary text-white py-3 px-6 rounded-lg shadow-lg hover:bg-primary-dark transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                         >
//                             Continue Shopping
//                         </motion.button>
//                     </Link>
//                 </div>
//             ) : (
//                 <motion.div
//                     className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8"
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <motion.h2
//                         className="text-4xl font-bold text-gray-800 mb-8 text-center"
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         Your Cart
//                     </motion.h2>
//                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//                         {cartItems.map(item => (
//                             <motion.div
//                                 key={item.id}
//                                 className="flex items-start bg-white border rounded-lg shadow-md p-4"
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.3 }}
//                             >
//                                 <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
//                                 <div className="ml-4 flex-1">
//                                     <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
//                                     <p className="text-gray-600 text-sm">{item.variant}</p>
//                                     <p className="text-gray-800 text-lg font-medium mt-2">${item.price.toFixed(2)}</p>
//                                     <div className="flex items-center mt-4">
//                                         <input
//                                             type="number"
//                                             value={item.quantity}
//                                             onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
//                                             min="1"
//                                             className="w-24 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
//                                         />
//                                         <button
//                                             onClick={() => handleRemoveItem(item.id)}
//                                             className="ml-4 text-red-600 hover:text-red-800 transition"
//                                         >
//                                             <FaTrash className="text-xl" />
//                                         </button>
//                                         <button
//                                             onClick={() => handleAddToWishlist(item)}
//                                             className="ml-4 text-gray-700 hover:text-primary transition"
//                                         >
//                                             <AiOutlineHeart className="text-xl" />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         ))}
//                     </div>
//
//                     <div className="mt-8 flex justify-between items-center border-t border-gray-300 pt-6">
//                         <div className="text-2xl font-semibold text-gray-800">Total</div>
//                         <div className="text-2xl font-semibold text-gray-800">${calculateTotal()}</div>
//                     </div>
//
//                     <div className="mt-8">
//                         <Link to="/checkout">
//                             <motion.button
//                                 className="w-full bg-primary text-white py-3 rounded-lg shadow-lg hover:bg-primary-dark transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                             >
//                                 Proceed to Checkout
//                             </motion.button>
//                         </Link>
//                     </div>
//                 </motion.div>
//             )}
//         </div>
//     );
// };
//
// export default CartPage;

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
// import { FaTrash } from 'react-icons/fa';
//
// const CartPage = () => {
//     const [cartItems, setCartItems] = useState([
//         { id: 1, name: 'Gold Necklace', price: 499.99, quantity: 1, image: 'https://via.placeholder.com/150', variant: '24K Gold' },
//         { id: 2, name: 'Silver Earrings', price: 89.99, quantity: 2, image: 'https://via.placeholder.com/150', variant: 'Sterling Silver' },
//         { id: 3, name: 'Platinum Ring', price: 799.99, quantity: 1, image: 'https://via.placeholder.com/150', variant: 'Platinum' },
//         { id: 4, name: 'Platinum Ring  bold', price: 799.99, quantity: 1, image: 'https://via.placeholder.com/150', variant: 'Platinum' },
//     ]);
//
//     const handleQuantityChange = (id, value) => {
//         setCartItems(cartItems.map(item =>
//             item.id === id ? { ...item, quantity: value } : item
//         ));
//     };
//
//     const handleRemoveItem = (id) => {
//         setCartItems(cartItems.filter(item => item.id !== id));
//     };
//
//     const calculateTotal = () => {
//         return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
//     };
//
//     return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
//             {cartItems.length === 0 ? (
//                 <div className="text-center">
//                     <motion.h2
//                         className="text-4xl font-bold text-gray-800 mb-6"
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         Your Cart is Empty
//                     </motion.h2>
//                     <Link to="/products">
//                         <motion.button
//                             className="bg-primary text-white py-3 px-6 rounded-lg shadow-lg hover:bg-primary-dark transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                         >
//                             Continue Shopping
//                         </motion.button>
//                     </Link>
//                 </div>
//             ) : (
//                 <motion.div
//                     className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8"
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <motion.h2
//                         className="text-4xl font-bold text-gray-800 mb-8 text-center"
//                         initial={{ opacity: 0, y: -20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         Your Cart
//                     </motion.h2>
//                     <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//                         {cartItems.map(item => (
//                             <div
//                                 key={item.id}
//                                 className="flex items-start bg-white border rounded-lg shadow-md p-4"
//                             >
//                                 <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-lg border border-gray-200" />
//                                 <div className="ml-4 flex-1">
//                                     <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
//                                     <p className="text-gray-600 text-sm">{item.variant}</p>
//                                     <p className="text-gray-800 text-lg font-medium mt-2">${item.price.toFixed(2)}</p>
//                                     <div className="flex items-center mt-4">
//                                         <input
//                                             type="number"
//                                             value={item.quantity}
//                                             onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
//                                             min="1"
//                                             className="w-24 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
//                                         />
//                                         <button
//                                             onClick={() => handleRemoveItem(item.id)}
//                                             className="ml-4 text-red-600 hover:text-red-800 transition"
//                                         >
//                                             <FaTrash className="text-xl" />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//
//                     <div className="mt-8 flex justify-between items-center border-t border-gray-300 pt-6">
//                         <div className="text-2xl font-semibold text-gray-800">Total</div>
//                         <div className="text-2xl font-semibold text-gray-800">${calculateTotal()}</div>
//                     </div>
//
//                     <div className="mt-8">
//                         <Link to="/checkout">
//                             <motion.button
//                                 className="w-full bg-primary text-white py-3 rounded-lg shadow-lg hover:bg-primary-dark transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                             >
//                                 Proceed to Checkout
//                             </motion.button>
//                         </Link>
//                     </div>
//                 </motion.div>
//             )}
//         </div>
//     );
// };
//
// export default CartPage;
//
// // import React, { useState } from 'react';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { FaTrash, FaPlus, FaMinus, FaArrowRight } from 'react-icons/fa';
// //
// // const CartItem = ({ item, updateQuantity, removeItem }) => (
// //     <motion.div
// //         layout
// //         initial={{ opacity: 0, y: 20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         exit={{ opacity: 0, y: -20 }}
// //         className="bg-white rounded-lg shadow-lg border-t-4 border-primary overflow-hidden"
// //     >
// //         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
// //             <div className="relative">
// //                 <img src={item.image} alt={item.name} className="w-full h-48 sm:h-full object-cover rounded-lg shadow-md" />
// //                 <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
// //                     {item.quantity}
// //                 </div>
// //             </div>
// //             <div className="sm:col-span-2 flex flex-col justify-between">
// //                 <div>
// //                     <h3 className="text-xl font-semibold text-text">{item.name}</h3>
// //                     <p className="text-sm text-secondary font-semibold">{item.variant}</p>
// //                     <p className="text-2xl font-bold text-accent mt-2">${(item.price * item.quantity).toFixed(2)}</p>
// //                 </div>
// //                 <div className="flex justify-between items-center mt-4">
// //                     <div className="flex items-center space-x-2">
// //                         <motion.button
// //                             whileHover={{ scale: 1.1 }}
// //                             whileTap={{ scale: 0.9 }}
// //                             onClick={() => updateQuantity(item.id, item.quantity - 1)}
// //                             className="p-2 rounded-full bg-gray-200 text-text hover:bg-primary hover:text-white transition-colors"
// //                             aria-label="Decrease quantity"
// //                         >
// //                             <FaMinus size={12} />
// //                         </motion.button>
// //                         <span className="text-text font-semibold">{item.quantity}</span>
// //                         <motion.button
// //                             whileHover={{ scale: 1.1 }}
// //                             whileTap={{ scale: 0.9 }}
// //                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
// //                             className="p-2 rounded-full bg-gray-200 text-text hover:bg-primary hover:text-white transition-colors"
// //                             aria-label="Increase quantity"
// //                         >
// //                             <FaPlus size={12} />
// //                         </motion.button>
// //                     </div>
// //                     <motion.button
// //                         whileHover={{ scale: 1.1 }}
// //                         whileTap={{ scale: 0.9 }}
// //                         onClick={() => removeItem(item.id)}
// //                         className="p-2 rounded-full bg-secondary text-primary hover:bg-primary transition-colors"
// //                         aria-label="Remove item"
// //                     >
// //                         <FaTrash size={14} />
// //                     </motion.button>
// //                 </div>
// //             </div>
// //         </div>
// //     </motion.div>
// // );
// //
// // const CartPage = () => {
// //     const [cartItems, setCartItems] = useState([
// //         { id: 1, name: "Gold Necklace", price: 499.99, quantity: 1, image: "https://via.placeholder.com/300x200", variant: "24K Gold" },
// //         { id: 2, name: "Silver Earrings", price: 89.99, quantity: 2, image: "https://via.placeholder.com/300x200", variant: "Sterling Silver" },
// //         { id: 3, name: "Platinum Ring", price: 799.99, quantity: 1, image: "https://via.placeholder.com/300x200", variant: "Platinum" },
// //     ]);
// //
// //     const [shippingMethod, setShippingMethod] = useState('free');
// //
// //     const updateQuantity = (id, newQuantity) => {
// //         if (newQuantity > 0) {
// //             setCartItems(cartItems.map(item =>
// //                 item.id === id ? { ...item, quantity: newQuantity } : item
// //             ));
// //         }
// //     };
// //
// //     const removeItem = (id) => {
// //         setCartItems(cartItems.filter(item => item.id !== id));
// //     };
// //
// //     const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
// //     const shippingCost = shippingMethod === 'express' ? 15 : 0;
// //     const total = subtotal + shippingCost;
// //
// //     return (
// //         <div className="bg-background py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
// //             <div className="max-w-6xl mx-auto">
// //                 <h1 className="text-4xl font-extrabold text-text mb-8 text-center">Your Cart</h1>
// //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //                     <div className="lg:col-span-2 space-y-6">
// //                         <AnimatePresence>
// //                             {cartItems.length === 0 ? (
// //                                 <motion.div
// //                                     key="empty"
// //                                     initial={{ opacity: 0 }}
// //                                     animate={{ opacity: 1 }}
// //                                     exit={{ opacity: 0 }}
// //                                     className="text-center bg-white rounded-lg p-8 shadow-xl"
// //                                 >
// //                                     <p className="text-xl font-semibold mb-6 text-text">Your cart is empty</p>
// //                                     <motion.button
// //                                         whileHover={{ scale: 1.05 }}
// //                                         whileTap={{ scale: 0.95 }}
// //                                         className="bg-primary text-white py-3 px-8 rounded-full text-lg font-bold hover:bg-opacity-90 transition-colors shadow-lg"
// //                                     >
// //                                         Continue Shopping
// //                                     </motion.button>
// //                                 </motion.div>
// //                             ) : (
// //                                 cartItems.map(item => (
// //                                     <CartItem
// //                                         key={item.id}
// //                                         item={item}
// //                                         updateQuantity={updateQuantity}
// //                                         removeItem={removeItem}
// //                                     />
// //                                 ))
// //                             )}
// //                         </AnimatePresence>
// //                     </div>
// //                     {cartItems.length > 0 && (
// //                         <div className="lg:col-span-1">
// //                             <div className="bg-white p-6 rounded-lg shadow-xl">
// //                                 <h2 className="text-2xl font-bold mb-6 text-text">Order Summary</h2>
// //                                 <div className="space-y-4 mb-6">
// //                                     <div className="flex justify-between items-center">
// //                                         <span className="text-gray-600">Subtotal</span>
// //                                         <span className="text-xl font-bold text-accent">${subtotal.toFixed(2)}</span>
// //                                     </div>
// //                                     <div className="flex justify-between items-center">
// //                                         <span className="text-gray-600">Shipping</span>
// //                                         <select
// //                                             value={shippingMethod}
// //                                             onChange={(e) => setShippingMethod(e.target.value)}
// //                                             className="bg-gray-200 text-text rounded-lg p-2 font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
// //                                         >
// //                                             <option value="free">Free Shipping</option>
// //                                             <option value="express">Express ($15)</option>
// //                                         </select>
// //                                     </div>
// //                                     <div className="flex justify-between items-center border-t border-gray-300 pt-4">
// //                                         <span className="text-xl font-bold">Total</span>
// //                                         <span className="text-2xl font-bold text-accent">${total.toFixed(2)}</span>
// //                                     </div>
// //                                 </div>
// //                                 <motion.button
// //                                     whileHover={{ scale: 1.05 }}
// //                                     whileTap={{ scale: 0.95 }}
// //                                     className="bg-primary text-white py-3 px-8 rounded-full text-lg font-bold w-full hover:bg-opacity-90 transition-colors shadow-lg flex items-center justify-center"
// //                                 >
// //                                     Checkout <FaArrowRight className="ml-2" />
// //                                 </motion.button>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default CartPage;
// //
// // // import React, { useState } from 'react';
// // // import { motion, AnimatePresence } from 'framer-motion';
// // // import { FaTrash, FaPlus, FaMinus, FaArrowRight } from 'react-icons/fa';
// // //
// // // const CartItem = ({ item, updateQuantity, removeItem }) => (
// // //     <motion.div
// // //         layout
// // //         initial={{ opacity: 0, y: 20 }}
// // //         animate={{ opacity: 1, y: 0 }}
// // //         exit={{ opacity: 0, y: -20 }}
// // //         className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-gold overflow-hidden"
// // //     >
// // //         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
// // //             <div className="relative">
// // //                 <img src={item.image} alt={item.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
// // //                 <div className="absolute top-2 right-2 bg-gold text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
// // //                     {item.quantity}
// // //                 </div>
// // //             </div>
// // //             <div className="col-span-2 flex flex-col justify-between">
// // //                 <div>
// // //                     <h3 className="text-xl font-serif font-bold text-black">{item.name}</h3>
// // //                     <p className="text-sm text-gold font-semibold">{item.variant}</p>
// // //                     <p className="text-2xl font-bold text-gold mt-2">${(item.price * item.quantity).toFixed(2)}</p>
// // //                 </div>
// // //                 <div className="flex justify-between items-center mt-4">
// // //                     <div className="flex items-center space-x-2">
// // //                         <motion.button
// // //                             whileHover={{ scale: 1.1 }}
// // //                             whileTap={{ scale: 0.9 }}
// // //                             onClick={() => updateQuantity(item.id, item.quantity - 1)}
// // //                             className="p-2 rounded-full bg-gray-200 text-black hover:bg-gold hover:text-white transition-colors"
// // //                             aria-label="Decrease quantity"
// // //                         >
// // //                             <FaMinus size={12} />
// // //                         </motion.button>
// // //                         <span className="text-black font-semibold">{item.quantity}</span>
// // //                         <motion.button
// // //                             whileHover={{ scale: 1.1 }}
// // //                             whileTap={{ scale: 0.9 }}
// // //                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
// // //                             className="p-2 rounded-full bg-gray-200 text-black hover:bg-gold hover:text-white transition-colors"
// // //                             aria-label="Increase quantity"
// // //                         >
// // //                             <FaPlus size={12} />
// // //                         </motion.button>
// // //                     </div>
// // //                     <motion.button
// // //                         whileHover={{ scale: 1.1 }}
// // //                         whileTap={{ scale: 0.9 }}
// // //                         onClick={() => removeItem(item.id)}
// // //                         className="p-2 rounded-full bg-red-500 text-white hover:bg-red-700 transition-colors"
// // //                         aria-label="Remove item"
// // //                     >
// // //                         <FaTrash size={14} />
// // //                     </motion.button>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     </motion.div>
// // // );
// // //
// // // const CartPage = () => {
// // //     const [cartItems, setCartItems] = useState([
// // //         { id: 1, name: "Gold Necklace", price: 499.99, quantity: 1, image: "https://via.placeholder.com/300x200", variant: "24K Gold" },
// // //         { id: 2, name: "Silver Earrings", price: 89.99, quantity: 2, image: "https://via.placeholder.com/300x200", variant: "Sterling Silver" },
// // //         { id: 3, name: "Platinum Ring", price: 799.99, quantity: 1, image: "https://via.placeholder.com/300x200", variant: "Platinum" },
// // //     ]);
// // //
// // //     const [couponCode, setCouponCode] = useState('');
// // //     const [shippingMethod, setShippingMethod] = useState('free');
// // //
// // //     const updateQuantity = (id, newQuantity) => {
// // //         if (newQuantity > 0) {
// // //             setCartItems(cartItems.map(item =>
// // //                 item.id === id ? { ...item, quantity: newQuantity } : item
// // //             ));
// // //         }
// // //     };
// // //
// // //     const removeItem = (id) => {
// // //         setCartItems(cartItems.filter(item => item.id !== id));
// // //     };
// // //
// // //     const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
// // //     const shippingCost = shippingMethod === 'express' ? 15 : 0;
// // //     const total = subtotal + shippingCost;
// // //
// // //     return (
// // //         <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
// // //             <div className="max-w-7xl mx-auto">
// // //                 <motion.h1
// // //                     initial={{ opacity: 0, y: -50 }}
// // //                     animate={{ opacity: 1, y: 0 }}
// // //                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
// // //                     className="text-4xl sm:text-5xl font-extrabold mb-8 text-center text-black drop-shadow-lg"
// // //                 >
// // //                     Your Luxury Cart
// // //                 </motion.h1>
// // //
// // //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// // //                     <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
// // //                         <AnimatePresence>
// // //                             {cartItems.length === 0 ? (
// // //                                 <motion.div
// // //                                     key="empty"
// // //                                     initial={{ opacity: 0 }}
// // //                                     animate={{ opacity: 1 }}
// // //                                     exit={{ opacity: 0 }}
// // //                                     className="text-center text-black bg-white rounded-2xl p-8 shadow-xl"
// // //                                 >
// // //                                     <p className="text-xl sm:text-2xl mb-6 font-semibold">Your cart is empty</p>
// // //                                     <motion.button
// // //                                         whileHover={{ scale: 1.05 }}
// // //                                         whileTap={{ scale: 0.95 }}
// // //                                         className="bg-gold text-white py-3 px-8 rounded-full text-lg font-bold hover:bg-opacity-90 transition-colors shadow-lg"
// // //                                     >
// // //                                         Continue Shopping
// // //                                     </motion.button>
// // //                                 </motion.div>
// // //                             ) : (
// // //                                 cartItems.map(item => (
// // //                                     <CartItem
// // //                                         key={item.id}
// // //                                         item={item}
// // //                                         updateQuantity={updateQuantity}
// // //                                         removeItem={removeItem}
// // //                                     />
// // //                                 ))
// // //                             )}
// // //                         </AnimatePresence>
// // //                     </div>
// // //
// // //                     {cartItems.length > 0 && (
// // //                         <div className="lg:col-span-1">
// // //                             <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
// // //                                 <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-black">Order Summary</h2>
// // //                                 <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
// // //                                     <div className="flex justify-between items-center">
// // //                                         <span className="text-base sm:text-lg text-gray-600">Subtotal</span>
// // //                                         <span className="text-xl sm:text-2xl font-bold text-gold">${subtotal.toFixed(2)}</span>
// // //                                     </div>
// // //                                     <div className="flex justify-between items-center">
// // //                                         <span className="text-base sm:text-lg text-gray-600">Shipping</span>
// // //                                         <select
// // //                                             value={shippingMethod}
// // //                                             onChange={(e) => setShippingMethod(e.target.value)}
// // //                                             className="bg-gray-200 text-black rounded-lg p-2 font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
// // //                                         >
// // //                                             <option value="free">Free Shipping</option>
// // //                                             <option value="express">Express ($15)</option>
// // //                                         </select>
// // //                                     </div>
// // //                                     <div className="flex justify-between items-center border-t border-gray-300 pt-4 sm:pt-6">
// // //                                         <span className="text-xl sm:text-2xl font-bold text-black">Total</span>
// // //                                         <span className="text-2xl sm:text-3xl font-bold text-gold">${total.toFixed(2)}</span>
// // //                                     </div>
// // //                                 </div>
// // //                                 <motion.button
// // //                                     whileHover={{ scale: 1.05 }}
// // //                                     whileTap={{ scale: 0.95 }}
// // //                                     className="bg-black text-white py-3 px-8 rounded-full text-lg font-bold w-full hover:bg-opacity-90 transition-colors shadow-lg flex items-center justify-center"
// // //                                 >
// // //                                     Checkout <FaArrowRight className="ml-2" />
// // //                                 </motion.button>
// // //                             </div>
// // //                         </div>
// // //                     )}
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // };
// // //
// // // export default CartPage;
// // //
// // // // import React, { useState } from 'react';
// // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // import { FaTrash, FaPlus, FaMinus, FaArrowRight } from 'react-icons/fa';
// // // //
// // // // const CartItem = ({ item, updateQuantity, removeItem }) => (
// // // //     <motion.div
// // // //         layout
// // // //         initial={{ opacity: 0, y: 20 }}
// // // //         animate={{ opacity: 1, y: 0 }}
// // // //         exit={{ opacity: 0, y: -20 }}
// // // //         className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-gold overflow-hidden"
// // // //     >
// // // //         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
// // // //             <div className="relative sm:col-span-1">
// // // //                 <img src={item.image} alt={item.name} className="w-full h-48 sm:h-full object-cover rounded-lg shadow-md" />
// // // //                 <div className="absolute top-2 right-2 bg-gold text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
// // // //                     {item.quantity}
// // // //                 </div>
// // // //             </div>
// // // //             <div className="sm:col-span-2 flex flex-col justify-between">
// // // //                 <div>
// // // //                     <h3 className="text-xl font-serif font-bold text-black">{item.name}</h3>
// // // //                     <p className="text-sm text-gold font-semibold">{item.variant}</p>
// // // //                     <p className="text-2xl font-bold text-gold mt-2">${(item.price * item.quantity).toFixed(2)}</p>
// // // //                 </div>
// // // //                 <div className="flex justify-between items-center mt-4">
// // // //                     <div className="flex items-center space-x-2">
// // // //                         <motion.button
// // // //                             whileHover={{ scale: 1.1 }}
// // // //                             whileTap={{ scale: 0.9 }}
// // // //                             onClick={() => updateQuantity(item.id, item.quantity - 1)}
// // // //                             className="p-2 rounded-full bg-gray-200 text-black hover:bg-gold hover:text-white transition-colors"
// // // //                             aria-label="Decrease quantity"
// // // //                         >
// // // //                             <FaMinus size={12} />
// // // //                         </motion.button>
// // // //                         <span className="text-black font-semibold">{item.quantity}</span>
// // // //                         <motion.button
// // // //                             whileHover={{ scale: 1.1 }}
// // // //                             whileTap={{ scale: 0.9 }}
// // // //                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
// // // //                             className="p-2 rounded-full bg-gray-200 text-black hover:bg-gold hover:text-white transition-colors"
// // // //                             aria-label="Increase quantity"
// // // //                         >
// // // //                             <FaPlus size={12} />
// // // //                         </motion.button>
// // // //                     </div>
// // // //                     <motion.button
// // // //                         whileHover={{ scale: 1.1 }}
// // // //                         whileTap={{ scale: 0.9 }}
// // // //                         onClick={() => removeItem(item.id)}
// // // //                         className="p-2 rounded-full bg-red-500 text-white hover:bg-red-700 transition-colors"
// // // //                         aria-label="Remove item"
// // // //                     >
// // // //                         <FaTrash size={14} />
// // // //                     </motion.button>
// // // //                 </div>
// // // //             </div>
// // // //         </div>
// // // //     </motion.div>
// // // // );
// // // //
// // // // const CartPage = () => {
// // // //     const [cartItems, setCartItems] = useState([
// // // //         { id: 1, name: "Gold Necklace", price: 499.99, quantity: 1, image: "https://via.placeholder.com/300x200", variant: "24K Gold" },
// // // //         { id: 2, name: "Silver Earrings", price: 89.99, quantity: 2, image: "https://via.placeholder.com/300x200", variant: "Sterling Silver" },
// // // //         { id: 3, name: "Platinum Ring", price: 799.99, quantity: 1, image: "https://via.placeholder.com/300x200", variant: "Platinum" },
// // // //     ]);
// // // //
// // // //     const [couponCode, setCouponCode] = useState('');
// // // //     const [shippingMethod, setShippingMethod] = useState('free');
// // // //
// // // //     const updateQuantity = (id, newQuantity) => {
// // // //         if (newQuantity > 0) {
// // // //             setCartItems(cartItems.map(item =>
// // // //                 item.id === id ? { ...item, quantity: newQuantity } : item
// // // //             ));
// // // //         }
// // // //     };
// // // //
// // // //     const removeItem = (id) => {
// // // //         setCartItems(cartItems.filter(item => item.id !== id));
// // // //     };
// // // //
// // // //     const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
// // // //     const shippingCost = shippingMethod === 'express' ? 15 : 0;
// // // //     const total = subtotal + shippingCost;
// // // //
// // // //     return (
// // // //         <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
// // // //             <div className="max-w-7xl mx-auto">
// // // //                 <motion.h1
// // // //                     initial={{ opacity: 0, y: -50 }}
// // // //                     animate={{ opacity: 1, y: 0 }}
// // // //                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
// // // //                     className="text-4xl sm:text-5xl font-extrabold mb-8 text-center text-black drop-shadow-lg"
// // // //                 >
// // // //                     Your Luxury Cart
// // // //                 </motion.h1>
// // // //
// // // //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// // // //                     <div className="lg:col-span-2 space-y-6">
// // // //                         <AnimatePresence>
// // // //                             {cartItems.length === 0 ? (
// // // //                                 <motion.div
// // // //                                     key="empty"
// // // //                                     initial={{ opacity: 0 }}
// // // //                                     animate={{ opacity: 1 }}
// // // //                                     exit={{ opacity: 0 }}
// // // //                                     className="text-center text-black bg-white rounded-2xl p-8 shadow-xl"
// // // //                                 >
// // // //                                     <p className="text-xl sm:text-2xl mb-6 font-semibold">Your cart is empty</p>
// // // //                                     <motion.button
// // // //                                         whileHover={{ scale: 1.05 }}
// // // //                                         whileTap={{ scale: 0.95 }}
// // // //                                         className="bg-gold text-white py-3 px-8 rounded-full text-lg font-bold hover:bg-opacity-90 transition-colors shadow-lg"
// // // //                                     >
// // // //                                         Continue Shopping
// // // //                                     </motion.button>
// // // //                                 </motion.div>
// // // //                             ) : (
// // // //                                 cartItems.map(item => (
// // // //                                     <CartItem
// // // //                                         key={item.id}
// // // //                                         item={item}
// // // //                                         updateQuantity={updateQuantity}
// // // //                                         removeItem={removeItem}
// // // //                                     />
// // // //                                 ))
// // // //                             )}
// // // //                         </AnimatePresence>
// // // //                     </div>
// // // //
// // // //                     {cartItems.length > 0 && (
// // // //                         <div className="lg:col-span-1">
// // // //                             <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
// // // //                                 <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-black">Order Summary</h2>
// // // //                                 <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
// // // //                                     <div className="flex justify-between items-center">
// // // //                                         <span className="text-base sm:text-lg text-gray-600">Subtotal</span>
// // // //                                         <span className="text-xl sm:text-2xl font-bold text-gold">${subtotal.toFixed(2)}</span>
// // // //                                     </div>
// // // //                                     <div className="flex justify-between items-center">
// // // //                                         <span className="text-base sm:text-lg text-gray-600">Shipping</span>
// // // //                                         <select
// // // //                                             value={shippingMethod}
// // // //                                             onChange={(e) => setShippingMethod(e.target.value)}
// // // //                                             className="bg-gray-200 text-black rounded-lg p-2 font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
// // // //                                         >
// // // //                                             <option value="free">Free Shipping</option>
// // // //                                             <option value="express">Express ($15)</option>
// // // //                                         </select>
// // // //                                     </div>
// // // //                                     <div className="flex justify-between items-center border-t border-gray-300 pt-4 sm:pt-6">
// // // //                                         <span className="text-xl sm:text-2xl font-bold text-black">Total</span>
// // // //                                         <span className="text-2xl sm:text-3xl font-bold text-gold">${total.toFixed(2)}</span>
// // // //                                     </div>
// // // //                                 </div>
// // // //                                 <motion.button
// // // //                                     whileHover={{ scale: 1.05 }}
// // // //                                     whileTap={{ scale: 0.95 }}
// // // //                                     className="bg-black text-white py-3 px-8 rounded-full text-lg font-bold w-full hover:bg-opacity-90 transition-colors shadow-lg flex items-center justify-center"
// // // //                                 >
// // // //                                     Checkout <FaArrowRight className="ml-2" />
// // // //                                 </motion.button>
// // // //                             </div>
// // // //                         </div>
// // // //                     )}
// // // //                 </div>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // };
// // // //
// // // // export default CartPage;
// // // //
// // // // // import React, { useState } from 'react';
// // // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // // import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowRight, FaCreditCard, FaPaypal, FaApplePay, FaGoogle } from 'react-icons/fa';
// // // // //
// // // // // const CartItem = ({ item, updateQuantity, removeItem }) => (
// // // // //     <motion.div
// // // // //         layout
// // // // //         initial={{ opacity: 0, y: 20 }}
// // // // //         animate={{ opacity: 1, y: 0 }}
// // // // //         exit={{ opacity: 0, y: -20 }}
// // // // //         className="flex items-center justify-between p-6 mb-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500"
// // // // //     >
// // // // //         <div className="flex items-center space-x-6">
// // // // //             <div className="relative">
// // // // //                 <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg shadow-md" />
// // // // //                 <div className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
// // // // //                     {item.quantity}
// // // // //                 </div>
// // // // //             </div>
// // // // //             <div>
// // // // //                 <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
// // // // //                 <p className="text-sm text-purple-600 font-semibold">{item.variant}</p>
// // // // //             </div>
// // // // //         </div>
// // // // //         <div className="flex items-center space-x-6">
// // // // //             <p className="text-2xl font-bold text-purple-600">${(item.price * item.quantity).toFixed(2)}</p>
// // // // //             <div className="flex items-center space-x-2">
// // // // //                 <motion.button
// // // // //                     whileHover={{ scale: 1.1 }}
// // // // //                     whileTap={{ scale: 0.9 }}
// // // // //                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
// // // // //                     className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
// // // // //                     aria-label="Decrease quantity"
// // // // //                 >
// // // // //                     <FaMinus size={12} />
// // // // //                 </motion.button>
// // // // //                 <motion.button
// // // // //                     whileHover={{ scale: 1.1 }}
// // // // //                     whileTap={{ scale: 0.9 }}
// // // // //                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
// // // // //                     className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
// // // // //                     aria-label="Increase quantity"
// // // // //                 >
// // // // //                     <FaPlus size={12} />
// // // // //                 </motion.button>
// // // // //             </div>
// // // // //             <motion.button
// // // // //                 whileHover={{ scale: 1.1 }}
// // // // //                 whileTap={{ scale: 0.9 }}
// // // // //                 onClick={() => removeItem(item.id)}
// // // // //                 className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
// // // // //                 aria-label="Remove item"
// // // // //             >
// // // // //                 <FaTrash size={14} />
// // // // //             </motion.button>
// // // // //         </div>
// // // // //     </motion.div>
// // // // // );
// // // // //
// // // // // const CartPage = () => {
// // // // //     const [cartItems, setCartItems] = useState([
// // // // //         { id: 1, name: "Gold Necklace", price: 499.99, quantity: 1, image: "https://via.placeholder.com/80/80", variant: "24K Gold" },
// // // // //         { id: 2, name: "Silver Earrings", price: 89.99, quantity: 2, image: "https://via.placeholder.com/80/80", variant: "Sterling Silver" },
// // // // //         { id: 3, name: "Platinum Ring", price: 799.99, quantity: 1, image: "https://via.placeholder.com/80/80", variant: "Platinum" },
// // // // //     ]);
// // // // //
// // // // //     const [couponCode, setCouponCode] = useState('');
// // // // //     const [shippingMethod, setShippingMethod] = useState('free');
// // // // //
// // // // //     const updateQuantity = (id, newQuantity) => {
// // // // //         if (newQuantity > 0) {
// // // // //             setCartItems(cartItems.map(item =>
// // // // //                 item.id === id ? { ...item, quantity: newQuantity } : item
// // // // //             ));
// // // // //         }
// // // // //     };
// // // // //
// // // // //     const removeItem = (id) => {
// // // // //         setCartItems(cartItems.filter(item => item.id !== id));
// // // // //     };
// // // // //
// // // // //     const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
// // // // //     const shippingCost = shippingMethod === 'express' ? 15 : 0;
// // // // //     const total = subtotal + shippingCost;
// // // // //     //
// // // // //     return (
// // // // //         <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 py-12">
// // // // //             <div className="container mx-auto px-4">
// // // // //                 <motion.h1
// // // // //                     initial={{ opacity: 0, y: -50 }}
// // // // //                     animate={{ opacity: 1, y: 0 }}
// // // // //                     transition={{ type: "spring", stiffness: 300, damping: 20 }}
// // // // //                     className="text-5xl font-extrabold mb-12 text-center text-purple-800 drop-shadow-lg"
// // // // //                 >
// // // // //                     Your Luxury Cart
// // // // //                 </motion.h1>
// // // // //
// // // // //                 <div className="lg:flex lg:space-x-8">
// // // // //                     <motion.div
// // // // //                         initial={{ opacity: 0, x: -50 }}
// // // // //                         animate={{ opacity: 1, x: 0 }}
// // // // //                         transition={{ delay: 0.2 }}
// // // // //                         className="lg:w-2/3 mb-8 lg:mb-0"
// // // // //                     >
// // // // //                         <AnimatePresence>
// // // // //                             {cartItems.length === 0 ? (
// // // // //                                 <motion.div
// // // // //                                     key="empty"
// // // // //                                     initial={{ opacity: 0 }}
// // // // //                                     animate={{ opacity: 1 }}
// // // // //                                     exit={{ opacity: 0 }}
// // // // //                                     className="text-center text-purple-800 bg-white rounded-2xl p-12 shadow-xl"
// // // // //                                 >
// // // // //                                     <FaShoppingCart className="mx-auto text-8xl mb-6 text-purple-400" />
// // // // //                                     <p className="text-2xl mb-6 font-semibold">Your cart is empty</p>
// // // // //                                     <motion.button
// // // // //                                         whileHover={{ scale: 1.05 }}
// // // // //                                         whileTap={{ scale: 0.95 }}
// // // // //                                         className="bg-purple-600 text-white py-3 px-8 rounded-full text-lg font-bold hover:bg-purple-700 transition-colors shadow-lg"
// // // // //                                     >
// // // // //                                         Continue Shopping
// // // // //                                     </motion.button>
// // // // //                                 </motion.div>
// // // // //                             ) : (
// // // // //                                 <>
// // // // //                                     {cartItems.map(item => (
// // // // //                                         <CartItem
// // // // //                                             key={item.id}
// // // // //                                             item={item}
// // // // //                                             updateQuantity={updateQuantity}
// // // // //                                             removeItem={removeItem}
// // // // //                                         />
// // // // //                                     ))}
// // // // //                                 </>
// // // // //                             )}
// // // // //                         </AnimatePresence>
// // // // //                     </motion.div>
// // // // //
// // // // //                     {cartItems.length > 0 && (
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0, x: 50 }}
// // // // //                             animate={{ opacity: 1, x: 0 }}
// // // // //                             transition={{ delay: 0.4 }}
// // // // //                             className="lg:w-1/3"
// // // // //                         >
// // // // //                             <div className="bg-white p-8 rounded-2xl shadow-xl">
// // // // //                                 <h2 className="text-3xl font-bold mb-8 text-purple-800">Order Summary</h2>
// // // // //                                 <div className="space-y-6 mb-8">
// // // // //                                     <div className="flex justify-between items-center">
// // // // //                                         <span className="text-lg text-gray-600">Subtotal</span>
// // // // //                                         <span className="text-2xl font-bold text-purple-600">${subtotal.toFixed(2)}</span>
// // // // //                                     </div>
// // // // //                                     <div className="flex justify-between items-center">
// // // // //                                         <span className="text-lg text-gray-600">Shipping</span>
// // // // //                                         <select
// // // // //                                             value={shippingMethod}
// // // // //                                             onChange={(e) => setShippingMethod(e.target.value)}
// // // // //                                             className="bg-purple-100 text-purple-800 rounded-lg p-2 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
// // // // //                                         >
// // // // //                                             <option value="free">Free Shipping</option>
// // // // //                                             <option value="express">Express ($15)</option>
// // // // //                                         </select>
// // // // //                                     </div>
// // // // //                                     <div className="flex justify-between items-center border-t border-purple-200 pt-6">
// // // // //                                         <span className="text-2xl font-bold text-purple-800">Total</span>
// // // // //                                         <span className="text-3xl font-bold text-purple-600">${total.toFixed(2)}</span>
// // // // //                                     </div>
// // // // //                                 </div>
// // // // //                                 <div className="mb-8">
// // // // //                                     <label htmlFor="coupon" className="block text-lg font-semibold text-purple-800 mb-2">
// // // // //                                         Have a coupon?
// // // // //                                     </label>
// // // // //                                     <div className="flex space-x-2">
// // // // //                                         <input
// // // // //                                             type="text"
// // // // //                                             id="coupon"
// // // // //                                             value={couponCode}
// // // // //                                             onChange={(e) => setCouponCode(e.target.value)}
// // // // //                                             placeholder="Enter coupon code"
// // // // //                                             className="flex-grow p-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-purple-800 placeholder-purple-300"
// // // // //                                         />
// // // // //                                         <motion.button
// // // // //                                             whileHover={{ scale: 1.05 }}
// // // // //                                             whileTap={{ scale: 0.95 }}
// // // // //                                             className="bg-purple-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-purple-700 transition-colors shadow-md"
// // // // //                                         >
// // // // //                                             Apply
// // // // //                                         </motion.button>
// // // // //                                     </div>
// // // // //                                 </div>
// // // // //                                 <motion.button
// // // // //                                     whileHover={{ scale: 1.05 }}
// // // // //                                     whileTap={{ scale: 0.95 }}
// // // // //                                     className="w-full bg-purple-600 text-white py-4 rounded-xl text-xl font-bold hover:bg-purple-700 transition-colors shadow-lg flex items-center justify-center space-x-3 mb-8"
// // // // //                                 >
// // // // //                                     <span>Proceed to Checkout</span>
// // // // //                                     <FaArrowRight size={20} />
// // // // //                                 </motion.button>
// // // // //                                 <div className="flex justify-center space-x-8">
// // // // //                                     <motion.div whileHover={{ scale: 1.2 }} className="text-purple-400"><FaCreditCard size={32} /></motion.div>
// // // // //                                     <motion.div whileHover={{ scale: 1.2 }} className="text-purple-400"><FaPaypal size={32} /></motion.div>
// // // // //                                     <motion.div whileHover={{ scale: 1.2 }} className="text-purple-400"><FaApplePay size={32} /></motion.div>
// // // // //                                     <motion.div whileHover={{ scale: 1.2 }} className="text-purple-400"><FaGoogle size={32} /></motion.div>
// // // // //                                 </div>
// // // // //                             </div>
// // // // //                         </motion.div>
// // // // //                     )}
// // // // //                 </div>
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // };
// // // // //
// // // // // export default CartPage;
// // // // // // import React, { useState } from 'react';
// // // // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // // // import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowRight, FaCreditCard, FaPaypal, FaApplePay, FaGoogle } from 'react-icons/fa';
// // // // // //
// // // // // // const CartItem = ({ item, updateQuantity, removeItem }) => (
// // // // // //     <motion.div
// // // // // //         layout
// // // // // //         initial={{ opacity: 0, y: 20 }}
// // // // // //         animate={{ opacity: 1, y: 0 }}
// // // // // //         exit={{ opacity: 0, y: -20 }}
// // // // // //         className="flex items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
// // // // // //     >
// // // // // //         <div className="flex items-center space-x-4">
// // // // // //             <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
// // // // // //             <div>
// // // // // //                 <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
// // // // // //                 <p className="text-sm text-gray-500">{item.variant}</p>
// // // // // //             </div>
// // // // // //         </div>
// // // // // //         <div className="flex items-center space-x-4">
// // // // // //             <p className="text-lg font-bold text-indigo-600">${item.price.toFixed(2)}</p>
// // // // // //             <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
// // // // // //                 <button
// // // // // //                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
// // // // // //                     className="p-1 rounded-full bg-white text-gray-600 hover:bg-indigo-100 transition-colors"
// // // // // //                     aria-label="Decrease quantity"
// // // // // //                 >
// // // // // //                     <FaMinus size={12} />
// // // // // //                 </button>
// // // // // //                 <span className="text-gray-800 font-semibold text-sm w-6 text-center">{item.quantity}</span>
// // // // // //                 <button
// // // // // //                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
// // // // // //                     className="p-1 rounded-full bg-white text-gray-600 hover:bg-indigo-100 transition-colors"
// // // // // //                     aria-label="Increase quantity"
// // // // // //                 >
// // // // // //                     <FaPlus size={12} />
// // // // // //                 </button>
// // // // // //             </div>
// // // // // //             <button
// // // // // //                 onClick={() => removeItem(item.id)}
// // // // // //                 className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
// // // // // //                 aria-label="Remove item"
// // // // // //             >
// // // // // //                 <FaTrash size={14} />
// // // // // //             </button>
// // // // // //         </div>
// // // // // //     </motion.div>
// // // // // // );
// // // // // //
// // // // // // const CartPage = () => {
// // // // // //     const [cartItems, setCartItems] = useState([
// // // // // //         { id: 1, name: "Gold Necklace", price: 499.99, quantity: 1, image: "https://via.placeholder.com/80/80", variant: "24K Gold" },
// // // // // //         { id: 2, name: "Silver Earrings", price: 89.99, quantity: 2, image: "https://via.placeholder.com/80/80", variant: "Sterling Silver" },
// // // // // //         { id: 3, name: "Platinum Ring", price: 799.99, quantity: 1, image: "https://via.placeholder.com/80/80", variant: "Platinum" },
// // // // // //     ]);
// // // // // //
// // // // // //     const [couponCode, setCouponCode] = useState('');
// // // // // //     const [shippingMethod, setShippingMethod] = useState('free');
// // // // // //
// // // // // //     const updateQuantity = (id, newQuantity) => {
// // // // // //         if (newQuantity > 0) {
// // // // // //             setCartItems(cartItems.map(item =>
// // // // // //                 item.id === id ? { ...item, quantity: newQuantity } : item
// // // // // //             ));
// // // // // //         }
// // // // // //     };
// // // // // //
// // // // // //     const removeItem = (id) => {
// // // // // //         setCartItems(cartItems.filter(item => item.id !== id));
// // // // // //     };
// // // // // //
// // // // // //     const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
// // // // // //     const shippingCost = shippingMethod === 'express' ? 15 : 0;
// // // // // //     const total = subtotal + shippingCost;
// // // // // //
// // // // // //     return (
// // // // // //         <div className="min-h-screen bg-gray-50">
// // // // // //             <div className="container mx-auto px-4 py-8 md:py-12">
// // // // // //                 <motion.h1
// // // // // //                     initial={{ opacity: 0, y: -20 }}
// // // // // //                     animate={{ opacity: 1, y: 0 }}
// // // // // //                     className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800"
// // // // // //                 >
// // // // // //                     Your Shopping Cart
// // // // // //                 </motion.h1>
// // // // // //
// // // // // //                 <div className="lg:flex lg:space-x-8">
// // // // // //                     <div className="lg:w-2/3 mb-8 lg:mb-0">
// // // // // //                         <AnimatePresence>
// // // // // //                             {cartItems.length === 0 ? (
// // // // // //                                 <motion.div
// // // // // //                                     key="empty"
// // // // // //                                     initial={{ opacity: 0 }}
// // // // // //                                     animate={{ opacity: 1 }}
// // // // // //                                     exit={{ opacity: 0 }}
// // // // // //                                     className="text-center text-gray-500 bg-white rounded-lg p-8 shadow-sm"
// // // // // //                                 >
// // // // // //                                     <FaShoppingCart className="mx-auto text-6xl mb-4 text-indigo-400" />
// // // // // //                                     <p className="text-xl mb-4">Your cart is empty</p>
// // // // // //                                     <button className="bg-indigo-600 text-white py-2 px-6 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors">
// // // // // //                                         Continue Shopping
// // // // // //                                     </button>
// // // // // //                                 </motion.div>
// // // // // //                             ) : (
// // // // // //                                 <>
// // // // // //                                     {cartItems.map(item => (
// // // // // //                                         <CartItem
// // // // // //                                             key={item.id}
// // // // // //                                             item={item}
// // // // // //                                             updateQuantity={updateQuantity}
// // // // // //                                             removeItem={removeItem}
// // // // // //                                         />
// // // // // //                                     ))}
// // // // // //                                 </>
// // // // // //                             )}
// // // // // //                         </AnimatePresence>
// // // // // //                     </div>
// // // // // //
// // // // // //                     {cartItems.length > 0 && (
// // // // // //                         <motion.div
// // // // // //                             initial={{ opacity: 0, x: 20 }}
// // // // // //                             animate={{ opacity: 1, x: 0 }}
// // // // // //                             className="lg:w-1/3"
// // // // // //                         >
// // // // // //                             <div className="bg-white p-6 rounded-lg shadow-sm">
// // // // // //                                 <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Summary</h2>
// // // // // //                                 <div className="space-y-4 mb-6">
// // // // // //                                     <div className="flex justify-between text-sm">
// // // // // //                                         <span className="text-gray-600">Subtotal</span>
// // // // // //                                         <span className="font-semibold">${subtotal.toFixed(2)}</span>
// // // // // //                                     </div>
// // // // // //                                     <div className="flex justify-between text-sm">
// // // // // //                                         <span className="text-gray-600">Shipping</span>
// // // // // //                                         <select
// // // // // //                                             value={shippingMethod}
// // // // // //                                             onChange={(e) => setShippingMethod(e.target.value)}
// // // // // //                                             className="bg-gray-100 text-gray-800 rounded-md p-1"
// // // // // //                                         >
// // // // // //                                             <option value="free">Free Shipping</option>
// // // // // //                                             <option value="express">Express ($15)</option>
// // // // // //                                         </select>
// // // // // //                                     </div>
// // // // // //                                     <div className="flex justify-between text-lg font-semibold border-t pt-4">
// // // // // //                                         <span>Total</span>
// // // // // //                                         <span className="text-indigo-600">${total.toFixed(2)}</span>
// // // // // //                                     </div>
// // // // // //                                 </div>
// // // // // //                                 <div className="mb-6">
// // // // // //                                     <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
// // // // // //                                         Have a coupon?
// // // // // //                                     </label>
// // // // // //                                     <div className="flex space-x-2">
// // // // // //                                         <input
// // // // // //                                             type="text"
// // // // // //                                             id="coupon"
// // // // // //                                             value={couponCode}
// // // // // //                                             onChange={(e) => setCouponCode(e.target.value)}
// // // // // //                                             placeholder="Enter coupon code"
// // // // // //                                             className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
// // // // // //                                         />
// // // // // //                                         <button className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
// // // // // //                                             Apply
// // // // // //                                         </button>
// // // // // //                                     </div>
// // // // // //                                 </div>
// // // // // //                                 <button className="w-full bg-indigo-600 text-white py-3 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 mb-6">
// // // // // //                                     <span>Proceed to Checkout</span>
// // // // // //                                     <FaArrowRight size={16} />
// // // // // //                                 </button>
// // // // // //                                 <div className="flex justify-center space-x-6 text-gray-400">
// // // // // //                                     <FaCreditCard size={24} />
// // // // // //                                     <FaPaypal size={24} />
// // // // // //                                     <FaApplePay size={24} />
// // // // // //                                     <FaGoogle size={24} />
// // // // // //                                 </div>
// // // // // //                             </div>
// // // // // //                         </motion.div>
// // // // // //                     )}
// // // // // //                 </div>
// // // // // //             </div>
// // // // // //         </div>
// // // // // //     );
// // // // // // };
// // // // // //
// // // // // // export default CartPage;
// // // // // // import React, { useState } from 'react';
// // // // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // // // import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowRight, FaCreditCard, FaPaypal, FaApplePay, FaGoogle } from 'react-icons/fa';
// // // // // //
// // // // // // const CartItem = ({ item, updateQuantity, removeItem }) => (
// // // // // //     <motion.div
// // // // // //         layout
// // // // // //         initial={{ opacity: 0, y: 20 }}
// // // // // //         animate={{ opacity: 1, y: 0 }}
// // // // // //         exit={{ opacity: 0, y: -20 }}
// // // // // //         className="flex flex-col sm:flex-row items-center justify-between p-4 mb-4 bg-background rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
// // // // // //     >
// // // // // //         <div className="flex items-center space-x-4 mb-4 sm:mb-0">
// // // // // //             <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
// // // // // //             <div>
// // // // // //                 <h3 className="text-lg font-semibold text-text">{item.name}</h3>
// // // // // //                 <p className="text-accent font-bold mt-1">${item.price.toFixed(2)}</p>
// // // // // //                 <p className="text-text-muted text-sm">{item.variant}</p>
// // // // // //             </div>
// // // // // //         </div>
// // // // // //         <div className="flex items-center space-x-4">
// // // // // //             <div className="flex items-center space-x-2 bg-secondary rounded-full p-1">
// // // // // //                 <button
// // // // // //                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
// // // // // //                     className="p-1 rounded-full bg-background text-text hover:bg-accent hover:text-text-light transition-colors"
// // // // // //                     aria-label="Decrease quantity"
// // // // // //                 >
// // // // // //                     <FaMinus size={12} />
// // // // // //                 </button>
// // // // // //                 <span className="text-text font-semibold text-sm w-6 text-center">{item.quantity}</span>
// // // // // //                 <button
// // // // // //                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
// // // // // //                     className="p-1 rounded-full bg-background text-text hover:bg-accent hover:text-text-light transition-colors"
// // // // // //                     aria-label="Increase quantity"
// // // // // //                 >
// // // // // //                     <FaPlus size={12} />
// // // // // //                 </button>
// // // // // //             </div>
// // // // // //             <button
// // // // // //                 onClick={() => removeItem(item.id)}
// // // // // //                 className="p-2 rounded-full bg-error text-text-light hover:bg-opacity-80 transition-colors"
// // // // // //                 aria-label="Remove item"
// // // // // //             >
// // // // // //                 <FaTrash size={14} />
// // // // // //             </button>
// // // // // //         </div>
// // // // // //     </motion.div>
// // // // // // );
// // // // // //
// // // // // // const CartPage = () => {
// // // // // //         const [cartItems, setCartItems] = useState([
// // // // // //         { id: 1, name: "Gold Necklace", description: "24K gold with diamond accents", price: 499.99, quantity: 1, image: "https://via.placeholder.com/80/80" ,variant: "Black"},
// // // // // //         { id: 2, name: "Silver Earrings", description: "Sterling silver, simple and elegant", price: 89.99, quantity: 2, image: "https://via.placeholder.com/80/80" , variant: "Silver"},
// // // // // //         { id: 3, name: "Platinum Ring", description: "Platinum band with sapphire gemstone", price: 799.99, quantity: 1, image: "https://via.placeholder.com/80/80" , variant: "Blue" },
// // // // // //     ]);
// // // // // //
// // // // // //     const [couponCode, setCouponCode] = useState('');
// // // // // //     const [shippingMethod, setShippingMethod] = useState('free');
// // // // // //
// // // // // //     const updateQuantity = (id, newQuantity) => {
// // // // // //         if (newQuantity > 0) {
// // // // // //             setCartItems(cartItems.map(item =>
// // // // // //                 item.id === id ? { ...item, quantity: newQuantity } : item
// // // // // //             ));
// // // // // //         }
// // // // // //     };
// // // // // //
// // // // // //     const removeItem = (id) => {
// // // // // //         setCartItems(cartItems.filter(item => item.id !== id));
// // // // // //     };
// // // // // //
// // // // // //     const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
// // // // // //     const shippingCost = shippingMethod === 'express' ? 15 : 0;
// // // // // //     const total = subtotal + shippingCost;
// // // // // //
// // // // // //     return (
// // // // // //         <div className="min-h-screen bg-primary from-background to-secondary text-text">
// // // // // //             <div className="container mx-auto px-4 py-8 md:py-12">
// // // // // //                 <motion.h1
// // // // // //                     initial={{ opacity: 0, y: -20 }}
// // // // // //                     animate={{ opacity: 1, y: 0 }}
// // // // // //                     className="text-4xl md:text-5xl font-bold mb-8 text-center text-primary"
// // // // // //                 >
// // // // // //                     Your Shopping Cart
// // // // // //                 </motion.h1>
// // // // // //
// // // // // //                 <div className="lg:flex lg:space-x-8">
// // // // // //                     <div className="lg:w-2/3 mb-8 lg:mb-0">
// // // // // //                         <AnimatePresence>
// // // // // //                             {cartItems.length === 0 ? (
// // // // // //                                 <motion.div
// // // // // //                                     key="empty"
// // // // // //                                     initial={{ opacity: 0 }}
// // // // // //                                     animate={{ opacity: 1 }}
// // // // // //                                     exit={{ opacity: 0 }}
// // // // // //                                     className="text-center text-text-muted bg-background rounded-lg p-8 shadow-md"
// // // // // //                                 >
// // // // // //                                     <FaShoppingCart className="mx-auto text-6xl mb-4 text-accent" />
// // // // // //                                     <p className="text-xl mb-4">Your cart is empty</p>
// // // // // //                                     <button className="bg-accent text-text-light py-2 px-4 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors">
// // // // // //                                         Continue Shopping
// // // // // //                                     </button>
// // // // // //                                 </motion.div>
// // // // // //                             ) : (
// // // // // //                                 <>
// // // // // //                                     {cartItems.map(item => (
// // // // // //                                         <CartItem
// // // // // //                                             key={item.id}
// // // // // //                                             item={item}
// // // // // //                                             updateQuantity={updateQuantity}
// // // // // //                                             removeItem={removeItem}
// // // // // //                                         />
// // // // // //                                     ))}
// // // // // //                                     <div className="mt-6">
// // // // // //                                         <h3 className="text-lg font-semibold mb-2">Have a coupon?</h3>
// // // // // //                                         <div className="flex space-x-2">
// // // // // //                                             <input
// // // // // //                                                 type="text"
// // // // // //                                                 value={couponCode}
// // // // // //                                                 onChange={(e) => setCouponCode(e.target.value)}
// // // // // //                                                 placeholder="Enter coupon code"
// // // // // //                                                 className="flex-grow p-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
// // // // // //                                             />
// // // // // //                                             <button className="bg-accent text-text-light py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors">
// // // // // //                                                 Apply
// // // // // //                                             </button>
// // // // // //                                         </div>
// // // // // //                                     </div>
// // // // // //                                 </>
// // // // // //                             )}
// // // // // //                         </AnimatePresence>
// // // // // //                     </div>
// // // // // //
// // // // // //                     {cartItems.length > 0 && (
// // // // // //                         <motion.div
// // // // // //                             initial={{ opacity: 0, x: 20 }}
// // // // // //                             animate={{ opacity: 1, x: 0 }}
// // // // // //                             className="lg:w-1/3"
// // // // // //                         >
// // // // // //                             <div className="bg-background p-6 rounded-lg shadow-md">
// // // // // //                                 <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
// // // // // //                                 <div className="space-y-3 mb-6">
// // // // // //                                     <div className="flex justify-between text-sm">
// // // // // //                                         <span className="text-text-muted">Subtotal</span>
// // // // // //                                         <span>${subtotal.toFixed(2)}</span>
// // // // // //                                     </div>
// // // // // //                                     <div className="flex justify-between text-sm">
// // // // // //                                         <span className="text-text-muted">Shipping</span>
// // // // // //                                         <select
// // // // // //                                             value={shippingMethod}
// // // // // //                                             onChange={(e) => setShippingMethod(e.target.value)}
// // // // // //                                             className="bg-secondary text-text rounded-md p-1"
// // // // // //                                         >
// // // // // //                                             <option value="free">Free Shipping</option>
// // // // // //                                             <option value="express">Express ($15)</option>
// // // // // //                                         </select>
// // // // // //                                     </div>
// // // // // //                                     <div className="flex justify-between text-lg font-semibold">
// // // // // //                                         <span>Total</span>
// // // // // //                                         <span className="text-accent">${total.toFixed(2)}</span>
// // // // // //                                     </div>
// // // // // //                                 </div>
// // // // // //                                 <button className="w-full bg-accent text-text-light py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2 mb-4">
// // // // // //                                     <span>Proceed to Checkout</span>
// // // // // //                                     <FaArrowRight size={16} />
// // // // // //                                 </button>
// // // // // //                                 <div className="flex justify-center space-x-4 text-text-muted">
// // // // // //                                     <FaCreditCard size={24} />
// // // // // //                                     <FaPaypal size={24} />
// // // // // //                                     <FaApplePay size={24} />
// // // // // //                                     <FaGoogle size={24} />
// // // // // //                                 </div>
// // // // // //                             </div>
// // // // // //                         </motion.div>
// // // // // //                     )}
// // // // // //                 </div>
// // // // // //             </div>
// // // // // //         </div>
// // // // // //     );
// // // // // // };
// // // // // //
// // // // // // export default CartPage;
// // // // //
// // // // //
// // // // // // import React, { useState } from 'react';
// // // // // // import { FaTrash } from 'react-icons/fa';
// // // // // //
// // // // // // const CartPage = () => {
// // // // // //     const [cartItems, setCartItems] = useState([
// // // // // //         { id: 1, name: "Gold Necklace", description: "24K gold with diamond accents", price: 499.99, quantity: 1, image: "https://via.placeholder.com/80/80" },
// // // // // //         { id: 2, name: "Silver Earrings", description: "Sterling silver, simple and elegant", price: 89.99, quantity: 2, image: "https://via.placeholder.com/80/80" },
// // // // // //         { id: 3, name: "Platinum Ring", description: "Platinum band with sapphire gemstone", price: 799.99, quantity: 1, image: "https://via.placeholder.com/80/80" },
// // // // // //     ]);
// // // // // //
// // // // // //     const handleQuantityChange = (id, newQuantity) => {
// // // // // //         if (newQuantity <= 0) return;
// // // // // //         setCartItems(cartItems.map(item =>
// // // // // //             item.id === id ? { ...item, quantity: newQuantity } : item
// // // // // //         ));
// // // // // //     };
// // // // // //
// // // // // //     const handleRemoveItem = (id) => {
// // // // // //         setCartItems(cartItems.filter(item => item.id !== id));
// // // // // //     };
// // // // // //
// // // // // //     const calculateTotal = () => {
// // // // // //         return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
// // // // // //     };
// // // // // //
// // // // // //     return (
// // // // // //         <div className="container mx-auto px-4 py-8 bg-background">
// // // // // //             <h1 className="text-3xl font-bold mb-8 text-text">Shopping Cart</h1>
// // // // // //             {cartItems.length === 0 ? (
// // // // // //                 <p className="text-center text-gray-500">Your cart is empty.</p>
// // // // // //             ) : (
// // // // // //                 <div className="flex flex-col gap-6">
// // // // // //                     {cartItems.map(item => (
// // // // // //                         <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row items-center gap-4">
// // // // // //                             <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
// // // // // //                             <div className="flex-grow">
// // // // // //                                 <h2 className="text-xl font-semibold text-text">{item.name}</h2>
// // // // // //                                 <p className="text-gray-600">{item.description}</p>
// // // // // //                                 <p className="text-lg font-medium text-text mt-2">${item.price.toFixed(2)}</p>
// // // // // //                             </div>
// // // // // //                             <div className="flex items-center gap-4">
// // // // // //                                 <input
// // // // // //                                     type="number"
// // // // // //                                     min="1"
// // // // // //                                     value={item.quantity}
// // // // // //                                     onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
// // // // // //                                     className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
// // // // // //                                 />
// // // // // //                                 <button
// // // // // //                                     onClick={() => handleRemoveItem(item.id)}
// // // // // //                                     className="text-red-500 hover:text-red-600"
// // // // // //                                 >
// // // // // //                                     <FaTrash className="text-xl" />
// // // // // //                                 </button>
// // // // // //                             </div>
// // // // // //                         </div>
// // // // // //                     ))}
// // // // // //                     <div className="mt-6 bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
// // // // // //                         <h2 className="text-xl font-semibold text-text">Total</h2>
// // // // // //                         <p className="text-2xl font-bold text-text">${calculateTotal()}</p>
// // // // // //                     </div>
// // // // // //                     <div className="mt-6 flex justify-end">
// // // // // //                         <button className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
// // // // // //                             Checkout
// // // // // //                         </button>
// // // // // //                     </div>
// // // // // //                 </div>
// // // // // //             )}
// // // // // //         </div>
// // // // // //     );
// // // // // // };
// // // // // //
// // // // // // export default CartPage;
// // // // //
// // // // // // import React from 'react';
// // // // // // import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
// // // // // //
// // // // // // const CartItem = ({ item }) => (
// // // // // //     <div className="flex items-center space-x-4 p-4 bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
// // // // // //         <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
// // // // // //         <div className="flex-grow">
// // // // // //             <h3 className="font-semibold text-text">{item.name}</h3>
// // // // // //             <p className="text-sm text-text-muted">{item.description}</p>
// // // // // //         </div>
// // // // // //         <div className="flex items-center space-x-4">
// // // // // //             <div className="flex items-center space-x-2 bg-background rounded-full shadow-inner p-1">
// // // // // //                 <button className="p-1 rounded-full hover:bg-accent transition-colors duration-200">
// // // // // //                     <Minus size={16} className="text-text-muted" />
// // // // // //                 </button>
// // // // // //                 <span className="font-medium text-text w-8 text-center">{item.quantity}</span>
// // // // // //                 <button className="p-1 rounded-full hover:bg-accent transition-colors duration-200">
// // // // // //                     <Plus size={16} className="text-text-muted" />
// // // // // //                 </button>
// // // // // //             </div>
// // // // // //             <span className="font-semibold text-text">${item.price.toFixed(2)}</span>
// // // // // //             <button className="p-2 text-error hover:text-opacity-80 transition-colors duration-200">
// // // // // //                 <Trash2 size={20} />
// // // // // //             </button>
// // // // // //         </div>
// // // // // //     </div>
// // // // // // );
// // // // // //
// // // // // // const CartSummary = ({ subtotal, shipping, total }) => (
// // // // // //     <div className="bg-background rounded-lg shadow-lg p-6 space-y-4 sticky top-4">
// // // // // //         <h2 className="text-2xl font-bold text-text mb-4">Order Summary</h2>
// // // // // //         <div className="flex justify-between">
// // // // // //             <span className="text-text-muted">Subtotal</span>
// // // // // //             <span className="font-medium text-text">${subtotal.toFixed(2)}</span>
// // // // // //         </div>
// // // // // //         <div className="flex justify-between">
// // // // // //             <span className="text-text-muted">Shipping</span>
// // // // // //             <span className="font-medium text-text">${shipping.toFixed(2)}</span>
// // // // // //         </div>
// // // // // //         <div className="border-t pt-4 border-border">
// // // // // //             <div className="flex justify-between">
// // // // // //                 <span className="font-semibold text-text">Total</span>
// // // // // //                 <span className="font-bold text-text">${total.toFixed(2)}</span>
// // // // // //             </div>
// // // // // //         </div>
// // // // // //         <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-secondary transition-colors duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
// // // // // //             <ShoppingBag size={20} />
// // // // // //             <span>Proceed to Checkout</span>
// // // // // //         </button>
// // // // // //     </div>
// // // // // // );
// // // // // //
// // // // // // const CartPage = () => {
// // // // // //     const cartItems = [
// // // // // //         { id: 1, name: "Gold Necklace", description: "24K gold with diamond accents", price: 499.99, quantity: 1, image: "https://via.placeholder.com/80/80" },
// // // // // //         { id: 2, name: "Silver Earrings", description: "Sterling silver, simple and elegant", price: 89.99, quantity: 2, image: "https://via.placeholder.com/80/80" },
// // // // // //         { id: 3, name: "Platinum Ring", description: "Platinum band with sapphire gemstone", price: 799.99, quantity: 1, image: "https://via.placeholder.com/80/80" },
// // // // // //     ];
// // // // // //
// // // // // //     const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
// // // // // //     const shipping = 15;
// // // // // //     const total = subtotal + shipping;
// // // // // //
// // // // // //     return (
// // // // // //         <div className="bg-background min-h-screen py-12 px-4 sm:px-6 lg:px-8">
// // // // // //             <div className="max-w-7xl mx-auto">
// // // // // //                 <div className="flex items-center justify-between mb-8">
// // // // // //                     <h1 className="text-3xl font-extrabold text-text">Your Jewelry Cart</h1>
// // // // // //                     <button className="flex items-center text-text-muted hover:text-text transition-colors duration-200">
// // // // // //                         <ArrowLeft size={20} className="mr-2" />
// // // // // //                         Continue Shopping
// // // // // //                     </button>
// // // // // //                 </div>
// // // // // //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// // // // // //                     <div className="lg:col-span-2 space-y-6">
// // // // // //                         {cartItems.map(item => (
// // // // // //                             <CartItem key={item.id} item={item} />
// // // // // //                         ))}
// // // // // //                     </div>
// // // // // //                     <div className="lg:col-span-1">
// // // // // //                         <CartSummary subtotal={subtotal} shipping={shipping} total={total} />
// // // // // //                     </div>
// // // // // //                 </div>
// // // // // //             </div>
// // // // // //         </div>
// // // // // //     );
// // // // // // };
// // // // // //
// // // // // // export default CartPage;
// // // // // // // import React from 'react';
// // // // // // // import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
// // // // // // //
// // // // // // // const CartItem = ({ item }) => (
// // // // // // //     <div className="flex items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
// // // // // // //         <div className="flex items-center space-x-4">
// // // // // // //             <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
// // // // // // //             <div>
// // // // // // //                 <h3 className="font-semibold text-gray-800">{item.name}</h3>
// // // // // // //                 <p className="text-sm text-gray-500">{item.description}</p>
// // // // // // //             </div>
// // // // // // //         </div>
// // // // // // //         <div className="flex items-center space-x-4">
// // // // // // //             <div className="flex items-center space-x-2">
// // // // // // //                 <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
// // // // // // //                     <Minus size={16} className="text-gray-600" />
// // // // // // //                 </button>
// // // // // // //                 <span className="font-medium text-gray-800">{item.quantity}</span>
// // // // // // //                 <button className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200">
// // // // // // //                     <Plus size={16} className="text-gray-600" />
// // // // // // //                 </button>
// // // // // // //             </div>
// // // // // // //             <span className="font-semibold text-gray-800">${item.price.toFixed(2)}</span>
// // // // // // //             <button className="p-2 text-red-500 hover:text-red-600 transition-colors duration-200">
// // // // // // //                 <Trash2 size={20} />
// // // // // // //             </button>
// // // // // // //         </div>
// // // // // // //     </div>
// // // // // // // );
// // // // // // //
// // // // // // // const CartSummary = ({ subtotal, shipping, total }) => (
// // // // // // //     <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
// // // // // // //         <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
// // // // // // //         <div className="flex justify-between">
// // // // // // //             <span className="text-gray-600">Subtotal</span>
// // // // // // //             <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
// // // // // // //         </div>
// // // // // // //         <div className="flex justify-between">
// // // // // // //             <span className="text-gray-600">Shipping</span>
// // // // // // //             <span className="font-medium text-gray-800">${shipping.toFixed(2)}</span>
// // // // // // //         </div>
// // // // // // //         <div className="border-t pt-4">
// // // // // // //             <div className="flex justify-between">
// // // // // // //                 <span className="font-semibold text-gray-800">Total</span>
// // // // // // //                 <span className="font-bold text-gray-800">${total.toFixed(2)}</span>
// // // // // // //             </div>
// // // // // // //         </div>
// // // // // // //         <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center space-x-2">
// // // // // // //             <ShoppingBag size={20} />
// // // // // // //             <span>Proceed to Checkout</span>
// // // // // // //         </button>
// // // // // // //     </div>
// // // // // // // );
// // // // // // //
// // // // // // // const CartPage = () => {
// // // // // // //     const cartItems = [
// // // // // // //         { id: 1, name: "Gold Necklace", description: "24K gold with diamond accents", price: 499.99, quantity: 1, image: "https://via.placeholder.com/80/80" },
// // // // // // //         { id: 2, name: "Silver Earrings", description: "Sterling silver, simple and elegant", price: 89.99, quantity: 2, image: "https://via.placeholder.com/80/80" },
// // // // // // //         { id: 3, name: "Platinum Ring", description: "Platinum band with sapphire gemstone", price: 799.99, quantity: 1, image: "https://via.placeholder.com/80/80" },
// // // // // // //     ];
// // // // // // //
// // // // // // //     const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
// // // // // // //     const shipping = 15;  // Adjusted shipping cost
// // // // // // //     const total = subtotal + shipping;
// // // // // // //
// // // // // // //     return (
// // // // // // //         <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
// // // // // // //             <div className="max-w-7xl mx-auto">
// // // // // // //                 <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Jewelry Cart</h1>
// // // // // // //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// // // // // // //                     <div className="lg:col-span-2 space-y-4">
// // // // // // //                         {cartItems.map(item => (
// // // // // // //                             <CartItem key={item.id} item={item} />
// // // // // // //                         ))}
// // // // // // //                     </div>
// // // // // // //                     <div className="lg:col-span-1">
// // // // // // //                         <CartSummary subtotal={subtotal} shipping={shipping} total={total} />
// // // // // // //                     </div>
// // // // // // //                 </div>
// // // // // // //             </div>
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // };
// // // // // // //
// // // // // // // export default CartPage;
// // // // // //
// // // // // // // import React from 'react';
// // // // // // // import { FiMinus, FiPlus, FiX, FiShoppingCart } from 'react-icons/fi';
// // // // // // //
// // // // // // // const CartItem = ({ item, onUpdateQuantity, onRemove }) => (
// // // // // // //     <div className="flex items-center py-4 border-b border-gray-200">
// // // // // // //         <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
// // // // // // //         <div className="flex-grow">
// // // // // // //             <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
// // // // // // //             <p className="text-gray-600">${item.price.toFixed(2)}</p>
// // // // // // //         </div>
// // // // // // //         <div className="flex items-center">
// // // // // // //             <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full hover:bg-gray-100">
// // // // // // //                 <FiMinus className="text-indigo-600" />
// // // // // // //             </button>
// // // // // // //             <span className="mx-2 font-semibold">{item.quantity}</span>
// // // // // // //             <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full hover:bg-gray-100">
// // // // // // //                 <FiPlus className="text-indigo-600" />
// // // // // // //             </button>
// // // // // // //         </div>
// // // // // // //         <button onClick={() => onRemove(item.id)} className="ml-4 p-1 rounded-full hover:bg-gray-100">
// // // // // // //             <FiX className="text-red-500" />
// // // // // // //         </button>
// // // // // // //     </div>
// // // // // // // );
// // // // // // //
// // // // // // // const CartPage = () => {
// // // // // // //     // This is dummy data. In a real application, you'd fetch this from your state management solution or API
// // // // // // //     const [cartItems, setCartItems] = React.useState([
// // // // // // //         { id: 1, name: "Product 1", price: 19.99, quantity: 2, image: "https://via.placeholder.com/150" },
// // // // // // //         { id: 2, name: "Product 2", price: 29.99, quantity: 1, image: "https://via.placeholder.com/150" },
// // // // // // //     ]);
// // // // // // //
// // // // // // //     const updateQuantity = (id, newQuantity) => {
// // // // // // //         if (newQuantity >= 1) {
// // // // // // //             setCartItems(cartItems.map(item =>
// // // // // // //                 item.id === id ? { ...item, quantity: newQuantity } : item
// // // // // // //             ));
// // // // // // //         }
// // // // // // //     };
// // // // // // //
// // // // // // //     const removeItem = (id) => {
// // // // // // //         setCartItems(cartItems.filter(item => item.id !== id));
// // // // // // //     };
// // // // // // //
// // // // // // //     const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
// // // // // // //
// // // // // // //     return (
// // // // // // //         <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
// // // // // // //             <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
// // // // // // //                 <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
// // // // // // //                     <FiShoppingCart className="mr-2 text-indigo-600" />
// // // // // // //                     Your Cart
// // // // // // //                 </h1>
// // // // // // //                 {cartItems.length === 0 ? (
// // // // // // //                     <p className="text-gray-600 text-center py-4">Your cart is empty</p>
// // // // // // //                 ) : (
// // // // // // //                     <>
// // // // // // //                         {cartItems.map(item => (
// // // // // // //                             <CartItem
// // // // // // //                                 key={item.id}
// // // // // // //                                 item={item}
// // // // // // //                                 onUpdateQuantity={updateQuantity}
// // // // // // //                                 onRemove={removeItem}
// // // // // // //                             />
// // // // // // //                         ))}
// // // // // // //                         <div className="mt-8 flex justify-between items-center">
// // // // // // //                             <span className="text-xl font-semibold text-gray-800">Total:</span>
// // // // // // //                             <span className="text-2xl font-bold text-indigo-600">${total.toFixed(2)}</span>
// // // // // // //                         </div>
// // // // // // //                         <button className="mt-8 w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition duration-300 ease-in-out">
// // // // // // //                             Proceed to Checkout
// // // // // // //                         </button>
// // // // // // //                     </>
// // // // // // //                 )}
// // // // // // //             </div>
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // };
// // // // // // //
// // // // // // // export default CartPage;
// // // // // // // // import React from 'react';
// // // // // // // // import { FaTrashAlt, FaHeart } from 'react-icons/fa';
// // // // // // // // import { Link } from 'react-router-dom';
// // // // // // // //
// // // // // // // // const FullScreenCartPage = () => {
// // // // // // // //     const cartItems = [
// // // // // // // //         {
// // // // // // // //             id: 1,
// // // // // // // //             name: 'Diamond Ring',
// // // // // // // //             image: 'https://via.placeholder.com/150',
// // // // // // // //             price: 500,
// // // // // // // //             quantity: 1,
// // // // // // // //         },
// // // // // // // //         {
// // // // // // // //             id: 2,
// // // // // // // //             name: 'Gold Necklace',
// // // // // // // //             image: 'https://via.placeholder.com/150',
// // // // // // // //             price: 1200,
// // // // // // // //             quantity: 2,
// // // // // // // //         },
// // // // // // // //     ];
// // // // // // // //
// // // // // // // //     const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
// // // // // // // //
// // // // // // // //     return (
// // // // // // // //         <div className="bg-background min-h-screen flex flex-col">
// // // // // // // //             <div className="flex-grow overflow-auto">
// // // // // // // //                 <div className="container mx-auto max-w-6xl p-6">
// // // // // // // //                     <h2 className="text-4xl font-bold text-primary mb-6">Your Cart</h2>
// // // // // // // //
// // // // // // // //                     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
// // // // // // // //                         {cartItems.length > 0 ? (
// // // // // // // //                             cartItems.map((item) => (
// // // // // // // //                                 <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg border border-border">
// // // // // // // //                                     <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-lg mb-4" />
// // // // // // // //                                     <h3 className="text-xl font-semibold text-text mb-2">{item.name}</h3>
// // // // // // // //                                     <p className="text-lg text-text-muted mb-2">Price: ${item.price}</p>
// // // // // // // //                                     <p className="text-lg text-text-muted mb-4">Quantity: {item.quantity}</p>
// // // // // // // //                                     <div className="flex justify-between items-center">
// // // // // // // //                                         <button className="text-error hover:text-red-700">
// // // // // // // //                                             <FaTrashAlt size={20} />
// // // // // // // //                                         </button>
// // // // // // // //                                         <button className="text-accent hover:text-accent-light">
// // // // // // // //                                             <FaHeart size={20} />
// // // // // // // //                                         </button>
// // // // // // // //                                     </div>
// // // // // // // //                                 </div>
// // // // // // // //                             ))
// // // // // // // //                         ) : (
// // // // // // // //                             <p className="text-center text-text-muted">Your cart is empty.</p>
// // // // // // // //                         )}
// // // // // // // //                     </div>
// // // // // // // //                 </div>
// // // // // // // //             </div>
// // // // // // // //
// // // // // // // //             {/* Floating Summary Panel */}
// // // // // // // //             <div className="bg-white border-t border-border shadow-lg p-6 flex flex-col items-center">
// // // // // // // //                 <h3 className="text-2xl font-bold text-primary mb-4">Order Summary</h3>
// // // // // // // //                 <div className="flex flex-col w-full max-w-md">
// // // // // // // //                     <div className="flex justify-between mb-4">
// // // // // // // //                         <span className="text-lg text-text-muted">Subtotal:</span>
// // // // // // // //                         <span className="text-lg text-text">${totalPrice.toFixed(2)}</span>
// // // // // // // //                     </div>
// // // // // // // //                     <div className="flex justify-between mb-4">
// // // // // // // //                         <span className="text-lg text-text-muted">Shipping:</span>
// // // // // // // //                         <span className="text-lg text-text">$25.00</span>
// // // // // // // //                     </div>
// // // // // // // //                     <div className="flex justify-between mb-4">
// // // // // // // //                         <span className="text-lg text-text-muted">Tax:</span>
// // // // // // // //                         <span className="text-lg text-text">$110.00</span>
// // // // // // // //                     </div>
// // // // // // // //                     <div className="flex justify-between text-xl font-bold mb-4">
// // // // // // // //                         <span>Total:</span>
// // // // // // // //                         <span>${(totalPrice + 25 + 110).toFixed(2)}</span>
// // // // // // // //                     </div>
// // // // // // // //                     <Link to="/checkout">
// // // // // // // //                         <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark">
// // // // // // // //                             Proceed to Checkout
// // // // // // // //                         </button>
// // // // // // // //                     </Link>
// // // // // // // //                 </div>
// // // // // // // //             </div>
// // // // // // // //         </div>
// // // // // // // //     );
// // // // // // // // };
// // // // // // // //
// // // // // // // // export default FullScreenCartPage;
// // // // // // //
// // // // // // // // import React from 'react';
// // // // // // // // import { FaTrashAlt, FaHeart } from 'react-icons/fa';
// // // // // // // // import { Link } from 'react-router-dom';
// // // // // // // //
// // // // // // // // const CardBasedCartPage = () => {
// // // // // // // //     const cartItems = [
// // // // // // // //         {
// // // // // // // //             id: 1,
// // // // // // // //             name: 'Diamond Ring',
// // // // // // // //             image: 'https://via.placeholder.com/150',
// // // // // // // //             price: 500,
// // // // // // // //             quantity: 1,
// // // // // // // //         },
// // // // // // // //         {
// // // // // // // //             id: 2,
// // // // // // // //             name: 'Gold Necklace',
// // // // // // // //             image: 'https://via.placeholder.com/150',
// // // // // // // //             price: 1200,
// // // // // // // //             quantity: 2,
// // // // // // // //         },
// // // // // // // //     ];
// // // // // // // //
// // // // // // // //     const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
// // // // // // // //
// // // // // // // //     return (
// // // // // // // //         <div className="bg-background min-h-screen flex flex-col lg:flex-row">
// // // // // // // //             <div className="flex-grow p-6">
// // // // // // // //                 <h2 className="text-3xl font-bold text-primary mb-6">Your Cart</h2>
// // // // // // // //
// // // // // // // //                 <div className="grid gap-6 lg:grid-cols-2">
// // // // // // // //                     {cartItems.length > 0 ? (
// // // // // // // //                         cartItems.map((item) => (
// // // // // // // //                             <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border border-border">
// // // // // // // //                                 <div className="flex items-center mb-4">
// // // // // // // //                                     <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-lg mr-4" />
// // // // // // // //                                     <div className="flex-grow">
// // // // // // // //                                         <h3 className="text-xl font-semibold text-text mb-2">{item.name}</h3>
// // // // // // // //                                         <p className="text-lg text-text-muted mb-2">Price: ${item.price}</p>
// // // // // // // //                                         <p className="text-lg text-text-muted">Quantity: {item.quantity}</p>
// // // // // // // //                                     </div>
// // // // // // // //                                     <div className="flex-shrink-0 flex flex-col items-center space-y-2">
// // // // // // // //                                         <button className="text-error hover:text-red-700">
// // // // // // // //                                             <FaTrashAlt size={20} />
// // // // // // // //                                         </button>
// // // // // // // //                                         <button className="text-accent hover:text-accent-light">
// // // // // // // //                                             <FaHeart size={20} />
// // // // // // // //                                         </button>
// // // // // // // //                                     </div>
// // // // // // // //                                 </div>
// // // // // // // //                             </div>
// // // // // // // //                         ))
// // // // // // // //                     ) : (
// // // // // // // //                         <p className="text-center text-text-muted">Your cart is empty.</p>
// // // // // // // //                     )}
// // // // // // // //                 </div>
// // // // // // // //             </div>
// // // // // // // //
// // // // // // // //             {/* Fixed Sidebar */}
// // // // // // // //             <div className="w-full lg:w-1/4 lg:sticky lg:top-0 bg-white border-l border-border p-6">
// // // // // // // //                 <h3 className="text-2xl font-bold text-primary mb-6">Order Summary</h3>
// // // // // // // //                 <div className="flex flex-col">
// // // // // // // //                     <div className="flex justify-between mb-4">
// // // // // // // //                         <span className="text-lg text-text-muted">Subtotal:</span>
// // // // // // // //                         <span className="text-lg text-text">${totalPrice.toFixed(2)}</span>
// // // // // // // //                     </div>
// // // // // // // //                     <div className="flex justify-between mb-4">
// // // // // // // //                         <span className="text-lg text-text-muted">Shipping:</span>
// // // // // // // //                         <span className="text-lg text-text">$25.00</span>
// // // // // // // //                     </div>
// // // // // // // //                     <div className="flex justify-between mb-4">
// // // // // // // //                         <span className="text-lg text-text-muted">Tax:</span>
// // // // // // // //                         <span className="text-lg text-text">$110.00</span>
// // // // // // // //                     </div>
// // // // // // // //                     <div className="flex justify-between text-xl font-bold mb-6">
// // // // // // // //                         <span>Total:</span>
// // // // // // // //                         <span>${(totalPrice + 25 + 110).toFixed(2)}</span>
// // // // // // // //                     </div>
// // // // // // // //                     <Link to="/checkout">
// // // // // // // //                         <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark">
// // // // // // // //                             Proceed to Checkout
// // // // // // // //                         </button>
// // // // // // // //                     </Link>
// // // // // // // //                 </div>
// // // // // // // //             </div>
// // // // // // // //         </div>
// // // // // // // //     );
// // // // // // // // };
// // // // // // // //
// // // // // // // // export default CardBasedCartPage;
// // // // // // //
// // // // // // // // import React from 'react';
// // // // // // // //
// // // // // // // // // Sample data for cart items
// // // // // // // // const cartItems = [
// // // // // // // //     { id: 1, image: '/path/to/image1.jpg', name: 'Product 1', price: 20, quantity: 2 },
// // // // // // // //     { id: 2, image: '/path/to/image2.jpg', name: 'Product 2', price: 35, quantity: 1 },
// // // // // // // //     // Add more items as needed
// // // // // // // // ];
// // // // // // // //
// // // // // // // // const CartPage = () => {
// // // // // // // //     const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
// // // // // // // //     const shipping = 5; // Example shipping cost
// // // // // // // //     const tax = (subtotal * 0.1).toFixed(2); // Example tax calculation
// // // // // // // //     const total = (subtotal + shipping + parseFloat(tax)).toFixed(2);
// // // // // // // //
// // // // // // // //     return (
// // // // // // // //         <div className="container mx-auto p-6">
// // // // // // // //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
// // // // // // // //                 {/* Cart Items Section */}
// // // // // // // //                 <div className="bg-white p-6 rounded-lg shadow-lg">
// // // // // // // //                     <h2 className="text-2xl font-semibold text-primary mb-4">Cart Items</h2>
// // // // // // // //                     {cartItems.length > 0 ? (
// // // // // // // //                         cartItems.map(item => (
// // // // // // // //                             <div key={item.id} className="flex items-center mb-4 border-b border-gray-200 pb-4">
// // // // // // // //                                 <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md mr-4" />
// // // // // // // //                                 <div className="flex-1">
// // // // // // // //                                     <h3 className="text-lg font-medium text-text">{item.name}</h3>
// // // // // // // //                                     <p className="text-gray-600">Price: ${item.price}</p>
// // // // // // // //                                     <p className="text-gray-600">Quantity: {item.quantity}</p>
// // // // // // // //                                 </div>
// // // // // // // //                                 <button className="text-red-500 hover:text-red-700 font-medium">Remove</button>
// // // // // // // //                             </div>
// // // // // // // //                         ))
// // // // // // // //                     ) : (
// // // // // // // //                         <p className="text-gray-500">Your cart is empty.</p>
// // // // // // // //                     )}
// // // // // // // //                 </div>
// // // // // // // //
// // // // // // // //                 {/* Order Summary Section */}
// // // // // // // //                 <div className="bg-white p-6 rounded-lg shadow-lg">
// // // // // // // //                     <h2 className="text-2xl font-semibold text-primary mb-4">Order Summary</h2>
// // // // // // // //                     <div className="space-y-4">
// // // // // // // //                         <div className="flex justify-between">
// // // // // // // //                             <span className="text-gray-700">Subtotal:</span>
// // // // // // // //                             <span className="text-text">${subtotal.toFixed(2)}</span>
// // // // // // // //                         </div>
// // // // // // // //                         <div className="flex justify-between">
// // // // // // // //                             <span className="text-gray-700">Shipping:</span>
// // // // // // // //                             <span className="text-text">${shipping.toFixed(2)}</span>
// // // // // // // //                         </div>
// // // // // // // //                         <div className="flex justify-between">
// // // // // // // //                             <span className="text-gray-700">Tax:</span>
// // // // // // // //                             <span className="text-text">${tax}</span>
// // // // // // // //                         </div>
// // // // // // // //                         <div className="flex justify-between border-t border-gray-300 pt-4">
// // // // // // // //                             <span className="font-semibold text-lg">Total:</span>
// // // // // // // //                             <span className="font-semibold text-lg text-text">${total}</span>
// // // // // // // //                         </div>
// // // // // // // //                     </div>
// // // // // // // //                     <button className="w-full mt-6 bg-primary text-white py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark">
// // // // // // // //                         Proceed to Checkout
// // // // // // // //                     </button>
// // // // // // // //                 </div>
// // // // // // // //             </div>
// // // // // // // //         </div>
// // // // // // // //     );
// // // // // // // // };
// // // // // // // //
// // // // // // // // export default CartPage;
// // // // // // // //
// // // // // // // // // import { Link } from 'react-router-dom';
// // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // import { FaTrashAlt, FaHeart, FaMinus, FaPlus } from 'react-icons/fa';
// // // // // // // // // import { HiOutlineShoppingBag } from '@heroicons/react/outline';
// // // // // // // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // // // // // //
// // // // // // // // // const CartPage = () => {
// // // // // // // // //     const [cartItems, setCartItems] = useState([
// // // // // // // // //         {
// // // // // // // // //             id: 1,
// // // // // // // // //             name: 'Diamond Ring',
// // // // // // // // //             image: 'https://via.placeholder.com/150',
// // // // // // // // //             price: 500,
// // // // // // // // //             quantity: 1,
// // // // // // // // //         },
// // // // // // // // //         {
// // // // // // // // //             id: 2,
// // // // // // // // //             name: 'Gold Necklace',
// // // // // // // // //             image: 'https://via.placeholder.com/150',
// // // // // // // // //             price: 1200,
// // // // // // // // //             quantity: 2,
// // // // // // // // //         },
// // // // // // // // //     ]);
// // // // // // // // //     const [promoCode, setPromoCode] = useState('');
// // // // // // // // //     const [showModal, setShowModal] = useState(false);
// // // // // // // // //     const [itemToRemove, setItemToRemove] = useState(null);
// // // // // // // // //
// // // // // // // // //     const handleQuantityChange = (id, delta) => {
// // // // // // // // //         setCartItems(cartItems.map(item =>
// // // // // // // // //             item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
// // // // // // // // //         ));
// // // // // // // // //     };
// // // // // // // // //
// // // // // // // // //     const handleRemoveItem = () => {
// // // // // // // // //         setCartItems(cartItems.filter(item => item.id !== itemToRemove.id));
// // // // // // // // //         setShowModal(false);
// // // // // // // // //     };
// // // // // // // // //
// // // // // // // // //     const handleMoveToWishlist = (id) => {
// // // // // // // // //         console.log(`Item with ID ${id} moved to wishlist`);
// // // // // // // // //     };
// // // // // // // // //
// // // // // // // // //     const handleApplyPromoCode = () => {
// // // // // // // // //         console.log(`Promo code applied: ${promoCode}`);
// // // // // // // // //     };
// // // // // // // // //
// // // // // // // // //     return (
// // // // // // // // //         <div className="bg-background min-h-screen p-4">
// // // // // // // // //             <div className="container mx-auto">
// // // // // // // // //                 <h2 className="text-3xl font-bold text-primary text-center mb-6">
// // // // // // // // //                     Shopping Cart
// // // // // // // // //                 </h2>
// // // // // // // // //
// // // // // // // // //                 <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
// // // // // // // // //                     {/* Cart Items */}
// // // // // // // // //                     <div className="col-span-12 lg:col-span-8">
// // // // // // // // //                         {cartItems.length > 0 ? (
// // // // // // // // //                             cartItems.map((item) => (
// // // // // // // // //                                 <motion.div
// // // // // // // // //                                     key={item.id}
// // // // // // // // //                                     className="bg-white p-4 rounded-lg shadow-md mb-4 grid grid-cols-1 sm:grid-cols-12 gap-4 border border-border shadow-shadow"
// // // // // // // // //                                     initial={{ opacity: 0, y: 20 }}
// // // // // // // // //                                     animate={{ opacity: 1, y: 0 }}
// // // // // // // // //                                     exit={{ opacity: 0, y: 20 }}
// // // // // // // // //                                     transition={{ duration: 0.3 }}
// // // // // // // // //                                 >
// // // // // // // // //                                     <div className="sm:col-span-3">
// // // // // // // // //                                         <img src={item.image} alt={item.name} className="rounded-lg w-full" />
// // // // // // // // //                                     </div>
// // // // // // // // //                                     <div className="sm:col-span-5">
// // // // // // // // //                                         <h3 className="text-xl font-semibold text-text">{item.name}</h3>
// // // // // // // // //                                         <p className="text-lg font-medium text-text-muted">Price: ${item.price}</p>
// // // // // // // // //                                         <div className="flex items-center mt-2">
// // // // // // // // //                                             <button
// // // // // // // // //                                                 onClick={() => handleQuantityChange(item.id, -1)}
// // // // // // // // //                                                 className="text-text-muted hover:text-primary"
// // // // // // // // //                                             >
// // // // // // // // //                                                 <FaMinus />
// // // // // // // // //                                             </button>
// // // // // // // // //                                             <span className="mx-4 text-lg font-medium text-text">{item.quantity}</span>
// // // // // // // // //                                             <button
// // // // // // // // //                                                 onClick={() => handleQuantityChange(item.id, 1)}
// // // // // // // // //                                                 className="text-text-muted hover:text-primary"
// // // // // // // // //                                             >
// // // // // // // // //                                                 <FaPlus />
// // // // // // // // //                                             </button>
// // // // // // // // //                                         </div>
// // // // // // // // //                                     </div>
// // // // // // // // //                                     <div className="sm:col-span-4 flex items-center justify-between sm:justify-end">
// // // // // // // // //                                         <p className="text-xl font-bold text-text">
// // // // // // // // //                                             Total: ${(item.price * item.quantity).toFixed(2)}
// // // // // // // // //                                         </p>
// // // // // // // // //                                         <div className="flex items-center">
// // // // // // // // //                                             <button
// // // // // // // // //                                                 onClick={() => { setItemToRemove(item); setShowModal(true); }}
// // // // // // // // //                                                 className="ml-4 text-error hover:text-red-700"
// // // // // // // // //                                             >
// // // // // // // // //                                                 <FaTrashAlt size={20} />
// // // // // // // // //                                             </button>
// // // // // // // // //                                             <button
// // // // // // // // //                                                 onClick={() => handleMoveToWishlist(item.id)}
// // // // // // // // //                                                 className="ml-4 text-accent hover:text-accent-light"
// // // // // // // // //                                             >
// // // // // // // // //                                                 <FaHeart size={20} />
// // // // // // // // //                                             </button>
// // // // // // // // //                                         </div>
// // // // // // // // //                                     </div>
// // // // // // // // //                                 </motion.div>
// // // // // // // // //                             ))
// // // // // // // // //                         ) : (
// // // // // // // // //                             <div className="bg-white p-6 rounded-lg shadow-md text-center">
// // // // // // // // //                                 <HiOutlineShoppingBag className="w-16 h-16 mx-auto text-text-muted mb-4" />
// // // // // // // // //                                 <p className="text-xl font-semibold text-text">
// // // // // // // // //                                     Your cart is currently empty.
// // // // // // // // //                                 </p>
// // // // // // // // //                             </div>
// // // // // // // // //                         )}
// // // // // // // // //                     </div>
// // // // // // // // //
// // // // // // // // //                     {/* Order Summary */}
// // // // // // // // //                     <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-lg shadow-md border border-border shadow-shadow">
// // // // // // // // //                         <h3 className="text-2xl font-semibold text-text mb-4">Order Summary</h3>
// // // // // // // // //                         <div className="flex justify-between mb-2">
// // // // // // // // //                             <span className="text-lg font-medium text-text-muted">Subtotal</span>
// // // // // // // // //                             <span className="text-lg font-medium text-text">
// // // // // // // // //                 ${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
// // // // // // // // //               </span>
// // // // // // // // //                         </div>
// // // // // // // // //                         <div className="flex justify-between mb-2">
// // // // // // // // //                             <span className="text-lg font-medium text-text-muted">Shipping</span>
// // // // // // // // //                             <span className="text-lg font-medium text-text">$25.00</span>
// // // // // // // // //                         </div>
// // // // // // // // //                         <div className="flex justify-between mb-4">
// // // // // // // // //                             <span className="text-lg font-medium text-text-muted">Tax</span>
// // // // // // // // //                             <span className="text-lg font-medium text-text">$110.00</span>
// // // // // // // // //                         </div>
// // // // // // // // //                         <hr className="mb-4 border-border" />
// // // // // // // // //                         <div className="flex justify-between text-xl font-bold text-text mb-4">
// // // // // // // // //                             <span>Total</span>
// // // // // // // // //                             <span>
// // // // // // // // //                 ${(
// // // // // // // // //                                 cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) +
// // // // // // // // //                                 25 +
// // // // // // // // //                                 110
// // // // // // // // //                             ).toFixed(2)}
// // // // // // // // //               </span>
// // // // // // // // //                         </div>
// // // // // // // // //                         <div className="flex items-center mb-4">
// // // // // // // // //                             <input
// // // // // // // // //                                 type="text"
// // // // // // // // //                                 className="border border-border p-2 rounded-lg flex-1"
// // // // // // // // //                                 placeholder="Promo Code"
// // // // // // // // //                                 value={promoCode}
// // // // // // // // //                                 onChange={(e) => setPromoCode(e.target.value)}
// // // // // // // // //                             />
// // // // // // // // //                             <button
// // // // // // // // //                                 onClick={handleApplyPromoCode}
// // // // // // // // //                                 className="ml-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
// // // // // // // // //                             >
// // // // // // // // //                                 Apply
// // // // // // // // //                             </button>
// // // // // // // // //                         </div>
// // // // // // // // //                         <Link to="/checkout">
// // // // // // // // //                             <button className="w-full mt-6 bg-primary text-white py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark">
// // // // // // // // //                                 Proceed to Checkout
// // // // // // // // //                             </button>
// // // // // // // // //                         </Link>
// // // // // // // // //                     </div>
// // // // // // // // //                 </div>
// // // // // // // // //
// // // // // // // // //                 {/* Remove Item Confirmation Modal */}
// // // // // // // // //                 <AnimatePresence>
// // // // // // // // //                     {showModal && (
// // // // // // // // //                         <motion.div
// // // // // // // // //                             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
// // // // // // // // //                             initial={{ opacity: 0 }}
// // // // // // // // //                             animate={{ opacity: 1 }}
// // // // // // // // //                             exit={{ opacity: 0 }}
// // // // // // // // //                             transition={{ duration: 0.3 }}
// // // // // // // // //                         >
// // // // // // // // //                             <motion.div
// // // // // // // // //                                 className="bg-white p-6 rounded-lg shadow-lg border border-border shadow-shadow"
// // // // // // // // //                                 initial={{ y: '-50%', opacity: 0 }}
// // // // // // // // //                                 animate={{ y: '0%', opacity: 1 }}
// // // // // // // // //                                 exit={{ y: '50%', opacity: 0 }}
// // // // // // // // //                                 transition={{ duration: 0.3 }}
// // // // // // // // //                             >
// // // // // // // // //                                 <h3 className="text-xl font-semibold text-text mb-4">
// // // // // // // // //                                     Remove Item
// // // // // // // // //                                 </h3>
// // // // // // // // //                                 <p className="text-text-muted mb-6">
// // // // // // // // //                                     Are you sure you want to remove <strong>{itemToRemove?.name}</strong> from your cart?
// // // // // // // // //                                 </p>
// // // // // // // // //                                 <div className="flex justify-end">
// // // // // // // // //                                     <button
// // // // // // // // //                                         onClick={() => setShowModal(false)}
// // // // // // // // //                                         className="bg-gray-300 text-text-muted py-2 px-4 rounded-lg mr-4"
// // // // // // // // //                                     >
// // // // // // // // //                                         Cancel
// // // // // // // // //                                     </button>
// // // // // // // // //                                     <button
// // // // // // // // //                                         onClick={handleRemoveItem}
// // // // // // // // //                                         className="bg-error text-white py-2 px-4 rounded-lg"
// // // // // // // // //                                     >
// // // // // // // // //                                         Remove
// // // // // // // // //                                     </button>
// // // // // // // // //                                 </div>
// // // // // // // // //                             </motion.div>
// // // // // // // // //                         </motion.div>
// // // // // // // // //                     )}
// // // // // // // // //                 </AnimatePresence>
// // // // // // // // //             </div>
// // // // // // // // //         </div>
// // // // // // // // //     );
// // // // // // // // // };
// // // // // // // // //
// // // // // // // // // export default CartPage;
// // // // // // // //
// // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // import { FaTrashAlt, FaHeart, FaMinus, FaPlus } from 'react-icons/fa';
// // // // // // // // // import { HiOutlineShoppingBag } from '@heroicons/react/outline';
// // // // // // // // // import { motion, AnimatePresence } from 'framer-motion';
// // // // // // // // //
// // // // // // // // // const CartPage = () => {
// // // // // // // // //     const [cartItems, setCartItems] = useState([
// // // // // // // // //         {
// // // // // // // // //             id: 1,
// // // // // // // // //             name: 'Diamond Ring',
// // // // // // // // //             image: 'https://via.placeholder.com/150',
// // // // // // // // //             price: 500,
// // // // // // // // //             quantity: 1,
// // // // // // // // //         },
// // // // // // // // //         {
// // // // // // // // //             id: 2,
// // // // // // // // //             name: 'Gold Necklace',
// // // // // // // // //             image: 'https://via.placeholder.com/150',
// // // // // // // // //             price: 1200,
// // // // // // // // //             quantity: 2,
// // // // // // // // //         },
// // // // // // // // //     ]);
// // // // // // // // //     const [promoCode, setPromoCode] = useState('');
// // // // // // // // //     const [showModal, setShowModal] = useState(false);
// // // // // // // // //     const [itemToRemove, setItemToRemove] = useState(null);
// // // // // // // // //
// // // // // // // // //     const handleQuantityChange = (id, delta) => {
// // // // // // // // //         setCartItems(cartItems.map(item =>
// // // // // // // // //             item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
// // // // // // // // //         ));
// // // // // // // // //     };
// // // // // // // // //
// // // // // // // // //     const handleRemoveItem = () => {
// // // // // // // // //         setCartItems(cartItems.filter(item => item.id !== itemToRemove.id));
// // // // // // // // //         setShowModal(false);
// // // // // // // // //     };
// // // // // // // // //
// // // // // // // // //     const handleMoveToWishlist = (id) => {
// // // // // // // // //         console.log(`Item with ID ${id} moved to wishlist`);
// // // // // // // // //     };
// // // // // // // // //
// // // // // // // // //     const handleApplyPromoCode = () => {
// // // // // // // // //         console.log(`Promo code applied: ${promoCode}`);
// // // // // // // // //     };
// // // // // // // // //
// // // // // // // // //     return (
// // // // // // // // //         <div className="bg-background min-h-screen p-4">
// // // // // // // // //             <div className="container mx-auto">
// // // // // // // // //                 <h2 className="text-3xl font-bold text-primary text-center mb-6">
// // // // // // // // //                     Shopping Cart
// // // // // // // // //                 </h2>
// // // // // // // // //
// // // // // // // // //                 <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
// // // // // // // // //                     {/* Cart Items */}
// // // // // // // // //                     <div className="col-span-12 lg:col-span-8">
// // // // // // // // //                         {cartItems.length > 0 ? (
// // // // // // // // //                             cartItems.map((item) => (
// // // // // // // // //                                 <motion.div
// // // // // // // // //                                     key={item.id}
// // // // // // // // //                                     className="bg-white p-4 rounded-lg shadow-md mb-4 grid grid-cols-1 sm:grid-cols-12 gap-4 border border-border shadow-shadow"
// // // // // // // // //                                     initial={{ opacity: 0, y: 20 }}
// // // // // // // // //                                     animate={{ opacity: 1, y: 0 }}
// // // // // // // // //                                     exit={{ opacity: 0, y: 20 }}
// // // // // // // // //                                     transition={{ duration: 0.3 }}
// // // // // // // // //                                 >
// // // // // // // // //                                     <div className="sm:col-span-3">
// // // // // // // // //                                         <img src={item.image} alt={item.name} className="rounded-lg w-full" />
// // // // // // // // //                                     </div>
// // // // // // // // //                                     <div className="sm:col-span-5">
// // // // // // // // //                                         <h3 className="text-xl font-semibold text-text">{item.name}</h3>
// // // // // // // // //                                         <p className="text-lg font-medium text-text-muted">Price: ${item.price}</p>
// // // // // // // // //                                         <div className="flex items-center mt-2">
// // // // // // // // //                                             <button
// // // // // // // // //                                                 onClick={() => handleQuantityChange(item.id, -1)}
// // // // // // // // //                                                 className="text-text-muted hover:text-primary"
// // // // // // // // //                                             >
// // // // // // // // //                                                 <FaMinus />
// // // // // // // // //                                             </button>
// // // // // // // // //                                             <span className="mx-4 text-lg font-medium text-text">{item.quantity}</span>
// // // // // // // // //                                             <button
// // // // // // // // //                                                 onClick={() => handleQuantityChange(item.id, 1)}
// // // // // // // // //                                                 className="text-text-muted hover:text-primary"
// // // // // // // // //                                             >
// // // // // // // // //                                                 <FaPlus />
// // // // // // // // //                                             </button>
// // // // // // // // //                                         </div>
// // // // // // // // //                                     </div>
// // // // // // // // //                                     <div className="sm:col-span-4 flex items-center justify-between sm:justify-end">
// // // // // // // // //                                         <p className="text-xl font-bold text-text">
// // // // // // // // //                                             Total: ${(item.price * item.quantity).toFixed(2)}
// // // // // // // // //                                         </p>
// // // // // // // // //                                         <div className="flex items-center">
// // // // // // // // //                                             <button
// // // // // // // // //                                                 onClick={() => { setItemToRemove(item); setShowModal(true); }}
// // // // // // // // //                                                 className="ml-4 text-error hover:text-red-700"
// // // // // // // // //                                             >
// // // // // // // // //                                                 <FaTrashAlt size={20} />
// // // // // // // // //                                             </button>
// // // // // // // // //                                             <button
// // // // // // // // //                                                 onClick={() => handleMoveToWishlist(item.id)}
// // // // // // // // //                                                 className="ml-4 text-accent hover:text-accent-light"
// // // // // // // // //                                             >
// // // // // // // // //                                                 <FaHeart size={20} />
// // // // // // // // //                                             </button>
// // // // // // // // //                                         </div>
// // // // // // // // //                                     </div>
// // // // // // // // //                                 </motion.div>
// // // // // // // // //                             ))
// // // // // // // // //                         ) : (
// // // // // // // // //                             <div className="bg-white p-6 rounded-lg shadow-md text-center">
// // // // // // // // //                                 <HiOutlineShoppingBag className="w-16 h-16 mx-auto text-text-muted mb-4" />
// // // // // // // // //                                 <p className="text-xl font-semibold text-text">
// // // // // // // // //                                     Your cart is currently empty.
// // // // // // // // //                                 </p>
// // // // // // // // //                             </div>
// // // // // // // // //                         )}
// // // // // // // // //                     </div>
// // // // // // // // //
// // // // // // // // //                     {/* Order Summary */}
// // // // // // // // //                     <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-lg shadow-md border border-border shadow-shadow">
// // // // // // // // //                         <h3 className="text-2xl font-semibold text-text mb-4">Order Summary</h3>
// // // // // // // // //                         <div className="flex justify-between mb-2">
// // // // // // // // //                             <span className="text-lg font-medium text-text-muted">Subtotal</span>
// // // // // // // // //                             <span className="text-lg font-medium text-text">
// // // // // // // // //                 ${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
// // // // // // // // //               </span>
// // // // // // // // //                         </div>
// // // // // // // // //                         <div className="flex justify-between mb-2">
// // // // // // // // //                             <span className="text-lg font-medium text-text-muted">Shipping</span>
// // // // // // // // //                             <span className="text-lg font-medium text-text">$25.00</span>
// // // // // // // // //                         </div>
// // // // // // // // //                         <div className="flex justify-between mb-4">
// // // // // // // // //                             <span className="text-lg font-medium text-text-muted">Tax</span>
// // // // // // // // //                             <span className="text-lg font-medium text-text">$110.00</span>
// // // // // // // // //                         </div>
// // // // // // // // //                         <hr className="mb-4 border-border" />
// // // // // // // // //                         <div className="flex justify-between text-xl font-bold text-text mb-4">
// // // // // // // // //                             <span>Total</span>
// // // // // // // // //                             <span>
// // // // // // // // //                 ${(
// // // // // // // // //                                 cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) +
// // // // // // // // //                                 25 +
// // // // // // // // //                                 110
// // // // // // // // //                             ).toFixed(2)}
// // // // // // // // //               </span>
// // // // // // // // //                         </div>
// // // // // // // // //                         <div className="flex items-center mb-4">
// // // // // // // // //                             <input
// // // // // // // // //                                 type="text"
// // // // // // // // //                                 className="border border-border p-2 rounded-lg flex-1"
// // // // // // // // //                                 placeholder="Promo Code"
// // // // // // // // //                                 value={promoCode}
// // // // // // // // //                                 onChange={(e) => setPromoCode(e.target.value)}
// // // // // // // // //                             />
// // // // // // // // //                             <button
// // // // // // // // //                                 onClick={handleApplyPromoCode}
// // // // // // // // //                                 className="ml-4 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark"
// // // // // // // // //                             >
// // // // // // // // //                                 Apply
// // // // // // // // //                             </button>
// // // // // // // // //                         </div>
// // // // // // // // //                         <button className="w-full mt-6 bg-primary text-white py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark">
// // // // // // // // //                             Proceed to Checkout
// // // // // // // // //                         </button>
// // // // // // // // //                     </div>
// // // // // // // // //                 </div>
// // // // // // // // //
// // // // // // // // //                 {/* Remove Item Confirmation Modal */}
// // // // // // // // //                 <AnimatePresence>
// // // // // // // // //                     {showModal && (
// // // // // // // // //                         <motion.div
// // // // // // // // //                             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
// // // // // // // // //                             initial={{ opacity: 0 }}
// // // // // // // // //                             animate={{ opacity: 1 }}
// // // // // // // // //                             exit={{ opacity: 0 }}
// // // // // // // // //                             transition={{ duration: 0.3 }}
// // // // // // // // //                         >
// // // // // // // // //                             <motion.div
// // // // // // // // //                                 className="bg-white p-6 rounded-lg shadow-lg border border-border shadow-shadow"
// // // // // // // // //                                 initial={{ y: '-50%', opacity: 0 }}
// // // // // // // // //                                 animate={{ y: '0%', opacity: 1 }}
// // // // // // // // //                                 exit={{ y: '50%', opacity: 0 }}
// // // // // // // // //                                 transition={{ duration: 0.3 }}
// // // // // // // // //                             >
// // // // // // // // //                                 <h3 className="text-xl font-semibold text-text mb-4">
// // // // // // // // //                                     Remove Item
// // // // // // // // //                                 </h3>
// // // // // // // // //                                 <p className="text-text-muted mb-6">
// // // // // // // // //                                     Are you sure you want to remove <strong>{itemToRemove?.name}</strong> from your cart?
// // // // // // // // //                                 </p>
// // // // // // // // //                                 <div className="flex justify-end">
// // // // // // // // //                                     <button
// // // // // // // // //                                         onClick={() => setShowModal(false)}
// // // // // // // // //                                         className="bg-gray-200 text-text-muted py-2 px-4 rounded-lg mr-4 hover:bg-gray-300"
// // // // // // // // //                                     >
// // // // // // // // //                                         Cancel
// // // // // // // // //                                     </button>
// // // // // // // // //                                     <button
// // // // // // // // //                                         onClick={handleRemoveItem}
// // // // // // // // //                                         className="bg-error text-white py-2 px-4 rounded-lg hover:bg-error-dark"
// // // // // // // // //                                     >
// // // // // // // // //                                         Remove
// // // // // // // // //                                     </button>
// // // // // // // // //                                 </div>
// // // // // // // // //                             </motion.div>
// // // // // // // // //                         </motion.div>
// // // // // // // // //                     )}
// // // // // // // // //                 </AnimatePresence>
// // // // // // // // //             </div>
// // // // // // // // //         </div>
// // // // // // // // //     );
// // // // // // // // // };
// // // // // // // // //
// // // // // // // // // export default CartPage;
// // // // // // // //
// // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
// // // // // // // // // import { Divider, Button, TextField } from '@mui/material';
// // // // // // // // // import { ShoppingCart, CreditCard } from '@mui/icons-material';
// // // // // // // // //
// // // // // // // // // const CartItem = ({ item, updateQuantity, removeItem }) => (
// // // // // // // // //     <div className="flex items-center justify-between p-4 border-b">
// // // // // // // // //         <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
// // // // // // // // //         <div className="flex-grow ml-4">
// // // // // // // // //             <h3 className="text-lg font-semibold">{item.name}</h3>
// // // // // // // // //             <p className="text-gray-600">${item.price.toFixed(2)}</p>
// // // // // // // // //         </div>
// // // // // // // // //         <div className="flex items-center">
// // // // // // // // //             <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1">
// // // // // // // // //                 <FaMinus className="text-gray-600" />
// // // // // // // // //             </button>
// // // // // // // // //             <span className="mx-2">{item.quantity}</span>
// // // // // // // // //             <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1">
// // // // // // // // //                 <FaPlus className="text-gray-600" />
// // // // // // // // //             </button>
// // // // // // // // //         </div>
// // // // // // // // //         <button onClick={() => removeItem(item.id)} className="ml-4 text-red-500">
// // // // // // // // //             <FaTrash />
// // // // // // // // //         </button>
// // // // // // // // //     </div>
// // // // // // // // // );
// // // // // // // // //
// // // // // // // // // const CartPage = () => {
// // // // // // // // //     const [cartItems, setCartItems] = useState([
// // // // // // // // //         { id: 1, name: 'Diamond Ring', price: 999.99, quantity: 1, image: '/api/placeholder/100/100' },
// // // // // // // // //         { id: 2, name: 'Gold Necklace', price: 599.99, quantity: 2, image: '/api/placeholder/100/100' },
// // // // // // // // //     ]);
// // // // // // // // //
// // // // // // // // //     const updateQuantity = (id, newQuantity) => {
// // // // // // // // //         if (newQuantity > 0) {
// // // // // // // // //             setCartItems(cartItems.map(item =>
// // // // // // // // //                 item.id === id ? { ...item, quantity: newQuantity } : item
// // // // // // // // //             ));
// // // // // // // // //         }
// // // // // // // // //     };
// // // // // // // // //
// // // // // // // // //     const removeItem = (id) => {
// // // // // // // // //         setCartItems(cartItems.filter(item => item.id !== id));
// // // // // // // // //     };
// // // // // // // // //
// // // // // // // // //     const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
// // // // // // // // //
// // // // // // // // //     return (
// // // // // // // // //         <div className="container mx-auto px-4 py-8">
// // // // // // // // //             <h1 className="text-3xl font-bold mb-8 flex items-center">
// // // // // // // // //                 <ShoppingCart className="mr-2" /> Your Cart
// // // // // // // // //             </h1>
// // // // // // // // //             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// // // // // // // // //                 <div className="md:col-span-2">
// // // // // // // // //                     {cartItems.map(item => (
// // // // // // // // //                         <CartItem
// // // // // // // // //                             key={item.id}
// // // // // // // // //                             item={item}
// // // // // // // // //                             updateQuantity={updateQuantity}
// // // // // // // // //                             removeItem={removeItem}
// // // // // // // // //                         />
// // // // // // // // //                     ))}
// // // // // // // // //                 </div>
// // // // // // // // //                 <div className="md:col-span-1">
// // // // // // // // //                     <div className="bg-white p-6 rounded-lg shadow-md">
// // // // // // // // //                         <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
// // // // // // // // //                         <Divider className="my-4" />
// // // // // // // // //                         <div className="flex justify-between mb-2">
// // // // // // // // //                             <span>Subtotal:</span>
// // // // // // // // //                             <span>${total.toFixed(2)}</span>
// // // // // // // // //                         </div>
// // // // // // // // //                         <div className="flex justify-between mb-2">
// // // // // // // // //                             <span>Shipping:</span>
// // // // // // // // //                             <span>$10.00</span>
// // // // // // // // //                         </div>
// // // // // // // // //                         <Divider className="my-4" />
// // // // // // // // //                         <div className="flex justify-between text-xl font-semibold">
// // // // // // // // //                             <span>Total:</span>
// // // // // // // // //                             <span>${(total + 10).toFixed(2)}</span>
// // // // // // // // //                         </div>
// // // // // // // // //                         <TextField
// // // // // // // // //                             label="Promo Code"
// // // // // // // // //                             variant="outlined"
// // // // // // // // //                             fullWidth
// // // // // // // // //                             className="mt-4"
// // // // // // // // //                         />
// // // // // // // // //                         <Button
// // // // // // // // //                             variant="contained"
// // // // // // // // //                             color="primary"
// // // // // // // // //                             fullWidth
// // // // // // // // //                             className="mt-4"
// // // // // // // // //                             startIcon={<CreditCard />}
// // // // // // // // //                         >
// // // // // // // // //                             Proceed to Checkout
// // // // // // // // //                         </Button>
// // // // // // // // //                     </div>
// // // // // // // // //                 </div>
// // // // // // // // //             </div>
// // // // // // // // //         </div>
// // // // // // // // //     );
// // // // // // // // // };
// // // // // // // // //
// // // // // // // // // export default CartPage;