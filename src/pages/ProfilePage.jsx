import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiCreditCard, FiPackage, FiSettings, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PersonalInfo from './PersonalInfo';
import SecuritySettings from './SecuritySettings';
import PaymentMethods from './PaymentMethods';
import OrderHistory from './OrderHistory';
import AccountSettings from './AccountSettings';
import useToast from "../store/CustomHook/useToast";
import userService from "../Services/UserService";
import authService from "../Services/AuthService";
import { logout } from "../store/reducers/authSlice";

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const dispatch = useDispatch();
    const { showToastMessage } = useToast();
    const navigate = useNavigate();

    const fetchUserDetails = useCallback(async () => {
        try {
            const response = await userService.getUserDetails();
            console.log('User details fetched:', response);
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            showToastMessage('Failed to fetch user details', 'error');
        }
    }, [showToastMessage]); // Add any dependencies that showToastMessage might have

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: FiUser },
        { id: 'security', label: 'Security', icon: FiLock },
        { id: 'payment', label: 'Payment Methods', icon: FiCreditCard },
        { id: 'orders', label: 'Order History', icon: FiPackage },
        // { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
        { id: 'settings', label: 'Settings', icon: FiSettings },
    ];

    const handleLogout = async () => {
        try {
            await authService.logout();
            dispatch(logout());
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
            showToastMessage('Logout failed', 'error');
        }
    };

    const TabContent = ({ tabId }) => {
        switch (tabId) {
            case 'personal':
                return <PersonalInfo />;
            case 'security':
                return <SecuritySettings />;
            case 'payment':
                return <PaymentMethods />;
            case 'orders':
                return <OrderHistory />;
            // case 'wishlist':
            //     return <Wishlist />;
            case 'settings':
                return <AccountSettings />;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-1 py-1 bg-background">
            <h1 className="text-3xl font-bold mb-1 text-text">My Profile</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-1/4">
                    <nav className="bg-white rounded-lg shadow-md p-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center w-full px-4 py-2 mb-2 rounded-md transition-colors duration-200 ${
                                    activeTab === tab.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
                                }`}
                            >
                                <tab.icon className="mr-3 text-lg" />
                                {tab.label}
                            </button>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-100 rounded-md transition-colors duration-200 mt-4"
                        >
                            <FiLogOut className="mr-3 text-lg" />
                            Logout
                        </button>
                    </nav>
                </aside>
                <main className="w-full md:w-3/4">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <TabContent tabId={activeTab} />
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default UserProfile;
// ==============old===========
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { motion } from 'framer-motion';
// import { FiUser, FiLock, FiCreditCard, FiPackage, FiHeart, FiSettings, FiLogOut } from 'react-icons/fi';
//
// import { NavLink, useNavigate } from 'react-router-dom';
// import PersonalInfo from './PersonalInfo';
// import SecuritySettings from './SecuritySettings';
// import PaymentMethods from './PaymentMethods';
// import OrderHistory from './OrderHistory';
// import Wishlist from './Wishlist';
// import AccountSettings from './AccountSettings';
// import useToast from "../store/CustomHook/useToast";
// import userService from "../Services/UserService";
// import AuthService from "../Services/AuthService";
// import { clearUser, updateUser } from "../store/actions/userActions";
// const UserProfile = () => {
//     const [activeTab, setActiveTab] = useState('personal');
//     const dispatch = useDispatch();
//     const user = useSelector(state => state.user);
//     const { showToastMessage } = useToast();
//     const navigate = useNavigate();
//
//
//     useEffect(() => {
//         const fetchUserDetails = async () => {
//             try {
//                 const response = await userService.getUserDetails(user.slug);
//                 dispatch(updateUser(response));
//             } catch (error) {
//                 showToastMessage('Failed to fetch user details', 'error');
//             }
//         };
//
//         if (user.slug) {
//             fetchUserDetails();
//         }
//     }, [user.slug, dispatch, showToastMessage]);
//
//     const tabs = [
//         { id: 'personal', label: 'Personal Info', icon: FiUser },
//         { id: 'security', label: 'Security', icon: FiLock },
//         { id: 'payment', label: 'Payment Methods', icon: FiCreditCard },
//         { id: 'orders', label: 'Order History', icon: FiPackage },
//         { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
//         { id: 'settings', label: 'Settings', icon: FiSettings },
//     ];
//
//     const handleLogout = () => {
//         AuthService.logout();
//         dispatch(clearUser());
//         navigate('/');
//     };
//
//     const TabContent = ({ tabId }) => {
//         switch (tabId) {
//             case 'personal':
//                 return <PersonalInfo />;
//             case 'security':
//                 return <SecuritySettings />;
//             case 'payment':
//                 return <PaymentMethods />;
//             case 'orders':
//                 return <OrderHistory />;
//             case 'wishlist':
//                 return <Wishlist />;
//             case 'settings':
//                 return <AccountSettings />;
//             default:
//                 return null;
//         }
//     };
//
//     return (
//         <div className="container mx-auto px-1 py-1 bg-background">
//             <h1 className="text-3xl font-bold mb-1 text-text">My Profile</h1>
//             <div className="flex flex-col md:flex-row gap-8">
//                 <aside className="w-full md:w-1/4">
//                     <nav className="bg-white rounded-lg shadow-md p-4">
//                         {tabs.map((tab) => (
//                             <button
//                                 key={tab.id}
//                                 onClick={() => setActiveTab(tab.id)}
//                                 className={`flex items-center w-full px-4 py-2 mb-2 rounded-md transition-colors duration-200 ${
//                                     activeTab === tab.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
//                                 }`}
//                             >
//                                 <tab.icon className="mr-3 text-lg" />
//                                 {tab.label}
//                             </button>
//                         ))}
//                         <button
//                             onClick={handleLogout}
//                             className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-100 rounded-md transition-colors duration-200 mt-4"
//                         >
//                             <FiLogOut className="mr-3 text-lg" />
//                             Logout
//                         </button>
//                     </nav>
//                 </aside>
//                 <main className="w-full md:w-3/4">
//                     <motion.div
//                         key={activeTab}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -20 }}
//                         transition={{ duration: 0.3 }}
//                         className="bg-white rounded-lg shadow-md p-6"
//                     >
//                         <TabContent tabId={activeTab} />
//                     </motion.div>
//                 </main>
//             </div>
//         </div>
//     );
// };
//
// export default UserProfile;
//
// // import React, { useState, useEffect } from 'react';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { motion } from 'framer-motion';
// // import { FiUser, FiLock, FiCreditCard, FiPackage, FiHeart, FiSettings, FiLogOut } from 'react-icons/fi';
//
// // import PersonalInfo from './PersonalInfo';
// // import SecuritySettings from './SecuritySettings';
// // import PaymentMethods from './PaymentMethods';
// // import OrderHistory from './OrderHistory';
// // import Wishlist from './Wishlist';
// // import AccountSettings from './AccountSettings';
// // import {updateUser} from "../store/actions/userActions";
// // import useToast from "../store/CustomHook/useToast"
// // import userService from "../Services/UserService";
// // const UserProfile = () => {
// //     const [activeTab, setActiveTab] = useState('personal');
// //     const dispatch = useDispatch();
// //     const user = useSelector(state => state.user);
// //     const { showToastMessage } = useToast();
//
// //     useEffect(() => {
// //         const fetchUserDetails = async () => {
// //             try {
// //                 const response = await userService.getUserDetails(user.slug);
// //                 dispatch(updateUser(response));
// //             } catch (error) {
// //                 showToastMessage('Failed to fetch user details', 'error');
// //             }
// //         };
//
// //         if (user.slug) {
// //             fetchUserDetails();
// //         }
// //     }, [user.slug, dispatch, showToastMessage]);
//
// //     const tabs = [
// //         { id: 'personal', label: 'Personal Info', icon: FiUser },
// //         { id: 'security', label: 'Security', icon: FiLock },
// //         { id: 'payment', label: 'Payment Methods', icon: FiCreditCard },
// //         { id: 'orders', label: 'Order History', icon: FiPackage },
// //         { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
// //         { id: 'settings', label: 'Settings', icon: FiSettings },
// //     ];
//
// //     const handleLogout = () => {
// //         // Implement logout functionality
// //     };
//
// //     const TabContent = ({ tabId }) => {
// //         switch (tabId) {
// //             case 'personal':
// //                 return <PersonalInfo user={user} />;
// //             case 'security':
// //                 return <SecuritySettings />;
// //             case 'payment':
// //                 return <PaymentMethods />;
// //             case 'orders':
// //                 return <OrderHistory />;
// //             case 'wishlist':
// //                 return <Wishlist />;
// //             case 'settings':
// //                 return <AccountSettings user={user} />;
// //             default:
// //                 return null;
// //         }
// //     };
//
// //     return (
// //         <div className="container mx-auto px-4 py-8 bg-background">
// //             <h1 className="text-3xl font-bold mb-8 text-text">My Profile</h1>
// //             <div className="flex flex-col md:flex-row gap-8">
// //                 <aside className="w-full md:w-1/4">
// //                     <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col items-center">
// //                         <img src={user.profile?.profile_picture || 'https://via.placeholder.com/150'} alt={user.first_name} className="w-32 h-32 rounded-full mb-4" />
// //                         <h2 className="text-xl font-semibold mb-2 text-text">{`${user.first_name} ${user.last_name}`}</h2>
// //                         <p className="text-gray-600">{user.email}</p>
// //                     </div>
// //                     <nav className="bg-white rounded-lg shadow-md p-4">
// //                         {tabs.map((tab) => (
// //                             <button
// //                                 key={tab.id}
// //                                 onClick={() => setActiveTab(tab.id)}
// //                                 className={`flex items-center w-full px-4 py-2 mb-2 rounded-md transition-colors duration-200 ${
// //                                     activeTab === tab.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
// //                                 }`}
// //                             >
// //                                 <tab.icon className="mr-3 text-lg" />
// //                                 {tab.label}
// //                             </button>
// //                         ))}
// //                         <button
// //                             onClick={handleLogout}
// //                             className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-100 rounded-md transition-colors duration-200 mt-4"
// //                         >
// //                             <FiLogOut className="mr-3 text-lg" />
// //                             Logout
// //                         </button>
// //                     </nav>
// //                 </aside>
// //                 <main className="w-full md:w-3/4">
// //                     <motion.div
// //                         key={activeTab}
// //                         initial={{ opacity: 0, y: 20 }}
// //                         animate={{ opacity: 1, y: 0 }}
// //                         exit={{ opacity: 0, y: -20 }}
// //                         transition={{ duration: 0.3 }}
// //                         className="bg-white rounded-lg shadow-md p-6"
// //                     >
// //                         <TabContent tabId={activeTab} />
// //                     </motion.div>
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };
//
// // export default UserProfile;
// // // =================================deisgn below============
// // //
// // // import React, { useState } from 'react';
// // // import { motion } from 'framer-motion';
// // // import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiCreditCard, FiPackage, FiHeart, FiSettings, FiLogOut } from 'react-icons/fi';
// // //
// // // const UserProfile = () => {
// // //     const [activeTab, setActiveTab] = useState('personal');
// // //
// // //     const user = {
// // //         name: 'John Doe',
// // //         email: 'john.doe@example.com',
// // //         phone: '+1 (555) 123-4567',
// // //         address: '123 Main St, Anytown, USA 12345',
// // //         avatar: 'https://via.placeholder.com/150',
// // //     };
// // //
// // //     const tabs = [
// // //         { id: 'personal', label: 'Personal Info', icon: FiUser },
// // //         { id: 'security', label: 'Security', icon: FiLock },
// // //         { id: 'payment', label: 'Payment Methods', icon: FiCreditCard },
// // //         { id: 'orders', label: 'Order History', icon: FiPackage },
// // //         { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
// // //         { id: 'settings', label: 'Settings', icon: FiSettings },
// // //     ];
// // //
// // //     const TabContent = ({ tabId }) => {
// // //         switch (tabId) {
// // //             case 'personal':
// // //                 return <PersonalInfo user={user} />;
// // //             case 'security':
// // //                 return <SecuritySettings />;
// // //             case 'payment':
// // //                 return <PaymentMethods />;
// // //             case 'orders':
// // //                 return <OrderHistory />;
// // //             case 'wishlist':
// // //                 return <Wishlist />;
// // //             case 'settings':
// // //                 return <AccountSettings />;
// // //             default:
// // //                 return null;
// // //         }
// // //     };
// // //
// // //     return (
// // //         <div className="container mx-auto px-4 py-8 bg-background">
// // //             <h1 className="text-3xl font-bold mb-8 text-text">My Profile</h1>
// // //             <div className="flex flex-col md:flex-row gap-8">
// // //                 <aside className="w-full md:w-1/4">
// // //                     <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col items-center">
// // //                         <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full mb-4" />
// // //                         <h2 className="text-xl font-semibold mb-2 text-text">{user.name}</h2>
// // //                         <p className="text-gray-600">{user.email}</p>
// // //                     </div>
// // //                     <nav className="bg-white rounded-lg shadow-md p-4">
// // //                         {tabs.map((tab) => (
// // //                             <button
// // //                                 key={tab.id}
// // //                                 onClick={() => setActiveTab(tab.id)}
// // //                                 className={`flex items-center w-full px-4 py-2 mb-2 rounded-md transition-colors duration-200 ${
// // //                                     activeTab === tab.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
// // //                                 }`}
// // //                             >
// // //                                 <tab.icon className="mr-3 text-lg" />
// // //                                 {tab.label}
// // //                             </button>
// // //                         ))}
// // //                         <button className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-100 rounded-md transition-colors duration-200 mt-4">
// // //                             <FiLogOut className="mr-3 text-lg" />
// // //                             Logout
// // //                         </button>
// // //                     </nav>
// // //                 </aside>
// // //                 <main className="w-full md:w-3/4">
// // //                     <motion.div
// // //                         key={activeTab}
// // //                         initial={{ opacity: 0, y: 20 }}
// // //                         animate={{ opacity: 1, y: 0 }}
// // //                         exit={{ opacity: 0, y: -20 }}
// // //                         transition={{ duration: 0.3 }}
// // //                         className="bg-white rounded-lg shadow-md p-6"
// // //                     >
// // //                         <TabContent tabId={activeTab} />
// // //                     </motion.div>
// // //                 </main>
// // //             </div>
// // //         </div>
// // //     );
// // // };
// // //
// // // const PersonalInfo = ({ user }) => (
// // //     <div>
// // //         <h2 className="text-2xl font-semibold mb-4 text-text">Personal Information</h2>
// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // //             <div>
// // //                 <label className="block text-gray-700 mb-2">Full Name</label>
// // //                 <input type="text" defaultValue={user.name} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
// // //             </div>
// // //             <div>
// // //                 <label className="block text-gray-700 mb-2">Email</label>
// // //                 <input type="email" defaultValue={user.email} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
// // //             </div>
// // //             <div>
// // //                 <label className="block text-gray-700 mb-2">Phone</label>
// // //                 <input type="tel" defaultValue={user.phone} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
// // //             </div>
// // //             <div>
// // //                 <label className="block text-gray-700 mb-2">Address</label>
// // //                 <input type="text" defaultValue={user.address} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
// // //             </div>
// // //         </div>
// // //         <button className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
// // //             Save Changes
// // //         </button>
// // //     </div>
// // // );
// // //
// // // const SecuritySettings = () => (
// // //     <div>
// // //         <h2 className="text-2xl font-semibold mb-4 text-text">Security Settings</h2>
// // //         <div className="mb-6">
// // //             <h3 className="text-lg font-medium mb-2">Change Password</h3>
// // //             <div className="space-y-4">
// // //                 <input type="password" placeholder="Current Password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
// // //                 <input type="password" placeholder="New Password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
// // //                 <input type="password" placeholder="Confirm New Password" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
// // //             </div>
// // //             <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
// // //                 Update Password
// // //             </button>
// // //         </div>
// // //         <div>
// // //             <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
// // //             <button className="px-4 py-2 bg-accent text-white rounded-md hover:bg-yellow-600 transition-colors duration-200">
// // //                 Enable 2FA
// // //             </button>
// // //         </div>
// // //     </div>
// // // );
// // //
// // // const PaymentMethods = () => (
// // //     <div>
// // //         <h2 className="text-2xl font-semibold mb-4 text-text">Payment Methods</h2>
// // //         <div className="space-y-4">
// // //             <div className="flex items-center justify-between p-4 border border-gray-300 rounded-md">
// // //                 <div className="flex items-center">
// // //                     <FiCreditCard className="text-2xl mr-4" />
// // //                     <div>
// // //                         <p className="font-medium">Visa ending in 1234</p>
// // //                         <p className="text-sm text-gray-600">Expires 12/2024</p>
// // //                     </div>
// // //                 </div>
// // //                 <button className="text-red-500 hover:text-red-600">Remove</button>
// // //             </div>
// // //             <button className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
// // //                 Add New Payment Method
// // //             </button>
// // //         </div>
// // //     </div>
// // // );
// // //
// // // const OrderHistory = () => (
// // //     <div>
// // //         <h2 className="text-2xl font-semibold mb-4 text-text">Order History</h2>
// // //         <div className="space-y-4">
// // //             {[1, 2, 3].map((order) => (
// // //                 <div key={order} className="p-4 border border-gray-300 rounded-md">
// // //                     <div className="flex justify-between items-center mb-2">
// // //                         <p className="font-medium">Order #{order}12345</p>
// // //                         <p className="text-sm text-gray-600">Placed on: 01/01/2023</p>
// // //                     </div>
// // //                     <p className="text-sm text-gray-600 mb-2">Order details go here.</p>
// // //                     <button className="text-blue-500 hover:text-blue-600">View Order</button>
// // //                 </div>
// // //             ))}
// // //         </div>
// // //     </div>
// // // );
// // //
// // // const Wishlist = () => (
// // //     <div>
// // //         <h2 className="text-2xl font-semibold mb-4 text-text">Wishlist</h2>
// // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // //             {[1, 2, 3, 4].map((item) => (
// // //                 <div key={item} className="p-4 border border-gray-300 rounded-md">
// // //                     <h3 className="font-medium mb-2">Product {item}</h3>
// // //                     <p className="text-sm text-gray-600 mb-2">Product description goes here.</p>
// // //                     <button className="text-blue-500 hover:text-blue-600">View Product</button>
// // //                 </div>
// // //             ))}
// // //         </div>
// // //     </div>
// // // );
// // //
// // // const AccountSettings = () => (
// // //     <div>
// // //         <h2 className="text-2xl font-semibold mb-4 text-text">Account Settings</h2>
// // //         <button className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
// // //             Update Settings
// // //         </button>
// // //     </div>
// // // );
// // //
// // // export default UserProfile;
// // //
// // // //
// // // // import React, { useState } from 'react';
// // // // import { motion } from 'framer-motion';
// // // // import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiCreditCard, FiPackage, FiHeart, FiSettings, FiLogOut } from 'react-icons/fi';
// // // //
// // // // const UserProfile = () => {
// // // //     const [activeTab, setActiveTab] = useState('personal');
// // // //
// // // //     const user = {
// // // //         name: 'John Doe',
// // // //         email: 'john.doe@example.com',
// // // //         phone: '+1 (555) 123-4567',
// // // //         address: '123 Main St, Anytown, USA 12345',
// // // //         avatar: 'https://via.placeholder.com/150',
// // // //     };
// // // //
// // // //     const tabs = [
// // // //         { id: 'personal', label: 'Personal Info', icon: FiUser },
// // // //         { id: 'security', label: 'Security', icon: FiLock },
// // // //         { id: 'payment', label: 'Payment Methods', icon: FiCreditCard },
// // // //         { id: 'orders', label: 'Order History', icon: FiPackage },
// // // //         { id: 'wishlist', label: 'Wishlist', icon: FiHeart },
// // // //         { id: 'settings', label: 'Settings', icon: FiSettings },
// // // //     ];
// // // //
// // // //     const TabContent = ({ tabId }) => {
// // // //         switch (tabId) {
// // // //             case 'personal':
// // // //                 return <PersonalInfo user={user} />;
// // // //             case 'security':
// // // //                 return <SecuritySettings />;
// // // //             case 'payment':
// // // //                 return <PaymentMethods />;
// // // //             case 'orders':
// // // //                 return <OrderHistory />;
// // // //             case 'wishlist':
// // // //                 return <Wishlist />;
// // // //             case 'settings':
// // // //                 return <AccountSettings />;
// // // //             default:
// // // //                 return null;
// // // //         }
// // // //     };
// // // //
// // // //     return (
// // // //         <div className="container mx-auto px-4 py-8">
// // // //             <h1 className="text-3xl font-bold mb-8">My Profile</h1>
// // // //             <div className="flex flex-col md:flex-row gap-8">
// // // //                 <aside className="w-full md:w-1/4">
// // // //                     <div className="bg-white rounded-lg shadow-md p-6 mb-6">
// // // //                         <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full mx-auto mb-4" />
// // // //                         <h2 className="text-xl font-semibold text-center mb-2">{user.name}</h2>
// // // //                         <p className="text-gray-600 text-center">{user.email}</p>
// // // //                     </div>
// // // //                     <nav className="bg-white rounded-lg shadow-md p-4">
// // // //                         {tabs.map((tab) => (
// // // //                             <button
// // // //                                 key={tab.id}
// // // //                                 onClick={() => setActiveTab(tab.id)}
// // // //                                 className={`flex items-center w-full px-4 py-2 mb-2 rounded-md transition-colors duration-200 ${
// // // //                                     activeTab === tab.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
// // // //                                 }`}
// // // //                             >
// // // //                                 <tab.icon className="mr-3" />
// // // //                                 {tab.label}
// // // //                             </button>
// // // //                         ))}
// // // //                         <button className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-100 rounded-md transition-colors duration-200">
// // // //                             <FiLogOut className="mr-3" />
// // // //                             Logout
// // // //                         </button>
// // // //                     </nav>
// // // //                 </aside>
// // // //                 <main className="w-full md:w-3/4">
// // // //                     <motion.div
// // // //                         key={activeTab}
// // // //                         initial={{ opacity: 0, y: 20 }}
// // // //                         animate={{ opacity: 1, y: 0 }}
// // // //                         exit={{ opacity: 0, y: -20 }}
// // // //                         transition={{ duration: 0.3 }}
// // // //                         className="bg-white rounded-lg shadow-md p-6"
// // // //                     >
// // // //                         <TabContent tabId={activeTab} />
// // // //                     </motion.div>
// // // //                 </main>
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // };
// // // //
// // // // const PersonalInfo = ({ user }) => (
// // // //     <div>
// // // //         <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
// // // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // // //             <div>
// // // //                 <label className="block text-gray-700 mb-2">Full Name</label>
// // // //                 <input type="text" defaultValue={user.name} className="w-full px-3 py-2 border rounded-md" />
// // // //             </div>
// // // //             <div>
// // // //                 <label className="block text-gray-700 mb-2">Email</label>
// // // //                 <input type="email" defaultValue={user.email} className="w-full px-3 py-2 border rounded-md" />
// // // //             </div>
// // // //             <div>
// // // //                 <label className="block text-gray-700 mb-2">Phone</label>
// // // //                 <input type="tel" defaultValue={user.phone} className="w-full px-3 py-2 border rounded-md" />
// // // //             </div>
// // // //             <div>
// // // //                 <label className="block text-gray-700 mb-2">Address</label>
// // // //                 <input type="text" defaultValue={user.address} className="w-full px-3 py-2 border rounded-md" />
// // // //             </div>
// // // //         </div>
// // // //         <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
// // // //             Save Changes
// // // //         </button>
// // // //     </div>
// // // // );
// // // //
// // // // const SecuritySettings = () => (
// // // //     <div>
// // // //         <h2 className="text-2xl font-semibold mb-4">Security Settings</h2>
// // // //         <div className="mb-6">
// // // //             <h3 className="text-lg font-medium mb-2">Change Password</h3>
// // // //             <div className="space-y-4">
// // // //                 <input type="password" placeholder="Current Password" className="w-full px-3 py-2 border rounded-md" />
// // // //                 <input type="password" placeholder="New Password" className="w-full px-3 py-2 border rounded-md" />
// // // //                 <input type="password" placeholder="Confirm New Password" className="w-full px-3 py-2 border rounded-md" />
// // // //             </div>
// // // //             <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
// // // //                 Update Password
// // // //             </button>
// // // //         </div>
// // // //         <div>
// // // //             <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
// // // //             <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200">
// // // //                 Enable 2FA
// // // //             </button>
// // // //         </div>
// // // //     </div>
// // // // );
// // // //
// // // // const PaymentMethods = () => (
// // // //     <div>
// // // //         <h2 className="text-2xl font-semibold mb-4">Payment Methods</h2>
// // // //         <div className="space-y-4">
// // // //             <div className="flex items-center justify-between p-4 border rounded-md">
// // // //                 <div className="flex items-center">
// // // //                     <FiCreditCard className="text-2xl mr-4" />
// // // //                     <div>
// // // //                         <p className="font-medium">Visa ending in 1234</p>
// // // //                         <p className="text-sm text-gray-600">Expires 12/2024</p>
// // // //                     </div>
// // // //                 </div>
// // // //                 <button className="text-red-500 hover:text-red-600">Remove</button>
// // // //             </div>
// // // //             <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
// // // //                 Add New Payment Method
// // // //             </button>
// // // //         </div>
// // // //     </div>
// // // // );
// // // //
// // // // const OrderHistory = () => (
// // // //     <div>
// // // //         <h2 className="text-2xl font-semibold mb-4">Order History</h2>
// // // //         <div className="space-y-4">
// // // //             {[1, 2, 3].map((order) => (
// // // //                 <div key={order} className="p-4 border rounded-md">
// // // //                     <div className="flex justify-between items-center mb-2">
// // // //                         <p className="font-medium">Order #{order}12345</p>
// // // //                         <p className="text-sm text-gray-600">Placed on: 01/01/2023</p>
// // // //                     </div>
// // // //                     <p className="text-sm text-gray-600 mb-2">Status: Delivered</p>
// // // //                     <p className="font-medium">Total: $99.99</p>
// // // //                     <button className="mt-2 text-blue-500 hover:text-blue-600">View Details</button>
// // // //                 </div>
// // // //             ))}
// // // //         </div>
// // // //     </div>
// // // // );
// // // //
// // // // const Wishlist = () => (
// // // //     <div>
// // // //         <h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>
// // // //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
// // // //             {[1, 2, 3, 4].map((item) => (
// // // //                 <div key={item} className="border rounded-md p-4">
// // // //                     <img src={`https://via.placeholder.com/150?text=Item${item}`} alt={`Item ${item}`} className="w-full h-40 object-cover mb-2" />
// // // //                     <h3 className="font-medium">Product Name</h3>
// // // //                     <p className="text-gray-600">$49.99</p>
// // // //                     <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
// // // //                         Add to Cart
// // // //                     </button>
// // // //                 </div>
// // // //             ))}
// // // //         </div>
// // // //     </div>
// // // // );
// // // //
// // // // const AccountSettings = () => (
// // // //     <div>
// // // //         <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
// // // //         <div className="space-y-4">
// // // //             <div>
// // // //                 <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
// // // //                 <label className="flex items-center">
// // // //                     <input type="checkbox" className="mr-2" />
// // // //                     Receive order updates
// // // //                 </label>
// // // //                 <label className="flex items-center mt-2">
// // // //                     <input type="checkbox" className="mr-2" />
// // // //                     Receive promotional emails
// // // //                 </label>
// // // //             </div>
// // // //             <div>
// // // //                 <h3 className="text-lg font-medium mb-2">Privacy Settings</h3>
// // // //                 <label className="flex items-center">
// // // //                     <input type="checkbox" className="mr-2" />
// // // //                     Make my profile public
// // // //                 </label>
// // // //             </div>
// // // //             <div>
// // // //                 <h3 className="text-lg font-medium mb-2">Language Preferences</h3>
// // // //                 <select className="w-full px-3 py-2 border rounded-md">
// // // //                     <option>English</option>
// // // //                     <option>Spanish</option>
// // // //                     <option>French</option>
// // // //                 </select>
// // // //             </div>
// // // //         </div>
// // // //         <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
// // // //             Save Settings
// // // //         </button>
// // // //     </div>
// // // // );
// // // //
// // // // export default UserProfile;
// // // // // import React, { useState } from 'react';
// // // // // import { motion } from 'framer-motion';
// // // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // // import { faUser, faLock, faCreditCard, faAddressCard, faBell, faEdit, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// // // // //
// // // // // const Sidebar = ({ activeSection, setActiveSection }) => (
// // // // //     <div className="bg-white shadow-md rounded-lg p-4 mb-6">
// // // // //         <nav className="flex flex-wrap justify-between md:flex-col md:space-y-4">
// // // // //             <a
// // // // //                 href="#overview"
// // // // //                 className={`text-primary font-semibold hover:text-primary-dark px-2 py-1 md:px-0 ${activeSection === 'overview' ? 'text-primary-dark' : ''}`}
// // // // //                 onClick={() => setActiveSection('overview')}
// // // // //             >
// // // // //                 Overview
// // // // //             </a>
// // // // //             <a
// // // // //                 href="#personal-info"
// // // // //                 className={`text-primary font-semibold hover:text-primary-dark px-2 py-1 md:px-0 ${activeSection === 'personal-info' ? 'text-primary-dark' : ''}`}
// // // // //                 onClick={() => setActiveSection('personal-info')}
// // // // //             >
// // // // //                 Personal Information
// // // // //             </a>
// // // // //             <a
// // // // //                 href="#security-settings"
// // // // //                 className={`text-primary font-semibold hover:text-primary-dark px-2 py-1 md:px-0 ${activeSection === 'security-settings' ? 'text-primary-dark' : ''}`}
// // // // //                 onClick={() => setActiveSection('security-settings')}
// // // // //             >
// // // // //                 Security Settings
// // // // //             </a>
// // // // //             <a
// // // // //                 href="#payment-methods"
// // // // //                 className={`text-primary font-semibold hover:text-primary-dark px-2 py-1 md:px-0 ${activeSection === 'payment-methods' ? 'text-primary-dark' : ''}`}
// // // // //                 onClick={() => setActiveSection('payment-methods')}
// // // // //             >
// // // // //                 Payment Methods
// // // // //             </a>
// // // // //             <a
// // // // //                 href="#address-book"
// // // // //                 className={`text-primary font-semibold hover:text-primary-dark px-2 py-1 md:px-0 ${activeSection === 'address-book' ? 'text-primary-dark' : ''}`}
// // // // //                 onClick={() => setActiveSection('address-book')}
// // // // //             >
// // // // //                 Address Book
// // // // //             </a>
// // // // //             <a
// // // // //                 href="#notifications"
// // // // //                 className={`text-primary font-semibold hover:text-primary-dark px-2 py-1 md:px-0 ${activeSection === 'notifications' ? 'text-primary-dark' : ''}`}
// // // // //                 onClick={() => setActiveSection('notifications')}
// // // // //             >
// // // // //                 Notifications
// // // // //             </a>
// // // // //             <a
// // // // //                 href="#account-settings"
// // // // //                 className={`text-primary font-semibold hover:text-primary-dark px-2 py-1 md:px-0 ${activeSection === 'account-settings' ? 'text-primary-dark' : ''}`}
// // // // //                 onClick={() => setActiveSection('account-settings')}
// // // // //             >
// // // // //                 Account Settings
// // // // //             </a>
// // // // //             <a
// // // // //                 href="#sign-out"
// // // // //                 className="text-red-600 font-semibold hover:text-red-700 px-2 py-1 md:px-0"
// // // // //             >
// // // // //                 Sign Out
// // // // //             </a>
// // // // //         </nav>
// // // // //     </div>
// // // // // );
// // // // //
// // // // // const ProfileCard = ({ id, title, icon, children }) => (
// // // // //     <div id={id} className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
// // // // //         <div className="flex items-center mb-4">
// // // // //             <div className="bg-primary p-3 rounded-full mr-4">
// // // // //                 {icon}
// // // // //             </div>
// // // // //             <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
// // // // //         </div>
// // // // //         {children}
// // // // //     </div>
// // // // // );
// // // // //
// // // // // const ProfilePage = () => {
// // // // //     const [activeSection, setActiveSection] = useState('overview');
// // // // //
// // // // //     return (
// // // // //         <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
// // // // //             <div className="max-w-7xl mx-auto">
// // // // //                 <motion.h1
// // // // //                     className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12 text-center"
// // // // //                     initial={{ opacity: 0, y: -20 }}
// // // // //                     animate={{ opacity: 1, y: 0 }}
// // // // //                     transition={{ duration: 0.5 }}
// // // // //                 >
// // // // //                     User <span className="text-primary">Profile</span>
// // // // //                 </motion.h1>
// // // // //
// // // // //                 <div className="flex flex-col md:flex-row md:space-x-6">
// // // // //                     <div className="md:w-1/4 mb-6 md:mb-0">
// // // // //                         <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
// // // // //                     </div>
// // // // //
// // // // //                     <div className="md:w-3/4">
// // // // //                         <div className="space-y-6">
// // // // //                             {activeSection === 'overview' && (
// // // // //                                 <ProfileCard
// // // // //                                     id="overview"
// // // // //                                     title="User Overview"
// // // // //                                     icon={<FontAwesomeIcon icon={faUser} className="h-6 w-6 text-white" />}
// // // // //                                 >
// // // // //                                     <div className="flex flex-col items-center">
// // // // //                                         <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
// // // // //                                             <span className="text-2xl text-white">Avatar</span>
// // // // //                                         </div>
// // // // //                                         <p className="text-lg font-semibold text-gray-800">John Doe</p>
// // // // //                                         <p className="text-gray-600">john.doe@example.com</p>
// // // // //                                         <p className="text-gray-600">+1 (555) 123-4567</p>
// // // // //                                     </div>
// // // // //                                 </ProfileCard>
// // // // //                             )}
// // // // //
// // // // //                             {activeSection === 'personal-info' && (
// // // // //                                 <ProfileCard
// // // // //                                     id="personal-info"
// // // // //                                     title="Personal Information"
// // // // //                                     icon={<FontAwesomeIcon icon={faEdit} className="h-6 w-6 text-white" />}
// // // // //                                 >
// // // // //                                     <form>
// // // // //                                         <div className="mb-4">
// // // // //                                             <label htmlFor="name" className="block mb-2 text-gray-700">Name</label>
// // // // //                                             <input type="text" id="name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // //                                         </div>
// // // // //                                         <div className="mb-4">
// // // // //                                             <label htmlFor="email" className="block mb-2 text-gray-700">Email</label>
// // // // //                                             <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // //                                         </div>
// // // // //                                         <div className="mb-4">
// // // // //                                             <label htmlFor="phone" className="block mb-2 text-gray-700">Phone</label>
// // // // //                                             <input type="text" id="phone" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // //                                         </div>
// // // // //                                         <motion.button
// // // // //                                             type="submit"
// // // // //                                             className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300"
// // // // //                                             whileHover={{ scale: 1.05 }}
// // // // //                                             whileTap={{ scale: 0.95 }}
// // // // //                                         >
// // // // //                                             Save Changes
// // // // //                                         </motion.button>
// // // // //                                     </form>
// // // // //                                 </ProfileCard>
// // // // //                             )}
// // // // //
// // // // //                             {activeSection === 'security-settings' && (
// // // // //                                 <ProfileCard
// // // // //                                     id="security-settings"
// // // // //                                     title="Security Settings"
// // // // //                                     icon={<FontAwesomeIcon icon={faLock} className="h-6 w-6 text-white" />}
// // // // //                                 >
// // // // //                                     <form>
// // // // //                                         <div className="mb-4">
// // // // //                                             <label htmlFor="currentPassword" className="block mb-2 text-gray-700">Current Password</label>
// // // // //                                             <input type="password" id="currentPassword" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // //                                         </div>
// // // // //                                         <div className="mb-4">
// // // // //                                             <label htmlFor="newPassword" className="block mb-2 text-gray-700">New Password</label>
// // // // //                                             <input type="password" id="newPassword" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // //                                         </div>
// // // // //                                         <div className="mb-4">
// // // // //                                             <label htmlFor="confirmPassword" className="block mb-2 text-gray-700">Confirm Password</label>
// // // // //                                             <input type="password" id="confirmPassword" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // //                                         </div>
// // // // //                                         <motion.button
// // // // //                                             type="submit"
// // // // //                                             className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300"
// // // // //                                             whileHover={{ scale: 1.05 }}
// // // // //                                             whileTap={{ scale: 0.95 }}
// // // // //                                         >
// // // // //                                             Change Password
// // // // //                                         </motion.button>
// // // // //                                     </form>
// // // // //                                 </ProfileCard>
// // // // //                             )}
// // // // //
// // // // //                             {activeSection === 'sign-out' && (
// // // // //                                 <ProfileCard
// // // // //                                     id="sign-out"
// // // // //                                     title="Sign Out"
// // // // //                                     icon={<FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6 text-white" />}
// // // // //                                 >
// // // // //                                     <p className="text-gray-600 mb-4">If you wish to sign out of your account, click the button below.</p>
// // // // //                                     <motion.button
// // // // //                                         type="button"
// // // // //                                         className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
// // // // //                                         whileHover={{ scale: 1.05 }}
// // // // //                                         whileTap={{ scale: 0.95 }}
// // // // //                                     >
// // // // //                                         Sign Out
// // // // //                                     </motion.button>
// // // // //                                 </ProfileCard>
// // // // //                             )}
// // // // //                         </div>
// // // // //                     </div>
// // // // //                 </div>
// // // // //             </div>
// // // // //         </div>
// // // // //     );
// // // // // };
// // // // //
// // // // // export default ProfilePage;
// // // // //
// // // // // // import React, { useState } from 'react';
// // // // // // import { motion } from 'framer-motion';
// // // // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // // // import { faUser, faLock, faCreditCard, faAddressCard, faBell, faEdit, faSignOutAlt, faCog } from '@fortawesome/free-solid-svg-icons';
// // // // // //
// // // // // // const Sidebar = ({ activeSection, setActiveSection }) => {
// // // // // //     const menuItems = [
// // // // // //         { id: 'overview', icon: faUser, label: 'Overview' },
// // // // // //         { id: 'personal-info', icon: faEdit, label: 'Personal Info' },
// // // // // //         { id: 'security', icon: faLock, label: 'Security' },
// // // // // //         { id: 'payment', icon: faCreditCard, label: 'Payment' },
// // // // // //         { id: 'address', icon: faAddressCard, label: 'Address' },
// // // // // //         { id: 'notifications', icon: faBell, label: 'Notifications' },
// // // // // //         { id: 'settings', icon: faCog, label: 'Settings' },
// // // // // //     ];
// // // // // //
// // // // // //     return (
// // // // // //         <aside className="bg-gray-800 text-white w-64 min-h-screen fixed left-0 top-0 p-4">
// // // // // //             <div className="mb-8">
// // // // // //                 <h2 className="text-2xl font-bold">Profile</h2>
// // // // // //             </div>
// // // // // //             <nav>
// // // // // //                 {menuItems.map((item) => (
// // // // // //                     <motion.button
// // // // // //                         key={item.id}
// // // // // //                         className={`w-full text-left py-2 px-4 rounded-lg mb-2 flex items-center ${
// // // // // //                             activeSection === item.id ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700'
// // // // // //                         }`}
// // // // // //                         onClick={() => setActiveSection(item.id)}
// // // // // //                         whileHover={{ scale: 1.05 }}
// // // // // //                         whileTap={{ scale: 0.95 }}
// // // // // //                     >
// // // // // //                         <FontAwesomeIcon icon={item.icon} className="mr-3" />
// // // // // //                         {item.label}
// // // // // //                     </motion.button>
// // // // // //                 ))}
// // // // // //                 <motion.button
// // // // // //                     className="w-full text-left py-2 px-4 rounded-lg mb-2 flex items-center text-red-500 hover:bg-red-700 hover:text-white"
// // // // // //                     whileHover={{ scale: 1.05 }}
// // // // // //                     whileTap={{ scale: 0.95 }}
// // // // // //                 >
// // // // // //                     <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
// // // // // //                     Sign Out
// // // // // //                 </motion.button>
// // // // // //             </nav>
// // // // // //         </aside>
// // // // // //     );
// // // // // // };
// // // // // //
// // // // // // const ProfileCard = ({ title, children }) => (
// // // // // //     <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
// // // // // //         <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
// // // // // //         {children}
// // // // // //     </div>
// // // // // // );
// // // // // //
// // // // // // const ProfilePage = () => {
// // // // // //     const [activeSection, setActiveSection] = useState('overview');
// // // // // //
// // // // // //     const renderContent = () => {
// // // // // //         switch (activeSection) {
// // // // // //             case 'overview':
// // // // // //                 return (
// // // // // //                     <ProfileCard title="User Overview">
// // // // // //                         <div className="flex items-center mb-4">
// // // // // //                             <div className="w-24 h-24 bg-gray-300 rounded-full mr-4 flex items-center justify-center">
// // // // // //                                 <span className="text-2xl text-white">JD</span>
// // // // // //                             </div>
// // // // // //                             <div>
// // // // // //                                 <h2 className="text-2xl font-bold">John Doe</h2>
// // // // // //                                 <p className="text-gray-600">john.doe@example.com</p>
// // // // // //                             </div>
// // // // // //                         </div>
// // // // // //                         <p className="text-gray-700">Welcome to your profile, John! Here you can manage your personal information, security settings, and more.</p>
// // // // // //                     </ProfileCard>
// // // // // //                 );
// // // // // //             case 'personal-info':
// // // // // //                 return (
// // // // // //                     <ProfileCard title="Personal Information">
// // // // // //                         <form>
// // // // // //                             <div className="mb-4">
// // // // // //                                 <label htmlFor="name" className="block mb-2 text-gray-700">Name</label>
// // // // // //                                 <input type="text" id="name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // //                             </div>
// // // // // //                             <div className="mb-4">
// // // // // //                                 <label htmlFor="email" className="block mb-2 text-gray-700">Email</label>
// // // // // //                                 <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // //                             </div>
// // // // // //                             <div className="mb-4">
// // // // // //                                 <label htmlFor="phone" className="block mb-2 text-gray-700">Phone</label>
// // // // // //                                 <input type="text" id="phone" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // //                             </div>
// // // // // //                             <motion.button
// // // // // //                                 type="submit"
// // // // // //                                 className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300"
// // // // // //                                 whileHover={{ scale: 1.05 }}
// // // // // //                                 whileTap={{ scale: 0.95 }}
// // // // // //                             >
// // // // // //                                 Save Changes
// // // // // //                             </motion.button>
// // // // // //                         </form>
// // // // // //                     </ProfileCard>
// // // // // //                 );
// // // // // //             case 'security':
// // // // // //                 return (
// // // // // //                     <ProfileCard title="Security Settings">
// // // // // //                         <form>
// // // // // //                             <div className="mb-4">
// // // // // //                                 <label htmlFor="currentPassword" className="block mb-2 text-gray-700">Current Password</label>
// // // // // //                                 <input type="password" id="currentPassword" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // //                             </div>
// // // // // //                             <div className="mb-4">
// // // // // //                                 <label htmlFor="newPassword" className="block mb-2 text-gray-700">New Password</label>
// // // // // //                                 <input type="password" id="newPassword" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // //                             </div>
// // // // // //                             <div className="mb-4">
// // // // // //                                 <label htmlFor="confirmPassword" className="block mb-2 text-gray-700">Confirm Password</label>
// // // // // //                                 <input type="password" id="confirmPassword" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // //                             </div>
// // // // // //                             <motion.button
// // // // // //                                 type="submit"
// // // // // //                                 className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300"
// // // // // //                                 whileHover={{ scale: 1.05 }}
// // // // // //                                 whileTap={{ scale: 0.95 }}
// // // // // //                             >
// // // // // //                                 Change Password
// // // // // //                             </motion.button>
// // // // // //                         </form>
// // // // // //                     </ProfileCard>
// // // // // //                 );
// // // // // //             // Add cases for other sections (payment, address, notifications, settings) here
// // // // // //             default:
// // // // // //                 return <div>Select a section from the sidebar</div>;
// // // // // //         }
// // // // // //     };
// // // // // //
// // // // // //     return (
// // // // // //         <div className="bg-gray-100 min-h-screen">
// // // // // //             <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
// // // // // //             <main className="ml-64 p-8">
// // // // // //                 <motion.div
// // // // // //                     initial={{ opacity: 0, y: 20 }}
// // // // // //                     animate={{ opacity: 1, y: 0 }}
// // // // // //                     transition={{ duration: 0.5 }}
// // // // // //                 >
// // // // // //                     {renderContent()}
// // // // // //                 </motion.div>
// // // // // //             </main>
// // // // // //         </div>
// // // // // //     );
// // // // // // };
// // // // // //
// // // // // // export default ProfilePage;
// // // // // // // import React from 'react';
// // // // // // // import { motion } from 'framer-motion';
// // // // // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // // // // import { faUser, faLock, faCreditCard, faAddressCard, faBell, faEdit, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// // // // // // //
// // // // // // // const ProfileCard = ({ title, icon, children }) => (
// // // // // // //     <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
// // // // // // //         <div className="flex items-center mb-4">
// // // // // // //             <div className="bg-primary p-3 rounded-full mr-4">
// // // // // // //                 {icon}
// // // // // // //             </div>
// // // // // // //             <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
// // // // // // //         </div>
// // // // // // //         {children}
// // // // // // //     </div>
// // // // // // // );
// // // // // // //
// // // // // // // const ProfilePage = () => {
// // // // // // //     return (
// // // // // // //         <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
// // // // // // //             <div className="max-w-5xl mx-auto">
// // // // // // //                 <motion.h1
// // // // // // //                     className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12 text-center"
// // // // // // //                     initial={{ opacity: 0, y: -20 }}
// // // // // // //                     animate={{ opacity: 1, y: 0 }}
// // // // // // //                     transition={{ duration: 0.5 }}
// // // // // // //                 >
// // // // // // //                     User <span className="text-primary">Profile</span>
// // // // // // //                 </motion.h1>
// // // // // // //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
// // // // // // //                     {/* User Overview */}
// // // // // // //                     <ProfileCard
// // // // // // //                         title="User Overview"
// // // // // // //                         icon={<FontAwesomeIcon icon={faUser} className="h-6 w-6 text-white" />}
// // // // // // //                     >
// // // // // // //                         <div className="flex flex-col items-center">
// // // // // // //                             <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
// // // // // // //                                 <span className="text-2xl text-white">Avatar</span>
// // // // // // //                             </div>
// // // // // // //                             <p className="text-lg font-semibold text-gray-800">John Doe</p>
// // // // // // //                             <p className="text-gray-600">john.doe@example.com</p>
// // // // // // //                             <p className="text-gray-600">+1 (555) 123-4567</p>
// // // // // // //                         </div>
// // // // // // //                     </ProfileCard>
// // // // // // //
// // // // // // //                     {/* Personal Information */}
// // // // // // //                     <ProfileCard
// // // // // // //                         title="Personal Information"
// // // // // // //                         icon={<FontAwesomeIcon icon={faEdit} className="h-6 w-6 text-white" />}
// // // // // // //                     >
// // // // // // //                         <form>
// // // // // // //                             <div className="mb-4">
// // // // // // //                                 <label htmlFor="name" className="block mb-2 text-gray-700">Name</label>
// // // // // // //                                 <input type="text" id="name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // //                             </div>
// // // // // // //                             <div className="mb-4">
// // // // // // //                                 <label htmlFor="email" className="block mb-2 text-gray-700">Email</label>
// // // // // // //                                 <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // //                             </div>
// // // // // // //                             <div className="mb-4">
// // // // // // //                                 <label htmlFor="phone" className="block mb-2 text-gray-700">Phone</label>
// // // // // // //                                 <input type="text" id="phone" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // //                             </div>
// // // // // // //                             <motion.button
// // // // // // //                                 type="submit"
// // // // // // //                                 className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300"
// // // // // // //                                 whileHover={{ scale: 1.05 }}
// // // // // // //                                 whileTap={{ scale: 0.95 }}
// // // // // // //                             >
// // // // // // //                                 Save Changes
// // // // // // //                             </motion.button>
// // // // // // //                         </form>
// // // // // // //                     </ProfileCard>
// // // // // // //
// // // // // // //                     {/* Security Settings */}
// // // // // // //                     <ProfileCard
// // // // // // //                         title="Security Settings"
// // // // // // //                         icon={<FontAwesomeIcon icon={faLock} className="h-6 w-6 text-white" />}
// // // // // // //                     >
// // // // // // //                         <form>
// // // // // // //                             <div className="mb-4">
// // // // // // //                                 <label htmlFor="currentPassword" className="block mb-2 text-gray-700">Current Password</label>
// // // // // // //                                 <input type="password" id="currentPassword" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // //                             </div>
// // // // // // //                             <div className="mb-4">
// // // // // // //                                 <label htmlFor="newPassword" className="block mb-2 text-gray-700">New Password</label>
// // // // // // //                                 <input type="password" id="newPassword" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // //                             </div>
// // // // // // //                             <div className="mb-4">
// // // // // // //                                 <label htmlFor="confirmPassword" className="block mb-2 text-gray-700">Confirm Password</label>
// // // // // // //                                 <input type="password" id="confirmPassword" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // //                             </div>
// // // // // // //                             <motion.button
// // // // // // //                                 type="submit"
// // // // // // //                                 className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300"
// // // // // // //                                 whileHover={{ scale: 1.05 }}
// // // // // // //                                 whileTap={{ scale: 0.95 }}
// // // // // // //                             >
// // // // // // //                                 Change Password
// // // // // // //                             </motion.button>
// // // // // // //                         </form>
// // // // // // //                     </ProfileCard>
// // // // // // //
// // // // // // //                     {/* Payment Methods */}
// // // // // // //                     <ProfileCard
// // // // // // //                         title="Payment Methods"
// // // // // // //                         icon={<FontAwesomeIcon icon={faCreditCard} className="h-6 w-6 text-white" />}
// // // // // // //                     >
// // // // // // //                         <p className="text-gray-600 mb-4">Manage your payment methods here. You can add, remove, or update your payment information.</p>
// // // // // // //                         {/* Payment methods UI goes here */}
// // // // // // //                     </ProfileCard>
// // // // // // //
// // // // // // //                     {/* Address Book */}
// // // // // // //                     <ProfileCard
// // // // // // //                         title="Address Book"
// // // // // // //                         icon={<FontAwesomeIcon icon={faAddressCard} className="h-6 w-6 text-white" />}
// // // // // // //                     >
// // // // // // //                         <p className="text-gray-600 mb-4">View and manage your saved addresses for shipping and billing purposes.</p>
// // // // // // //                         {/* Address management UI goes here */}
// // // // // // //                     </ProfileCard>
// // // // // // //
// // // // // // //                     {/* Notifications */}
// // // // // // //                     <ProfileCard
// // // // // // //                         title="Notifications"
// // // // // // //                         icon={<FontAwesomeIcon icon={faBell} className="h-6 w-6 text-white" />}
// // // // // // //                     >
// // // // // // //                         <p className="text-gray-600 mb-4">Manage your notification preferences and settings.</p>
// // // // // // //                         {/* Notification settings UI goes here */}
// // // // // // //                     </ProfileCard>
// // // // // // //
// // // // // // //                     {/* Account Settings */}
// // // // // // //                     <ProfileCard
// // // // // // //                         title="Account Settings"
// // // // // // //                         icon={<FontAwesomeIcon icon={faEdit} className="h-6 w-6 text-white" />}
// // // // // // //                     >
// // // // // // //                         <p className="text-gray-600 mb-4">Adjust your account settings and preferences.</p>
// // // // // // //                         {/* Account settings UI goes here */}
// // // // // // //                     </ProfileCard>
// // // // // // //
// // // // // // //                     {/* Sign Out */}
// // // // // // //                     <ProfileCard
// // // // // // //                         title="Sign Out"
// // // // // // //                         icon={<FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6 text-white" />}
// // // // // // //                     >
// // // // // // //                         <p className="text-gray-600 mb-4">If you wish to sign out of your account, click the button below.</p>
// // // // // // //                         <motion.button
// // // // // // //                             type="button"
// // // // // // //                             className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
// // // // // // //                             whileHover={{ scale: 1.05 }}
// // // // // // //                             whileTap={{ scale: 0.95 }}
// // // // // // //                         >
// // // // // // //                             Sign Out
// // // // // // //                         </motion.button>
// // // // // // //                     </ProfileCard>
// // // // // // //                 </div>
// // // // // // //             </div>
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // };
// // // // // // //
// // // // // // // export default ProfilePage;
// // // // // // //
// // // // // // // //
// // // // // // // // import React from 'react';
// // // // // // // // import { motion } from 'framer-motion';
// // // // // // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // // // // // import { faUser, faLock, faCreditCard, faAddressCard, faBell, faEdit, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
// // // // // // // //
// // // // // // // // const ProfileCard = ({ title, icon, children }) => (
// // // // // // // //     <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
// // // // // // // //         <div className="flex items-center mb-4">
// // // // // // // //             <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
// // // // // // // //                 {icon}
// // // // // // // //             </div>
// // // // // // // //             <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
// // // // // // // //         </div>
// // // // // // // //         {children}
// // // // // // // //     </div>
// // // // // // // // );
// // // // // // // //
// // // // // // // // const ProfilePage = () => {
// // // // // // // //     return (
// // // // // // // //         <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
// // // // // // // //             <div className="max-w-7xl mx-auto">
// // // // // // // //                 <motion.h1
// // // // // // // //                     className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center"
// // // // // // // //                     initial={{ opacity: 0, y: -20 }}
// // // // // // // //                     animate={{ opacity: 1, y: 0 }}
// // // // // // // //                     transition={{ duration: 0.5 }}
// // // // // // // //                 >
// // // // // // // //                     User <span className="text-primary">Profile</span>
// // // // // // // //                 </motion.h1>
// // // // // // // //                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// // // // // // // //                     {/* User Overview */}
// // // // // // // //                     <ProfileCard
// // // // // // // //                         title="User Overview"
// // // // // // // //                         icon={<FontAwesomeIcon icon={faUser} className="h-6 w-6 text-primary" />}
// // // // // // // //                     >
// // // // // // // //                         <div className="flex flex-col items-center">
// // // // // // // //                             <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 flex items-center justify-center">
// // // // // // // //                                 <span className="text-xl text-white">Avatar</span>
// // // // // // // //                             </div>
// // // // // // // //                             <p className="text-lg font-semibold">John Doe</p>
// // // // // // // //                             <p className="text-gray-600">john.doe@example.com</p>
// // // // // // // //                             <p className="text-gray-600">+1 (555) 123-4567</p>
// // // // // // // //                         </div>
// // // // // // // //                     </ProfileCard>
// // // // // // // //
// // // // // // // //                     {/* Personal Information */}
// // // // // // // //                     <ProfileCard
// // // // // // // //                         title="Personal Information"
// // // // // // // //                         icon={<FontAwesomeIcon icon={faEdit} className="h-6 w-6 text-primary" />}
// // // // // // // //                     >
// // // // // // // //                         <form>
// // // // // // // //                             <div className="mb-4">
// // // // // // // //                                 <label htmlFor="name" className="block mb-2 font-medium">Name</label>
// // // // // // // //                                 <input type="text" id="name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // // //                             </div>
// // // // // // // //                             <div className="mb-4">
// // // // // // // //                                 <label htmlFor="email" className="block mb-2 font-medium">Email</label>
// // // // // // // //                                 <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // // //                             </div>
// // // // // // // //                             <div className="mb-4">
// // // // // // // //                                 <label htmlFor="phone" className="block mb-2 font-medium">Phone</label>
// // // // // // // //                                 <input type="text" id="phone" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // // //                             </div>
// // // // // // // //                             <motion.button
// // // // // // // //                                 type="submit"
// // // // // // // //                                 className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300"
// // // // // // // //                                 whileHover={{ scale: 1.05 }}
// // // // // // // //                                 whileTap={{ scale: 0.95 }}
// // // // // // // //                             >
// // // // // // // //                                 Save Changes
// // // // // // // //                             </motion.button>
// // // // // // // //                         </form>
// // // // // // // //                     </ProfileCard>
// // // // // // // //
// // // // // // // //                     {/* Security Settings */}
// // // // // // // //                     <ProfileCard
// // // // // // // //                         title="Security Settings"
// // // // // // // //                         icon={<FontAwesomeIcon icon={faLock} className="h-6 w-6 text-primary" />}
// // // // // // // //                     >
// // // // // // // //                         <form>
// // // // // // // //                             <div className="mb-4">
// // // // // // // //                                 <label htmlFor="currentPassword" className="block mb-2 font-medium">Current Password</label>
// // // // // // // //                                 <input type="password" id="currentPassword" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // // //                             </div>
// // // // // // // //                             <div className="mb-4">
// // // // // // // //                                 <label htmlFor="newPassword" className="block mb-2 font-medium">New Password</label>
// // // // // // // //                                 <input type="password" id="newPassword" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // // //                             </div>
// // // // // // // //                             <div className="mb-4">
// // // // // // // //                                 <label htmlFor="confirmPassword" className="block mb-2 font-medium">Confirm Password</label>
// // // // // // // //                                 <input type="password" id="confirmPassword" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // // //                             </div>
// // // // // // // //                             <motion.button
// // // // // // // //                                 type="submit"
// // // // // // // //                                 className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300"
// // // // // // // //                                 whileHover={{ scale: 1.05 }}
// // // // // // // //                                 whileTap={{ scale: 0.95 }}
// // // // // // // //                             >
// // // // // // // //                                 Change Password
// // // // // // // //                             </motion.button>
// // // // // // // //                         </form>
// // // // // // // //                     </ProfileCard>
// // // // // // // //
// // // // // // // //                     {/* Payment Methods */}
// // // // // // // //                     <ProfileCard
// // // // // // // //                         title="Payment Methods"
// // // // // // // //                         icon={<FontAwesomeIcon icon={faCreditCard} className="h-6 w-6 text-primary" />}
// // // // // // // //                     >
// // // // // // // //                         <p className="text-gray-600 mb-4">Manage your payment methods here. You can add, remove, or update your payment information.</p>
// // // // // // // //                         {/* Payment methods UI goes here */}
// // // // // // // //                     </ProfileCard>
// // // // // // // //
// // // // // // // //                     {/* Address Book */}
// // // // // // // //                     <ProfileCard
// // // // // // // //                         title="Address Book"
// // // // // // // //                         icon={<FontAwesomeIcon icon={faAddressCard} className="h-6 w-6 text-primary" />}
// // // // // // // //                     >
// // // // // // // //                         <p className="text-gray-600 mb-4">View and manage your saved addresses for shipping and billing purposes.</p>
// // // // // // // //                         {/* Address management UI goes here */}
// // // // // // // //                     </ProfileCard>
// // // // // // // //
// // // // // // // //                     {/* Notifications */}
// // // // // // // //                     <ProfileCard
// // // // // // // //                         title="Notifications"
// // // // // // // //                         icon={<FontAwesomeIcon icon={faBell} className="h-6 w-6 text-primary" />}
// // // // // // // //                     >
// // // // // // // //                         <p className="text-gray-600 mb-4">Manage your notification preferences and settings.</p>
// // // // // // // //                         {/* Notification settings UI goes here */}
// // // // // // // //                     </ProfileCard>
// // // // // // // //
// // // // // // // //                     {/* Account Settings */}
// // // // // // // //                     <ProfileCard
// // // // // // // //                         title="Account Settings"
// // // // // // // //                         icon={<FontAwesomeIcon icon={faEdit} className="h-6 w-6 text-primary" />}
// // // // // // // //                     >
// // // // // // // //                         <p className="text-gray-600 mb-4">Adjust your account settings and preferences.</p>
// // // // // // // //                         {/* Account settings UI goes here */}
// // // // // // // //                     </ProfileCard>
// // // // // // // //
// // // // // // // //                     {/* Sign Out */}
// // // // // // // //                     <ProfileCard
// // // // // // // //                         title="Sign Out"
// // // // // // // //                         icon={<FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6 text-primary" />}
// // // // // // // //                     >
// // // // // // // //                         <p className="text-gray-600 mb-4">If you wish to sign out of your account, click the button below.</p>
// // // // // // // //                         <motion.button
// // // // // // // //                             type="button"
// // // // // // // //                             className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
// // // // // // // //                             whileHover={{ scale: 1.05 }}
// // // // // // // //                             whileTap={{ scale: 0.95 }}
// // // // // // // //                         >
// // // // // // // //                             Sign Out
// // // // // // // //                         </motion.button>
// // // // // // // //                     </ProfileCard>
// // // // // // // //                 </div>
// // // // // // // //             </div>
// // // // // // // //         </div>
// // // // // // // //     );
// // // // // // // // };
// // // // // // // //
// // // // // // // // export default ProfilePage;
// // // // // // // //
// // // // // // // // // import React from 'react';
// // // // // // // // // import { motion } from 'framer-motion';
// // // // // // // // // import { faUser, faEdit, faLock, faCreditCard, faSignOutAlt, faAddressCard, faBell } from '@fortawesome/free-solid-svg-icons';
// // // // // // // // // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // // // // // // // //
// // // // // // // // // const ProfileSection = ({ icon, title, children }) => (
// // // // // // // // //     <div className="bg-white shadow-md rounded-lg p-6 mb-6">
// // // // // // // // //         <div className="flex items-center mb-4">
// // // // // // // // //             <div className="bg-primary bg-opacity-10 p-3 rounded-full mr-4">
// // // // // // // // //                 {icon}
// // // // // // // // //             </div>
// // // // // // // // //             <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
// // // // // // // // //         </div>
// // // // // // // // //         {children}
// // // // // // // // //     </div>
// // // // // // // // // );
// // // // // // // // //
// // // // // // // // // const ProfilePage = () => {
// // // // // // // // //     return (
// // // // // // // // //         <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
// // // // // // // // //             <div className="max-w-7xl mx-auto">
// // // // // // // // //                 <motion.h2
// // // // // // // // //                     className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8 text-center"
// // // // // // // // //                     initial={{ opacity: 0, y: -20 }}
// // // // // // // // //                     animate={{ opacity: 1, y: 0 }}
// // // // // // // // //                     transition={{ duration: 0.5 }}
// // // // // // // // //                 >
// // // // // // // // //                     User <span className="text-primary">Profile</span>
// // // // // // // // //                 </motion.h2>
// // // // // // // // //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// // // // // // // // //                     {/* Personal Information */}
// // // // // // // // //                     <ProfileSection
// // // // // // // // //                         icon={<FontAwesomeIcon icon={faUser} className="h-6 w-6 text-primary" />}
// // // // // // // // //                         title="Personal Information"
// // // // // // // // //                     >
// // // // // // // // //                         <form>
// // // // // // // // //                             <div className="mb-4">
// // // // // // // // //                                 <label htmlFor="name" className="block mb-2 font-medium">Name</label>
// // // // // // // // //                                 <input type="text" id="name" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // // // //                             </div>
// // // // // // // // //                             <div className="mb-4">
// // // // // // // // //                                 <label htmlFor="email" className="block mb-2 font-medium">Email</label>
// // // // // // // // //                                 <input type="email" id="email" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // // // //                             </div>
// // // // // // // // //                             <div className="mb-4">
// // // // // // // // //                                 <label htmlFor="phone" className="block mb-2 font-medium">Phone</label>
// // // // // // // // //                                 <input type="text" id="phone" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // // // //                             </div>
// // // // // // // // //                             <motion.button
// // // // // // // // //                                 type="submit"
// // // // // // // // //                                 className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300"
// // // // // // // // //                                 whileHover={{ scale: 1.05 }}
// // // // // // // // //                                 whileTap={{ scale: 0.95 }}
// // // // // // // // //                             >
// // // // // // // // //                                 Save Changes
// // // // // // // // //                             </motion.button>
// // // // // // // // //                         </form>
// // // // // // // // //                     </ProfileSection>
// // // // // // // // //
// // // // // // // // //                     {/* Change Password */}
// // // // // // // // //                     <ProfileSection
// // // // // // // // //                         icon={<FontAwesomeIcon icon={faLock} className="h-6 w-6 text-primary" />}
// // // // // // // // //                         title="Change Password"
// // // // // // // // //                     >
// // // // // // // // //                         <form>
// // // // // // // // //                             <div className="mb-4">
// // // // // // // // //                                 <label htmlFor="currentPassword" className="block mb-2 font-medium">Current Password</label>
// // // // // // // // //                                 <input type="password" id="currentPassword" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // // // //                             </div>
// // // // // // // // //                             <div className="mb-4">
// // // // // // // // //                                 <label htmlFor="newPassword" className="block mb-2 font-medium">New Password</label>
// // // // // // // // //                                 <input type="password" id="newPassword" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // // // //                             </div>
// // // // // // // // //                             <div className="mb-4">
// // // // // // // // //                                 <label htmlFor="confirmPassword" className="block mb-2 font-medium">Confirm Password</label>
// // // // // // // // //                                 <input type="password" id="confirmPassword" className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
// // // // // // // // //                             </div>
// // // // // // // // //                             <motion.button
// // // // // // // // //                                 type="submit"
// // // // // // // // //                                 className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300"
// // // // // // // // //                                 whileHover={{ scale: 1.05 }}
// // // // // // // // //                                 whileTap={{ scale: 0.95 }}
// // // // // // // // //                             >
// // // // // // // // //                                 Change Password
// // // // // // // // //                             </motion.button>
// // // // // // // // //                         </form>
// // // // // // // // //                     </ProfileSection>
// // // // // // // // //
// // // // // // // // //                     {/* Payment Methods */}
// // // // // // // // //                     <ProfileSection
// // // // // // // // //                         icon={<FontAwesomeIcon icon={faCreditCard} className="h-6 w-6 text-primary" />}
// // // // // // // // //                         title="Payment Methods"
// // // // // // // // //                     >
// // // // // // // // //                         <p className="text-gray-600 mb-4">Manage your payment methods here. You can add, remove, or update your payment information.</p>
// // // // // // // // //                         {/* Add your payment method management UI here */}
// // // // // // // // //                     </ProfileSection>
// // // // // // // // //
// // // // // // // // //                     {/* Address Book */}
// // // // // // // // //                     <ProfileSection
// // // // // // // // //                         icon={<FontAwesomeIcon icon={faAddressCard} className="h-6 w-6 text-primary" />}
// // // // // // // // //                         title="Address Book"
// // // // // // // // //                     >
// // // // // // // // //                         <p className="text-gray-600 mb-4">View and manage your saved addresses for shipping and billing purposes.</p>
// // // // // // // // //                         {/* Add your address book management UI here */}
// // // // // // // // //                     </ProfileSection>
// // // // // // // // //
// // // // // // // // //                     {/* Notifications */}
// // // // // // // // //                     <ProfileSection
// // // // // // // // //                         icon={<FontAwesomeIcon icon={faBell} className="h-6 w-6 text-primary" />}
// // // // // // // // //                         title="Notifications"
// // // // // // // // //                     >
// // // // // // // // //                         <p className="text-gray-600 mb-4">Manage your notification preferences and settings.</p>
// // // // // // // // //                         {/* Add your notification management UI here */}
// // // // // // // // //                     </ProfileSection>
// // // // // // // // //
// // // // // // // // //                     {/* Account Settings */}
// // // // // // // // //                     <ProfileSection
// // // // // // // // //                         icon={<FontAwesomeIcon icon={faEdit} className="h-6 w-6 text-primary" />}
// // // // // // // // //                         title="Account Settings"
// // // // // // // // //                     >
// // // // // // // // //                         <p className="text-gray-600 mb-4">Adjust your account settings and preferences.</p>
// // // // // // // // //                         {/* Add your account settings management UI here */}
// // // // // // // // //                     </ProfileSection>
// // // // // // // // //
// // // // // // // // //                     {/* Sign Out */}
// // // // // // // // //                     <ProfileSection
// // // // // // // // //                         icon={<FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6 text-primary" />}
// // // // // // // // //                         title="Sign Out"
// // // // // // // // //                     >
// // // // // // // // //                         <p className="text-gray-600 mb-4">If you wish to sign out of your account, click the button below.</p>
// // // // // // // // //                         <motion.button
// // // // // // // // //                             type="button"
// // // // // // // // //                             className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
// // // // // // // // //                             whileHover={{ scale: 1.05 }}
// // // // // // // // //                             whileTap={{ scale: 0.95 }}
// // // // // // // // //                         >
// // // // // // // // //                             Sign Out
// // // // // // // // //                         </motion.button>
// // // // // // // // //                     </ProfileSection>
// // // // // // // // //                 </div>
// // // // // // // // //             </div>
// // // // // // // // //         </div>
// // // // // // // // //     );
// // // // // // // // // };
// // // // // // // // //
// // // // // // // // // export default ProfilePage;
