import React from 'react';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-screen">
        <svg
            className="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
            <path
                className="opacity-75"
                fill="none"
                strokeLinecap="round"
                strokeWidth="4"
                d="M4 12a8 8 0 1 1 16 0A8 8 0 0 1 4 12z"
            ></path>
        </svg>
    </div>
);

export default LoadingSpinner;