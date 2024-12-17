import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import CommonLink from "../components/CommonLink";
import { FaBox, FaCog, FaFileAlt, FaTachometerAlt, FaUser, FaGem, FaBars, FaTimes, FaBell, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Dropdown from "../components/Dropdown";

// Updated menu items with sub-menu for Categories
const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt className="text-primary" /> },
    { name: 'Orders', path: '/admin/orders', icon: <FaBox className="text-primary" /> },
    {
        name: 'Categories',
        path: '/admin/categories',
        icon: <FaGem className="text-primary" />
    },
    { name: 'Products', path: '/admin/products', icon: <FaGem className="text-primary" /> },
    { name: 'Customers', path: '/admin/customers', icon: <FaUser className="text-primary" /> },
    { name: 'Reports', path: '/admin/reports', icon: <FaFileAlt className="text-primary" /> },
    { name: 'Settings', path: '/admin/settings', icon: <FaCog className="text-primary" /> },
];

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState(null); // Sub-menu state
    const sidebarRef = useRef(null);
    const location = useLocation();

    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setIsSidebarOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleSubMenu = (menuName) => {
        setOpenSubMenu(openSubMenu === menuName ? null : menuName);
    };

    return (
        <div className="flex h-screen bg-bg-color">
            {/* Sidebar */}
            <aside
                ref={sidebarRef}
                className={`fixed inset-0 lg:relative bg-white border-r border-gray-200 w-64 p-4 shadow-lg transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative z-30 rounded-r-lg lg:rounded-none`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-primary font-bold text-2xl">Jewel Admin</h1>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-600 hover:text-gray-900"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>
                <nav>
                    <ul className="space-y-2">
                        {menuItems.map((item) => (
                            <li key={item.path}>
                                {item.subItems ? (
                                    <>
                                        {/* Parent item with dropdown */}
                                        <button
                                            className={`flex justify-between items-center w-full text-left text-gray-700 hover:bg-gray-200 p-3 rounded-lg transition-colors duration-200 ${location.pathname.startsWith(item.path) ? 'bg-gray-300 font-semibold' : ''}`}
                                            onClick={() => toggleSubMenu(item.name)}
                                        >
                                            <div className="flex items-center">
                                                {item.icon}
                                                <span className="ml-3 text-lg">{item.name}</span>
                                            </div>
                                            {openSubMenu === item.name ? <FaChevronUp /> : <FaChevronDown />}
                                        </button>
                                        {/* Sub-menu items */}
                                        {openSubMenu === item.name && (
                                            <ul className="pl-8 mt-2 space-y-1">
                                                {item.subItems.map((subItem) => (
                                                    <li key={subItem.path}>
                                                        <Link
                                                            to={subItem.path}
                                                            className={`block text-gray-600 hover:bg-gray-200 p-2 rounded-lg transition-colors duration-200 ${location.pathname === subItem.path ? 'bg-gray-300 font-semibold' : ''}`}
                                                        >
                                                            {subItem.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                ) : (
                                    <CommonLink
                                        to={item.path}
                                        icon={item.icon}
                                        className={`flex items-center text-gray-700 hover:bg-gray-200 p-3 rounded-lg transition-colors duration-200 ${location.pathname === item.path ? 'bg-gray-300 font-semibold' : ''}`}
                                    >
                                        <span className="ml-3 text-lg">{item.name}</span>
                                    </CommonLink>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white shadow-md p-4 flex justify-between items-center lg:pl-64">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                        <FaBars size={24} />
                    </button>
                    <h2 className="text-2xl font-semibold text-primary">
                        Welcome to Your Jewelry Store <span className="text-secondary">Admin Dashboard</span>
                    </h2>
                    <div className="flex items-center space-x-4">
                        <Dropdown
                            icon={<FaBell size={24} className="text-secondary" />}
                            menuItems={[
                                { label: 'New Notification', link: '#' },
                                { label: 'Notification Settings', link: '#' },
                            ]}
                            title="Notifications"
                            badgeCount={5} // Adjust as needed
                        />
                        <Dropdown
                            icon={<FaUser size={24} className="text-secondary" />}
                            menuItems={[
                                { label: 'Profile', link: '#' },
                                { label: 'Logout', link: '#' },
                            ]}
                            title="User Profile"
                        />
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-color p-6">
                    <div className="container mx-auto">
                        <div className="bg-white p-6 shadow-md rounded-lg">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

// =========================
// import React, { useState, useEffect, useRef } from 'react';
// import { useLocation } from 'react-router-dom';
// import CommonLink from "../components/CommonLink";
// import { FaBox, FaCog, FaFileAlt, FaTachometerAlt, FaUser, FaGem, FaBars, FaTimes, FaBell } from "react-icons/fa";
// import Dropdown from "../components/Dropdown";
//
// const menuItems = [
//     { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt className="text-primary" /> },
//     { name: 'Orders', path: '/admin/orders', icon: <FaBox className="text-primary" /> },
//     { name: 'Categories', path: '/admin/categories', icon: <FaGem className="text-primary" /> },
//     { name: 'Products', path: '/admin/products', icon: <FaGem className="text-primary" /> },
//     { name: 'Customers', path: '/admin/customers', icon: <FaUser className="text-primary" /> },
//     { name: 'Reports', path: '/admin/reports', icon: <FaFileAlt className="text-primary" /> },
//     { name: 'Settings', path: '/admin/settings', icon: <FaCog className="text-primary" /> },
// ];
//
// const AdminLayout = ({ children }) => {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const sidebarRef = useRef(null);
//     const location = useLocation();
//
//     const handleClickOutside = (event) => {
//         if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
//             setIsSidebarOpen(false);
//         }
//     };
//
//     useEffect(() => {
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);
//
//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth >= 1024) {
//                 setIsSidebarOpen(false);
//             }
//         };
//
//         window.addEventListener('resize', handleResize);
//         return () => {
//             window.removeEventListener('resize', handleResize);
//         };
//     }, []);
//
//     return (
//         <div className="flex h-screen bg-bg-color">
//             {/* Sidebar */}
//             <aside
//                 ref={sidebarRef}
//                 className={`fixed inset-0 lg:relative bg-white border-r border-gray-200 w-64 p-4 shadow-lg transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative z-30 rounded-r-lg lg:rounded-none`}
//             >
//                 <div className="flex justify-between items-center mb-6">
//                     <h1 className="text-primary font-bold text-2xl">Jewel Admin</h1>
//                     <button
//                         onClick={() => setIsSidebarOpen(false)}
//                         className="lg:hidden text-gray-600 hover:text-gray-900"
//                     >
//                         <FaTimes size={24} />
//                     </button>
//                 </div>
//                 <nav>
//                     <ul className="space-y-2">
//                         {menuItems.map((item) => (
//                             <li key={item.path}>
//                                 <CommonLink
//                                     to={item.path}
//                                     icon={item.icon}
//                                     className={`flex items-center text-gray-700 hover:bg-gray-200 p-3 rounded-lg transition-colors duration-200 ${location.pathname === item.path ? 'bg-gray-300 font-semibold' : ''}`}
//                                 >
//                                     <span className="ml-3 text-lg">{item.name}</span>
//                                 </CommonLink>
//                             </li>
//                         ))}
//                     </ul>
//                 </nav>
//             </aside>
//
//             {/* Main Content */}
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 {/* Top Bar */}
//                 <header className="bg-white shadow-md p-4 flex justify-between items-center lg:pl-64">
//                     <button
//                         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//                         className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors duration-200"
//                     >
//                         <FaBars size={24} />
//                     </button>
//                     <h2 className="text-2xl font-semibold text-primary">
//                         Welcome to Your Jewelry Store <span className="text-secondary">Admin Dashboard</span>
//                     </h2>
//                     <div className="flex items-center space-x-4">
//                         <Dropdown
//                             icon={<FaBell size={24} className="text-secondary" />}
//                             menuItems={[
//                                 { label: 'New Notification', link: '#' },
//                                 { label: 'Notification Settings', link: '#' },
//                             ]}
//                             title="Notifications"
//                             badgeCount={5} // Adjust as needed
//                         />
//                         <Dropdown
//                             icon={<FaUser size={24} className="text-secondary" />}
//                             menuItems={[
//                                 { label: 'Profile', link: '#' },
//                                 { label: 'Logout', link: '#' },
//                             ]}
//                             title="User Profile"
//                         />
//                     </div>
//                 </header>
//
//                 {/* Content Area */}
//                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg-color p-6">
//                     <div className="container mx-auto">
//                         <div className="bg-white p-6 shadow-md rounded-lg">
//                             {children}
//                         </div>
//                     </div>
//                 </main>
//             </div>
//         </div>
//     );
// };
//
// export default AdminLayout;
//
// // ====================================================================================================
// // import React, { useState, useEffect, useRef } from 'react';
// // import { useLocation } from 'react-router-dom';
// // import CommonLink from "../components/CommonLink";
// // import { FaBox, FaCog, FaFileAlt, FaTachometerAlt, FaUser, FaGem, FaBars, FaTimes, FaBell } from "react-icons/fa";
// // import Dropdown from "../components/Dropdown"; // Import the Dropdown component
// //
// // const menuItems = [
// //     { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt className="text-primary" /> },
// //     { name: 'Orders', path: '/admin/orders', icon: <FaBox className="text-primary" /> },
// //     { name: 'Products', path: '/admin/products', icon: <FaGem className="text-primary" /> },
// //     { name: 'Customers', path: '/admin/customers', icon: <FaUser className="text-primary" /> },
// //     { name: 'Reports', path: '/admin/reports', icon: <FaFileAlt className="text-primary" /> },
// //     { name: 'Settings', path: '/admin/settings', icon: <FaCog className="text-primary" /> },
// // ];
// //
// // const AdminLayout = ({ children }) => {
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //     const sidebarRef = useRef(null);
// //     const location = useLocation();
// //
// //     const handleClickOutside = (event) => {
// //         if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
// //             setIsSidebarOpen(false);
// //         }
// //     };
// //
// //     useEffect(() => {
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //         };
// //     }, []);
// //
// //     useEffect(() => {
// //         const handleResize = () => {
// //             if (window.innerWidth >= 1024) {
// //                 setIsSidebarOpen(false);
// //             }
// //         };
// //
// //         window.addEventListener('resize', handleResize);
// //         return () => {
// //             window.removeEventListener('resize', handleResize);
// //         };
// //     }, []);
// //
// //     return (
// //         <div className="flex h-screen bg-gray-100">
// //             {/* Sidebar */}
// //             <aside
// //                 ref={sidebarRef}
// //                 className={`fixed inset-0 lg:relative bg-white border-r border-gray-200 w-64 p-4 shadow-lg transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative z-30 rounded-r-lg lg:rounded-none`}
// //             >
// //                 <div className="flex justify-between items-center mb-6">
// //                     <h1 className="text-primary font-bold text-2xl">Jewel Admin</h1>
// //                     <button
// //                         onClick={() => setIsSidebarOpen(false)}
// //                         className="lg:hidden text-gray-600 hover:text-gray-900"
// //                     >
// //                         <FaTimes size={24} />
// //                     </button>
// //                 </div>
// //                 <nav>
// //                     <ul className="space-y-2">
// //                         {menuItems.map((item) => (
// //                             <li key={item.path}>
// //                                 <CommonLink
// //                                     to={item.path}
// //                                     icon={item.icon}
// //                                     className={`flex items-center text-gray-700 hover:bg-gray-200 p-3 rounded-lg transition-colors duration-200 ${location.pathname === item.path ? 'bg-gray-300 font-semibold' : ''}`}
// //                                 >
// //                                     <span className="ml-3 text-lg">{item.name}</span>
// //                                 </CommonLink>
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </nav>
// //             </aside>
// //
// //             {/* Main Content */}
// //             <div className="flex-1 flex flex-col overflow-hidden">
// //                 {/* Top Bar */}
// //                 <header className="bg-white shadow-md p-4 flex justify-between items-center lg:pl-64">
// //                     <button
// //                         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// //                         className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors duration-200"
// //                     >
// //                         <FaBars size={24} />
// //                     </button>
// //                     <h2 className="text-2xl font-semibold text-gray-800">
// //                         Welcome to Your Jewelry Store <span className="text-primary">Admin Dashboard</span>
// //                     </h2>
// //                     <div className="flex items-center space-x-4">
// //                         <Dropdown
// //                             icon={<FaBell size={24} />}
// //                             menuItems={[
// //                                 { label: 'New Notification', link: '#' },
// //                                 { label: 'Notification Settings', link: '#' },
// //                             ]}
// //                             title="Notifications"
// //                         />
// //                         <Dropdown
// //                             icon={<FaUser size={24} />}
// //                             menuItems={[
// //                                 { label: 'Profile', link: '#' },
// //                                 { label: 'Logout', link: '#' },
// //                             ]}
// //                             title="User Profile"
// //                         />
// //                     </div>
// //                 </header>
// //
// //                 {/* Content Area */}
// //                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
// //                     <div className="container mx-auto">
// //                         <div className="bg-white p-6 shadow-md rounded-lg">
// //                             {children}
// //                         </div>
// //                     </div>
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default AdminLayout;
//
// // import React, { useState, useEffect, useRef } from 'react';
// // import { useLocation } from 'react-router-dom';
// // import CommonLink from "../components/CommonLink";
// // import { FaBox, FaCog, FaFileAlt, FaTachometerAlt, FaUser, FaGem, FaBars, FaTimes } from "react-icons/fa";
// //
// // const menuItems = [
// //     { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt className="text-primary" /> },
// //     { name: 'Orders', path: '/admin/orders', icon: <FaBox className="text-primary" /> },
// //     { name: 'Products', path: '/admin/products', icon: <FaGem className="text-primary" /> },
// //     { name: 'Customers', path: '/admin/customers', icon: <FaUser className="text-primary" /> },
// //     { name: 'Reports', path: '/admin/reports', icon: <FaFileAlt className="text-primary" /> },
// //     { name: 'Settings', path: '/admin/settings', icon: <FaCog className="text-primary" /> },
// // ];
// //
// // const AdminLayout = ({ children }) => {
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //     const sidebarRef = useRef(null);
// //     const location = useLocation();
// //
// //     const handleClickOutside = (event) => {
// //         if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
// //             setIsSidebarOpen(false);
// //         }
// //     };
// //
// //     useEffect(() => {
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //         };
// //     }, []);
// //
// //     useEffect(() => {
// //         const handleResize = () => {
// //             if (window.innerWidth >= 1024) {
// //                 setIsSidebarOpen(false);
// //             }
// //         };
// //
// //         window.addEventListener('resize', handleResize);
// //         return () => {
// //             window.removeEventListener('resize', handleResize);
// //         };
// //     }, []);
// //
// //     return (
// //         <div className="flex h-screen bg-gray-100">
// //             {/* Sidebar */}
// //             <aside
// //                 ref={sidebarRef}
// //                 className={`fixed inset-0 lg:relative bg-white border-r border-gray-200 w-64 p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative z-30 rounded-tl-lg lg:rounded-none`}
// //             >
// //                 <div className="flex justify-between items-center mb-6">
// //                     <h1 className="text-primary font-bold text-3xl">Jewel Admin</h1>
// //                     <button
// //                         onClick={() => setIsSidebarOpen(false)}
// //                         className="lg:hidden text-gray-600 hover:text-gray-900"
// //                     >
// //                         <FaTimes size={24} />
// //                     </button>
// //                 </div>
// //                 <nav>
// //                     <ul className="space-y-2 rounded-tl-lg bg-white overflow-hidden">
// //                         {menuItems.map((item) => (
// //                             <li key={item.path}>
// //                                 <CommonLink
// //                                     to={item.path}
// //                                     icon={item.icon}
// //                                     className={`flex items-center text-gray-700 hover:bg-gray-200 p-3 rounded-lg block transition-all duration-200 ease-in-out ${location.pathname === item.path ? 'bg-gray-300 font-semibold' : ''}`}
// //                                 >
// //                                     <span className="ml-3 text-lg">{item.name}</span>
// //                                 </CommonLink>
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </nav>
// //             </aside>
// //
// //             {/* Main Content */}
// //             <div className="flex-1 flex flex-col overflow-hidden">
// //                 {/* Top Bar */}
// //                 <header className="bg-white shadow-md p-4 flex justify-between items-center lg:pl-64">
// //                     <button
// //                         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// //                         className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors duration-200"
// //                     >
// //                         <FaBars size={24} />
// //                     </button>
// //                     <h2 className="text-2xl font-semibold text-gray-800">
// //                         Welcome to Your Jewelry Store <span className="text-primary">Admin Dashboard</span>
// //                     </h2>
// //                 </header>
// //
// //                 {/* Content Area */}
// //                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
// //                     <div className="container mx-auto">
// //                         <div className="bg-white p-6 shadow-md rounded-lg backdrop-blur-lg bg-opacity-50">
// //                             {children}
// //                         </div>
// //                     </div>
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default AdminLayout;
//
// // import React, { useState, useEffect, useRef } from 'react';
// // import { useLocation } from 'react-router-dom';
// // import CommonLink from "../components/CommonLink";
// // import { FaBox, FaCog, FaFileAlt, FaTachometerAlt, FaUser, FaGem, FaBars, FaTimes } from "react-icons/fa";
// //
// // const menuItems = [
// //     { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt className="text-primary" /> },
// //     { name: 'Orders', path: '/admin/orders', icon: <FaBox className="text-primary" /> },
// //     { name: 'Products', path: '/admin/products', icon: <FaGem className="text-primary" /> },
// //     { name: 'Customers', path: '/admin/customers', icon: <FaUser className="text-primary" /> },
// //     { name: 'Reports', path: '/admin/reports', icon: <FaFileAlt className="text-primary" /> },
// //     { name: 'Settings', path: '/admin/settings', icon: <FaCog className="text-primary" /> },
// // ];
// //
// // const AdminLayout = ({ children }) => {
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //     const sidebarRef = useRef(null);
// //     const location = useLocation();
// //
// //     const handleClickOutside = (event) => {
// //         if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
// //             setIsSidebarOpen(false);
// //         }
// //     };
// //
// //     useEffect(() => {
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //         };
// //     }, []);
// //
// //     useEffect(() => {
// //         const handleResize = () => {
// //             if (window.innerWidth >= 1024) {
// //                 setIsSidebarOpen(false);
// //             }
// //         };
// //
// //         window.addEventListener('resize', handleResize);
// //         return () => {
// //             window.removeEventListener('resize', handleResize);
// //         };
// //     }, []);
// //
// //     return (
// //         <div className="flex h-screen bg-gray-100">
// //             {/* Sidebar */}
// //             <aside
// //                 ref={sidebarRef}
// //                 className={`fixed inset-0 lg:relative bg-white border-r border-gray-200 w-64 p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative z-30`}
// //             >
// //                 <div className="flex justify-between items-center mb-6">
// //                     <h1 className="text-primary font-bold text-3xl">Jewel Admin</h1>
// //                     <button
// //                         onClick={() => setIsSidebarOpen(false)}
// //                         className="lg:hidden text-gray-600 hover:text-gray-900"
// //                     >
// //                         <FaTimes size={24} />
// //                     </button>
// //                 </div>
// //                 <nav>
// //                     <ul className="space-y-2">
// //                         {menuItems.map((item) => (
// //                             <li key={item.path}>
// //                                 <CommonLink
// //                                     to={item.path}
// //                                     icon={item.icon}
// //                                     className={`flex items-center text-gray-700 hover:bg-gray-200 p-3 rounded-lg block transition-all duration-200 ease-in-out ${location.pathname === item.path ? 'bg-gray-300 font-semibold' : ''}`}
// //                                 >
// //                                     <span className="ml-3 text-lg">{item.name}</span>
// //                                 </CommonLink>
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </nav>
// //             </aside>
// //
// //             {/* Main Content */}
// //             <div className="flex-1 flex flex-col overflow-hidden">
// //                 {/* Top Bar */}
// //                 <header className="bg-white shadow-md p-4 flex justify-between items-center lg:pl-64">
// //                     <button
// //                         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// //                         className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors duration-200"
// //                     >
// //                         <FaBars size={24} />
// //                     </button>
// //                     <h2 className="text-2xl font-semibold text-gray-800">
// //                         Welcome to Your Jewelry Store <span className="text-primary">Admin Dashboard</span>
// //                     </h2>
// //                 </header>
// //
// //                 {/* Content Area */}
// //                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
// //                     <div className="container mx-auto">
// //                         <div
// //                             className="bg-white rounded-3xl shadow-md p-6 transition-transform duration-300 transform hover:scale-105">
// //                             {children}
// //                         </div>
// //                     </div>
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default AdminLayout;
//
// // =======================================================================================================================
// // import React, { useState, useEffect, useRef } from 'react';
// // import { useLocation } from 'react-router-dom';
// // import CommonLink from "../components/CommonLink";
// // import { FaBox, FaCog, FaFileAlt, FaTachometerAlt, FaUser, FaGem, FaBars, FaTimes } from "react-icons/fa";
// //
// // const menuItems = [
// //     { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt className="text-primary" /> },
// //     { name: 'Orders', path: '/admin/orders', icon: <FaBox className="text-primary" /> },
// //     { name: 'Products', path: '/admin/products', icon: <FaGem className="text-primary" /> },
// //     { name: 'Customers', path: '/admin/customers', icon: <FaUser className="text-primary" /> },
// //     { name: 'Reports', path: '/admin/reports', icon: <FaFileAlt className="text-primary" /> },
// //     { name: 'Settings', path: '/admin/settings', icon: <FaCog className="text-primary" /> },
// // ];
// //
// // const AdminLayout = ({ children }) => {
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //     const sidebarRef = useRef(null);
// //     const location = useLocation();
// //
// //     const handleClickOutside = (event) => {
// //         if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
// //             setIsSidebarOpen(false);
// //         }
// //     };
// //
// //     useEffect(() => {
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //         };
// //     }, []);
// //
// //     useEffect(() => {
// //         const handleResize = () => {
// //             if (window.innerWidth >= 1024) {
// //                 setIsSidebarOpen(false);
// //             }
// //         };
// //
// //         window.addEventListener('resize', handleResize);
// //         return () => {
// //             window.removeEventListener('resize', handleResize);
// //         };
// //     }, []);
// //
// //     return (
// //         <div className="flex h-screen bg-gray-100">
// //             {/* Sidebar */}
// //             <aside
// //                 ref={sidebarRef}
// //                 className={`fixed inset-0 lg:relative bg-white border-r border-gray-200 w-64 p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative z-30`}
// //             >
// //                 <div className="flex justify-between items-center mb-6">
// //                     <h1 className="text-primary font-bold text-3xl">Jewel Admin</h1>
// //                     <button
// //                         onClick={() => setIsSidebarOpen(false)}
// //                         className="lg:hidden text-gray-600 hover:text-gray-900"
// //                     >
// //                         <FaTimes size={24} />
// //                     </button>
// //                 </div>
// //                 <nav>
// //                     <ul className="space-y-2">
// //                         {menuItems.map((item) => (
// //                             <li key={item.path}>
// //                                 <CommonLink
// //                                     to={item.path}
// //                                     icon={item.icon}
// //                                     className={`flex items-center text-gray-700 hover:bg-gray-200 p-3 rounded-lg block transition-all duration-200 ease-in-out ${location.pathname === item.path ? 'bg-gray-300 font-semibold' : ''}`}
// //                                 >
// //                                     <span className="ml-3 text-lg">{item.name}</span>
// //                                 </CommonLink>
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </nav>
// //             </aside>
// //
// //             {/* Main Content */}
// //             <div className="flex-1 flex flex-col overflow-hidden">
// //                 {/* Top Bar */}
// //                 <header className="bg-white shadow-md p-4 flex justify-between items-center lg:pl-64">
// //                     <button
// //                         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// //                         className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors duration-200"
// //                     >
// //                         <FaBars size={24} />
// //                     </button>
// //                     <h2 className="text-2xl font-semibold text-gray-800">
// //                         Welcome to Your Jewelry Store <span className="text-primary">Admin Dashboard</span>
// //                     </h2>
// //                 </header>
// //
// //                 {/* Content Area */}
// //                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
// //                     <div className="container mx-auto">
// //                         <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 transform hover:scale-105">
// //                             {children}
// //                         </div>
// //                     </div>
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default AdminLayout;
//
// // import React, { useState, useEffect, useRef } from 'react';
// // import { useLocation } from 'react-router-dom';
// // import CommonLink from "../components/CommonLink";
// // import { FaBox, FaCog, FaFileAlt, FaTachometerAlt, FaUser, FaGem, FaBars } from "react-icons/fa";
// //
// // const menuItems = [
// //     { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt className="text-primary" /> },
// //     { name: 'Orders', path: '/admin/orders', icon: <FaBox className="text-primary" /> },
// //     { name: 'Products', path: '/admin/products', icon: <FaGem className="text-primary" /> },
// //     { name: 'Customers', path: '/admin/customers', icon: <FaUser className="text-primary" /> },
// //     { name: 'Reports', path: '/admin/reports', icon: <FaFileAlt className="text-primary" /> },
// //     { name: 'Settings', path: '/admin/settings', icon: <FaCog className="text-primary" /> },
// // ];
// //
// // const AdminLayout = ({ children }) => {
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //     const sidebarRef = useRef(null);
// //     const location = useLocation(); // Get current route path
// //
// //     const handleClickOutside = (event) => {
// //         if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
// //             setIsSidebarOpen(false);
// //         }
// //     };
// //
// //     useEffect(() => {
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //         };
// //     }, []);
// //
// //     useEffect(() => {
// //         const handleResize = () => {
// //             if (window.innerWidth >= 1024) {
// //                 setIsSidebarOpen(false);
// //             }
// //         };
// //
// //         window.addEventListener('resize', handleResize);
// //         return () => {
// //             window.removeEventListener('resize', handleResize);
// //         };
// //     }, []);
// //
// //     return (
// //         <div className="flex h-screen bg-light-gray">
// //             {/* Sidebar */}
// //             <aside
// //                 ref={sidebarRef}
// //                 className={`fixed lg:relative bg-white border-r border-gray-200 w-80 min-h-screen p-6 shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-40`}
// //             >
// //                 <h1 className="text-primary font-bold text-2xl mb-8 text-center">Jewel Admin</h1>
// //                 <nav>
// //                     <ul className="space-y-4">
// //                         {menuItems.map((item) => (
// //                             <li key={item.path}>
// //                                 <CommonLink
// //                                     to={item.path}
// //                                     icon={item.icon}
// //                                     className={`flex items-center text-gray-700 hover:bg-primary-light p-4 rounded-lg transition-all duration-200 ease-in-out ${location.pathname === item.path ? 'bg-primary-light text-primary font-medium' : ''}`}
// //                                 >
// //                                     <span className="ml-3 text-lg">{item.name}</span>
// //                                 </CommonLink>
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </nav>
// //             </aside>
// //
// //             {/* Main Content */}
// //             <div className="flex-1 flex flex-col overflow-hidden">
// //                 {/* Top Bar */}
// //                 <header className="bg-white shadow-md p-4 flex justify-between items-center lg:pl-80">
// //                     <button
// //                         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// //                         className="lg:hidden text-primary hover:text-primary-dark transition-colors duration-200"
// //                     >
// //                         <FaBars size={24} />
// //                     </button>
// //                     <h2 className="text-2xl font-semibold">
// //                         Welcome to Your Jewelry Store <span className="text-primary">Admin Dashboard</span>
// //                     </h2>
// //                 </header>
// //
// //                 {/* Content Area */}
// //                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-gray p-6">
// //                     <div className="container mx-auto">
// //                         <div className="bg-white rounded-lg shadow-md p-6 transition-transform duration-300 transform hover:scale-105">
// //                             {children}
// //                         </div>
// //                     </div>
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default AdminLayout;
//
//
//
// // import React, { useState, useEffect, useRef } from 'react';
// // import { useLocation } from 'react-router-dom';
// // import CommonLink from "../components/CommonLink";
// // import { FaBox, FaCog, FaFileAlt, FaTachometerAlt, FaUser, FaGem, FaBars } from "react-icons/fa";
// //
// // const menuItems = [
// //     { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt className="text-white" /> },
// //     { name: 'Orders', path: '/admin/orders', icon: <FaBox className="text-white" /> },
// //     { name: 'Products', path: '/admin/products', icon: <FaGem className="text-white" /> },
// //     { name: 'Customers', path: '/admin/customers', icon: <FaUser className="text-white" /> },
// //     { name: 'Reports', path: '/admin/reports', icon: <FaFileAlt className="text-white" /> },
// //     { name: 'Settings', path: '/admin/settings', icon: <FaCog className="text-white" /> },
// // ];
// //
// // const AdminLayout = ({ children }) => {
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //     const sidebarRef = useRef(null);
// //     const location = useLocation(); // Get current route path
// //
// //     const handleClickOutside = (event) => {
// //         if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
// //             setIsSidebarOpen(false);
// //         }
// //     };
// //
// //     useEffect(() => {
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //         };
// //     }, []);
// //
// //     useEffect(() => {
// //         const handleResize = () => {
// //             if (window.innerWidth >= 1024) {
// //                 setIsSidebarOpen(false);
// //             }
// //         };
// //
// //         window.addEventListener('resize', handleResize);
// //         return () => {
// //             window.removeEventListener('resize', handleResize);
// //         };
// //     }, []);
// //
// //     return (
// //         <div className="flex h-screen bg-gray-900 text-gray-200">
// //             {/* Sidebar */}
// //             <aside
// //                 ref={sidebarRef}
// //                 className={`fixed lg:relative bg-gray-800 border-r border-gray-700 w-72 min-h-screen p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative z-30`}
// //             >
// //                 <h1 className="text-primary font-bold text-4xl mb-8 text-center">Jewel Admin</h1>
// //                 <nav>
// //                     <ul className="space-y-2">
// //                         {menuItems.map((item) => (
// //                             <li key={item.path}>
// //                                 <CommonLink
// //                                     to={item.path}
// //                                     icon={item.icon}
// //                                     className={`flex items-center text-gray-300 hover:bg-gray-700 p-3 rounded-lg block transition-all duration-200 ease-in-out ${location.pathname === item.path ? 'bg-gray-600 font-semibold' : ''}`}
// //                                 >
// //                                     <span className="ml-3 text-lg">{item.name}</span>
// //                                 </CommonLink>
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </nav>
// //             </aside>
// //
// //             {/* Main Content */}
// //             <div className="flex-1 flex flex-col overflow-hidden">
// //                 {/* Top Bar */}
// //                 <header className="bg-gray-800 shadow-lg p-4 flex justify-between items-center lg:pl-72 border-b border-gray-700">
// //                     <button
// //                         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// //                         className="lg:hidden text-gray-300 hover:text-gray-100 transition-colors duration-200"
// //                     >
// //                         <FaBars size={24} />
// //                     </button>
// //                     <h2 className="text-2xl font-semibold text-gray-100">
// //                         Welcome to Your Jewelry Store <span className="text-primary">Admin Dashboard</span>
// //                     </h2>
// //                 </header>
// //
// //                 {/* Content Area */}
// //                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-6">
// //                     <div className="container mx-auto">
// //                         <div className="bg-gray-800 rounded-lg shadow-md p-6 transition-transform duration-300 transform hover:scale-105">
// //                             {children}
// //                         </div>
// //                     </div>
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default AdminLayout;
//
// // import React, { useState, useEffect, useRef } from 'react';
// // import { useLocation } from 'react-router-dom';
// // import CommonLink from "../components/CommonLink";
// // import { FaBox, FaCog, FaFileAlt, FaTachometerAlt, FaUser, FaGem, FaBars } from "react-icons/fa";
// //
// // const menuItems = [
// //     { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt className="text-yellow-500" /> },
// //     { name: 'Orders', path: '/admin/orders', icon: <FaBox className="text-yellow-500" /> },
// //     { name: 'Products', path: '/admin/products', icon: <FaGem className="text-yellow-500" /> },
// //     { name: 'Customers', path: '/admin/customers', icon: <FaUser className="text-yellow-500" /> },
// //     { name: 'Reports', path: '/admin/reports', icon: <FaFileAlt className="text-yellow-500" /> },
// //     { name: 'Settings', path: '/admin/settings', icon: <FaCog className="text-yellow-500" /> },
// // ];
// //
// // const AdminLayout = ({ children }) => {
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //     const sidebarRef = useRef(null);
// //     const location = useLocation(); // Get current route path
// //
// //     const handleClickOutside = (event) => {
// //         if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
// //             setIsSidebarOpen(false);
// //         }
// //     };
// //
// //     useEffect(() => {
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //         };
// //     }, []);
// //
// //     useEffect(() => {
// //         const handleResize = () => {
// //             if (window.innerWidth >= 1024) {
// //                 setIsSidebarOpen(false);
// //             }
// //         };
// //
// //         window.addEventListener('resize', handleResize);
// //         return () => {
// //             window.removeEventListener('resize', handleResize);
// //         };
// //     }, []);
// //
// //     return (
// //         <div className="flex h-screen bg-gray-50">
// //             {/* Sidebar */}
// //             <aside
// //                 ref={sidebarRef}
// //                 className={`fixed lg:relative bg-gradient-to-b from-gray-800 to-gray-900 w-64 min-h-screen p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative z-40`}
// //             >
// //                 <h1 className="text-yellow-500 font-serif text-4xl mb-8 text-center">Jewel Admin</h1>
// //                 <nav>
// //                     <ul className="space-y-2">
// //                         {menuItems.map((item) => (
// //                             <li key={item.path}>
// //                                 <CommonLink
// //                                     to={item.path}
// //                                     icon={item.icon}
// //                                     className={`flex items-center text-white hover:bg-gray-700 p-3 rounded-lg block transition-transform duration-200 ease-in-out transform hover:scale-105 ${location.pathname === item.path ? 'bg-gray-800 shadow-md' : ''}`}
// //                                 >
// //                                     <span className="ml-3 text-lg font-medium">{item.name}</span>
// //                                 </CommonLink>
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </nav>
// //             </aside>
// //
// //             {/* Main Content */}
// //             <div className="flex-1 flex flex-col overflow-hidden">
// //                 {/* Top Bar */}
// //                 <header className="bg-white shadow-md p-4 flex justify-between items-center lg:pl-64">
// //                     <button
// //                         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// //                         className="lg:hidden text-gray-800 hover:text-gray-600 transition-colors duration-200"
// //                     >
// //                         <FaBars size={24} />
// //                     </button>
// //                     <h2 className="text-3xl font-bold text-gray-800 leading-tight">
// //                         Welcome to Your Jewelry Store <span className="text-yellow-500">Admin Dashboard</span>
// //                     </h2>
// //                 </header>
// //
// //                 {/* Content Area */}
// //                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
// //                     <div className="container mx-auto">
// //                         <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 transform hover:scale-105">
// //                             {children}
// //                         </div>
// //                     </div>
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default AdminLayout;
//
// // import React, { useState, useEffect, useRef } from 'react';
// // import { useLocation } from 'react-router-dom';
// // import CommonLink from "../components/CommonLink";
// // import { FaBox, FaCog, FaFileAlt, FaTachometerAlt, FaUser, FaGem, FaBars } from "react-icons/fa";
// //
// // const menuItems = [
// //     { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt className="text-yellow-500" /> },
// //     { name: 'Orders', path: '/admin/orders', icon: <FaBox className="text-yellow-500" /> },
// //     { name: 'Products', path: '/admin/products', icon: <FaGem className="text-yellow-500" /> },
// //     { name: 'Customers', path: '/admin/customers', icon: <FaUser className="text-yellow-500" /> },
// //     { name: 'Reports', path: '/admin/reports', icon: <FaFileAlt className="text-yellow-500" /> },
// //     { name: 'Settings', path: '/admin/settings', icon: <FaCog className="text-yellow-500" /> },
// // ];
// //
// // const AdminLayout = ({ children }) => {
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //     const sidebarRef = useRef(null);
// //     const location = useLocation(); // Get current route path
// //
// //     const handleClickOutside = (event) => {
// //         if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
// //             setIsSidebarOpen(false);
// //         }
// //     };
// //
// //     useEffect(() => {
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //         };
// //     }, []);
// //
// //     useEffect(() => {
// //         const handleResize = () => {
// //             if (window.innerWidth >= 1024) {
// //                 setIsSidebarOpen(false);
// //             }
// //         };
// //
// //         window.addEventListener('resize', handleResize);
// //         return () => {
// //             window.removeEventListener('resize', handleResize);
// //         };
// //     }, []);
// //
// //     return (
// //         <div className="flex h-screen bg-gray-50">
// //             {/* Sidebar */}
// //             <aside
// //                 ref={sidebarRef}
// //                 className={`fixed lg:relative bg-gradient-to-b from-gray-800 to-gray-900 w-64 min-h-screen p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative z-40`}
// //             >
// //                 <h1 className="text-yellow-500 font-serif text-4xl mb-8 text-center">Jewel Admin</h1>
// //                 <nav>
// //                     <ul className="space-y-2">
// //                         {menuItems.map((item) => (
// //                             <li key={item.path}>
// //                                 <CommonLink
// //                                     to={item.path}
// //                                     icon={item.icon}
// //                                     className={`flex items-center text-white hover:bg-gray-700 p-3 rounded-lg block transition-transform duration-200 ease-in-out transform hover:scale-105 ${location.pathname === item.path ? 'bg-gray-800 shadow-md' : ''}`}
// //                                 >
// //                                     <span className="ml-3 text-lg font-medium">{item.name}</span>
// //                                 </CommonLink>
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </nav>
// //             </aside>
// //
// //             {/* Main Content */}
// //             <div className="flex-1 flex flex-col overflow-hidden">
// //                 {/* Top Bar */}
// //                 <header className="bg-white shadow-md p-4 flex justify-between items-center lg:pl-64">
// //                     <button
// //                         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// //                         className="lg:hidden text-gray-800 hover:text-gray-600 transition-colors duration-200"
// //                     >
// //                         <FaBars size={24} />
// //                     </button>
// //                     <h2 className="text-2xl font-semibold text-gray-800">Welcome to Your Jewelry Store Admin</h2>
// //                 </header>
// //
// //                 {/* Content Area */}
// //                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
// //                     <div className="container mx-auto">
// //                         <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 transform hover:scale-105">
// //                             {children}
// //                         </div>
// //                     </div>
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default AdminLayout;
//
// //
// // import React, { useState, useEffect, useRef } from 'react';
// // import { useLocation } from 'react-router-dom';
// // import CommonLink from "../components/CommonLink";
// // import { FaBox, FaCog, FaFileAlt, FaTachometerAlt, FaUser, FaGem, FaBars } from "react-icons/fa";
// //
// // const menuItems = [
// //     { name: 'Dashboard', path: '/admin/dashboard', icon: <FaTachometerAlt className="text-gold" /> },
// //     { name: 'Orders', path: '/admin/orders', icon: <FaBox className="text-gold" /> },
// //     { name: 'Products', path: '/admin/products', icon: <FaGem className="text-gold" /> },
// //     { name: 'Customers', path: '/admin/customers', icon: <FaUser className="text-gold" /> },
// //     { name: 'Reports', path: '/admin/reports', icon: <FaFileAlt className="text-gold" /> },
// //     { name: 'Settings', path: '/admin/settings', icon: <FaCog className="text-gold" /> },
// // ];
// //
// // const AdminLayout = ({ children }) => {
// //     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
// //     const sidebarRef = useRef(null);
// //     const location = useLocation(); // Get current route path
// //
// //     const handleClickOutside = (event) => {
// //         if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
// //             setIsSidebarOpen(false);
// //         }
// //     };
// //
// //     useEffect(() => {
// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //         };
// //     }, []);
// //
// //     useEffect(() => {
// //         const handleResize = () => {
// //             if (window.innerWidth >= 1024) {
// //                 setIsSidebarOpen(false);
// //             }
// //         };
// //
// //         window.addEventListener('resize', handleResize);
// //         return () => {
// //             window.removeEventListener('resize', handleResize);
// //         };
// //     }, []);
// //
// //     return (
// //         <div className="flex h-screen bg-gray-100">
// //             {/* Sidebar */}
// //             <aside
// //                 ref={sidebarRef}
// //                 className={`fixed bg-gradient-to-b from-primary to-primary-dark w-64 min-h-screen p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:relative z-40`}
// //             >
// //                 <h1 className="text-gold font-serif text-3xl mb-8 text-center">Jewel Admin</h1>
// //                 <nav>
// //                     <ul className="space-y-2">
// //                         {menuItems.map((item) => (
// //                             <li key={item.path}>
// //                                 <CommonLink
// //                                     to={item.path}
// //                                     icon={item.icon}
// //                                     className={`text-white hover:bg-primary-light p-3 rounded-lg block transition-all duration-200 ease-in-out transform hover:scale-105 ${location.pathname === item.path ? 'bg-primary-dark shadow-inner' : ''}`}
// //                                 >
// //                                     <span className="ml-3">{item.name}</span>
// //                                 </CommonLink>
// //                             </li>
// //                         ))}
// //                     </ul>
// //                 </nav>
// //             </aside>
// //
// //             {/* Main Content */}
// //             <div className="flex-1 flex flex-col overflow-hidden">
// //                 {/* Top Bar */}
// //                 <header className="bg-white shadow-md p-4 flex justify-between items-center lg:pl-64">
// //                     <button
// //                         onClick={() => setIsSidebarOpen(!isSidebarOpen)}
// //                         className="lg:hidden text-primary hover:text-primary-dark transition-colors duration-200"
// //                     >
// //                         <FaBars size={24} />
// //                     </button>
// //                     <h2 className="text-2xl font-semibold text-primary">Welcome to Your Jewelry Store Admin</h2>
// //                 </header>
// //
// //                 {/* Content Area */}
// //                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
// //                     <div className="container mx-auto">
// //                         <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in-up">
// //                             {children}
// //                         </div>
// //                     </div>
// //                 </main>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default AdminLayout;
// //
