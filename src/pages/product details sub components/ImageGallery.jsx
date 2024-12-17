import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MagnifyGlass from "./MagnifyGlass";

const ImageGallery = ({ images }) => {
    const [currentImage, setCurrentImage] = useState(0);

    return (
        <div className="space-y-4">
            <div className="aspect-w-1 aspect-h-1">
                {images.length > 0 ? (
                    <MagnifyGlass imageSrc={images[currentImage].image} />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p>No image available</p>
                    </div>
                )}
            </div>
            <div className="flex space-x-2 overflow-x-auto">
                {images.map((img, index) => (
                    <motion.img
                        key={img.id}
                        src={img.image}
                        alt={img.alt_text}
                        className={`w-16 h-16 object-cover cursor-pointer rounded-lg ${index === currentImage ? 'border-2 border-primary' : ''}`}
                        onClick={() => setCurrentImage(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageGallery;