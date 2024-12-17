import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import ProductCard from "../components/ProductCard";
import api from "../Services/api";

const Wishlist = () => {

    const MIDDLE_BASE_URL = 'api/v1/client';
    const [wishlist, setWishlist] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await api.get(`${MIDDLE_BASE_URL}/wishlists/list_items/`);
                setWishlist(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, []);
    if (isLoading) {
        return <div className="text-center py-10">Loading wishlist...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }

    if (!wishlist || wishlist[0].length === 0) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
                <Link to="/" className="text-primary hover:text-primary-dark">
                    Continue Shopping
                </Link>
            </div>
        );
    }



    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/*<AnimatePresence>*/}
                    {wishlist.map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                {/*</AnimatePresence>*/}
            </div>
        </div>
    );
};

export default Wishlist;

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { AnimatePresence } from 'framer-motion';
// import { fetchWishlist } from "../store/Slices/WishlistSlice";
// import ProductCard from "../components/ProductCard";
//
// const Wishlist = () => {
//     const dispatch = useDispatch();
//     const wishlistItems = useSelector(state => state.wishlist.items);
//     const isLoading = useSelector(state => state.wishlist.loading);
//     const error = useSelector(state => state.wishlist.error);
//
//     useEffect(() => {
//         dispatch(fetchWishlist());
//     }, [dispatch]);
//
//     if (isLoading) {
//         return <div className="text-center py-10">Loading wishlist...</div>;
//     }
//
//     if (error) {
//         return <div className="text-center py-10 text-red-500">Error: {error}</div>;
//     }
//
//     if (wishlistItems.length === 0) {
//         return (
//             <div className="text-center py-10">
//                 <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
//                 <Link to="/" className="text-primary hover:text-primary-dark">
//                     Continue Shopping
//                 </Link>
//             </div>
//         );
//     }
//
//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 <AnimatePresence>
//                     {wishlistItems.map((item) => (
//                         <ProductCard key={item.id} item={item} />
//                         ))}
//                 </AnimatePresence>
//             </div>
//         </div>
//     );
// };
//
// export default Wishlist;
// // import React, { useEffect } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { Link } from 'react-router-dom';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import {fetchWishlist} from "../store/Slices/WishlistSlice";
// // import WishlistButton from "../components/WishlistButton";
// //
// // const Wishlist = () => {
// //     const dispatch = useDispatch();
// //     const wishlistItems = useSelector(state => state.wishlist.items);
// //     const isLoading = useSelector(state => state.wishlist.loading);
// //     const error = useSelector(state => state.wishlist.error);
// //
// //     useEffect(() => {
// //         dispatch(fetchWishlist());
// //     }, [dispatch]);
// //
// //     if (isLoading) {
// //         return <div className="text-center py-10">Loading wishlist...</div>;
// //     }
// //
// //     if (error) {
// //         return <div className="text-center py-10 text-red-500">Error: {error}</div>;
// //     }
// //
// //     if (wishlistItems.length === 0) {
// //         return (
// //             <div className="text-center py-10">
// //                 <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
// //                 <Link to="/" className="text-primary hover:text-primary-dark">
// //                     Continue Shopping
// //                 </Link>
// //             </div>
// //         );
// //     }
// //
// //     return (
// //         <div className="container mx-auto px-4 py-8">
// //             <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
// //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// //                 <AnimatePresence>
// //                     {wishlistItems.map(item => (
// //                         <motion.div
// //                             key={item.id}
// //                             className="bg-white rounded-lg shadow-md overflow-hidden"
// //                             initial={{ opacity: 0, y: 20 }}
// //                             animate={{ opacity: 1, y: 0 }}
// //                             exit={{ opacity: 0, y: -20 }}
// //                             transition={{ duration: 0.3 }}
// //                         >
// //                             <img
// //                                 src={item.product.image}
// //                                 alt={item.product.name}
// //                                 className="w-full h-48 object-cover"
// //                             />
// //                             <div className="p-4">
// //                                 <h2 className="text-xl font-semibold mb-2">{item.product.name}</h2>
// //                                 {item.variant && (
// //                                     <p className="text-gray-600 mb-2">
// //                                         Variant: {item.variant.name}
// //                                     </p>
// //                                 )}
// //                                 <p className="text-primary font-bold mb-4">
// //                                     ${item.product.price}
// //                                 </p>
// //                                 <div className="flex justify-between items-center">
// //                                     <Link
// //                                         to={`/product/${item.product.slug}`}
// //                                         className="text-primary hover:text-primary-dark"
// //                                     >
// //                                         View Details
// //                                     </Link>
// //                                     <WishlistButton
// //                                         product={item.product}
// //                                         selectedVariant={item.variant}
// //                                         currentPath="/wishlist"
// //                                     />
// //                                 </div>
// //                             </div>
// //                         </motion.div>
// //                     ))}
// //                 </AnimatePresence>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default Wishlist;