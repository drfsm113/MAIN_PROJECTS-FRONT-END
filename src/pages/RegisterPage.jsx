import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserService from "../Services/UserService";

const RegisterPage = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{10}$/; // Assumes a 10-digit phone number
        return phoneRegex.test(phone);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validatePhone(phone)) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        if (firstName && lastName && email && phone && password) {
            try {
                const response = await UserService.register({
                    email,
                    password,
                    first_name: firstName,
                    last_name: lastName,
                    phone_number: phone
                });
                console.log('Registration successful:', response);
                navigate('/login');
            } catch (error) {
                setError(error.response?.data?.message || 'Registration failed. Please try again.');
            }
        } else {
            setError('Please fill in all fields');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
                    Create <span className="text-primary">Your Account</span>
                </h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <input
                                id="firstName"
                                placeholder="First Name"
                                type="text"
                                className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                            <input
                                id="lastName"
                                placeholder="Last Name"
                                type="text"
                                className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email Address"
                                className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="Phone Number (10 digits)"
                                className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </motion.div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-red-600 text-sm font-semibold"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }}>
                        <motion.button
                            type="submit"
                            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Register
                        </motion.button>
                    </motion.div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:text-primary-dark">
                            Log In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
// ====================design bewllow only=========
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
//
// const RegisterPage = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [phone, setPhone] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();
//
//     const handleRegister = (e) => {
//         e.preventDefault();
//         setError('');
//
//         if (password !== confirmPassword) {
//             setError('Passwords do not match');
//             return;
//         }
//
//         if (name && email && phone && password) {
//             // Perform registration logic here
//             navigate('/login');
//         } else {
//             setError('Please fill in all fields');
//         }
//     };
//
//     return (
//         <div className="min-h-screen flex items-center justify-center">
//             <motion.div
//                 className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8"
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
//                     Create<span  className="text-primary">Your Account</span>
//                 </h2>
//                 <form onSubmit={handleRegister} className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                         {/* Name Input */}
//                         <motion.div
//                             initial={{ opacity: 0, y: -30 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3 }}
//                         >
//                             {/*<label htmlFor="name" className="block text-gray-700 font-semibold">*/}
//                             {/*    Full Name*/}
//                             {/*</label>*/}
//                             <input
//                                 id="name"
//                                 placeholder="Full Name"
//                                 type="text"
//                                 className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                                 value={name}
//                                 onChange={(e) => setName(e.target.value)}
//                                 required
//                             />
//                         </motion.div>
//
//                         {/* Email Input */}
//                         <motion.div
//                             initial={{ opacity: 0, y: -30 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3, delay: 0.1 }}
//                         >
//                             {/*<label htmlFor="email" className="block text-gray-700 font-semibold">*/}
//                             {/*    Email Address*/}
//                             {/*</label>*/}
//                             <input
//                                 id="email"
//                                 type="email"
//                                 placeholder="Email Address"
//                                 className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                             />
//                         </motion.div>
//
//                         {/* Phone Input */}
//                         <motion.div
//                             initial={{ opacity: 0, y: -30 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3, delay: 0.2 }}
//                         >
//                             {/*<label htmlFor="phone" className="block text-gray-700 font-semibold">*/}
//                             {/*    Phone Number*/}
//                             {/*</label>*/}
//                             <input
//                                 id="phone"
//                                 type="tel"
//                                 placeholder="Phone Number"
//                                 className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                                 value={phone}
//                                 onChange={(e) => setPhone(e.target.value)}
//                                 required
//                             />
//                         </motion.div>
//
//                         {/* Password Input */}
//                         <motion.div
//                             initial={{ opacity: 0, y: -30 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3, delay: 0.3 }}
//                         >
//                             {/*<label htmlFor="password" className="block text-gray-700 font-semibold">*/}
//                             {/*    Password*/}
//                             {/*</label>*/}
//                             <input
//                                 id="password"
//                                 type="password"
//                                 placeholder="Password"
//                                 className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                             />
//                         </motion.div>
//
//                         {/* Confirm Password Input */}
//                         <motion.div
//                             initial={{ opacity: 0, y: -30 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.3, delay: 0.4 }}
//                         >
//                             {/*<label htmlFor="confirmPassword" className="block text-gray-700 font-semibold">*/}
//                             {/*    Confirm Password*/}
//                             {/*</label>*/}
//                             <input
//                                 id="confirmPassword"
//                                 type="password"
//                                 placeholder="Confirm Password"
//                                 className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 required
//                             />
//                         </motion.div>
//                     </div>
//
//                     {/* Error Message */}
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
//                     {/* Register Button */}
//                     <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.5 }}
//                     >
//                         <motion.button
//                             type="submit"
//                             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-200"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                         >
//                             Register
//                         </motion.button>
//                     </motion.div>
//                 </form>
//
//                 {/* Links */}
//                 <div className="mt-6 text-center">
//                     <p className="text-sm text-gray-600">
//                         Already have an account?{' '}
//                         <Link to="/login" className="text-primary hover:text-primary-dark">
//                             Log In
//                         </Link>
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };
//
// export default RegisterPage;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
//
// const RegisterPage = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [phone, setPhone] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();
//
//     const handleRegister = (e) => {
//         e.preventDefault();
//         setError('');
//
//         if (password !== confirmPassword) {
//             setError('Passwords do not match');
//             return;
//         }
//
//         if (name && email && phone && password) {
//             // Perform registration logic here
//             navigate('/login');
//         } else {
//             setError('Please fill in all fields');
//         }
//     };
//
//     return (
//         <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//             <motion.div
//                 className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
//                 initial={{ opacity: 0, scale: 0.95 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
//                     Create Your Account
//                 </h2>
//                 <form onSubmit={handleRegister} className="space-y-6">
//                     {/* Name Input */}
//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         <label htmlFor="name" className="block text-gray-700 font-semibold">
//                             Full Name
//                         </label>
//                         <input
//                             id="name"
//                             type="text"
//                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             required
//                         />
//                     </motion.div>
//
//                     {/* Email Input */}
//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.1 }}
//                     >
//                         <label htmlFor="email" className="block text-gray-700 font-semibold">
//                             Email Address
//                         </label>
//                         <input
//                             id="email"
//                             type="email"
//                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                         />
//                     </motion.div>
//
//                     {/* Phone Input */}
//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.2 }}
//                     >
//                         <label htmlFor="phone" className="block text-gray-700 font-semibold">
//                             Phone Number
//                         </label>
//                         <input
//                             id="phone"
//                             type="tel"
//                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                             value={phone}
//                             onChange={(e) => setPhone(e.target.value)}
//                             required
//                         />
//                     </motion.div>
//
//                     {/* Password Input */}
//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.3 }}
//                     >
//                         <label htmlFor="password" className="block text-gray-700 font-semibold">
//                             Password
//                         </label>
//                         <input
//                             id="password"
//                             type="password"
//                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </motion.div>
//
//                     {/* Confirm Password Input */}
//                     <motion.div
//                         initial={{ opacity: 0, y: -30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.4 }}
//                     >
//                         <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold">
//                             Confirm Password
//                         </label>
//                         <input
//                             id="confirmPassword"
//                             type="password"
//                             className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             required
//                         />
//                     </motion.div>
//
//                     {/* Error Message */}
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
//                     {/* Register Button */}
//                     <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: 0.5 }}
//                     >
//                         <motion.button
//                             type="submit"
//                             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-200"
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                         >
//                             Register
//                         </motion.button>
//                     </motion.div>
//                 </form>
//
//                 {/* Links */}
//                 <div className="mt-6 text-center">
//                     <p className="text-sm text-gray-600">
//                         Already have an account?{' '}
//                         <Link to="/login" className="text-primary hover:text-primary-dark">
//                             Log In
//                         </Link>
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };
//
// export default RegisterPage;
//
// // import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import FormComponent from "../components/FormComponent";
// //
// // const RegisterPage = () => {
// //     const navigate = useNavigate();
// //
// //     const handleRegister = (formData) => {
// //         // Handle registration logic here
// //         console.log('Register Data:', formData);
// //         navigate('/login'); // Redirect to login page after registration
// //     };
// //
// //     const fields = [
// //         { name: 'name', label: 'Full Name', type: 'text' },
// //         { name: 'email', label: 'Email Address', type: 'email' },
// //         // { name: 'phone', label: 'Phone Number', type: 'tel' },
// //         { name: 'password', label: 'Password', type: 'password' },
// //         { name: 'confirmPassword', label: 'Confirm Password', type: 'password' }
// //     ];
// //
// //     return (
// //         <FormComponent
// //             title="Create Your Account"
// //             fields={fields}
// //             submitHandler={handleRegister}
// //             submitButtonText="Register"
// //             linkText="Already have an account?"
// //             linkHref="/login"
// //         />
// //     );
// // };
// //
// // export default RegisterPage;
// //
// // // import React from 'react';
// // // import { Link, useNavigate } from 'react-router-dom';
// // // import FormComponent from "../components/FormComponent";
// // //
// // // const RegisterPage = () => {
// // //     const navigate = useNavigate();
// // //
// // //     const handleRegister = (formData) => {
// // //         // Handle registration logic here
// // //         console.log('Register Data:', formData);
// // //         navigate('/login'); // Redirect to login page after registration
// // //     };
// // //
// // //     const fields = [
// // //         { name: 'name', label: 'Full Name', type: 'text' },
// // //         { name: 'email', label: 'Email Address', type: 'email' },
// // //         { name: 'phone', label: 'Phone Number', type: 'tel' },
// // //         { name: 'password', label: 'Password', type: 'password' },
// // //         { name: 'confirmPassword', label: 'Confirm Password', type: 'password' }
// // //     ];
// // //
// // //     return (
// // //         <FormComponent
// // //             title="Create Your Account"
// // //             fields={fields}
// // //             submitHandler={handleRegister}
// // //             submitButtonText="Register"
// // //         />
// // //     );
// // // };
// // //
// // // export default RegisterPage;
// // //
// // // // import React, { useState } from 'react';
// // // // import { Link, useNavigate } from 'react-router-dom';
// // // // import { motion } from 'framer-motion';
// // // //
// // // // const RegisterPage = () => {
// // // //     const [name, setName] = useState('');
// // // //     const [email, setEmail] = useState('');
// // // //     const [phone, setPhone] = useState('');
// // // //     const [password, setPassword] = useState('');
// // // //     const [confirmPassword, setConfirmPassword] = useState('');
// // // //     const [error, setError] = useState('');
// // // //     const navigate = useNavigate();
// // // //
// // // //     const handleRegister = (e) => {
// // // //         e.preventDefault();
// // // //         setError('');
// // // //
// // // //         if (password !== confirmPassword) {
// // // //             setError('Passwords do not match');
// // // //             return;
// // // //         }
// // // //
// // // //         if (name && email && phone && password) {
// // // //             // Perform registration logic here
// // // //             navigate('/login');
// // // //         } else {
// // // //             setError('Please fill in all fields');
// // // //         }
// // // //     };
// // // //
// // // //     return (
// // // //         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
// // // //             <motion.div
// // // //                 className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
// // // //                 initial={{ opacity: 0, scale: 0.95 }}
// // // //                 animate={{ opacity: 1, scale: 1 }}
// // // //                 transition={{ duration: 0.5 }}
// // // //             >
// // // //                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
// // // //                     Create Your Account
// // // //                 </h2>
// // // //                 <form onSubmit={handleRegister} className="space-y-6">
// // // //                     {/* Name Input */}
// // // //                     <motion.div
// // // //                         initial={{ opacity: 0, y: -30 }}
// // // //                         animate={{ opacity: 1, y: 0 }}
// // // //                         transition={{ duration: 0.3 }}
// // // //                     >
// // // //                         <label htmlFor="name" className="block text-gray-700 font-semibold">
// // // //                             Full Name
// // // //                         </label>
// // // //                         <input
// // // //                             id="name"
// // // //                             type="text"
// // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // //                             value={name}
// // // //                             onChange={(e) => setName(e.target.value)}
// // // //                             required
// // // //                         />
// // // //                     </motion.div>
// // // //
// // // //                     {/* Email Input */}
// // // //                     <motion.div
// // // //                         initial={{ opacity: 0, y: -30 }}
// // // //                         animate={{ opacity: 1, y: 0 }}
// // // //                         transition={{ duration: 0.3, delay: 0.1 }}
// // // //                     >
// // // //                         <label htmlFor="email" className="block text-gray-700 font-semibold">
// // // //                             Email Address
// // // //                         </label>
// // // //                         <input
// // // //                             id="email"
// // // //                             type="email"
// // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // //                             value={email}
// // // //                             onChange={(e) => setEmail(e.target.value)}
// // // //                             required
// // // //                         />
// // // //                     </motion.div>
// // // //
// // // //                     {/* Phone Input */}
// // // //                     <motion.div
// // // //                         initial={{ opacity: 0, y: -30 }}
// // // //                         animate={{ opacity: 1, y: 0 }}
// // // //                         transition={{ duration: 0.3, delay: 0.2 }}
// // // //                     >
// // // //                         <label htmlFor="phone" className="block text-gray-700 font-semibold">
// // // //                             Phone Number
// // // //                         </label>
// // // //                         <input
// // // //                             id="phone"
// // // //                             type="tel"
// // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // //                             value={phone}
// // // //                             onChange={(e) => setPhone(e.target.value)}
// // // //                             required
// // // //                         />
// // // //                     </motion.div>
// // // //
// // // //                     {/* Password Input */}
// // // //                     <motion.div
// // // //                         initial={{ opacity: 0, y: -30 }}
// // // //                         animate={{ opacity: 1, y: 0 }}
// // // //                         transition={{ duration: 0.3, delay: 0.3 }}
// // // //                     >
// // // //                         <label htmlFor="password" className="block text-gray-700 font-semibold">
// // // //                             Password
// // // //                         </label>
// // // //                         <input
// // // //                             id="password"
// // // //                             type="password"
// // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // //                             value={password}
// // // //                             onChange={(e) => setPassword(e.target.value)}
// // // //                             required
// // // //                         />
// // // //                     </motion.div>
// // // //
// // // //                     {/* Confirm Password Input */}
// // // //                     <motion.div
// // // //                         initial={{ opacity: 0, y: -30 }}
// // // //                         animate={{ opacity: 1, y: 0 }}
// // // //                         transition={{ duration: 0.3, delay: 0.4 }}
// // // //                     >
// // // //                         <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold">
// // // //                             Confirm Password
// // // //                         </label>
// // // //                         <input
// // // //                             id="confirmPassword"
// // // //                             type="password"
// // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // //                             value={confirmPassword}
// // // //                             onChange={(e) => setConfirmPassword(e.target.value)}
// // // //                             required
// // // //                         />
// // // //                     </motion.div>
// // // //
// // // //                     {/* Error Message */}
// // // //                     {error && (
// // // //                         <motion.div
// // // //                             initial={{ opacity: 0 }}
// // // //                             animate={{ opacity: 1 }}
// // // //                             transition={{ duration: 0.3 }}
// // // //                             className="text-red-600 text-sm font-semibold"
// // // //                         >
// // // //                             {error}
// // // //                         </motion.div>
// // // //                     )}
// // // //
// // // //                     {/* Register Button */}
// // // //                     <motion.div
// // // //                         initial={{ opacity: 0, y: 30 }}
// // // //                         animate={{ opacity: 1, y: 0 }}
// // // //                         transition={{ duration: 0.3, delay: 0.5 }}
// // // //                     >
// // // //                         <motion.button
// // // //                             type="submit"
// // // //                             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-150"
// // // //                             whileHover={{ scale: 1.05 }}
// // // //                             whileTap={{ scale: 0.95 }}
// // // //                         >
// // // //                             Register
// // // //                         </motion.button>
// // // //                     </motion.div>
// // // //                 </form>
// // // //
// // // //                 {/* Links */}
// // // //                 <div className="mt-6 text-center">
// // // //                     <p className="text-sm text-gray-500">
// // // //                         Already have an account?{' '}
// // // //                         <Link to="/login" className="text-primary hover:text-primary-dark">
// // // //                             Log In
// // // //                         </Link>
// // // //                     </p>
// // // //                 </div>
// // // //             </motion.div>
// // // //         </div>
// // // //     );
// // // // };
// // // //
// // // // export default RegisterPage;
// // // //
// // // // // import React, { useState } from 'react';
// // // // // import { Link, useNavigate } from 'react-router-dom';
// // // // // import { motion } from 'framer-motion';
// // // // //
// // // // // const RegisterPage = () => {
// // // // //     const [name, setName] = useState('');
// // // // //     const [email, setEmail] = useState('');
// // // // //     const [phone, setPhone] = useState('');
// // // // //     const [password, setPassword] = useState('');
// // // // //     const [confirmPassword, setConfirmPassword] = useState('');
// // // // //     const [error, setError] = useState('');
// // // // //     const navigate = useNavigate();
// // // // //
// // // // //     const handleRegister = (e) => {
// // // // //         e.preventDefault();
// // // // //         setError('');
// // // // //
// // // // //         if (password !== confirmPassword) {
// // // // //             setError('Passwords do not match');
// // // // //             return;
// // // // //         }
// // // // //
// // // // //         if (name && email && phone && password) {
// // // // //             // Perform registration logic here
// // // // //             navigate('/login');
// // // // //         } else {
// // // // //             setError('Please fill in all fields');
// // // // //         }
// // // // //     };
// // // // //
// // // // //     return (
// // // // //         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
// // // // //             <motion.div
// // // // //                 className="w-full max-w-md bg-white rounded-lg shadow-lg p-8"
// // // // //                 initial={{ opacity: 0, scale: 0.95 }}
// // // // //                 animate={{ opacity: 1, scale: 1 }}
// // // // //                 transition={{ duration: 0.5 }}
// // // // //             >
// // // // //                 <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
// // // // //                     Create Your Account
// // // // //                 </h2>
// // // // //                 <form onSubmit={handleRegister} className="space-y-6">
// // // // //                     {/* Name Input */}
// // // // //                     <motion.div
// // // // //                         initial={{ opacity: 0, y: -30 }}
// // // // //                         animate={{ opacity: 1, y: 0 }}
// // // // //                         transition={{ duration: 0.3 }}
// // // // //                     >
// // // // //                         <label htmlFor="name" className="block text-gray-700 font-semibold">
// // // // //                             Full Name
// // // // //                         </label>
// // // // //                         <input
// // // // //                             id="name"
// // // // //                             type="text"
// // // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                             value={name}
// // // // //                             onChange={(e) => setName(e.target.value)}
// // // // //                             required
// // // // //                         />
// // // // //                     </motion.div>
// // // // //
// // // // //                     {/* Email Input */}
// // // // //                     <motion.div
// // // // //                         initial={{ opacity: 0, y: -30 }}
// // // // //                         animate={{ opacity: 1, y: 0 }}
// // // // //                         transition={{ duration: 0.3, delay: 0.1 }}
// // // // //                     >
// // // // //                         <label htmlFor="email" className="block text-gray-700 font-semibold">
// // // // //                             Email Address
// // // // //                         </label>
// // // // //                         <input
// // // // //                             id="email"
// // // // //                             type="email"
// // // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                             value={email}
// // // // //                             onChange={(e) => setEmail(e.target.value)}
// // // // //                             required
// // // // //                         />
// // // // //                     </motion.div>
// // // // //
// // // // //                     {/* Phone Input */}
// // // // //                     <motion.div
// // // // //                         initial={{ opacity: 0, y: -30 }}
// // // // //                         animate={{ opacity: 1, y: 0 }}
// // // // //                         transition={{ duration: 0.3, delay: 0.2 }}
// // // // //                     >
// // // // //                         <label htmlFor="phone" className="block text-gray-700 font-semibold">
// // // // //                             Phone Number
// // // // //                         </label>
// // // // //                         <input
// // // // //                             id="phone"
// // // // //                             type="tel"
// // // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                             value={phone}
// // // // //                             onChange={(e) => setPhone(e.target.value)}
// // // // //                             required
// // // // //                         />
// // // // //                     </motion.div>
// // // // //
// // // // //                     {/* Password Input */}
// // // // //                     <motion.div
// // // // //                         initial={{ opacity: 0, y: -30 }}
// // // // //                         animate={{ opacity: 1, y: 0 }}
// // // // //                         transition={{ duration: 0.3, delay: 0.3 }}
// // // // //                     >
// // // // //                         <label htmlFor="password" className="block text-gray-700 font-semibold">
// // // // //                             Password
// // // // //                         </label>
// // // // //                         <input
// // // // //                             id="password"
// // // // //                             type="password"
// // // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                             value={password}
// // // // //                             onChange={(e) => setPassword(e.target.value)}
// // // // //                             required
// // // // //                         />
// // // // //                     </motion.div>
// // // // //
// // // // //                     {/* Confirm Password Input */}
// // // // //                     <motion.div
// // // // //                         initial={{ opacity: 0, y: -30 }}
// // // // //                         animate={{ opacity: 1, y: 0 }}
// // // // //                         transition={{ duration: 0.3, delay: 0.4 }}
// // // // //                     >
// // // // //                         <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold">
// // // // //                             Confirm Password
// // // // //                         </label>
// // // // //                         <input
// // // // //                             id="confirmPassword"
// // // // //                             type="password"
// // // // //                             className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                             value={confirmPassword}
// // // // //                             onChange={(e) => setConfirmPassword(e.target.value)}
// // // // //                             required
// // // // //                         />
// // // // //                     </motion.div>
// // // // //
// // // // //                     {/* Error Message */}
// // // // //                     {error && (
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0 }}
// // // // //                             animate={{ opacity: 1 }}
// // // // //                             transition={{ duration: 0.3 }}
// // // // //                             className="text-red-600 text-sm font-semibold"
// // // // //                         >
// // // // //                             {error}
// // // // //                         </motion.div>
// // // // //                     )}
// // // // //
// // // // //                     {/* Register Button */}
// // // // //                     <motion.div
// // // // //                         initial={{ opacity: 0, y: 30 }}
// // // // //                         animate={{ opacity: 1, y: 0 }}
// // // // //                         transition={{ duration: 0.3, delay: 0.5 }}
// // // // //                     >
// // // // //                         <button
// // // // //                             type="submit"
// // // // //                             className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-150"
// // // // //                         >
// // // // //                             Register
// // // // //                         </button>
// // // // //                     </motion.div>
// // // // //                 </form>
// // // // //
// // // // //                 {/* Links */}
// // // // //                 <div className="mt-6 text-center">
// // // // //                     <p className="text-sm text-gray-500">
// // // // //                         Already have an account?{' '}
// // // // //                         <Link to="/login" className="text-primary hover:text-primary-dark">
// // // // //                             Log In
// // // // //                         </Link>
// // // // //                     </p>
// // // // //                 </div>
// // // // //             </motion.div>
// // // // //         </div>
// // // // //     );
// // // // // };
// // // // //
// // // // // export default RegisterPage;
// // // //
// // // // // import React, { useState } from 'react';
// // // // // import { Link, useNavigate } from 'react-router-dom';
// // // // // import { motion } from 'framer-motion';
// // // // //
// // // // // const RegisterPage = () => {
// // // // //     const [name, setName] = useState('');
// // // // //     const [email, setEmail] = useState('');
// // // // //     const [phone, setPhone] = useState('');
// // // // //     const [password, setPassword] = useState('');
// // // // //     const [confirmPassword, setConfirmPassword] = useState('');
// // // // //     const [error, setError] = useState('');
// // // // //     const navigate = useNavigate();
// // // // //
// // // // //     const handleRegister = (e) => {
// // // // //         e.preventDefault();
// // // // //         setError('');
// // // // //
// // // // //         if (password !== confirmPassword) {
// // // // //             setError('Passwords do not match');
// // // // //             return;
// // // // //         }
// // // // //
// // // // //         if (name && email && phone && password) {
// // // // //             navigate('/login');
// // // // //         } else {
// // // // //             setError('Please fill in all fields');
// // // // //         }
// // // // //     };
// // // // //
// // // // //     return (
// // // // //         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
// // // // //             <motion.div
// // // // //                 className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden"
// // // // //                 initial={{ opacity: 0, scale: 0.95 }}
// // // // //                 animate={{ opacity: 1, scale: 1 }}
// // // // //                 transition={{ duration: 0.5 }}
// // // // //             >
// // // // //                 {/* Left Side - Registration Form */}
// // // // //                 <div className="p-8 lg:p-16 flex flex-col justify-center">
// // // // //                     <h2 className="text-3xl font-bold text-gray-800 mb-6">
// // // // //                         Create Your Account
// // // // //                     </h2>
// // // // //                     <form onSubmit={handleRegister} className="space-y-6">
// // // // //                         {/* Name Input */}
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0, x: -30 }}
// // // // //                             animate={{ opacity: 1, x: 0 }}
// // // // //                             transition={{ duration: 0.3 }}
// // // // //                         >
// // // // //                             <label htmlFor="name" className="block text-gray-700 font-semibold">
// // // // //                                 Full Name
// // // // //                             </label>
// // // // //                             <input
// // // // //                                 id="name"
// // // // //                                 type="text"
// // // // //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                                 value={name}
// // // // //                                 onChange={(e) => setName(e.target.value)}
// // // // //                                 required
// // // // //                             />
// // // // //                         </motion.div>
// // // // //
// // // // //                         {/* Email Input */}
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0, x: -30 }}
// // // // //                             animate={{ opacity: 1, x: 0 }}
// // // // //                             transition={{ duration: 0.3, delay: 0.1 }}
// // // // //                         >
// // // // //                             <label htmlFor="email" className="block text-gray-700 font-semibold">
// // // // //                                 Email Address
// // // // //                             </label>
// // // // //                             <input
// // // // //                                 id="email"
// // // // //                                 type="email"
// // // // //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                                 value={email}
// // // // //                                 onChange={(e) => setEmail(e.target.value)}
// // // // //                                 required
// // // // //                             />
// // // // //                         </motion.div>
// // // // //
// // // // //                         {/* Phone Input */}
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0, x: -30 }}
// // // // //                             animate={{ opacity: 1, x: 0 }}
// // // // //                             transition={{ duration: 0.3, delay: 0.2 }}
// // // // //                         >
// // // // //                             <label htmlFor="phone" className="block text-gray-700 font-semibold">
// // // // //                                 Phone Number
// // // // //                             </label>
// // // // //                             <input
// // // // //                                 id="phone"
// // // // //                                 type="tel"
// // // // //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                                 value={phone}
// // // // //                                 onChange={(e) => setPhone(e.target.value)}
// // // // //                                 required
// // // // //                             />
// // // // //                         </motion.div>
// // // // //
// // // // //                         {/* Password Input */}
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0, x: -30 }}
// // // // //                             animate={{ opacity: 1, x: 0 }}
// // // // //                             transition={{ duration: 0.3, delay: 0.3 }}
// // // // //                         >
// // // // //                             <label htmlFor="password" className="block text-gray-700 font-semibold">
// // // // //                                 Password
// // // // //                             </label>
// // // // //                             <input
// // // // //                                 id="password"
// // // // //                                 type="password"
// // // // //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                                 value={password}
// // // // //                                 onChange={(e) => setPassword(e.target.value)}
// // // // //                                 required
// // // // //                             />
// // // // //                         </motion.div>
// // // // //
// // // // //                         {/* Confirm Password Input */}
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0, x: -30 }}
// // // // //                             animate={{ opacity: 1, x: 0 }}
// // // // //                             transition={{ duration: 0.3, delay: 0.4 }}
// // // // //                         >
// // // // //                             <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold">
// // // // //                                 Confirm Password
// // // // //                             </label>
// // // // //                             <input
// // // // //                                 id="confirmPassword"
// // // // //                                 type="password"
// // // // //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                                 value={confirmPassword}
// // // // //                                 onChange={(e) => setConfirmPassword(e.target.value)}
// // // // //                                 required
// // // // //                             />
// // // // //                         </motion.div>
// // // // //
// // // // //                         {/* Error Message */}
// // // // //                         {error && (
// // // // //                             <motion.div
// // // // //                                 initial={{ opacity: 0 }}
// // // // //                                 animate={{ opacity: 1 }}
// // // // //                                 transition={{ duration: 0.3 }}
// // // // //                                 className="text-red-600 text-sm font-semibold"
// // // // //                             >
// // // // //                                 {error}
// // // // //                             </motion.div>
// // // // //                         )}
// // // // //
// // // // //                         {/* Register Button */}
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0, y: 30 }}
// // // // //                             animate={{ opacity: 1, y: 0 }}
// // // // //                             transition={{ duration: 0.3, delay: 0.5 }}
// // // // //                         >
// // // // //                             <button
// // // // //                                 type="submit"
// // // // //                                 className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-150"
// // // // //                             >
// // // // //                                 Register
// // // // //                             </button>
// // // // //                         </motion.div>
// // // // //                     </form>
// // // // //
// // // // //                     {/* Links */}
// // // // //                     <div className="mt-6 text-center">
// // // // //                         <p className="text-sm text-gray-500">
// // // // //                             Already have an account?{' '}
// // // // //                             <Link to="/login" className="text-primary hover:text-primary-dark">
// // // // //                                 Log In
// // // // //                             </Link>
// // // // //                         </p>
// // // // //                     </div>
// // // // //                 </div>
// // // // //
// // // // //                 {/* Right Side - Image or Additional Content */}
// // // // //                 <div className="hidden lg:flex items-center justify-center bg-primary-light">
// // // // //                     <motion.img
// // // // //                         src="https://source.unsplash.com/random/800x800?jewelry"
// // // // //                         alt="Jewelry"
// // // // //                         className="rounded-lg object-cover"
// // // // //                         initial={{ opacity: 0, scale: 0.95 }}
// // // // //                         animate={{ opacity: 1, scale: 1 }}
// // // // //                         transition={{ duration: 0.5 }}
// // // // //                     />
// // // // //                 </div>
// // // // //             </motion.div>
// // // // //         </div>
// // // // //     );
// // // // // };
// // // // //
// // // // // export default RegisterPage;
// // // //
// // // // // import React, { useState } from 'react';
// // // // // import { Link, useNavigate } from 'react-router-dom';
// // // // // import { motion } from 'framer-motion';
// // // // // import bglogin from '../login-bg.jpg'
// // // // // const RegisterPage = () => {
// // // // //     const [name, setName] = useState('');
// // // // //     const [email, setEmail] = useState('');
// // // // //     const [phone, setPhone] = useState('');
// // // // //     const [password, setPassword] = useState('');
// // // // //     const [confirmPassword, setConfirmPassword] = useState('');
// // // // //     const [error, setError] = useState('');
// // // // //     const navigate = useNavigate();
// // // // //
// // // // //     const handleRegister = (e) => {
// // // // //         e.preventDefault();
// // // // //         setError('');
// // // // //
// // // // //         if (password !== confirmPassword) {
// // // // //             setError('Passwords do not match');
// // // // //             return;
// // // // //         }
// // // // //
// // // // //         if (name && email && phone && password) {
// // // // //             navigate('/login');
// // // // //         } else {
// // // // //             setError('Please fill in all fields');
// // // // //         }
// // // // //     };
// // // // //
// // // // //     return (
// // // // //         <div className="min-h-screen bg-gray-100 flex items-center justify-center">
// // // // //             <motion.div
// // // // //                 className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 lg:p-16"
// // // // //                 initial={{ opacity: 0, y: 50 }}
// // // // //                 animate={{ opacity: 1, y: 0 }}
// // // // //                 transition={{ duration: 0.5 }}
// // // // //             >
// // // // //                 {/* Left Side - Registration Form */}
// // // // //                 <div className="flex flex-col justify-center">
// // // // //                     <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center lg:text-left">
// // // // //                         Create an Account
// // // // //                     </h2>
// // // // //                     <form onSubmit={handleRegister} className="space-y-6">
// // // // //                         {/* Name Input */}
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0, x: -30 }}
// // // // //                             animate={{ opacity: 1, x: 0 }}
// // // // //                             transition={{ duration: 0.3 }}
// // // // //                         >
// // // // //                             <label htmlFor="name" className="block text-gray-700 font-semibold">
// // // // //                                 Full Name
// // // // //                             </label>
// // // // //                             <input
// // // // //                                 id="name"
// // // // //                                 type="text"
// // // // //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                                 value={name}
// // // // //                                 onChange={(e) => setName(e.target.value)}
// // // // //                                 required
// // // // //                             />
// // // // //                         </motion.div>
// // // // //
// // // // //                         {/* Email Input */}
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0, x: -30 }}
// // // // //                             animate={{ opacity: 1, x: 0 }}
// // // // //                             transition={{ duration: 0.3, delay: 0.1 }}
// // // // //                         >
// // // // //                             <label htmlFor="email" className="block text-gray-700 font-semibold">
// // // // //                                 Email Address
// // // // //                             </label>
// // // // //                             <input
// // // // //                                 id="email"
// // // // //                                 type="email"
// // // // //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                                 value={email}
// // // // //                                 onChange={(e) => setEmail(e.target.value)}
// // // // //                                 required
// // // // //                             />
// // // // //                         </motion.div>
// // // // //
// // // // //                         {/* Phone Input */}
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0, x: -30 }}
// // // // //                             animate={{ opacity: 1, x: 0 }}
// // // // //                             transition={{ duration: 0.3, delay: 0.2 }}
// // // // //                         >
// // // // //                             <label htmlFor="phone" className="block text-gray-700 font-semibold">
// // // // //                                 Phone Number
// // // // //                             </label>
// // // // //                             <input
// // // // //                                 id="phone"
// // // // //                                 type="tel"
// // // // //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                                 value={phone}
// // // // //                                 onChange={(e) => setPhone(e.target.value)}
// // // // //                                 required
// // // // //                             />
// // // // //                         </motion.div>
// // // // //
// // // // //                         {/* Password Input */}
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0, x: -30 }}
// // // // //                             animate={{ opacity: 1, x: 0 }}
// // // // //                             transition={{ duration: 0.3, delay: 0.3 }}
// // // // //                         >
// // // // //                             <label htmlFor="password" className="block text-gray-700 font-semibold">
// // // // //                                 Password
// // // // //                             </label>
// // // // //                             <input
// // // // //                                 id="password"
// // // // //                                 type="password"
// // // // //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                                 value={password}
// // // // //                                 onChange={(e) => setPassword(e.target.value)}
// // // // //                                 required
// // // // //                             />
// // // // //                         </motion.div>
// // // // //
// // // // //                         {/* Confirm Password Input */}
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0, x: -30 }}
// // // // //                             animate={{ opacity: 1, x: 0 }}
// // // // //                             transition={{ duration: 0.3, delay: 0.4 }}
// // // // //                         >
// // // // //                             <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold">
// // // // //                                 Confirm Password
// // // // //                             </label>
// // // // //                             <input
// // // // //                                 id="confirmPassword"
// // // // //                                 type="password"
// // // // //                                 className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
// // // // //                                 value={confirmPassword}
// // // // //                                 onChange={(e) => setConfirmPassword(e.target.value)}
// // // // //                                 required
// // // // //                             />
// // // // //                         </motion.div>
// // // // //
// // // // //                         {/* Error Message */}
// // // // //                         {error && (
// // // // //                             <motion.div
// // // // //                                 initial={{ opacity: 0 }}
// // // // //                                 animate={{ opacity: 1 }}
// // // // //                                 transition={{ duration: 0.3 }}
// // // // //                                 className="text-red-600 text-sm font-semibold"
// // // // //                             >
// // // // //                                 {error}
// // // // //                             </motion.div>
// // // // //                         )}
// // // // //
// // // // //                         {/* Register Button */}
// // // // //                         <motion.div
// // // // //                             initial={{ opacity: 0, y: 30 }}
// // // // //                             animate={{ opacity: 1, y: 0 }}
// // // // //                             transition={{ duration: 0.3, delay: 0.5 }}
// // // // //                         >
// // // // //                             <button
// // // // //                                 type="submit"
// // // // //                                 className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-150"
// // // // //                             >
// // // // //                                 Register
// // // // //                             </button>
// // // // //                         </motion.div>
// // // // //                     </form>
// // // // //
// // // // //                     {/* Links */}
// // // // //                     <div className="mt-6 text-center lg:text-left">
// // // // //                         <p className="text-sm text-gray-500">
// // // // //                             Already have an account?{' '}
// // // // //                             <Link to="/login" className="text-primary hover:text-primary-dark">
// // // // //                                 Log In
// // // // //                             </Link>
// // // // //                         </p>
// // // // //                     </div>
// // // // //                 </div>
// // // // //
// // // // //                 {/* Right Side - Image */}
// // // // //                 <motion.div
// // // // //                     className="hidden lg:flex items-center justify-center"
// // // // //                     initial={{ opacity: 0, scale: 0.95 }}
// // // // //                     animate={{ opacity: 1, scale: 1 }}
// // // // //                     transition={{ duration: 0.5 }}
// // // // //                 >
// // // // //                     <img
// // // // //                         src={bglogin}
// // // // //                         alt="Jewelry"
// // // // //                         className="rounded-lg object-cover shadow-lg"
// // // // //                     />
// // // // //                 </motion.div>
// // // // //             </motion.div>
// // // // //         </div>
// // // // //     );
// // // // // };
// // // // //
// // // // // export default RegisterPage;
// // // // //
// // // // // // import React, { useState } from 'react';
// // // // // // import { motion } from 'framer-motion';
// // // // // // import { TextField, Button, IconButton, InputAdornment, Typography } from '@mui/material';
// // // // // // import { Visibility, VisibilityOff, Person, Email, Phone, Lock } from '@mui/icons-material';
// // // // // // import { Link, useNavigate } from 'react-router-dom';
// // // // // //
// // // // // // const RegisterPage = () => {
// // // // // //     const [formData, setFormData] = useState({
// // // // // //         name: '',
// // // // // //         email: '',
// // // // // //         phone: '',
// // // // // //         password: '',
// // // // // //         confirmPassword: '',
// // // // // //     });
// // // // // //     const [showPassword, setShowPassword] = useState(false);
// // // // // //     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// // // // // //     const navigate = useNavigate();
// // // // // //
// // // // // //     const handleChange = (e) => {
// // // // // //         const { name, value } = e.target;
// // // // // //         setFormData(prevData => ({
// // // // // //             ...prevData,
// // // // // //             [name]: value
// // // // // //         }));
// // // // // //     };
// // // // // //
// // // // // //     const handleSubmit = (e) => {
// // // // // //         e.preventDefault();
// // // // // //         console.log('Registration submitted', formData);
// // // // // //         // Here you would typically handle the registration logic
// // // // // //         // For now, let's just simulate a successful registration
// // // // // //         navigate('/login'); // Redirect to login page after registration
// // // // // //     };
// // // // // //
// // // // // //     const togglePasswordVisibility = (field) => {
// // // // // //         if (field === 'password') {
// // // // // //             setShowPassword(!showPassword);
// // // // // //         } else {
// // // // // //             setShowConfirmPassword(!showConfirmPassword);
// // // // // //         }
// // // // // //     };
// // // // // //
// // // // // //     const inputStyle = {
// // // // // //         '& .MuiOutlinedInput-root': {
// // // // // //             '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
// // // // // //             '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
// // // // // //             '&.Mui-focused fieldset': { borderColor: 'white' },
// // // // // //         },
// // // // // //         '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
// // // // // //         '& input': { color: 'white' },
// // // // // //     };
// // // // // //
// // // // // //     return (
// // // // // //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/90 to-secondary/90 p-4">
// // // // // //             <motion.div
// // // // // //                 initial={{ opacity: 0, scale: 0.9 }}
// // // // // //                 animate={{ opacity: 1, scale: 1 }}
// // // // // //                 transition={{ duration: 0.5 }}
// // // // // //                 className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md"
// // // // // //             >
// // // // // //                 <Typography variant="h4" component="h1" className="text-center text-white font-bold mb-8">
// // // // // //                     Create Account
// // // // // //                 </Typography>
// // // // // //                 <form onSubmit={handleSubmit} className="space-y-4">
// // // // // //                     <TextField
// // // // // //                         fullWidth
// // // // // //                         label="Name"
// // // // // //                         variant="outlined"
// // // // // //                         name="name"
// // // // // //                         value={formData.name}
// // // // // //                         onChange={handleChange}
// // // // // //                         required
// // // // // //                         InputProps={{
// // // // // //                             startAdornment: (
// // // // // //                                 <InputAdornment position="start">
// // // // // //                                     <Person className="text-gray-400" />
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                         }}
// // // // // //                         sx={inputStyle}
// // // // // //                     />
// // // // // //                     <TextField
// // // // // //                         fullWidth
// // // // // //                         label="Email"
// // // // // //                         variant="outlined"
// // // // // //                         type="email"
// // // // // //                         name="email"
// // // // // //                         value={formData.email}
// // // // // //                         onChange={handleChange}
// // // // // //                         required
// // // // // //                         InputProps={{
// // // // // //                             startAdornment: (
// // // // // //                                 <InputAdornment position="start">
// // // // // //                                     <Email className="text-gray-400" />
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                         }}
// // // // // //                         sx={inputStyle}
// // // // // //                     />
// // // // // //                     <TextField
// // // // // //                         fullWidth
// // // // // //                         label="Phone"
// // // // // //                         variant="outlined"
// // // // // //                         type="tel"
// // // // // //                         name="phone"
// // // // // //                         value={formData.phone}
// // // // // //                         onChange={handleChange}
// // // // // //                         required
// // // // // //                         InputProps={{
// // // // // //                             startAdornment: (
// // // // // //                                 <InputAdornment position="start">
// // // // // //                                     <Phone className="text-gray-400" />
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                         }}
// // // // // //                         sx={inputStyle}
// // // // // //                     />
// // // // // //                     <TextField
// // // // // //                         fullWidth
// // // // // //                         label="Password"
// // // // // //                         variant="outlined"
// // // // // //                         type={showPassword ? 'text' : 'password'}
// // // // // //                         name="password"
// // // // // //                         value={formData.password}
// // // // // //                         onChange={handleChange}
// // // // // //                         required
// // // // // //                         InputProps={{
// // // // // //                             startAdornment: (
// // // // // //                                 <InputAdornment position="start">
// // // // // //                                     <Lock className="text-gray-400" />
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                             endAdornment: (
// // // // // //                                 <InputAdornment position="end">
// // // // // //                                     <IconButton
// // // // // //                                         onClick={() => togglePasswordVisibility('password')}
// // // // // //                                         edge="end"
// // // // // //                                         className="text-gray-400"
// // // // // //                                     >
// // // // // //                                         {showPassword ? <VisibilityOff /> : <Visibility />}
// // // // // //                                     </IconButton>
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                         }}
// // // // // //                         sx={inputStyle}
// // // // // //                     />
// // // // // //                     <TextField
// // // // // //                         fullWidth
// // // // // //                         label="Confirm Password"
// // // // // //                         variant="outlined"
// // // // // //                         type={showConfirmPassword ? 'text' : 'password'}
// // // // // //                         name="confirmPassword"
// // // // // //                         value={formData.confirmPassword}
// // // // // //                         onChange={handleChange}
// // // // // //                         required
// // // // // //                         InputProps={{
// // // // // //                             startAdornment: (
// // // // // //                                 <InputAdornment position="start">
// // // // // //                                     <Lock className="text-gray-400" />
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                             endAdornment: (
// // // // // //                                 <InputAdornment position="end">
// // // // // //                                     <IconButton
// // // // // //                                         onClick={() => togglePasswordVisibility('confirmPassword')}
// // // // // //                                         edge="end"
// // // // // //                                         className="text-gray-400"
// // // // // //                                     >
// // // // // //                                         {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
// // // // // //                                     </IconButton>
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                         }}
// // // // // //                         sx={inputStyle}
// // // // // //                     />
// // // // // //                     <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
// // // // // //                         <Button
// // // // // //                             type="submit"
// // // // // //                             variant="contained"
// // // // // //                             fullWidth
// // // // // //                             className="bg-accent hover:bg-accent-dark text-white py-3 rounded-full transition duration-300 ease-in-out transform hover:shadow-lg"
// // // // // //                         >
// // // // // //                             Register
// // // // // //                         </Button>
// // // // // //                     </motion.div>
// // // // // //                 </form>
// // // // // //                 <div className="mt-6 text-center">
// // // // // //                     <Typography variant="body2" className="text-gray-300">
// // // // // //                         Already have an account?{' '}
// // // // // //                         <Link to="/login" className="text-accent hover:underline">
// // // // // //                             Sign in
// // // // // //                         </Link>
// // // // // //                     </Typography>
// // // // // //                 </div>
// // // // // //             </motion.div>
// // // // // //         </div>
// // // // // //     );
// // // // // // };
// // // // // //
// // // // // // export default RegisterPage;
// // // // //
// // // // // // import React, { useState } from 'react';
// // // // // // import { motion } from 'framer-motion';
// // // // // // import { TextField, Button, IconButton, InputAdornment, Typography } from '@mui/material';
// // // // // // import { Visibility, VisibilityOff, Person, Email, Phone, Lock } from '@mui/icons-material';
// // // // // // import { Link, useNavigate } from 'react-router-dom';
// // // // // //
// // // // // // const RegisterPage = () => {
// // // // // //     const [formData, setFormData] = useState({
// // // // // //         name: '',
// // // // // //         email: '',
// // // // // //         phone: '',
// // // // // //         password: '',
// // // // // //         confirmPassword: '',
// // // // // //     });
// // // // // //     const [showPassword, setShowPassword] = useState(false);
// // // // // //     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// // // // // //     const navigate = useNavigate();
// // // // // //
// // // // // //     const handleChange = (e) => {
// // // // // //         const { name, value } = e.target;
// // // // // //         setFormData(prevData => ({
// // // // // //             ...prevData,
// // // // // //             [name]: value
// // // // // //         }));
// // // // // //     };
// // // // // //
// // // // // //     const handleSubmit = (e) => {
// // // // // //         e.preventDefault();
// // // // // //         console.log('Registration submitted', formData);
// // // // // //         navigate('/login');
// // // // // //     };
// // // // // //
// // // // // //     const togglePasswordVisibility = (field) => {
// // // // // //         if (field === 'password') {
// // // // // //             setShowPassword(!showPassword);
// // // // // //         } else {
// // // // // //             setShowConfirmPassword(!showConfirmPassword);
// // // // // //         }
// // // // // //     };
// // // // // //
// // // // // //     const inputStyle = {
// // // // // //         '& .MuiOutlinedInput-root': {
// // // // // //             '& fieldset': { borderColor: 'rgba(247, 236, 225, 0.3)' },
// // // // // //             '&:hover fieldset': { borderColor: 'rgba(247, 236, 225, 0.5)' },
// // // // // //             '&.Mui-focused fieldset': { borderColor: '#F7ECE1' },
// // // // // //         },
// // // // // //         '& .MuiInputLabel-root': { color: 'rgba(247, 236, 225, 0.7)' },
// // // // // //         '& input': { color: '#F8F5F2' },
// // // // // //     };
// // // // // //
// // // // // //     return (
// // // // // //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#C5A880] to-[#2B2B2B] p-4">
// // // // // //             <motion.div
// // // // // //                 initial={{ opacity: 0, scale: 0.9 }}
// // // // // //                 animate={{ opacity: 1, scale: 1 }}
// // // // // //                 transition={{ duration: 0.5 }}
// // // // // //                 className="bg-[#F7ECE1] bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md"
// // // // // //             >
// // // // // //                 <Typography variant="h4" component="h1" className="text-center text-[#F8F5F2] font-bold mb-8 font-serif">
// // // // // //                     Create Account
// // // // // //                 </Typography>
// // // // // //                 <form onSubmit={handleSubmit} className="space-y-4">
// // // // // //                     <TextField
// // // // // //                         fullWidth
// // // // // //                         label="Name"
// // // // // //                         variant="outlined"
// // // // // //                         name="name"
// // // // // //                         value={formData.name}
// // // // // //                         onChange={handleChange}
// // // // // //                         required
// // // // // //                         InputProps={{
// // // // // //                             startAdornment: (
// // // // // //                                 <InputAdornment position="start">
// // // // // //                                     <Person className="text-[#8B8B8B]" />
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                         }}
// // // // // //                         sx={inputStyle}
// // // // // //                     />
// // // // // //                     <TextField
// // // // // //                         fullWidth
// // // // // //                         label="Email"
// // // // // //                         variant="outlined"
// // // // // //                         type="email"
// // // // // //                         name="email"
// // // // // //                         value={formData.email}
// // // // // //                         onChange={handleChange}
// // // // // //                         required
// // // // // //                         InputProps={{
// // // // // //                             startAdornment: (
// // // // // //                                 <InputAdornment position="start">
// // // // // //                                     <Email className="text-[#8B8B8B]" />
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                         }}
// // // // // //                         sx={inputStyle}
// // // // // //                     />
// // // // // //                     <TextField
// // // // // //                         fullWidth
// // // // // //                         label="Phone"
// // // // // //                         variant="outlined"
// // // // // //                         type="tel"
// // // // // //                         name="phone"
// // // // // //                         value={formData.phone}
// // // // // //                         onChange={handleChange}
// // // // // //                         required
// // // // // //                         InputProps={{
// // // // // //                             startAdornment: (
// // // // // //                                 <InputAdornment position="start">
// // // // // //                                     <Phone className="text-[#8B8B8B]" />
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                         }}
// // // // // //                         sx={inputStyle}
// // // // // //                     />
// // // // // //                     <TextField
// // // // // //                         fullWidth
// // // // // //                         label="Password"
// // // // // //                         variant="outlined"
// // // // // //                         type={showPassword ? 'text' : 'password'}
// // // // // //                         name="password"
// // // // // //                         value={formData.password}
// // // // // //                         onChange={handleChange}
// // // // // //                         required
// // // // // //                         InputProps={{
// // // // // //                             startAdornment: (
// // // // // //                                 <InputAdornment position="start">
// // // // // //                                     <Lock className="text-[#8B8B8B]" />
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                             endAdornment: (
// // // // // //                                 <InputAdornment position="end">
// // // // // //                                     <IconButton
// // // // // //                                         onClick={() => togglePasswordVisibility('password')}
// // // // // //                                         edge="end"
// // // // // //                                         className="text-[#8B8B8B]"
// // // // // //                                     >
// // // // // //                                         {showPassword ? <VisibilityOff /> : <Visibility />}
// // // // // //                                     </IconButton>
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                         }}
// // // // // //                         sx={inputStyle}
// // // // // //                     />
// // // // // //                     <TextField
// // // // // //                         fullWidth
// // // // // //                         label="Confirm Password"
// // // // // //                         variant="outlined"
// // // // // //                         type={showConfirmPassword ? 'text' : 'password'}
// // // // // //                         name="confirmPassword"
// // // // // //                         value={formData.confirmPassword}
// // // // // //                         onChange={handleChange}
// // // // // //                         required
// // // // // //                         InputProps={{
// // // // // //                             startAdornment: (
// // // // // //                                 <InputAdornment position="start">
// // // // // //                                     <Lock className="text-[#8B8B8B]" />
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                             endAdornment: (
// // // // // //                                 <InputAdornment position="end">
// // // // // //                                     <IconButton
// // // // // //                                         onClick={() => togglePasswordVisibility('confirmPassword')}
// // // // // //                                         edge="end"
// // // // // //                                         className="text-[#8B8B8B]"
// // // // // //                                     >
// // // // // //                                         {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
// // // // // //                                     </IconButton>
// // // // // //                                 </InputAdornment>
// // // // // //                             ),
// // // // // //                         }}
// // // // // //                         sx={inputStyle}
// // // // // //                     />
// // // // // //                     <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
// // // // // //                         <Button
// // // // // //                             type="submit"
// // // // // //                             variant="contained"
// // // // // //                             fullWidth
// // // // // //                             className="bg-[#F7ECE1] hover:bg-[#DBC0A1] text-[#2B2B2B] py-3 rounded-full transition duration-300 ease-in-out transform hover:shadow-lg font-sans"
// // // // // //                         >
// // // // // //                             Register
// // // // // //                         </Button>
// // // // // //                     </motion.div>
// // // // // //                 </form>
// // // // // //                 <div className="mt-6 text-center">
// // // // // //                     <Typography variant="body2" className="text-[#8B8B8B] font-sans">
// // // // // //                         Already have an account?{' '}
// // // // // //                         <Link to="/login" className="text-[#F7ECE1] hover:underline">
// // // // // //                             Sign in
// // // // // //                         </Link>
// // // // // //                     </Typography>
// // // // // //                 </div>
// // // // // //             </motion.div>
// // // // // //         </div>
// // // // // //     );
// // // // // // };
// // // // // //
// // // // // // export default RegisterPage;
// // // // // // // import React, { useState } from 'react';
// // // // // // // import { motion } from 'framer-motion';
// // // // // // // import { TextField, Button, IconButton, InputAdornment, Typography } from '@mui/material';
// // // // // // // import { Visibility, VisibilityOff, Person, Email, Phone, Lock } from '@mui/icons-material';
// // // // // // // import { Link, useNavigate } from 'react-router-dom';
// // // // // // //
// // // // // // // const RegisterPage = () => {
// // // // // // //     const [formData, setFormData] = useState({
// // // // // // //         name: '',
// // // // // // //         email: '',
// // // // // // //         phone: '',
// // // // // // //         password: '',
// // // // // // //         confirmPassword: '',
// // // // // // //     });
// // // // // // //     const [showPassword, setShowPassword] = useState(false);
// // // // // // //     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// // // // // // //     const navigate = useNavigate();
// // // // // // //
// // // // // // //     const handleChange = (e) => {
// // // // // // //         const { name, value } = e.target;
// // // // // // //         setFormData(prevData => ({
// // // // // // //             ...prevData,
// // // // // // //             [name]: value
// // // // // // //         }));
// // // // // // //     };
// // // // // // //
// // // // // // //     const handleSubmit = (e) => {
// // // // // // //         e.preventDefault();
// // // // // // //         console.log('Registration submitted', formData);
// // // // // // //         // Here you would typically handle the registration logic
// // // // // // //         // For now, let's just simulate a successful registration
// // // // // // //         navigate('/login'); // Redirect to login page after registration
// // // // // // //     };
// // // // // // //
// // // // // // //     const togglePasswordVisibility = (field) => {
// // // // // // //         if (field === 'password') {
// // // // // // //             setShowPassword(!showPassword);
// // // // // // //         } else {
// // // // // // //             setShowConfirmPassword(!showConfirmPassword);
// // // // // // //         }
// // // // // // //     };
// // // // // // //
// // // // // // //     const inputStyle = {
// // // // // // //         '& .MuiOutlinedInput-root': {
// // // // // // //             '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
// // // // // // //             '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
// // // // // // //             '&.Mui-focused fieldset': { borderColor: 'white' },
// // // // // // //         },
// // // // // // //         '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
// // // // // // //         '& input': { color: 'white' },
// // // // // // //     };
// // // // // // //
// // // // // // //     return (
// // // // // // //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/90 to-secondary/90 p-4">
// // // // // // //             <motion.div
// // // // // // //                 initial={{ opacity: 0, scale: 0.9 }}
// // // // // // //                 animate={{ opacity: 1, scale: 1 }}
// // // // // // //                 transition={{ duration: 0.5 }}
// // // // // // //                 className="bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-md"
// // // // // // //             >
// // // // // // //                 <Typography variant="h4" component="h1" className="text-center text-white font-bold mb-8">
// // // // // // //                     Create Account
// // // // // // //                 </Typography>
// // // // // // //                 <form onSubmit={handleSubmit} className="space-y-4">
// // // // // // //                     <TextField
// // // // // // //                         fullWidth
// // // // // // //                         label="Name"
// // // // // // //                         variant="outlined"
// // // // // // //                         name="name"
// // // // // // //                         value={formData.name}
// // // // // // //                         onChange={handleChange}
// // // // // // //                         required
// // // // // // //                         InputProps={{
// // // // // // //                             startAdornment: (
// // // // // // //                                 <InputAdornment position="start">
// // // // // // //                                     <Person className="text-gray-400" />
// // // // // // //                                 </InputAdornment>
// // // // // // //                             ),
// // // // // // //                         }}
// // // // // // //                         sx={inputStyle}
// // // // // // //                     />
// // // // // // //                     <TextField
// // // // // // //                         fullWidth
// // // // // // //                         label="Email"
// // // // // // //                         variant="outlined"
// // // // // // //                         type="email"
// // // // // // //                         name="email"
// // // // // // //                         value={formData.email}
// // // // // // //                         onChange={handleChange}
// // // // // // //                         required
// // // // // // //                         InputProps={{
// // // // // // //                             startAdornment: (
// // // // // // //                                 <InputAdornment position="start">
// // // // // // //                                     <Email className="text-gray-400" />
// // // // // // //                                 </InputAdornment>
// // // // // // //                             ),
// // // // // // //                         }}
// // // // // // //                         sx={inputStyle}
// // // // // // //                     />
// // // // // // //                     <TextField
// // // // // // //                         fullWidth
// // // // // // //                         label="Phone"
// // // // // // //                         variant="outlined"
// // // // // // //                         type="tel"
// // // // // // //                         name="phone"
// // // // // // //                         value={formData.phone}
// // // // // // //                         onChange={handleChange}
// // // // // // //                         required
// // // // // // //                         InputProps={{
// // // // // // //                             startAdornment: (
// // // // // // //                                 <InputAdornment position="start">
// // // // // // //                                     <Phone className="text-gray-400" />
// // // // // // //                                 </InputAdornment>
// // // // // // //                             ),
// // // // // // //                         }}
// // // // // // //                         sx={inputStyle}
// // // // // // //                     />
// // // // // // //                     <TextField
// // // // // // //                         fullWidth
// // // // // // //                         label="Password"
// // // // // // //                         variant="outlined"
// // // // // // //                         type={showPassword ? 'text' : 'password'}
// // // // // // //                         name="password"
// // // // // // //                         value={formData.password}
// // // // // // //                         onChange={handleChange}
// // // // // // //                         required
// // // // // // //                         InputProps={{
// // // // // // //                             startAdornment: (
// // // // // // //                                 <InputAdornment position="start">
// // // // // // //                                     <Lock className="text-gray-400" />
// // // // // // //                                 </InputAdornment>
// // // // // // //                             ),
// // // // // // //                             endAdornment: (
// // // // // // //                                 <InputAdornment position="end">
// // // // // // //                                     <IconButton
// // // // // // //                                         onClick={() => togglePasswordVisibility('password')}
// // // // // // //                                         edge="end"
// // // // // // //                                         className="text-gray-400"
// // // // // // //                                     >
// // // // // // //                                         {showPassword ? <VisibilityOff /> : <Visibility />}
// // // // // // //                                     </IconButton>
// // // // // // //                                 </InputAdornment>
// // // // // // //                             ),
// // // // // // //                         }}
// // // // // // //                         sx={inputStyle}
// // // // // // //                     />
// // // // // // //                     <TextField
// // // // // // //                         fullWidth
// // // // // // //                         label="Confirm Password"
// // // // // // //                         variant="outlined"
// // // // // // //                         type={showConfirmPassword ? 'text' : 'password'}
// // // // // // //                         name="confirmPassword"
// // // // // // //                         value={formData.confirmPassword}
// // // // // // //                         onChange={handleChange}
// // // // // // //                         required
// // // // // // //                         InputProps={{
// // // // // // //                             startAdornment: (
// // // // // // //                                 <InputAdornment position="start">
// // // // // // //                                     <Lock className="text-gray-400" />
// // // // // // //                                 </InputAdornment>
// // // // // // //                             ),
// // // // // // //                             endAdornment: (
// // // // // // //                                 <InputAdornment position="end">
// // // // // // //                                     <IconButton
// // // // // // //                                         onClick={() => togglePasswordVisibility('confirmPassword')}
// // // // // // //                                         edge="end"
// // // // // // //                                         className="text-gray-400"
// // // // // // //                                     >
// // // // // // //                                         {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
// // // // // // //                                     </IconButton>
// // // // // // //                                 </InputAdornment>
// // // // // // //                             ),
// // // // // // //                         }}
// // // // // // //                         sx={inputStyle}
// // // // // // //                     />
// // // // // // //                     <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
// // // // // // //                         <Button
// // // // // // //                             type="submit"
// // // // // // //                             variant="contained"
// // // // // // //                             fullWidth
// // // // // // //                             className="bg-accent hover:bg-accent-dark text-white py-3 rounded-full transition duration-300 ease-in-out transform hover:shadow-lg"
// // // // // // //                         >
// // // // // // //                             Register
// // // // // // //                         </Button>
// // // // // // //                     </motion.div>
// // // // // // //                 </form>
// // // // // // //                 <div className="mt-6 text-center">
// // // // // // //                     <Typography variant="body2" className="text-gray-300">
// // // // // // //                         Already have an account?{' '}
// // // // // // //                         <Link to="/login" className="text-accent hover:underline">
// // // // // // //                             Sign in
// // // // // // //                         </Link>
// // // // // // //                     </Typography>
// // // // // // //                 </div>
// // // // // // //             </motion.div>
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // };
// // // // // // //
// // // // // // // export default RegisterPage;