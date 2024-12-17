import React, { useState } from 'react';

const Dropdown = ({ icon, menuItems, title, badgeCount }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className="text-gray-600 hover:text-gray-900 transition-colors duration-200 relative"
            >
                {icon}
                {badgeCount > 0 && (
                    <span className="absolute top-0 right-0 block w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                        {badgeCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                    <div className="p-4 text-primary font-semibold border-b border-gray-200">
                        {title}
                    </div>
                    <ul className="py-1">
                        {menuItems.map((item, index) => (
                            <li key={index} className="hover:bg-gray-100">
                                <a href={item.link} className="block px-4 py-2 text-sm text-gray-700">{item.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
