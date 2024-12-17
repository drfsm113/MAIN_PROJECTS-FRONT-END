import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

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

const RatingStars = ({ rating }) => (
    <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
            <span key={star}>
                {star <= rating ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-300" />}
            </span>
        ))}
    </div>
);

export default ReviewsList;