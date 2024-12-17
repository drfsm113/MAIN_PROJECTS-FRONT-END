import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const CommonLink = ({
                        to,
                        children,
                        className = '',
                        icon = null, // Default to null if no icon is provided
                        exact = false,
                        activeClassName = 'text-gold border-b-2 border-gold',
                        ...props
                    }) => {
    const location = useLocation();
    const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

    return (
        <Link
            to={to}
            className={`flex items-center p-3 rounded-lg transition-shadow duration-300 ease-in-out
        ${isActive ? activeClassName : 'text-gray-700'}
        ${className} 
        hover:text-gold hover:shadow-lg`}
            {...props}
        >
            {icon && <span className="mr-2 text-xl transition-transform duration-300 ease-in-out transform hover:scale-105">{icon}</span>}
            <span className="font-medium transition-colors duration-300 ease-in-out">{children}</span>
        </Link>
    );
};

export default CommonLink;
