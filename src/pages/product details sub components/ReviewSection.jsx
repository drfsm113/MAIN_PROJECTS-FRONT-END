import React from 'react';
import { Link } from 'react-router-dom';
import ReviewForm from './product details sub components/ReviewForm';
import ReviewsList from './product details sub components/ReviewsList';

const ReviewSection = ({ productId, reviews, onNewReview, isLoggedIn }) => (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h3 className="text-2xl font-semibold mb-2 sm:mb-0">Customer Reviews</h3>
            <Link
                to={`/product/${productId}/reviews`}
                className="text-primary hover:text-primary-dark transition duration-300"
            >
                View All Reviews
            </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <ReviewForm productId={productId} onReviewAdded={onNewReview} isLoggedIn={isLoggedIn} />
            </div>
            <div>
                <h4 className="text-xl font-semibold mb-4">Recent Reviews</h4>
                <ReviewsList reviews={reviews} />
                <Link
                    to={`/product/${productId}/reviews`}
                    className="mt-4 inline-block text-primary hover:text-primary-dark transition duration-300">
                    See More Reviews
                </Link>
            </div>
        </div>
    </div>
);

export default ReviewSection;