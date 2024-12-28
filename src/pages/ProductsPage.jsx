import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Slider,
  FormControl,
  InputLabel,
  Grid,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Search, Sort, FilterList } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StarIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import axios from 'axios';

// ProductCard Component
const ProductCard = ({ product, onToggleWishlist }) => {
  const [isInWishlist, setIsInWishlist] = useState(product.is_in_wishlist);
  const navigate = useNavigate();

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    setIsInWishlist(!isInWishlist);
    onToggleWishlist(product.id, !isInWishlist);
  };

  const navigateToProductPage = () => {
    navigate(`/product/${product.id}`);
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
              <StarIcon 
                key={i} 
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
              />
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

// Products Component
const Products = ({ filters, searchTerm, sortBy }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Add query parameters based on filters, searchTerm, and sortBy
        const queryParams = new URLSearchParams({
          search: searchTerm,
          sort: sortBy,
          category: filters.category !== 'all' ? filters.category : '',
          min_price: filters.priceRange[0],
          max_price: filters.priceRange[1],
          material: filters.material !== 'all' ? filters.material : ''
        });

        const response = await axios.get(`http://127.0.0.1:8000/api/v2/client/products/?${queryParams}`);
        setProducts(response.data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, searchTerm, sortBy]);

  const handleToggleWishlist = async (productId, isAdding) => {
    try {
      // Make API call to update wishlist
      await axios.post(`http://127.0.0.1:8000/api/v2/client/wishlist/${productId}/`, {
        is_in_wishlist: isAdding
      });

      const updatedProducts = products.map(product => 
        product.id === productId ? { ...product, is_in_wishlist: isAdding } : product
      );
      setProducts(updatedProducts);
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
          All <span className="text-primary">Products</span>
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

// Filter Section Component
const FilterSection = ({ filters, handleFilterChange }) => (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Filters</Typography>
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel>Category</InputLabel>
      <Select
        value={filters.category}
        label="Category"
        onChange={(e) => handleFilterChange('category', e.target.value)}
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="rings">Rings</MenuItem>
        <MenuItem value="necklaces">Necklaces</MenuItem>
        <MenuItem value="bracelets">Bracelets</MenuItem>
        <MenuItem value="earrings">Earrings</MenuItem>
      </Select>
    </FormControl>
    
    <Box sx={{ mt: 4, color: 'text-primary' }}>
      <Typography gutterBottom>Price Range</Typography>
      <Slider
        value={filters.priceRange}
        onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={5000}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', color: 'text-primary' }}>
        <Typography variant="caption">${filters.priceRange[0]}</Typography>
        <Typography variant="caption">${filters.priceRange[1]}</Typography>
      </Box>
    </Box>

    <FormControl fullWidth sx={{ mt: 4 }}>
      <InputLabel>Material</InputLabel>
      <Select
        value={filters.material}
        label="Material"
        onChange={(e) => handleFilterChange('material', e.target.value)}
      >
        <MenuItem value="all">All</MenuItem>
        <MenuItem value="gold">Gold</MenuItem>
        <MenuItem value="silver">Silver</MenuItem>
        <MenuItem value="diamond">Diamond</MenuItem>
        <MenuItem value="platinum">Platinum</MenuItem>
      </Select>
    </FormControl>
  </Box>
);

// Main ProductsPage Component
const ProductsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 5000],
    material: 'all'
  });

  const handleFilterChange = (name, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Typography variant="h4" color="text-primary" fontWeight="bold" gutterBottom>
        Our <span className="text-primary">Products</span>
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" paragraph>
        Browse our selection of luxurious jewelry.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search color="action" />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
              startAdornment={<Sort color="action" />}
            >
              <MenuItem value="default">Default</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
              <MenuItem value="name_asc">Name: A to Z</MenuItem>
              <MenuItem value="name_desc">Name: Z to A</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {isMobile ? (
          <>
            <Grid item xs={12}>
              <IconButton 
                onClick={() => setDrawerOpen(true)} 
                edge="start" 
                color="inherit bg-primary" 
                aria-label="menu"
              >
                <FilterList />
              </IconButton>
              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box sx={{ width: 250 }} role="presentation">
                  <FilterSection filters={filters} handleFilterChange={handleFilterChange} />
                </Box>
              </Drawer>
            </Grid>
            <Grid item xs={12}>
              <Products filters={filters} searchTerm={searchTerm} sortBy={sortBy} />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} md={3} lg={2}>
              <FilterSection filters={filters} handleFilterChange={handleFilterChange} />
            </Grid>
            <Grid item xs={12} md={9} lg={10}>
              <Products filters={filters} searchTerm={searchTerm} sortBy={sortBy} />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default ProductsPage;
// ========================
// import {
//   Box,
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   Slider,
//   FormControl,
//   InputLabel,
//   Grid,
//   Drawer,
//   IconButton,
//   useMediaQuery,
//   useTheme,
// } from '@mui/material';
// import { Search, Sort, FilterList } from '@mui/icons-material'; // Corrected import
// import axios from 'axios';
// import React, { useState ,useEffect} from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { StarIcon, HeartIcon } from '@heroicons/react/24/outline';
// import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

// const ProductCard = ({ product, onToggleWishlist }) => {
// const [isInWishlist, setIsInWishlist] = useState(product.is_in_wishlist);
// const navigate = useNavigate();

// const handleWishlistToggle = (e) => {
//   e.stopPropagation();
//   setIsInWishlist(!isInWishlist);
//   onToggleWishlist(product.id, !isInWishlist);
// };

// const navigateToProductPage = () => {
//   navigate(`/product/${product.id}`);
// };

// return (
//   <motion.div
//     className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer"
//     whileHover={{ y: -5 }}
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ duration: 0.5 }}
//     onClick={navigateToProductPage}
//   >
//     <div className="aspect-w-1 aspect-h-1 bg-gray-200">
//       <img 
//         src={product.image} 
//         alt={product.name} 
//         className="w-full h-full object-contain"
//       />
//     </div>
//     <div className="p-4 flex-grow flex flex-col justify-between">
//       <div>
//         <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
//         <p className="text-xl font-extrabold text-primary">{product.price}</p>
//       </div>
//       <div className="flex items-center mt-2">
//         <div className="flex">
//           {[...Array(5)].map((_, i) => (
//             <StarIcon key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
//           ))}
//         </div>
//         <span className="ml-2 text-sm text-gray-600">({product.views})</span>
//       </div>
//     </div>
//     {product.offer && (
//       <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
//         {product.offer}
//       </div>
//     )}
//     <motion.div
//       className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer"
//       whileHover={{ scale: 1.1 }}
//       whileTap={{ scale: 0.9 }}
//       onClick={handleWishlistToggle}
//     >
//       {isInWishlist ? (
//         <HeartIconSolid className="h-5 w-5 text-red-500" />
//       ) : (
//         <HeartIcon className="h-5 w-5 text-gray-600" />
//       )}
//     </motion.div>
//   </motion.div>
// );
// };

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:8000/api/v2/client/products/');
//         setProducts(response.data.results);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch products. Please try again later.');
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   const handleToggleWishlist = async (productId, isAdding) => {
//     try {
//       // Here you would typically make an API call to update the wishlist status
//       // For this example, we'll just update the local state
//       const updatedProducts = products.map(product => 
//         product.id === productId ? { ...product, is_in_wishlist: isAdding } : product
//       );
//       setProducts(updatedProducts);

//       // Simulating an API call
//       console.log(`Product ${productId} ${isAdding ? 'added to' : 'removed from'} wishlist`);
//     } catch (error) {
//       console.error('Failed to update wishlist', error);
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-12">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-12 text-red-500">{error}</div>;
//   }

//   return (
//     <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
//           All <span className="text-primary">Products</span>
//         </h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
//           {products.map(product => (
//             <ProductCard 
//               key={product.id} 
//               product={product} 
//               onToggleWishlist={handleToggleWishlist}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };


// const ProductsPage = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('default');
//   const [filters, setFilters] = useState({
//       category: 'all',
//       priceRange: [0, 5000],
//       material: 'all'
//   });

//   const handleFilterChange = (name, value) => {
//       setFilters(prevFilters => ({
//           ...prevFilters,
//           [name]: value
//       }));
//   };

//   const FilterSection = () => (
//       <Box sx={{ p: 2 }}>
//           <Typography variant="h6" gutterBottom>Filters</Typography>
//           <FormControl fullWidth sx={{ mt: 2 }}>
//               <InputLabel>Category</InputLabel>
//               <Select
//                   value={filters.category}
//                   label="Category"
//                   onChange={(e) => handleFilterChange('category', e.target.value)}
//               >
//                   <MenuItem value="all">All</MenuItem>
//                   <MenuItem value="rings">Rings</MenuItem>
//                   <MenuItem value="necklaces">Necklaces</MenuItem>
//                   <MenuItem value="bracelets">Bracelets</MenuItem>
//                   <MenuItem value="earrings">Earrings</MenuItem>
//               </Select>
//           </FormControl>
//           <Box sx={{ mt: 4 ,color:'text-primary'}}>
//               <Typography gutterBottom>Price Range</Typography>
//               <Slider
//                   value={filters.priceRange}
//                   onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
//                   valueLabelDisplay="auto"
//                   min={0}
//                   max={5000}
//               />
//               <Box sx={{ display: 'flex', justifyContent: 'space-between',color:'text-primary' }}>
//                   <Typography variant="caption">${filters.priceRange[0]}</Typography>
//                   <Typography variant="caption">${filters.priceRange[1]}</Typography>
//               </Box>
//           </Box>
//           <FormControl fullWidth sx={{ mt: 4 }}>
//               <InputLabel>Material</InputLabel>
//               <Select
//                   value={filters.material}
//                   label="Material"
//                   onChange={(e) => handleFilterChange('material', e.target.value)}
//               >
//                   <MenuItem value="all">All</MenuItem>
//                   <MenuItem value="gold">Gold</MenuItem>
//                   <MenuItem value="silver">Silver</MenuItem>
//                   <MenuItem value="diamond">Diamond</MenuItem>
//                   <MenuItem value="platinum">Platinum</MenuItem>
//               </Select>
//           </FormControl>
//       </Box>
//   );

//   return (
//       <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
//           <Typography variant="h4" color="text-primary" fontWeight="bold" gutterBottom>
//               Our <span className="text-primary">Products</span>
//           </Typography>
//           <Typography variant="subtitle1" color="text.secondary" paragraph>
//               Browse our selection of luxurious jewelry.
//           </Typography>

//           <Grid container spacing={2} sx={{ mb: 4 }}>
//               <Grid item xs={12} md={6}>
//                   <TextField
//                       fullWidth
//                       variant="outlined"
//                       placeholder="Search products..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       InputProps={{
//                           startAdornment: <Search color="action" />,
//                       }}
//                   />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                   <FormControl fullWidth variant="outlined">
//                       <InputLabel>Sort By</InputLabel>
//                       <Select
//                           value={sortBy}
//                           onChange={(e) => setSortBy(e.target.value)}
//                           label="Sort By"
//                           startAdornment={<Sort color="action" />}
//                       >
//                           <MenuItem value="default">Default</MenuItem>
//                           <MenuItem value="price_asc">Price: Low to High</MenuItem>
//                           <MenuItem value="price_desc">Price: High to Low</MenuItem>
//                           <MenuItem value="name_asc">Name: A to Z</MenuItem>
//                           <MenuItem value="name_desc">Name: Z to A</MenuItem>
//                       </Select>
//                   </FormControl>
//               </Grid>
//           </Grid>

//           <Grid container spacing={4}>
//               {isMobile ? (
//                   <>
//                       <Grid item xs={12}>
//                           <IconButton onClick={() => setDrawerOpen(true)} edge="start" color="inherit bg-primary" aria-label="menu">
//                               <FilterList />
//                           </IconButton>
//                           <Drawer
//                               anchor="left"
//                               open={drawerOpen}
//                               onClose={() => setDrawerOpen(false)}
//                           >
//                               <Box sx={{ width: 250 }} role="presentation">
//                                   <FilterSection />
//                               </Box>
//                           </Drawer>
//                       </Grid>
//                       <Grid item xs={12}>
//                           <Products filters={filters} searchTerm={searchTerm} sortBy={sortBy} />
//                       </Grid>
//                   </>
//               ) : (
//                   <>
//                       <Grid item xs={12} md={3} lg={2}>
//                           <FilterSection />
//                       </Grid>
//                       <Grid item xs={12} md={9} lg={10}>
//                           <Products filters={filters} searchTerm={searchTerm} sortBy={sortBy} />
//                       </Grid>
//                   </>
//               )}
//           </Grid>
//       </Box>
//   );
// };

// export default ProductsPage;

// // ========below =============design
// // import React, { useState } from 'react';
// // import {
// //     Box,
// //     Typography,
// //     TextField,
// //     Select,
// //     MenuItem,
// //     Slider,
// //     FormControl,
// //     InputLabel,
// //     Grid,
// //     Drawer,
// //     IconButton,
// //     useMediaQuery,
// //     useTheme,
// // } from '@mui/material';
// // import Products from "../components/Products";
// // import { Search, Sort, FilterList } from '@mui/icons-material'; // Corrected import

// // const ProductsPage = () => {
// //     const theme = useTheme();
// //     const isMobile = useMediaQuery(theme.breakpoints.down('md'));
// //     const [drawerOpen, setDrawerOpen] = useState(false);
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [sortBy, setSortBy] = useState('default');
// //     const [filters, setFilters] = useState({
// //         category: 'all',
// //         priceRange: [0, 5000],
// //         material: 'all'
// //     });

// //     const handleFilterChange = (name, value) => {
// //         setFilters(prevFilters => ({
// //             ...prevFilters,
// //             [name]: value
// //         }));
// //     };

// //     const FilterSection = () => (
// //         <Box sx={{ p: 2 }}>
// //             <Typography variant="h6" gutterBottom>Filters</Typography>
// //             <FormControl fullWidth sx={{ mt: 2 }}>
// //                 <InputLabel>Category</InputLabel>
// //                 <Select
// //                     value={filters.category}
// //                     label="Category"
// //                     onChange={(e) => handleFilterChange('category', e.target.value)}
// //                 >
// //                     <MenuItem value="all">All</MenuItem>
// //                     <MenuItem value="rings">Rings</MenuItem>
// //                     <MenuItem value="necklaces">Necklaces</MenuItem>
// //                     <MenuItem value="bracelets">Bracelets</MenuItem>
// //                     <MenuItem value="earrings">Earrings</MenuItem>
// //                 </Select>
// //             </FormControl>
// //             <Box sx={{ mt: 4 ,color:'text-primary'}}>
// //                 <Typography gutterBottom>Price Range</Typography>
// //                 <Slider
// //                     value={filters.priceRange}
// //                     onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
// //                     valueLabelDisplay="auto"
// //                     min={0}
// //                     max={5000}
// //                 />
// //                 <Box sx={{ display: 'flex', justifyContent: 'space-between',color:'text-primary' }}>
// //                     <Typography variant="caption">${filters.priceRange[0]}</Typography>
// //                     <Typography variant="caption">${filters.priceRange[1]}</Typography>
// //                 </Box>
// //             </Box>
// //             <FormControl fullWidth sx={{ mt: 4 }}>
// //                 <InputLabel>Material</InputLabel>
// //                 <Select
// //                     value={filters.material}
// //                     label="Material"
// //                     onChange={(e) => handleFilterChange('material', e.target.value)}
// //                 >
// //                     <MenuItem value="all">All</MenuItem>
// //                     <MenuItem value="gold">Gold</MenuItem>
// //                     <MenuItem value="silver">Silver</MenuItem>
// //                     <MenuItem value="diamond">Diamond</MenuItem>
// //                     <MenuItem value="platinum">Platinum</MenuItem>
// //                 </Select>
// //             </FormControl>
// //         </Box>
// //     );

// //     return (
// //         <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
// //             <Typography variant="h4" color="text-primary" fontWeight="bold" gutterBottom>
// //                 Our <span className="text-primary">Products</span>
// //             </Typography>
// //             <Typography variant="subtitle1" color="text.secondary" paragraph>
// //                 Browse our selection of luxurious jewelry.
// //             </Typography>

// //             <Grid container spacing={2} sx={{ mb: 4 }}>
// //                 <Grid item xs={12} md={6}>
// //                     <TextField
// //                         fullWidth
// //                         variant="outlined"
// //                         placeholder="Search products..."
// //                         value={searchTerm}
// //                         onChange={(e) => setSearchTerm(e.target.value)}
// //                         InputProps={{
// //                             startAdornment: <Search color="action" />,
// //                         }}
// //                     />
// //                 </Grid>
// //                 <Grid item xs={12} md={6}>
// //                     <FormControl fullWidth variant="outlined">
// //                         <InputLabel>Sort By</InputLabel>
// //                         <Select
// //                             value={sortBy}
// //                             onChange={(e) => setSortBy(e.target.value)}
// //                             label="Sort By"
// //                             startAdornment={<Sort color="action" />}
// //                         >
// //                             <MenuItem value="default">Default</MenuItem>
// //                             <MenuItem value="price_asc">Price: Low to High</MenuItem>
// //                             <MenuItem value="price_desc">Price: High to Low</MenuItem>
// //                             <MenuItem value="name_asc">Name: A to Z</MenuItem>
// //                             <MenuItem value="name_desc">Name: Z to A</MenuItem>
// //                         </Select>
// //                     </FormControl>
// //                 </Grid>
// //             </Grid>

// //             <Grid container spacing={4}>
// //                 {isMobile ? (
// //                     <>
// //                         <Grid item xs={12}>
// //                             <IconButton onClick={() => setDrawerOpen(true)} edge="start" color="inherit bg-primary" aria-label="menu">
// //                                 <FilterList />
// //                             </IconButton>
// //                             <Drawer
// //                                 anchor="left"
// //                                 open={drawerOpen}
// //                                 onClose={() => setDrawerOpen(false)}
// //                             >
// //                                 <Box sx={{ width: 250 }} role="presentation">
// //                                     <FilterSection />
// //                                 </Box>
// //                             </Drawer>
// //                         </Grid>
// //                         <Grid item xs={12}>
// //                             <Products filters={filters} searchTerm={searchTerm} sortBy={sortBy} />
// //                         </Grid>
// //                     </>
// //                 ) : (
// //                     <>
// //                         <Grid item xs={12} md={3} lg={2}>
// //                             <FilterSection />
// //                         </Grid>
// //                         <Grid item xs={12} md={9} lg={10}>
// //                             <Products filters={filters} searchTerm={searchTerm} sortBy={sortBy} />
// //                         </Grid>
// //                     </>
// //                 )}
// //             </Grid>
// //         </Box>
// //     );
// // };

// // export default ProductsPage;

// // =================design below==================
// // import React, { useState } from 'react';
// // import {
// //     Box,
// //     Typography,
// //     TextField,
// //     Select,
// //     MenuItem,
// //     Slider,
// //     FormControl,
// //     InputLabel,
// //     Grid,
// //     Drawer,
// //     IconButton,
// //     useMediaQuery,
// //     useTheme,
// // } from '@mui/material';
// // import Products from "../components/Products";
// // import { Search, Sort, FilterList } from '@mui/icons-material'; // Corrected import

// // const ProductsPage = () => {
// //     const theme = useTheme();
// //     const isMobile = useMediaQuery(theme.breakpoints.down('md'));
// //     const [drawerOpen, setDrawerOpen] = useState(false);
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [sortBy, setSortBy] = useState('default');
// //     const [filters, setFilters] = useState({
// //         category: 'all',
// //         priceRange: [0, 5000],
// //         material: 'all'
// //     });

// //     const handleFilterChange = (name, value) => {
// //         setFilters(prevFilters => ({
// //             ...prevFilters,
// //             [name]: value
// //         }));
// //     };

// //     const FilterSection = () => (
// //         <Box sx={{ p: 2 }}>
// //             <Typography variant="h6" gutterBottom>Filters</Typography>
// //             <FormControl fullWidth sx={{ mt: 2 }}>
// //                 <InputLabel>Category</InputLabel>
// //                 <Select
// //                     value={filters.category}
// //                     label="Category"
// //                     onChange={(e) => handleFilterChange('category', e.target.value)}
// //                 >
// //                     <MenuItem value="all">All</MenuItem>
// //                     <MenuItem value="rings">Rings</MenuItem>
// //                     <MenuItem value="necklaces">Necklaces</MenuItem>
// //                     <MenuItem value="bracelets">Bracelets</MenuItem>
// //                     <MenuItem value="earrings">Earrings</MenuItem>
// //                 </Select>
// //             </FormControl>
// //             <Box sx={{ mt: 4 ,color:'text-primary'}}>
// //                 <Typography gutterBottom>Price Range</Typography>
// //                 <Slider
// //                     value={filters.priceRange}
// //                     onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
// //                     valueLabelDisplay="auto"
// //                     min={0}
// //                     max={5000}
// //                 />
// //                 <Box sx={{ display: 'flex', justifyContent: 'space-between',color:'text-primary' }}>
// //                     <Typography variant="caption">${filters.priceRange[0]}</Typography>
// //                     <Typography variant="caption">${filters.priceRange[1]}</Typography>
// //                 </Box>
// //             </Box>
// //             <FormControl fullWidth sx={{ mt: 4 }}>
// //                 <InputLabel>Material</InputLabel>
// //                 <Select
// //                     value={filters.material}
// //                     label="Material"
// //                     onChange={(e) => handleFilterChange('material', e.target.value)}
// //                 >
// //                     <MenuItem value="all">All</MenuItem>
// //                     <MenuItem value="gold">Gold</MenuItem>
// //                     <MenuItem value="silver">Silver</MenuItem>
// //                     <MenuItem value="diamond">Diamond</MenuItem>
// //                     <MenuItem value="platinum">Platinum</MenuItem>
// //                 </Select>
// //             </FormControl>
// //         </Box>
// //     );

// //     return (
// //         <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
// //             <Typography variant="h4" color="text-primary" fontWeight="bold" gutterBottom>
// //                 Our <span className="text-primary">Products</span>
// //             </Typography>
// //             <Typography variant="subtitle1" color="text.secondary" paragraph>
// //                 Browse our selection of luxurious jewelry.
// //             </Typography>

// //             <Grid container spacing={2} sx={{ mb: 4 }}>
// //                 <Grid item xs={12} md={6}>
// //                     <TextField
// //                         fullWidth
// //                         variant="outlined"
// //                         placeholder="Search products..."
// //                         value={searchTerm}
// //                         onChange={(e) => setSearchTerm(e.target.value)}
// //                         InputProps={{
// //                             startAdornment: <Search color="action" />,
// //                         }}
// //                     />
// //                 </Grid>
// //                 <Grid item xs={12} md={6}>
// //                     <FormControl fullWidth variant="outlined">
// //                         <InputLabel>Sort By</InputLabel>
// //                         <Select
// //                             value={sortBy}
// //                             onChange={(e) => setSortBy(e.target.value)}
// //                             label="Sort By"
// //                             startAdornment={<Sort color="action" />}
// //                         >
// //                             <MenuItem value="default">Default</MenuItem>
// //                             <MenuItem value="price_asc">Price: Low to High</MenuItem>
// //                             <MenuItem value="price_desc">Price: High to Low</MenuItem>
// //                             <MenuItem value="name_asc">Name: A to Z</MenuItem>
// //                             <MenuItem value="name_desc">Name: Z to A</MenuItem>
// //                         </Select>
// //                     </FormControl>
// //                 </Grid>
// //             </Grid>

// //             <Grid container spacing={4}>
// //                 {isMobile ? (
// //                     <>
// //                         <Grid item xs={12}>
// //                             <IconButton onClick={() => setDrawerOpen(true)} edge="start" color="inherit bg-primary" aria-label="menu">
// //                                 <FilterList />
// //                             </IconButton>
// //                             <Drawer
// //                                 anchor="left"
// //                                 open={drawerOpen}
// //                                 onClose={() => setDrawerOpen(false)}
// //                             >
// //                                 <Box sx={{ width: 250 }} role="presentation">
// //                                     <FilterSection />
// //                                 </Box>
// //                             </Drawer>
// //                         </Grid>
// //                         <Grid item xs={12}>
// //                             <Products filters={filters} searchTerm={searchTerm} sortBy={sortBy} />
// //                         </Grid>
// //                     </>
// //                 ) : (
// //                     <>
// //                         <Grid item xs={12} md={3} lg={2}>
// //                             <FilterSection />
// //                         </Grid>
// //                         <Grid item xs={12} md={9} lg={10}>
// //                             <Products filters={filters} searchTerm={searchTerm} sortBy={sortBy} />
// //                         </Grid>
// //                     </>
// //                 )}
// //             </Grid>
// //         </Box>
// //     );
// // };

// // export default ProductsPage;

// // =====================working---------------------
// // import React, { useState } from 'react';
// // import {
// //     Box,
// //     Typography,
// //     TextField,
// //     Select,
// //     MenuItem,
// //     Slider,
// //     FormControl,
// //     InputLabel,
// //     Grid,
// //     Drawer,
// //     IconButton,
// //     useMediaQuery,
// //     useTheme,
// // } from '@mui/material';
// // import Products from "../components/Products";
// // import { Search, Sort, FilterList } from '@mui/icons-material'; // Corrected import
// //
// // const ProductsPage = () => {
// //     const theme = useTheme();
// //     const isMobile = useMediaQuery(theme.breakpoints.down('md'));
// //     const [drawerOpen, setDrawerOpen] = useState(false);
// //     const [searchTerm, setSearchTerm] = useState('');
// //     const [sortBy, setSortBy] = useState('default');
// //     const [filters, setFilters] = useState({
// //         category: 'all',
// //         priceRange: [0, 5000],
// //         material: 'all'
// //     });
// //
// //     const handleFilterChange = (name, value) => {
// //         setFilters(prevFilters => ({
// //             ...prevFilters,
// //             [name]: value
// //         }));
// //     };
// //
// //     const FilterSection = () => (
// //         <Box sx={{ p: 2 }}>
// //             <Typography variant="h6" gutterBottom>Filters</Typography>
// //             <FormControl fullWidth sx={{ mt: 2 }}>
// //                 <InputLabel>Category</InputLabel>
// //                 <Select
// //                     value={filters.category}
// //                     label="Category"
// //                     onChange={(e) => handleFilterChange('category', e.target.value)}
// //                 >
// //                     <MenuItem value="all">All</MenuItem>
// //                     <MenuItem value="rings">Rings</MenuItem>
// //                     <MenuItem value="necklaces">Necklaces</MenuItem>
// //                     <MenuItem value="bracelets">Bracelets</MenuItem>
// //                     <MenuItem value="earrings">Earrings</MenuItem>
// //                 </Select>
// //             </FormControl>
// //             <Box sx={{ mt: 4 }}>
// //                 <Typography gutterBottom>Price Range</Typography>
// //                 <Slider
// //                     value={filters.priceRange}
// //                     onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
// //                     valueLabelDisplay="auto"
// //                     min={0}
// //                     max={5000}
// //                 />
// //                 <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
// //                     <Typography variant="caption">${filters.priceRange[0]}</Typography>
// //                     <Typography variant="caption">${filters.priceRange[1]}</Typography>
// //                 </Box>
// //             </Box>
// //             <FormControl fullWidth sx={{ mt: 4 }}>
// //                 <InputLabel>Material</InputLabel>
// //                 <Select
// //                     value={filters.material}
// //                     label="Material"
// //                     onChange={(e) => handleFilterChange('material', e.target.value)}
// //                 >
// //                     <MenuItem value="all">All</MenuItem>
// //                     <MenuItem value="gold">Gold</MenuItem>
// //                     <MenuItem value="silver">Silver</MenuItem>
// //                     <MenuItem value="diamond">Diamond</MenuItem>
// //                     <MenuItem value="platinum">Platinum</MenuItem>
// //                 </Select>
// //             </FormControl>
// //         </Box>
// //     );
// //
// //     return (
// //         <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
// //             <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
// //                 Our Products
// //             </Typography>
// //             <Typography variant="subtitle1" color="text.secondary" paragraph>
// //                 Browse our selection of luxurious jewelry.
// //             </Typography>
// //
// //             <Grid container spacing={2} sx={{ mb: 4 }}>
// //                 <Grid item xs={12} md={6}>
// //                     <TextField
// //                         fullWidth
// //                         variant="outlined"
// //                         placeholder="Search products..."
// //                         value={searchTerm}
// //                         onChange={(e) => setSearchTerm(e.target.value)}
// //                         InputProps={{
// //                             startAdornment: <Search color="action" />,
// //                         }}
// //                     />
// //                 </Grid>
// //                 <Grid item xs={12} md={6}>
// //                     <FormControl fullWidth variant="outlined">
// //                         <InputLabel>Sort By</InputLabel>
// //                         <Select
// //                             value={sortBy}
// //                             onChange={(e) => setSortBy(e.target.value)}
// //                             label="Sort By"
// //                             startAdornment={<Sort color="action" />}
// //                         >
// //                             <MenuItem value="default">Default</MenuItem>
// //                             <MenuItem value="price_asc">Price: Low to High</MenuItem>
// //                             <MenuItem value="price_desc">Price: High to Low</MenuItem>
// //                             <MenuItem value="name_asc">Name: A to Z</MenuItem>
// //                             <MenuItem value="name_desc">Name: Z to A</MenuItem>
// //                         </Select>
// //                     </FormControl>
// //                 </Grid>
// //             </Grid>
// //
// //             <Grid container spacing={4}>
// //                 {isMobile ? (
// //                     <>
// //                         <Grid item xs={12}>
// //                             <IconButton onClick={() => setDrawerOpen(true)} edge="start" color="inherit" aria-label="menu">
// //                                 <FilterList />
// //                             </IconButton>
// //                             <Drawer
// //                                 anchor="left"
// //                                 open={drawerOpen}
// //                                 onClose={() => setDrawerOpen(false)}
// //                             >
// //                                 <Box sx={{ width: 250 }} role="presentation">
// //                                     <FilterSection />
// //                                 </Box>
// //                             </Drawer>
// //                         </Grid>
// //                         <Grid item xs={12}>
// //                             <Products filters={filters} searchTerm={searchTerm} sortBy={sortBy} />
// //                         </Grid>
// //                     </>
// //                 ) : (
// //                     <>
// //                         <Grid item xs={12} md={3} lg={2}>
// //                             <FilterSection />
// //                         </Grid>
// //                         <Grid item xs={12} md={9} lg={10}>
// //                             <Products filters={filters} searchTerm={searchTerm} sortBy={sortBy} />
// //                         </Grid>
// //                     </>
// //                 )}
// //             </Grid>
// //         </Box>
// //     );
// // };
// //
// // export default ProductsPage;
// // // =====================================================================

// // import React, { useState } from 'react';
// // import Products from "../components/Products";
// // import {ChevronDownIcon} from "@heroicons/react/16/solid";
// //
// // const ProductsPage = () => {
// //     const [filters, setFilters] = useState({
// //         category: 'all',
// //         priceRange: [0, 5000],
// //         material: 'all'
// //     });
// //
// //     const handleFilterChange = (e) => {
// //         const { name, value } = e.target;
// //         setFilters(prevFilters => ({
// //             ...prevFilters,
// //             [name]: value
// //         }));
// //     };
// //
// //     return (
// //         <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
// //             <h1 className="text-primary text-3xl sm:text-4xl font-bold mb-2">Our Products</h1>
// //             <p className="text-text-light mb-8">Browse our selection of luxurious jewelry.</p>
// //
// //             {/* Filters Section */}
// //             <div className="bg-white shadow-lg rounded-lg p-6 mb-12">
// //                 <h2 className="text-2xl font-semibold mb-6">Filters</h2>
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
// //                     {/* Category Filter */}
// //                     <div className="space-y-2">
// //                         <label htmlFor="category" className="text-text font-medium block">Category</label>
// //                         <div className="relative">
// //                             <select
// //                                 id="category"
// //                                 name="category"
// //                                 value={filters.category}
// //                                 onChange={handleFilterChange}
// //                                 className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
// //                             >
// //                                 <option value="all">All</option>
// //                                 <option value="rings">Rings</option>
// //                                 <option value="necklaces">Necklaces</option>
// //                                 <option value="bracelets">Bracelets</option>
// //                                 <option value="earrings">Earrings</option>
// //                             </select>
// //                             <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
// //                         </div>
// //                     </div>
// //
// //                     {/* Price Range Filter */}
// //                     <div className="space-y-2">
// //                         <label htmlFor="priceRange" className="text-text font-medium block">Price Range</label>
// //                         <input
// //                             id="priceRange"
// //                             type="range"
// //                             name="priceRange"
// //                             min="0"
// //                             max="5000"
// //                             value={filters.priceRange[1]}
// //                             onChange={(e) =>
// //                                 setFilters({
// //                                     ...filters,
// //                                     priceRange: [filters.priceRange[0], parseInt(e.target.value)],
// //                                 })
// //                             }
// //                             className="w-full"
// //                         />
// //                         <div className="flex justify-between text-sm text-gray-600">
// //                             <span>${filters.priceRange[0]}</span>
// //                             <span>${filters.priceRange[1]}</span>
// //                         </div>
// //                     </div>
// //
// //                     {/* Material Filter */}
// //                     <div className="space-y-2">
// //                         <label htmlFor="material" className="text-text font-medium block">Material</label>
// //                         <div className="relative">
// //                             <select
// //                                 id="material"
// //                                 name="material"
// //                                 value={filters.material}
// //                                 onChange={handleFilterChange}
// //                                 className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
// //                             >
// //                                 <option value="all">All</option>
// //                                 <option value="gold">Gold</option>
// //                                 <option value="silver">Silver</option>
// //                                 <option value="diamond">Diamond</option>
// //                                 <option value="platinum">Platinum</option>
// //                             </select>
// //                             <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //
// //             {/* Products Grid */}
// //             <div>
// //                 <Products filters={filters} />
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default ProductsPage;
// // import React, { useState } from 'react';
// // import Products from "../components/Products";
// // import {ChevronDownIcon} from "@heroicons/react/16/solid";
// //
// // const ProductsPage = () => {
// //     const [filters, setFilters] = useState({
// //         category: 'all',
// //         priceRange: [0, 5000],
// //         material: 'all'
// //     });
// //
// //     const handleFilterChange = (e) => {
// //         const { name, value } = e.target;
// //         setFilters(prevFilters => ({
// //             ...prevFilters,
// //             [name]: value
// //         }));
// //     };
// //
// //     return (
// //         <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
// //             <h1 className="text-primary text-3xl sm:text-4xl font-bold mb-2">Our Products</h1>
// //             <p className="text-text-light mb-8">Browse our selection of luxurious jewelry.</p>
// //
// //             <div className="flex flex-col lg:flex-row gap-8">
// //                 {/* Aside for Filters */}
// //                 <aside className="lg:w-1/4">
// //                     <div className="bg-white shadow-lg rounded-lg p-6 sticky top-24">
// //                         <h2 className="text-2xl font-semibold mb-6">Filters</h2>
// //                         <div className="space-y-6">
// //                             {/* Category Filter */}
// //                             <div className="space-y-2">
// //                                 <label htmlFor="category" className="text-text font-medium block">Category</label>
// //                                 <div className="relative">
// //                                     <select
// //                                         id="category"
// //                                         name="category"
// //                                         value={filters.category}
// //                                         onChange={handleFilterChange}
// //                                         className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
// //                                     >
// //                                         <option value="all">All</option>
// //                                         <option value="rings">Rings</option>
// //                                         <option value="necklaces">Necklaces</option>
// //                                         <option value="bracelets">Bracelets</option>
// //                                         <option value="earrings">Earrings</option>
// //                                     </select>
// //                                     <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
// //                                 </div>
// //                             </div>
// //
// //                             {/* Price Range Filter */}
// //                             <div className="space-y-2">
// //                                 <label htmlFor="priceRange" className="text-text font-medium block">Price Range</label>
// //                                 <input
// //                                     id="priceRange"
// //                                     type="range"
// //                                     name="priceRange"
// //                                     min="0"
// //                                     max="5000"
// //                                     value={filters.priceRange[1]}
// //                                     onChange={(e) =>
// //                                         setFilters({
// //                                             ...filters,
// //                                             priceRange: [filters.priceRange[0], parseInt(e.target.value)],
// //                                         })
// //                                     }
// //                                     className="w-full"
// //                                 />
// //                                 <div className="flex justify-between text-sm text-gray-600">
// //                                     <span>${filters.priceRange[0]}</span>
// //                                     <span>${filters.priceRange[1]}</span>
// //                                 </div>
// //                             </div>
// //
// //                             {/* Material Filter */}
// //                             <div className="space-y-2">
// //                                 <label htmlFor="material" className="text-text font-medium block">Material</label>
// //                                 <div className="relative">
// //                                     <select
// //                                         id="material"
// //                                         name="material"
// //                                         value={filters.material}
// //                                         onChange={handleFilterChange}
// //                                         className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
// //                                     >
// //                                         <option value="all">All</option>
// //                                         <option value="gold">Gold</option>
// //                                         <option value="silver">Silver</option>
// //                                         <option value="diamond">Diamond</option>
// //                                         <option value="platinum">Platinum</option>
// //                                     </select>
// //                                     <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </aside>
// //
// //                 {/* Main Content Area */}
// //                 <main className="lg:w-3/4">
// //                     <Products filters={filters} />
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default ProductsPage;
// // import React, { useState } from 'react';
// // import Products from "../components/Products";
// //
// // const ProductsPage = () => {
// //     // State for managing filters (example: category, price range, material)
// //     const [filters, setFilters] = useState({
// //         category: 'all',
// //         priceRange: [0, 5000],
// //         material: 'all'
// //     });
// //
// //     const handleFilterChange = (e) => {
// //         const { name, value } = e.target;
// //         setFilters(prevFilters => ({
// //             ...prevFilters,
// //             [name]: value
// //         }));
// //     };
// //
// //     return (
// //         <div className="p-6 lg:p-8">
// //             <h1 className="text-primary text-4xl font-bold">Our Products</h1>
// //             <p className="text-text-light mt-4">Browse our selection of luxurious jewelry.</p>
// //
// //             {/* Filters Section */}
// //             <div className="mt-8">
// //                 <h2 className="text-2xl font-semibold mb-4">Filters</h2>
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
// //                     {/* Category Filter */}
// //                     <div>
// //                         <label className="text-text font-medium">Category</label>
// //                         <select
// //                             name="category"
// //                             value={filters.category}
// //                             onChange={handleFilterChange}
// //                             className="mt-2 block w-full bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-700"
// //                         >
// //                             <option value="all">All</option>
// //                             <option value="rings">Rings</option>
// //                             <option value="necklaces">Necklaces</option>
// //                             <option value="bracelets">Bracelets</option>
// //                             <option value="earrings">Earrings</option>
// //                         </select>
// //                     </div>
// //
// //                     {/* Price Range Filter */}
// //                     <div>
// //                         <label className="text-text font-medium">Price Range</label>
// //                         <input
// //                             type="range"
// //                             name="priceRange"
// //                             min="0"
// //                             max="5000"
// //                             value={filters.priceRange[1]}
// //                             onChange={(e) =>
// //                                 setFilters({
// //                                     ...filters,
// //                                     priceRange: [filters.priceRange[0], parseInt(e.target.value)],
// //                                 })
// //                             }
// //                             className="mt-2 block w-full"
// //                         />
// //                         <div className="flex justify-between text-sm mt-2">
// //                             <span>${filters.priceRange[0]}</span>
// //                             <span>${filters.priceRange[1]}</span>
// //                         </div>
// //                     </div>
// //
// //                     {/* Material Filter */}
// //                     <div>
// //                         <label className="text-text font-medium">Material</label>
// //                         <select
// //                             name="material"
// //                             value={filters.material}
// //                             onChange={handleFilterChange}
// //                             className="mt-2 block w-full bg-white border border-gray-300 rounded-lg py-2 px-4 text-gray-700"
// //                         >
// //                             <option value="all">All</option>
// //                             <option value="gold">Gold</option>
// //                             <option value="silver">Silver</option>
// //                             <option value="diamond">Diamond</option>
// //                             <option value="platinum">Platinum</option>
// //                         </select>
// //                     </div>
// //                 </div>
// //             </div>
// //
// //             {/* Products Grid */}
// //             <div className="mt-12">
// //                 <Products filters={filters} />
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default ProductsPage;

// // import React from 'react';
// // import Products from "../components/Products";
// //
// // const ProductsPage = () => (
// //     <div>
// //         <h1 className="text-primary text-4xl">Our Products</h1>
// //         <p className="text-text-light mt-4">Browse our selection of luxurious jewelry.</p>
// //         <Products/>
// //     </div>
// // );
// //
// // export default ProductsPage;