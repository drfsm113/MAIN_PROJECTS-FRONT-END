// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
//
// const FormComponent = ({
//                            title,
//                            fields,
//                            submitHandler,
//                            submitButtonText,
//                            linkText,
//                            linkHref
//                        }) => {
//     const [formData, setFormData] = useState(
//         fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
//     );
//     const [error, setError] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };
//
//     const validateForm = () => {
//         return Object.values(formData).every(value => value !== '');
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         setIsSubmitting(true);
//
//         if (!validateForm()) {
//             setError('Please fill in all fields');
//             setIsSubmitting(false);
//             return;
//         }
//
//         try {
//             console.log(formData);
//             await submitHandler(formData); // Handle async form submission
//         } catch (e) {
//             setError('An error occurred. Please try again.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//
//     return (
//         <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
//             <motion.div
//                 className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8"
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//                     {title}
//                 </h2>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
//                         {fields.map((field, index) => (
//                             <motion.div
//                                 key={field.name}
//                                 initial={{ opacity: 0, y: -30 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                             >
//                                 <label htmlFor={field.name} className="block text-gray-700 font-semibold">
//                                     {field.label}
//                                 </label>
//                                 <input
//                                     id={field.name}
//                                     name={field.name}
//                                     type={field.type}
//                                     placeholder={field.placeholder || ''}
//                                     className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
//                                     value={formData[field.name]}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </motion.div>
//                         ))}
//                     </div>
//
//                     {error && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ duration: 0.3 }}
//                             className="text-red-600 text-sm font-semibold"
//                         >
//                             {error}
//                         </motion.div>
//                     )}
//
//                     <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         <motion.button
//                             type="submit"
//                             className={`w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-150 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             disabled={isSubmitting}
//                         >
//                             {submitButtonText}
//                         </motion.button>
//                     </motion.div>
//                 </form>
//
//                 {linkText && linkHref && (
//                     <div className="mt-6 text-center">
//                         <p className="text-sm text-gray-500">
//                             {linkText}{' '}
//                             <Link to={linkHref} className="text-primary hover:text-primary-dark font-semibold">
//                                 {linkHref}
//                             </Link>
//                         </p>
//                     </div>
//                 )}
//             </motion.div>
//         </div>
//     );
// };
//
// export default FormComponent;
//
// // import React, { useState } from 'react';
// // import { motion } from 'framer-motion';
// // import { Link } from 'react-router-dom';
// //
// // const FormComponent = ({ title, fields, submitHandler, submitButtonText, linkText, linkHref }) => {
// //     const [formData, setFormData] = useState(
// //         fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
// //     );
// //     const [error, setError] = useState('');
// //     const [isSubmitting, setIsSubmitting] = useState(false);
// //
// //     const handleChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData((prev) => ({ ...prev, [name]: value }));
// //     };
// //
// //     const validateForm = () => {
// //         let formIsValid = true;
// //         for (const key in formData) {
// //             if (formData[key] === '') {
// //                 formIsValid = false;
// //                 break;
// //             }
// //         }
// //         return formIsValid;
// //     };
// //
// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setError('');
// //         setIsSubmitting(true);
// //
// //         if (!validateForm()) {
// //             setError('Please fill in all fields');
// //             setIsSubmitting(false);
// //             return;
// //         }
// //
// //         try {
// //             console.log(formData);
// //             await submitHandler(formData); // Handle async form submission
// //         } catch (e) {
// //             setError('An error occurred. Please try again.');
// //         } finally {
// //             setIsSubmitting(false);
// //         }
// //     };
// //
// //     return (
// //         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
// //             <motion.div
// //                 className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
// //                 initial={{ opacity: 0, scale: 0.95 }}
// //                 animate={{ opacity: 1, scale: 1 }}
// //                 transition={{ duration: 0.5 }}
// //             >
// //                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
// //                     {title}
// //                 </h2>
// //                 <form onSubmit={handleSubmit} className="space-y-6">
// //                     {fields.map((field, index) => (
// //                         <motion.div
// //                             key={field.name}
// //                             initial={{ opacity: 0, y: -30 }}
// //                             animate={{ opacity: 1, y: 0 }}
// //                             transition={{ duration: 0.3, delay: index * 0.1 }}
// //                         >
// //                             <label htmlFor={field.name} className="block text-gray-700 font-semibold">
// //                                 {field.label}
// //                             </label>
// //                             <input
// //                                 id={field.name}
// //                                 name={field.name}
// //                                 type={field.type}
// //                                 placeholder={field.placeholder || ''}
// //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// //                                 value={formData[field.name]}
// //                                 onChange={handleChange}
// //                                 required
// //                             />
// //                         </motion.div>
// //                     ))}
// //
// //                     {error && (
// //                         <motion.div
// //                             initial={{ opacity: 0 }}
// //                             animate={{ opacity: 1 }}
// //                             transition={{ duration: 0.3 }}
// //                             className="text-red-600 text-sm font-semibold"
// //                         >
// //                             {error}
// //                         </motion.div>
// //                     )}
// //
// //                     <motion.div
// //                         initial={{ opacity: 0, y: 30 }}
// //                         animate={{ opacity: 1, y: 0 }}
// //                         transition={{ duration: 0.3 }}
// //                     >
// //                         <motion.button
// //                             type="submit"
// //                             className={`w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-150 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
// //                             whileHover={{ scale: 1.05 }}
// //                             whileTap={{ scale: 0.95 }}
// //                             disabled={isSubmitting}
// //                         >
// //                             {submitButtonText}
// //                         </motion.button>
// //                     </motion.div>
// //                 </form>
// //
// //                 {linkText && linkHref && (
// //                     <div className="mt-6 text-center">
// //                         <p className="text-sm text-gray-500">
// //                             {linkText}{' '}
// //                             <Link to={linkHref} className="text-primary hover:text-primary-dark">
// //                                 {linkHref}
// //                             </Link>
// //                         </p>
// //                     </div>
// //                 )}
// //             </motion.div>
// //         </div>
// //     );
// // };
// //
// // export default FormComponent;
//
// // import React, { useState } from 'react';
// // import { motion } from 'framer-motion';
// //
// // const FormComponent = ({ title, fields, submitHandler, submitButtonText, linkText, linkHref }) => {
// //     const [formData, setFormData] = useState(
// //         fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
// //     );
// //     const [error, setError] = useState('');
// //     const [isSubmitting, setIsSubmitting] = useState(false);
// //
// //     const handleChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData((prev) => ({ ...prev, [name]: value }));
// //     };
// //
// //     const validateForm = () => {
// //         let formIsValid = true;
// //         for (const key in formData) {
// //             if (formData[key] === '') {
// //                 formIsValid = false;
// //                 break;
// //             }
// //         }
// //         return formIsValid;
// //     };
// //
// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setError('');
// //         setIsSubmitting(true);
// //
// //         if (!validateForm()) {
// //             setError('Please fill in all fields');
// //             setIsSubmitting(false);
// //             return;
// //         }
// //
// //         try {
// //             console.log(formData);
// //             await submitHandler(formData); // Handle async form submission
// //         } catch (e) {
// //             setError('An error occurred. Please try again.');
// //         } finally {
// //             setIsSubmitting(false);
// //         }
// //     };
// //
// //     return (
// //         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
// //             <motion.div
// //                 className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
// //                 initial={{ opacity: 0, scale: 0.95 }}
// //                 animate={{ opacity: 1, scale: 1 }}
// //                 transition={{ duration: 0.5 }}
// //             >
// //                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
// //                     {title}
// //                 </h2>
// //                 <form onSubmit={handleSubmit} className="space-y-6">
// //                     {fields.map((field, index) => (
// //                         <motion.div
// //                             key={field.name}
// //                             initial={{ opacity: 0, y: -30 }}
// //                             animate={{ opacity: 1, y: 0 }}
// //                             transition={{ duration: 0.3, delay: index * 0.1 }}
// //                         >
// //                             <label htmlFor={field.name} className="block text-gray-700 font-semibold">
// //                                 {field.label}
// //                             </label>
// //                             <input
// //                                 id={field.name}
// //                                 name={field.name}
// //                                 type={field.type}
// //                                 placeholder={field.placeholder || ''}
// //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// //                                 value={formData[field.name]}
// //                                 onChange={handleChange}
// //                                 required
// //                             />
// //                         </motion.div>
// //                     ))}
// //
// //                     {error && (
// //                         <motion.div
// //                             initial={{ opacity: 0 }}
// //                             animate={{ opacity: 1 }}
// //                             transition={{ duration: 0.3 }}
// //                             className="text-red-600 text-sm font-semibold"
// //                         >
// //                             {error}
// //                         </motion.div>
// //                     )}
// //
// //                     <motion.div
// //                         initial={{ opacity: 0, y: 30 }}
// //                         animate={{ opacity: 1, y: 0 }}
// //                         transition={{ duration: 0.3 }}
// //                     >
// //                         <motion.button
// //                             type="submit"
// //                             className={`w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-150 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
// //                             whileHover={{ scale: 1.05 }}
// //                             whileTap={{ scale: 0.95 }}
// //                             disabled={isSubmitting}
// //                         >
// //                             {submitButtonText}
// //                         </motion.button>
// //                     </motion.div>
// //                 </form>
// //
// //                 {linkText && linkHref && (
// //                     <div className="mt-6 text-center">
// //                         <p className="text-sm text-gray-500">
// //                             {linkText}{' '}
// //                             <a href={linkHref} className="text-primary hover:text-primary-dark">
// //                                 {linkHref}
// //                             </a>
// //                         </p>
// //                     </div>
// //                 )}
// //             </motion.div>
// //         </div>
// //     );
// // };
// //
// // export default FormComponent;
//
// // import React, { useState } from 'react';
// // import { motion } from 'framer-motion';
// //
// // const FormComponent = ({ title, fields, submitHandler, submitButtonText, linkText, linkHref }) => {
// //     const [formData, setFormData] = useState(
// //         fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
// //     );
// //     const [error, setError] = useState('');
// //
// //     const handleChange = (e) => {
// //         const { name, value } = e.target;
// //         setFormData((prev) => ({ ...prev, [name]: value }));
// //     };
// //
// //     const handleSubmit = (e) => {
// //         e.preventDefault();
// //         setError('');
// //
// //         if (Object.values(formData).some((value) => !value)) {
// //             setError('Please fill in all fields');
// //             return;
// //         }
// //
// //         console.log(formData);
// //         submitHandler(formData);
// //     };
// //
// //     return (
// //         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
// //             <motion.div
// //                 className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
// //                 initial={{ opacity: 0, scale: 0.95 }}
// //                 animate={{ opacity: 1, scale: 1 }}
// //                 transition={{ duration: 0.5 }}
// //             >
// //                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
// //                     {title}
// //                 </h2>
// //                 <form onSubmit={handleSubmit} className="space-y-6">
// //                     {fields.map((field, index) => (
// //                         <motion.div
// //                             key={field.name}
// //                             initial={{ opacity: 0, y: -30 }}
// //                             animate={{ opacity: 1, y: 0 }}
// //                             transition={{ duration: 0.3, delay: index * 0.1 }}
// //                         >
// //                             <label htmlFor={field.name} className="block text-gray-700 font-semibold">
// //                                 {field.label}
// //                             </label>
// //                             <input
// //                                 id={field.name}
// //                                 name={field.name}
// //                                 type={field.type}
// //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// //                                 value={formData[field.name]}
// //                                 onChange={handleChange}
// //                                 required
// //                             />
// //                         </motion.div>
// //                     ))}
// //
// //                     {error && (
// //                         <motion.div
// //                             initial={{ opacity: 0 }}
// //                             animate={{ opacity: 1 }}
// //                             transition={{ duration: 0.3 }}
// //                             className="text-red-600 text-sm font-semibold"
// //                         >
// //                             {error}
// //                         </motion.div>
// //                     )}
// //
// //                     <motion.div
// //                         initial={{ opacity: 0, y: 30 }}
// //                         animate={{ opacity: 1, y: 0 }}
// //                         transition={{ duration: 0.3 }}
// //                     >
// //                         <motion.button
// //                             type="submit"
// //                             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-150"
// //                             whileHover={{ scale: 1.05 }}
// //                             whileTap={{ scale: 0.95 }}
// //                         >
// //                             {submitButtonText}
// //                         </motion.button>
// //                     </motion.div>
// //                 </form>
// //
// //                 {linkText && linkHref && (
// //                     <div className="mt-6 text-center">
// //                         <p className="text-sm text-gray-500">
// //                             {linkText}{' '}
// //                             <a href={linkHref} className="text-primary hover:text-primary-dark">
// //                                 {linkHref}
// //                             </a>
// //                         </p>
// //                     </div>
// //                 )}
// //             </motion.div>
// //         </div>
// //     );
// // };
// //
// // export default FormComponent;
// //
// // // import React, { useState } from 'react';
// // // import { motion } from 'framer-motion';
// // //
// // // const FormComponent = ({ title, fields, submitHandler, submitButtonText }) => {
// // //     const [formData, setFormData] = useState(
// // //         fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
// // //     );
// // //     const [error, setError] = useState('');
// // //
// // //     const handleChange = (e) => {
// // //         const { name, value } = e.target;
// // //         setFormData((prev) => ({ ...prev, [name]: value }));
// // //     };
// // //
// // //     const handleSubmit = (e) => {
// // //         e.preventDefault();
// // //         setError('');
// // //
// // //         if (Object.values(formData).some((value) => !value)) {
// // //             setError('Please fill in all fields');
// // //             return;
// // //         }
// // //
// // //         console.log(formData);
// // //         submitHandler(formData);
// // //     };
// // //
// // //     return (
// // //         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
// // //             <motion.div
// // //                 className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
// // //                 initial={{ opacity: 0, scale: 0.95 }}
// // //                 animate={{ opacity: 1, scale: 1 }}
// // //                 transition={{ duration: 0.5 }}
// // //             >
// // //                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
// // //                     {title}
// // //                 </h2>
// // //                 <form onSubmit={handleSubmit} className="space-y-6">
// // //                     {fields.map((field, index) => (
// // //                         <motion.div
// // //                             key={field.name}
// // //                             initial={{ opacity: 0, y: -30 }}
// // //                             animate={{ opacity: 1, y: 0 }}
// // //                             transition={{ duration: 0.3, delay: index * 0.1 }}
// // //                         >
// // //                             <label htmlFor={field.name} className="block text-gray-700 font-semibold">
// // //                                 {field.label}
// // //                             </label>
// // //                             <input
// // //                                 id={field.name}
// // //                                 name={field.name}
// // //                                 type={field.type}
// // //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // //                                 value={formData[field.name]}
// // //                                 onChange={handleChange}
// // //                                 required
// // //                             />
// // //                         </motion.div>
// // //                     ))}
// // //
// // //                     {error && (
// // //                         <motion.div
// // //                             initial={{ opacity: 0 }}
// // //                             animate={{ opacity: 1 }}
// // //                             transition={{ duration: 0.3 }}
// // //                             className="text-red-600 text-sm font-semibold"
// // //                         >
// // //                             {error}
// // //                         </motion.div>
// // //                     )}
// // //
// // //                     <motion.div
// // //                         initial={{ opacity: 0, y: 30 }}
// // //                         animate={{ opacity: 1, y: 0 }}
// // //                         transition={{ duration: 0.3 }}
// // //                     >
// // //                         <motion.button
// // //                             type="submit"
// // //                             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-150"
// // //                             whileHover={{ scale: 1.05 }}
// // //                             whileTap={{ scale: 0.95 }}
// // //                         >
// // //                             {submitButtonText}
// // //                         </motion.button>
// // //                     </motion.div>
// // //                 </form>
// // //             </motion.div>
// // //         </div>
// // //     );
// // // };
// // //
// // // export default FormComponent;
