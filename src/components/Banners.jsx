
import React from 'react';
import { TbTruckDelivery } from 'react-icons/tb';
import { HiOutlineCash, HiOutlineCreditCard } from 'react-icons/hi';

const BannerCard = ({ banner }) => {
    const IconComponent = banner.icon;

    return (
        <div
            className="bg-white rounded-2xl overflow-hidden shadow-lg p-6 flex flex-col items-center transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
            <IconComponent className="h-16 w-16 text-primary mb-4" />
            <h3 className="text-gray-900 text-xl font-bold mb-2">{banner.title}</h3>
            <p className="text-gray-600 text-center">{banner.description}</p>
        </div>
    );
};

const banners = [
    {
        id: 1,
        title: 'Quick Delivery',
        icon: TbTruckDelivery,
        description: 'Get your orders delivered fast and efficiently to your doorstep.'
    },
    {
        id: 2,
        title: 'Cash Payment',
        icon: HiOutlineCash,
        description: 'Convenient cash on delivery option available for all orders.'
    },
    {
        id: 3,
        title: 'Secure Payment',
        icon: HiOutlineCreditCard,
        description: 'Multiple secure payment options for your peace of mind.'
    },
];

const Banners = () => {
    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[50vh]">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
                    Our <span className="text-primary">Features</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {banners.map(banner => (
                        <div key={banner.id} className="flex justify-center items-center">
                            <BannerCard banner={banner} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Banners;
//
// //
// // import React from 'react';
// // import { motion } from 'framer-motion';
// // import { DeliveryDining as TruckIcon, AttachMoney as CashIcon, CreditCard as CreditCardIcon } from '@mui/icons-material';
// //
// // const BannerCard = ({ banner }) => {
// //     const IconComponent = banner.icon;
// //
// //     return (
// //         <motion.div
// //             className="relative bg-white rounded-2xl overflow-hidden shadow-lg p-6 flex flex-col items-center transition-transform duration-300 ripple-container"
// //             whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }} // Elevation effect
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.5 }}
// //             style={{ position: 'relative', overflow: 'hidden' }} // Ensure overflow hidden for ripple
// //         >
// //             <IconComponent className="h-16 w-16 text-primary mb-4" />
// //             <h3 className="text-gray-900 text-xl font-bold mb-2">{banner.title}</h3>
// //             <p className="text-gray-600 text-center">{banner.description}</p>
// //             <div
// //                 className="absolute inset-0 rounded-full"
// //                 style={{
// //                     background: 'radial-gradient(circle, rgba(0, 0, 0, 0.3) 10%, transparent 10%)',
// //                     transform: 'scale(1)',
// //                     transition: 'transform 0.6s, opacity 0.6s',
// //                     opacity: 0
// //                 }}
// //                 // Use internal styles for ripple effect
// //                 onMouseEnter={e => {
// //                     const ripple = e.currentTarget;
// //                     ripple.style.transform = 'scale(0)';
// //                     ripple.style.opacity = 1;
// //                 }}
// //                 onMouseLeave={e => {
// //                     const ripple = e.currentTarget;
// //                     ripple.style.transform = 'scale(1)';
// //                     ripple.style.opacity = 0;
// //                 }}
// //             />
// //         </motion.div>
// //     );
// // };
// //
// // const banners = [
// //     {
// //         id: 1,
// //         title: 'Quick Delivery',
// //         icon: TruckIcon,
// //         description: 'Get your orders delivered fast and efficiently to your doorstep.'
// //     },
// //     {
// //         id: 2,
// //         title: 'Cash Payment',
// //         icon: CashIcon,
// //         description: 'Convenient cash on delivery option available for all orders.'
// //     },
// //     {
// //         id: 3,
// //         title: 'Secure Payment',
// //         icon: CreditCardIcon,
// //         description: 'Multiple secure payment options for your peace of mind.'
// //     },
// // ];
// //
// // const Banners = () => {
// //     return (
// //         <div className="bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[50vh]">
// //             <div className="max-w-6xl mx-auto">
// //                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
// //                     Our <span className="text-primary">Features</span>
// //                 </h2>
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// //                     {banners.map(banner => (
// //                         <div key={banner.id} className="flex justify-center items-center">
// //                             <BannerCard banner={banner} />
// //                         </div>
// //                     ))}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default Banners;
//
// // import React from 'react';
// // import { motion } from 'framer-motion';
// // import { DeliveryDining as TruckIcon, AttachMoney as CashIcon, CreditCard as CreditCardIcon } from '@mui/icons-material';
// //
// // const BannerCard = ({ banner }) => {
// //     const IconComponent = banner.icon;
// //
// //     return (
// //         <motion.div
// //             className="relative bg-white rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 p-6 flex flex-col items-center ripple-effect"
// //             whileHover={{ scale: 1.05 }}
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.5 }}
// //         >
// //             <IconComponent className="h-16 w-16 text-primary mb-4" />
// //             <h3 className="text-gray-900 text-xl font-bold mb-2">{banner.title}</h3>
// //             <p className="text-gray-600 text-center">{banner.description}</p>
// //         </motion.div>
// //     );
// // };
// //
// // const banners = [
// //     {
// //         id: 1,
// //         title: 'Quick Delivery',
// //         icon: TruckIcon,
// //         description: 'Get your orders delivered fast and efficiently to your doorstep.'
// //     },
// //     {
// //         id: 2,
// //         title: 'Cash Payment',
// //         icon: CashIcon,
// //         description: 'Convenient cash on delivery option available for all orders.'
// //     },
// //     {
// //         id: 3,
// //         title: 'Secure Payment',
// //         icon: CreditCardIcon,
// //         description: 'Multiple secure payment options for your peace of mind.'
// //     },
// // ];
// //
// // const Banners = () => {
// //     return (
// //         <div className="bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[50vh]">
// //             <div className="max-w-6xl mx-auto">
// //                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
// //                     Our <span className="text-primary">Features</span>
// //                 </h2>
// //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// //                     {banners.map(banner => (
// //                         <div key={banner.id} className="flex justify-center items-center">
// //                             <BannerCard banner={banner} />
// //                         </div>
// //                     ))}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default Banners;
// //
// // // import React from 'react';
// // // import { motion } from 'framer-motion';
// // // import { DeliveryDining as TruckIcon, AttachMoney as CashIcon, CreditCard as CreditCardIcon } from '@mui/icons-material';
// // //
// // // const BannerCard = ({ banner }) => {
// // //     const IconComponent = banner.icon;
// // //
// // //     return (
// // //         <motion.div
// // //             className="relative bg-white rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 p-6 flex flex-col items-center"
// // //             whileHover={{ scale: 1.05 }}
// // //             initial={{ opacity: 0, y: 20 }}
// // //             animate={{ opacity: 1, y: 0 }}
// // //             transition={{ duration: 0.5 }}
// // //         >
// // //             <IconComponent className="h-16 w-16 text-primary mb-4" />
// // //             <h3 className="text-gray-900 text-xl font-bold mb-2">{banner.title}</h3>
// // //             <p className="text-gray-600 text-center">{banner.description}</p>
// // //         </motion.div>
// // //     );
// // // };
// // //
// // // const banners = [
// // //     {
// // //         id: 1,
// // //         title: 'Quick Delivery',
// // //         icon: TruckIcon,
// // //         description: 'Get your orders delivered fast and efficiently to your doorstep.'
// // //     },
// // //     {
// // //         id: 2,
// // //         title: 'Cash Payment',
// // //         icon: CashIcon,
// // //         description: 'Convenient cash on delivery option available for all orders.'
// // //     },
// // //     {
// // //         id: 3,
// // //         title: 'Secure Payment',
// // //         icon: CreditCardIcon,
// // //         description: 'Multiple secure payment options for your peace of mind.'
// // //     },
// // // ];
// // //
// // // const Banners = () => {
// // //     return (
// // //         <div className="bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[50vh]">
// // //             <div className="max-w-6xl mx-auto">
// // //                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
// // //                     Our <span className="text-primary">Features</span>
// // //                 </h2>
// // //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// // //                     {banners.map(banner => (
// // //                         <div key={banner.id} className="flex justify-center items-center">
// // //                             <BannerCard banner={banner} />
// // //                         </div>
// // //                     ))}
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // };
// // //
// // // export default Banners;
// // //
// // // // import React from 'react';
// // // // import { motion } from 'framer-motion';
// // // // import { DeliveryDining as TruckIcon, AttachMoney as CashIcon, CreditCard as CreditCardIcon } from '@mui/icons-material';
// // // //
// // // // const BannerCard = ({ banner }) => {
// // // //     const IconComponent = banner.icon;
// // // //
// // // //     return (
// // // //         <motion.div
// // // //             className="relative bg-white rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 p-6 flex flex-col items-center"
// // // //             whileHover={{ scale: 1.05 }}
// // // //             initial={{ opacity: 0, y: 20 }}
// // // //             animate={{ opacity: 1, y: 0 }}
// // // //             transition={{ duration: 0.5 }}
// // // //         >
// // // //             <IconComponent className="h-16 w-16 text-primary mb-4" />
// // // //             <h3 className="text-gray-900 text-xl font-bold mb-2">{banner.title}</h3>
// // // //             <p className="text-gray-600 text-center">{banner.description}</p>
// // // //         </motion.div>
// // // //     );
// // // // };
// // // //
// // // // const banners = [
// // // //     {
// // // //         id: 1,
// // // //         title: 'Quick Delivery',
// // // //         icon: TruckIcon,
// // // //         description: 'Get your orders delivered fast and efficiently to your doorstep.'
// // // //     },
// // // //     {
// // // //         id: 2,
// // // //         title: 'Cash Payment',
// // // //         icon: CashIcon,
// // // //         description: 'Convenient cash on delivery option available for all orders.'
// // // //     },
// // // //     {
// // // //         id: 3,
// // // //         title: 'Secure Payment',
// // // //         icon: CreditCardIcon,
// // // //         description: 'Multiple secure payment options for your peace of mind.'
// // // //     },
// // // // ];
// // // //
// // // // const Banners = () => {
// // // //     return (
// // // //         <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
// // // //             <div className="max-w-6xl mx-auto">
// // // //                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
// // // //                     Our <span className="text-primary">Features</span>
// // // //                 </h2>
// // // //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// // // //                     {banners.map(banner => (
// // // //                         <div key={banner.id} className="flex justify-center items-center">
// // // //                             <BannerCard banner={banner} />
// // // //                         </div>
// // // //                     ))}
// // // //                 </div>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // };
// // // //
// // // // export default Banners;
// // // //
// // // // // import React from 'react';
// // // // // import { motion } from 'framer-motion';
// // // // //
// // // // // const BannerCard = ({ banner }) => {
// // // // //     return (
// // // // //         <motion.div
// // // // //             className="relative bg-cover bg-center rounded-2xl overflow-hidden shadow-lg transition-transform duration-300"
// // // // //             style={{ backgroundImage: `url(${banner.image})`, height: '200px' }}
// // // // //             whileHover={{ scale: 1.05 }}
// // // // //             initial={{ opacity: 0, y: 20 }}
// // // // //             animate={{ opacity: 1, y: 0 }}
// // // // //             transition={{ duration: 0.5 }}
// // // // //         >
// // // // //             <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
// // // // //                 <h3 className="text-white text-2xl font-bold">{banner.title}</h3>
// // // // //             </div>
// // // // //         </motion.div>
// // // // //     );
// // // // // };
// // // // //
// // // // //
// // // // // const banners = [
// // // // //     { id: 1, title: 'Quick Delivery', image: 'https://via.placeholder.com/300x200?' },
// // // // //     { id: 2, title: 'Cash Payment', image: 'https://via.placeholder.com/300x200?' },
// // // // //     { id: 3, title: 'Payment', image: 'https://via.placeholder.com/300x200?' },
// // // // // ];
// // // // //
// // // // // const Banners = () => {
// // // // //     return (
// // // // //         <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
// // // // //             <div className="max-w-6xl mx-auto">
// // // // //                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
// // // // //                     Our <span className="text-primary">Features</span>
// // // // //                 </h2>
// // // // //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// // // // //                     {banners.map(banner => (
// // // // //                         <div key={banner.id} className="flex justify-center items-center">
// // // // //                             <BannerCard banner={banner} />
// // // // //                         </div>
// // // // //                     ))}
// // // // //                 </div>
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // };
// // // // //
// // // // // export default Banners;
// // // //
// // // // // =========================
// // // // // import React from 'react';
// // // // // import { motion } from 'framer-motion';
// // // // //
// // // // // const banners = [
// // // // //     { id: 1, title: 'Quick Delivery', image: 'https://via.placeholder.com/300x200?' },
// // // // //     { id: 2, title: 'Cash Payment', image: 'https://via.placeholder.com/300x200?' },
// // // // //     { id: 3, title: 'Payment', image: 'https://via.placeholder.com/300x200?' },
// // // // // ];
// // // // //
// // // // // const BannerCard = ({ banner }) => {
// // // // //     return (
// // // // //         <motion.div
// // // // //             className="relative bg-cover bg-center rounded-2xl overflow-hidden shadow-lg transition-transform duration-300"
// // // // //             style={{ backgroundImage: `url(${banner.image})`, height: '200px' }}
// // // // //             whileHover={{ scale: 1.05 }}
// // // // //             initial={{ opacity: 0, y: 20 }}
// // // // //             animate={{ opacity: 1, y: 0 }}
// // // // //             transition={{ duration: 0.5 }}
// // // // //         >
// // // // //             <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
// // // // //                 <h3 className="text-white text-2xl font-bold">{banner.title}</h3>
// // // // //             </div>
// // // // //         </motion.div>
// // // // //     );
// // // // // };
// // // // //
// // // // // const Banners = () => {
// // // // //     return (
// // // // //         <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
// // // // //             <div className="max-w-6xl mx-auto">
// // // // //                 <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center">
// // // // //                     Our <span className="text-primary">Features</span>
// // // // //                 </h2>
// // // // //                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
// // // // //                     {banners.map(banner => (
// // // // //                         <div className="flex justify-center items-center">
// // // // //                             <BannerCard key={banner.id} banner={banner} />
// // // // //                         </div>
// // // // //                     ))}
// // // // //                 </div>
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // };
// // // // //
// // // // // export default Banners;
