import React from 'react';
import { motion } from 'framer-motion';

const VariantSelector = ({ product, selectedOptions, onOptionChange }) => (
    <div className="mb-6">
        {product.grouped_options && product.grouped_options.map(option => (
            <div key={option.name} className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{option.name}</h3>
                <div className="flex flex-wrap gap-2">
                    {option.values.map(value => {
                        const isColorOption = option.name.toLowerCase() === 'color';
                        const isColorCode = isColorOption && /^#[0-9A-F]{6}$/i.test(value);

                        if (isColorOption && isColorCode) {
                            return (
                                <ColorOption
                                    key={value}
                                    value={value}
                                    isSelected={selectedOptions[option.name] === value}
                                    onChange={() => onOptionChange(option.name, value)}
                                />
                            );
                        }

                        return (
                            <TextOption
                                key={value}
                                value={value}
                                isSelected={selectedOptions[option.name] === value}
                                onChange={() => onOptionChange(option.name, value)}
                            />
                        );
                    })}
                </div>
            </div>
        ))}
    </div>
);

const ColorOption = ({ value, isSelected, onChange }) => (
    <motion.div
        className="relative"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
    >
        <input
            type="radio"
            id={`color-${value}`}
            name="color"
            value={value}
            checked={isSelected}
            onChange={onChange}
            className="sr-only"
        />
        <label
            htmlFor={`color-${value}`}
            className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center border-2"
            style={{ backgroundColor: value, borderColor: isSelected ? '#000' : 'transparent' }}
        >
            {isSelected && (
                <span className="text-white text-xs">✓</span>
            )}
        </label>
        <span className="sr-only">{value}</span>
    </motion.div>
);

const TextOption = ({ value, isSelected, onChange }) => (
    <motion.button
        onClick={onChange}
        className={`px-3 py-1 md:px-4 md:py-2 rounded text-sm md:text-base ${
            isSelected
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-800'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
    >
        {value}
    </motion.button>
);

export default VariantSelector;