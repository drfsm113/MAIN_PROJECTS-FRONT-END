import React from 'react';
import { motion } from 'framer-motion';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const ContactInfo = ({ icon, title, content }) => (
    <div className="flex items-center mb-6">
        <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <p className="text-gray-600">{content}</p>
        </div>
    </div>
);

const ContactPage = () => {
    return (
        <div className=" min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Get in <span className="text-primary">Touch</span>
                </motion.h2>
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <motion.div
                            className="p-8 md:p-12"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h3>
                            <ContactInfo
                                icon={<faEnvelope className="h-6 w-6 text-primary" />}
                                title="Email"
                                content="info@example.com"
                            />
                            <ContactInfo
                                icon={<faPhone className="h-6 w-6 text-primary" />}
                                title="Phone"
                                content="+1 (555) 123-4567"
                            />
                            <ContactInfo
                                icon={<faMapMarkerAlt className="h-6 w-6 text-primary" />}
                                title="Address"
                                content="123 Main St, City, Country"
                            />
                        </motion.div>
                        <motion.div
                            className="bg-primary p-8 md:p-12 text-white"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
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

export default ContactPage;