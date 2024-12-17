import React from 'react';

const PriceDisplay = ({ product, selectedVariant }) => (
    <div className="mb-4">
        <span className="text-2xl md:text-3xl font-bold text-primary">
            ${product.is_variant ? (selectedVariant ? selectedVariant.price : product.display_price) : product.display_price}
        </span>
        {parseFloat(product.display_price) < parseFloat(product.base_price) && (
            <span className="ml-2 text-gray-500 line-through">${product.base_price}</span>
        )}
    </div>
);

export default PriceDisplay;