import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = 'http://127.0.0.1:8000';

const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
};

const CircularCard = ({ name, image }) => (
    <motion.div
        className="flex items-center justify-center p-4"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
    >
        <div className="relative w-40 h-40">
            <img
                src={image || 'https://via.placeholder.com/150'}
                alt={name}
                className="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg transform transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-background text-lg font-semibold bg-text bg-opacity-50 p-2 rounded-full shadow-md hover:bg-primary">
                    {name}
                </span>
            </div>
        </div>
    </motion.div>
);

const CategoriesGrid = ({ categories }) => {
    const sliderRef = useRef(null);
    const [showControls, setShowControls] = useState(false);

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        autoplay: true,
        autoplaySpeed: 5000,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <div
            className="relative p-8 bg-background"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <Slider ref={sliderRef} {...settings}>
                {categories.map((category) => (
                    <CircularCard key={category.id} name={category.name} image={category.image} />
                ))}
            </Slider>

            {showControls && (
                <>
                    <motion.button
                        onClick={() => sliderRef.current.slickPrev()}
                        className="absolute top-1/2 left-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition duration-300 z-10 flex items-center justify-center"
                        style={{ top: '40%' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: showControls ? 1 : 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeftIcon className="h-6 w-6" />
                    </motion.button>
                    <motion.button
                        onClick={() => sliderRef.current.slickNext()}
                        className="absolute top-1/2 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition duration-300 z-10 flex items-center justify-center"
                        style={{ top: '40%' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: showControls ? 1 : 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronRightIcon className="h-6 w-6" />
                    </motion.button>
                </>
            )}
        </div>
    );
};

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/categories/root_categories/`);
                const rootCategories = response.data.results.filter(cat => cat.is_active && cat.parent === null);
                setCategories(rootCategories);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return <div>Loading categories...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
                Our <span className="text-primary">Categories</span>
            </h2>
            <CategoriesGrid categories={categories} />
        </>
    );
};

export default Categories;
// ============
// import React, { useRef, useState } from 'react';
// import { motion } from 'framer-motion';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
//
// const categories = [
//     { title: 'Rings', image: 'https://pmjjewels.com/web/image/sf.web.element/45/image' },
//     { title: 'Necklaces', image: 'https://pmjjewels.com/web/image/sf.web.element/44/image' },
//     { title: 'Bracelets', image: 'https://pmjjewels.com/web/image/sf.web.element/43/image' },
//     { title: 'Earrings', image: 'https://pmjjewels.com/web/image/sf.web.element/42/image' },
//     // Add more categories as needed
// ];
//
// const cardVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1 },
// };
//
// const CircularCard = ({ title, image }) => (
//     <motion.div
//         className="flex items-center justify-center p-4"
//         variants={cardVariants}
//         initial="hidden"
//         animate="visible"
//         whileHover={{ scale: 1.1, rotate: 5 }}
//         whileTap={{ scale: 0.95 }}
//         transition={{ duration: 0.4, ease: "easeInOut" }}
//     >
//         <div className="relative w-40 h-40">
//             <img
//                 src={image}
//                 alt={title}
//                 className="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg transform transition-transform duration-300 hover:scale-110"
//             />
//             <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-background text-lg font-semibold bg-text bg-opacity-50 p-2 rounded-full shadow-md hover:bg-primary">
//                     {title}
//                 </span>
//             </div>
//         </div>
//     </motion.div>
// );
// const CategoriesGrid = () => {
//     const sliderRef = useRef(null);
//     const [showControls, setShowControls] = useState(false);
//
//     const settings = {
//         dots: false,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 3,
//         autoplay: true,
//         autoplaySpeed: 5000,
//         slidesToScroll: 1,
//         arrows: false, // Hide default arrows
//         responsive: [
//             {
//                 breakpoint: 1024,
//                 settings: {
//                     slidesToShow: 2,
//                     slidesToScroll: 1,
//                 },
//             },
//             {
//                 breakpoint: 600,
//                 settings: {
//                     slidesToShow: 1,
//                     slidesToScroll: 1,
//                 },
//             },
//         ],
//     };
//
//     return (
//         <div
//             className="relative p-8 bg-background"
//             onMouseEnter={() => setShowControls(true)}
//             onMouseLeave={() => setShowControls(false)}
//         >
//             <Slider ref={sliderRef} {...settings}>
//                 {categories.map((category, index) => (
//                     <CircularCard key={index} title={category.title} image={category.image} />
//                 ))}
//             </Slider>
//
//             {/* Custom Controls */}
//             {showControls && (
//                 <>
//                     <motion.button
//                         onClick={() => sliderRef.current.slickPrev()}
//                         className="absolute top-1/2 left-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition duration-300 z-10 flex items-center justify-center"
//                         style={{ top: '40%' }} // Center vertically without transform
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: showControls ? 1 : 0 }}
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.95 }}
//                     >
//                         <ChevronLeftIcon className="h-6 w-6" />
//                     </motion.button>
//                     <motion.button
//                         onClick={() => sliderRef.current.slickNext()}
//                         className="absolute top-1/2 right-4 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition duration-300 z-10 flex items-center justify-center"
//                         style={{ top: '40%' }} // Center vertically without transform
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: showControls ? 1 : 0 }}
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.95 }}
//                     >
//                         <ChevronRightIcon className="h-6 w-6" />
//                     </motion.button>
//                 </>
//             )}
//         </div>
//     );
// };
//
// const Categories = () => {
//     return (
//         <>
//             <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
//                 Our <span className="text-primary">Categories</span>
//             </h2>
//             <CategoriesGrid/>
//         </>
//     );
// };
//
// export default Categories;

// import React, { useRef, useState } from 'react';
// import { motion } from 'framer-motion';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'; // Import icons
//
// const categories = [
//     { title: 'Rings', image: 'https://pmjjewels.com/web/image/sf.web.element/45/image' },
//     { title: 'Necklaces', image: 'https://pmjjewels.com/web/image/sf.web.element/44/image' },
//     { title: 'Bracelets', image: 'https://pmjjewels.com/web/image/sf.web.element/43/image' },
//     { title: 'Earrings', image: 'https://pmjjewels.com/web/image/sf.web.element/42/image' },
//     // Add more categories as needed
// ];
//
// const cardVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1 },
// };
//
// const CircularCard = ({ title, image }) => (
//     <motion.div
//         className="flex items-center justify-center p-4"
//         variants={cardVariants}
//         initial="hidden"
//         animate="visible"
//         whileHover={{ scale: 1.1, rotate: 5 }}
//         whileTap={{ scale: 0.95 }}
//         transition={{ duration: 0.4, ease: "easeInOut" }}
//     >
//         <div className="relative w-40 h-40">
//             <img
//                 src={image}
//                 alt={title}
//                 className="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg transform transition-transform duration-300 hover:scale-110"
//             />
//             <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-background text-lg font-semibold bg-text bg-opacity-50 p-2 rounded-full shadow-md">
//                     {title}
//                 </span>
//             </div>
//         </div>
//     </motion.div>
// );
//
// const CategoriesGrid = () => {
//     const sliderRef = useRef(null);
//     const [showControls, setShowControls] = useState(false);
//
//     const settings = {
//         dots: false,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 3,
//         autoplay: true,
//         autoplaySpeed: 5000,
//         slidesToScroll: 1,
//         arrows: false, // Hide default arrows
//         responsive: [
//             {
//                 breakpoint: 1024,
//                 settings: {
//                     slidesToShow: 2,
//                     slidesToScroll: 1,
//                 },
//             },
//             {
//                 breakpoint: 600,
//                 settings: {
//                     slidesToShow: 1,
//                     slidesToScroll: 1,
//                 },
//             },
//         ],
//     };
//
//     return (
//         <div
//             className="relative p-8 bg-background"
//             onMouseEnter={() => setShowControls(true)}
//             onMouseLeave={() => setShowControls(false)}
//         >
//
//             <Slider ref={sliderRef} {...settings}>
//                 {categories.map((category, index) => (
//                     <CircularCard key={index} title={category.title} image={category.image} />
//                 ))}
//             </Slider>
//
//             {/* Custom Controls */}
//             {showControls && (
//                 <>
//                     <motion.button
//                         onClick={() => sliderRef.current.slickPrev()}
//                         className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition duration-300 z-10"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: showControls ? 1 : 0 }}
//                         whileHover={{ scale: 1.2, rotate: -10 }}
//                         whileTap={{ scale: 0 }}
//                     >
//                         <ChevronLeftIcon className="h-6 w-6" />
//                     </motion.button>
//                     <motion.button
//                         onClick={() => sliderRef.current.slickNext()}
//                         className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition duration-300 z-10"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: showControls ? 1 : 0 }}
//                         whileHover={{ scale: 1.2, rotate: 10 }}
//                         whileTap={{ scale: 0 }}
//                     >
//                         <ChevronRightIcon className="h-6 w-6" />
//                     </motion.button>
//                 </>
//             )}
//         </div>
//     );
// };
//
// // src/components/Categories.jsx
//
// const Categories = () => {
//     return (
//         <>
//             <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 text-center">
//                 Our Categories
//             </h2>
//             <CategoriesGrid />
//         </>
//     );
// };
//
// export default Categories;
//

// import React, { useRef, useState } from 'react';
// import { motion } from 'framer-motion';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'; // Import icons
//
// const categories = [
//     { title: 'Rings', image: 'https://pmjjewels.com/web/image/sf.web.element/45/image' },
//     { title: 'Necklaces', image: 'https://pmjjewels.com/web/image/sf.web.element/44/image' },
//     { title: 'Bracelets', image: 'https://pmjjewels.com/web/image/sf.web.element/43/image' },
//     { title: 'Earrings', image: 'https://pmjjewels.com/web/image/sf.web.element/42/image' },
//     // Add more categories as needed
// ];
//
// const cardVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1 },
// };
//
// const CircularCard = ({ title, image }) => (
//     <motion.div
//         className="flex items-center justify-center p-4"
//         variants={cardVariants}
//         initial="hidden"
//         animate="visible"
//         whileHover={{ scale: 1.1, rotate: 5 }}
//         whileTap={{ scale: 0.95 }}
//         transition={{ duration: 0.4, ease: "easeInOut" }}
//     >
//         <div className="relative w-40 h-40">
//             <img
//                 src={image}
//                 alt={title}
//                 className="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg transform transition-transform duration-300 hover:scale-110"
//             />
//             <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-background text-lg font-semibold bg-text bg-opacity-50 p-2 rounded-full shadow-md">
//                     {title}
//                 </span>
//             </div>
//         </div>
//     </motion.div>
// );
//
// const Categories = () => {
//     const sliderRef = useRef(null);
//     const [showControls, setShowControls] = useState(false);
//
//     const settings = {
//         dots: false,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 3,
//         autoplay: true,
//         autoplaySpeed: 5000,
//         slidesToScroll: 1,
//         arrows: false, // Hide default arrows
//         responsive: [
//             {
//                 breakpoint: 1024,
//                 settings: {
//                     slidesToShow: 2,
//                     slidesToScroll: 1,
//                 },
//             },
//             {
//                 breakpoint: 600,
//                 settings: {
//                     slidesToShow: 1,
//                     slidesToScroll: 1,
//                 },
//             },
//         ],
//     };
//
//     return (
//         <div
//             className="relative p-8 bg-background"
//             onMouseEnter={() => setShowControls(true)}
//             onMouseLeave={() => setShowControls(false)}
//         >
//             {/* Responsive Heading */}
//             <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6 text-center">
//                 Categories
//             </h2>
//
//             <Slider ref={sliderRef} {...settings}>
//                 {categories.map((category, index) => (
//                     <CircularCard key={index} title={category.title} image={category.image} />
//                 ))}
//             </Slider>
//
//             {/* Custom Controls */}
//             {showControls && (
//                 <>
//                     <motion.button
//                         onClick={() => sliderRef.current.slickPrev()}
//                         className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition duration-300"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: showControls ? 1 : 0 }}
//                         whileHover={{ scale: 1.2, rotate: -10 }}
//                         whileTap={{ scale: 0.9 }}
//                     >
//                         <ChevronLeftIcon className="h-6 w-6" />
//                     </motion.button>
//                     <motion.button
//                         onClick={() => sliderRef.current.slickNext()}
//                         className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition duration-300"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: showControls ? 1 : 0 }}
//                         whileHover={{ scale: 1.2, rotate: 10 }}
//                         whileTap={{ scale: 0.9 }}
//                     >
//                         <ChevronRightIcon className="h-6 w-6" />
//                     </motion.button>
//                 </>
//             )}
//         </div>
//     );
// };
//
// export default Categories;

// import React, { useRef, useState } from 'react';
// import { motion } from 'framer-motion';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'; // Import icons
//
// const categories = [
//     { title: 'Rings', image: 'https://pmjjewels.com/web/image/sf.web.element/45/image' },
//     { title: 'Necklaces', image: 'https://pmjjewels.com/web/image/sf.web.element/44/image' },
//     { title: 'Bracelets', image: 'https://pmjjewels.com/web/image/sf.web.element/43/image' },
//     { title: 'Earrings', image: 'https://pmjjewels.com/web/image/sf.web.element/42/image' },
//     // Add more categories as needed
// ];
//
// const cardVariants = {
//     hidden: { opacity: 0, scale: 0.8 },
//     visible: { opacity: 1, scale: 1 },
// };
//
// const CircularCard = ({ title, image }) => (
//     <motion.div
//         className="flex items-center justify-center p-4"
//         variants={cardVariants}
//         initial="hidden"
//         animate="visible"
//         whileHover={{ scale: 1.1, rotate: 5 }}
//         whileTap={{ scale: 0.95 }}
//         transition={{ duration: 0.4, ease: "easeInOut" }}
//     >
//         <div className="relative w-40 h-40">
//             <img
//                 src={image}
//                 alt={title}
//                 className="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg transform transition-transform duration-300 hover:scale-110"
//             />
//             <div className="absolute inset-0 flex items-center justify-center">
//         <span className="text-background text-lg font-semibold bg-text bg-opacity-50 p-2 rounded-full shadow-md">
//           {title}
//         </span>
//             </div>
//         </div>
//     </motion.div>
// );
//
// const Categories = () => {
//     const sliderRef = useRef(null);
//     const [showControls, setShowControls] = useState(false);
//
//     const settings = {
//         dots: false,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 3,
//         autoplay: true,
//         autoplaySpeed: 5000,
//         slidesToScroll: 1,
//         arrows: false, // Hide default arrows
//         responsive: [
//             {
//                 breakpoint: 1024,
//                 settings: {
//                     slidesToShow: 2,
//                     slidesToScroll: 1,
//                 },
//             },
//             {
//                 breakpoint: 600,
//                 settings: {
//                     slidesToShow: 1,
//                     slidesToScroll: 1,
//                 },
//             },
//         ],
//     };
//
//     return (
//
//         <div
//             className="relative p-8 bg-background"
//             onMouseEnter={() => setShowControls(true)}
//             onMouseLeave={() => setShowControls(false)}
//         >
//
//             <Slider ref={sliderRef} {...settings}>
//                 {categories.map((category, index) => (
//                     <CircularCard key={index} title={category.title} image={category.image} />
//                 ))}
//             </Slider>
//             {/* Custom Controls */}
//             {showControls && (
//                 <>
//                     <motion.button
//                         onClick={() => sliderRef.current.slickPrev()}
//                         className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition duration-300"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: showControls ? 1 : 0 }}
//                         whileHover={{ scale: 1.2, rotate: -10 }}
//                         whileTap={{ scale: 0.9 }}
//                     >
//                         <ChevronLeftIcon className="h-6 w-6" />
//                     </motion.button>
//                     <motion.button
//                         onClick={() => sliderRef.current.slickNext()}
//                         className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary-dark transition duration-300"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: showControls ? 1 : 0 }}
//                         whileHover={{ scale: 1.2, rotate: 10 }}
//                         whileTap={{ scale: 0.9 }}
//                     >
//                         <ChevronRightIcon className="h-6 w-6" />
//                     </motion.button>
//                 </>
//             )}
//         </div>
//     );
// };
//
// export default Categories;

// import React, { useRef } from 'react';
// import { motion } from 'framer-motion';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
//
// const categories = [
//     { title: 'Rings', image: 'https://pmjjewels.com/web/image/sf.web.element/45/image' },
//     { title: 'Necklaces', image: 'https://pmjjewels.com/web/image/sf.web.element/44/image' },
//     { title: 'Bracelets', image: 'https://pmjjewels.com/web/image/sf.web.element/43/image' },
//     { title: 'Earrings', image: 'https://pmjjewels.com/web/image/sf.web.element/42/image' },
//     // Add more categories as needed
// ];
//
// const CircularCard = ({ title, image }) => (
//     <motion.div
//         className="flex items-center justify-center p-4"
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         transition={{ duration: 0.3 }}
//     >
//         <div className="relative w-40 h-40">
//             <img
//                 src={image}
//                 alt={title}
//                 className="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg transform transition-transform duration-300 hover:scale-110"
//             />
//             <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-background text-lg font-semibold bg-text bg-opacity-50 p-2 rounded-full shadow-md">{title}</span>
//             </div>
//         </div>
//     </motion.div>
// );
//
// const Categories = () => {
//     const sliderRef = useRef(null);
//
//     const settings = {
//         dots: false,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 3,
//         slidesToScroll: 1,
//         responsive: [
//             {
//                 breakpoint: 1024,
//                 settings: {
//                     slidesToShow: 2,
//                     slidesToScroll: 1,
//                 },
//             },
//             {
//                 breakpoint: 600,
//                 settings: {
//                     slidesToShow: 1,
//                     slidesToScroll: 1,
//                 },
//             },
//         ],
//     };
//
//     return (
//         <div className="p-8 bg-background relative">
//             <Slider ref={sliderRef} {...settings}>
//                 {categories.map((category, index) => (
//                     <CircularCard key={index} title={category.title} image={category.image} />
//                 ))}
//             </Slider>
//             {/* Custom Controls */}
//             <button
//                 onClick={() => sliderRef.current.slickPrev()}
//                 className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow-lg"
//             >
//                 &lt;
//             </button>
//             <button
//                 onClick={() => sliderRef.current.slickNext()}
//                 className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full shadow-lg"
//             >
//                 &gt;
//             </button>
//         </div>
//     );
// };
//
// export default Categories;

// import React from 'react';
// import { motion } from 'framer-motion';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
//
// const categories = [
//     { title: 'Rings', image: 'https://pmjjewels.com/web/image/sf.web.element/45/image' },
//     { title: 'Necklaces', image: 'https://pmjjewels.com/web/image/sf.web.element/44/image' },
//     { title: 'Bracelets', image: 'https://pmjjewels.com/web/image/sf.web.element/43/image' },
//     { title: 'Earrings', image: 'https://pmjjewels.com/web/image/sf.web.element/42/image' },
//     // Add more categories as needed
// ];
//
// const CircularCard = ({ title, image }) => (
//     <motion.div
//         className="flex items-center justify-center p-4"
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         transition={{ duration: 0.3 }}
//     >
//         <div className="relative w-40 h-40">
//             <img
//                 src={image}
//                 alt={title}
//                 className="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg transform transition-transform duration-300 hover:scale-110"
//             />
//             <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-background text-lg font-semibold bg-text bg-opacity-50 p-2 rounded-full shadow-md">{title}</span>
//             </div>
//         </div>
//     </motion.div>
// );
//
// const Categories = () => {
//     const settings = {
//         dots: false,
//         infinite: true,
//         speed: 500,
//         slidesToShow: 3,
//         slidesToScroll: 1,
//         responsive: [
//             {
//                 breakpoint: 1024,
//                 settings: {
//                     slidesToShow: 2,
//                     slidesToScroll: 1,
//                 },
//             },
//             {
//                 breakpoint: 600,
//                 settings: {
//                     slidesToShow: 1,
//                     slidesToScroll: 1,
//                 },
//             },
//         ],
//     };
//
//     return (
//         <div className="p-8 bg-background">
//             <Slider {...settings}>
//                 {categories.map((category, index) => (
//                     <CircularCard key={index} title={category.title} image={category.image} />
//                 ))}
//             </Slider>
//         </div>
//     );
// };
//
// export default Categories;

// import React from 'react';
//
// const CategoryCard = ({ title, image }) => {
//     return (
//         <div className="relative flex items-center justify-center w-40 h-40 mx-auto">
//             <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-300 bg-gray-200">
//                 <img
//                     src={image}
//                     alt={title}
//                     className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
//                 />
//             </div>
//             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full">
//                 <h3 className="text-white text-lg font-semibold">{title}</h3>
//             </div>
//         </div>
//     );
// };
//
// const categories = [
//     { title: 'Rings', image: 'https://pmjjewels.com/web/image/sf.web.element/45/image' },
//     { title: 'Necklaces', image: 'https://pmjjewels.com/web/image/sf.web.element/44/image' },
//     { title: 'Bracelets', image: 'https://pmjjewels.com/web/image/sf.web.element/43/image' },
//     { title: 'Earrings', image: 'https://pmjjewels.com/web/image/sf.web.element/42/image' },
//     // Add more categories as needed
// ];
//
// const CategoriesGrid = () => {
//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h2 className="text-3xl font-bold text-center mb-8">Categories</h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
//                 {categories.map((category, index) => (
//                     <CategoryCard
//                         key={index}
//                         title={category.title}
//                         image={category.image}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default CategoriesGrid;


// src/components/CategoryCard.jsx
// import React from 'react';
//
// const CategoryCard = ({ title, image }) => {
//     return (
//         <div className="relative flex items-center justify-center w-40 h-40">
//             <div className="w-full h-full rounded-full overflow-hidden bg-gray-200">
//                 <img
//                     src={image}
//                     alt={title}
//                     className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-110"
//                 />
//             </div>
//             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-full">
//                 <h3 className="text-white text-xl font-semibold">{title}</h3>
//             </div>
//         </div>
//     );
// };
//
//
// const categories = [
//     { title: 'Rings', image: 'https://pmjjewels.com/web/image/sf.web.element/45/image' },
//     { title: 'Necklaces', image: 'https://pmjjewels.com/web/image/sf.web.element/44/image' },
//     { title: 'Bracelets', image: 'https://pmjjewels.com/web/image/sf.web.element/43/image' },
//     { title: 'Earrings', image: 'https://pmjjewels.com/web/image/sf.web.element/42/image' },
//     // Add more categories as needed
// ];
//
// const CategoriesGrid = () => {
//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h2 className="text-3xl font-bold text-center mb-6">Categories</h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
//                 {categories.map((category, index) => (
//                     <CategoryCard
//                         key={index}
//                         title={category.title}
//                         image={category.image}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default CategoriesGrid;

// import React from 'react';
// import { motion } from 'framer-motion';
//
// const categories = [
//     { title: 'Rings', image: 'https://pmjjewels.com/web/image/sf.web.element/45/image' },
//     { title: 'Necklaces', image: 'https://pmjjewels.com/web/image/sf.web.element/44/image' },
//     { title: 'Bracelets', image: 'https://pmjjewels.com/web/image/sf.web.element/43/image' },
//     { title: 'Earrings', image: 'https://pmjjewels.com/web/image/sf.web.element/42/image' },
//     // Add more categories as needed
// ];
//
// const CircularCard = ({ title, image }) => (
//     <motion.div
//         className="flex items-center justify-center p-4"
//         whileHover={{ scale: 1.05, y: -10 }}
//         whileTap={{ scale: 0.95 }}
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.5 }}
//     >
//         <div className="relative w-full h-full flex items-center justify-center">
//             <div className="w-40 h-40 flex items-center justify-center overflow-hidden rounded-full">
//                 <img
//                     src={image}
//                     alt={title}
//                     className="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg transform transition-transform duration-300"
//                 />
//             </div>
//             <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-background text-lg font-semibold bg-text bg-opacity-50 p-2 rounded-full shadow-md">{title}</span>
//             </div>
//         </div>
//     </motion.div>
// );
//
// const Categories = () => {
//     return (
//         <div className="p-8 bg-background">
//             <h2 className="text-3xl font-bold text-primary mb-6 text-center">Our Categories</h2>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {categories.map((category, index) => (
//                     <CircularCard key={index} title={category.title} image={category.image} />
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default Categories;
//
// import React from 'react';
// import { motion } from 'framer-motion';
//
// const categories = [
//     { title: 'Rings', image: 'https://pmjjewels.com/web/image/sf.web.element/45/image' },
//     { title: 'Necklaces', image: 'https://pmjjewels.com/web/image/sf.web.element/44/image' },
//     { title: 'Bracelets', image: 'https://pmjjewels.com/web/image/sf.web.element/43/image' },
//     { title: 'Earrings', image: 'https://pmjjewels.com/web/image/sf.web.element/42/image' },
//     // Add more categories as needed
// ];
//
// const CircularCard = ({ title, image }) => (
//     <motion.div
//         className="flex items-center justify-center p-4"
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         transition={{ duration: 0.3 }}
//     >
//         <div className="relative w-40 h-40">
//             <img
//                 src={image}
//                 alt={title}
//                 className="w-full h-full object-cover rounded-full border-4 border-primary shadow-lg transform transition-transform duration-300 hover:scale-110"
//             />
//             <div className="absolute inset-0 flex items-center justify-center">
//                 <span className="text-background text-lg font-semibold bg-text bg-opacity-50 p-2 rounded-full shadow-md">{title}</span>
//             </div>
//         </div>
//     </motion.div>
// );
//
// const Categories = () => {
//     return (
//         <div className="p-8 bg-background">
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {categories.map((category, index) => (
//                     <CircularCard key={index} title={category.title} image={category.image} />
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default Categories;

