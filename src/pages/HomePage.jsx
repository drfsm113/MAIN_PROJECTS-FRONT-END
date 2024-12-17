import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Carousel from "../components/Carousel";
import Categories from "../components/Categories";
import Products from "../components/Products";
import Banners from "../components/Banners";

const API_BASE_URL = 'http://127.0.0.1:8000/api/v1/admin'; // Replace with your actual API base URL

const HomePage = () => {
    const [carouselImages, setCarouselImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCarouselData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/carousels/`);
                const carousels = response.data.results.data;
                const images = carousels
                    .filter(carousel => carousel.is_active && carousel.image)
                    .map(carousel => carousel.image);
                setCarouselImages(images);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching carousel data:', err);
                setError('Failed to load carousel images');
                setLoading(false);
            }
        };

        fetchCarouselData();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Or a more sophisticated loading component
    }

    if (error) {
        return <div>{error}</div>; // Or a more user-friendly error message
    }

    return (
        <div className="space-y-1 md:space-y-6 lg:space-y-1 xl:space-y-0 2xl:space-y-0 ">
            {/* Carousel Component */}
            {carouselImages.length > 0 && <Carousel images={carouselImages} />}

            {/* Content Wrapper */}
            <div className="px-1 md:px-2 lg:px-2 xl:px-3 2xl:px-0">
                {/* Banner Component */}
                <Banners />

                {/* Categories Component */}
                <Categories />

                {/* Products Component */}
                <Products />
            </div>
        </div>
    );
};

export default HomePage;
// import React from 'react';
// import Carousel from "../components/Carousel";
// import Categories from "../components/Categories";
// import Products from "../components/Products";
// import Banners from "../components/Banners";
//
// const HomePage = () => {
//     const images = [
//         'https://pmjjewels.com/web/image/sf.web.element/39/image/homebanner',
//         'https://pmjjewels.com/web/image/sf.web.element/40/image/homebanner',
//         // Add more image URLs as needed
//     ];
//
//     return (
//         <div className="space-y-4 md:space-y-6 lg:space-y-8">
//             {/* Carousel Component */}
//             <Carousel images={images} />
//
//             {/* Content Wrapper */}
//             <div className="px-4 md:px-6 lg:px-8">
//                 {/* Banner Component */}
//                 <Banners />
//
//                 {/* Categories Component */}
//                 <Categories />
//
//                 {/* Products Component */}
//                 <Products />
//             </div>
//         </div>
//     );
// };
//
// export default HomePage;
//
