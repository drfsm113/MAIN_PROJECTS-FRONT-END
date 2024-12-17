import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CheckOutPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('creditCard');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Gold Necklace', price: 499.99, quantity: 1, image: 'https://via.placeholder.com/150', variant: '24K Gold' },
        { id: 2, name: 'Silver Earrings', price: 89.99, quantity: 2, image: 'https://via.placeholder.com/150', variant: 'Sterling Silver' },
        { id: 3, name: 'Platinum Ring', price: 799.99, quantity: 1, image: 'https://via.placeholder.com/150', variant: 'Platinum' },
    ]);

    const handleCheckout = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const formData = {
            name,
            email,
            address,
            city,
            postalCode,
            country,
            paymentMethod
        };

        console.log("Form Data:", formData);


        // Implement checkout logic here

        setSuccess('Order placed successfully!');
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <div className="min-h-screen flex flex-col items-center py-10">
            <motion.div
                className="w-full max-w-6xl"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Checkout
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Shipping Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-gray-50 p-6 rounded-lg shadow-md"
                    >
                        <h3 className="text-2xl font-semibold  text-gray-800 mb-4">Shipping <span  className="text-primary"> Information</span>
                        </h3>
                        <form onSubmit={handleCheckout} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    {/*<label htmlFor="name" className="block text-gray-600 font-medium">Full Name</label>*/}
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    {/*<label htmlFor="email" className="block text-gray-600 font-medium">Email Address</label>*/}
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Email Address"
                                        className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    {/*<label htmlFor="address" className="block text-gray-600 font-medium">Address</label>*/}
                                    <input
                                        id="address"
                                        type="text"
                                        placeholder="Address"
                                        className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    {/*<label htmlFor="city" className="block text-gray-600 font-medium">City</label>*/}
                                    <input
                                        id="city"
                                        type="text"
                                        placeholder="City"
                                        className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    {/*<label htmlFor="postalCode" className="block text-gray-600 font-medium">Postal Code</label>*/}
                                    <input
                                        id="postalCode"
                                        type="text"
                                        placeholder="Postal Code"
                                        className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    {/*<label htmlFor="country" className="block text-gray-600 font-medium">Country</label>*/}
                                    <input
                                        id="country"
                                        type="text"
                                        placeholder="Country"
                                        className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Payment Information */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="bg-gray-50 p-6 rounded-lg shadow-md mt-6"
                            >
                                <h3 className="text-2xl font-semibold  text-gray-800 mb-4">Payment <span  className="text-primary">Information</span>
                                </h3>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="creditCard"
                                            checked={paymentMethod === 'creditCard'}
                                            onChange={() => setPaymentMethod('creditCard')}
                                            className="mr-2"
                                        />
                                        Credit Card
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="paypal"
                                            checked={paymentMethod === 'paypal'}
                                            onChange={() => setPaymentMethod('paypal')}
                                            className="mr-2"
                                        />
                                        PayPal
                                    </label>
                                </div>
                            </motion.div>

                            {/* Error and Success Messages */}
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
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-green-600 text-sm font-semibold"
                                >
                                    {success}
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.5 }}
                            >
                                <motion.button
                                    type="submit"
                                    className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Place Order
                                </motion.button>
                            </motion.div>
                        </form>
                    </motion.div>

                    {/* Cart Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-gray-50 p-6 rounded-lg shadow-md"
                    >
                        <h3 className="text-2xl font-semibold  text-gray-800 mb-4">Cart <span  className="text-primary">Summary</span>
                        </h3>
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                                    <div className="flex items-center space-x-4">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                                        <div className="flex flex-col">
                                            <span className=" text-gray-800 font-medium">{item.name}</span>
                                            <span className="text-gray-500 text-sm">{item.variant}</span>
                                            <span className="text-gray-500 text-sm">Quantity: {item.quantity}</span>
                                        </div>
                                    </div>
                                    <span className=" text-gray-800 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-4">
                                <span className="font-bold text-gray-800">Total</span>
                                <span className="font-bold text-gray-800">${calculateTotal()}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
};

export default CheckOutPage;

// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom';
//
// const CheckOutPage = () => {
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [address, setAddress] = useState('');
//     const [city, setCity] = useState('');
//     const [postalCode, setPostalCode] = useState('');
//     const [country, setCountry] = useState('');
//     const [paymentMethod, setPaymentMethod] = useState('creditCard');
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//
//     const handleCheckout = (e) => {
//         e.preventDefault();
//         setError('');
//         setSuccess('');
//
//         // Implement checkout logic here
//
//         setSuccess('Order placed successfully!');
//     };
//
//     return (
//         <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
//             <motion.div
//                 className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8"
//                 initial={{ opacity: 0, y: -30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
//                     Checkout
//                 </h2>
//
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//                     {/* Shipping Information */}
//                     <motion.div
//                         initial={{ opacity: 0, x: -30 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.4 }}
//                         className="bg-gray-50 p-6 rounded-lg shadow-md"
//                     >
//                         <h3 className="text-2xl font-semibold text-gray-700 mb-4">Shipping Information</h3>
//                         <form onSubmit={handleCheckout} className="space-y-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div>
//                                     <label htmlFor="name" className="block text-gray-600 font-medium">Full Name</label>
//                                     <input
//                                         id="name"
//                                         type="text"
//                                         className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                                         value={name}
//                                         onChange={(e) => setName(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="email" className="block text-gray-600 font-medium">Email Address</label>
//                                     <input
//                                         id="email"
//                                         type="email"
//                                         className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="address" className="block text-gray-600 font-medium">Address</label>
//                                     <input
//                                         id="address"
//                                         type="text"
//                                         className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                                         value={address}
//                                         onChange={(e) => setAddress(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="city" className="block text-gray-600 font-medium">City</label>
//                                     <input
//                                         id="city"
//                                         type="text"
//                                         className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                                         value={city}
//                                         onChange={(e) => setCity(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="postalCode" className="block text-gray-600 font-medium">Postal Code</label>
//                                     <input
//                                         id="postalCode"
//                                         type="text"
//                                         className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                                         value={postalCode}
//                                         onChange={(e) => setPostalCode(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                                 <div>
//                                     <label htmlFor="country" className="block text-gray-600 font-medium">Country</label>
//                                     <input
//                                         id="country"
//                                         type="text"
//                                         className="w-full mt-2 p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
//                                         value={country}
//                                         onChange={(e) => setCountry(e.target.value)}
//                                         required
//                                     />
//                                 </div>
//                             </div>
//
//                             {/* Payment Information */}
//                             <motion.div
//                                 initial={{ opacity: 0, x: -30 }}
//                                 animate={{ opacity: 1, x: 0 }}
//                                 transition={{ duration: 0.4, delay: 0.1 }}
//                                 className="bg-gray-50 p-6 rounded-lg shadow-md mt-6"
//                             >
//                                 <h3 className="text-2xl font-semibold text-gray-700 mb-4">Payment Information</h3>
//                                 <div className="flex items-center space-x-4">
//                                     <label className="flex items-center">
//                                         <input
//                                             type="radio"
//                                             name="paymentMethod"
//                                             value="creditCard"
//                                             checked={paymentMethod === 'creditCard'}
//                                             onChange={() => setPaymentMethod('creditCard')}
//                                             className="mr-2"
//                                         />
//                                         Credit Card
//                                     </label>
//                                     <label className="flex items-center">
//                                         <input
//                                             type="radio"
//                                             name="paymentMethod"
//                                             value="paypal"
//                                             checked={paymentMethod === 'paypal'}
//                                             onChange={() => setPaymentMethod('paypal')}
//                                             className="mr-2"
//                                         />
//                                         PayPal
//                                     </label>
//                                 </div>
//                             </motion.div>
//
//                             {/* Error and Success Messages */}
//                             {error && (
//                                 <motion.div
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     transition={{ duration: 0.3 }}
//                                     className="text-red-600 text-sm font-semibold"
//                                 >
//                                     {error}
//                                 </motion.div>
//                             )}
//                             {success && (
//                                 <motion.div
//                                     initial={{ opacity: 0 }}
//                                     animate={{ opacity: 1 }}
//                                     transition={{ duration: 0.3 }}
//                                     className="text-green-600 text-sm font-semibold"
//                                 >
//                                     {success}
//                                 </motion.div>
//                             )}
//
//                             {/* Submit Button */}
//                             <motion.div
//                                 initial={{ opacity: 0, y: 30 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.3, delay: 0.5 }}
//                             >
//                                 <motion.button
//                                     type="submit"
//                                     className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-200"
//                                     whileHover={{ scale: 1.05 }}
//                                     whileTap={{ scale: 0.95 }}
//                                 >
//                                     Place Order
//                                 </motion.button>
//                             </motion.div>
//                         </form>
//                     </motion.div>
//
//                     {/* Cart Summary */}
//                     <motion.div
//                         initial={{ opacity: 0, x: 30 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.4 }}
//                         className="bg-gray-50 p-6 rounded-lg shadow-md"
//                     >
//                         <h3 className="text-2xl font-semibold text-gray-700 mb-4">Cart Summary</h3>
//                         {/* Replace with actual cart items */}
//                         <div className="space-y-4">
//                             <div className="flex justify-between items-center border-b pb-4">
//                                 <span className="text-gray-700">Item Name</span>
//                                 <span className="text-gray-700">$20.00</span>
//                             </div>
//                             <div className="flex justify-between items-center border-b pb-4">
//                                 <span className="text-gray-700">Another Item</span>
//                                 <span className="text-gray-700">$30.00</span>
//                             </div>
//                             <div className="flex justify-between items-center pt-4">
//                                 <span className="font-bold text-gray-800">Total</span>
//                                 <span className="font-bold text-gray-800">$50.00</span>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };
//
// export default CheckOutPage;
//
// // import React, { useState } from 'react';
// // import { TextField, Button, Stepper, Step, StepLabel, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
// // import { CreditCard, LocalShipping, Payment } from '@mui/icons-material';
// //
// // const CheckoutPage = () => {
// //     const [activeStep, setActiveStep] = useState(0);
// //     const steps = ['Shipping', 'Payment', 'Review'];
// //
// //     const handleNext = () => {
// //         setActiveStep((prevActiveStep) => prevActiveStep + 1);
// //     };
// //
// //     const handleBack = () => {
// //         setActiveStep((prevActiveStep) => prevActiveStep - 1);
// //     };
// //
// //     const ShippingForm = () => (
// //         <div className="space-y-4">
// //             <TextField label="Full Name" variant="outlined" fullWidth />
// //             <TextField label="Address" variant="outlined" fullWidth />
// //             <div className="grid grid-cols-2 gap-4">
// //                 <TextField label="City" variant="outlined" fullWidth />
// //                 <TextField label="Postal Code" variant="outlined" fullWidth />
// //             </div>
// //             <TextField label="Country" variant="outlined" fullWidth />
// //         </div>
// //     );
// //
// //     const PaymentForm = () => (
// //         <div className="space-y-4">
// //             <FormControl component="fieldset">
// //                 <FormLabel component="legend">Payment Method</FormLabel>
// //                 <RadioGroup defaultValue="credit_card">
// //                     <FormControlLabel value="credit_card" control={<Radio />} label="Credit Card" />
// //                     <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
// //                 </RadioGroup>
// //             </FormControl>
// //             <TextField label="Card Number" variant="outlined" fullWidth />
// //             <div className="grid grid-cols-2 gap-4">
// //                 <TextField label="Expiry Date" variant="outlined" fullWidth />
// //                 <TextField label="CVV" variant="outlined" fullWidth />
// //             </div>
// //         </div>
// //     );
// //
// //     const ReviewForm = () => (
// //         <div className="space-y-4">
// //             <h3 className="text-xl font-semibold">Order Summary</h3>
// //             <div className="bg-gray-100 p-4 rounded-lg">
// //                 <div className="flex justify-between mb-2">
// //                     <span>Diamond Ring x1</span>
// //                     <span>$999.99</span>
// //                 </div>
// //                 <div className="flex justify-between mb-2">
// //                     <span>Gold Necklace x2</span>
// //                     <span>$1,199.98</span>
// //                 </div>
// //                 <div className="flex justify-between mb-2">
// //                     <span>Shipping</span>
// //                     <span>$10.00</span>
// //                 </div>
// //                 <div className="flex justify-between font-semibold mt-4">
// //                     <span>Total</span>
// //                     <span>$2,209.97</span>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// //
// //     return (
// //         <div className="container mx-auto px-4 py-8">
// //             <h1 className="text-3xl font-bold mb-8">Checkout</h1>
// //             <Stepper activeStep={activeStep} alternativeLabel className="mb-8">
// //                 {steps.map((label) => (
// //                     <Step key={label}>
// //                         <StepLabel>{label}</StepLabel>
// //                     </Step>
// //                 ))}
// //             </Stepper>
// //             <div className="max-w-2xl mx-auto">
// //                 {activeStep === 0 && <ShippingForm />}
// //                 {activeStep === 1 && <PaymentForm />}
// //                 {activeStep === 2 && <ReviewForm />}
// //                 <div className="mt-8 flex justify-between">
// //                     <Button
// //                         disabled={activeStep === 0}
// //                         onClick={handleBack}
// //                         variant="outlined"
// //                     >
// //                         Back
// //                     </Button>
// //                     <Button
// //                         variant="contained"
// //                         color="primary"
// //                         onClick={activeStep === steps.length - 1 ? () => alert('Order placed!') : handleNext}
// //                         startIcon={activeStep === 0 ? <CreditCard /> : activeStep === 1 ? <Payment /> : <LocalShipping />}
// //                     >
// //                         {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
// //                     </Button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default CheckoutPage;