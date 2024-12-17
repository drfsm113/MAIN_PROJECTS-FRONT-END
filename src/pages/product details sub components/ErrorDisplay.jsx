import React from 'react';

const ErrorDisplay = ({ message }) => (
    <div className="text-center py-10 text-red-500">
        <h2 className="text-xl md:text-2xl font-bold mb-4">Error</h2>
        <p>{message}</p>
    </div>
);

export default ErrorDisplay;