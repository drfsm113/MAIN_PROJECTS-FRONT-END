import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const WishlistIcon = () => {
    // Access wishlist count from Redux store
    const totalWishlistItems = useSelector((state) => state.wishlist.totalItems);

    return (
        <div className="relative">
            {/* Link to wishlist page */}
            <Link to="/wishlist" className="hover:text-primary flex items-center">
                <FaHeart className="mr-1 text-xl" />

                {/* Conditionally display the count badge if there are items in the wishlist */}
                {totalWishlistItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {totalWishlistItems}
                    </span>
                )}
            </Link>
        </div>
    );
};

export default WishlistIcon;
