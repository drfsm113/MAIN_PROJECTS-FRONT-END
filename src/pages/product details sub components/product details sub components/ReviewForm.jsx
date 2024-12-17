import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar } from 'react-icons/fa';
import api from '../utils/api';

const API_BASE_URL_review = 'http://127.0.0.1:8000/api/v1/client';

const ReviewForm = ({ productId, onReviewAdded, isLoggedIn }) => {
    const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '', pros: '', cons: '' });
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        setUploadedImages(Array.from(e.target.files));
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            setError('You must be logged in to submit a review.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('product', productId);
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
            setNewReview({ rating: 5, title: '', comment: '', pros: '', cons: '' });
            setUploadedImages([]);
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

export default ReviewForm;