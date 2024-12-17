import axios from 'axios';
import React, { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const ProductCard = ({ product, onToggleWishlist }) => {
  const [isInWishlist, setIsInWishlist] = useState(product.is_in_wishlist);
  const navigate = useNavigate();

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    setIsInWishlist(!isInWishlist);
    onToggleWishlist(product.id, !isInWishlist);
  };

  const navigateToProductPage = () => {
    navigate(`/product/${product.slug}`);
  };

  return (
    <motion.div
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={navigateToProductPage}
    >
      <div className="aspect-w-1 aspect-h-1 bg-gray-200">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
          <p className="text-xl font-extrabold text-primary">{product.price}</p>
        </div>
        <div className="flex items-center mt-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({product.views})</span>
        </div>
      </div>
      {product.offer && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {product.offer}
        </div>
      )}
      <motion.div
        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWishlistToggle}
      >
        {isInWishlist ? (
          <HeartIconSolid className="h-5 w-5 text-red-500" />
        ) : (
          <HeartIcon className="h-5 w-5 text-gray-600" />
        )}
      </motion.div>
    </motion.div>
  );
};

// ===========below ======cart is there =======
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { StarIcon, ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
// import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
// const ProductCard = ({ product, onToggleWishlist }) => {
//   const [isInWishlist, setIsInWishlist] = useState(product.is_in_wishlist);

//   const handleWishlistToggle = () => {
//     setIsInWishlist(!isInWishlist);
//     onToggleWishlist(product.id, !isInWishlist);
//   };

//   return (
//     <motion.div
//       className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
//       whileHover={{ y: -5 }}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="aspect-w-1 aspect-h-1 bg-gray-200">
//         <img 
//           src={product.image} 
//           alt={product.name} 
//           className="w-full h-full object-contain"
//         />
//       </div>
//       <div className="p-4 flex-grow flex flex-col justify-between">
//         <div>
//           <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
//           <p className="text-xl font-extrabold text-primary">{product.price}</p>
//         </div>
//         <div className="flex items-center justify-between mt-2">
//           <div className="flex items-center">
//             <div className="flex">
//               {[...Array(5)].map((_, i) => (
//                 <StarIcon key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
//               ))}
//             </div>
//             <span className="ml-2 text-sm text-gray-600">({product.views})</span>
//           </div>
//           <motion.button
//             className="p-2 bg-primary rounded-full text-white"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <ShoppingCartIcon className="h-5 w-5" />
//           </motion.button>
//         </div>
//       </div>
//       {product.offer && (
//         <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//           {product.offer}
//         </div>
//       )}
//       <motion.div
//         className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer"
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={handleWishlistToggle}
//       >
//         {isInWishlist ? (
//           <HeartIconSolid className="h-5 w-5 text-red-500" />
//         ) : (
//           <HeartIcon className="h-5 w-5 text-gray-600" />
//         )}
//       </motion.div>
//     </motion.div>
//   );
// };
// const ProductCard = ({ product, onToggleWishlist }) => {
//   const [isInWishlist, setIsInWishlist] = useState(product.is_in_wishlist);

//   const handleWishlistToggle = () => {
//     setIsInWishlist(!isInWishlist);
//     onToggleWishlist(product.id, !isInWishlist);
//   };

//   return (
//     <motion.div
//       className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
//       whileHover={{ y: -5 }}
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <div className="aspect-w-1 aspect-h-1">
//         <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
//       </div>
//       <div className="p-4">
//         <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
//         <p className="text-xl font-extrabold text-primary">{product.price}</p>
//         <div className="flex items-center justify-between mt-2">
//           <div className="flex items-center">
//             <div className="flex">
//               {[...Array(5)].map((_, i) => (
//                 <StarIcon key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
//               ))}
//             </div>
//             <span className="ml-2 text-sm text-gray-600">({product.views})</span>
//           </div>
//           <motion.button
//             className="p-2 bg-primary rounded-full text-white"
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//           >
//             <ShoppingCartIcon className="h-5 w-5" />
//           </motion.button>
//         </div>
//       </div>
//       {product.offer && (
//         <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//           {product.offer}
//         </div>
//       )}
//       <motion.div
//         className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer"
//         whileHover={{ scale: 1.1 }}
//         whileTap={{ scale: 0.9 }}
//         onClick={handleWishlistToggle}
//       >
//         {isInWishlist ? (
//           <HeartIconSolid className="h-5 w-5 text-red-500" />
//         ) : (
//           <HeartIcon className="h-5 w-5 text-gray-600" />
//         )}
//       </motion.div>
//     </motion.div>
//   );
// };

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v2/client/products/home_page/');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleToggleWishlist = async (productId, isAdding) => {
    try {
      // Here you would typically make an API call to update the wishlist status
      // For this example, we'll just update the local state
      const updatedProducts = products.map(product => 
        product.id === productId ? { ...product, is_in_wishlist: isAdding } : product
      );
      setProducts(updatedProducts);

      // Simulating an API call
      console.log(`Product ${productId} ${isAdding ? 'added to' : 'removed from'} wishlist`);
    } catch (error) {
      console.error('Failed to update wishlist', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
          Trending <span className="text-primary">Products</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onToggleWishlist={handleToggleWishlist}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;

// ======================
// import React from 'react';
// import { motion } from 'framer-motion';
// import { StarIcon, EyeIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

// const products = [
//     { id: 1, name: 'Product 1', price: '$29.99', image: 'https://via.placeholder.com/150', rating: 4.5, views: 120, offer: '20% OFF' },
//     { id: 2, name: 'Product 2', price: '$39.99', image: 'https://via.placeholder.com/150', rating: 4.0, views: 95 },
//     { id: 3, name: 'Product 3', price: '$49.99', image: 'https://via.placeholder.com/150', rating: 4.8, views: 200, offer: 'Buy 1 Get 1' },
//     { id: 4, name: 'Product 4', price: '$59.99', image: 'https://via.placeholder.com/150', rating: 4.2, views: 150 },
//     { id: 5, name: 'Product 5', price: '$69.99', image: 'https://via.placeholder.com/150', rating: 4.7, views: 180 },
//     { id: 6, name: 'Product 6', price: '$79.99', image: 'https://via.placeholder.com/150', rating: 4.9, views: 220 },
// ];

// const ProductCard = ({ product }) => {
//     return (
//         <motion.div
//             className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
//             whileHover={{ y: -5 }}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//         >
//             <div className="aspect-w-1 aspect-h-1">
//                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
//             </div>
//             <div className="p-4">
//                 <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
//                 <p className="text-xl font-extrabold text-primary">{product.price}</p>
//                 <div className="flex items-center justify-between mt-2">
//                     <div className="flex items-center">
//                         <div className="flex">
//                             {[...Array(5)].map((_, i) => (
//                                 <StarIcon key={i} className={`h-4 w-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
//                             ))}
//                         </div>
//                         <span className="ml-2 text-sm text-gray-600">({product.views})</span>
//                     </div>
//                     <motion.button
//                         className="p-2 bg-primary rounded-full text-white"
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                     >
//                         <ShoppingCartIcon className="h-5 w-5" />
//                     </motion.button>
//                 </div>
//             </div>
//             {product.offer && (
//                 <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//                     {product.offer}
//                 </div>
//             )}
//             <motion.div
//                 className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//             >
//                 <HeartIcon className="h-5 w-5 text-gray-600" />
//             </motion.div>
//         </motion.div>
//     );
// };

// // export default ProductCard;

// // const ProductCard = ({ product }) => {
// //     return (
// //         <motion.div
// //             className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
// //             whileHover={{ y: -5 }}
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.5 }}
// //         >
// //             <div className="aspect-w-1 aspect-h-1">
// //                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
// //                 <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
// //                     <motion.button
// //                         className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold"
// //                         whileHover={{ scale: 1.05 }}
// //                         whileTap={{ scale: 0.95 }}
// //                     >
// //                         Quick View
// //                     </motion.button>
// //                 </div>
// //             </div>
// //             <div className="p-4">
// //                 <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
// //                 <p className="text-xl font-extrabold text-primary">{product.price}</p>
// //                 <div className="flex items-center justify-between mt-2">
// //                     <div className="flex items-center">
// //                         <div className="flex">
// //                             {[...Array(5)].map((_, i) => (
// //                                 <StarIcon key={i} className={`h-4 w-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
// //                             ))}
// //                         </div>
// //                         <span className="ml-2 text-sm text-gray-600">({product.views})</span>
// //                     </div>
// //                     <motion.button
// //                         className="p-2 bg-primary rounded-full text-white"
// //                         whileHover={{ scale: 1.1 }}
// //                         whileTap={{ scale: 0.9 }}
// //                     >
// //                         <ShoppingCartIcon className="h-5 w-5" />
// //                     </motion.button>
// //                 </div>
// //             </div>
// //             {product.offer && (
// //                 <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
// //                     {product.offer}
// //                 </div>
// //             )}
// //             <motion.div
// //                 className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
// //                 whileHover={{ scale: 1.1 }}
// //                 whileTap={{ scale: 0.9 }}
// //             >
// //                 <HeartIcon className="h-5 w-5 text-gray-600" />
// //             </motion.div>
// //         </motion.div>
// //     );
// // };

// const Products = () => {
//     return (
//         <div className=" min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
//                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
//                     Trending <span className="text-primary">Products</span>
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                     {products.map(product => (
//                         <ProductCard key={product.id} product={product} />
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Products;


// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { StarIcon, HeartIcon, XMarkIcon } from '@heroicons/react/24/outline';
//
// const products = [
//     { id: 1, name: 'Product 1', price: '$29.99', image: 'https://via.placeholder.com/150', rating: 4.5, views: 120, offer: '20% OFF' },
//     { id: 2, name: 'Product 2', price: '$39.99', image: 'https://via.placeholder.com/150', rating: 4.0, views: 95 },
//     { id: 3, name: 'Product 3', price: '$49.99', image: 'https://via.placeholder.com/150', rating: 4.8, views: 200, offer: 'Buy 1 Get 1' },
//     { id: 4, name: 'Product 4', price: '$59.99', image: 'https://via.placeholder.com/150', rating: 4.2, views: 150 },
//     { id: 5, name: 'Product 5', price: '$69.99', image: 'https://via.placeholder.com/150', rating: 4.7, views: 180 },
//     { id: 6, name: 'Product 6', price: '$79.99', image: 'https://via.placeholder.com/150', rating: 4.9, views: 220 },
// ];
//
// const ProductCard = ({ product, onAddToCart }) => {
//     const [isHovered, setIsHovered] = useState(false);
//
//     return (
//         <motion.div
//             className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
//             whileHover={{ y: -5 }}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             onHoverStart={() => setIsHovered(true)}
//             onHoverEnd={() => setIsHovered(false)}
//         >
//             <div className="aspect-w-1 aspect-h-1">
//                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
//                 <AnimatePresence>
//                     {isHovered && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0 }}
//                             className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center"
//                         >
//                             <motion.button
//                                 className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold"
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={() => onAddToCart(product)}
//                             >
//                                 Add to Cart
//                             </motion.button>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </div>
//             <div className="p-4">
//                 <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
//                 <p className="text-xl font-extrabold text-primary">{product.price}</p>
//                 <div className="flex items-center justify-between mt-2">
//                     <div className="flex items-center">
//                         <div className="flex">
//                             {[...Array(5)].map((_, i) => (
//                                 <StarIcon key={i} className={`h-4 w-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
//                             ))}
//                         </div>
//                         <span className="ml-2 text-sm text-gray-600">({product.views})</span>
//                     </div>
//                 </div>
//             </div>
//             {product.offer && (
//                 <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//                     {product.offer}
//                 </div>
//             )}
//             <motion.button
//                 className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//             >
//                 <HeartIcon className="h-5 w-5 text-gray-600" />
//             </motion.button>
//         </motion.div>
//     );
// };
//
// const CartOverlay = ({ isOpen, onClose, cartItems }) => (
//     <AnimatePresence>
//         {isOpen && (
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//             >
//                 <motion.div
//                     initial={{ scale: 0.9, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     exit={{ scale: 0.9, opacity: 0 }}
//                     className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full"
//                 >
//                     <div className="flex justify-between items-center mb-4">
//                         <h2 className="text-2xl font-bold">Cart</h2>
//                         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//                             <XMarkIcon className="h-6 w-6" />
//                         </button>
//                     </div>
//                     {cartItems.length === 0 ? (
//                         <p>Your cart is empty.</p>
//                     ) : (
//                         <ul>
//                             {cartItems.map((item) => (
//                                 <li key={item.id} className="flex justify-between items-center py-2">
//                                     <span>{item.name}</span>
//                                     <span>{item.price}</span>
//                                 </li>
//                             ))}
//                         </ul>
//                     )}
//                     <button className="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark">
//                         Checkout
//                     </button>
//                 </motion.div>
//             </motion.div>
//         )}
//     </AnimatePresence>
// );
//
// const Products = () => {
//     const [cartItems, setCartItems] = useState([]);
//     const [isCartOpen, setIsCartOpen] = useState(false);
//
//     const handleAddToCart = (product) => {
//         setCartItems([...cartItems, product]);
//         setIsCartOpen(true);
//     };
//
//     return (
//         <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-7xl mx-auto">
//                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
//                     Trending <span className="text-primary">Products</span>
//                 </h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//                     {products.map(product => (
//                         <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
//                     ))}
//                 </div>
//             </div>
//             <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cartItems={cartItems} />
//         </div>
//     );
// };
//
// export default Products;
// // import React from 'react';
// // import { motion } from 'framer-motion';
// // import { StarIcon, EyeIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
// //
// // const products = [
// //     { id: 1, name: 'Product 1', price: '$29.99', image: 'https://via.placeholder.com/150', rating: 4.5, views: 120, offer: '20% OFF' },
// //     { id: 2, name: 'Product 2', price: '$39.99', image: 'https://via.placeholder.com/150', rating: 4.0, views: 95 },
// //     { id: 3, name: 'Product 3', price: '$49.99', image: 'https://via.placeholder.com/150', rating: 4.8, views: 200, offer: 'Buy 1 Get 1' },
// //     { id: 4, name: 'Product 4', price: '$59.99', image: 'https://via.placeholder.com/150', rating: 4.2, views: 150 },
// //     { id: 5, name: 'Product 5', price: '$69.99', image: 'https://via.placeholder.com/150', rating: 4.7, views: 180 },
// //     { id: 6, name: 'Product 6', price: '$79.99', image: 'https://via.placeholder.com/150', rating: 4.9, views: 220 },
// // ];
// //
// // const ProductCard = ({ product }) => {
// //     return (
// //         <motion.div
// //             className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
// //             whileHover={{ y: -5 }}
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.5 }}
// //         >
// //             <div className="aspect-w-1 aspect-h-1">
// //                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
// //                 <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
// //                     <motion.button
// //                         className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold"
// //                         whileHover={{ scale: 1.05 }}
// //                         whileTap={{ scale: 0.95 }}
// //                     >
// //                         Quick View
// //                     </motion.button>
// //                 </div>
// //             </div>
// //             <div className="p-4">
// //                 <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
// //                 <p className="text-xl font-extrabold text-primary">{product.price}</p>
// //                 <div className="flex items-center justify-between mt-2">
// //                     <div className="flex items-center">
// //                         <div className="flex">
// //                             {[...Array(5)].map((_, i) => (
// //                                 <StarIcon key={i} className={`h-4 w-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
// //                             ))}
// //                         </div>
// //                         <span className="ml-2 text-sm text-gray-600">({product.views})</span>
// //                     </div>
// //                     <motion.button
// //                         className="p-2 bg-primary text-white rounded-full"
// //                         whileHover={{ scale: 1.1 }}
// //                         whileTap={{ scale: 0.9 }}
// //                     >
// //                         <ShoppingCartIcon className="h-5 w-5" />
// //                     </motion.button>
// //                 </div>
// //             </div>
// //             {product.offer && (
// //                 <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
// //                     {product.offer}
// //                 </div>
// //             )}
// //             <motion.button
// //                 className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
// //                 whileHover={{ scale: 1.1 }}
// //                 whileTap={{ scale: 0.9 }}
// //             >
// //                 <HeartIcon className="h-5 w-5 text-gray-600" />
// //             </motion.button>
// //         </motion.div>
// //     );
// // };
// //
// // const Products = () => {
// //     return (
// //         <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
// //             <div className="max-w-7xl mx-auto">
// //                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
// //                     Trending <span className="text-primary">Products</span>
// //                 </h2>
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// //                     {products.map(product => (
// //                         <ProductCard key={product.id} product={product} />
// //                     ))}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default Products;
// // // import React from 'react';
// // // import { motion } from 'framer-motion';
// // // import { StarIcon, EyeIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
// // //
// // // const products = [
// // //     { id: 1, name: 'Product 1', price: '$29.99', image: 'https://via.placeholder.com/150', rating: 4.5, views: 120, offer: '20% OFF' },
// // //     { id: 2, name: 'Product 2', price: '$39.99', image: 'https://via.placeholder.com/150', rating: 4.0, views: 95 },
// // //     { id: 3, name: 'Product 3', price: '$49.99', image: 'https://via.placeholder.com/150', rating: 4.8, views: 200, offer: 'Buy 1 Get 1' },
// // //     { id: 4, name: 'Product 4', price: '$59.99', image: 'https://via.placeholder.com/150', rating: 4.2, views: 150 },
// // //     { id: 5, name: 'Product 5', price: '$69.99', image: 'https://via.placeholder.com/150', rating: 4.7, views: 180 },
// // //     { id: 6, name: 'Product 6', price: '$79.99', image: 'https://via.placeholder.com/150', rating: 4.9, views: 220 },
// // // ];
// // //
// // // const ProductCard = ({ product }) => {
// // //     return (
// // //         <motion.div
// // //             className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
// // //             whileHover={{ y: -5 }}
// // //             initial={{ opacity: 0, y: 20 }}
// // //             animate={{ opacity: 1, y: 0 }}
// // //             transition={{ duration: 0.5 }}
// // //         >
// // //             <div className="aspect-w-1 aspect-h-1">
// // //                 <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
// // //                 <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
// // //                     <motion.button
// // //                         className="bg-white text-gray-800 px-4 py-2 rounded-full font-semibold"
// // //                         whileHover={{ scale: 1.05 }}
// // //                         whileTap={{ scale: 0.95 }}
// // //                     >
// // //                         Quick View
// // //                     </motion.button>
// // //                 </div>
// // //             </div>
// // //             <div className="p-4">
// // //                 <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
// // //                 <p className="text-xl font-extrabold text-primary">{product.price}</p>
// // //                 <div className="flex items-center mt-2">
// // //                     <div className="flex">
// // //                         {[...Array(5)].map((_, i) => (
// // //                             <StarIcon key={i} className={`h-4 w-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
// // //                         ))}
// // //                     </div>
// // //                     <span className="ml-2 text-sm text-gray-600">({product.views})</span>
// // //                 </div>
// // //             </div>
// // //             {product.offer && (
// // //                 <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
// // //                     {product.offer}
// // //                 </div>
// // //             )}
// // //             <motion.div
// // //                 className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"
// // //                 whileHover={{ scale: 1.1 }}
// // //                 whileTap={{ scale: 0.9 }}
// // //             >
// // //                 <HeartIcon className="h-5 w-5 text-gray-600" />
// // //             </motion.div>
// // //         </motion.div>
// // //     );
// // // };
// // //
// // // const Products = () => {
// // //     return (
// // //         <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
// // //             <div className="max-w-7xl mx-auto">
// // //                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
// // //                     Trending <span className="text-primary">Products</span>
// // //                 </h2>
// // //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
// // //                     {products.map(product => (
// // //                         <ProductCard key={product.id} product={product} />
// // //                     ))}
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // };
// // //
// // // export default Products;
// // // import React from 'react';
// // // import { motion } from 'framer-motion';
// // // import ProductCard from './ProductCard';
// // //
// // // const products = [
// // //     { id: 1, name: 'Product 1', price: '$29.99', image: 'https://via.placeholder.com/150', rating: 4.5, views: 120, offer: '20% OFF' },
// // //     { id: 2, name: 'Product 2', price: '$39.99', image: 'https://via.placeholder.com/150', rating: 4.0, views: 95 },
// // //     { id: 3, name: 'Product 3', price: '$49.99', image: 'https://via.placeholder.com/150', rating: 4.8, views: 200, offer: 'Buy 1 Get 1' },
// // //     { id: 4, name: 'Product 4', price: '$59.99', image: 'https://via.placeholder.com/150', rating: 4.2, views: 150 },
// // //     { id: 5, name: 'Product 5', price: '$69.99', image: 'https://via.placeholder.com/150', rating: 4.7, views: 180 },
// // //     { id: 6, name: 'Product 6', price: '$79.99', image: 'https://via.placeholder.com/150', rating: 4.9, views: 220 },
// // // ];
// // //
// // // const Products = () => {
// // //     const containerVariants = {
// // //         hidden: { opacity: 0 },
// // //         visible: {
// // //             opacity: 1,
// // //             transition: {
// // //                 staggerChildren: 0.1,
// // //             },
// // //         },
// // //     };
// // //
// // //     return (
// // //         <div className="p-8 bg-gray-100">
// // //             <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-12 text-center">
// // //                 Our <span className="text-primary">Products</span>
// // //             </h2>
// // //             <motion.div
// // //                 className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"
// // //                 variants={containerVariants}
// // //                 initial="hidden"
// // //                 animate="visible"
// // //             >
// // //                 {products.map(product => (
// // //                     <ProductCard key={product.id} product={product} />
// // //                 ))}
// // //             </motion.div>
// // //         </div>
// // //     );
// // // };
// // //
// // // export default Products;
// //
// // // =======================================================
// // // import React from 'react';
// // // import { motion } from 'framer-motion';
// // // import { StarIcon, EyeIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
// // //
// // // const products = [
// // //     { id: 1, name: 'Product 1', price: '$29.99', image: 'https://via.placeholder.com/150', rating: 4.5, views: 120, offer: '20% OFF' },
// // //     { id: 2, name: 'Product 2', price: '$39.99', image: 'https://via.placeholder.com/150', rating: 4.0, views: 95 },
// // //     { id: 3, name: 'Product 3', price: '$49.99', image: 'https://via.placeholder.com/150', rating: 4.8, views: 200, offer: 'Buy 1 Get 1' },
// // //     { id: 4, name: 'Product 4', price: '$59.99', image: 'https://via.placeholder.com/150', rating: 4.2, views: 150 },
// // //     { id: 5, name: 'Product 5', price: '$69.99', image: 'https://via.placeholder.com/150', rating: 4.7, views: 180 },
// // //     { id: 6, name: 'Product 6', price: '$79.99', image: 'https://via.placeholder.com/150', rating: 4.9, views: 220 },
// // // ];
// // //
// // // const ProductCard = ({ product }) => {
// // //     const cardVariants = {
// // //         hidden: { opacity: 0, y: 50 },
// // //         visible: { opacity: 1, y: 0 },
// // //     };
// // //
// // //     return (
// // //         <motion.div
// // //             className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
// // //             variants={cardVariants}
// // //             initial="hidden"
// // //             animate="visible"
// // //             whileHover={{ scale: 1.05 }}
// // //             whileTap={{ scale: 0.95 }}
// // //         >
// // //             {/* Background shapes */}
// // //             <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary opacity-10 rounded-full"></div>
// // //             <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-secondary opacity-10 rounded-full"></div>
// // //
// // //             {/* Offer Badge */}
// // //             {product.offer && (
// // //                 <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
// // //                     {product.offer}
// // //                 </div>
// // //             )}
// // //
// // //             {/* Heart Icon */}
// // //             <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
// // //                 <HeartIcon className="h-6 w-6 text-red-500" />
// // //             </div>
// // //
// // //             {/* Product Image */}
// // //             <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
// // //
// // //             {/* Product Details */}
// // //             <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
// // //             <p className="text-2xl font-extrabold text-primary mb-3">{product.price}</p>
// // //             <div className="flex items-center mb-3">
// // //                 {[...Array(5)].map((_, i) => (
// // //                     <StarIcon key={i} className={`h-5 w-5 ${i < product.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
// // //                 ))}
// // //                 <span className="ml-2 text-sm font-medium text-gray-600">{product.rating}</span>
// // //             </div>
// // //             <div className="flex items-center text-gray-500 mb-6">
// // //                 <EyeIcon className="h-5 w-5 mr-1" />
// // //                 <span className="text-sm font-medium">{product.views} views</span>
// // //             </div>
// // //
// // //             {/* Cart Icon */}
// // //             <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
// // //                 <ShoppingCartIcon className="h-6 w-6 text-gray-800" />
// // //             </div>
// // //
// // //             {/* Animated Border */}
// // //             <motion.div
// // //                 className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"
// // //                 initial={{ scaleX: 0 }}
// // //                 whileHover={{ scaleX: 1 }}
// // //                 transition={{ duration: 0.3 }}
// // //             />
// // //         </motion.div>
// // //     );
// // // };
// // //
// // // const Products = () => {
// // //     const containerVariants = {
// // //         hidden: { opacity: 0 },
// // //         visible: {
// // //             opacity: 1,
// // //             transition: {
// // //                 staggerChildren: 0.1,
// // //             },
// // //         },
// // //     };
// // //
// // //     return (
// // //         <div className="p-8 bg-gray-100">
// // //             <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-12 text-center">
// // //                 Our <span className="text-primary">Products</span>
// // //             </h2>
// // //             <motion.div
// // //                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
// // //                 variants={containerVariants}
// // //                 initial="hidden"
// // //                 animate="visible"
// // //             >
// // //                 {products.map(product => (
// // //                     <ProductCard key={product.id} product={product} />
// // //                 ))}
// // //             </motion.div>
// // //         </div>
// // //     );
// // // };
// // //
// // // export default Products;
// // //
// // // // import React from 'react';
// // // // import { motion } from 'framer-motion';
// // // // import { StarIcon, EyeIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
// // // //
// // // // const products = [
// // // //     { id: 1, name: 'Product 1', price: '$29.99', image: 'https://via.placeholder.com/150', rating: 4.5, views: 120 },
// // // //     { id: 2, name: 'Product 2', price: '$39.99', image: 'https://via.placeholder.com/150', rating: 4.0, views: 95 },
// // // //     { id: 3, name: 'Product 3', price: '$49.99', image: 'https://via.placeholder.com/150', rating: 4.8, views: 200 },
// // // //     { id: 4, name: 'Product 4', price: '$59.99', image: 'https://via.placeholder.com/150', rating: 4.2, views: 150 },
// // // //     { id: 5, name: 'Product 5', price: '$69.99', image: 'https://via.placeholder.com/150', rating: 4.7, views: 180 },
// // // //     { id: 6, name: 'Product 6', price: '$79.99', image: 'https://via.placeholder.com/150', rating: 4.9, views: 220 },
// // // // ];
// // // //
// // // // const ProductCard = ({ product }) => {
// // // //     const cardVariants = {
// // // //         hidden: { opacity: 0, y: 50 },
// // // //         visible: { opacity: 1, y: 0 },
// // // //     };
// // // //
// // // //     return (
// // // //         <motion.div
// // // //             className="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
// // // //             variants={cardVariants}
// // // //             initial="hidden"
// // // //             animate="visible"
// // // //             whileHover={{ scale: 1.05 }}
// // // //             whileTap={{ scale: 0.95 }}
// // // //         >
// // // //             {/* Background shapes */}
// // // //             <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary opacity-10 rounded-full"></div>
// // // //             <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-secondary opacity-10 rounded-full"></div>
// // // //
// // // //             {/* Heart Icon */}
// // // //             <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
// // // //                 <HeartIcon className="h-6 w-6 text-red-500" />
// // // //             </div>
// // // //
// // // //             {/* Product Image */}
// // // //             <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
// // // //
// // // //             {/* Product Details */}
// // // //             <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
// // // //             <p className="text-2xl font-extrabold text-primary mb-3">{product.price}</p>
// // // //             <div className="flex items-center mb-3">
// // // //                 {[...Array(5)].map((_, i) => (
// // // //                     <StarIcon key={i} className={`h-5 w-5 ${i < product.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
// // // //                 ))}
// // // //                 <span className="ml-2 text-sm font-medium text-gray-600">{product.rating}</span>
// // // //             </div>
// // // //             <div className="flex items-center text-gray-500 mb-6">
// // // //                 <EyeIcon className="h-5 w-5 mr-1" />
// // // //                 <span className="text-sm font-medium">{product.views} views</span>
// // // //             </div>
// // // //
// // // //             {/* Cart Icon */}
// // // //             <div className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
// // // //                 <ShoppingCartIcon className="h-6 w-6 text-gray-800" />
// // // //             </div>
// // // //
// // // //             {/* Animated Border */}
// // // //             <motion.div
// // // //                 className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"
// // // //                 initial={{ scaleX: 0 }}
// // // //                 whileHover={{ scaleX: 1 }}
// // // //                 transition={{ duration: 0.3 }}
// // // //             />
// // // //         </motion.div>
// // // //     );
// // // // };
// // // //
// // // // const Products = () => {
// // // //     const containerVariants = {
// // // //         hidden: { opacity: 0 },
// // // //         visible: {
// // // //             opacity: 1,
// // // //             transition: {
// // // //                 staggerChildren: 0.1,
// // // //             },
// // // //         },
// // // //     };
// // // //
// // // //     return (
// // // //         <div className="p-8 bg-gray-100">
// // // //             <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-12 text-center">
// // // //                 Our <span className="text-primary">Products</span>
// // // //             </h2>
// // // //             <motion.div
// // // //                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
// // // //                 variants={containerVariants}
// // // //                 initial="hidden"
// // // //                 animate="visible"
// // // //             >
// // // //                 {products.map(product => (
// // // //                     <ProductCard key={product.id} product={product} />
// // // //                 ))}
// // // //             </motion.div>
// // // //         </div>
// // // //     );
// // // // };
// // // //
// // // // export default Products;
// // // //
// // // // // import React from 'react';
// // // // // import { motion } from 'framer-motion';
// // // // // import { StarIcon, EyeIcon } from '@heroicons/react/24/outline';
// // // // //
// // // // // const products = [
// // // // //     { id: 1, name: 'Product 1', price: '$29.99', image: 'https://via.placeholder.com/150', rating: 4.5, views: 120 },
// // // // //     { id: 2, name: 'Product 2', price: '$39.99', image: 'https://via.placeholder.com/150', rating: 4.0, views: 95 },
// // // // //     { id: 3, name: 'Product 3', price: '$49.99', image: 'https://via.placeholder.com/150', rating: 4.8, views: 200 },
// // // // //     { id: 4, name: 'Product 4', price: '$59.99', image: 'https://via.placeholder.com/150', rating: 4.2, views: 150 },
// // // // //     { id: 5, name: 'Product 5', price: '$69.99', image: 'https://via.placeholder.com/150', rating: 4.7, views: 180 },
// // // // //     { id: 6, name: 'Product 6', price: '$79.99', image: 'https://via.placeholder.com/150', rating: 4.9, views: 220 },
// // // // // ];
// // // // //
// // // // // const ProductCard = ({ product }) => {
// // // // //     const cardVariants = {
// // // // //         hidden: { opacity: 0, y: 50 },
// // // // //         visible: { opacity: 1, y: 0 },
// // // // //     };
// // // // //
// // // // //     return (
// // // // //         <motion.div
// // // // //             className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden"
// // // // //             variants={cardVariants}
// // // // //             initial="hidden"
// // // // //             animate="visible"
// // // // //             whileHover={{ scale: 1.05 }}
// // // // //             whileTap={{ scale: 0.95 }}
// // // // //         >
// // // // //             <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary opacity-10 rounded-full"></div>
// // // // //             <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-secondary opacity-10 rounded-full"></div>
// // // // //             <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
// // // // //             <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
// // // // //             <p className="text-2xl font-extrabold text-primary mb-3">{product.price}</p>
// // // // //             <div className="flex items-center mb-3">
// // // // //                 {[...Array(5)].map((_, i) => (
// // // // //                     <StarIcon key={i} className={`h-5 w-5 ${i < product.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
// // // // //                 ))}
// // // // //                 <span className="ml-2 text-sm font-medium text-gray-600">{product.rating}</span>
// // // // //             </div>
// // // // //             <div className="flex items-center text-gray-500">
// // // // //                 <EyeIcon className="h-5 w-5 mr-1" />
// // // // //                 <span className="text-sm font-medium">{product.views} views</span>
// // // // //             </div>
// // // // //             <motion.div
// // // // //                 className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"
// // // // //                 initial={{ scaleX: 0 }}
// // // // //                 whileHover={{ scaleX: 1 }}
// // // // //                 transition={{ duration: 0.3 }}
// // // // //             />
// // // // //         </motion.div>
// // // // //     );
// // // // // };
// // // // //
// // // // // const Products = () => {
// // // // //     const containerVariants = {
// // // // //         hidden: { opacity: 0 },
// // // // //         visible: {
// // // // //             opacity: 1,
// // // // //             transition: {
// // // // //                 staggerChildren: 0.1,
// // // // //             },
// // // // //         },
// // // // //     };
// // // // //
// // // // //     return (
// // // // //         <div className="p-8 bg-gray-100">
// // // // //             <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 mb-12 text-center">
// // // // //                 Our <span className="text-primary">Products</span>
// // // // //             </h2>
// // // // //             <motion.div
// // // // //                 className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
// // // // //                 variants={containerVariants}
// // // // //                 initial="hidden"
// // // // //                 animate="visible"
// // // // //             >
// // // // //                 {products.map(product => (
// // // // //                     <ProductCard key={product.id} product={product} />
// // // // //                 ))}
// // // // //             </motion.div>
// // // // //         </div>
// // // // //     );
// // // // // };
// // // // //
// // // // // export default Products;
// // // // // // import React from 'react';
// // // // // // import { motion } from 'framer-motion';
// // // // // // import { StarIcon, EyeIcon } from '@heroicons/react/24/outline';
// // // // // //
// // // // // // const products = [
// // // // // //     { id: 1, name: 'Product 1', price: '$29.99', image: 'https://via.placeholder.com/150', rating: 4.5, views: 120 },
// // // // // //     { id: 2, name: 'Product 2', price: '$39.99', image: 'https://via.placeholder.com/150', rating: 4.0, views: 95 },
// // // // // //     { id: 3, name: 'Product 3', price: '$49.99', image: 'https://via.placeholder.com/150', rating: 4.8, views: 200 },
// // // // // //     { id: 4, name: 'Product 4', price: '$59.99', image: 'https://via.placeholder.com/150', rating: 4.2, views: 150 },
// // // // // //     { id: 5, name: 'Product 5', price: '$69.99', image: 'https://via.placeholder.com/150', rating: 4.7, views: 180 },
// // // // // //     { id: 6, name: 'Product 6', price: '$79.99', image: 'https://via.placeholder.com/150', rating: 4.9, views: 220 },
// // // // // //     // Add more products as needed
// // // // // // ];
// // // // // //
// // // // // // const ProductCard = ({ product }) => (
// // // // // //     <motion.div
// // // // // //         className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
// // // // // //         whileHover={{ scale: 1.05 }}
// // // // // //         whileTap={{ scale: 0.95 }}
// // // // // //     >
// // // // // //         <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md mb-4" />
// // // // // //         <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
// // // // // //         <p className="text-xl font-bold text-primary mb-2">{product.price}</p>
// // // // // //         <div className="flex items-center mb-2">
// // // // // //             {[...Array(5)].map((_, i) => (
// // // // // //                 <StarIcon key={i} className={`h-5 w-5 ${i < product.rating ? 'text-yellow-500' : 'text-gray-300'}`} />
// // // // // //             ))}
// // // // // //             <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
// // // // // //         </div>
// // // // // //         <div className="flex items-center text-gray-500">
// // // // // //             <EyeIcon className="h-5 w-5 mr-1" />
// // // // // //             <span className="text-sm">{product.views} views</span>
// // // // // //         </div>
// // // // // //     </motion.div>
// // // // // // );
// // // // // //
// // // // // // const Products = () => (
// // // // // //     <div className="p-8 bg-background">
// // // // // //         <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 text-center">
// // // // // //             Our Products
// // // // // //         </h2>
// // // // // //         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
// // // // // //             {products.map(product => (
// // // // // //                 <ProductCard key={product.id} product={product} />
// // // // // //             ))}
// // // // // //         </div>
// // // // // //     </div>
// // // // // // );
// // // // // //
// // // // // // export default Products;
