import React, { useState, useEffect, useCallback } from 'react';
import {useParams, Link, useLocation} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaRegStar } from 'react-icons/fa';
import { FiShare2 } from 'react-icons/fi';
import MagnifyGlass from "../utils/MagnifyGlass";
import api from "../Services/api";
import WishlistButton from "../components/WishlistButton";
import AddToCartButton from "../components/AddToCartButton";
import {fetchWishlist} from "../store/Slices/WishlistSlice";

const API_BASE_URL = 'api/v2/client';
const API_BASE_URL_review = 'api/v1/client';

const ProductDetailPage = () => {
    const { slug } = useParams();
    const location = useLocation();
    const isLoggedIn = useSelector(state => state.auth.user !== null);
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('details');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [currentImage, setCurrentImage] = useState(0);

    const fetchProductAndReviews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [productResponse, reviewsResponse] = await Promise.all([
                api.get(`${API_BASE_URL}/products/${slug}/`),
                api.get(`${API_BASE_URL_review}/reviews/?product=${slug}`)
            ]);
            setProduct(productResponse.data);
            setReviews(reviewsResponse.data.results);
            if (productResponse.data.is_variant && productResponse.data.variants.length > 0) {
                setSelectedVariant(productResponse.data.variants[0]);
                initializeOptions(productResponse.data.variants[0]);
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching the data.');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchProductAndReviews();
        dispatch(fetchWishlist());
    }, [fetchProductAndReviews,dispatch]);

    const initializeOptions = (variant) => {
        if (!variant) return;
        const initialOptions = {};
        variant.attribute_values.forEach(attr => {
            initialOptions[attr.attribute_name] = attr.value;
        });
        setSelectedOptions(initialOptions);
    };

    const handleOptionChange = (optionName, value) => {
        const newOptions = { ...selectedOptions, [optionName]: value };
        setSelectedOptions(newOptions);

        if (product.variants) {
            const newVariant = product.variants.find(variant =>
                variant.attribute_values.every(attr =>
                    newOptions[attr.attribute_name] === attr.value
                )
            );

            if (newVariant) {
                setSelectedVariant(newVariant);
                setCurrentImage(0);
            }
        }
    };

    const getAvailableOptions = (optionName) => {
        if (!product.variants) return [];
        const availableOptions = new Set();
        product.variants.forEach(variant => {
            const matchesCurrentSelection = Object.entries(selectedOptions).every(([key, value]) => {
                if (key === optionName) return true;
                return variant.attribute_values.some(attr => attr.attribute_name === key && attr.value === value);
            });
            if (matchesCurrentSelection) {
                const option = variant.attribute_values.find(attr => attr.attribute_name === optionName);
                if (option) availableOptions.add(option.value);
            }
        });
        return Array.from(availableOptions);
    };

    const isOptionAvailable = (optionName, value) => {
        return getAvailableOptions(optionName).includes(value);
    };

    const ThumbImage = ({ src, alt, index }) => (
        <motion.img
            src={src}
            alt={alt}
            className={`w-16 h-16 object-cover cursor-pointer rounded-lg ${index === currentImage ? 'border-2 border-primary' : ''}`}
            onClick={() => setCurrentImage(index)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        />
    );

    const RatingStars = ({ rating }) => (
        <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                    {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
                </span>
            ))}
        </div>
    );

    const PriceDisplay = () => (
        <div className="mb-4">
            <span className="text-2xl md:text-3xl font-bold text-primary">
                ${product.is_variant ? (selectedVariant ? selectedVariant.price : product.display_price) : product.display_price}
            </span>
            {parseFloat(product.display_price) < parseFloat(product.base_price) && (
                <span className="ml-2 text-gray-500 line-through">${product.base_price}</span>
            )}
        </div>
    );

    const VariantSelector = () => (
        <div className="mb-6">
            {product.grouped_options && product.grouped_options.map(option => (
                <div key={option.name} className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">{option.name}</h3>
                    <div className="flex flex-wrap gap-2">
                        {option.values.map(value => {
                            const isColorOption = option.name.toLowerCase() === 'color';
                            const isColorCode = isColorOption && /^#[0-9A-F]{6}$/i.test(value);

                            if (isColorOption && isColorCode) {
                                return (
                                    <motion.div
                                        key={value}
                                        className="relative"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <input
                                            type="radio"
                                            id={`color-${value}`}
                                            name={option.name}
                                            value={value}
                                            checked={selectedOptions[option.name] === value}
                                            onChange={() => handleOptionChange(option.name, value)}
                                            className="sr-only"
                                        />
                                        <label
                                            htmlFor={`color-${value}`}
                                            className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2"
                                            style={{ backgroundColor: value, borderColor: selectedOptions[option.name] === value ? '#000' : 'transparent' }}
                                        >
                                            {selectedOptions[option.name] === value && (
                                                <span className="text-white text-xs">✓</span>
                                            )}
                                        </label>
                                        <span className="sr-only">{value}</span>
                                    </motion.div>
                                );
                            }

                            return (
                                <motion.button
                                    key={value}
                                    onClick={() => handleOptionChange(option.name, value)}
                                    className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
                                        selectedOptions[option.name] === value
                                            ? 'bg-primary text-white'
                                            : isOptionAvailable(option.name, value)
                                                ? 'bg-gray-200 text-gray-800'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                    disabled={!isOptionAvailable(option.name, value)}
                                    whileHover={isOptionAvailable(option.name, value) ? { scale: 1.05 } : {}}
                                    whileTap={isOptionAvailable(option.name, value) ? { scale: 0.95 } : {}}
                                >
                                    {value}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
    //
    // const AddToCartButton = () => {
    //     const handleAddToCart = () => {
    //         if (isLoggedIn) {
    //             const cartItem = {
    //                 quantity,
    //                 ...(product.is_variant && product.variants.length > 0
    //                     ? { product_variant_slug: selectedVariant.slug }
    //                     : { product_slug: product.slug })
    //             };
    //             dispatch(addToCart(cartItem));
    //         } else {
    //             navigate('/login', { state: { from: `/product/${product.slug}` } });
    //         }
    //     };
    //
    //     return (
    //         <motion.button
    //             className={`w-full py-2 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-base md:text-lg flex items-center justify-center ${
    //                 product.is_in_stock ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
    //             }`}
    //             whileHover={product.is_in_stock ? { scale: 1.02 } : {}}
    //             whileTap={product.is_in_stock ? { scale: 0.98 } : {}}
    //             disabled={!product.is_in_stock}
    //             onClick={handleAddToCart}
    //         >
    //             <FaShoppingCart className="mr-2" />
    //             {product?.is_in_stock ? (isLoggedIn ? 'Add to Cart' : 'Add to Cart') : 'Out of Stock'}
    //         </motion.button>
    //     );
    // };
    const ReviewForm = ({ onReviewAdded }) => {
        const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '', pros: '', cons: '' });
        const [uploadedImages, setUploadedImages] = useState([]);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');

        const handleReviewChange = (e) => {
            const { name, value } = e.target;
            setNewReview(prev => ({ ...prev, [name]: value }));
        };

        const handleImageUpload = (e) => {
            setUploadedImages(Array.from(e.target.files));
        };

        const resetForm = () => {
            setNewReview({ rating: 5, title: '', comment: '', pros: '', cons: '' });
            setUploadedImages([]);
        };

        const submitReview = async (e) => {
            e.preventDefault(); // Prevent default form submission
            if (!isLoggedIn) {
                setError('You must be logged in to submit a review.');
                return;
            }
            setIsSubmitting(true);
            setError('');
            setSuccess('');

            try {
                const formData = new FormData();
                formData.append('product', product.id);
                formData.append('rating', newReview.rating);
                formData.append('title', newReview.title);
                formData.append('comment', newReview.comment);
                formData.append('pros', newReview.pros);
                formData.append('cons', newReview.cons);
                uploadedImages.forEach(image => {
                    formData.append('uploaded_images', image);
                });

                const response = await api.post(`${API_BASE_URL_review}/reviews/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                onReviewAdded(response.data);
                setSuccess('Review submitted successfully!');
                resetForm();
            } catch (err) {
                console.error('Error submitting review:', err);
                setError('Failed to submit review. Please try again.');
            } finally {
                setIsSubmitting(false);
            }
        };

        if (!isLoggedIn) {
            return (
                <div className="text-center p-4 bg-gray-100 rounded-lg">
                    <p>Please log in to write a review.</p>
                </div>
            );
        }

        return (
            <form onSubmit={submitReview} className="space-y-4">
                <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                {error && <div className="text-red-500">{error}</div>}
                {success && <div className="text-green-500">{success}</div>}
                <div>
                    <label className="block mb-2">Rating</label>
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                className="text-2xl focus:outline-none"
                            >
                                {star <= newReview.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
                            </button>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="review-title" className="block mb-2">Title</label>
                    <input
                        id="review-title"
                        type="text"
                        name="title"
                        value={newReview.title}
                        onChange={handleReviewChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="review-comment" className="block mb-2">Comment</label>
                    <textarea
                        id="review-comment"
                        name="comment"
                        value={newReview.comment}
                        onChange={handleReviewChange}
                        className="w-full p-2 border rounded"
                        rows="4"
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="review-pros" className="block mb-2">Pros</label>
                    <input
                        id="review-pros"
                        type="text"
                        name="pros"
                        value={newReview.pros}
                        onChange={handleReviewChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label htmlFor="review-cons" className="block mb-2">Cons</label>
                    <input
                        id="review-cons"
                        type="text"
                        name="cons"
                        value={newReview.cons}
                        onChange={handleReviewChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label htmlFor="review-images" className="block mb-2">Images</label>
                    <input
                        id="review-images"
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="w-full p-2 border rounded"
                        accept="image/*"
                    />
                </div>
                <motion.button
                    type="submit"
                    className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </motion.button>
            </form>
        );
    };
    const ReviewsList = ({ reviews }) => (
        <div>
            {reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review.id} className="mb-6 border-b pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <div>
                                <div className="flex items-center">
                                    <RatingStars rating={review.rating} />
                                    <span className="ml-2 font-semibold">{review.title}</span>
                                </div>
                                <p className="text-sm text-gray-600">{review.user_name}</p>
                            </div>
                            <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                        <p className="mb-2">{review.comment}</p>
                        {review.pros && <p className="text-green-600">Pros: {review.pros}</p>}
                        {review.cons && <p className="text-red-600">Cons: {review.cons}</p>}
                        {review.images && review.images.length > 0 && (
                            <div className="flex flex-wrap mt-2 gap-2">
                                {review.images.map(img => (
                                    <img key={img.id} src={img.image} alt="Review" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded" />
                                ))}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No reviews yet. Be the first to review this product!</p>
            )}
        </div>
    );

    const TabContent = () => {
        switch (activeTab) {
            case 'details':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                            {product.specifications.map((spec, index) => (
                                <li key={index}>{spec.name}: {spec.value}</li>
                            ))}
                        </ul>
                    </motion.div>
                );
            case 'description':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4"
                    >
                        <p className="text-gray-700">{product.description}</p>
                    </motion.div>
                );
            case 'reviews':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <h3 className="text-2xl font-semibold mb-2 sm:mb-0">Customer Reviews</h3>
                            <Link
                                to={`/product/${slug}/reviews`}
                                className="text-primary hover:text-primary-dark transition duration-300"
                            >
                                View All Reviews
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <ReviewForm onReviewAdded={(newReview) => setReviews(prevReviews => [newReview, ...prevReviews])} />
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold mb-4">Recent Reviews</h4>
                                <ReviewsList reviews={reviews} />
                                <Link
                                    to={`/product/${slug}/reviews`}
                                    className="mt-4 inline-block text-primary hover:text-primary-dark transition duration-300"
                                >
                                    See More Reviews
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                );
            default:
                return null;
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <motion.div
                className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );

    if (error) return (
        <div className="text-center py-10 text-red-500">
            <h2 className="text-xl md:text-2xl font-bold mb-4">Error</h2>
            <p>{error}</p>
        </div>
    );

    if (!product) return <div className="text-center py-10">Product not found.</div>;

    const images = product.is_variant && selectedVariant ? selectedVariant.images : product.images;

    return (
        <div className="bg-gray-100 min-h-screen py-4 md:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="bg-white rounded-lg shadow-lg p-4 md:p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* Left column: Images */}
                        <div className="space-y-4">
                            <div className="aspect-w-1 aspect-h-1">
                                {images.length > 0 ? (
                                    <MagnifyGlass imageSrc={images[currentImage].image} />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <p>No image available</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-2 overflow-x-auto">
                                {images.map((img, index) => (
                                    <ThumbImage key={img.id} src={img.image} alt={img.alt_text} index={index} />
                                ))}
                            </div>
                        </div>

                        {/* Right column: Product details */}
                        <div className="space-y-4">
                            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
                            <div className="flex items-center">
                                <RatingStars rating={product.average_rating || 0} />
                                <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
                            </div>
                            <PriceDisplay />
                            <p className="text-gray-700">{product.description}</p>
                            {product.is_variant && product.variants.length > 0 && <VariantSelector />}
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-700">Quantity:</span>
                                <div className="flex items-center border rounded">
                                    <motion.button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        -
                                    </motion.button>
                                    <span className="px-4 py-1">{quantity}</span>
                                    <motion.button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        +
                                    </motion.button>
                                </div>
                            </div>
                            <AddToCartButton
                                product={product}
                                selectedVariant={selectedVariant}
                                quantity={quantity}
                                currentPath={location.pathname}
                            />
                            <div className="flex justify-between">
                                <WishlistButton
                                    product={product}
                                    selectedVariant={selectedVariant}
                                    currentPath={location.pathname}
                                />
                                    {/*<motion.button*/}
                                {/*    className="flex items-center text-primary hover:text-primary-dark"*/}
                                {/*    whileHover={{ scale: 1.05 }}*/}
                                {/*    whileTap={{ scale: 0.95 }}*/}
                                {/*>*/}
                                {/*    <FaHeart className="mr-2" /> Add to Wishlist*/}
                                {/*</motion.button>*/}
                                <motion.button
                                    className="flex items-center text-primary hover:text-primary-dark"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <FiShare2 className="mr-2" /> Share
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mt-8 md:mt-12">
                        <div className="border-b">
                            <div className="flex flex-wrap -mb-px">
                                {['details', 'description', 'reviews'].map((tab) => (
                                    <motion.button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`mr-2 py-2 px-4 font-medium text-sm md:text-base ${
                                            activeTab === tab
                                                ? 'border-b-2 border-primary text-primary'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ y: 0 }}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4 md:mt-6">
                            <AnimatePresence mode="wait">
                                <TabContent />
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetailPage;

// ==========================old wrking wbellow=================
// import React, { useState, useEffect, useCallback } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaStar, FaRegStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
// import { FiShare2 } from 'react-icons/fi';
// import { addToCart } from "../store/Slices/CartSlice";
// import MagnifyGlass from "../utils/MagnifyGlass";
// import api from "../Services/api";
//
// const API_BASE_URL = 'api/v2/client';
// const API_BASE_URL_review = 'api/v1/client';
//
// const ProductDetailPage = () => {
//     const { slug } = useParams();
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//     const isLoggedIn = useSelector(state => state.auth.user !== null);
//
//     const [product, setProduct] = useState(null);
//     const [reviews, setReviews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [quantity, setQuantity] = useState(1);
//     const [activeTab, setActiveTab] = useState('details');
//     const [selectedVariant, setSelectedVariant] = useState(null);
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [currentImage, setCurrentImage] = useState(0);
//
//     const fetchProductAndReviews = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const [productResponse, reviewsResponse] = await Promise.all([
//                 api.get(`${API_BASE_URL}/products/${slug}/`),
//                 api.get(`${API_BASE_URL_review}/reviews/?product=${slug}`)
//             ]);
//             setProduct(productResponse.data);
//             setReviews(reviewsResponse.data.results);
//             if (productResponse.data.is_variant && productResponse.data.variants.length > 0) {
//                 setSelectedVariant(productResponse.data.variants[0]);
//                 initializeOptions(productResponse.data.variants[0]);
//             }
//         } catch (err) {
//             setError(err.message || 'An error occurred while fetching the data.');
//         } finally {
//             setLoading(false);
//         }
//     }, [slug]);
//
//     useEffect(() => {
//         fetchProductAndReviews();
//     }, [fetchProductAndReviews]);
//     const handleNewReview = useCallback((newReview) => {
//         console.log('New review received:', newReview);
//         setReviews(prevReviews => {
//             const updatedReviews = [newReview, ...prevReviews];
//             console.log('Updated reviews:', updatedReviews);
//             return updatedReviews;
//         });
//     }, []);
//     const initializeOptions = (variant) => {
//         if (!variant) return;
//         const initialOptions = {};
//         variant.attribute_values.forEach(attr => {
//             initialOptions[attr.attribute_name] = attr.value;
//         });
//         setSelectedOptions(initialOptions);
//     };
//
//     const handleOptionChange = (optionName, value) => {
//         const newOptions = { ...selectedOptions, [optionName]: value };
//         setSelectedOptions(newOptions);
//
//         if (product.variants) {
//             const newVariant = product.variants.find(variant =>
//                 variant.attribute_values.every(attr =>
//                     newOptions[attr.attribute_name] === attr.value
//                 )
//             );
//
//             if (newVariant) {
//                 setSelectedVariant(newVariant);
//                 setCurrentImage(0);
//             }
//         }
//     };
//
//     const getAvailableOptions = (optionName) => {
//         if (!product.variants) return [];
//         const availableOptions = new Set();
//         product.variants.forEach(variant => {
//             const matchesCurrentSelection = Object.entries(selectedOptions).every(([key, value]) => {
//                 if (key === optionName) return true;
//                 return variant.attribute_values.some(attr => attr.attribute_name === key && attr.value === value);
//             });
//             if (matchesCurrentSelection) {
//                 const option = variant.attribute_values.find(attr => attr.attribute_name === optionName);
//                 if (option) availableOptions.add(option.value);
//             }
//         });
//         return Array.from(availableOptions);
//     };
//
//     const isOptionAvailable = (optionName, value) => {
//         return getAvailableOptions(optionName).includes(value);
//     };
//
//     const ThumbImage = ({ src, alt, index }) => (
//         <motion.img
//             src={src}
//             alt={alt}
//             className={`w-16 h-16 object-cover cursor-pointer rounded-lg ${index === currentImage ? 'border-2 border-primary' : ''}`}
//             onClick={() => setCurrentImage(index)}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//         />
//     );
//
//     const RatingStars = ({ rating }) => (
//         <div className="flex">
//             {[1, 2, 3, 4, 5].map((star) => (
//                 <span key={star}>
//                     {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
//                 </span>
//             ))}
//         </div>
//     );
//
//     const PriceDisplay = () => (
//         <div className="mb-4">
//             <span className="text-2xl md:text-3xl font-bold text-primary">
//                 ${product.is_variant ? (selectedVariant ? selectedVariant.price : product.display_price) : product.display_price}
//             </span>
//             {parseFloat(product.display_price) < parseFloat(product.base_price) && (
//                 <span className="ml-2 text-gray-500 line-through">${product.base_price}</span>
//             )}
//         </div>
//     );
//
//     const VariantSelector = () => (
//         <div className="mb-6">
//             {product.grouped_options && product.grouped_options.map(option => (
//                 <div key={option.name} className="mb-4">
//                     <h3 className="text-lg font-semibold mb-2">{option.name}</h3>
//                     <div className="flex flex-wrap gap-2">
//                         {option.values.map(value => {
//                             const isColorOption = option.name.toLowerCase() === 'color';
//                             const isColorCode = isColorOption && /^#[0-9A-F]{6}$/i.test(value);
//
//                             if (isColorOption && isColorCode) {
//                                 return (
//                                     <motion.div
//                                         key={value}
//                                         className="relative"
//                                         whileHover={{ scale: 1.1 }}
//                                         whileTap={{ scale: 0.9 }}
//                                     >
//                                         <input
//                                             type="radio"
//                                             id={`color-${value}`}
//                                             name={option.name}
//                                             value={value}
//                                             checked={selectedOptions[option.name] === value}
//                                             onChange={() => handleOptionChange(option.name, value)}
//                                             className="sr-only"
//                                         />
//                                         <label
//                                             htmlFor={`color-${value}`}
//                                             className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2"
//                                             style={{ backgroundColor: value, borderColor: selectedOptions[option.name] === value ? '#000' : 'transparent' }}
//                                         >
//                                             {selectedOptions[option.name] === value && (
//                                                 <span className="text-white text-xs">✓</span>
//                                             )}
//                                         </label>
//                                         <span className="sr-only">{value}</span>
//                                     </motion.div>
//                                 );
//                             }
//
//                             return (
//                                 <motion.button
//                                     key={value}
//                                     onClick={() => handleOptionChange(option.name, value)}
//                                     className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
//                                         selectedOptions[option.name] === value
//                                             ? 'bg-primary text-white'
//                                             : isOptionAvailable(option.name, value)
//                                                 ? 'bg-gray-200 text-gray-800'
//                                                 : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                     }`}
//                                     disabled={!isOptionAvailable(option.name, value)}
//                                     whileHover={isOptionAvailable(option.name, value) ? { scale: 1.05 } : {}}
//                                     whileTap={isOptionAvailable(option.name, value) ? { scale: 0.95 } : {}}
//                                 >
//                                     {value}
//                                 </motion.button>
//                             );
//                         })}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
//
//     const AddToCartButton = () => {
//         const handleAddToCart = () => {
//             if (isLoggedIn) {
//                 const cartItem = {
//                     quantity,
//                     ...(product.is_variant && product.variants.length > 0
//                         ? { product_variant_slug: selectedVariant.slug }
//                         : { product_slug: product.slug })
//                 };
//                 dispatch(addToCart(cartItem));
//             } else {
//                 navigate('/login', { state: { from: `/product/${product.slug}` } });
//             }
//         };
//
//         return (
//             <motion.button
//                 className={`w-full py-2 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-base md:text-lg flex items-center justify-center ${
//                     product.is_in_stock ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 }`}
//                 whileHover={product.is_in_stock ? { scale: 1.02 } : {}}
//                 whileTap={product.is_in_stock ? { scale: 0.98 } : {}}
//                 disabled={!product.is_in_stock}
//                 onClick={handleAddToCart}
//             >
//                 <FaShoppingCart className="mr-2" />
//                 {product?.is_in_stock ? (isLoggedIn ? 'Add to Cart' : 'Login to Add to Cart') : 'Out of Stock'}
//             </motion.button>
//         );
//     };
//     const ReviewForm = ({ onReviewAdded }) => {
//         const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '', pros: '', cons: '' });
//         const [uploadedImages, setUploadedImages] = useState([]);
//         const [isSubmitting, setIsSubmitting] = useState(false);
//         const [error, setError] = useState('');
//         const [success, setSuccess] = useState('');
//
//         const handleReviewChange = (e) => {
//             const { name, value } = e.target;
//             setNewReview(prev => ({ ...prev, [name]: value }));
//         };
//
//         const handleImageUpload = (e) => {
//             setUploadedImages(Array.from(e.target.files));
//         };
//
//         const resetForm = () => {
//             setNewReview({ rating: 5, title: '', comment: '', pros: '', cons: '' });
//             setUploadedImages([]);
//         };
//
//         const submitReview = async (e) => {
//             e.preventDefault(); // Prevent default form submission
//             if (!isLoggedIn) {
//                 setError('You must be logged in to submit a review.');
//                 return;
//             }
//             setIsSubmitting(true);
//             setError('');
//             setSuccess('');
//
//             try {
//                 const formData = new FormData();
//                 formData.append('product', product.id);
//                 formData.append('rating', newReview.rating);
//                 formData.append('title', newReview.title);
//                 formData.append('comment', newReview.comment);
//                 formData.append('pros', newReview.pros);
//                 formData.append('cons', newReview.cons);
//                 uploadedImages.forEach(image => {
//                     formData.append('uploaded_images', image);
//                 });
//
//                 const response = await api.post(`${API_BASE_URL_review}/reviews/`, formData, {
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 });
//
//                 onReviewAdded(response.data);
//                 setSuccess('Review submitted successfully!');
//                 resetForm();
//             } catch (err) {
//                 console.error('Error submitting review:', err);
//                 setError('Failed to submit review. Please try again.');
//             } finally {
//                 setIsSubmitting(false);
//             }
//         };
//
//         if (!isLoggedIn) {
//             return (
//                 <div className="text-center p-4 bg-gray-100 rounded-lg">
//                     <p>Please log in to write a review.</p>
//                 </div>
//             );
//         }
//
//         return (
//             <form onSubmit={submitReview} className="space-y-4">
//                 <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
//                 {error && <div className="text-red-500">{error}</div>}
//                 {success && <div className="text-green-500">{success}</div>}
//                 <div>
//                     <label className="block mb-2">Rating</label>
//                     <div className="flex">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                             <button
//                                 key={star}
//                                 type="button"
//                                 onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
//                                 className="text-2xl focus:outline-none"
//                             >
//                                 {star <= newReview.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//                 <div>
//                     <label htmlFor="review-title" className="block mb-2">Title</label>
//                     <input
//                         id="review-title"
//                         type="text"
//                         name="title"
//                         value={newReview.title}
//                         onChange={handleReviewChange}
//                         className="w-full p-2 border rounded"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="review-comment" className="block mb-2">Comment</label>
//                     <textarea
//                         id="review-comment"
//                         name="comment"
//                         value={newReview.comment}
//                         onChange={handleReviewChange}
//                         className="w-full p-2 border rounded"
//                         rows="4"
//                         required
//                     ></textarea>
//                 </div>
//                 <div>
//                     <label htmlFor="review-pros" className="block mb-2">Pros</label>
//                     <input
//                         id="review-pros"
//                         type="text"
//                         name="pros"
//                         value={newReview.pros}
//                         onChange={handleReviewChange}
//                         className="w-full p-2 border rounded"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="review-cons" className="block mb-2">Cons</label>
//                     <input
//                         id="review-cons"
//                         type="text"
//                         name="cons"
//                         value={newReview.cons}
//                         onChange={handleReviewChange}
//                         className="w-full p-2 border rounded"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="review-images" className="block mb-2">Images</label>
//                     <input
//                         id="review-images"
//                         type="file"
//                         multiple
//                         onChange={handleImageUpload}
//                         className="w-full p-2 border rounded"
//                         accept="image/*"
//                     />
//                 </div>
//                 <motion.button
//                     type="submit"
//                     className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
//                     whileHover={{ scale: 1.05 }}
//                     whileTap={{ scale: 0.95 }}
//                     disabled={isSubmitting}
//                 >
//                     {isSubmitting ? 'Submitting...' : 'Submit Review'}
//                 </motion.button>
//             </form>
//         );
//     };
//     const ReviewsList = ({ reviews }) => (
//         <div>
//             {reviews.length > 0 ? (
//                 reviews.map(review => (
//                     <div key={review.id} className="mb-6 border-b pb-4">
//                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
//                             <div>
//                                 <div className="flex items-center">
//                                     <RatingStars rating={review.rating} />
//                                     <span className="ml-2 font-semibold">{review.title}</span>
//                                 </div>
//                                 <p className="text-sm text-gray-600">{review.user_name}</p>
//                             </div>
//                             <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
//                         </div>
//                         <p className="mb-2">{review.comment}</p>
//                         {review.pros && <p className="text-green-600">Pros: {review.pros}</p>}
//                         {review.cons && <p className="text-red-600">Cons: {review.cons}</p>}
//                         {review.images && review.images.length > 0 && (
//                             <div className="flex flex-wrap mt-2 gap-2">
//                                 {review.images.map(img => (
//                                     <img key={img.id} src={img.image} alt="Review" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded" />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ))
//             ) : (
//                 <p>No reviews yet. Be the first to review this product!</p>
//             )}
//         </div>
//     );
//
//     const TabContent = () => {
//         switch (activeTab) {
//             case 'details':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="space-y-4"
//                     >
//                         <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
//                         <ul className="list-disc list-inside text-gray-700 space-y-2">
//                             {product.specifications.map((spec, index) => (
//                                 <li key={index}>{spec.name}: {spec.value}</li>
//                             ))}
//                         </ul>
//                     </motion.div>
//                 );
//             case 'description':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="space-y-4"
//                     >
//                         <p className="text-gray-700">{product.description}</p>
//                     </motion.div>
//                 );
//             case 'reviews':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="space-y-6"
//                     >
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//                             <h3 className="text-2xl font-semibold mb-2 sm:mb-0">Customer Reviews</h3>
//                             <Link
//                                 to={`/product/${slug}/reviews`}
//                                 className="text-primary hover:text-primary-dark transition duration-300"
//                             >
//                                 View All Reviews
//                             </Link>
//                         </div>
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                             <div>
//                                 <ReviewForm onReviewAdded={(newReview) => setReviews(prevReviews => [newReview, ...prevReviews])} />
//                             </div>
//                             <div>
//                                 <h4 className="text-xl font-semibold mb-4">Recent Reviews</h4>
//                                 <ReviewsList reviews={reviews} />
//                                 <Link
//                                     to={`/product/${slug}/reviews`}
//                                     className="mt-4 inline-block text-primary hover:text-primary-dark transition duration-300"
//                                 >
//                                     See More Reviews
//                                 </Link>
//                             </div>
//                         </div>
//                     </motion.div>
//                 );
//             default:
//                 return null;
//         }
//     };
//
//     if (loading) return (
//         <div className="flex justify-center items-center h-screen">
//             <motion.div
//                 className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary border-t-transparent rounded-full"
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//         </div>
//     );
//
//     if (error) return (
//         <div className="text-center py-10 text-red-500">
//             <h2 className="text-xl md:text-2xl font-bold mb-4">Error</h2>
//             <p>{error}</p>
//         </div>
//     );
//
//     if (!product) return <div className="text-center py-10">Product not found.</div>;
//
//     const images = product.is_variant && selectedVariant ? selectedVariant.images : product.images;
//
//     return (
//         <div className="bg-gray-100 min-h-screen py-4 md:py-8">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <motion.div
//                     className="bg-white rounded-lg shadow-lg p-4 md:p-6"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
//                         {/* Left column: Images */}
//                         <div className="space-y-4">
//                             <div className="aspect-w-1 aspect-h-1">
//                                 {images.length > 0 ? (
//                                     <MagnifyGlass imageSrc={images[currentImage].image} />
//                                 ) : (
//                                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                                         <p>No image available</p>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="flex space-x-2 overflow-x-auto">
//                                 {images.map((img, index) => (
//                                     <ThumbImage key={img.id} src={img.image} alt={img.alt_text} index={index} />
//                                 ))}
//                             </div>
//                         </div>
//
//                         {/* Right column: Product details */}
//                         <div className="space-y-4">
//                             <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
//                             <div className="flex items-center">
//                                 <RatingStars rating={product.average_rating || 0} />
//                                 <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
//                             </div>
//                             <PriceDisplay />
//                             <p className="text-gray-700">{product.description}</p>
//                             {product.is_variant && product.variants.length > 0 && <VariantSelector />}
//                             <div className="flex items-center space-x-4">
//                                 <span className="text-gray-700">Quantity:</span>
//                                 <div className="flex items-center border rounded">
//                                     <motion.button
//                                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         -
//                                     </motion.button>
//                                     <span className="px-4 py-1">{quantity}</span>
//                                     <motion.button
//                                         onClick={() => setQuantity(quantity + 1)}
//                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         +
//                                     </motion.button>
//                                 </div>
//                             </div>
//                             <AddToCartButton />
//                             <div className="flex justify-between">
//                                 <motion.button
//                                     className="flex items-center text-primary hover:text-primary-dark"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <FaHeart className="mr-2" /> Add to Wishlist
//                                 </motion.button>
//                                 <motion.button
//                                     className="flex items-center text-primary hover:text-primary-dark"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <FiShare2 className="mr-2" /> Share
//                                 </motion.button>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Tabs */}
//                     <div className="mt-8 md:mt-12">
//                         <div className="border-b">
//                             <div className="flex flex-wrap -mb-px">
//                                 {['details', 'description', 'reviews'].map((tab) => (
//                                     <motion.button
//                                         key={tab}
//                                         onClick={() => setActiveTab(tab)}
//                                         className={`mr-2 py-2 px-4 font-medium text-sm md:text-base ${
//                                             activeTab === tab
//                                                 ? 'border-b-2 border-primary text-primary'
//                                                 : 'text-gray-500 hover:text-gray-700'
//                                         }`}
//                                         whileHover={{ y: -2 }}
//                                         whileTap={{ y: 0 }}
//                                     >
//                                         {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                     </motion.button>
//                                 ))}
//                             </div>
//                         </div>
//                         <div className="mt-4 md:mt-6">
//                             <AnimatePresence mode="wait">
//                                 <TabContent />
//                             </AnimatePresence>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };
//
// export default ProductDetailPage;
// ==================
// //<editor-fold desc="it is working review propblem">
// import React, { useState, useEffect, useRef } from 'react';
// import {useParams, Link, useNavigate} from 'react-router-dom';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaStar, FaRegStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
// import { FiShare2 } from 'react-icons/fi';
// import MagnifyGlass from "../utils/MagnifyGlass";
//
// import { useDispatch, useSelector } from 'react-redux';
// import {addToCart} from "../store/Slices/CartSlice";
// import {submitReview} from "../store/Slices/reviewsSlice";
//
// const API_BASE_URL = 'http://127.0.0.1:8000/api/v2/client';
// const API_BASE_URL_review = 'http://127.0.0.1:8000/api/v1/client';
//
// const ProductDetailPage = () => {
//     const { slug } = useParams();
//     const dispatch = useDispatch();
//     const cartItems = useSelector(state => state.cart.items);
//     const [product, setProduct] = useState(null);
//     const [reviews, setReviews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [quantity, setQuantity] = useState(1);
//     const [activeTab, setActiveTab] = useState('details');
//     const [selectedVariant, setSelectedVariant] = useState(null);
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [currentImage, setCurrentImage] = useState(0);
//     const isLoggedIn = useSelector(state => state.auth.user !== null);
//     const navigate = useNavigate();
//
//
//     useEffect(() => {
//         const fetchProductAndReviews = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const [productResponse, reviewsResponse] = await Promise.all([
//                     axios.get(`${API_BASE_URL}/products/${slug}/`),
//                     axios.get(`${API_BASE_URL_review}/reviews/?product=${slug}`)
//                 ]);
//                 setProduct(productResponse.data);
//                 setReviews(reviewsResponse.data.results);
//                 if (productResponse.data.is_variant && productResponse.data.variants.length > 0) {
//                     setSelectedVariant(productResponse.data.variants[0]);
//                     initializeOptions(productResponse.data.variants[0]);
//                 }
//                 setLoading(false);
//             } catch (err) {
//                 setError(err.message || 'An error occurred while fetching the data.');
//                 setLoading(false);
//             }
//         };
//
//         fetchProductAndReviews();
//     }, [slug]);
//
//     const initializeOptions = (variant) => {
//         if (!variant) return;
//         const initialOptions = {};
//         variant.attribute_values.forEach(attr => {
//             initialOptions[attr.attribute_name] = attr.value;
//         });
//         setSelectedOptions(initialOptions);
//     };
//
//     const handleOptionChange = (optionName, value) => {
//         const newOptions = { ...selectedOptions, [optionName]: value };
//         setSelectedOptions(newOptions);
//
//         if (product.variants) {
//             const newVariant = product.variants.find(variant =>
//                 variant.attribute_values.every(attr =>
//                     newOptions[attr.attribute_name] === attr.value
//                 )
//             );
//
//             if (newVariant) {
//                 setSelectedVariant(newVariant);
//                 setCurrentImage(0);
//             }
//         }
//     };
//
//     const getAvailableOptions = (optionName) => {
//         if (!product.variants) return [];
//         const availableOptions = new Set();
//         product.variants.forEach(variant => {
//             const matchesCurrentSelection = Object.entries(selectedOptions).every(([key, value]) => {
//                 if (key === optionName) return true;
//                 return variant.attribute_values.some(attr => attr.attribute_name === key && attr.value === value);
//             });
//             if (matchesCurrentSelection) {
//                 const option = variant.attribute_values.find(attr => attr.attribute_name === optionName);
//                 if (option) availableOptions.add(option.value);
//             }
//         });
//         return Array.from(availableOptions);
//     };
//
//     const isOptionAvailable = (optionName, value) => {
//         return getAvailableOptions(optionName).includes(value);
//     };
//
//     const ThumbImage = ({ src, alt, index }) => (
//         <motion.img
//             src={src}
//             alt={alt}
//             className={`w-16 h-16 object-cover cursor-pointer rounded-lg ${index === currentImage ? 'border-2 border-primary' : ''}`}
//             onClick={() => setCurrentImage(index)}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//         />
//     );
//
//     const RatingStars = ({ rating }) => (
//         <div className="flex">
//             {[1, 2, 3, 4, 5].map((star) => (
//                 <span key={star}>
//                     {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
//                 </span>
//             ))}
//         </div>
//     );
//
//     const PriceDisplay = () => (
//         <div className="mb-4">
//             <span className="text-2xl md:text-3xl font-bold text-primary">
//                 ${product.is_variant ? (selectedVariant ? selectedVariant.price : product.display_price) : product.display_price}
//             </span>
//             {parseFloat(product.display_price) < parseFloat(product.base_price) && (
//                 <span className="ml-2 text-gray-500 line-through">${product.base_price}</span>
//             )}
//         </div>
//     );
//
//     const VariantSelector = () => (
//         <div className="mb-6">
//             {product.grouped_options && product.grouped_options.map(option => (
//                 <div key={option.name} className="mb-4">
//                     <h3 className="text-lg font-semibold mb-2">{option.name}</h3>
//                     <div className="flex flex-wrap gap-2">
//                         {option.values.map(value => {
//                             const isColorOption = option.name.toLowerCase() === 'color';
//                             const isColorCode = isColorOption && /^#[0-9A-F]{6}$/i.test(value);
//
//                             if (isColorOption && isColorCode) {
//                                 return (
//                                     <motion.div
//                                         key={value}
//                                         className="relative"
//                                         whileHover={{ scale: 1.1 }}
//                                         whileTap={{ scale: 0.9 }}
//                                     >
//                                         <input
//                                             type="radio"
//                                             id={`color-${value}`}
//                                             name={option.name}
//                                             value={value}
//                                             checked={selectedOptions[option.name] === value}
//                                             onChange={() => handleOptionChange(option.name, value)}
//                                             className="sr-only"
//                                         />
//                                         <label
//                                             htmlFor={`color-${value}`}
//                                             className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2"
//                                             style={{ backgroundColor: value, borderColor: selectedOptions[option.name] === value ? '#000' : 'transparent' }}
//                                         >
//                                             {selectedOptions[option.name] === value && (
//                                                 <span className="text-white text-xs">✓</span>
//                                             )}
//                                         </label>
//                                         <span className="sr-only">{value}</span>
//                                     </motion.div>
//                                 );
//                             }
//
//                             return (
//                                 <motion.button
//                                     key={value}
//                                     onClick={() => handleOptionChange(option.name, value)}
//                                     className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
//                                         selectedOptions[option.name] === value
//                                             ? 'bg-primary text-white'
//                                             : isOptionAvailable(option.name, value)
//                                                 ? 'bg-gray-200 text-gray-800'
//                                                 : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                     }`}
//                                     disabled={!isOptionAvailable(option.name, value)}
//                                     whileHover={isOptionAvailable(option.name, value) ? { scale: 1.05 } : {}}
//                                     whileTap={isOptionAvailable(option.name, value) ? { scale: 0.95 } : {}}
//                                 >
//                                     {value}
//                                 </motion.button>
//                             );
//                         })}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
//     const AddToCartButton = () => {
//         const handleAddToCart = () => {
//             if (isLoggedIn) {
//                 const cartItem = {
//                     quantity: quantity,
//                     ...(product.is_variant && product.variants.length > 0
//                         ? { product_variant_slug: selectedVariant.slug }
//                         : { product_slug: product.slug })
//                 };
//                 dispatch(addToCart(cartItem));
//             } else {
//                 navigate('/login', { state: { from: `/product/${product.slug}` } });
//             }
//         };
//
//         return (
//             <motion.button
//                 className={`w-full py-2 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-base md:text-lg flex items-center justify-center ${
//                     product.is_in_stock ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 }`}
//                 whileHover={product.is_in_stock ? { scale: 1.02 } : {}}
//                 whileTap={product.is_in_stock ? { scale: 0.98 } : {}}
//                 disabled={!product.is_in_stock}
//                 onClick={handleAddToCart}
//             >
//                 <FaShoppingCart className="mr-2" />
//                 {product?.is_in_stock ? (isLoggedIn ? 'Add to Cart' : 'Login to Add to Cart') : 'Out of Stock'}
//             </motion.button>
//         );
//     };
//
//     const ReviewForm = () => {
//         const formRef = useRef(null);
//         const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '', pros: '', cons: '' });
//         const [uploadedImages, setUploadedImages] = useState([]);
//
//         const handleReviewChange = (e) => {
//             const { name, value } = e.target;
//             setNewReview(prev => ({ ...prev, [name]: value }));
//         };
//
//         const handleImageUpload = (e) => {
//             setUploadedImages(Array.from(e.target.files));
//         };
//
//         const submitReview = async (e) => {
//             e.preventDefault();
//
//             try {
//                 const formData = new FormData();
//                 formData.append('product', product.id);
//                 formData.append('rating', newReview.rating);
//                 formData.append('title', newReview.title);
//                 formData.append('comment', newReview.comment);
//                 formData.append('pros', newReview.pros);
//                 formData.append('cons', newReview.cons);
//                 uploadedImages.forEach(image => {
//                     formData.append('uploaded_images', image);
//                 });
//
//                 const response = await axios.post(`${API_BASE_URL_review}/reviews/`, formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                         // Add authentication header here if required
//                     }
//                 });
//
//                 setReviews(prev => [response.data, ...prev]);
//                 setNewReview({ rating: 5, title: '', comment: '', pros: '', cons: '' });
//                 setUploadedImages([]);
//             } catch (err) {
//                 console.error('Error submitting review:', err);
//                 // Handle error (e.g., show error message to user)
//             }
//         };
//
//         const handleKeyDown = (e) => {
//             if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
//                 e.preventDefault();
//                 const form = formRef.current;
//                 const inputs = Array.from(form.querySelectorAll('input:not([type="file"]), textarea, button'));
//                 const index = inputs.indexOf(e.target);
//                 if (index > -1 && index < inputs.length - 1) {
//                     inputs[index + 1].focus();
//                 }
//             }
//         };
//
//         return (
//             <form onSubmit={submitReview} className="space-y-4" ref={formRef}>
//                 <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
//                 <div>
//                     <label className="block mb-2">Rating</label>
//                     <div className="flex">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                             <button
//                                 key={star}
//                                 type="button"
//                                 onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
//                                 className="text-2xl focus:outline-none"
//                             >
//                                 {star <= newReview.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//                 <div>
//                     <label htmlFor="review-title" className="block mb-2">Title</label>
//                     <input
//                         id="review-title"
//                         type="text"
//                         name="title"
//                         value={newReview.title}
//                         onChange={handleReviewChange}
//                         onKeyDown={handleKeyDown}
//                         className="w-full p-2 border rounded"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="review-comment" className="block mb-2">Comment</label>
//                     <textarea
//                         id="review-comment"
//                         name="comment"
//                         value={newReview.comment}
//                         onChange={handleReviewChange}
//                         className="w-full p-2 border rounded"
//                         rows="4"
//                         required
//                     ></textarea>
//                 </div>
//                 <div>
//                     <label htmlFor="review-pros" className="block mb-2">Pros</label>
//                     <input
//                         id="review-pros"
//                         type="text"
//                         name="pros"
//                         value={newReview.pros}
//                         onChange={handleReviewChange}
//                         onKeyDown={handleKeyDown}
//                         className="w-full p-2 border rounded"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="review-cons" className="block mb-2">Cons</label>
//                     <input
//                         id="review-cons"
//                         type="text"
//                         name="cons"
//                         value={newReview.cons}
//                         onChange={handleReviewChange}
//                         onKeyDown={handleKeyDown}
//                         className="w-full p-2 border rounded"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="review-images" className="block mb-2">Images</label>
//                     <input
//                         id="review-images"
//                         type="file"
//                         multiple
//                         onChange={handleImageUpload}
//                         className="w-full p-2 border rounded"
//                         accept="image/*"
//                     />
//                 </div>
//                 <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300">
//                     Submit Review
//                 </button>
//             </form>
//         );
//     };
//
//     const ReviewsList = () => (
//         <div>
//             {reviews.length > 0 ? (
//                 reviews.map(review => (
//                     <div key={review.id} className="mb-6 border-b pb-4">
//                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
//                             <div>
//                                 <RatingStars rating={review.rating} />
//                                 <p className="font-semibold">{review.title}</p>
//                             </div>
//                             <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
//                         </div>
//                         <p className="mb-2">{review.comment}</p>
//                         {review.pros && <p className="text-green-600">Pros: {review.pros}</p>}
//                         {review.cons && <p className="text-red-600">Cons: {review.cons}</p>}
//                         {review.images && review.images.length > 0 && (
//                             <div className="flex flex-wrap mt-2 gap-2">
//                                 {review.images.map(img => (
//                                     <img key={img.id} src={img.image} alt="Review" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded" />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ))
//             ) : (
//                 <p>No reviews yet. Be the first to review this product!</p>
//             )}
//         </div>
//     );
//
//     const TabContent = () => {
//         switch (activeTab) {
//             case 'details':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="space-y-4"
//                     >
//                         <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
//                         <ul className="list-disc list-inside text-gray-700 space-y-2">
//                             {product.specifications.map((spec, index) => (
//                                 <li key={index}>{spec.name}: {spec.value}</li>
//                             ))}
//                         </ul>
//                     </motion.div>
//                 );
//             case 'description':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="space-y-4"
//                     >
//                         <p className="text-gray-700">{product.description}</p>
//                     </motion.div>
//                 );
//             case 'reviews':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="space-y-6"
//                     >
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//                             <h3 className="text-2xl font-semibold mb-2 sm:mb-0">Customer Reviews</h3>
//                             <Link
//                                 to={`/product/${slug}/reviews`}
//                                 className="text-primary hover:text-primary-dark transition duration-300"
//                             >
//                                 View All Reviews
//                             </Link>
//                         </div>
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                             <div>
//                                 <ReviewForm />
//                             </div>
//                             <div>
//                                 <h4 className="text-xl font-semibold mb-4">Recent Reviews</h4>
//                                 <ReviewsList />
//                                 <Link
//                                     to={`/product/${slug}/reviews`}
//                                     className="mt-4 inline-block text-primary hover:text-primary-dark transition duration-300"
//                                 >
//                                     See More Reviews
//                                 </Link>
//                             </div>
//                         </div>
//                     </motion.div>
//                 );
//             default:
//                 return null;
//         }
//     };
//
//     if (loading) return (
//         <div className="flex justify-center items-center h-screen">
//             <motion.div
//                 className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary border-t-transparent rounded-full"
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//         </div>
//     );
//
//     if (error) return (
//         <div className="text-center py-10 text-red-500">
//             <h2 className="text-xl md:text-2xl font-bold mb-4">Error</h2>
//             <p>{error}</p>
//         </div>
//     );
//
//     if (!product) return <div className="text-center py-10">Product not found.</div>;
//
//     const images = product.is_variant ? (selectedVariant ? selectedVariant.images : []) : product.images;
//
//     return (
//         <div className="bg-gray-100 min-h-screen py-4 md:py-8">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <motion.div
//                     className="bg-white rounded-lg shadow-lg p-4 md:p-6"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
//                         {/* Left column: Images */}
//                         <div className="space-y-4">
//                             <div className="aspect-w-1 aspect-h-1">
//                                 {images.length > 0 ? (
//                                     <MagnifyGlass imageSrc={images[currentImage].image} />
//                                 ) : (
//                                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                                         <p>No image available</p>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="flex space-x-2 overflow-x-auto">
//                                 {images.map((img, index) => (
//                                     <ThumbImage key={img.id} src={img.image} alt={img.alt_text} index={index} />
//                                 ))}
//                             </div>
//                         </div>
//
//                         {/* Right column: Product details */}
//                         <div className="space-y-4">
//                             <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
//                             <div className="flex items-center">
//                                 <RatingStars rating={product.average_rating || 0} />
//                                 <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
//                             </div>
//                             <PriceDisplay />
//                             <p className="text-gray-700">{product.description}</p>
//                             {product.is_variant && <VariantSelector />}
//                             <div className="flex items-center space-x-4">
//                                 <span className="text-gray-700">Quantity:</span>
//                                 <div className="flex items-center border rounded">
//                                     <motion.button
//                                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         -
//                                     </motion.button>
//                                     <span className="px-4 py-1">{quantity}</span>
//                                     <motion.button
//                                         onClick={() => setQuantity(quantity + 1)}
//                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         +
//                                     </motion.button>
//                                 </div>
//                             </div>
//                             <AddToCartButton />
//                             <div className="flex justify-between">
//                                 <motion.button
//                                     className="flex items-center text-primary hover:text-primary-dark"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <FaHeart className="mr-2" /> Add to Wishlist
//                                 </motion.button>
//                                 <motion.button
//                                     className="flex items-center text-primary hover:text-primary-dark"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <FiShare2 className="mr-2" /> Share
//                                 </motion.button>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Tabs */}
//                     <div className="mt-8 md:mt-12">
//                         <div className="border-b">
//                             <div className="flex flex-wrap -mb-px">
//                                 {['details', 'description', 'reviews'].map((tab) => (
//                                     <motion.button
//                                         key={tab}
//                                         onClick={() => setActiveTab(tab)}
//                                         className={`mr-2 py-2 px-4 font-medium text-sm md:text-base ${
//                                             activeTab === tab
//                                                 ? 'border-b-2 border-primary text-primary'
//                                                 : 'text-gray-500 hover:text-gray-700'
//                                         }`}
//                                         whileHover={{ y: -2 }}
//                                         whileTap={{ y: 0 }}
//                                     >
//                                         {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                     </motion.button>
//                                 ))}
//                             </div>
//                         </div>
//                         <div className="mt-4 md:mt-6">
//                             <AnimatePresence mode="wait">
//                                 <TabContent />
//                             </AnimatePresence>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };
//
// export default ProductDetailPage;
// //</editor-fold>
// //<editor-fold desc="old working without cart">
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaStar, FaRegStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
// import { FiShare2 } from 'react-icons/fi';
// import MagnifyGlass from "../utils/MagnifyGlass";
//
// const API_BASE_URL = 'http://127.0.0.1:8000/api/v2/client';
// const API_BASE_URL_review = 'http://127.0.0.1:8000/api/v1/client';
//
// const ProductDetailPage = () => {
//     const { slug } = useParams();
//     const [product, setProduct] = useState(null);
//     const [reviews, setReviews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [quantity, setQuantity] = useState(1);
//     const [activeTab, setActiveTab] = useState('details');
//     const [selectedVariant, setSelectedVariant] = useState(null);
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [currentImage, setCurrentImage] = useState(0);
//
//     useEffect(() => {
//         const fetchProductAndReviews = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const [productResponse, reviewsResponse] = await Promise.all([
//                     axios.get(`${API_BASE_URL}/products/${slug}/`),
//                     axios.get(`${API_BASE_URL_review}/reviews/?product=${slug}`)
//                 ]);
//                 setProduct(productResponse.data);
//                 setReviews(reviewsResponse.data.results);
//                 if (productResponse.data.is_variant && productResponse.data.variants.length > 0) {
//                     setSelectedVariant(productResponse.data.variants[0]);
//                     initializeOptions(productResponse.data.variants[0]);
//                 }
//                 setLoading(false);
//             } catch (err) {
//                 setError(err.message || 'An error occurred while fetching the data.');
//                 setLoading(false);
//             }
//         };
//
//         fetchProductAndReviews();
//     }, [slug]);
//
//     const initializeOptions = (variant) => {
//         if (!variant) return;
//         const initialOptions = {};
//         variant.attribute_values.forEach(attr => {
//             initialOptions[attr.attribute_name] = attr.value;
//         });
//         setSelectedOptions(initialOptions);
//     };
//
//     const handleOptionChange = (optionName, value) => {
//         const newOptions = { ...selectedOptions, [optionName]: value };
//         setSelectedOptions(newOptions);
//
//         if (product.variants) {
//             const newVariant = product.variants.find(variant =>
//                 variant.attribute_values.every(attr =>
//                     newOptions[attr.attribute_name] === attr.value
//                 )
//             );
//
//             if (newVariant) {
//                 setSelectedVariant(newVariant);
//                 setCurrentImage(0);
//             }
//         }
//     };
//
//     const getAvailableOptions = (optionName) => {
//         if (!product.variants) return [];
//         const availableOptions = new Set();
//         product.variants.forEach(variant => {
//             const matchesCurrentSelection = Object.entries(selectedOptions).every(([key, value]) => {
//                 if (key === optionName) return true;
//                 return variant.attribute_values.some(attr => attr.attribute_name === key && attr.value === value);
//             });
//             if (matchesCurrentSelection) {
//                 const option = variant.attribute_values.find(attr => attr.attribute_name === optionName);
//                 if (option) availableOptions.add(option.value);
//             }
//         });
//         return Array.from(availableOptions);
//     };
//
//     const isOptionAvailable = (optionName, value) => {
//         return getAvailableOptions(optionName).includes(value);
//     };
//
//     const ThumbImage = ({ src, alt, index }) => (
//         <motion.img
//             src={src}
//             alt={alt}
//             className={`w-16 h-16 object-cover cursor-pointer rounded-lg ${index === currentImage ? 'border-2 border-primary' : ''}`}
//             onClick={() => setCurrentImage(index)}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//         />
//     );
//
//     const RatingStars = ({ rating }) => (
//         <div className="flex">
//             {[1, 2, 3, 4, 5].map((star) => (
//                 <span key={star}>
//                     {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
//                 </span>
//             ))}
//         </div>
//     );
//
//     const PriceDisplay = () => (
//         <div className="mb-4">
//             <span className="text-2xl md:text-3xl font-bold text-primary">
//                 ${product.is_variant ? (selectedVariant ? selectedVariant.price : product.display_price) : product.display_price}
//             </span>
//             {parseFloat(product.display_price) < parseFloat(product.base_price) && (
//                 <span className="ml-2 text-gray-500 line-through">${product.base_price}</span>
//             )}
//         </div>
//     );
//
//     const VariantSelector = () => (
//         <div className="mb-6">
//             {product.grouped_options && product.grouped_options.map(option => (
//                 <div key={option.name} className="mb-4">
//                     <h3 className="text-lg font-semibold mb-2">{option.name}</h3>
//                     <div className="flex flex-wrap gap-2">
//                         {option.values.map(value => {
//                             const isColorOption = option.name.toLowerCase() === 'color';
//                             const isColorCode = isColorOption && /^#[0-9A-F]{6}$/i.test(value);
//
//                             if (isColorOption && isColorCode) {
//                                 return (
//                                     <motion.div
//                                         key={value}
//                                         className="relative"
//                                         whileHover={{ scale: 1.1 }}
//                                         whileTap={{ scale: 0.9 }}
//                                     >
//                                         <input
//                                             type="radio"
//                                             id={`color-${value}`}
//                                             name={option.name}
//                                             value={value}
//                                             checked={selectedOptions[option.name] === value}
//                                             onChange={() => handleOptionChange(option.name, value)}
//                                             className="sr-only"
//                                         />
//                                         <label
//                                             htmlFor={`color-${value}`}
//                                             className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2"
//                                             style={{ backgroundColor: value, borderColor: selectedOptions[option.name] === value ? '#000' : 'transparent' }}
//                                         >
//                                             {selectedOptions[option.name] === value && (
//                                                 <span className="text-white text-xs">✓</span>
//                                             )}
//                                         </label>
//                                         <span className="sr-only">{value}</span>
//                                     </motion.div>
//                                 );
//                             }
//
//                             return (
//                                 <motion.button
//                                     key={value}
//                                     onClick={() => handleOptionChange(option.name, value)}
//                                     className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
//                                         selectedOptions[option.name] === value
//                                             ? 'bg-primary text-white'
//                                             : isOptionAvailable(option.name, value)
//                                                 ? 'bg-gray-200 text-gray-800'
//                                                 : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                     }`}
//                                     disabled={!isOptionAvailable(option.name, value)}
//                                     whileHover={isOptionAvailable(option.name, value) ? { scale: 1.05 } : {}}
//                                     whileTap={isOptionAvailable(option.name, value) ? { scale: 0.95 } : {}}
//                                 >
//                                     {value}
//                                 </motion.button>
//                             );
//                         })}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
//
//     const AddToCartButton = () => (
//         <motion.button
//             className={`w-full py-2 md:py-3 px-4 md:px-6 rounded-lg font-semibold text-base md:text-lg flex items-center justify-center ${
//                 product.is_in_stock ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//             }`}
//             whileHover={product.is_in_stock ? { scale: 1.02 } : {}}
//             whileTap={product.is_in_stock ? { scale: 0.98 } : {}}
//             disabled={!product.is_in_stock}
//         >
//             <FaShoppingCart className="mr-2" />
//             {product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
//         </motion.button>
//     );
//
//     const ReviewForm = () => {
//         const formRef = useRef(null);
//         const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '', pros: '', cons: '' });
//         const [uploadedImages, setUploadedImages] = useState([]);
//
//         const handleReviewChange = (e) => {
//             const { name, value } = e.target;
//             setNewReview(prev => ({ ...prev, [name]: value }));
//         };
//
//         const handleImageUpload = (e) => {
//             setUploadedImages(Array.from(e.target.files));
//         };
//
//         const submitReview = async (e) => {
//             e.preventDefault();
//             try {
//                 const formData = new FormData();
//                 formData.append('product', product.id);
//                 formData.append('rating', newReview.rating);
//                 formData.append('title', newReview.title);
//                 formData.append('comment', newReview.comment);
//                 formData.append('pros', newReview.pros);
//                 formData.append('cons', newReview.cons);
//                 uploadedImages.forEach(image => {
//                     formData.append('uploaded_images', image);
//                 });
//
//                 const response = await axios.post(`${API_BASE_URL_review}/reviews/`, formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                         // Add authentication header here if required
//                     }
//                 });
//
//                 setReviews(prev => [response.data, ...prev]);
//                 setNewReview({ rating: 5, title: '', comment: '', pros: '', cons: '' });
//                 setUploadedImages([]);
//             } catch (err) {
//                 console.error('Error submitting review:', err);
//                 // Handle error (e.g., show error message to user)
//             }
//         };
//
//         const handleKeyDown = (e) => {
//             if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
//                 e.preventDefault();
//                 const form = formRef.current;
//                 const inputs = Array.from(form.querySelectorAll('input:not([type="file"]), textarea, button'));
//                 const index = inputs.indexOf(e.target);
//                 if (index > -1 && index < inputs.length - 1) {
//                     inputs[index + 1].focus();
//                 }
//             }
//         };
//
//         return (
//             <form onSubmit={submitReview} className="space-y-4" ref={formRef}>
//                 <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
//                 <div>
//                     <label className="block mb-2">Rating</label>
//                     <div className="flex">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                             <button
//                                 key={star}
//                                 type="button"
//                                 onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
//                                 className="text-2xl focus:outline-none"
//                             >
//                                 {star <= newReview.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//                 <div>
//                     <label htmlFor="review-title" className="block mb-2">Title</label>
//                     <input
//                         id="review-title"
//                         type="text"
//                         name="title"
//                         value={newReview.title}
//                         onChange={handleReviewChange}
//                         onKeyDown={handleKeyDown}
//                         className="w-full p-2 border rounded"
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="review-comment" className="block mb-2">Comment</label>
//                     <textarea
//                         id="review-comment"
//                         name="comment"
//                         value={newReview.comment}
//                         onChange={handleReviewChange}
//                         className="w-full p-2 border rounded"
//                         rows="4"
//                         required
//                     ></textarea>
//                 </div>
//                 <div>
//                     <label htmlFor="review-pros" className="block mb-2">Pros</label>
//                     <input
//                         id="review-pros"
//                         type="text"
//                         name="pros"
//                         value={newReview.pros}
//                         onChange={handleReviewChange}
//                         onKeyDown={handleKeyDown}
//                         className="w-full p-2 border rounded"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="review-cons" className="block mb-2">Cons</label>
//                     <input
//                         id="review-cons"
//                         type="text"
//                         name="cons"
//                         value={newReview.cons}
//                         onChange={handleReviewChange}
//                         onKeyDown={handleKeyDown}
//                         className="w-full p-2 border rounded"
//                     />
//                 </div>
//                 <div>
//                     <label htmlFor="review-images" className="block mb-2">Images</label>
//                     <input
//                         id="review-images"
//                         type="file"
//                         multiple
//                         onChange={handleImageUpload}
//                         className="w-full p-2 border rounded"
//                         accept="image/*"
//                     />
//                 </div>
//                 <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300">
//                     Submit Review
//                 </button>
//             </form>
//         );
//     };
//
//     const ReviewsList = () => (
//         <div>
//             {reviews.length > 0 ? (
//                 reviews.map(review => (
//                     <div key={review.id} className="mb-6 border-b pb-4">
//                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
//                             <div>
//                                 <RatingStars rating={review.rating} />
//                                 <p className="font-semibold">{review.title}</p>
//                             </div>
//                             <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
//                         </div>
//                         <p className="mb-2">{review.comment}</p>
//                         {review.pros && <p className="text-green-600">Pros: {review.pros}</p>}
//                         {review.cons && <p className="text-red-600">Cons: {review.cons}</p>}
//                         {review.images && review.images.length > 0 && (
//                             <div className="flex flex-wrap mt-2 gap-2">
//                                 {review.images.map(img => (
//                                     <img key={img.id} src={img.image} alt="Review" className="w-16 h-16 md:w-20 md:h-20 object-cover rounded" />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ))
//             ) : (
//                 <p>No reviews yet. Be the first to review this product!</p>
//             )}
//         </div>
//     );
//
//     const TabContent = () => {
//         switch (activeTab) {
//             case 'details':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="space-y-4"
//                     >
//                         <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
//                         <ul className="list-disc list-inside text-gray-700 space-y-2">
//                             {product.specifications.map((spec, index) => (
//                                 <li key={index}>{spec.name}: {spec.value}</li>
//                             ))}
//                         </ul>
//                     </motion.div>
//                 );
//             case 'description':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="space-y-4"
//                     >
//                         <p className="text-gray-700">{product.description}</p>
//                     </motion.div>
//                 );
//             case 'reviews':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="space-y-6"
//                     >
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
//                             <h3 className="text-2xl font-semibold mb-2 sm:mb-0">Customer Reviews</h3>
//                             <Link
//                                 to={`/product/${slug}/reviews`}
//                                 className="text-primary hover:text-primary-dark transition duration-300"
//                             >
//                                 View All Reviews
//                             </Link>
//                         </div>
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//                             <div>
//                                 <ReviewForm />
//                             </div>
//                             <div>
//                                 <h4 className="text-xl font-semibold mb-4">Recent Reviews</h4>
//                                 <ReviewsList />
//                                 <Link
//                                     to={`/product/${slug}/reviews`}
//                                     className="mt-4 inline-block text-primary hover:text-primary-dark transition duration-300"
//                                 >
//                                     See More Reviews
//                                 </Link>
//                             </div>
//                         </div>
//                     </motion.div>
//                 );
//             default:
//                 return null;
//         }
//     };
//
//     if (loading) return (
//         <div className="flex justify-center items-center h-screen">
//             <motion.div
//                 className="w-12 h-12 md:w-16 md:h-16 border-4 border-primary border-t-transparent rounded-full"
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//         </div>
//     );
//
//     if (error) return (
//         <div className="text-center py-10 text-red-500">
//             <h2 className="text-xl md:text-2xl font-bold mb-4">Error</h2>
//             <p>{error}</p>
//         </div>
//     );
//
//     if (!product) return <div className="text-center py-10">Product not found.</div>;
//
//     const images = product.is_variant ? (selectedVariant ? selectedVariant.images : []) : product.images;
//
//     return (
//         <div className="bg-gray-100 min-h-screen py-4 md:py-8">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                 <motion.div
//                     className="bg-white rounded-lg shadow-lg p-4 md:p-6"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
//                         {/* Left column: Images */}
//                         <div className="space-y-4">
//                             <div className="aspect-w-1 aspect-h-1">
//                                 {images.length > 0 ? (
//                                     <MagnifyGlass imageSrc={images[currentImage].image} />
//                                 ) : (
//                                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                                         <p>No image available</p>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="flex space-x-2 overflow-x-auto">
//                                 {images.map((img, index) => (
//                                     <ThumbImage key={img.id} src={img.image} alt={img.alt_text} index={index} />
//                                 ))}
//                             </div>
//                         </div>
//
//                         {/* Right column: Product details */}
//                         <div className="space-y-4">
//                             <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
//                             <div className="flex items-center">
//                                 <RatingStars rating={product.average_rating || 0} />
//                                 <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
//                             </div>
//                             <PriceDisplay />
//                             <p className="text-gray-700">{product.description}</p>
//                             {product.is_variant && <VariantSelector />}
//                             <div className="flex items-center space-x-4">
//                                 <span className="text-gray-700">Quantity:</span>
//                                 <div className="flex items-center border rounded">
//                                     <motion.button
//                                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         -
//                                     </motion.button>
//                                     <span className="px-4 py-1">{quantity}</span>
//                                     <motion.button
//                                         onClick={() => setQuantity(quantity + 1)}
//                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         +
//                                     </motion.button>
//                                 </div>
//                             </div>
//                             <AddToCartButton />
//                             <div className="flex justify-between">
//                                 <motion.button
//                                     className="flex items-center text-primary hover:text-primary-dark"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <FaHeart className="mr-2" /> Add to Wishlist
//                                 </motion.button>
//                                 <motion.button
//                                     className="flex items-center text-primary hover:text-primary-dark"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <FiShare2 className="mr-2" /> Share
//                                 </motion.button>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Tabs */}
//                     <div className="mt-8 md:mt-12">
//                         <div className="border-b">
//                             <div className="flex flex-wrap -mb-px">
//                                 {['details', 'description', 'reviews'].map((tab) => (
//                                     <motion.button
//                                         key={tab}
//                                         onClick={() => setActiveTab(tab)}
//                                         className={`mr-2 py-2 px-4 font-medium text-sm md:text-base ${
//                                             activeTab === tab
//                                                 ? 'border-b-2 border-primary text-primary'
//                                                 : 'text-gray-500 hover:text-gray-700'
//                                         }`}
//                                         whileHover={{ y: -2 }}
//                                         whileTap={{ y: 0 }}
//                                     >
//                                         {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                     </motion.button>
//                                 ))}
//                             </div>
//                         </div>
//                         <div className="mt-4 md:mt-6">
//                             <AnimatePresence mode="wait">
//                                 <TabContent />
//                             </AnimatePresence>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };
//
// export default ProductDetailPage;
// //</editor-fold>



// import React, { useState, useEffect, useRef } from 'react';
// import { useParams ,Link } from 'react-router-dom';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaStar, FaRegStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
// import { FiShare2 } from 'react-icons/fi';
// import MagnifyGlass from "../utils/MagnifyGlass";
//
// const API_BASE_URL = 'http://127.0.0.1:8000/api/v2/client';
// const API_BASE_URL_review = 'http://127.0.0.1:8000/api/v1/client';
//
// const ProductDetailPage = () => {
//     const { slug } = useParams();
//     const [product, setProduct] = useState(null);
//     const [reviews, setReviews] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [quantity, setQuantity] = useState(1);
//     const [activeTab, setActiveTab] = useState('details');
//     const [selectedVariant, setSelectedVariant] = useState(null);
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [currentImage, setCurrentImage] = useState(0);
//
//     useEffect(() => {
//         const fetchProductAndReviews = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const [productResponse, reviewsResponse] = await Promise.all([
//                     axios.get(`${API_BASE_URL}/products/${slug}/`),
//                     axios.get(`${API_BASE_URL_review}/reviews/?product=${slug}`)
//                 ]);
//                 setProduct(productResponse.data);
//                 setReviews(reviewsResponse.data.results);
//                 if (productResponse.data.is_variant && productResponse.data.variants.length > 0) {
//                     setSelectedVariant(productResponse.data.variants[0]);
//                     initializeOptions(productResponse.data.variants[0]);
//                 }
//                 setLoading(false);
//             } catch (err) {
//                 setError(err.message || 'An error occurred while fetching the data.');
//                 setLoading(false);
//             }
//         };
//
//         fetchProductAndReviews();
//     }, [slug]);
//
//     const initializeOptions = (variant) => {
//         if (!variant) return;
//         const initialOptions = {};
//         variant.attribute_values.forEach(attr => {
//             initialOptions[attr.attribute_name] = attr.value;
//         });
//         setSelectedOptions(initialOptions);
//     };
//
//     const handleOptionChange = (optionName, value) => {
//         const newOptions = { ...selectedOptions, [optionName]: value };
//         setSelectedOptions(newOptions);
//
//         if (product.variants) {
//             const newVariant = product.variants.find(variant =>
//                 variant.attribute_values.every(attr =>
//                     newOptions[attr.attribute_name] === attr.value
//                 )
//             );
//
//             if (newVariant) {
//                 setSelectedVariant(newVariant);
//                 setCurrentImage(0);
//             }
//         }
//     };
//
//     const getAvailableOptions = (optionName) => {
//         if (!product.variants) return [];
//         const availableOptions = new Set();
//         product.variants.forEach(variant => {
//             const matchesCurrentSelection = Object.entries(selectedOptions).every(([key, value]) => {
//                 if (key === optionName) return true;
//                 return variant.attribute_values.some(attr => attr.attribute_name === key && attr.value === value);
//             });
//             if (matchesCurrentSelection) {
//                 const option = variant.attribute_values.find(attr => attr.attribute_name === optionName);
//                 if (option) availableOptions.add(option.value);
//             }
//         });
//         return Array.from(availableOptions);
//     };
//
//     const isOptionAvailable = (optionName, value) => {
//         return getAvailableOptions(optionName).includes(value);
//     };
//
//     const ReviewForm = () => {
//         const formRef = useRef(null);
//         const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '', pros: '', cons: '' });
//         const [uploadedImages, setUploadedImages] = useState([]);
//
//         const handleReviewChange = (e) => {
//             const { name, value } = e.target;
//             setNewReview(prev => ({ ...prev, [name]: value }));
//         };
//
//         const handleImageUpload = (e) => {
//             setUploadedImages(Array.from(e.target.files));
//         };
//
//         const submitReview = async (e) => {
//             e.preventDefault();
//             try {
//                 const formData = new FormData();
//                 formData.append('product', product.id);
//                 formData.append('rating', newReview.rating);
//                 formData.append('title', newReview.title);
//                 formData.append('comment', newReview.comment);
//                 formData.append('pros', newReview.pros);
//                 formData.append('cons', newReview.cons);
//                 uploadedImages.forEach(image => {
//                     formData.append('uploaded_images', image);
//                 });
//
//                 const response = await axios.post(`${API_BASE_URL_review}/reviews/`, formData, {
//                     headers: {
//                         'Content-Type': 'multipart/form-data',
//                         // Add authentication header here if required
//                     }
//                 });
//
//                 setReviews(prev => [response.data, ...prev]);
//                 setNewReview({ rating: 5, title: '', comment: '', pros: '', cons: '' });
//                 setUploadedImages([]);
//             } catch (err) {
//                 console.error('Error submitting review:', err);
//                 // Handle error (e.g., show error message to user)
//             }
//         };
//
//         const handleKeyDown = (e) => {
//             if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
//                 e.preventDefault();
//                 const form = formRef.current;
//                 const inputs = Array.from(form.querySelectorAll('input:not([type="file"]), textarea, button'));
//                 const index = inputs.indexOf(e.target);
//                 if (index > -1 && index < inputs.length - 1) {
//                     inputs[index + 1].focus();
//                 }
//             }
//         };
//
//         return (
//             <form onSubmit={submitReview} className="mt-6 border-t pt-6" ref={formRef}>
//                 <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
//                 <div className="mb-4">
//                     <label className="block mb-2">Rating</label>
//                     <div className="flex">
//                         {[1, 2, 3, 4, 5].map((star) => (
//                             <button
//                                 key={star}
//                                 type="button"
//                                 onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
//                                 className="text-2xl focus:outline-none"
//                             >
//                                 {star <= newReview.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="review-title" className="block mb-2">Title</label>
//                     <input
//                         id="review-title"
//                         type="text"
//                         name="title"
//                         value={newReview.title}
//                         onChange={handleReviewChange}
//                         onKeyDown={handleKeyDown}
//                         className="w-full p-2 border rounded"
//                         required
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="review-comment" className="block mb-2">Comment</label>
//                     <textarea
//                         id="review-comment"
//                         name="comment"
//                         value={newReview.comment}
//                         onChange={handleReviewChange}
//                         className="w-full p-2 border rounded"
//                         rows="4"
//                         required
//                     ></textarea>
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="review-pros" className="block mb-2">Pros</label>
//                     <input
//                         id="review-pros"
//                         type="text"
//                         name="pros"
//                         value={newReview.pros}
//                         onChange={handleReviewChange}
//                         onKeyDown={handleKeyDown}
//                         className="w-full p-2 border rounded"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="review-cons" className="block mb-2">Cons</label>
//                     <input
//                         id="review-cons"
//                         type="text"
//                         name="cons"
//                         value={newReview.cons}
//                         onChange={handleReviewChange}
//                         onKeyDown={handleKeyDown}
//                         className="w-full p-2 border rounded"
//                     />
//                 </div>
//                 <div className="mb-4">
//                     <label htmlFor="review-images" className="block mb-2">Images</label>
//                     <input
//                         id="review-images"
//                         type="file"
//                         multiple
//                         onChange={handleImageUpload}
//                         className="w-full p-2 border rounded"
//                         accept="image/*"
//                     />
//                 </div>
//                 <button type="submit" className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300">
//                     Submit Review
//                 </button>
//             </form>
//         );
//     };
//
//     const ThumbImage = ({ src, alt, index }) => (
//         <motion.img
//             src={src}
//             alt={alt}
//             className={`w-16 h-16 object-cover cursor-pointer rounded-lg ${index === currentImage ? 'border-2 border-primary' : ''}`}
//             onClick={() => setCurrentImage(index)}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//         />
//     );
//
//     const RatingStars = ({ rating }) => (
//         <div className="flex">
//             {[1, 2, 3, 4, 5].map((star) => (
//                 <span key={star}>
//                     {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
//                 </span>
//             ))}
//         </div>
//     );
//
//     const PriceDisplay = () => (
//         <div className="mb-4">
//             <span className="text-3xl font-bold text-primary">
//                 ${product.is_variant ? (selectedVariant ? selectedVariant.price : product.display_price) : product.display_price}
//             </span>
//             {parseFloat(product.display_price) < parseFloat(product.base_price) && (
//                 <span className="ml-2 text-gray-500 line-through">${product.base_price}</span>
//             )}
//         </div>
//     );
//
//     const VariantSelector = () => (
//         <div className="mb-6">
//             {product.grouped_options && product.grouped_options.map(option => (
//                 <div key={option.name} className="mb-4">
//                     <h3 className="text-lg font-semibold mb-2">{option.name}</h3>
//                     <div className="flex flex-wrap gap-2">
//                         {option.values.map(value => {
//                             const isColorOption = option.name.toLowerCase() === 'color';
//                             const isColorCode = isColorOption && /^#[0-9A-F]{6}$/i.test(value);
//
//                             if (isColorOption && isColorCode) {
//                                 return (
//                                     <motion.div
//                                         key={value}
//                                         className="relative"
//                                         whileHover={{ scale: 1.1 }}
//                                         whileTap={{ scale: 0.9 }}
//                                     >
//                                         <input
//                                             type="radio"
//                                             id={`color-${value}`}
//                                             name={option.name}
//                                             value={value}
//                                             checked={selectedOptions[option.name] === value}
//                                             onChange={() => handleOptionChange(option.name, value)}
//                                             className="sr-only"
//                                         />
//                                         <label
//                                             htmlFor={`color-${value}`}
//                                             className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2"
//                                             style={{ backgroundColor: value, borderColor: selectedOptions[option.name] === value ? '#000' : 'transparent' }}
//                                         >
//                                             {selectedOptions[option.name] === value && (
//                                                 <span className="text-white text-xs">✓</span>
//                                             )}
//                                         </label>
//                                         <span className="sr-only">{value}</span>
//                                     </motion.div>
//                                 );
//                             }
//
//                             return (
//                                 <motion.button
//                                     key={value}
//                                     onClick={() => handleOptionChange(option.name, value)}
//                                     className={`px-4 py-2 rounded ${
//                                         selectedOptions[option.name] === value
//                                             ? 'bg-primary text-white'
//                                             : isOptionAvailable(option.name, value)
//                                                 ? 'bg-gray-200 text-gray-800'
//                                                 : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                     }`}
//                                     disabled={!isOptionAvailable(option.name, value)}
//                                     whileHover={isOptionAvailable(option.name, value) ? { scale: 1.05 } : {}}
//                                     whileTap={isOptionAvailable(option.name, value) ? { scale: 0.95 } : {}}
//                                 >
//                                     {value}
//                                 </motion.button>
//                             );
//                         })}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
//
//     const AddToCartButton = () => (
//         <motion.button
//             className={`w-full py-3 px-6 rounded-lg font-semibold text-lg flex items-center justify-center ${
//                 product.is_in_stock ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//             }`}
//             whileHover={product.is_in_stock ? { scale: 1.02 } : {}}
//             whileTap={product.is_in_stock ? { scale: 0.98 } : {}}
//             disabled={!product.is_in_stock}
//         >
//             <FaShoppingCart className="mr-2" />
//             {product.is_in_stock ? 'Add to Cart' : 'Out of Stock'}
//         </motion.button>
//     );
//
//     const ReviewsList = () => (
//         <div>
//             <h3 className="text-xl font-semibold mb-4"></h3>
//             {reviews.length > 0 ? (
//                 reviews.map(review => (
//                     <div key={review.id} className="mb-6 border-b pb-4">
//                         <div className="flex items-center justify-between mb-2">
//                             <div>
//                                 <RatingStars rating={review.rating} />
//                                 <p className="font-semibold">{review.title}</p>
//                             </div>
//                             <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
//                         </div>
//                         <p className="mb-2">{review.comment}</p>
//                         {review.pros && <p className="text-green-600">Pros: {review.pros}</p>}
//                         {review.cons && <p className="text-red-600">Cons: {review.cons}</p>}
//                         {review.images && review.images.length > 0 && (
//                             <div className="flex mt-2 space-x-2">
//                                 {review.images.map(img => (
//                                     <img key={img.id} src={img.image} alt="Review" className="w-20 h-20 object-cover rounded" />
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 ))
//             ) : (
//                 <p>No reviews yet. Be the first to review this product!</p>
//             )}
//         </div>
//     );
//
//     const TabContent = () => {
//         switch (activeTab) {
//             case 'details':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
//                         <ul className="list-disc list-inside text-gray-700">
//                             {product.specifications.map((spec, index) => (
//                                 <li key={index}>{spec.name}: {spec.value}</li>
//                             ))}
//                         </ul>
//                     </motion.div>
//                 );
//             case 'description':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <p className="text-gray-700">{product.description}</p>
//                     </motion.div>
//                 );
//             case 'reviews':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <div className="flex justify-between items-center mb-6">
//                             <h3 className="text-2xl font-semibold">Customer Reviews</h3>
//                             <Link
//                                 to={`/product/${slug}/reviews`}
//                                 className="text-primary hover:text-primary-dark transition duration-300"
//                             >
//                                 View All Reviews
//                             </Link>
//                         </div>
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                             <div>
//                                 <ReviewForm />
//                             </div>
//                             <div>
//                                 <h4 className="text-xl font-semibold mb-4">Recent Reviews</h4>
//                                 <ReviewsList limit={3} />
//                                 <Link
//                                     to={`/product/${slug}/reviews`}
//                                     className="mt-4 inline-block text-primary hover:text-primary-dark transition duration-300"
//                                 >
//                                     See More Reviews
//                                 </Link>
//                             </div>
//                         </div>
//                     </motion.div>
//                 );
//             default:
//                 return null;
//         }
//     };
//     // const TabContent = () => {
//     //     switch (activeTab) {
//     //         case 'details':
//     //             return (
//     //                 <motion.div
//     //                     initial={{ opacity: 0 }}
//     //                     animate={{ opacity: 1 }}
//     //                     exit={{ opacity: 0 }}
//     //                 >
//     //                     <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
//     //                     <ul className="list-disc list-inside text-gray-700">
//     //                         {product.specifications.map((spec, index) => (
//     //                             <li key={index}>{spec.name}: {spec.value}</li>
//     //                         ))}
//     //                     </ul>
//     //                 </motion.div>
//     //             );
//     //         case 'description':
//     //             return (
//     //                 <motion.div
//     //                     initial={{ opacity: 0 }}
//     //                     animate={{ opacity: 1 }}
//     //                     exit={{ opacity: 0 }}
//     //                 >
//     //                     <p className="text-gray-700">{product.description}</p>
//     //                 </motion.div>
//     //             );
//     //         case 'reviews':
//     //             return (
//     //                 <motion.div
//     //                     initial={{ opacity: 0 }}
//     //                     animate={{ opacity: 1 }}
//     //                     exit={{ opacity: 0 }}
//     //                 >
//     //                     {/*<ReviewsList />*/}
//     //                     <ReviewForm />
//     //                 </motion.div>
//     //             );
//     //         default:
//     //             return null;
//     //     }
//     // };
//
//     if (loading) return (
//         <div className="flex justify-center items-center h-screen">
//             <motion.div
//                 className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//         </div>
//     );
//
//     if (error) return (
//         <div className="text-center py-10 text-red-500">
//             <h2 className="text-2xl font-bold mb-4">Error</h2>
//             <p>{error}</p>
//         </div>
//     );
//
//     if (!product) return <div className="text-center py-10">Product not found.</div>;
//
//     const images = product.is_variant ? (selectedVariant ? selectedVariant.images : []) : product.images;
//
//     return (
//         <div className="bg-gray-100 min-h-screen py-8">
//             <div className="max-w-6xl mx-auto px-4">
//                 <motion.div
//                     className="bg-white rounded-lg shadow-lg p-6"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         {/* Left column: Images */}
//                         <div className="space-y-4">
//                             <div className="aspect-w-1 aspect-h-1">
//                                 {images.length > 0 ? (
//                                     <MagnifyGlass imageSrc={images[currentImage].image} />
//                                 ) : (
//                                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                                         <p>No image available</p>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="flex space-x-2 overflow-x-auto">
//                                 {images.map((img, index) => (
//                                     <ThumbImage key={img.id} src={img.image} alt={img.alt_text} index={index} />
//                                 ))}
//                             </div>
//                         </div>
//
//                         {/* Right column: Product details */}
//                         <div>
//                             <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
//                             <div className="flex items-center mb-4">
//                                 <RatingStars rating={product.average_rating || 0} />
//                                 <span className="ml-2 text-gray-600">({reviews.length} reviews)</span>
//                             </div>
//                             <PriceDisplay />
//                             <p className="text-gray-700 mb-6">{product.description}</p>
//                             {product.is_variant && <VariantSelector />}
//                             <div className="flex items-center mb-6">
//                                 <span className="mr-4">Quantity:</span>
//                                 <div className="flex items-center border rounded">
//                                     <motion.button
//                                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         -
//                                     </motion.button>
//                                     <span className="px-4 py-1">{quantity}</span>
//                                     <motion.button
//                                         onClick={() => setQuantity(quantity + 1)}
//                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         +
//                                     </motion.button>
//                                 </div>
//                             </div>
//                             <AddToCartButton />
//                             <div className="flex justify-between mt-6">
//                                 <motion.button
//                                     className="flex items-center text-primary hover:text-primary-dark"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <FaHeart className="mr-2" /> Add to Wishlist
//                                 </motion.button>
//                                 <motion.button
//                                     className="flex items-center text-primary hover:text-primary-dark"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <FiShare2 className="mr-2" /> Share
//                                 </motion.button>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Tabs */}
//                     <div className="mt-12">
//                         <div className="border-b">
//                             <div className="flex space-x-4">
//                                 {['details', 'description', 'reviews'].map((tab) => (
//                                     <motion.button
//                                         key={tab}
//                                         onClick={() => setActiveTab(tab)}
//                                         className={`py-2 px-4 font-medium ${
//                                             activeTab === tab
//                                                 ? 'border-b-2 border-primary text-primary'
//                                                 : 'text-gray-500 hover:text-gray-700'
//                                         }`}
//                                         whileHover={{ y: -2 }}
//                                         whileTap={{ y: 0 }}
//                                     >
//                                         {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                     </motion.button>
//                                 ))}
//                             </div>
//                         </div>
//                         <div className="mt-6">
//                             <AnimatePresence mode="wait">
//                                 <TabContent />
//                             </AnimatePresence>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };
//
// export default ProductDetailPage;
// //<editor-fold desc="without review form">
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaStar, FaHeart, FaShoppingCart, FaRegStar } from 'react-icons/fa';
// import { FiShare2 } from 'react-icons/fi';
// import MagnifyGlass from "../utils/MagnifyGlass";
//
// const API_BASE_URL = 'http://127.0.0.1:8000/api/v2/client';
//
// const ProductDetailPage = () => {
//     const { slug } = useParams();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [quantity, setQuantity] = useState(1);
//     const [activeTab, setActiveTab] = useState('details');
//     const [selectedVariant, setSelectedVariant] = useState(null);
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [currentImage, setCurrentImage] = useState(0);
//
//     useEffect(() => {
//         const fetchProduct = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const response = await axios.get(`${API_BASE_URL}/products/${slug}/`);
//                 setProduct(response.data);
//                 if (response.data.is_variant && response.data.variants.length > 0) {
//                     setSelectedVariant(response.data.variants[0]);
//                     initializeOptions(response.data.variants[0]);
//                 }
//                 setLoading(false);
//             } catch (err) {
//                 setError(err.message || 'An error occurred while fetching the product.');
//                 setLoading(false);
//             }
//         };
//
//         fetchProduct();
//     }, [slug]);
//
//     const initializeOptions = (variant) => {
//         if (!variant) return;
//         const initialOptions = {};
//         variant.attribute_values.forEach(attr => {
//             initialOptions[attr.attribute_name] = attr.value;
//         });
//         setSelectedOptions(initialOptions);
//     };
//
//     const handleOptionChange = (optionName, value) => {
//         const newOptions = { ...selectedOptions, [optionName]: value };
//         setSelectedOptions(newOptions);
//
//         if (product.variants) {
//             const newVariant = product.variants.find(variant =>
//                 variant.attribute_values.every(attr =>
//                     newOptions[attr.attribute_name] === attr.value
//                 )
//             );
//
//             if (newVariant) {
//                 setSelectedVariant(newVariant);
//                 setCurrentImage(0);
//             }
//         }
//     };
//
//     const getAvailableOptions = (optionName) => {
//         if (!product.variants) return [];
//         const availableOptions = new Set();
//         product.variants.forEach(variant => {
//             const matchesCurrentSelection = Object.entries(selectedOptions).every(([key, value]) => {
//                 if (key === optionName) return true;
//                 return variant.attribute_values.some(attr => attr.attribute_name === key && attr.value === value);
//             });
//             if (matchesCurrentSelection) {
//                 const option = variant.attribute_values.find(attr => attr.attribute_name === optionName);
//                 if (option) availableOptions.add(option.value);
//             }
//         });
//         return Array.from(availableOptions);
//     };
//
//     const isOptionAvailable = (optionName, value) => {
//         return getAvailableOptions(optionName).includes(value);
//     };
//
//     const ThumbImage = ({ src, alt, index }) => (
//         <motion.img
//             src={src}
//             alt={alt}
//             className={`w-16 h-16 object-cover cursor-pointer rounded-lg ${index === currentImage ? 'border-2 border-primary' : ''}`}
//             onClick={() => setCurrentImage(index)}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//         />
//     );
//
//     const RatingStars = ({ rating }) => (
//         <div className="flex">
//             {[1, 2, 3, 4, 5].map((star) => (
//                 <span key={star}>
//                     {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
//                 </span>
//             ))}
//         </div>
//     );
//
//     const PriceDisplay = () => (
//         <div className="mb-4">
//             <span className="text-3xl font-bold text-primary">
//                 ${product.is_variant ? (selectedVariant ? selectedVariant.price : product.display_price) : product.display_price}
//             </span>
//             {parseFloat(product.display_price) < parseFloat(product.base_price) && (
//                 <span className="ml-2 text-gray-500 line-through">${product.base_price}</span>
//             )}
//         </div>
//     );
//
//     const VariantSelector = () => (
//         <div className="mb-6">
//             {product.grouped_options && product.grouped_options.map(option => (
//                 <div key={option.name} className="mb-4">
//                     <h3 className="text-lg font-semibold mb-2">{option.name}</h3>
//                     <div className="flex flex-wrap gap-2">
//                         {option.values.map(value => (
//                             <motion.button
//                                 key={value}
//                                 onClick={() => handleOptionChange(option.name, value)}
//                                 className={`px-4 py-2 rounded ${
//                                     selectedOptions[option.name] === value
//                                         ? 'bg-primary text-white'
//                                         : isOptionAvailable(option.name, value)
//                                             ? 'bg-gray-200 text-gray-800'
//                                             : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                 }`}
//                                 disabled={!isOptionAvailable(option.name, value)}
//                                 whileHover={isOptionAvailable(option.name, value) ? { scale: 1.05 } : {}}
//                                 whileTap={isOptionAvailable(option.name, value) ? { scale: 0.95 } : {}}
//                             >
//                                 {value}
//                             </motion.button>
//                         ))}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
//
//     const AddToCartButton = () => (
//         <motion.button
//             className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold text-lg flex items-center justify-center"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//         >
//             <FaShoppingCart className="mr-2" /> Add to Cart
//         </motion.button>
//     );
//
//     const TabContent = () => {
//         switch (activeTab) {
//             case 'details':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
//                         <ul className="list-disc list-inside text-gray-700">
//                             {product.specifications.map((spec, index) => (
//                                 <li key={index}>{spec.name}: {spec.value}</li>
//                             ))}
//                         </ul>
//                     </motion.div>
//                 );
//             case 'description':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <p className="text-gray-700">{product.description}</p>
//                     </motion.div>
//                 );
//             case 'reviews':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
//                         <p>No reviews yet. Be the first to review this product!</p>
//                     </motion.div>
//                 );
//             default:
//                 return null;
//         }
//     };
//
//     if (loading) return (
//         <div className="flex justify-center items-center h-screen">
//             <motion.div
//                 className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//         </div>
//     );
//
//     if (error) return (
//         <div className="text-center py-10 text-red-500">
//             <h2 className="text-2xl font-bold mb-4">Error</h2>
//             <p>{error}</p>
//         </div>
//     );
//
//     if (!product) return <div className="text-center py-10">Product not found.</div>;
//
//     const images = product.is_variant ? (selectedVariant ? selectedVariant.images : []) : product.images;
//
//     return (
//         <div className="bg-gray-100 min-h-screen py-8">
//             <div className="max-w-6xl mx-auto px-4">
//                 <motion.div
//                     className="bg-white rounded-lg shadow-lg p-6"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         {/* Left column: Images */}
//                         <div className="space-y-4">
//                             <div className="aspect-w-1 aspect-h-1">
//                                 {images.length > 0 ? (
//                                     <MagnifyGlass imageSrc={images[currentImage].image} />
//                                 ) : (
//                                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                                         <p>No image available</p>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="flex space-x-2 overflow-x-auto">
//                                 {images.map((img, index) => (
//                                     <ThumbImage key={img.id} src={img.image} alt={img.alt_text} index={index} />
//                                 ))}
//                             </div>
//                         </div>
//
//                         {/* Right column: Product details */}
//                         <div>
//                             <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
//                             <div className="flex items-center mb-4">
//                                 <RatingStars rating={4} />
//                                 <span className="ml-2 text-gray-600">(0 reviews)</span>
//                             </div>
//                             <PriceDisplay />
//                             <p className="text-gray-700 mb-6">{product.description}</p>
//                             {product.is_variant && <VariantSelector />}
//                             <div className="flex items-center mb-6">
//                                 <span className="mr-4">Quantity:</span>
//                                 <div className="flex items-center border rounded">
//                                     <motion.button
//                                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         -
//                                     </motion.button>
//                                     <span className="px-4 py-1">{quantity}</span>
//                                     <motion.button
//                                         onClick={() => setQuantity(quantity + 1)}
//                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         +
//                                     </motion.button>
//                                 </div>
//                             </div>
//                             <AddToCartButton />
//                             <div className="flex justify-between mt-6">
//                                 <motion.button
//                                     className="flex items-center text-primary hover:text-primary-dark"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <FaHeart className="mr-2" /> Add to Wishlist
//                                 </motion.button>
//                                 <motion.button
//                                     className="flex items-center text-primary hover:text-primary-dark"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <FiShare2 className="mr-2" /> Share
//                                 </motion.button>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Tabs */}
//                     <div className="mt-12">
//                         <div className="border-b">
//                             <div className="flex space-x-4">
//                                 {['details', 'description', 'reviews'].map((tab) => (
//                                     <motion.button
//                                         key={tab}
//                                         onClick={() => setActiveTab(tab)}
//                                         className={`py-2 px-4 font-medium ${
//                                             activeTab === tab
//                                                 ? 'border-b-2 border-primary text-primary'
//                                                 : 'text-gray-500 hover:text-gray-700'
//                                         }`}
//                                         whileHover={{ y: -2 }}
//                                         whileTap={{ y: 0 }}
//                                     >
//                                         {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                     </motion.button>
//                                 ))}
//                             </div>
//                         </div>
//                         <div className="mt-6">
//                             <AnimatePresence mode="wait">
//                                 <TabContent />
//                             </AnimatePresence>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };
//
// export default ProductDetailPage;
// //</editor-fold>
// =======================new==============
// =======================new==============
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaStar, FaHeart, FaShoppingCart, FaRegStar } from 'react-icons/fa';
// import { FiShare2 } from 'react-icons/fi';
// import MagnifyGlass from "../utils/MagnifyGlass";
//
// const API_BASE_URL = 'http://127.0.0.1:8000/api/v2/client';
//
// const ProductDetailPage = () => {
//     const { slug } = useParams();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [quantity, setQuantity] = useState(1);
//     const [activeTab, setActiveTab] = useState('details');
//     const [selectedVariant, setSelectedVariant] = useState(null);
//     const [selectedOptions, setSelectedOptions] = useState({});
//     const [currentImage, setCurrentImage] = useState(0);
//
//     useEffect(() => {
//         const fetchProduct = async () => {
//             setLoading(true);
//             setError(null);
//             try {
//                 const response = await axios.get(`${API_BASE_URL}/products/${slug}/`);
//                 setProduct(response.data);
//                 if (response.data.is_variant && response.data.variants.length > 0) {
//                     setSelectedVariant(response.data.variants[0]);
//                     initializeOptions(response.data.variants[0]);
//                 }
//                 setLoading(false);
//             } catch (err) {
//                 setError(err.message || 'An error occurred while fetching the product.');
//                 setLoading(false);
//             }
//         };
//
//         fetchProduct();
//     }, [slug]);
//
//     const initializeOptions = (variant) => {
//         if (!variant) return;
//         const initialOptions = {};
//         variant.attribute_values.forEach(attr => {
//             initialOptions[attr.attribute_name] = attr.value;
//         });
//         setSelectedOptions(initialOptions);
//     };
//
//     const handleOptionChange = (optionName, value) => {
//         const newOptions = { ...selectedOptions, [optionName]: value };
//         setSelectedOptions(newOptions);
//
//         if (product.variants) {
//             const newVariant = product.variants.find(variant =>
//                 variant.attribute_values.every(attr =>
//                     newOptions[attr.attribute_name] === attr.value
//                 )
//             );
//
//             if (newVariant) {
//                 setSelectedVariant(newVariant);
//                 setCurrentImage(0);
//             }
//         }
//     };
//
//     const getAvailableOptions = (optionName) => {
//         if (!product.variants) return [];
//         const availableOptions = new Set();
//         product.variants.forEach(variant => {
//             const matchesCurrentSelection = Object.entries(selectedOptions).every(([key, value]) => {
//                 if (key === optionName) return true;
//                 return variant.attribute_values.some(attr => attr.attribute_name === key && attr.value === value);
//             });
//             if (matchesCurrentSelection) {
//                 const option = variant.attribute_values.find(attr => attr.attribute_name === optionName);
//                 if (option) availableOptions.add(option.value);
//             }
//         });
//         return Array.from(availableOptions);
//     };
//
//     const isOptionAvailable = (optionName, value) => {
//         return getAvailableOptions(optionName).includes(value);
//     };
//
//     const ThumbImage = ({ src, alt, index }) => (
//         <motion.img
//             src={src}
//             alt={alt}
//             className={`w-16 h-16 object-cover cursor-pointer rounded-lg ${index === currentImage ? 'border-2 border-primary' : ''}`}
//             onClick={() => setCurrentImage(index)}
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.9 }}
//         />
//     );
//
//     const RatingStars = ({ rating }) => (
//         <div className="flex">
//             {[1, 2, 3, 4, 5].map((star) => (
//                 <span key={star}>
//                     {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
//                 </span>
//             ))}
//         </div>
//     );
//
//     const PriceDisplay = () => (
//         <div className="mb-4">
//             <span className="text-3xl font-bold text-primary">
//                 ${product.is_variant ? (selectedVariant ? selectedVariant.price : product.display_price) : product.display_price}
//             </span>
//             {parseFloat(product.display_price) < parseFloat(product.base_price) && (
//                 <span className="ml-2 text-gray-500 line-through">${product.base_price}</span>
//             )}
//         </div>
//     );
//
//     const VariantSelector = () => (
//         <div className="mb-6">
//             {product.grouped_options && product.grouped_options.map(option => (
//                 <div key={option.name} className="mb-4">
//                     <h3 className="text-lg font-semibold mb-2">{option.name}</h3>
//                     <div className="flex flex-wrap gap-2">
//                         {option.values.map(value => (
//                             <motion.button
//                                 key={value}
//                                 onClick={() => handleOptionChange(option.name, value)}
//                                 className={`px-4 py-2 rounded ${
//                                     selectedOptions[option.name] === value
//                                         ? 'bg-primary text-white'
//                                         : isOptionAvailable(option.name, value)
//                                             ? 'bg-gray-200 text-gray-800'
//                                             : 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                                 }`}
//                                 disabled={!isOptionAvailable(option.name, value)}
//                                 whileHover={isOptionAvailable(option.name, value) ? { scale: 1.05 } : {}}
//                                 whileTap={isOptionAvailable(option.name, value) ? { scale: 0.95 } : {}}
//                             >
//                                 {value}
//                             </motion.button>
//                         ))}
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );
//
//     const AddToCartButton = () => (
//         <motion.button
//             className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold text-lg flex items-center justify-center"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//         >
//             <FaShoppingCart className="mr-2" /> Add to Cart
//         </motion.button>
//     );
//
//     const TabContent = () => {
//         switch (activeTab) {
//             case 'details':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
//                         <ul className="list-disc list-inside text-gray-700">
//                             {product.specifications.map((spec, index) => (
//                                 <li key={index}>{spec.name}: {spec.value}</li>
//                             ))}
//                         </ul>
//                     </motion.div>
//                 );
//             case 'description':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <p className="text-gray-700">{product.description}</p>
//                     </motion.div>
//                 );
//             case 'reviews':
//                 return (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                     >
//                         <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
//                         <p>No reviews yet. Be the first to review this product!</p>
//                     </motion.div>
//                 );
//             default:
//                 return null;
//         }
//     };
//
//     if (loading) return (
//         <div className="flex justify-center items-center h-screen">
//             <motion.div
//                 className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
//                 animate={{ rotate: 360 }}
//                 transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             />
//         </div>
//     );
//
//     if (error) return (
//         <div className="text-center py-10 text-red-500">
//             <h2 className="text-2xl font-bold mb-4">Error</h2>
//             <p>{error}</p>
//         </div>
//     );
//
//     if (!product) return <div className="text-center py-10">Product not found.</div>;
//
//     const images = product.is_variant ? (selectedVariant ? selectedVariant.images : []) : product.images;
//
//     return (
//         <div className="bg-gray-100 min-h-screen py-8">
//             <div className="max-w-6xl mx-auto px-4">
//                 <motion.div
//                     className="bg-white rounded-lg shadow-lg p-6"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                         {/* Left column: Images */}
//                         <div className="space-y-4">
//                             <div className="aspect-w-1 aspect-h-1">
//                                 {images.length > 0 ? (
//                                     <MagnifyGlass imageSrc={images[currentImage].image} />
//                                 ) : (
//                                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                                         <p>No image available</p>
//                                     </div>
//                                 )}
//                             </div>
//                             <div className="flex space-x-2 overflow-x-auto">
//                                 {images.map((img, index) => (
//                                     <ThumbImage key={img.id} src={img.image} alt={img.alt_text} index={index} />
//                                 ))}
//                             </div>
//                         </div>
//
//                         {/* Right column: Product details */}
//                         <div>
//                             <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
//                             <div className="flex items-center mb-4">
//                                 <RatingStars rating={4} />
//                                 <span className="ml-2 text-gray-600">(0 reviews)</span>
//                             </div>
//                             <PriceDisplay />
//                             <p className="text-gray-700 mb-6">{product.description}</p>
//                             {product.is_variant && <VariantSelector />}
//                             <div className="flex items-center mb-6">
//                                 <span className="mr-4">Quantity:</span>
//                                 <div className="flex items-center border rounded">
//                                     <motion.button
//                                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         -
//                                     </motion.button>
//                                     <span className="px-4 py-1">{quantity}</span>
//                                     <motion.button
//                                         onClick={() => setQuantity(quantity + 1)}
//                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
//                                         whileTap={{ scale: 0.95 }}
//                                     >
//                                         +
//                                     </motion.button>
//                                 </div>
//                             </div>
//                             <AddToCartButton />
//                             <div className="flex justify-between mt-6">
//                                 <motion.button
//                                     className="flex items-center text-primary hover:text-primary-dark"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <FaHeart className="mr-2" /> Add to Wishlist
//                                 </motion.button>
//                                 <motion.button
//                                     className="flex items-center text-primary hover:text-primary-dark"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     <FiShare2 className="mr-2" /> Share
//                                 </motion.button>
//                             </div>
//                         </div>
//                     </div>
//
//                     {/* Tabs */}
//                     <div className="mt-12">
//                         <div className="border-b">
//                             <div className="flex space-x-4">
//                                 {['details', 'description', 'reviews'].map((tab) => (
//                                     <motion.button
//                                         key={tab}
//                                         onClick={() => setActiveTab(tab)}
//                                         className={`py-2 px-4 font-medium ${
//                                             activeTab === tab
//                                                 ? 'border-b-2 border-primary text-primary'
//                                                 : 'text-gray-500 hover:text-gray-700'
//                                         }`}
//                                         whileHover={{ y: -2 }}
//                                         whileTap={{ y: 0 }}
//                                     >
//                                         {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                                     </motion.button>
//                                 ))}
//                             </div>
//                         </div>
//                         <div className="mt-6">
//                             <AnimatePresence mode="wait">
//                                 <TabContent />
//                             </AnimatePresence>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </div>
//     );
// };
//
// export default ProductDetailPage;
// // import React, { useState, useEffect } from 'react';
// // import { useParams } from 'react-router-dom';
// // import axios from 'axios';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import { FaStar, FaHeart, FaShoppingCart, FaRegStar } from 'react-icons/fa';
// // import { FiShare2 } from 'react-icons/fi';
// // import MagnifyGlass from "../utils/MagnifyGlass";
// //
// // const API_BASE_URL = 'http://127.0.0.1:8000/api/v2/client';
// //
// // const ProductDetailPage = () => {
// //     const { slug } = useParams();
// //     const [product, setProduct] = useState(null);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //     const [quantity, setQuantity] = useState(1);
// //     const [activeTab, setActiveTab] = useState('details');
// //     const [selectedVariant, setSelectedVariant] = useState(null);
// //     const [selectedOptions, setSelectedOptions] = useState({});
// //     const [currentImage, setCurrentImage] = useState(0);
// //
// //     useEffect(() => {
// //         const fetchProduct = async () => {
// //             setLoading(true);
// //             setError(null);
// //             try {
// //                 const response = await axios.get(`${API_BASE_URL}/products/${slug}/`);
// //                 setProduct(response.data);
// //                 if (response.data.variants && response.data.variants.length > 0) {
// //                     setSelectedVariant(response.data.variants[0]);
// //                     initializeOptions(response.data.variants[0]);
// //                 }
// //             } catch (err) {
// //                 setError(err.message || 'An error occurred while fetching the product.');
// //             } finally {
// //                 setLoading(false);
// //             }
// //         };
// //
// //         fetchProduct();
// //     }, [slug]);
// //
// //     const initializeOptions = (variant) => {
// //         const initialOptions = {};
// //         variant.attribute_values.forEach(attr => {
// //             initialOptions[attr.attribute_name] = attr.value;
// //         });
// //         setSelectedOptions(initialOptions);
// //     };
// //
// //     const handleOptionChange = (optionName, value) => {
// //         const newOptions = { ...selectedOptions, [optionName]: value };
// //         setSelectedOptions(newOptions);
// //
// //         const newVariant = product.variants.find(variant =>
// //             variant.attribute_values.every(attr =>
// //                 newOptions[attr.attribute_name] === attr.value
// //             )
// //         );
// //
// //         if (newVariant) {
// //             setSelectedVariant(newVariant);
// //             setCurrentImage(0);
// //         }
// //     };
// //
// //     const getAvailableOptions = (optionName) => {
// //         const availableOptions = new Set();
// //         product.variants.forEach(variant => {
// //             const matchesCurrentSelection = Object.entries(selectedOptions).every(([key, value]) => {
// //                 if (key === optionName) return true;
// //                 return variant.attribute_values.some(attr => attr.attribute_name === key && attr.value === value);
// //             });
// //             if (matchesCurrentSelection) {
// //                 const option = variant.attribute_values.find(attr => attr.attribute_name === optionName);
// //                 if (option) availableOptions.add(option.value);
// //             }
// //         });
// //         return Array.from(availableOptions);
// //     };
// //
// //     const isOptionAvailable = (optionName, value) => {
// //         return getAvailableOptions(optionName).includes(value);
// //     };
// //
// //     const ThumbImage = ({ src, alt, index }) => (
// //         <motion.img
// //             src={src}
// //             alt={alt}
// //             className={`w-16 h-16 object-cover cursor-pointer rounded-lg ${index === currentImage ? 'border-2 border-blue-500' : ''}`}
// //             onClick={() => setCurrentImage(index)}
// //             whileHover={{ scale: 1.1 }}
// //             whileTap={{ scale: 0.9 }}
// //         />
// //     );
// //
// //     const RatingStars = ({ rating }) => (
// //         <div className="flex">
// //             {[1, 2, 3, 4, 5].map((star) => (
// //                 <span key={star}>
// //                     {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
// //                 </span>
// //             ))}
// //         </div>
// //     );
// //
// //     const PriceDisplay = () => (
// //         <div className="mb-4">
// //             <span className="text-3xl font-bold text-red-600">${selectedVariant.price}</span>
// //             {parseFloat(selectedVariant.price) < parseFloat(product.base_price) && (
// //                 <span className="ml-2 text-gray-500 line-through">${product.base_price}</span>
// //             )}
// //         </div>
// //     );
// //
// //     const VariantSelector = () => (
// //         <div className="mb-6">
// //             {product.grouped_options.map(option => (
// //                 <div key={option.name} className="mb-4">
// //                     <h3 className="text-lg font-semibold mb-2">{option.name}</h3>
// //                     <div className="flex flex-wrap gap-2">
// //                         {option.values.map(value => (
// //                             <motion.button
// //                                 key={value}
// //                                 onClick={() => handleOptionChange(option.name, value)}
// //                                 className={`px-4 py-2 rounded ${
// //                                     selectedOptions[option.name] === value
// //                                         ? 'bg-blue-500 text-white'
// //                                         : isOptionAvailable(option.name, value)
// //                                             ? 'bg-gray-200 text-gray-800'
// //                                             : 'bg-gray-100 text-gray-400 cursor-not-allowed'
// //                                 }`}
// //                                 disabled={!isOptionAvailable(option.name, value)}
// //                                 whileHover={isOptionAvailable(option.name, value) ? { scale: 1.05 } : {}}
// //                                 whileTap={isOptionAvailable(option.name, value) ? { scale: 0.95 } : {}}
// //                             >
// //                                 {value}
// //                             </motion.button>
// //                         ))}
// //                     </div>
// //                 </div>
// //             ))}
// //         </div>
// //     );
// //
// //     const AddToCartButton = () => (
// //         <motion.button
// //             className="w-full bg-yellow-400 text-gray-900 py-3 px-6 rounded-lg font-semibold text-lg flex items-center justify-center"
// //             whileHover={{ scale: 1.02 }}
// //             whileTap={{ scale: 0.98 }}
// //         >
// //             <FaShoppingCart className="mr-2" /> Add to Cart
// //         </motion.button>
// //     );
// //
// //     const TabContent = () => {
// //         switch (activeTab) {
// //             case 'details':
// //                 return (
// //                     <motion.div
// //                         initial={{ opacity: 0 }}
// //                         animate={{ opacity: 1 }}
// //                         exit={{ opacity: 0 }}
// //                     >
// //                         <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
// //                         <ul className="list-disc list-inside text-gray-700">
// //                             {product.specifications.map((spec, index) => (
// //                                 <li key={index}>{spec.name}: {spec.value}</li>
// //                             ))}
// //                         </ul>
// //                     </motion.div>
// //                 );
// //             case 'description':
// //                 return (
// //                     <motion.div
// //                         initial={{ opacity: 0 }}
// //                         animate={{ opacity: 1 }}
// //                         exit={{ opacity: 0 }}
// //                     >
// //                         <p className="text-gray-700">{product.description}</p>
// //                     </motion.div>
// //                 );
// //             case 'reviews':
// //                 return (
// //                     <motion.div
// //                         initial={{ opacity: 0 }}
// //                         animate={{ opacity: 1 }}
// //                         exit={{ opacity: 0 }}
// //                     >
// //                         <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
// //                         <p>No reviews yet. Be the first to review this product!</p>
// //                     </motion.div>
// //                 );
// //             default:
// //                 return null;
// //         }
// //     };
// //
// //     if (loading) return <div className="text-center py-10">Loading...</div>;
// //     if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
// //     if (!product) return <div className="text-center py-10">Product not found.</div>;
// //
// //     return (
// //         <div className="bg-gray-100 min-h-screen py-8">
// //             <div className="max-w-6xl mx-auto px-4">
// //                 <div className="bg-white rounded-lg shadow-lg p-6">
// //                     <div className="flex flex-col md:flex-row">
// //                         {/* Left column: Images */}
// //                         <div className="md:w-1/2 mb-6 md:mb-0">
// //                             <div className="mb-4">
// //                                 <MagnifyGlass imageSrc={selectedVariant.images[currentImage]?.image || ''} />
// //                             </div>
// //                             <div className="flex space-x-2 overflow-x-auto">
// //                                 {selectedVariant.images.map((img, index) => (
// //                                     <ThumbImage key={img.id} src={img.image} alt={img.alt_text} index={index} />
// //                                 ))}
// //                             </div>
// //                         </div>
// //
// //                         {/* Right column: Product details */}
// //                         <div className="md:w-1/2 md:pl-8">
// //                             <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
// //                             <div className="flex items-center mb-4">
// //                                 <RatingStars rating={4} />
// //                                 <span className="ml-2 text-gray-600">(0 reviews)</span>
// //                             </div>
// //                             <PriceDisplay />
// //                             <p className="text-gray-700 mb-6">{product.description}</p>
// //                             <VariantSelector />
// //                             <div className="flex items-center mb-6">
// //                                 <span className="mr-4">Quantity:</span>
// //                                 <div className="flex items-center border rounded">
// //                                     <button
// //                                         onClick={() => setQuantity(Math.max(1, quantity - 1))}
// //                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
// //                                     >
// //                                         -
// //                                     </button>
// //                                     <span className="px-4 py-1">{quantity}</span>
// //                                     <button
// //                                         onClick={() => setQuantity(quantity + 1)}
// //                                         className="px-3 py-1 bg-gray-200 hover:bg-gray-300"
// //                                     >
// //                                         +
// //                                     </button>
// //                                 </div>
// //                             </div>
// //                             <AddToCartButton />
// //                             <div className="flex justify-between mt-6">
// //                                 <motion.button
// //                                     className="flex items-center text-blue-600 hover:text-blue-800"
// //                                     whileHover={{ scale: 1.05 }}
// //                                     whileTap={{ scale: 0.95 }}
// //                                 >
// //                                     <FaHeart className="mr-2" /> Add to Wishlist
// //                                 </motion.button>
// //                                 <motion.button
// //                                     className="flex items-center text-blue-600 hover:text-blue-800"
// //                                     whileHover={{ scale: 1.05 }}
// //                                     whileTap={{ scale: 0.95 }}
// //                                 >
// //                                     <FiShare2 className="mr-2" /> Share
// //                                 </motion.button>
// //                             </div>
// //                         </div>
// //                     </div>
// //
// //                     {/* Tabs */}
// //                     <div className="mt-12">
// //                         <div className="border-b">
// //                             <div className="flex space-x-4">
// //                                 {['details', 'description', 'reviews'].map((tab) => (
// //                                     <button
// //                                         key={tab}
// //                                         onClick={() => setActiveTab(tab)}
// //                                         className={`py-2 px-4 font-medium ${
// //                                             activeTab === tab
// //                                                 ? 'border-b-2 border-blue-500 text-blue-600'
// //                                                 : 'text-gray-500 hover:text-gray-700'
// //                                         }`}
// //                                     >
// //                                         {tab.charAt(0).toUpperCase() + tab.slice(1)}
// //                                     </button>
// //                                 ))}
// //                             </div>
// //                         </div>
// //                         <div className="mt-6">
// //                             <AnimatePresence mode="wait">
// //                                 <TabContent />
// //                             </AnimatePresence>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default ProductDetailPage;
// // // import React, { useState, useEffect } from 'react';
// // // import { useParams } from 'react-router-dom';
// // // import axios from 'axios';
// // // import { FaStar, FaHeart, FaShoppingCart, FaRegStar } from 'react-icons/fa';
// // // import { FiShare2 } from 'react-icons/fi';
// // // import MagnifyGlass from "../utils/MagnifyGlass";
// // //
// // // const API_BASE_URL = 'http://127.0.0.1:8000/api/v2/client';
// // //
// // // const ProductDetailPage = () => {
// // //     const { slug } = useParams();
// // //     const [product, setProduct] = useState(null);
// // //     const [loading, setLoading] = useState(true);
// // //     const [error, setError] = useState(null);
// // //     const [quantity, setQuantity] = useState(1);
// // //     const [activeTab, setActiveTab] = useState('details');
// // //     const [newReview, setNewReview] = useState({ name: '', rating: 0, comment: '' });
// // //     const [currentImage, setCurrentImage] = useState(0);
// // //     const [selectedVariant, setSelectedVariant] = useState(null);
// // //     const [selectedOptions, setSelectedOptions] = useState({});
// // //
// // //     useEffect(() => {
// // //         const fetchProduct = async () => {
// // //             setLoading(true);
// // //             setError(null);
// // //             try {
// // //                 console.log('Fetching product data for slug:', slug);
// // //                 const response = await axios.get(`${API_BASE_URL}/products/${slug}/`);
// // //                 console.log('API Response:', response.data);
// // //                 setProduct(response.data);
// // //                 if (response.data.variants && response.data.variants.length > 0) {
// // //                     setSelectedVariant(response.data.variants[0]);
// // //                 }
// // //                 if (response.data.grouped_options) {
// // //                     const initialOptions = {};
// // //                     response.data.grouped_options.forEach(option => {
// // //                         initialOptions[option.name] = option.values[0];
// // //                     });
// // //                     setSelectedOptions(initialOptions);
// // //                 }
// // //             } catch (err) {
// // //                 console.error('Error fetching product:', err);
// // //                 setError(err.message || 'An error occurred while fetching the product.');
// // //             } finally {
// // //                 setLoading(false);
// // //             }
// // //         };
// // //
// // //         fetchProduct();
// // //     }, [slug]);
// // //
// // //     const calculateTotalPrice = () => {
// // //         if (!product) return 0;
// // //         let total = selectedVariant ? parseFloat(selectedVariant.price) : parseFloat(product.base_price);
// // //         return total * quantity;
// // //     };
// // //
// // //     const handleVariantChange = (variant) => {
// // //         console.log('Changing variant to:', variant);
// // //         setSelectedVariant(variant);
// // //         setCurrentImage(0);
// // //     };
// // //
// // //     const handleOptionChange = (optionName, value) => {
// // //         console.log('Changing option:', optionName, 'to', value);
// // //         setSelectedOptions(prev => ({
// // //             ...prev,
// // //             [optionName]: value
// // //         }));
// // //
// // //         if (product.variants) {
// // //             const newVariant = product.variants.find(variant =>
// // //                 variant.attribute_values.every(attr =>
// // //                     attr.value === value || selectedOptions[attr.attribute_name] === attr.value
// // //                 )
// // //             );
// // //
// // //             if (newVariant) {
// // //                 setSelectedVariant(newVariant);
// // //             }
// // //         }
// // //     };
// // //
// // //     const ThumbImage = ({ src, index, isActive }) => (
// // //         <img
// // //             src={src}
// // //             alt={`Thumbnail ${index + 1}`}
// // //             className={`w-16 h-16 object-cover cursor-pointer ${isActive ? 'border-2 border-orange-500' : ''} rounded-lg`}
// // //             onClick={() => setCurrentImage(index)}
// // //         />
// // //     );
// // //
// // //     const RatingStars = ({ rating }) => (
// // //         <div className="flex">
// // //             {[1, 2, 3, 4, 5].map((star) => (
// // //                 <span key={star}>
// // //                     {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
// // //                 </span>
// // //             ))}
// // //         </div>
// // //     );
// // //
// // //     const ReviewForm = () => (
// // //         <form className="mt-6 bg-gray-100 p-4 rounded-lg" onSubmit={(e) => {
// // //             e.preventDefault();
// // //             console.log('Submitted review:', newReview);
// // //             setNewReview({ name: '', rating: 0, comment: '' });
// // //         }}>
// // //             <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
// // //             <div className="mb-4">
// // //                 <label className="block mb-2">Your Name</label>
// // //                 <input
// // //                     type="text"
// // //                     value={newReview.name}
// // //                     onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
// // //                     className="w-full p-2 border rounded"
// // //                     required
// // //                 />
// // //             </div>
// // //             <div className="mb-4">
// // //                 <label className="block mb-2">Rating</label>
// // //                 <div className="flex">
// // //                     {[1, 2, 3, 4, 5].map((star) => (
// // //                         <button
// // //                             key={star}
// // //                             type="button"
// // //                             onClick={() => setNewReview({ ...newReview, rating: star })}
// // //                             className="mr-1"
// // //                         >
// // //                             {star <= newReview.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
// // //                         </button>
// // //                     ))}
// // //                 </div>
// // //             </div>
// // //             <div className="mb-4">
// // //                 <label className="block mb-2">Your Review</label>
// // //                 <textarea
// // //                     value={newReview.comment}
// // //                     onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
// // //                     className="w-full p-2 border rounded"
// // //                     rows="4"
// // //                     required
// // //                 ></textarea>
// // //             </div>
// // //             <button type="submit" className="bg-yellow-400 text-gray-900 py-2 px-4 rounded hover:bg-yellow-500">
// // //                 Submit Review
// // //             </button>
// // //         </form>
// // //     );
// // //
// // //     const TabContent = () => {
// // //         switch (activeTab) {
// // //             case 'details':
// // //                 return (
// // //                     <div>
// // //                         <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
// // //                         <ul className="list-disc list-inside text-gray-700">
// // //                             {product.specifications.map((spec, index) => (
// // //                                 <li key={index}>{spec.name}: {spec.value}</li>
// // //                             ))}
// // //                         </ul>
// // //                     </div>
// // //                 );
// // //             case 'description':
// // //                 return <p className="text-gray-700">{product.description}</p>;
// // //             case 'reviews':
// // //                 return (
// // //                     <div>
// // //                         <div className="mb-6">
// // //                             <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
// // //                             <p>No reviews yet.</p>
// // //                         </div>
// // //                         <ReviewForm />
// // //                     </div>
// // //                 );
// // //             default:
// // //                 return null;
// // //         }
// // //     };
// // //
// // //     if (loading) {
// // //         return <div className="text-center py-10">Loading...</div>;
// // //     }
// // //
// // //     if (error) {
// // //         return (
// // //             <div className="text-center py-10 text-red-500">
// // //                 <h2 className="text-2xl font-bold mb-4">Error</h2>
// // //                 <p>{error}</p>
// // //                 <p className="mt-4">Please try refreshing the page or contact support if the problem persists.</p>
// // //             </div>
// // //         );
// // //     }
// // //
// // //     if (!product) {
// // //         return <div className="text-center py-10">Product not found.</div>;
// // //     }
// // //
// // //     console.log('Rendering product:', product);
// // //
// // //     return (
// // //         <div className="bg-gray-100 min-h-screen">
// // //             <div className="container mx-auto p-4">
// // //                 <div className="bg-white rounded-lg shadow-lg p-6">
// // //                     <div className="flex flex-wrap lg:flex-nowrap">
// // //                         <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
// // //                             {product.images && product.images.length > 0 ? (
// // //                                 <>
// // //                                     <MagnifyGlass imageSrc={product.images[currentImage].image} />
// // //                                     <div className="flex mt-4">
// // //                                         {product.images.map((img, index) => (
// // //                                             <ThumbImage key={img.id} src={img.image} index={index} isActive={index === currentImage} />
// // //                                         ))}
// // //                                     </div>
// // //                                 </>
// // //                             ) : (
// // //                                 <div className="bg-gray-200 h-64 flex items-center justify-center">
// // //                                     <p>No image available</p>
// // //                                 </div>
// // //                             )}
// // //                         </div>
// // //                         <div className="w-full lg:w-1/2 lg:pl-8">
// // //                             <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
// // //                             <div className="flex items-center mb-4">
// // //                                 <RatingStars rating={4} />
// // //                                 <span className="text-gray-600 ml-2">(0 reviews)</span>
// // //                             </div>
// // //                             <p className="text-2xl font-semibold mb-4 text-red-600">${calculateTotalPrice().toFixed(2)}</p>
// // //                             <p className="text-gray-700 mb-4">{product.description}</p>
// // //
// // //                             {product.is_variant && product.grouped_options && (
// // //                                 <div className="mb-4">
// // //                                     <h3 className="text-lg font-semibold mb-2">Options</h3>
// // //                                     {product.grouped_options.map(option => (
// // //                                         <div key={option.name} className="mb-4">
// // //                                             <h4 className="font-medium mb-2">{option.name}</h4>
// // //                                             <div className="flex flex-wrap space-x-2">
// // //                                                 {option.values.map(value => (
// // //                                                     <button
// // //                                                         key={value}
// // //                                                         onClick={() => handleOptionChange(option.name, value)}
// // //                                                         className={`px-4 py-2 rounded mb-2 ${selectedOptions[option.name] === value ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
// // //                                                     >
// // //                                                         {value}
// // //                                                     </button>
// // //                                                 ))}
// // //                                             </div>
// // //                                         </div>
// // //                                     ))}
// // //                                 </div>
// // //                             )}
// // //
// // //                             <div className="flex items-center mb-4">
// // //                                 <button
// // //                                     onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
// // //                                     className="bg-gray-200 px-4 py-2 rounded-l"
// // //                                 >
// // //                                     -
// // //                                 </button>
// // //                                 <input
// // //                                     type="text"
// // //                                     value={quantity}
// // //                                     readOnly
// // //                                     className="w-16 text-center border-t border-b"
// // //                                 />
// // //                                 <button
// // //                                     onClick={() => setQuantity(quantity + 1)}
// // //                                     className="bg-gray-200 px-4 py-2 rounded-r"
// // //                                 >
// // //                                     +
// // //                                 </button>
// // //                             </div>
// // //                             <div className="flex items-center mb-4">
// // //                                 <button className="bg-yellow-400 text-gray-900 py-2 px-4 rounded hover:bg-yellow-500 flex items-center">
// // //                                     <FaShoppingCart className="mr-2" /> Add to Cart
// // //                                 </button>
// // //                                 <button className="bg-orange-500 text-white py-2 px-4 rounded ml-4 hover:bg-orange-600 flex items-center">
// // //                                     <FaHeart className="mr-2" /> Add to Wishlist
// // //                                 </button>
// // //                                 <button className="bg-gray-600 text-white py-2 px-4 rounded ml-4 hover:bg-gray-700 flex items-center">
// // //                                     <FiShare2 className="mr-2" /> Share
// // //                                 </button>
// // //                             </div>
// // //
// // //                             {!product.is_in_stock && (
// // //                                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
// // //                                     <strong className="font-bold">Out of Stock!</strong>
// // //                                     <span className="block sm:inline"> This item is currently unavailable.</span>
// // //                                 </div>
// // //                             )}
// // //
// // //                             <div className="mt-6">
// // //                                 <div className="flex border-b">
// // //                                     <button
// // //                                         className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}
// // //                                         onClick={() => setActiveTab('details')}
// // //                                     >
// // //                                         Details
// // //                                     </button>
// // //                                     <button
// // //                                         className={`py-2 px-4 ${activeTab === 'description' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}
// // //                                         onClick={() => setActiveTab('description')}
// // //                                     >
// // //                                         Description
// // //                                     </button>
// // //                                     <button
// // //                                         className={`py-2 px-4 ${activeTab === 'reviews' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}
// // //                                         onClick={() => setActiveTab('reviews')}
// // //                                     >
// // //                                         Reviews
// // //                                     </button>
// // //                                 </div>
// // //                                 <div className="mt-4">
// // //                                     <TabContent />
// // //                                 </div>
// // //                             </div>
// // //                         </div>
// // //                     </div>
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // };
// // //
// // // export default ProductDetailPage;
// // // // ==================================
// // // // import React, { useState, useEffect } from 'react';
// // // // import { useParams } from 'react-router-dom';
// // // // import axios from 'axios';
// // // // import { FaStar, FaHeart, FaShoppingCart, FaRegStar } from 'react-icons/fa';
// // // // import { FiShare2 } from 'react-icons/fi';
// // // // import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// // // // import { Skeleton } from '@/components/ui/skeleton';
// // // // import { toast } from '@/components/ui/use-toast';
// // // //
// // // // const API_BASE_URL = 'http://127.0.0.1:8000/api/v2/client';
// // // //
// // // // const ProductDetailPage = () => {
// // // //     const { slug } = useParams();
// // // //     const [product, setProduct] = useState(null);
// // // //     const [loading, setLoading] = useState(true);
// // // //     const [error, setError] = useState(null);
// // // //     const [quantity, setQuantity] = useState(1);
// // // //     const [activeTab, setActiveTab] = useState('details');
// // // //     const [newReview, setNewReview] = useState({ name: '', rating: 0, comment: '' });
// // // //     const [currentImage, setCurrentImage] = useState(0);
// // // //     const [selectedVariant, setSelectedVariant] = useState(null);
// // // //     const [selectedOptions, setSelectedOptions] = useState({});
// // // //
// // // //     useEffect(() => {
// // // //         const fetchProduct = async () => {
// // // //             try {
// // // //                 const response = await axios.get(`${API_BASE_URL}/products/${slug}/`);
// // // //                 setProduct(response.data);
// // // //                 if (response.data.variants && response.data.variants.length > 0) {
// // // //                     setSelectedVariant(response.data.variants[0]);
// // // //                 }
// // // //                 const initialOptions = {};
// // // //                 if (response.data.grouped_options) {
// // // //                     response.data.grouped_options.forEach(option => {
// // // //                         initialOptions[option.name] = option.values[0];
// // // //                     });
// // // //                 }
// // // //                 setSelectedOptions(initialOptions);
// // // //             } catch (err) {
// // // //                 setError(err.message);
// // // //                 toast({
// // // //                     variant: "destructive",
// // // //                     title: "Error",
// // // //                     description: "Failed to load product details. Please try again later.",
// // // //                 });
// // // //             } finally {
// // // //                 setLoading(false);
// // // //             }
// // // //         };
// // // //
// // // //         fetchProduct();
// // // //     }, [slug]);
// // // //
// // // //     const calculateTotalPrice = () => {
// // // //         if (!product) return 0;
// // // //         let total = selectedVariant ? parseFloat(selectedVariant.price) : parseFloat(product.base_price);
// // // //         return total * quantity;
// // // //     };
// // // //
// // // //     const handleVariantChange = (variant) => {
// // // //         setSelectedVariant(variant);
// // // //         setCurrentImage(0); // Reset to first image of new variant
// // // //     };
// // // //
// // // //     const handleOptionChange = (optionName, value) => {
// // // //         setSelectedOptions(prev => ({
// // // //             ...prev,
// // // //             [optionName]: value
// // // //         }));
// // // //
// // // //         // Find the matching variant
// // // //         const newVariant = product.variants.find(variant =>
// // // //             variant.attribute_values.every(attr =>
// // // //                 attr.value === value || selectedOptions[attr.attribute_name] === attr.value
// // // //             )
// // // //         );
// // // //
// // // //         if (newVariant) {
// // // //             setSelectedVariant(newVariant);
// // // //         }
// // // //     };
// // // //
// // // //     const handleAddToCart = () => {
// // // //         // Implement your add to cart logic here
// // // //         toast({
// // // //             title: "Added to Cart",
// // // //             description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart.`,
// // // //         });
// // // //     };
// // // //
// // // //     const handleAddToWishlist = () => {
// // // //         // Implement your add to wishlist logic here
// // // //         toast({
// // // //             title: "Added to Wishlist",
// // // //             description: "This item has been added to your wishlist.",
// // // //         });
// // // //     };
// // // //
// // // //     const handleShare = () => {
// // // //         // Implement your share logic here
// // // //         toast({
// // // //             title: "Share",
// // // //             description: "Sharing functionality not implemented in this demo.",
// // // //         });
// // // //     };
// // // //
// // // //     const ThumbImage = ({ src, index, isActive }) => (
// // // //         <img
// // // //             src={src}
// // // //             alt={`Thumbnail ${index + 1}`}
// // // //             className={`w-16 h-16 object-cover cursor-pointer ${isActive ? 'border-2 border-orange-500' : ''} rounded-lg`}
// // // //             onClick={() => setCurrentImage(index)}
// // // //         />
// // // //     );
// // // //
// // // //     const RatingStars = ({ rating }) => (
// // // //         <div className="flex">
// // // //             {[1, 2, 3, 4, 5].map((star) => (
// // // //                 <span key={star}>
// // // //                     {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
// // // //                 </span>
// // // //             ))}
// // // //         </div>
// // // //     );
// // // //
// // // //     const ReviewForm = () => (
// // // //         <form className="mt-6 bg-gray-100 p-4 rounded-lg" onSubmit={(e) => {
// // // //             e.preventDefault();
// // // //             // Here you would typically send this data to your backend
// // // //             console.log('Submitted review:', newReview);
// // // //             toast({
// // // //                 title: "Review Submitted",
// // // //                 description: "Thank you for your review!",
// // // //             });
// // // //             setNewReview({ name: '', rating: 0, comment: '' }); // Reset form
// // // //         }}>
// // // //             <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
// // // //             <div className="mb-4">
// // // //                 <label className="block mb-2">Your Name</label>
// // // //                 <input
// // // //                     type="text"
// // // //                     value={newReview.name}
// // // //                     onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
// // // //                     className="w-full p-2 border rounded"
// // // //                     required
// // // //                 />
// // // //             </div>
// // // //             <div className="mb-4">
// // // //                 <label className="block mb-2">Rating</label>
// // // //                 <div className="flex">
// // // //                     {[1, 2, 3, 4, 5].map((star) => (
// // // //                         <button
// // // //                             key={star}
// // // //                             type="button"
// // // //                             onClick={() => setNewReview({ ...newReview, rating: star })}
// // // //                             className="mr-1"
// // // //                         >
// // // //                             {star <= newReview.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
// // // //                         </button>
// // // //                     ))}
// // // //                 </div>
// // // //             </div>
// // // //             <div className="mb-4">
// // // //                 <label className="block mb-2">Your Review</label>
// // // //                 <textarea
// // // //                     value={newReview.comment}
// // // //                     onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
// // // //                     className="w-full p-2 border rounded"
// // // //                     rows="4"
// // // //                     required
// // // //                 ></textarea>
// // // //             </div>
// // // //             <button type="submit" className="bg-yellow-400 text-gray-900 py-2 px-4 rounded hover:bg-yellow-500">
// // // //                 Submit Review
// // // //             </button>
// // // //         </form>
// // // //     );
// // // //
// // // //     const TabContent = () => {
// // // //         switch (activeTab) {
// // // //             case 'details':
// // // //                 return (
// // // //                     <div>
// // // //                         <h3 className="text-xl font-semibold mb-4">Product Specifications</h3>
// // // //                         <ul className="list-disc list-inside text-gray-700">
// // // //                             {product.specifications.map((spec, index) => (
// // // //                                 <li key={index}>{spec.name}: {spec.value}</li>
// // // //                             ))}
// // // //                         </ul>
// // // //                     </div>
// // // //                 );
// // // //             case 'description':
// // // //                 return <p className="text-gray-700">{product.description}</p>;
// // // //             case 'reviews':
// // // //                 return (
// // // //                     <div>
// // // //                         <div className="mb-6">
// // // //                             <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
// // // //                             {/* Dummy reviews for demonstration */}
// // // //                             {[
// // // //                                 { name: "Alice", rating: 5, date: "2024-10-01", comment: "Absolutely stunning piece! The craftsmanship is exquisite.", helpful: 12 },
// // // //                                 { name: "Bob", rating: 4, date: "2024-09-28", comment: "Beautiful jewelry, but the clasp is a bit fiddly.", helpful: 8 },
// // // //                                 { name: "Carol", rating: 5, date: "2024-09-15", comment: "This necklace exceeded my expectations. It's even more beautiful in person!", helpful: 15 },
// // // //                             ].map((review, index) => (
// // // //                                 <div key={index} className="mb-4 p-4 border rounded-lg">
// // // //                                     <div className="flex items-center mb-2">
// // // //                                         <RatingStars rating={review.rating} />
// // // //                                         <span className="text-gray-600 ml-2">by {review.name} on {review.date}</span>
// // // //                                     </div>
// // // //                                     <p className="text-gray-700 mb-2">{review.comment}</p>
// // // //                                     <div className="flex items-center mt-2">
// // // //                                         <button
// // // //                                             className="text-blue-500 hover:text-blue-700"
// // // //                                             onClick={() => toast({
// // // //                                                 title: "Helpful",
// // // //                                                 description: "Thank you for your feedback!",
// // // //                                             })}
// // // //                                         >
// // // //                                             Helpful ({review.helpful})
// // // //                                         </button>
// // // //                                     </div>
// // // //                                 </div>
// // // //                             ))}
// // // //                         </div>
// // // //                         <ReviewForm />
// // // //                     </div>
// // // //                 );
// // // //             default:
// // // //                 return null;
// // // //         }
// // // //     };
// // // //
// // // //     if (loading) {
// // // //         return (
// // // //             <div className="container mx-auto p-4">
// // // //                 <Skeleton className="h-96 w-full mb-4" />
// // // //                 <div className="flex flex-wrap">
// // // //                     <Skeleton className="h-20 w-20 mr-2 mb-2" />
// // // //                     <Skeleton className="h-20 w-20 mr-2 mb-2" />
// // // //                     <Skeleton className="h-20 w-20 mr-2 mb-2" />
// // // //                 </div>
// // // //                 <Skeleton className="h-12 w-3/4 mb-4" />
// // // //                 <Skeleton className="h-6 w-1/2 mb-2" />
// // // //                 <Skeleton className="h-6 w-1/3 mb-4" />
// // // //                 <Skeleton className="h-32 w-full" />
// // // //             </div>
// // // //         );
// // // //     }
// // // //
// // // //     if (error) {
// // // //         return (
// // // //             <Alert variant="destructive">
// // // //                 <AlertTitle>Error</AlertTitle>
// // // //                 <AlertDescription>{error}</AlertDescription>
// // // //             </Alert>
// // // //         );
// // // //     }
// // // //
// // // //     if (!product) {
// // // //         return (
// // // //             <Alert variant="destructive">
// // // //                 <AlertTitle>Error</AlertTitle>
// // // //                 <AlertDescription>Product not found.</AlertDescription>
// // // //             </Alert>
// // // //         );
// // // //     }
// // // //
// // // //     return (
// // // //         <div className="bg-gray-100 min-h-screen">
// // // //             <div className="container mx-auto p-4">
// // // //                 <div className="bg-white rounded-lg shadow-lg p-6">
// // // //                     <div className="flex flex-wrap lg:flex-nowrap">
// // // //                         <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
// // // //                             <img
// // // //                                 src={selectedVariant && selectedVariant.images.length > 0 ? selectedVariant.images[currentImage].image : product.images[currentImage].image}
// // // //                                 alt={product.name}
// // // //                                 className="w-full h-auto object-cover rounded-lg"
// // // //                             />
// // // //                             <div className="flex mt-4 space-x-2 overflow-x-auto">
// // // //                                 {(selectedVariant ? selectedVariant.images : product.images).map((image, index) => (
// // // //                                     <ThumbImage key={image.id} src={image.image} index={index} isActive={index === currentImage} />
// // // //                                 ))}
// // // //                             </div>
// // // //                         </div>
// // // //                         <div className="w-full lg:w-1/2 lg:pl-8">
// // // //                             <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
// // // //                             <div className="flex items-center mb-4">
// // // //                                 <RatingStars rating={4} /> {/* Assuming a rating of 4 for demonstration */}
// // // //                                 <span className="text-gray-600 ml-2">(50 reviews)</span>
// // // //                             </div>
// // // //                             <p className="text-2xl font-semibold mb-4 text-red-600">${calculateTotalPrice().toFixed(2)}</p>
// // // //                             <p className="text-gray-700 mb-4">{product.description}</p>
// // // //
// // // //                             {product.is_variant && (
// // // //                                 <div className="mb-4">
// // // //                                     <h3 className="text-lg font-semibold mb-2">Options</h3>
// // // //                                     {product.grouped_options.map(option => (
// // // //                                         <div key={option.name} className="mb-4">
// // // //                                             <h4 className="font-medium mb-2">{option.name}</h4>
// // // //                                             <div className="flex flex-wrap space-x-2">
// // // //                                                 {option.values.map(value => (
// // // //                                                     <button
// // // //                                                         key={value}
// // // //                                                         onClick={() => handleOptionChange(option.name, value)}
// // // //                                                         className={`px-4 py-2 rounded mb-2 ${selectedOptions[option.name] === value ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
// // // //                                                     >
// // // //                                                         {value}
// // // //                                                     </button>
// // // //                                                 ))}
// // // //                                             </div>
// // // //                                         </div>
// // // //                                     ))}
// // // //                                 </div>
// // // //                             )}
// // // //
// // // //                             <div className="flex items-center mb-4">
// // // //                                 <button
// // // //                                     onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
// // // //                                     className="bg-gray-200 px-4 py-2 rounded-l"
// // // //                                 >
// // // //                                     -
// // // //                                 </button>
// // // //                                 <input
// // // //                                     type="text"
// // // //                                     value={quantity}
// // // //                                     readOnly
// // // //                                     className="w-16 text-center border-t border-b"
// // // //                                 />
// // // //                                 <button
// // // //                                     onClick={() => setQuantity(quantity + 1)}
// // // //                                     className="bg-gray-200 px-4 py-2 rounded-r"
// // // //                                 >
// // // //                                     +
// // // //                                 </button>
// // // //                             </div>
// // // //                             <div className="flex items-center mb-4">
// // // //                                 <button onClick={handleAddToCart} className="bg-yellow-400 text-gray-900 py-2 px-4 rounded hover:bg-yellow-500 flex items-center">
// // // //                                     <FaShoppingCart className="mr-2" /> Add to Cart
// // // //                                 </button>
// // // //                                 <button onClick={handleAddToWishlist} className="bg-orange-500 text-white py-2 px-4 rounded ml-4 hover:bg-orange-600 flex items-center">
// // // //                                     <FaHeart className="mr-2" /> Add to Wishlist
// // // //                                 </button>
// // // //                                 <button onClick={handleShare} className="bg-gray-600 text-white py-2 px-4 rounded ml-4 hover:bg-gray-700 flex items-center">
// // // //                                     <FiShare2 className="mr-2" /> Share
// // // //                                 </button>
// // // //                             </div>
// // // //
// // // //                             {!product.is_in_stock && (
// // // //                                 <Alert variant="destructive" className="mb-4">
// // // //                                     <AlertTitle>Out of Stock</AlertTitle>
// // // //                                     <AlertDescription>
// // // //                                         This item is currently out of stock. Please check back later or sign up for notifications.
// // // //                                     </AlertDescription>
// // // //                                 </Alert>
// // // //                             )}
// // // //
// // // //                             <div className="mt-6">
// // // //                                 <div className="flex border-b">
// // // //                                     <button
// // // //                                         className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}
// // // //                                         onClick={() => setActiveTab('details')}
// // // //                                     >
// // // //                                         Details
// // // //                                     </button>
// // // //                                     <button
// // // //                                         className={`py-2 px-4 ${activeTab === 'description' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}
// // // //                                         onClick={() => setActiveTab('description')}
// // // //                                     >
// // // //                                         Description
// // // //                                     </button>
// // // //                                     <button
// // // //                                         className={`py-2 px-4 ${activeTab === 'reviews' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}
// // // //                                         onClick={() => setActiveTab('reviews')}
// // // //                                     >
// // // //                                         Reviews
// // // //                                     </button>
// // // //                                 </div>
// // // //                                 <div className="mt-4">
// // // //                                     <TabContent />
// // // //                                 </div>
// // // //                             </div>
// // // //                         </div>
// // // //                     </div>
// // // //                 </div>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // };
// // // //
// // // // export default ProductDetailPage;
// // // // import React, { useState, useEffect } from 'react';
// // // // import { FaStar, FaHeart, FaShoppingCart, FaRegStar } from 'react-icons/fa';
// // // // import { FiShare2 } from 'react-icons/fi';
// // // // import MagnifyGlass from "../utils/MagnifyGlass";
// // // //
// // // // const ProductDetailPage = () => {
// // // //     const [quantity, setQuantity] = useState(1);
// // // //     const [activeTab, setActiveTab] = useState('details');
// // // //     const [newReview, setNewReview] = useState({ name: '', rating: 0, comment: '' });
// // // //     const [currentImage, setCurrentImage] = useState(0);
// // // //     const [selectedVariant, setSelectedVariant] = useState(null);
// // // //     const [selectedOptions, setSelectedOptions] = useState({});
// // // //
// // // //     const product = {
// // // //         name: "Elegant Diamond Necklace",
// // // //         basePrice: 1299.99,
// // // //         rating: 4.8,
// // // //         reviews: 256,
// // // //         description: "A stunning 18K white gold necklace featuring a brilliant-cut diamond pendant. Perfect for special occasions or as a luxurious everyday accessory.",
// // // //         variants: [
// // // //             { id: 1, name: "Classic", price: 1299.99, image: 'https://m.media-amazon.com/images/I/81fXSjG2d6L._SX679_.jpg', attributes: { metal: "White Gold", finish: "Polished" } },
// // // //             { id: 2, name: "Rose Gold", price: 1399.99, image: 'https://m.media-amazon.com/images/I/81s332bgHjL._SX679_.jpg', attributes: { metal: "Rose Gold", finish: "Matte" } },
// // // //             { id: 3, name: "Platinum", price: 1599.99, image: 'https://via.placeholder.com/800x800?text=Platinum+Necklace', attributes: { metal: "Platinum", finish: "Brushed" } },
// // // //         ],
// // // //         options: [
// // // //             {
// // // //                 name: "Chain Length",
// // // //                 choices: [
// // // //                     { name: "16 inches", price: 0 },
// // // //                     { name: "18 inches", price: 50 },
// // // //                     { name: "20 inches", price: 100 },
// // // //                 ]
// // // //             },
// // // //             {
// // // //                 name: "Diamond Size",
// // // //                 choices: [
// // // //                     { name: "0.5 carat", price: 0 },
// // // //                     { name: "0.75 carat", price: 500 },
// // // //                     { name: "1 carat", price: 1000 },
// // // //                 ]
// // // //             },
// // // //             {
// // // //                 name: "Gift Wrapping",
// // // //                 choices: [
// // // //                     { name: "No gift wrap", price: 0 },
// // // //                     { name: "Standard gift box", price: 25 },
// // // //                     { name: "Luxury gift box", price: 50 },
// // // //                 ]
// // // //             }
// // // //         ],
// // // //         details: [
// // // //             "18K White Gold",
// // // //             "0.5 Carat Diamond",
// // // //             "16-inch Chain",
// // // //             "Lobster Clasp",
// // // //         ],
// // // //         moreInfo: "This exquisite necklace features a brilliant-cut diamond set in 18K white gold. The diamond is carefully selected for its exceptional cut, clarity, and color, ensuring maximum brilliance. The 16-inch chain is perfect for a variety of necklines and can be adjusted for the perfect fit.",
// // // //         customerReviews: [
// // // //             { name: "Jane D.", rating: 5, date: "2023-08-15", comment: "Absolutely stunning! The necklace exceeded my expectations. The diamond sparkles beautifully and the chain is delicate yet sturdy.", helpful: 24 },
// // // //             { name: "John S.", rating: 4, date: "2023-07-22", comment: "Beautiful piece, but the clasp is a bit fiddly. Once it's on though, it looks amazing. The quality of the diamond is excellent.", helpful: 18 },
// // // //             { name: "Emily R.", rating: 5, date: "2023-06-30", comment: "Bought this as a gift for my mother, and she loves it! The packaging was elegant and made for a great presentation. Highly recommend for special occasions.", helpful: 32 },
// // // //             { name: "Michael T.", rating: 3, date: "2023-05-15", comment: "The necklace is nice, but I expected the diamond to be a bit larger for the price. The quality is good though, and it does sparkle nicely in the light.", helpful: 7 },
// // // //             { name: "Sarah L.", rating: 5, date: "2023-04-02", comment: "This necklace is a dream come true! It's elegant, sophisticated, and catches the light beautifully. I've received so many compliments. Worth every penny!", helpful: 41 },
// // // //         ]
// // // //     };
// // // //
// // // //     useEffect(() => {
// // // //         if (product.variants.length > 0) {
// // // //             setSelectedVariant(product.variants[0]);
// // // //         }
// // // //         const initialOptions = {};
// // // //         product.options.forEach(option => {
// // // //             initialOptions[option.name] = option.choices[0];
// // // //         });
// // // //         setSelectedOptions(initialOptions);
// // // //     }, []);
// // // //
// // // //     const calculateTotalPrice = () => {
// // // //         let total = selectedVariant ? selectedVariant.price : product.basePrice;
// // // //         Object.values(selectedOptions).forEach(option => {
// // // //             total += option.price;
// // // //         });
// // // //         return total;
// // // //     };
// // // //
// // // //     const handleVariantChange = (variant) => {
// // // //         setSelectedVariant(variant);
// // // //         setCurrentImage(product.variants.findIndex(v => v.id === variant.id));
// // // //     };
// // // //
// // // //     const handleOptionChange = (optionName, choice) => {
// // // //         setSelectedOptions(prev => ({
// // // //             ...prev,
// // // //             [optionName]: choice
// // // //         }));
// // // //     };
// // // //
// // // //     const ThumbImage = ({ src, index, isVariant }) => (
// // // //         <img
// // // //             src={src}
// // // //             alt={`Thumbnail ${index + 1}`}
// // // //             className={`w-16 h-16 object-cover cursor-pointer ${index === currentImage ? 'border-2 border-orange-500' : ''} ${isVariant ? 'rounded-full' : ''}`}
// // // //             onClick={() => setCurrentImage(index)}
// // // //         />
// // // //     );
// // // //
// // // //     const RatingStars = ({ rating }) => (
// // // //         <div className="flex">
// // // //             {[1, 2, 3, 4, 5].map((star) => (
// // // //                 <span key={star}>
// // // //                     {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
// // // //                 </span>
// // // //             ))}
// // // //         </div>
// // // //     );
// // // //
// // // //     const ReviewForm = () => (
// // // //         <form className="mt-6 bg-gray-100 p-4 rounded-lg">
// // // //             <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
// // // //             <div className="mb-4">
// // // //                 <label className="block mb-2">Your Name</label>
// // // //                 <input
// // // //                     type="text"
// // // //                     value={newReview.name}
// // // //                     onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
// // // //                     className="w-full p-2 border rounded"
// // // //                 />
// // // //             </div>
// // // //             <div className="mb-4">
// // // //                 <label className="block mb-2">Rating</label>
// // // //                 <div className="flex">
// // // //                     {[1, 2, 3, 4, 5].map((star) => (
// // // //                         <button
// // // //                             key={star}
// // // //                             type="button"
// // // //                             onClick={() => setNewReview({ ...newReview, rating: star })}
// // // //                             className="mr-1"
// // // //                         >
// // // //                             {star <= newReview.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
// // // //                         </button>
// // // //                     ))}
// // // //                 </div>
// // // //             </div>
// // // //             <div className="mb-4">
// // // //                 <label className="block mb-2">Your Review</label>
// // // //                 <textarea
// // // //                     value={newReview.comment}
// // // //                     onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
// // // //                     className="w-full p-2 border rounded"
// // // //                     rows="4"
// // // //                 ></textarea>
// // // //             </div>
// // // //             <button type="submit" className="bg-yellow-400 text-gray-900 py-2 px-4 rounded hover:bg-yellow-500">
// // // //                 Submit Review
// // // //             </button>
// // // //         </form>
// // // //     );
// // // //
// // // //     const TabContent = () => {
// // // //         switch (activeTab) {
// // // //             case 'details':
// // // //                 return (
// // // //                     <ul className="list-disc list-inside text-gray-700">
// // // //                         {product.details.map((detail, index) => (
// // // //                             <li key={index}>{detail}</li>
// // // //                         ))}
// // // //                     </ul>
// // // //                 );
// // // //             case 'moreInfo':
// // // //                 return <p className="text-gray-700">{product.moreInfo}</p>;
// // // //             case 'reviews':
// // // //                 return (
// // // //                     <div>
// // // //                         <div className="mb-6">
// // // //                             <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
// // // //                             {product.customerReviews.map((review, index) => (
// // // //                                 <div key={index} className="mb-4 p-4 border rounded-lg">
// // // //                                     <div className="flex items-center mb-2">
// // // //                                         <RatingStars rating={review.rating} />
// // // //                                         <span className="text-gray-600 ml-2">by {review.name} on {review.date}</span>
// // // //                                     </div>
// // // //                                     <p className="text-gray-700 mb-2">{review.comment}</p>
// // // //                                     <div className="flex items-center mt-2">
// // // //                                         <button
// // // //                                             className="text-blue-500 hover:text-blue-700"
// // // //                                             onClick={() => console.log('Helpful button clicked')}
// // // //                                         >
// // // //                                             Helpful ({review.helpful})
// // // //                                         </button>
// // // //                                     </div>
// // // //                                 </div>
// // // //                             ))}
// // // //                         </div>
// // // //                         <ReviewForm />
// // // //                     </div>
// // // //                 );
// // // //             default:
// // // //                 return null;
// // // //         }
// // // //     };
// // // //
// // // //     return (
// // // //         <div className="bg-gray-100 min-h-screen">
// // // //             <div className="container mx-auto p-4">
// // // //                 <div className="bg-white rounded-lg shadow-lg p-6">
// // // //                     <div className="flex flex-wrap lg:flex-nowrap">
// // // //                         <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
// // // //                             <MagnifyGlass imageSrc={selectedVariant ? selectedVariant.image : product.variants[0].image} />
// // // //                             <div className="flex mt-4">
// // // //                                 {product.variants.map((variant, index) => (
// // // //                                     <ThumbImage key={variant.id} src={variant.image} index={index} isVariant={true} />
// // // //                                 ))}
// // // //                             </div>
// // // //                         </div>
// // // //                         <div className="w-full lg:w-1/2 lg:pl-8">
// // // //                             <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
// // // //                             <div className="flex items-center mb-4">
// // // //                                 <RatingStars rating={Math.round(product.rating)} />
// // // //                                 <span className="text-gray-600 ml-2">({product.reviews} reviews)</span>
// // // //                             </div>
// // // //                             <p className="text-2xl font-semibold mb-4 text-red-600">${calculateTotalPrice().toFixed(2)}</p>
// // // //                             <p className="text-gray-700 mb-4">{product.description}</p>
// // // //
// // // //                             <div className="mb-4">
// // // //                                 <h3 className="text-lg font-semibold mb-2">Variants</h3>
// // // //                                 <div className="flex space-x-2">
// // // //                                     {product.variants.map(variant => (
// // // //                                         <button
// // // //                                             key={variant.id}
// // // //                                             onClick={() => handleVariantChange(variant)}
// // // //                                             className={`px-4 py-2 rounded ${selectedVariant && selectedVariant.id === variant.id ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
// // // //                                         >
// // // //                                             {variant.name}
// // // //                                         </button>
// // // //                                     ))}
// // // //                                 </div>
// // // //                             </div>
// // // //
// // // //                             {selectedVariant && (
// // // //                                 <div className="mb-4">
// // // //                                     <h3 className="text-lg font-semibold mb-2">Attributes</h3>
// // // //                                     <ul className="list-disc list-inside">
// // // //                                         {Object.entries(selectedVariant.attributes).map(([key, value]) => (
// // // //                                             <li key={key}>{key}: {value}</li>
// // // //                                         ))}
// // // //                                     </ul>
// // // //                                 </div>
// // // //                             )}
// // // //
// // // //                             {product.options.map(option => (
// // // //                                 <div key={option.name} className="mb-4">
// // // //                                     <h3 className="text-lg font-semibold mb-2">{option.name}</h3>
// // // //                                     <div className="flex flex-wrap space-x-2">
// // // //                                         {option.choices.map(choice => (
// // // //                                             <button
// // // //                                                 key={choice.name}
// // // //                                                 onClick={() => handleOptionChange(option.name, choice)}
// // // //                                                 className={`px-4 py-2 rounded mb-2 ${selectedOptions[option.name] && selectedOptions[option.name].name === choice.name ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
// // // //                                             >
// // // //                                                 {choice.name} {choice.price > 0 ? `(+$${choice.price})` : ''}
// // // //                                             </button>
// // // //                                         ))}
// // // //                                     </div>
// // // //                                 </div>
// // // //                             ))}
// // // //
// // // //                             <div className="flex items-center mb-4">
// // // //                                 <button
// // // //                                     onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
// // // //                                     className="bg-gray-200 px-4 py-2 rounded-l"
// // // //                                 >
// // // //                                     -
// // // //                                 </button>
// // // //                                 <input
// // // //                                     type="text"
// // // //                                     value={quantity}
// // // //                                     readOnly
// // // //                                     className="w-16 text-center border-t border-b"
// // // //                                 />
// // // //                                 <button
// // // //                                     onClick={() => setQuantity(quantity + 1)}
// // // //                                     className="bg-gray-200 px-4 py-2 rounded-r"
// // // //                                 >
// // // //                                     +
// // // //                                 </button>
// // // //                             </div>
// // // //                             <div className="flex items-center mb-4">
// // // //                                 <button className="bg-yellow-400 text-gray-900 py-2 px-4 rounded hover:bg-yellow-500 flex items-center">
// // // //                                     <FaShoppingCart className="mr-2" /> Add to Cart
// // // //                                 </button>
// // // //                                 <button className="bg-orange-500 text-white py-2 px-4 rounded ml-4 hover:bg-orange-600 flex items-center">
// // // //                                 <FaHeart className="mr-2" /> Add to Wishlist
// // // //                                 </button>
// // // //                                 <button className="bg-gray-600 text-white py-2 px-4 rounded ml-4 hover:bg-gray-700 flex items-center">
// // // //                                     <FiShare2 className="mr-2" /> Share
// // // //                                 </button>
// // // //                             </div>
// // // //                             <div className="mt-6">
// // // //                                 <div className="flex border-b">
// // // //                                     <button
// // // //                                         className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}
// // // //                                         onClick={() => setActiveTab('details')}
// // // //                                     >
// // // //                                         Details
// // // //                                     </button>
// // // //                                     <button
// // // //                                         className={`py-2 px-4 ${activeTab === 'moreInfo' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}
// // // //                                         onClick={() => setActiveTab('moreInfo')}
// // // //                                     >
// // // //                                         More Info
// // // //                                     </button>
// // // //                                     <button
// // // //                                         className={`py-2 px-4 ${activeTab === 'reviews' ? 'border-b-2 border-orange-500 text-orange-500' : 'text-gray-600'}`}
// // // //                                         onClick={() => setActiveTab('reviews')}
// // // //                                     >
// // // //                                         Reviews
// // // //                                     </button>
// // // //                                 </div>
// // // //                                 <div className="mt-4">
// // // //                                     <TabContent />
// // // //                                 </div>
// // // //                             </div>
// // // //                         </div>
// // // //                     </div>
// // // //                 </div>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // };
// // // //
// // // // export default ProductDetailPage;
// // // //
// // // // // =================old bellow
// // // //
// // // // // ProductDetailPage.jsx
// // // // import React, { useState } from 'react';
// // // // import { FaStar, FaHeart, FaShoppingCart, FaRegStar } from 'react-icons/fa';
// // // // import { FiShare2 } from 'react-icons/fi';
// // // // import MagnifyGlass from "../utils/MagnifyGlass";
// // // //
// // // // const ProductDetailPage = () => {
// // // //     const [quantity, setQuantity] = useState(1);
// // // //     const [activeTab, setActiveTab] = useState('details');
// // // //     const [newReview, setNewReview] = useState({ name: '', rating: 0, comment: '' });
// // // //     const [currentImage, setCurrentImage] = useState(0);
// // // //
// // // //     const product = {
// // // //         name: "Elegant Diamond Necklace",
// // // //         price: 1299.99,
// // // //         rating: 4.8,
// // // //         reviews: 256,
// // // //         description: "A stunning 18K white gold necklace featuring a brilliant-cut diamond pendant. Perfect for special occasions or as a luxurious everyday accessory.",
// // // //         images: [
// // // //             'https://m.media-amazon.com/images/I/81fXSjG2d6L._SX679_.jpg',
// // // //             'https://m.media-amazon.com/images/I/81s332bgHjL._SX679_.jpg',
// // // //             'https://via.placeholder.com/800x800?text=Necklace+3',
// // // //             'https://via.placeholder.com/800x800?text=Necklace+4'
// // // //         ],
// // // //         details: [
// // // //             "18K White Gold",
// // // //             "0.5 Carat Diamond",
// // // //             "16-inch Chain",
// // // //             "Lobster Clasp",
// // // //         ],
// // // //         moreInfo: "This exquisite necklace features a brilliant-cut diamond set in 18K white gold. The diamond is carefully selected for its exceptional cut, clarity, and color, ensuring maximum brilliance. The 16-inch chain is perfect for a variety of necklines and can be adjusted for the perfect fit.",
// // // //         customerReviews: [
// // // //             { name: "Jane D.", rating: 5, date: "2023-08-15", comment: "Absolutely stunning! The necklace exceeded my expectations. The diamond sparkles beautifully and the chain is delicate yet sturdy.", helpful: 24 },
// // // //             { name: "John S.", rating: 4, date: "2023-07-22", comment: "Beautiful piece, but the clasp is a bit fiddly. Once it's on though, it looks amazing. The quality of the diamond is excellent.", helpful: 18 },
// // // //             { name: "Emily R.", rating: 5, date: "2023-06-30", comment: "Bought this as a gift for my mother, and she loves it! The packaging was elegant and made for a great presentation. Highly recommend for special occasions.", helpful: 32 },
// // // //             { name: "Michael T.", rating: 3, date: "2023-05-15", comment: "The necklace is nice, but I expected the diamond to be a bit larger for the price. The quality is good though, and it does sparkle nicely in the light.", helpful: 7 },
// // // //             { name: "Sarah L.", rating: 5, date: "2023-04-02", comment: "This necklace is a dream come true! It's elegant, sophisticated, and catches the light beautifully. I've received so many compliments. Worth every penny!", helpful: 41 },
// // // //         ]
// // // //     };
// // // //
// // // //     const ThumbImage = ({ src, index }) => (
// // // //         <img
// // // //             src={src}
// // // //             alt={`Thumbnail ${index + 1}`}
// // // //             className={`w-16 h-16 object-cover cursor-pointer ${index === currentImage ? 'border-2 border-blue-500' : ''}`}
// // // //             onClick={() => setCurrentImage(index)}
// // // //         />
// // // //     );
// // // //
// // // //     const RatingStars = ({ rating }) => (
// // // //         <div className="flex">
// // // //             {[1, 2, 3, 4, 5].map((star) => (
// // // //                 <span key={star}>
// // // //                     {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
// // // //                 </span>
// // // //             ))}
// // // //         </div>
// // // //     );
// // // //
// // // //     const ReviewForm = () => (
// // // //         <form className="mt-6 bg-gray-100 p-4 rounded-lg">
// // // //             <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
// // // //             <div className="mb-4">
// // // //                 <label className="block mb-2">Your Name</label>
// // // //                 <input
// // // //                     type="text"
// // // //                     value={newReview.name}
// // // //                     onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
// // // //                     className="w-full p-2 border rounded"
// // // //                 />
// // // //             </div>
// // // //             <div className="mb-4">
// // // //                 <label className="block mb-2">Rating</label>
// // // //                 <div className="flex">
// // // //                     {[1, 2, 3, 4, 5].map((star) => (
// // // //                         <button
// // // //                             key={star}
// // // //                             type="button"
// // // //                             onClick={() => setNewReview({ ...newReview, rating: star })}
// // // //                             className="mr-1"
// // // //                         >
// // // //                             {star <= newReview.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
// // // //                         </button>
// // // //                     ))}
// // // //                 </div>
// // // //             </div>
// // // //             <div className="mb-4">
// // // //                 <label className="block mb-2">Your Review</label>
// // // //                 <textarea
// // // //                     value={newReview.comment}
// // // //                     onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
// // // //                     className="w-full p-2 border rounded"
// // // //                     rows="4"
// // // //                 ></textarea>
// // // //             </div>
// // // //             <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
// // // //                 Submit Review
// // // //             </button>
// // // //         </form>
// // // //     );
// // // //
// // // //     const TabContent = () => {
// // // //         switch (activeTab) {
// // // //             case 'details':
// // // //                 return (
// // // //                     <ul className="list-disc list-inside text-gray-700">
// // // //                         {product.details.map((detail, index) => (
// // // //                             <li key={index}>{detail}</li>
// // // //                         ))}
// // // //                     </ul>
// // // //                 );
// // // //             case 'moreInfo':
// // // //                 return <p className="text-gray-700">{product.moreInfo}</p>;
// // // //             case 'reviews':
// // // //                 return (
// // // //                     <div>
// // // //                         <div className="mb-6">
// // // //                             <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
// // // //                             {product.customerReviews.map((review, index) => (
// // // //                                 <div key={index} className="mb-4 p-4 border rounded-lg">
// // // //                                     <div className="flex items-center mb-2">
// // // //                                         <RatingStars rating={review.rating} />
// // // //                                         <span className="text-gray-600 ml-2">by {review.name} on {review.date}</span>
// // // //                                     </div>
// // // //                                     <p className="text-gray-700 mb-2">{review.comment}</p>
// // // //                                     <div className="flex items-center mt-2">
// // // //                                         <button
// // // //                                             className="text-blue-500 hover:text-blue-700"
// // // //                                             onClick={() => console.log('Helpful button clicked')}
// // // //                                         >
// // // //                                             Helpful ({review.helpful})
// // // //                                         </button>
// // // //                                     </div>
// // // //                                 </div>
// // // //                             ))}
// // // //                         </div>
// // // //                         <ReviewForm />
// // // //                     </div>
// // // //                 );
// // // //             default:
// // // //                 return null;
// // // //         }
// // // //     };
// // // //
// // // //     return (
// // // //         <div className="container mx-auto p-4 relative">
// // // //             <div className="flex flex-wrap lg:flex-nowrap">
// // // //                 <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
// // // //                     <MagnifyGlass imageSrc={product.images[currentImage]} />
// // // //                     <div className="flex mt-4">
// // // //                         {product.images.map((img, index) => (
// // // //                             <ThumbImage key={index} src={img} index={index} />
// // // //                         ))}
// // // //                     </div>
// // // //                 </div>
// // // //                 <div className="w-full lg:w-1/2 lg:pl-8">
// // // //                     <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
// // // //                     <div className="flex items-center mb-4">
// // // //                         <RatingStars rating={Math.round(product.rating)} />
// // // //                         <span className="text-gray-600 ml-2">({product.reviews} reviews)</span>
// // // //                     </div>
// // // //                     <p className="text-xl font-semibold mb-4">${product.price.toFixed(2)}</p>
// // // //                     <p className="text-gray-700 mb-4">{product.description}</p>
// // // //                     <div className="flex items-center mb-4">
// // // //                         <button
// // // //                             onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
// // // //                             className="bg-gray-200 px-4 py-2 rounded-l"
// // // //                         >
// // // //                             -
// // // //                         </button>
// // // //                         <input
// // // //                             type="text"
// // // //                             value={quantity}
// // // //                             readOnly
// // // //                             className="w-16 text-center border-t border-b"
// // // //                         />
// // // //                         <button
// // // //                             onClick={() => setQuantity(quantity + 1)}
// // // //                             className="bg-gray-200 px-4 py-2 rounded-r"
// // // //                         >
// // // //                             +
// // // //                         </button>
// // // //                     </div>
// // // //                     <div className="flex items-center mb-4">
// // // //                         <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center">
// // // //                             <FaShoppingCart className="mr-2" /> Add to Cart
// // // //                         </button>
// // // //                         <button className="bg-red-600 text-white py-2 px-4 rounded ml-4 hover:bg-red-700 flex items-center">
// // // //                             <FaHeart className="mr-2" /> Add to Wishlist
// // // //                         </button>
// // // //                         <button className="bg-gray-600 text-white py-2 px-4 rounded ml-4 hover:bg-gray-700 flex items-center">
// // // //                             <FiShare2 className="mr-2" /> Share
// // // //                         </button>
// // // //                     </div>
// // // //                     <div className="mt-6">
// // // //                         <div className="flex border-b">
// // // //                             <button
// // // //                                 className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-blue-500' : 'text-gray-600'}`}
// // // //                                 onClick={() => setActiveTab('details')}
// // // //                             >
// // // //                                 Details
// // // //                             </button>
// // // //                             <button
// // // //                                 className={`py-2 px-4 ${activeTab === 'moreInfo' ? 'border-b-2 border-blue-500' : 'text-gray-600'}`}
// // // //                                 onClick={() => setActiveTab('moreInfo')}
// // // //                             >
// // // //                                 More Info
// // // //                             </button>
// // // //                             <button
// // // //                                 className={`py-2 px-4 ${activeTab === 'reviews' ? 'border-b-2 border-blue-500' : 'text-gray-600'}`}
// // // //                                 onClick={() => setActiveTab('reviews')}
// // // //                             >
// // // //                                 Reviews
// // // //                             </button>
// // // //                         </div>
// // // //                         <TabContent />
// // // //                     </div>
// // // //                 </div>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // };
// // // //
// // // // export default ProductDetailPage;
// // // //
// // // // // //<editor-fold desc="not working">
// // // // // import React, { useState, useRef } from 'react';
// // // // // import { FaStar, FaHeart, FaShoppingCart, FaRegStar } from 'react-icons/fa';
// // // // // import { FiShare2 } from 'react-icons/fi';
// // // // // import 'react-image-gallery/styles/css/image-gallery.css';
// // // // //
// // // // // const ProductDetailPage = () => {
// // // // //     const [quantity, setQuantity] = useState(1);
// // // // //     const [activeTab, setActiveTab] = useState('details');
// // // // //     const [newReview, setNewReview] = useState({ name: '', rating: 0, comment: '' });
// // // // //     const [currentImage, setCurrentImage] = useState(0);
// // // // //     const [showMagnifier, setShowMagnifier] = useState(false);
// // // // //     const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
// // // // //     const imageRef = useRef(null);
// // // // //     const magnifierSize = 150;
// // // // //     const zoomLevel = 2.5;
// // // // //
// // // // //     const product = {
// // // // //         name: "Elegant Diamond Necklace",
// // // // //         price: 1299.99,
// // // // //         rating: 4.8,
// // // // //         reviews: 256,
// // // // //         description: "A stunning 18K white gold necklace featuring a brilliant-cut diamond pendant. Perfect for special occasions or as a luxurious everyday accessory.",
// // // // //         images: [
// // // // //             'https://m.media-amazon.com/images/I/81fXSjG2d6L._SX679_.jpg',
// // // // //             'https://m.media-amazon.com/images/I/81s332bgHjL._SX679_.jpg',
// // // // //             'https://via.placeholder.com/800x800?text=Necklace+3',
// // // // //             'https://via.placeholder.com/800x800?text=Necklace+4'
// // // // //         ],
// // // // //         details: [
// // // // //             "18K White Gold",
// // // // //             "0.5 Carat Diamond",
// // // // //             "16-inch Chain",
// // // // //             "Lobster Clasp",
// // // // //         ],
// // // // //         moreInfo: "This exquisite necklace features a brilliant-cut diamond set in 18K white gold. The diamond is carefully selected for its exceptional cut, clarity, and color, ensuring maximum brilliance. The 16-inch chain is perfect for a variety of necklines and can be adjusted for the perfect fit.",
// // // // //         customerReviews: [
// // // // //             { name: "Jane D.", rating: 5, date: "2023-08-15", comment: "Absolutely stunning! The necklace exceeded my expectations. The diamond sparkles beautifully and the chain is delicate yet sturdy.", helpful: 24 },
// // // // //             { name: "John S.", rating: 4, date: "2023-07-22", comment: "Beautiful piece, but the clasp is a bit fiddly. Once it's on though, it looks amazing. The quality of the diamond is excellent.", helpful: 18 },
// // // // //             { name: "Emily R.", rating: 5, date: "2023-06-30", comment: "Bought this as a gift for my mother, and she loves it! The packaging was elegant and made for a great presentation. Highly recommend for special occasions.", helpful: 32 },
// // // // //             { name: "Michael T.", rating: 3, date: "2023-05-15", comment: "The necklace is nice, but I expected the diamond to be a bit larger for the price. The quality is good though, and it does sparkle nicely in the light.", helpful: 7 },
// // // // //             { name: "Sarah L.", rating: 5, date: "2023-04-02", comment: "This necklace is a dream come true! It's elegant, sophisticated, and catches the light beautifully. I've received so many compliments. Worth every penny!", helpful: 41 },
// // // // //         ]
// // // // //     };
// // // // //
// // // // //     const handleMouseEnter = () => {
// // // // //         setShowMagnifier(true);
// // // // //     };
// // // // //
// // // // //     const handleMouseMove = (e) => {
// // // // //         if (!imageRef.current) return;
// // // // //
// // // // //         const { left, top } = imageRef.current.getBoundingClientRect();
// // // // //         const x = e.clientX - left;
// // // // //         const y = e.clientY - top;
// // // // //         setMousePosition({ x, y });
// // // // //     };
// // // // //
// // // // //     const handleMouseLeave = () => {
// // // // //         setShowMagnifier(false);
// // // // //     };
// // // // //
// // // // //     const ImageMagnifier = () => {
// // // // //         const imageStyle = {
// // // // //             backgroundImage: `url('${product.images[currentImage]}')`,
// // // // //             backgroundSize: `${imageRef.current?.clientWidth * zoomLevel}px ${imageRef.current?.clientHeight * zoomLevel}px`,
// // // // //             backgroundPositionX: `${-mousePosition.x * zoomLevel + magnifierSize / 2}px`,
// // // // //             backgroundPositionY: `${-mousePosition.y * zoomLevel + magnifierSize / 2}px`,
// // // // //             position: 'absolute',
// // // // //             width: `${magnifierSize}px`,
// // // // //             height: `${magnifierSize}px`,
// // // // //             border: '1px solid lightgray',
// // // // //             borderRadius: '50%',
// // // // //             pointerEvents: 'none',
// // // // //             top: `${mousePosition.y - magnifierSize / 2}px`,
// // // // //             left: `${mousePosition.x - magnifierSize / 2}px`,
// // // // //             backgroundRepeat: 'no-repeat',
// // // // //         };
// // // // //
// // // // //         return showMagnifier ? <div style={imageStyle} /> : null;
// // // // //     };
// // // // //
// // // // //     const ThumbImage = ({ src, index }) => (
// // // // //         <img
// // // // //             src={src}
// // // // //             alt={`Thumbnail ${index + 1}`}
// // // // //             className={`w-16 h-16 object-cover cursor-pointer ${index === currentImage ? 'border-2 border-blue-500' : ''}`}
// // // // //             onClick={() => setCurrentImage(index)}
// // // // //         />
// // // // //     );
// // // // //
// // // // //     const RatingStars = ({ rating }) => (
// // // // //         <div className="flex">
// // // // //             {[1, 2, 3, 4, 5].map((star) => (
// // // // //                 <span key={star}>
// // // // //                     {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
// // // // //                 </span>
// // // // //             ))}
// // // // //         </div>
// // // // //     );
// // // // //
// // // // //     const ReviewForm = () => (
// // // // //         <form className="mt-6 bg-gray-100 p-4 rounded-lg">
// // // // //             <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
// // // // //             <div className="mb-4">
// // // // //                 <label className="block mb-2">Your Name</label>
// // // // //                 <input
// // // // //                     type="text"
// // // // //                     value={newReview.name}
// // // // //                     onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
// // // // //                     className="w-full p-2 border rounded"
// // // // //                 />
// // // // //             </div>
// // // // //             <div className="mb-4">
// // // // //                 <label className="block mb-2">Rating</label>
// // // // //                 <div className="flex">
// // // // //                     {[1, 2, 3, 4, 5].map((star) => (
// // // // //                         <button
// // // // //                             key={star}
// // // // //                             type="button"
// // // // //                             onClick={() => setNewReview({ ...newReview, rating: star })}
// // // // //                             className="mr-1"
// // // // //                         >
// // // // //                             {star <= newReview.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
// // // // //                         </button>
// // // // //                     ))}
// // // // //                 </div>
// // // // //             </div>
// // // // //             <div className="mb-4">
// // // // //                 <label className="block mb-2">Your Review</label>
// // // // //                 <textarea
// // // // //                     value={newReview.comment}
// // // // //                     onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
// // // // //                     className="w-full p-2 border rounded"
// // // // //                     rows="4"
// // // // //                 ></textarea>
// // // // //             </div>
// // // // //             <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
// // // // //                 Submit Review
// // // // //             </button>
// // // // //         </form>
// // // // //     );
// // // // //
// // // // //     const TabContent = () => {
// // // // //         switch (activeTab) {
// // // // //             case 'details':
// // // // //                 return (
// // // // //                     <ul className="list-disc list-inside text-gray-700">
// // // // //                         {product.details.map((detail, index) => (
// // // // //                             <li key={index}>{detail}</li>
// // // // //                         ))}
// // // // //                     </ul>
// // // // //                 );
// // // // //             case 'moreInfo':
// // // // //                 return <p className="text-gray-700">{product.moreInfo}</p>;
// // // // //             case 'reviews':
// // // // //                 return (
// // // // //                     <div>
// // // // //                         <div className="mb-6">
// // // // //                             <h3 className="text-xl font-semibold">Customer Reviews</h3>
// // // // //                             <span className="text-gray-500">({product.reviews} reviews)</span>
// // // // //                         </div>
// // // // //                         <div>
// // // // //                             {product.customerReviews.map((review, index) => (
// // // // //                                 <div key={index} className="border-b py-4">
// // // // //                                     <div className="flex items-center mb-2">
// // // // //                                         <span className="font-semibold">{review.name}</span>
// // // // //                                         <RatingStars rating={review.rating} />
// // // // //                                         <span className="text-gray-500 ml-2">{review.date}</span>
// // // // //                                     </div>
// // // // //                                     <p className="text-gray-700">{review.comment}</p>
// // // // //                                     <div className="flex items-center mt-2">
// // // // //                                         <button
// // // // //                                             className="text-blue-500 hover:text-blue-700"
// // // // //                                             onClick={() => console.log('Helpful button clicked')}
// // // // //                                         >
// // // // //                                             Helpful ({review.helpful})
// // // // //                                         </button>
// // // // //                                     </div>
// // // // //                                 </div>
// // // // //                             ))}
// // // // //                         </div>
// // // // //                         <ReviewForm />
// // // // //                     </div>
// // // // //                 );
// // // // //             default:
// // // // //                 return null;
// // // // //         }
// // // // //     };
// // // // //
// // // // //     return (
// // // // //         <div className="container mx-auto p-4 relative">
// // // // //             <div className="flex flex-wrap lg:flex-nowrap">
// // // // //                 <div className="w-full lg:w-1/2 mb-4 lg:mb-0 relative" onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
// // // // //                     <img
// // // // //                         ref={imageRef}
// // // // //                         src={product.images[currentImage]}
// // // // //                         alt="Product"
// // // // //                         className="w-full h-auto object-cover"
// // // // //                     />
// // // // //                     <ImageMagnifier />
// // // // //                     <div className="flex mt-4">
// // // // //                         {product.images.map((img, index) => (
// // // // //                             <ThumbImage key={index} src={img} index={index} />
// // // // //                         ))}
// // // // //                     </div>
// // // // //                 </div>
// // // // //                 <div className="w-full lg:w-1/2 lg:pl-8">
// // // // //                     <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
// // // // //                     <div className="flex items-center mb-4">
// // // // //                         <RatingStars rating={Math.round(product.rating)} />
// // // // //                         <span className="text-gray-600 ml-2">({product.reviews} reviews)</span>
// // // // //                     </div>
// // // // //                     <p className="text-xl font-semibold mb-4">${product.price.toFixed(2)}</p>
// // // // //                     <p className="text-gray-700 mb-4">{product.description}</p>
// // // // //                     <div className="flex items-center mb-4">
// // // // //                         <button
// // // // //                             onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
// // // // //                             className="bg-gray-200 px-4 py-2 rounded-l"
// // // // //                         >
// // // // //                             -
// // // // //                         </button>
// // // // //                         <input
// // // // //                             type="text"
// // // // //                             value={quantity}
// // // // //                             readOnly
// // // // //                             className="w-16 text-center border-t border-b"
// // // // //                         />
// // // // //                         <button
// // // // //                             onClick={() => setQuantity(quantity + 1)}
// // // // //                             className="bg-gray-200 px-4 py-2 rounded-r"
// // // // //                         >
// // // // //                             +
// // // // //                         </button>
// // // // //                     </div>
// // // // //                     <div className="flex items-center mb-4">
// // // // //                         <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center">
// // // // //                             <FaShoppingCart className="mr-2" /> Add to Cart
// // // // //                         </button>
// // // // //                         <button className="bg-red-600 text-white py-2 px-4 rounded ml-4 hover:bg-red-700 flex items-center">
// // // // //                             <FaHeart className="mr-2" /> Add to Wishlist
// // // // //                         </button>
// // // // //                         <button className="bg-gray-600 text-white py-2 px-4 rounded ml-4 hover:bg-gray-700 flex items-center">
// // // // //                             <FiShare2 className="mr-2" /> Share
// // // // //                         </button>
// // // // //                     </div>
// // // // //                     <div className="mt-6">
// // // // //                         <div className="flex border-b">
// // // // //                             <button
// // // // //                                 className={`py-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-blue-500' : 'text-gray-600'}`}
// // // // //                                 onClick={() => setActiveTab('details')}
// // // // //                             >
// // // // //                                 Details
// // // // //                             </button>
// // // // //                             <button
// // // // //                                 className={`py-2 px-4 ${activeTab === 'moreInfo' ? 'border-b-2 border-blue-500' : 'text-gray-600'}`}
// // // // //                                 onClick={() => setActiveTab('moreInfo')}
// // // // //                             >
// // // // //                                 More Info
// // // // //                             </button>
// // // // //                             <button
// // // // //                                 className={`py-2 px-4 ${activeTab === 'reviews' ? 'border-b-2 border-blue-500' : 'text-gray-600'}`}
// // // // //                                 onClick={() => setActiveTab('reviews')}
// // // // //                             >
// // // // //                                 Reviews
// // // // //                             </button>
// // // // //                         </div>
// // // // //                         <TabContent />
// // // // //                     </div>
// // // // //                 </div>
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // };
// // // // //
// // // // // export default ProductDetailPage;
// // // // // //</editor-fold>
// // // // // //<editor-fold desc="zoom small problem but review and rating and product details okay">
// // // // // import React, { useState, useRef } from 'react';
// // // // // import { motion } from 'framer-motion';
// // // // // import { FaStar, FaHeart, FaShoppingCart, FaRegStar } from 'react-icons/fa';
// // // // // import { FiShare2 } from 'react-icons/fi';
// // // // // import 'react-image-gallery/styles/css/image-gallery.css';
// // // // //
// // // // // const ProductDetailPage = () => {
// // // // //     const [quantity, setQuantity] = useState(1);
// // // // //     const [activeTab, setActiveTab] = useState('details');
// // // // //     const [newReview, setNewReview] = useState({ name: '', rating: 0, comment: '' });
// // // // //     const [currentImage, setCurrentImage] = useState(0);
// // // // //     const [showMagnifier, setShowMagnifier] = useState(false);
// // // // //     const [[x, y], setXY] = useState([0, 0]);
// // // // //     const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
// // // // //     const magnifierSize = 150;
// // // // //     const zoomLevel = 2.5;
// // // // //
// // // // //     const product = {
// // // // //         name: "Elegant Diamond Necklace",
// // // // //         price: 1299.99,
// // // // //         rating: 4.8,
// // // // //         reviews: 256,
// // // // //         description: "A stunning 18K white gold necklace featuring a brilliant-cut diamond pendant. Perfect for special occasions or as a luxurious everyday accessory.",
// // // // //         images: [
// // // // //             'https://m.media-amazon.com/images/I/81fXSjG2d6L._SX679_.jpg',
// // // // //             'https://m.media-amazon.com/images/I/81s332bgHjL._SX679_.jpg',
// // // // //             'https://via.placeholder.com/800x800?text=Necklace+3',
// // // // //             'https://via.placeholder.com/800x800?text=Necklace+4'
// // // // //         ],
// // // // //         details: [
// // // // //             "18K White Gold",
// // // // //             "0.5 Carat Diamond",
// // // // //             "16-inch Chain",
// // // // //             "Lobster Clasp",
// // // // //         ],
// // // // //         moreInfo: "This exquisite necklace features a brilliant-cut diamond set in 18K white gold. The diamond is carefully selected for its exceptional cut, clarity, and color, ensuring maximum brilliance. The 16-inch chain is perfect for a variety of necklines and can be adjusted for the perfect fit.",
// // // // //         customerReviews: [
// // // // //             { name: "Jane D.", rating: 5, date: "2023-08-15", comment: "Absolutely stunning! The necklace exceeded my expectations. The diamond sparkles beautifully and the chain is delicate yet sturdy.", helpful: 24 },
// // // // //             { name: "John S.", rating: 4, date: "2023-07-22", comment: "Beautiful piece, but the clasp is a bit fiddly. Once it's on though, it looks amazing. The quality of the diamond is excellent.", helpful: 18 },
// // // // //             { name: "Emily R.", rating: 5, date: "2023-06-30", comment: "Bought this as a gift for my mother, and she loves it! The packaging was elegant and made for a great presentation. Highly recommend for special occasions.", helpful: 32 },
// // // // //             { name: "Michael T.", rating: 3, date: "2023-05-15", comment: "The necklace is nice, but I expected the diamond to be a bit larger for the price. The quality is good though, and it does sparkle nicely in the light.", helpful: 7 },
// // // // //             { name: "Sarah L.", rating: 5, date: "2023-04-02", comment: "This necklace is a dream come true! It's elegant, sophisticated, and catches the light beautifully. I've received so many compliments. Worth every penny!", helpful: 41 },
// // // // //         ]
// // // // //     };
// // // // //
// // // // //     const handleMouseEnter = (e) => {
// // // // //         const elem = e.currentTarget;
// // // // //         const { width, height } = elem.getBoundingClientRect();
// // // // //         setSize([width, height]);
// // // // //         setShowMagnifier(true);
// // // // //     };
// // // // //
// // // // //     const handleMouseMove = (e) => {
// // // // //         const elem = e.currentTarget;
// // // // //         const { top, left } = elem.getBoundingClientRect();
// // // // //
// // // // //         // Calculate cursor position on the image
// // // // //         const x = e.pageX - left - window.pageXOffset;
// // // // //         const y = e.pageY - top - window.pageYOffset;
// // // // //         setXY([x, y]);
// // // // //     };
// // // // //
// // // // //     const handleMouseLeave = () => {
// // // // //         setShowMagnifier(false);
// // // // //     };
// // // // //
// // // // //     const ImageMagnifier = () => (
// // // // //         <div
// // // // //             style={{
// // // // //                 position: "relative",
// // // // //                 height: "0",
// // // // //                 paddingBottom: "100%"
// // // // //             }}
// // // // //         >
// // // // //             <img
// // // // //                 src={product.images[currentImage]}
// // // // //                 alt={product.name}
// // // // //                 style={{
// // // // //                     position: "absolute",
// // // // //                     width: "100%",
// // // // //                     height: "100%",
// // // // //                     objectFit: "cover"
// // // // //                 }}
// // // // //                 onMouseEnter={handleMouseEnter}
// // // // //                 onMouseMove={handleMouseMove}
// // // // //                 onMouseLeave={handleMouseLeave}
// // // // //             />
// // // // //             {showMagnifier && (
// // // // //                 <div
// // // // //                     style={{
// // // // //                         display: showMagnifier ? "" : "none",
// // // // //                         position: "absolute",
// // // // //                         pointerEvents: "none",
// // // // //                         height: `${magnifierSize}px`,
// // // // //                         width: `${magnifierSize}px`,
// // // // //                         top: `${y - magnifierSize / 2}px`,
// // // // //                         left: `${x - magnifierSize / 2}px`,
// // // // //                         opacity: "1",
// // // // //                         border: "1px solid lightgray",
// // // // //                         backgroundColor: "white",
// // // // //                         backgroundImage: `url('${product.images[currentImage]}')`,
// // // // //                         backgroundRepeat: "no-repeat",
// // // // //                         backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
// // // // //                         backgroundPositionX: `${-x * zoomLevel + magnifierSize / 2}px`,
// // // // //                         backgroundPositionY: `${-y * zoomLevel + magnifierSize / 2}px`
// // // // //                     }}
// // // // //                 ></div>
// // // // //             )}
// // // // //         </div>
// // // // //     );
// // // // //
// // // // //     const ThumbImage = ({ src, index }) => (
// // // // //         <img
// // // // //             src={src}
// // // // //             alt={`Thumbnail ${index + 1}`}
// // // // //             className={`w-16 h-16 object-cover cursor-pointer ${index === currentImage ? 'border-2 border-blue-500' : ''}`}
// // // // //             onClick={() => setCurrentImage(index)}
// // // // //         />
// // // // //     );
// // // // //
// // // // //     const RatingStars = ({ rating }) => (
// // // // //         <div className="flex">
// // // // //             {[1, 2, 3, 4, 5].map((star) => (
// // // // //                 <span key={star}>
// // // // //                     {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
// // // // //                 </span>
// // // // //             ))}
// // // // //         </div>
// // // // //     );
// // // // //
// // // // //     const ReviewForm = () => (
// // // // //         <form className="mt-6 bg-gray-100 p-4 rounded-lg">
// // // // //             <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
// // // // //             <div className="mb-4">
// // // // //                 <label className="block mb-2">Your Name</label>
// // // // //                 <input
// // // // //                     type="text"
// // // // //                     value={newReview.name}
// // // // //                     onChange={(e) => setNewReview({...newReview, name: e.target.value})}
// // // // //                     className="w-full p-2 border rounded"
// // // // //                 />
// // // // //             </div>
// // // // //             <div className="mb-4">
// // // // //                 <label className="block mb-2">Rating</label>
// // // // //                 <div className="flex">
// // // // //                     {[1, 2, 3, 4, 5].map((star) => (
// // // // //                         <button
// // // // //                             key={star}
// // // // //                             type="button"
// // // // //                             onClick={() => setNewReview({...newReview, rating: star})}
// // // // //                             className="mr-1"
// // // // //                         >
// // // // //                             {star <= newReview.rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
// // // // //                         </button>
// // // // //                     ))}
// // // // //                 </div>
// // // // //             </div>
// // // // //             <div className="mb-4">
// // // // //                 <label className="block mb-2">Your Review</label>
// // // // //                 <textarea
// // // // //                     value={newReview.comment}
// // // // //                     onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
// // // // //                     className="w-full p-2 border rounded"
// // // // //                     rows="4"
// // // // //                 ></textarea>
// // // // //             </div>
// // // // //             <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
// // // // //                 Submit Review
// // // // //             </button>
// // // // //         </form>
// // // // //     );
// // // // //
// // // // //     const TabContent = () => {
// // // // //         switch (activeTab) {
// // // // //             case 'details':
// // // // //                 return (
// // // // //                     <ul className="list-disc list-inside text-gray-700">
// // // // //                         {product.details.map((detail, index) => (
// // // // //                             <li key={index}>{detail}</li>
// // // // //                         ))}
// // // // //                     </ul>
// // // // //                 );
// // // // //             case 'moreInfo':
// // // // //                 return <p className="text-gray-700">{product.moreInfo}</p>;
// // // // //             case 'reviews':
// // // // //                 return (
// // // // //                     <div>
// // // // //                         <div className="mb-6">
// // // // //                             <h3 className="text-2xl font-semibold mb-2">Customer Reviews</h3>
// // // // //                             <div className="flex items-center mb-2">
// // // // //                                 <span className="text-3xl font-bold mr-2">{product.rating}</span>
// // // // //                                 <RatingStars rating={Math.round(product.rating)} />
// // // // //                                 <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
// // // // //                             </div>
// // // // //                             <div className="h-4 bg-gray-200 rounded-full mt-2">
// // // // //                                 <div
// // // // //                                     className="h-4 bg-yellow-400 rounded-full"
// // // // //                                     style={{ width: `${(product.rating / 5) * 100}%` }}
// // // // //                                 ></div>
// // // // //                             </div>
// // // // //                         </div>
// // // // //                         {product.customerReviews.map((review, index) => (
// // // // //                             <div key={index} className="mb-4 pb-4 border-b">
// // // // //                                 <div className="flex items-center mb-1">
// // // // //                                     <span className="font-semibold mr-2">{review.name}</span>
// // // // //                                     <RatingStars rating={review.rating} />
// // // // //                                 </div>
// // // // //                                 <div className="text-gray-600 text-sm mb-2">{review.date}</div>
// // // // //                                 <p className="text-gray-700 mb-2">{review.comment}</p>
// // // // //                                 <div className="text-sm text-gray-600">
// // // // //                                     {review.helpful} people found this helpful
// // // // //                                 </div>
// // // // //                             </div>
// // // // //                         ))}
// // // // //                         <ReviewForm />
// // // // //                     </div>
// // // // //                 );
// // // // //             default:
// // // // //                 return null;
// // // // //         }
// // // // //     };
// // // // //
// // // // //     return (
// // // // //         <div className="container mx-auto px-4 py-8">
// // // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
// // // // //                 {/* Image Gallery */}
// // // // //                 <div className="w-full max-w-xl mx-auto">
// // // // //                     <ImageMagnifier />
// // // // //                     <div className="flex justify-center mt-4 space-x-2">
// // // // //                         {product.images.map((src, index) => (
// // // // //                             <ThumbImage key={index} src={src} index={index} />
// // // // //                         ))}
// // // // //                     </div>
// // // // //                 </div>
// // // // //
// // // // //                 {/* Product Info */}
// // // // //                 <div>
// // // // //                     <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
// // // // //                     <div className="flex items-center mb-4">
// // // // //                         <div className="flex text-yellow-400 mr-2">
// // // // //                             {[...Array(5)].map((_, i) => (
// // // // //                                 <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />
// // // // //                             ))}
// // // // //                         </div>
// // // // //                         <span className="text-gray-600">{product.rating} ({product.reviews} reviews)</span>
// // // // //                     </div>
// // // // //                     <p className="text-2xl font-semibold text-gray-900 mb-4">${product.price.toFixed(2)}</p>
// // // // //                     <p className="text-gray-700 mb-6">{product.description}</p>
// // // // //
// // // // //                     {/* Quantity Selector */}
// // // // //                     <div className="flex items-center mb-6">
// // // // //                         <span className="mr-3">Quantity:</span>
// // // // //                         <button
// // // // //                             className="bg-gray-200 px-3 py-1 rounded-l"
// // // // //                             onClick={() => setQuantity(Math.max(1, quantity - 1))}
// // // // //                         >
// // // // //                             -
// // // // //                         </button>
// // // // //                         <span className="bg-gray-100 px-4 py-1">{quantity}</span>
// // // // //                         <button
// // // // //                             className="bg-gray-200 px-3 py-1 rounded-r"
// // // // //                             onClick={() => setQuantity(quantity + 1)}
// // // // //                         >
// // // // //                             +
// // // // //                         </button>
// // // // //                     </div>
// // // // //
// // // // //                     {/* Action Buttons */}
// // // // //                     <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
// // // // //                         <motion.button
// // // // //                             whileHover={{ scale: 1.05 }}
// // // // //                             whileTap={{ scale: 0.95 }}
// // // // //                             className="bg-blue-600 text-white py-2 px-6 rounded-full flex items-center justify-center"
// // // // //                         >
// // // // //                             <FaShoppingCart className="mr-2" />
// // // // //                             Add to Cart
// // // // //                         </motion.button>
// // // // //                         <motion.button
// // // // //                             whileHover={{ scale: 1.05 }}
// // // // //                             whileTap={{ scale: 0.95 }}
// // // // //                             className="bg-pink-600 text-white py-2 px-6 rounded-full flex items-center justify-center"
// // // // //                         >
// // // // //                             <FaHeart className="mr-2" />
// // // // //                             Add to Wishlist
// // // // //                         </motion.button>
// // // // //                         <motion.button
// // // // //                             whileHover={{ scale: 1.05 }}
// // // // //                             whileTap={{ scale: 0.95 }}
// // // // //                             className="bg-gray-200 text-gray-800 py-2 px-6 rounded-full flex items-center justify-center"
// // // // //                         >
// // // // //                             <FiShare2 className="mr-2" />
// // // // //                             Share
// // // // //                         </motion.button>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             </div>
// // // // //
// // // // //
// // // // //             {/* Tabs */}
// // // // //             <div className="mb-4">
// // // // //                 <div className="flex border-b">
// // // // //                     {['details', 'moreInfo', 'reviews'].map((tab) => (
// // // // //                         <button
// // // // //                             key={tab}
// // // // //                             className={`py-2 px-4 font-semibold ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
// // // // //                             onClick={() => setActiveTab(tab)}
// // // // //                         >
// // // // //                             {tab.charAt(0).toUpperCase() + tab.slice(1)}
// // // // //                         </button>
// // // // //                     ))}
// // // // //                 </div>
// // // // //             </div>
// // // // //
// // // // //             {/* Tab Content */}
// // // // //             <div className="mt-4">
// // // // //                 <TabContent />
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // };
// // // // //
// // // // // export default ProductDetailPage;
// // // // // //</editor-fold>
// // // // // //<editor-fold desc="first choice carosule done but zoom not work">
// // // // // import React, { useState } from 'react';
// // // // // import { motion } from 'framer-motion';
// // // // // import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
// // // // // import { FiShare2 } from 'react-icons/fi';
// // // // // import ImageGallery from 'react-image-gallery';
// // // // // import 'react-image-gallery/styles/css/image-gallery.css';
// // // // //
// // // // // const ProductDetailPage = () => {
// // // // //     const [quantity, setQuantity] = useState(1);
// // // // //     const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
// // // // //     const [isZoomed, setIsZoomed] = useState(false);
// // // // //     const [activeTab, setActiveTab] = useState('details');
// // // // //
// // // // //     const product = {
// // // // //         name: "Elegant Diamond Necklace",
// // // // //         price: 1299.99,
// // // // //         rating: 4.8,
// // // // //         reviews: 256,
// // // // //         description: "A stunning 18K white gold necklace featuring a brilliant-cut diamond pendant. Perfect for special occasions or as a luxurious everyday accessory.",
// // // // //         images: [
// // // // //             {
// // // // //                 original: 'https://via.placeholder.com/800x800?text=Necklace+1',
// // // // //                 thumbnail: 'https://via.placeholder.com/100x100?text=Necklace+1',
// // // // //             },
// // // // //             {
// // // // //                 original: 'https://via.placeholder.com/800x800?text=Necklace+2',
// // // // //                 thumbnail: 'https://via.placeholder.com/100x100?text=Necklace+2',
// // // // //             },
// // // // //             {
// // // // //                 original: 'https://via.placeholder.com/800x800?text=Necklace+3',
// // // // //                 thumbnail: 'https://via.placeholder.com/100x100?text=Necklace+3',
// // // // //             },
// // // // //             {
// // // // //                 original: 'https://via.placeholder.com/800x800?text=Necklace+4',
// // // // //                 thumbnail: 'https://via.placeholder.com/100x100?text=Necklace+4',
// // // // //             }
// // // // //         ],
// // // // //         details: [
// // // // //             "18K White Gold",
// // // // //             "0.5 Carat Diamond",
// // // // //             "16-inch Chain",
// // // // //             "Lobster Clasp",
// // // // //         ],
// // // // //         moreInfo: "This exquisite necklace features a brilliant-cut diamond set in 18K white gold. The diamond is carefully selected for its exceptional cut, clarity, and color, ensuring maximum brilliance. The 16-inch chain is perfect for a variety of necklines and can be adjusted for the perfect fit.",
// // // // //         customerReviews: [
// // // // //             { name: "Jane D.", rating: 5, comment: "Absolutely stunning! The necklace exceeded my expectations." },
// // // // //             { name: "John S.", rating: 4, comment: "Beautiful piece, but the clasp is a bit fiddly." },
// // // // //             { name: "Emily R.", rating: 5, comment: "Bought this as a gift for my mother, and she loves it!" },
// // // // //         ]
// // // // //     };
// // // // //
// // // // //     const handleMouseMove = (e) => {
// // // // //         if (isZoomed) {
// // // // //             const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
// // // // //             const x = (e.clientX - left) / width;
// // // // //             const y = (e.clientY - top) / height;
// // // // //             setZoomPosition({ x, y });
// // // // //         }
// // // // //     };
// // // // //
// // // // //     const handleMouseEnter = () => setIsZoomed(true);
// // // // //     const handleMouseLeave = () => setIsZoomed(false);
// // // // //
// // // // //     const renderItem = (item) => (
// // // // //         <div className="relative overflow-hidden" style={{ paddingTop: '100%' }}>
// // // // //             <img
// // // // //                 src={item.original}
// // // // //                 alt={product.name}
// // // // //                 className="absolute top-0 left-0 w-full h-full object-cover cursor-zoom-in"
// // // // //                 onMouseMove={handleMouseMove}
// // // // //                 onMouseEnter={handleMouseEnter}
// // // // //                 onMouseLeave={handleMouseLeave}
// // // // //             />
// // // // //             {isZoomed && (
// // // // //                 <div
// // // // //                     className="absolute top-0 left-0 w-full h-full"
// // // // //                     style={{
// // // // //                         backgroundImage: `url(${item.original})`,
// // // // //                         backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
// // // // //                         backgroundSize: '200%',
// // // // //                         backgroundRepeat: 'no-repeat',
// // // // //                         zIndex: 10,
// // // // //                     }}
// // // // //                 />
// // // // //             )}
// // // // //         </div>
// // // // //     );
// // // // //
// // // // //     const TabContent = () => {
// // // // //         switch (activeTab) {
// // // // //             case 'details':
// // // // //                 return (
// // // // //                     <ul className="list-disc list-inside text-gray-700">
// // // // //                         {product.details.map((detail, index) => (
// // // // //                             <li key={index}>{detail}</li>
// // // // //                         ))}
// // // // //                     </ul>
// // // // //                 );
// // // // //             case 'moreInfo':
// // // // //                 return <p className="text-gray-700">{product.moreInfo}</p>;
// // // // //             case 'reviews':
// // // // //                 return (
// // // // //                     <div>
// // // // //                         {product.customerReviews.map((review, index) => (
// // // // //                             <div key={index} className="mb-4">
// // // // //                                 <div className="flex items-center mb-1">
// // // // //                                     <span className="font-semibold mr-2">{review.name}</span>
// // // // //                                     <div className="flex text-yellow-400">
// // // // //                                         {[...Array(5)].map((_, i) => (
// // // // //                                             <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
// // // // //                                         ))}
// // // // //                                     </div>
// // // // //                                 </div>
// // // // //                                 <p className="text-gray-700">{review.comment}</p>
// // // // //                             </div>
// // // // //                         ))}
// // // // //                     </div>
// // // // //                 );
// // // // //             default:
// // // // //                 return null;
// // // // //         }
// // // // //     };
// // // // //
// // // // //     return (
// // // // //         <div className="container mx-auto px-4 py-8">
// // // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
// // // // //                 {/* Image Gallery */}
// // // // //                 <div className="w-full max-w-xl mx-auto">
// // // // //                     <ImageGallery
// // // // //                         items={product.images}
// // // // //                         showPlayButton={false}
// // // // //                         showFullscreenButton={false}
// // // // //                         renderItem={renderItem}
// // // // //                     />
// // // // //                 </div>
// // // // //
// // // // //                 {/* Product Info */}
// // // // //                 <div>
// // // // //                     <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
// // // // //                     <div className="flex items-center mb-4">
// // // // //                         <div className="flex text-yellow-400 mr-2">
// // // // //                             {[...Array(5)].map((_, i) => (
// // // // //                                 <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />
// // // // //                             ))}
// // // // //                         </div>
// // // // //                         <span className="text-gray-600">{product.rating} ({product.reviews} reviews)</span>
// // // // //                     </div>
// // // // //                     <p className="text-2xl font-semibold text-gray-900 mb-4">${product.price.toFixed(2)}</p>
// // // // //                     <p className="text-gray-700 mb-6">{product.description}</p>
// // // // //
// // // // //                     {/* Quantity Selector */}
// // // // //                     <div className="flex items-center mb-6">
// // // // //                         <span className="mr-3">Quantity:</span>
// // // // //                         <button
// // // // //                             className="bg-gray-200 px-3 py-1 rounded-l"
// // // // //                             onClick={() => setQuantity(Math.max(1, quantity - 1))}
// // // // //                         >
// // // // //                             -
// // // // //                         </button>
// // // // //                         <span className="bg-gray-100 px-4 py-1">{quantity}</span>
// // // // //                         <button
// // // // //                             className="bg-gray-200 px-3 py-1 rounded-r"
// // // // //                             onClick={() => setQuantity(quantity + 1)}
// // // // //                         >
// // // // //                             +
// // // // //                         </button>
// // // // //                     </div>
// // // // //
// // // // //                     {/* Action Buttons */}
// // // // //                     <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
// // // // //                         <motion.button
// // // // //                             whileHover={{ scale: 1.05 }}
// // // // //                             whileTap={{ scale: 0.95 }}
// // // // //                             className="bg-blue-600 text-white py-2 px-6 rounded-full flex items-center justify-center"
// // // // //                         >
// // // // //                             <FaShoppingCart className="mr-2" />
// // // // //                             Add to Cart
// // // // //                         </motion.button>
// // // // //                         <motion.button
// // // // //                             whileHover={{ scale: 1.05 }}
// // // // //                             whileTap={{ scale: 0.95 }}
// // // // //                             className="bg-pink-600 text-white py-2 px-6 rounded-full flex items-center justify-center"
// // // // //                         >
// // // // //                             <FaHeart className="mr-2" />
// // // // //                             Add to Wishlist
// // // // //                         </motion.button>
// // // // //                         <motion.button
// // // // //                             whileHover={{ scale: 1.05 }}
// // // // //                             whileTap={{ scale: 0.95 }}
// // // // //                             className="bg-gray-200 text-gray-800 py-2 px-6 rounded-full flex items-center justify-center"
// // // // //                         >
// // // // //                             <FiShare2 className="mr-2" />
// // // // //                             Share
// // // // //                         </motion.button>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             </div>
// // // // //
// // // // //             {/* Tabs */}
// // // // //             <div className="mb-4">
// // // // //                 <div className="flex border-b">
// // // // //                     {['details', 'moreInfo', 'reviews'].map((tab) => (
// // // // //                         <button
// // // // //                             key={tab}
// // // // //                             className={`py-2 px-4 font-semibold ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
// // // // //                             onClick={() => setActiveTab(tab)}
// // // // //                         >
// // // // //                             {tab.charAt(0).toUpperCase() + tab.slice(1)}
// // // // //                         </button>
// // // // //                     ))}
// // // // //                 </div>
// // // // //             </div>
// // // // //
// // // // //             {/* Tab Content */}
// // // // //             <div className="mt-4">
// // // // //                 <TabContent />
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // };
// // // // //
// // // // // export default ProductDetailPage;
// // // // // //</editor-fold>
// // // // // //<editor-fold desc="normal only">
// // // // // import React, { useState } from 'react';
// // // // // import { motion } from 'framer-motion';
// // // // // import { FaStar, FaHeart, FaShoppingCart } from 'react-icons/fa';
// // // // // import { FiShare2 } from 'react-icons/fi';
// // // // //
// // // // // const ProductDetailPage = () => {
// // // // //     const [selectedImage, setSelectedImage] = useState(0);
// // // // //     const [quantity, setQuantity] = useState(1);
// // // // //
// // // // //     const product = {
// // // // //         name: "Elegant Diamond Necklace",
// // // // //         price: 1299.99,
// // // // //         rating: 4.8,
// // // // //         reviews: 256,
// // // // //         description: "A stunning 18K white gold necklace featuring a brilliant-cut diamond pendant. Perfect for special occasions or as a luxurious everyday accessory.",
// // // // //         images: [
// // // // //          'https://via.placeholder.com/150' ,
// // // // //          'https://via.placeholder.com/150',
// // // // //          'https://via.placeholder.com/150',
// // // // //          'https://via.placeholder.com/150',
// // // // //          'https://via.placeholder.com/150',
// // // // //          'https://via.placeholder.com/150',        ],
// // // // //         features: [
// // // // //             "18K White Gold",
// // // // //             "0.5 Carat Diamond",
// // // // //             "16-inch Chain",
// // // // //             "Lobster Clasp",
// // // // //         ]
// // // // //     };
// // // // //
// // // // //     return (
// // // // //         <div className="container mx-auto px-4 py-8">
// // // // //             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
// // // // //                 {/* Image Gallery */}
// // // // //                 <div>
// // // // //                     <motion.img
// // // // //                         src={product.images[selectedImage]}
// // // // //                         alt={product.name}
// // // // //                         className="w-full h-auto rounded-lg shadow-lg mb-4"
// // // // //                         initial={{ opacity: 0 }}
// // // // //                         animate={{ opacity: 1 }}
// // // // //                         transition={{ duration: 0.5 }}
// // // // //                     />
// // // // //                     <div className="grid grid-cols-4 gap-2">
// // // // //                         {product.images.map((img, index) => (
// // // // //                             <img
// // // // //                                 key={index}
// // // // //                                 src={img}
// // // // //                                 alt={`${product.name} - View ${index + 1}`}
// // // // //                                 className={`w-full h-auto rounded cursor-pointer ${
// // // // //                                     selectedImage === index ? 'ring-2 ring-blue-500' : ''
// // // // //                                 }`}
// // // // //                                 onClick={() => setSelectedImage(index)}
// // // // //                             />
// // // // //                         ))}
// // // // //                     </div>
// // // // //                 </div>
// // // // //
// // // // //                 {/* Product Info */}
// // // // //                 <div>
// // // // //                     <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
// // // // //                     <div className="flex items-center mb-4">
// // // // //                         <div className="flex text-yellow-400 mr-2">
// // // // //                             {[...Array(5)].map((_, i) => (
// // // // //                                 <FaStar key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'} />
// // // // //                             ))}
// // // // //                         </div>
// // // // //                         <span className="text-gray-600">{product.rating} ({product.reviews} reviews)</span>
// // // // //                     </div>
// // // // //                     <p className="text-2xl font-semibold text-gray-900 mb-4">${product.price.toFixed(2)}</p>
// // // // //                     <p className="text-gray-700 mb-6">{product.description}</p>
// // // // //
// // // // //                     {/* Features */}
// // // // //                     <div className="mb-6">
// // // // //                         <h2 className="text-xl font-semibold mb-2">Features:</h2>
// // // // //                         <ul className="list-disc list-inside text-gray-700">
// // // // //                             {product.features.map((feature, index) => (
// // // // //                                 <li key={index}>{feature}</li>
// // // // //                             ))}
// // // // //                         </ul>
// // // // //                     </div>
// // // // //
// // // // //                     {/* Quantity Selector */}
// // // // //                     <div className="flex items-center mb-6">
// // // // //                         <span className="mr-3">Quantity:</span>
// // // // //                         <button
// // // // //                             className="bg-gray-200 px-3 py-1 rounded-l"
// // // // //                             onClick={() => setQuantity(Math.max(1, quantity - 1))}
// // // // //                         >
// // // // //                             -
// // // // //                         </button>
// // // // //                         <span className="bg-gray-100 px-4 py-1">{quantity}</span>
// // // // //                         <button
// // // // //                             className="bg-gray-200 px-3 py-1 rounded-r"
// // // // //                             onClick={() => setQuantity(quantity + 1)}
// // // // //                         >
// // // // //                             +
// // // // //                         </button>
// // // // //                     </div>
// // // // //
// // // // //                     {/* Action Buttons */}
// // // // //                     <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
// // // // //                         <motion.button
// // // // //                             whileHover={{ scale: 1.05 }}
// // // // //                             whileTap={{ scale: 0.95 }}
// // // // //                             className="bg-blue-600 text-white py-2 px-6 rounded-full flex items-center justify-center"
// // // // //                         >
// // // // //                             <FaShoppingCart className="mr-2" />
// // // // //                             Add to Cart
// // // // //                         </motion.button>
// // // // //                         <motion.button
// // // // //                             whileHover={{ scale: 1.05 }}
// // // // //                             whileTap={{ scale: 0.95 }}
// // // // //                             className="bg-pink-600 text-white py-2 px-6 rounded-full flex items-center justify-center"
// // // // //                         >
// // // // //                             <FaHeart className="mr-2" />
// // // // //                             Add to Wishlist
// // // // //                         </motion.button>
// // // // //                         <motion.button
// // // // //                             whileHover={{ scale: 1.05 }}
// // // // //                             whileTap={{ scale: 0.95 }}
// // // // //                             className="bg-gray-200 text-gray-800 py-2 px-6 rounded-full flex items-center justify-center"
// // // // //                         >
// // // // //                             <FiShare2 className="mr-2" />
// // // // //                             Share
// // // // //                         </motion.button>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // };
// // // // //
// // // // // export default ProductDetailPage;
// // // // // //</editor-fold>