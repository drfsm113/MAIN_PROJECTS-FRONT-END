import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: FaFacebookF, href: '#' },
        { icon: FaTwitter, href: '#' },
        { icon: FaInstagram, href: '#' },
        { icon: FaPinterest, href: '#' },
    ];

    const footerLinks = [
        { title: 'About Us', href: '#' },
        { title: 'Collections', href: '#' },
        { title: 'Custom Designs', href: '#' },
        { title: 'Care Guide', href: '#' },
        { title: 'FAQs', href: '#' },
        { title: 'Contact', href: '#' },
    ];

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5}}
                        className="space-y-4"
                    >
                        <h3 className="text-2xl font-semibold text-primary">Luxe Jewels</h3>
                        <p className="text-gray-400">
                            Crafting timeless elegance since 1990. Our passion is to create jewelry that becomes a part
                            of your story.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((link, index) => (
                                <motion.a
                                    key={index}
                                    href={link.href}
                                    className="text-gray-400 hover:text-primary transition-colors duration-300"
                                    whileHover={{scale: 1.2}}
                                    whileTap={{scale: 0.9}}
                                >
                                    <link.icon className="w-5 h-5"/>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.2}}
                        className="space-y-4"
                    >
                        <h4 className="text-lg font-semibold text-primary">Quick Links</h4>
                        <ul className="space-y-2">
                            {footerLinks.map((link, index) => (
                                <motion.li key={index} whileHover={{x: 5}}
                                           transition={{type: 'spring', stiffness: 300}}>
                                    <a href={link.href}
                                       className="text-gray-400 hover:text-primary transition-colors duration-300">
                                        {link.title}
                                    </a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.5, delay: 0.4}}
                        className="space-y-4"
                    >
                        <h4 className="text-lg font-semibold text-primary">Newsletter</h4>
                        <p className="text-gray-400">Stay updated with our latest collections and exclusive offers.</p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="w-full bg-gray-800 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <motion.button
                                whileHover={{scale: 1.05}}
                                whileTap={{scale: 0.95}}
                                className="w-full bg-primary text-black py-2 px-4 rounded-md hover:bg-primary-dark transition-colors duration-300"
                            >
                                Subscribe
                            </motion.button>
                        </form>
                    </motion.div>
                </div>

                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.5, delay: 0.6}}
                    className="mt-12 pt-8 border-t border-gray-800 text-center"
                >
                    <p className="text-gray-400">
                        &copy; {currentYear} Luxe Jewels. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
// import React from 'react';
// import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';
// import { motion } from 'framer-motion';
//
// const Footer = () => {
//     const currentYear = new Date().getFullYear();
//
//     const socialLinks = [
//         { icon: FaFacebookF, href: '#' },
//         { icon: FaTwitter, href: '#' },
//         { icon: FaInstagram, href: '#' },
//         { icon: FaPinterest, href: '#' },
//     ];
//
//     const footerLinks = [
//         { title: 'About Us', href: '#' },
//         { title: 'Collections', href: '#' },
//         { title: 'Custom Designs', href: '#' },
//         { title: 'Care Guide', href: '#' },
//         { title: 'FAQs', href: '#' },
//         { title: 'Contact', href: '#' },
//     ];
//
//     return (
//         <footer className="bg-gray-900 text-white">
//             <div className="max-w-3xl mx-auto px-2 sm:px-6 lg:px-8 py-12">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <h3 className="text-2xl font-semibold mb-4 text-primary">Luxe Jewels</h3>
//                         <p className="text-gray-400 mb-4">
//                             Crafting timeless elegance since 1990. Our passion is to create jewelry that becomes a part of your story.
//                         </p>
//                         <div className="flex space-x-8">
//                             {socialLinks.map((link, index) => (
//                                 <motion.a
//                                     key={index}
//                                     href={link.href}
//                                     className="text-gray-400 hover:text-primary transition-colors duration-300"
//                                     whileHover={{ scale: 1.2 }}
//                                     whileTap={{ scale: 0.9 }}
//                                 >
//                                     <link.icon className="w-5 h-5" />
//                                 </motion.a>
//                             ))}
//                         </div>
//                     </motion.div>
//
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.2 }}
//                     >
//                         <h4 className="text-lg font-semibold mb-4 text-primary">Quick Links</h4>
//                         <ul className="space-y-2 ">
//                             {footerLinks.map((link, index) => (
//                                 <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
//                                     <a href={link.href} className="text-gray-400 hover:text-primary transition-colors duration-300">
//                                         {link.title}
//                                     </a>
//                                 </motion.li>
//                             ))}
//                         </ul>
//                     </motion.div>
//
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.4 }}
//                     >
//                         <h4 className="text-lg font-semibold mb-4 text-primary">Newsletter</h4>
//                         <p className="text-gray-400 mb-4">Stay updated with our latest collections and exclusive offers.</p>
//                         <form className="flex flex-col sm:flex-row">
//                             <input
//                                 type="email"
//                                 placeholder="Your email"
//                                 className="bg-gray-800 text-white py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary space-x-10 mb-2 sm:mb-0"
//                             />
//                             <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 className="bg-primary text-black py-2 rounded-r-md hover:bg-primary-dark transition-colors duration-300"
//                             >
//                                 Subscribe
//                             </motion.button>
//                         </form>
//                     </motion.div>
//                 </div>
//
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.6 }}
//                     className="mt-8 pt-8 border-t border-gray-800 text-center"
//                 >
//                     <p className="text-gray-400">
//                         &copy; {currentYear} Luxe Jewels. All rights reserved.
//                     </p>
//                 </motion.div>
//             </div>
//         </footer>
//     );
// };
//
// export default Footer;

// import React from 'react';
// import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';
// import { motion } from 'framer-motion';
//
// const Footer = () => {
//     const currentYear = new Date().getFullYear();
//
//     const socialLinks = [
//         { icon: FaFacebookF, href: '#' },
//         { icon: FaTwitter, href: '#' },
//         { icon: FaInstagram, href: '#' },
//         { icon: FaPinterest, href: '#' },
//     ];
//
//     const footerLinks = [
//         { title: 'About Us', href: '#' },
//         { title: 'Collections', href: '#' },
//         { title: 'Custom Designs', href: '#' },
//         { title: 'Care Guide', href: '#' },
//         { title: 'FAQs', href: '#' },
//         { title: 'Contact', href: '#' },
//     ];
//
//     return (
//         <footer className="bg-gray-900 text-white">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <h3 className="text-2xl font-semibold mb-4 text-primary">Luxe Jewels</h3>
//                         <p className="text-gray-400 mb-4">
//                             Crafting timeless elegance since 1990. Our passion is to create jewelry that becomes a part of your story.
//                         </p>
//                         <div className="flex space-x-4">
//                             {socialLinks.map((link, index) => (
//                                 <motion.a
//                                     key={index}
//                                     href={link.href}
//                                     className="text-gray-400 hover:text-primary transition-colors duration-300"
//                                     whileHover={{ scale: 1.2 }}
//                                     whileTap={{ scale: 0.9 }}
//                                 >
//                                     <link.icon className="w-5 h-5" />
//                                 </motion.a>
//                             ))}
//                         </div>
//                     </motion.div>
//
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.2 }}
//                     >
//                         <h4 className="text-lg font-semibold mb-4 text-primary">Quick Links</h4>
//                         <ul className="space-y-2">
//                             {footerLinks.map((link, index) => (
//                                 <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
//                                     <a href={link.href} className="text-gray-400 hover:text-primary transition-colors duration-300">
//                                         {link.title}
//                                     </a>
//                                 </motion.li>
//                             ))}
//                         </ul>
//                     </motion.div>
//
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.4 }}
//                     >
//                         <h4 className="text-lg font-semibold mb-4 text-primary">Newsletter</h4>
//                         <p className="text-gray-400 mb-4">Stay updated with our latest collections and exclusive offers.</p>
//                         <form className="flex flex-col sm:flex-row">
//                             <input
//                                 type="email"
//                                 placeholder="Your email"
//                                 className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary mb-2 sm:mb-0"
//                             />
//                             <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 className="bg-primary text-black px-4 py-2 rounded-r-md hover:bg-primary-dark transition-colors duration-300"
//                             >
//                                 Subscribe
//                             </motion.button>
//                         </form>
//                     </motion.div>
//                 </div>
//
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.6 }}
//                     className="mt-8 pt-8 border-t border-gray-800 text-center"
//                 >
//                     <p className="text-gray-400">
//                         &copy; {currentYear} Luxe Jewels. All rights reserved.
//                     </p>
//                 </motion.div>
//             </div>
//         </footer>
//     );
// };
//
// export default Footer;

// import React from 'react';
// import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';
// import { motion } from 'framer-motion';
//
// const Footer = () => {
//     const currentYear = new Date().getFullYear();
//
//     const socialLinks = [
//         { icon: FaFacebookF, href: '#' },
//         { icon: FaTwitter, href: '#' },
//         { icon: FaInstagram, href: '#' },
//         { icon: FaPinterest, href: '#' },
//     ];
//
//     const footerLinks = [
//         { title: 'About Us', href: '#' },
//         { title: 'Collections', href: '#' },
//         { title: 'Custom Designs', href: '#' },
//         { title: 'Care Guide', href: '#' },
//         { title: 'FAQs', href: '#' },
//         { title: 'Contact', href: '#' },
//     ];
//
//     return (
//         <footer className="bg-dark-blue text-light-gold">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <h3 className="text-2xl font-semibold mb-4">Luxe Jewels</h3>
//                         <p className="text-light-gray mb-4">
//                             Crafting timeless elegance since 1990. Our passion is to create jewelry that becomes a part of your story.
//                         </p>
//                         <div className="flex space-x-4">
//                             {socialLinks.map((link, index) => (
//                                 <motion.a
//                                     key={index}
//                                     href={link.href}
//                                     className="text-light-gray hover:text-light-gold transition-colors duration-300"
//                                     whileHover={{ scale: 1.2 }}
//                                     whileTap={{ scale: 0.9 }}
//                                 >
//                                     <link.icon className="w-5 h-5" />
//                                 </motion.a>
//                             ))}
//                         </div>
//                     </motion.div>
//
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.2 }}
//                     >
//                         <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
//                         <ul className="space-y-2">
//                             {footerLinks.map((link, index) => (
//                                 <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
//                                     <a href={link.href} className="text-light-gray hover:text-light-gold transition-colors duration-300">
//                                         {link.title}
//                                     </a>
//                                 </motion.li>
//                             ))}
//                         </ul>
//                     </motion.div>
//
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.4 }}
//                     >
//                         <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
//                         <p className="text-light-gray mb-4">Stay updated with our latest collections and exclusive offers.</p>
//                         <form className="flex flex-col sm:flex-row">
//                             <input
//                                 type="email"
//                                 placeholder="Your email"
//                                 className="bg-dark-blue text-light-gold px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-light-gold mb-2 sm:mb-0"
//                             />
//                             <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 className="bg-light-gold text-dark-blue px-4 py-2 rounded-r-md hover:bg-dark-gold transition-colors duration-300"
//                             >
//                                 Subscribe
//                             </motion.button>
//                         </form>
//                     </motion.div>
//                 </div>
//
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.6 }}
//                     className="mt-8 pt-8 border-t border-gray-800 text-center"
//                 >
//                     <p className="text-light-gray">
//                         &copy; {currentYear} Luxe Jewels. All rights reserved.
//                     </p>
//                 </motion.div>
//             </div>
//         </footer>
//     );
// };
//
// export default Footer;

// import React from 'react';
// import { FaFacebookF, FaTwitter, FaInstagram, FaPinterest } from 'react-icons/fa';
// import { motion } from 'framer-motion';
//
// const Footer = () => {
//     const currentYear = new Date().getFullYear();
//
//     const socialLinks = [
//         { icon: FaFacebookF, href: '#' },
//         { icon: FaTwitter, href: '#' },
//         { icon: FaInstagram, href: '#' },
//         { icon: FaPinterest, href: '#' },
//     ];
//
//     const footerLinks = [
//         { title: 'About Us', href: '#' },
//         { title: 'Collections', href: '#' },
//         { title: 'Custom Designs', href: '#' },
//         { title: 'Care Guide', href: '#' },
//         { title: 'FAQs', href: '#' },
//         { title: 'Contact', href: '#' },
//     ];
//
//     return (
//         <footer className="bg-gray-900 text-white">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <h3 className="text-2xl font-semibold mb-4">Luxe Jewels</h3>
//                         <p className="text-gray-400 mb-4">
//                             Crafting timeless elegance since 1990. Our passion is to create jewelry that becomes a part of your story.
//                         </p>
//                         <div className="flex space-x-4">
//                             {socialLinks.map((link, index) => (
//                                 <motion.a
//                                     key={index}
//                                     href={link.href}
//                                     className="text-gray-400 hover:text-white transition-colors duration-300"
//                                     whileHover={{ scale: 1.2 }}
//                                     whileTap={{ scale: 0.9 }}
//                                 >
//                                     <link.icon className="w-5 h-5" />
//                                 </motion.a>
//                             ))}
//                         </div>
//                     </motion.div>
//
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.2 }}
//                     >
//                         <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
//                         <ul className="space-y-2">
//                             {footerLinks.map((link, index) => (
//                                 <motion.li key={index} whileHover={{ x: 5 }} transition={{ type: 'spring', stiffness: 300 }}>
//                                     <a href={link.href} className="text-gray-400 hover:text-white transition-colors duration-300">
//                                         {link.title}
//                                     </a>
//                                 </motion.li>
//                             ))}
//                         </ul>
//                     </motion.div>
//
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.5, delay: 0.4 }}
//                     >
//                         <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
//                         <p className="text-gray-400 mb-4">Stay updated with our latest collections and exclusive offers.</p>
//                         <form className="flex flex-col sm:flex-row">
//                             <input
//                                 type="email"
//                                 placeholder="Your email"
//                                 className="bg-gray-800 text-white px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gold-500 mb-2 sm:mb-0"
//                             />
//                             <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 className="bg-gold-500 text-black px-4 py-2 rounded-r-md hover:bg-gold-600 transition-colors duration-300"
//                             >
//                                 Subscribe
//                             </motion.button>
//                         </form>
//                     </motion.div>
//                 </div>
//
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ duration: 0.5, delay: 0.6 }}
//                     className="mt-8 pt-8 border-t border-gray-800 text-center"
//                 >
//                     <p className="text-gray-400">
//                         &copy; {currentYear} Luxe Jewels. All rights reserved.
//                     </p>
//                 </motion.div>
//             </div>
//         </footer>
//     );
// };
//
// export default Footer;