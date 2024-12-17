// MagnifyGlass.jsx
import React, { useState, useRef } from 'react';

const MagnifyGlass = ({ imageSrc, magnifierSize = 150, zoomLevel = 2.5 }) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef(null);

    const handleMouseEnter = () => {
        setShowMagnifier(true);
    };

    const handleMouseMove = (e) => {
        if (!imageRef.current) return;

        const { left, top } = imageRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        setShowMagnifier(false);
    };

    const ImageMagnifier = () => {
        const imageStyle = {
            backgroundImage: `url('${imageSrc}')`,
            backgroundSize: `${imageRef.current?.clientWidth * zoomLevel}px ${imageRef.current?.clientHeight * zoomLevel}px`,
            backgroundPositionX: `${-mousePosition.x * zoomLevel + magnifierSize / 2}px`,
            backgroundPositionY: `${-mousePosition.y * zoomLevel + magnifierSize / 2}px`,
            position: 'absolute',
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            border: '2px solid rgba(0, 0, 0, 0.5)',
            borderRadius: '50%',
            pointerEvents: 'none',
            top: `${mousePosition.y - magnifierSize / 2}px`,
            left: `${mousePosition.x - magnifierSize / 2}px`,
            backgroundRepeat: 'no-repeat',
            transition: 'transform 0.2s ease',
            transform: 'scale(1.1)', // Slightly scale the magnifier for a more pronounced effect
        };

        return showMagnifier ? <div style={imageStyle} /> : null;
    };

    return (
        <div
            ref={imageRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ position: 'relative', display: 'inline-block' }}
        >
            <img src={imageSrc} alt="Product" className="w-full h-auto object-cover" />
            <ImageMagnifier />
        </div>
    );
};

export default MagnifyGlass;

// // MagnifyGlass.jsx
// import React, { useState, useRef } from 'react';
//
// const MagnifyGlass = ({ imageSrc }) => {
//     const [showMagnifier, setShowMagnifier] = useState(false);
//     const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//     const imageRef = useRef(null);
//     const magnifierSize = 150;
//     const zoomLevel = 2.5;
//
//     const handleMouseEnter = () => {
//         setShowMagnifier(true);
//     };
//
//     const handleMouseMove = (e) => {
//         if (!imageRef.current) return;
//
//         const { left, top } = imageRef.current.getBoundingClientRect();
//         const x = e.clientX - left;
//         const y = e.clientY - top;
//         setMousePosition({ x, y });
//     };
//
//     const handleMouseLeave = () => {
//         setShowMagnifier(false);
//     };
//
//     const ImageMagnifier = () => {
//         const imageStyle = {
//             backgroundImage: `url('${imageSrc}')`,
//             backgroundSize: `${imageRef.current?.clientWidth * zoomLevel}px ${imageRef.current?.clientHeight * zoomLevel}px`,
//             backgroundPositionX: `${-mousePosition.x * zoomLevel + magnifierSize / 2}px`,
//             backgroundPositionY: `${-mousePosition.y * zoomLevel + magnifierSize / 2}px`,
//             position: 'absolute',
//             width: `${magnifierSize}px`,
//             height: `${magnifierSize}px`,
//             border: '1px solid lightgray',
//             borderRadius: '50%',
//             pointerEvents: 'none',
//             top: `${mousePosition.y - magnifierSize / 2}px`,
//             left: `${mousePosition.x - magnifierSize / 2}px`,
//             backgroundRepeat: 'no-repeat',
//         };
//
//         return showMagnifier ? <div style={imageStyle} /> : null;
//     };
//
//     return (
//         <div
//             ref={imageRef}
//             onMouseEnter={handleMouseEnter}
//             onMouseMove={handleMouseMove}
//             onMouseLeave={handleMouseLeave}
//             style={{ position: 'relative', display: 'inline-block' }}
//         >
//             <img src={imageSrc} alt="Product" className="w-full h-auto object-cover" />
//             <ImageMagnifier />
//         </div>
//     );
// };
//
// export default MagnifyGlass;
