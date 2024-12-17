import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const CartIcon = () => {
    const totalItems = useSelector(state => state.cart.totalItems);

    return (
        <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl" />
            {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {totalItems}
                </span>
            )}
        </Link>
    );
};

export default CartIcon;