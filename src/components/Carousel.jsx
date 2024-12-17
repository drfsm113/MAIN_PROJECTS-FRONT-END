import React, { useState, useEffect } from 'react';

const Carousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        console.log('Carousel mounted or images changed. Images length:', images.length);
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => {
                const newIndex = (prevIndex + 1) % images.length;
                console.log('Auto-advancing to slide:', newIndex);
                return newIndex;
            });
        }, 5000);

        return () => {
            console.log('Clearing interval');
            clearInterval(interval);
        };
    }, [images.length]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % images.length;
            console.log('Manual next slide. New index:', newIndex);
            return newIndex;
        });
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => {
            const newIndex = (prevIndex - 1 + images.length) % images.length;
            console.log('Manual previous slide. New index:', newIndex);
            return newIndex;
        });
    };

    console.log('Rendering carousel. Current index:', currentIndex);

    return (
        <div className="relative w-full overflow-hidden rounded-lg
                        h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[500px] 2xl:h-[850px]">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <img
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className="object-fill w-full h-full rounded-lg"
                        onLoad={() => console.log(`Image ${index + 1} loaded`)}
                        onError={() => console.error(`Error loading image ${index + 1}`)}
                    />
                </div>
            ))}
            <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2
                           bg-white bg-opacity-50 rounded-full p-1 sm:p-2
                           hover:bg-primary hover:bg-opacity-75 transition-all duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2
                           bg-white bg-opacity-50 rounded-full p-1 sm:p-2
                           hover:bg-primary hover:bg-opacity-75 transition-all duration-300"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            console.log(`Dot clicked. Changing to slide:`, index);
                            setCurrentIndex(index);
                        }}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                            index === currentIndex ? 'bg-primary' : 'bg-white bg-opacity-50 hover:bg-primary hover:bg-opacity-75'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;

// import React, { useState, useEffect } from 'react';
//
// const Carousel = ({ images }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//
//     useEffect(() => {
//         console.log('Carousel mounted or images changed. Images length:', images.length);
//         const interval = setInterval(() => {
//             setCurrentIndex((prevIndex) => {
//                 const newIndex = (prevIndex + 1) % images.length;
//                 console.log('Auto-advancing to slide:', newIndex);
//                 return newIndex;
//             });
//         }, 5000);
//
//         return () => {
//             console.log('Clearing interval');
//             clearInterval(interval);
//         };
//     }, [images.length]);
//
//     const nextSlide = () => {
//         setCurrentIndex((prevIndex) => {
//             const newIndex = (prevIndex + 1) % images.length;
//             console.log('Manual next slide. New index:', newIndex);
//             return newIndex;
//         });
//     };
//
//     const prevSlide = () => {
//         setCurrentIndex((prevIndex) => {
//             const newIndex = (prevIndex - 1 + images.length) % images.length;
//             console.log('Manual previous slide. New index:', newIndex);
//             return newIndex;
//         });
//     };
//
//     console.log('Rendering carousel. Current index:', currentIndex);
//
//     return (
//         <div className="relative w-full overflow-hidden rounded-lg
//                         h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 2xl:h-96">
//             {images.map((image, index) => (
//                 <div
//                     key={index}
//                     className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
//                         index === currentIndex ? 'opacity-100' : 'opacity-0'
//                     }`}
//                 >
//                     <img
//                         src={image}
//                         alt={`Slide ${index + 1}`}
//                         className="object-cover w-full h-full rounded-lg"
//                         onLoad={() => console.log(`Image ${index + 1} loaded`)}
//                         onError={() => console.error(`Error loading image ${index + 1}`)}
//                     />
//                 </div>
//             ))}
//             <button
//                 onClick={prevSlide}
//                 className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2
//                            bg-white bg-opacity-50 rounded-full p-1 sm:p-2
//                            hover:bg-primary hover:bg-opacity-75 transition-all duration-300"
//             >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//             </button>
//             <button
//                 onClick={nextSlide}
//                 className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2
//                            bg-white bg-opacity-50 rounded-full p-1 sm:p-2
//                            hover:bg-primary hover:bg-opacity-75 transition-all duration-300"
//             >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//             </button>
//             <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
//                 {images.map((_, index) => (
//                     <button
//                         key={index}
//                         onClick={() => {
//                             console.log(`Dot clicked. Changing to slide:`, index);
//                             setCurrentIndex(index);
//                         }}
//                         className={`w-1.5 h-96 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
//                             index === currentIndex ? 'bg-primary' : 'bg-white bg-opacity-50 hover:bg-primary hover:bg-opacity-75'
//                         }`}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default Carousel;

// import React, { useState, useEffect } from 'react';
//
// const Carousel = ({ images }) => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//
//     useEffect(() => {
//         console.log('Carousel mounted or images changed. Images length:', images.length);
//         const interval = setInterval(() => {
//             setCurrentIndex((prevIndex) => {
//                 const newIndex = (prevIndex + 1) % images.length;
//                 console.log('Auto-advancing to slide:', newIndex);
//                 return newIndex;
//             });
//         }, 5000);
//
//         return () => {
//             console.log('Clearing interval');
//             clearInterval(interval);
//         };
//     }, [images.length]);
//
//     const nextSlide = () => {
//         setCurrentIndex((prevIndex) => {
//             const newIndex = (prevIndex + 1) % images.length;
//             console.log('Manual next slide. New index:', newIndex);
//             return newIndex;
//         });
//     };
//
//     const prevSlide = () => {
//         setCurrentIndex((prevIndex) => {
//             const newIndex = (prevIndex - 1 + images.length) % images.length;
//             console.log('Manual previous slide. New index:', newIndex);
//             return newIndex;
//         });
//     };
//
//     console.log('Rendering carousel. Current index:', currentIndex);
//
//     return (
//         <div className="relative w-full overflow-hidden rounded-lg h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 2xl:h-96">
//             {images.map((image, index) => (
//                 <div
//                     key={index}
//                     className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
//                         index === currentIndex ? 'opacity-100' : 'opacity-0'
//                     }`}
//                 >
//                     <img
//                         src={image}
//                         alt={`Slide ${index + 1}`}
//                         className="object-cover w-full h-full rounded-lg"
//                         onLoad={() => console.log(`Image ${index + 1} loaded`)}
//                         onError={() => console.error(`Error loading image ${index + 1}`)}
//                     />
//                 </div>
//             ))}
//             <button
//                 onClick={prevSlide}
//                 className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2
//                            bg-white bg-opacity-50 rounded-full p-1 sm:p-2
//                            hover:bg-primary hover:bg-opacity-75 transition-all duration-300"
//             >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//             </button>
//             <button
//                 onClick={nextSlide}
//                 className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2
//                            bg-white bg-opacity-50 rounded-full p-1 sm:p-2
//                            hover:bg-primary hover:bg-opacity-75 transition-all duration-300"
//             >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//             </button>
//             <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
//                 {images.map((_, index) => (
//                     <button
//                         key={index}
//                         onClick={() => {
//                             console.log(`Dot clicked. Changing to slide:`, index);
//                             setCurrentIndex(index);
//                         }}
//                         className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
//                             index === currentIndex ? 'bg-primary' : 'bg-white bg-opacity-50 hover:bg-primary hover:bg-opacity-75'
//                         }`}
//                     />
//                 ))}
//             </div>
//         </div>
//     );
// };
//
// export default Carousel;
//
// // import React, { useState, useEffect } from 'react';
// //
// // const Carousel = ({ images }) => {
// //     const [currentIndex, setCurrentIndex] = useState(0);
// //
// //     useEffect(() => {
// //         console.log('Carousel mounted or images changed. Images length:', images.length);
// //         const interval = setInterval(() => {
// //             setCurrentIndex((prevIndex) => {
// //                 const newIndex = (prevIndex + 1) % images.length;
// //                 console.log('Auto-advancing to slide:', newIndex);
// //                 return newIndex;
// //             });
// //         }, 5000);
// //
// //         return () => {
// //             console.log('Clearing interval');
// //             clearInterval(interval);
// //         };
// //     }, [images.length]);
// //
// //     const nextSlide = () => {
// //         setCurrentIndex((prevIndex) => {
// //             const newIndex = (prevIndex + 1) % images.length;
// //             console.log('Manual next slide. New index:', newIndex);
// //             return newIndex;
// //         });
// //     };
// //
// //     const prevSlide = () => {
// //         setCurrentIndex((prevIndex) => {
// //             const newIndex = (prevIndex - 1 + images.length) % images.length;
// //             console.log('Manual previous slide. New index:', newIndex);
// //             return newIndex;
// //         });
// //     };
// //
// //     console.log('Rendering carousel. Current index:', currentIndex);
// //
// //     return (
// //         <div className="relative w-full overflow-hidden rounded-lg
// //                         h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 2xl:h-96 3xl:h-108 4xl:h-150">
// //             {images.map((image, index) => (
// //                 <div
// //                     key={index}
// //                     className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
// //                         index === currentIndex ? 'opacity-100' : 'opacity-0'
// //                     }`}
// //                 >
// //                     <img
// //                         src={image}
// //                         alt={`Slide ${index + 1}`}
// //                         className="object-cover w-full h-full rounded-lg"
// //                         onLoad={() => console.log(`Image ${index + 1} loaded`)}
// //                         onError={() => console.error(`Error loading image ${index + 1}`)}
// //                     />
// //                 </div>
// //             ))}
// //             <button
// //                 onClick={prevSlide}
// //                 className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2
// //                            bg-white bg-opacity-50 rounded-full p-1 sm:p-2
// //                            hover:bg-primary hover:bg-opacity-75 transition-all duration-300"
// //             >
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
// //                 </svg>
// //             </button>
// //             <button
// //                 onClick={nextSlide}
// //                 className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2
// //                            bg-white bg-opacity-50 rounded-full p-1 sm:p-2
// //                            hover:bg-primary hover:bg-opacity-75 transition-all duration-300"
// //             >
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
// //                 </svg>
// //             </button>
// //             <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
// //                 {images.map((_, index) => (
// //                     <button
// //                         key={index}
// //                         onClick={() => {
// //                             console.log(`Dot clicked. Changing to slide:`, index);
// //                             setCurrentIndex(index);
// //                         }}
// //                         className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
// //                             index === currentIndex ? 'bg-primary' : 'bg-white bg-opacity-50 hover:bg-primary hover:bg-opacity-75'
// //                         }`}
// //                     />
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default Carousel;
//
// // import React, { useState, useEffect } from 'react';
// //
// // const Carousel = ({ images }) => {
// //     const [currentIndex, setCurrentIndex] = useState(0);
// //
// //     useEffect(() => {
// //         console.log('Carousel mounted or images changed. Images length:', images.length);
// //         const interval = setInterval(() => {
// //             setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
// //         }, 5000);
// //
// //         return () => clearInterval(interval);
// //     }, [images.length]);
// //
// //     const nextSlide = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
// //     const prevSlide = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
// //
// //     return (
// //         <div className="relative w-full overflow-hidden rounded-lg
// //                         h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80 2xl:h-96 3xl:h-108 4xl:h-120">
// //             {images.map((image, index) => (
// //                 <div
// //                     key={index}
// //                     className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
// //                         index === currentIndex ? 'opacity-100' : 'opacity-0'
// //                     }`}
// //                 >
// //                     <img
// //                         src={image}
// //                         alt={`Slide ${index + 1}`}
// //                         className="object-cover w-full h-full rounded-lg"
// //                     />
// //                 </div>
// //             ))}
// //             <button
// //                 onClick={prevSlide}
// //                 className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2
// //                            bg-white bg-opacity-50 rounded-full p-1 sm:p-2
// //                            hover:bg-primary hover:bg-opacity-75 transition-all duration-300"
// //                 aria-label="Previous slide"
// //             >
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
// //                 </svg>
// //             </button>
// //             <button
// //                 onClick={nextSlide}
// //                 className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2
// //                            bg-white bg-opacity-50 rounded-full p-1 sm:p-2
// //                            hover:bg-primary hover:bg-opacity-75 transition-all duration-300"
// //                 aria-label="Next slide"
// //             >
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
// //                 </svg>
// //             </button>
// //             <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
// //                 {images.map((_, index) => (
// //                     <button
// //                         key={index}
// //                         onClick={() => setCurrentIndex(index)}
// //                         className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
// //                             index === currentIndex ? 'bg-primary' : 'bg-white bg-opacity-50 hover:bg-primary hover:bg-opacity-75'
// //                         }`}
// //                         aria-label={`Go to slide ${index + 1}`}
// //                     />
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default Carousel;
// // import React from "react";
// // import Slider from "react-slick";
// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";
// // import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
// //
// // const images = [
// //     "https://pmjjewels.com/web/image/sf.web.element/39/image/homebanner",
// //     "https://pmjjewels.com/web/image/sf.web.element/40/image/homebanner",
// //     // Add more image URLs as needed
// // ];
// //
// // const NextArrow = ({ onClick }) => (
// //     <button
// //         onClick={onClick}
// //         className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-primary hover:bg-opacity-75 rounded-full p-2 z-10 transition-all duration-300"
// //         aria-label="Next slide"
// //     >
// //         <ChevronRightIcon className="w-6 h-6 text-gray-800" />
// //     </button>
// // );
// //
// // const PrevArrow = ({ onClick }) => (
// //     <button
// //         onClick={onClick}
// //         className="absolute left-2 top-1/2 -translate-y-1/2 bg-transparent hover:bg-primary hover:bg-opacity-75 rounded-full p-2 z-10 transition-all duration-300"
// //         aria-label="Previous slide"
// //     >
// //         <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
// //     </button>
// // );
// //
// // const Carousel = () => {
// //     const settings = {
// //         dots: true,
// //         infinite: true,
// //         speed: 500,
// //         slidesToShow: 1,
// //         slidesToScroll: 1,
// //         autoplay: true,
// //         autoplaySpeed: 5000,
// //         nextArrow: <NextArrow />,
// //         prevArrow: <PrevArrow />,
// //         customPaging: (i) => (
// //             <div className="w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full bg-gray-400 opacity-50 hover:bg-primary hover:opacity-100 transition-opacity duration-300"></div>
// //         ),
// //         dotsClass: "slick-dots absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2"
// //     };
// //
// //     return (
// //         <div className="w-full max-w-4xl lg:max-w-6xl mx-auto lg:h-96 relative">
// //             <Slider {...settings} className="rounded-lg overflow-hidden">
// //                 {images.map((image, index) => (
// //                     <div key={index} className="w-full h-48 sm:h-64 md:h-80 lg:h-96">
// //                         <img
// //                             src={image}
// //                             alt={`Slide ${index + 1}`}
// //                             className="w-full h-full object-conatin rounded-lg"
// //                         />
// //                     </div>
// //                 ))}
// //             </Slider>
// //         </div>
// //     );
// // };
// //
// // export default Carousel;
// // import React, { useState, useEffect, useCallback } from 'react';
// //
// // const Carousel = ({ images }) => {
// //     const [currentIndex, setCurrentIndex] = useState(0);
// //     const [isAutoPlaying, setIsAutoPlaying] = useState(true);
// //     const [touchStart, setTouchStart] = useState(0);
// //     const [touchEnd, setTouchEnd] = useState(0);
// //
// //     const goToSlide = useCallback((index) => {
// //         setCurrentIndex(index);
// //     }, []);
// //
// //     const nextSlide = useCallback(() => {
// //         setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
// //     }, [images.length]);
// //
// //     const prevSlide = useCallback(() => {
// //         setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
// //     }, [images.length]);
// //
// //     const toggleAutoPlay = () => {
// //         setIsAutoPlaying(!isAutoPlaying);
// //     };
// //
// //     useEffect(() => {
// //         let interval;
// //         if (isAutoPlaying) {
// //             interval = setInterval(nextSlide, 5000);
// //         }
// //         return () => clearInterval(interval);
// //     }, [isAutoPlaying, nextSlide]);
// //
// //     const handleTouchStart = (e) => {
// //         setTouchStart(e.targetTouches[0].clientX);
// //     };
// //
// //     const handleTouchMove = (e) => {
// //         setTouchEnd(e.targetTouches[0].clientX);
// //     };
// //
// //     const handleTouchEnd = () => {
// //         if (touchStart - touchEnd > 75) {
// //             nextSlide();
// //         }
// //         if (touchStart - touchEnd < -75) {
// //             prevSlide();
// //         }
// //     };
// //
// //     return (
// //         <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden rounded-lg shadow-xl">
// //             <div
// //                 className="flex transition-transform ease-out duration-500"
// //                 style={{ transform: `translateX(-${currentIndex * 100}%)` }}
// //                 onTouchStart={handleTouchStart}
// //                 onTouchMove={handleTouchMove}
// //                 onTouchEnd={handleTouchEnd}
// //             >
// //                 {images.map((image, index) => (
// //                     <img
// //                         key={index}
// //                         src={image}
// //                         alt={`Slide ${index + 1}`}
// //                         className="object-cover w-full h-full flex-shrink-0"
// //                     />
// //                 ))}
// //             </div>
// //
// //             <div className="absolute inset-0 flex items-center justify-between p-4">
// //                 <button
// //                     onClick={prevSlide}
// //                     className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
// //                 >
// //                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
// //                     </svg>
// //                 </button>
// //                 <button
// //                     onClick={nextSlide}
// //                     className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
// //                 >
// //                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
// //                     </svg>
// //                 </button>
// //             </div>
// //
// //             <div className="absolute bottom-4 right-0 left-0">
// //                 <div className="flex items-center justify-center gap-2">
// //                     {images.map((_, index) => (
// //                         <div
// //                             key={index}
// //                             onClick={() => goToSlide(index)}
// //                             className={`
// //                                 transition-all w-2 h-2 bg-white rounded-full
// //                                 ${currentIndex === index ? "p-2" : "bg-opacity-50"}
// //                             `}
// //                         />
// //                     ))}
// //                 </div>
// //             </div>
// //
// //             <button
// //                 onClick={toggleAutoPlay}
// //                 className="absolute top-4 right-4 p-2 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
// //             >
// //                 {isAutoPlaying ? (
// //                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                     </svg>
// //                 ) : (
// //                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
// //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //                     </svg>
// //                 )}
// //             </button>
// //         </div>
// //     );
// // };
// //
// // export default Carousel;
// //<editor-fold desc="carsoul">
// // import React, { useState, useEffect } from 'react';
// //
// // const Carousel = ({ images }) => {
// //     const [currentIndex, setCurrentIndex] = useState(0);
// //
// //     useEffect(() => {
// //         console.log('Carousel mounted or images changed. Images length:', images.length);
// //         const interval = setInterval(() => {
// //             setCurrentIndex((prevIndex) => {
// //                 const newIndex = (prevIndex + 1) % images.length;
// //                 console.log('Auto-advancing to slide:', newIndex);
// //                 return newIndex;
// //             });
// //         }, 5000);
// //
// //         return () => {
// //             console.log('Clearing interval');
// //             clearInterval(interval);
// //         };
// //     }, [images.length]);
// //
// //     const nextSlide = () => {
// //         setCurrentIndex((prevIndex) => {
// //             const newIndex = (prevIndex + 1) % images.length;
// //             console.log('Manual next slide. New index:', newIndex);
// //             return newIndex;
// //         });
// //     };
// //
// //     const prevSlide = () => {
// //         setCurrentIndex((prevIndex) => {
// //             const newIndex = (prevIndex - 1 + images.length) % images.length;
// //             console.log('Manual previous slide. New index:', newIndex);
// //             return newIndex;
// //         });
// //     };
// //
// //     console.log('Rendering carousel. Current index:', currentIndex);
// //
// //     return (
// //         <div className="relative w-full h-64 lg:h-96 overflow-hidden rounded-lg">
// //             {images.map((image, index) => (
// //                 <div
// //                     key={index}
// //                     className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
// //                         index === currentIndex ? 'opacity-100' : 'opacity-0'
// //                     }`}
// //                 >
// //                     <img
// //                         src={image}
// //                         alt={`Slide ${index + 1}`}
// //                         className="object-conatin w-full h-full rounded-lg"
// //                         onLoad={() => console.log(`Image ${index + 1} loaded`)}
// //                         onError={() => console.error(`Error loading image ${index + 1}`)}
// //                     />
// //                 </div>
// //             ))}
// //             <button
// //                 onClick={prevSlide}
// //                 className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-primary hover:bg-opacity-75 transition-all duration-300"
// //             >
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
// //                 </svg>
// //             </button>
// //             <button
// //                 onClick={nextSlide}
// //                 className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-primary hover:bg-opacity-75 transition-all duration-300"
// //             >
// //                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
// //                 </svg>
// //             </button>
// //             <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
// //                 {images.map((_, index) => (
// //                     <button
// //                         key={index}
// //                         onClick={() => {
// //                             console.log(`Dot clicked. Changing to slide:`, index);
// //                             setCurrentIndex(index);
// //                         }}
// //                         className={`w-3 h-3 rounded-full transition-all duration-300 ${
// //                             index === currentIndex ? 'bg-primary' : 'bg-white bg-opacity-50 hover:bg-primary hover:bg-opacity-75'
// //                         }`}
// //                     />
// //                 ))}
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default Carousel;
// //</editor-fold>
//
//
//
//
//
//
//
//
//
//
//
