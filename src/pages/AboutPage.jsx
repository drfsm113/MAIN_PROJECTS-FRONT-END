import React from 'react';
import { motion } from 'framer-motion';
import { faGem, faHeart, faHandSparkles, faStore } from '@fortawesome/free-solid-svg-icons';

const InfoSection = ({ icon, title, content }) => (
    <div className="flex items-start mb-6">
        <div className="bg-primary bg-opacity-10 p-4 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-600">{content}</p>
        </div>
    </div>
);

const AboutPage = () => {
    return (
        <div className=" min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Discover <span className="text-primary">Our Story</span>
                </motion.h2>
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <motion.div
                            className="p-8 md:p-12"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Legacy</h3>
                            <p className="text-gray-600 mb-6">
                                At [Your Jewelry Brand], we are dedicated to crafting timeless pieces that celebrate the elegance and beauty of jewelry. Our journey began with a passion for fine craftsmanship and has evolved into a legacy of excellence.
                            </p>
                            <InfoSection
                                icon={<faGem className="h-6 w-6 text-primary" />}
                                title="Our Philosophy"
                                content="We believe that every piece of jewelry should tell a story. Our designs blend traditional craftsmanship with modern aesthetics to create stunning pieces that reflect individuality and grace."
                            />
                            <InfoSection
                                icon={<faHeart className="h-6 w-6 text-primary" />}
                                title="Craftsmanship"
                                content="Each item is meticulously crafted by skilled artisans using the finest materials. Our commitment to quality ensures that every piece is a work of art, cherished for generations."
                            />
                            <InfoSection
                                icon={<faHandSparkles className="h-6 w-6 text-primary" />}
                                title="Our Collection"
                                content="Explore our curated collection of exquisite jewelry. From elegant necklaces to dazzling rings, each piece is designed to enhance your beauty and capture your essence."
                            />
                            <InfoSection
                                icon={<faStore className="h-6 w-6 text-primary" />}
                                title="Visit Us"
                                content="Our flagship store offers a luxurious shopping experience where you can see our collections up close. Visit us at [Store Address] or explore our offerings online."
                            />
                        </motion.div>
                        <motion.div
                            className="bg-primary p-8 md:p-12 text-white"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                            <p className="mb-4">We would love to hear from you! For inquiries, appointments, or feedback, please reach out to us through the form below.</p>
                            <form>
                                <div className="mb-4">
                                    <label htmlFor="name" className="block mb-2 font-medium">Name</label>
                                    <input type="text" id="name" className="w-full px-3 py-2 bg-white bg-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block mb-2 font-medium">Email</label>
                                    <input type="email" id="email" className="w-full px-3 py-2 bg-white bg-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white" />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="message" className="block mb-2 font-medium">Message</label>
                                    <textarea id="message" rows="4" className="w-full px-3 py-2 bg-white bg-opacity-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"></textarea>
                                </div>
                                <motion.button
                                    type="submit"
                                    className="bg-white text-primary font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Send Message
                                </motion.button>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
