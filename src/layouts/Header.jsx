import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaBars, FaTimes } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import CartIcon from "../components/CartIcon";
import AuthService from '../Services/AuthService';
import { logout } from "../store/reducers/authSlice";
import WishlistIcon from "../components/WishlistIcon";

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Current auth state:', auth);
    }, [auth]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                closeSidebar();
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        try {
            console.log('Attempting logout...');
            await AuthService.logout();
            console.log('AuthService logout completed');
            dispatch(logout());
            console.log('Logout action dispatched');
            navigate('/');
            console.log('Navigated to home page');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/products' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' }
    ];

    console.log('Rendering Header. Auth state:', auth);

    return (
        <header className="bg-white shadow-md py-4 px-4">
            <div className="container mx-auto flex items-center justify-between">
                {/* Desktop Layout */}
                <div className="hidden md:flex items-center justify-between w-full">
                    {/* Logo */}
                    <div className="text-2xl font-bold text-gray-800">
                        <NavLink to="/" className="flex items-center">
                            <span className="text-primary">Jewelry</span> Store
                        </NavLink>
                    </div>

                    {/* Desktop Navigation Links */}
                    <nav className="flex space-x-6">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    isActive ? 'text-primary' : 'text-gray-700 hover:text-primary transition'
                                }
                            >
                                {link.name}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Cart and Profile Icons */}
                    <div className="flex items-center space-x-6">
                        {auth.user && (
                            <>
                                {/* Cart Icon */}
                                <div className="relative">
                                    <CartIcon />
                                </div>
                                {/* Wishlist Icon */}
                                <div className="relative">
                                    <WishlistIcon />
                                </div>
                            </>
                        )}



                        {/* Conditional rendering for Profile/Login/Logout */}
                        {auth.user ? (
                            <>
                                <Tooltip title={auth.user.email || ''} arrow>
                                <NavLink to="/profile" className="text-gray-700 hover:text-primary transition flex items-center">
                                        <FaUser className="text-2xl" />
                                    </NavLink>
                                </Tooltip>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-primary transition flex items-center"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <NavLink to="/login" className="text-gray-700 hover:text-primary transition flex items-center">
                                Sign In
                            </NavLink>
                        )}
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden flex items-center w-full">
                    {/* Logo */}
                    <div className="flex-grow text-xl font-bold text-gray-800">
                        <NavLink to="/" className="flex items-center">
                            <span className="text-primary">Jewelry</span> Store
                        </NavLink>
                    </div>

                    {/* Cart, Profile, and Menu Icon */}
                    <div className="flex items-center space-x-4">
                        {/* Cart Icon */}
                        <div className="relative">
                            <CartIcon/>
                        </div>
                        {/* wishlist Icon */}
                        <div className="relative">
                            <WishlistIcon/>
                        </div>

                        {/* Conditional rendering for Profile/Login */}
                        {auth.user ? (
                            <Tooltip title={auth.user.email || ''} arrow>
                                <NavLink to="/profile" className="text-gray-700 hover:text-primary transition flex items-center">
                                    <FaUser className="text-xl" />
                                </NavLink>
                            </Tooltip>
                        ) : (
                            <NavLink to="/login" className="text-gray-700 hover:text-primary transition flex items-center">
                                <FaUser className="text-xl" />
                            </NavLink>
                        )}

                        {/* Menu Icon */}
                        <button
                            className="text-gray-700 hover:text-primary transition"
                            onClick={toggleSidebar}
                        >
                            <FaBars className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 z-50 flex transform ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } transition-transform duration-300 ease-in-out`}
            >
                <div
                    className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"
                    onClick={closeSidebar}
                ></div>
                <div
                    className="relative bg-white w-64 max-w-xs h-full shadow-lg"
                >
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="text-2xl font-bold text-gray-800">
                            <NavLink to="/" className="flex items-center">
                                <span className="text-primary">Jewelry</span> Store
                            </NavLink>
                        </div>
                        <button
                            className="text-gray-700 hover:text-primary"
                            onClick={closeSidebar}
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="mt-4">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                className={({ isActive }) =>
                                    isActive ? 'block px-4 py-2 text-primary bg-gray-200' : 'block px-4 py-2 text-gray-700 hover:bg-gray-200 transition'
                                }
                                onClick={closeSidebar}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                        {auth.user ? (
                            <>
                                <Tooltip title={auth.user.email || ''} arrow>
                                    <NavLink to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition" onClick={closeSidebar}>
                                        Profile
                                    </NavLink>
                                </Tooltip>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        closeSidebar();
                                    }}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <NavLink to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition" onClick={closeSidebar}>
                                Sign In
                            </NavLink>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
// ==========
// import React, { useState, useEffect } from 'react';
// import { NavLink, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
// import {clearUser} from "../store/actions/userActions";
// import AuthService from "../Services/AuthService";
//
// const Header = () => {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//     const user = useSelector(state => state.user.user);
//     const dispatch = useDispatch();
//     const navigate = useNavigate();
//
//     const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
//     const closeSidebar = () => setIsSidebarOpen(false);
//
//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth >= 768) {
//                 closeSidebar();
//             }
//         };
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);
//
//     const handleLogout = () => {
//         AuthService.logout();
//         dispatch(clearUser());
//         navigate('/');
//     };
//
//     // Define the list of links
//     const navLinks = [
//         { name: 'Home', path: '/' },
//         { name: 'Shop', path: '/products' },
//         { name: 'ProductDetail', path: '/product' },
//         { name: 'About Us', path: '/about' },
//         { name: 'Contact', path: '/contact' }
//     ];
//
//     return (
//         <header className="bg-white shadow-md py-4 px-4">
//             <div className="container mx-auto flex items-center justify-between">
//                 {/* Desktop Layout */}
//                 <div className="hidden md:flex items-center justify-between w-full">
//                     {/* Logo */}
//                     <div className="text-2xl font-bold text-gray-800">
//                         <NavLink to="/" className="flex items-center">
//                             <span className="text-primary">Jewelry</span> Store
//                         </NavLink>
//                     </div>
//
//                     {/* Desktop Navigation Links */}
//                     <nav className="flex space-x-6">
//                         {navLinks.map((link) => (
//                             <NavLink
//                                 key={link.name}
//                                 to={link.path}
//                                 className={({ isActive }) =>
//                                     isActive ? 'text-primary' : 'text-gray-700 hover:text-primary transition'
//                                 }
//                             >
//                                 {link.name}
//                             </NavLink>
//                         ))}
//                     </nav>
//
//                     {/* Cart and Profile Icons */}
//                     <div className="flex items-center space-x-6">
//                         {/* Cart Icon */}
//                         <div className="relative">
//                             <NavLink to="/cart" className="text-gray-700 hover:text-primary transition flex items-center">
//                                 <FaShoppingCart className="text-2xl" />
//                                 <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-2 py-1">
//                                     3
//                                 </span>
//                             </NavLink>
//                         </div>
//
//                         {/* Conditional rendering for Profile/Login/Logout */}
//                         {user ? (
//                             <>
//                                 <NavLink to="/profile" className="text-gray-700 hover:text-primary transition flex items-center">
//                                     <FaUser className="text-2xl" />
//                                 </NavLink>
//                                 <button onClick={handleLogout} className="text-gray-700 hover:text-primary transition flex items-center">
//                                     <FaSignOutAlt className="text-2xl" />
//                                 </button>
//                             </>
//                         ) : (
//                             <NavLink to="/login" className="text-gray-700 hover:text-primary transition flex items-center">
//                                 Sign In
//                             </NavLink>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* Mobile Layout */}
//                 <div className="md:hidden flex items-center w-full">
//                     {/* Logo */}
//                     <div className="flex-grow text-xl font-bold text-gray-800">
//                         <NavLink to="/" className="flex items-center">
//                             <span className="text-primary">Jewelry</span> Store
//                         </NavLink>
//                     </div>
//
//                     {/* Cart, Profile, and Menu Icon */}
//                     <div className="flex items-center space-x-4">
//                         {/* Cart Icon */}
//                         <div className="relative">
//                             <NavLink to="/cart" className="text-gray-700 hover:text-primary transition flex items-center">
//                                 <FaShoppingCart className="text-xl" />
//                                 <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-2 py-1">
//                                     3
//                                 </span>
//                             </NavLink>
//                         </div>
//
//                         {/* Conditional rendering for Profile/Login */}
//                         {user ? (
//                             <NavLink to="/profile" className="text-gray-700 hover:text-primary transition flex items-center">
//                                 <FaUser className="text-xl" />
//                             </NavLink>
//                         ) : (
//                             <NavLink to="/login" className="text-gray-700 hover:text-primary transition flex items-center">
//                                 <FaUser className="text-xl" />
//                             </NavLink>
//                         )}
//
//                         {/* Menu Icon */}
//                         <button
//                             className="text-gray-700 hover:text-primary transition"
//                             onClick={toggleSidebar}
//                         >
//                             <FaBars className="text-xl" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Mobile Sidebar */}
//             <div
//                 className={`fixed inset-0 z-50 flex transform ${
//                     isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//                 } transition-transform duration-300 ease-in-out`}
//             >
//                 <div
//                     className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"
//                     onClick={closeSidebar}
//                 ></div>
//                 <div
//                     className="relative bg-white w-64 max-w-xs h-full shadow-lg"
//                 >
//                     <div className="flex items-center justify-between p-4 border-b">
//                         <div className="text-2xl font-bold text-gray-800">
//                             <NavLink to="/" className="flex items-center">
//                                 <span className="text-primary">Jewelry</span> Store
//                             </NavLink>
//                         </div>
//                         <button
//                             className="text-gray-700 hover:text-primary"
//                             onClick={closeSidebar}
//                         >
//                             <FaTimes className="w-6 h-6" />
//                         </button>
//                     </div>
//                     <nav className="mt-4">
//                         {navLinks.map((link) => (
//                             <NavLink
//                                 key={link.name}
//                                 to={link.path}
//                                 className={({ isActive }) =>
//                                     isActive ? 'block px-4 py-2 text-primary bg-gray-200' : 'block px-4 py-2 text-gray-700 hover:bg-gray-200 transition'
//                                 }
//                                 onClick={closeSidebar}
//                             >
//                                 {link.name}
//                             </NavLink>
//                         ))}
//                         {user ? (
//                             <>
//                                 <NavLink to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition" onClick={closeSidebar}>
//                                     Profile
//                                 </NavLink>
//                                 <button onClick={() => { handleLogout(); closeSidebar(); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 transition">
//                                     Logout
//                                 </button>
//                             </>
//                         ) : (
//                             <NavLink to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 transition" onClick={closeSidebar}>
//                                 Sign In
//                             </NavLink>
//                         )}
//                     </nav>
//                 </div>
//             </div>
//         </header>
//     );
// };
//
// export default Header;
// ========================design================
// import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
//
// const Header = () => {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//
//     const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
//     const closeSidebar = () => setIsSidebarOpen(false);
//
//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth >= 768) {
//                 closeSidebar();
//             }
//         };
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);
//
//     // Define the list of links
//     const navLinks = [
//         { name: 'Home', path: '/' },
//         { name: 'Shop', path: '/products' },
//         { name: 'ProductDetail', path: '/product' },
//         { name: 'Sign in', path: '/login' },
//         { name: 'About Us', path: '/about' },
//         { name: 'Contact', path: '/contact' }
//     ];
//
//     return (
//         <header className="bg-white shadow-md py-4 px-4">
//             <div className="container mx-auto flex items-center justify-between">
//                 {/* Desktop Layout */}
//                 <div className="hidden md:flex items-center justify-between w-full">
//                     {/* Logo */}
//                     <div className="text-2xl font-bold text-gray-800">
//                         <NavLink to="/" className="flex items-center">
//                             <span className="text-primary">Jewelry</span> Store
//                         </NavLink>
//                     </div>
//
//                     {/* Desktop Navigation Links */}
//                     <nav className="flex space-x-6">
//                         {navLinks.map((link) => (
//                             <NavLink
//                                 key={link.name}
//                                 to={link.path}
//                                 className={({ isActive }) =>
//                                     isActive ? 'text-primary' : 'text-gray-700 hover:text-primary transition'
//                                 }
//                             >
//                                 {link.name}
//                             </NavLink>
//                         ))}
//                     </nav>
//
//                     {/* Cart and Profile Icons */}
//                     <div className="flex items-center space-x-6">
//                         {/* Cart Icon */}
//                         <div className="relative">
//                             <NavLink to="/cart" className="text-gray-700 hover:text-primary transition flex items-center">
//                                 <FaShoppingCart className="text-2xl" />
//                                 <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-2 py-1">
//                                     3
//                                 </span>
//                             </NavLink>
//                         </div>
//
//                         {/* Profile Section */}
//                         <div className="relative">
//                             <NavLink to="/profile" className="text-gray-700 hover:text-primary transition flex items-center">
//                                 <FaUser className="text-2xl" />
//                             </NavLink>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Mobile Layout */}
//                 <div className="md:hidden flex items-center w-full">
//                     {/* Logo */}
//                     <div className="flex-grow text-xl font-bold text-gray-800">
//                         <NavLink to="/" className="flex items-center">
//                             <span className="text-primary">Jewelry</span> Store
//                         </NavLink>
//                     </div>
//
//                     {/* Cart, Profile, and Menu Icon */}
//                     <div className="flex items-center space-x-4">
//                         {/* Cart Icon */}
//                         <div className="relative">
//                             <NavLink to="/cart" className="text-gray-700 hover:text-primary transition flex items-center">
//                                 <FaShoppingCart className="text-xl" />
//                                 <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-2 py-1">
//                                     3
//                                 </span>
//                             </NavLink>
//                         </div>
//
//                         {/* Profile Section */}
//                         <div className="relative">
//                             <NavLink to="/profile" className="text-gray-700 hover:text-primary transition flex items-center">
//                                 <FaUser className="text-xl" />
//                             </NavLink>
//                         </div>
//
//                         {/* Menu Icon */}
//                         <button
//                             className="text-gray-700 hover:text-primary transition"
//                             onClick={toggleSidebar}
//                         >
//                             <FaBars className="text-xl" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Mobile Sidebar */}
//             <div
//                 className={`fixed inset-0 z-50 flex transform ${
//                     isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//                 } transition-transform duration-300 ease-in-out`}
//             >
//                 <div
//                     className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"
//                     onClick={closeSidebar}
//                 ></div>
//                 <div
//                     className="relative bg-white w-64 max-w-xs h-full shadow-lg"
//                 >
//                     <div className="flex items-center justify-between p-4 border-b">
//                         <div className="text-2xl font-bold text-gray-800">
//                             <NavLink to="/" className="flex items-center">
//                                 <span className="text-primary">Jewelry</span> Store
//                             </NavLink>
//                         </div>Z
//                         <button
//                             className="text-gray-700 hover:text-primary"
//                             onClick={closeSidebar}
//                         >
//                             <FaTimes className="w-6 h-6" />
//                         </button>
//                     </div>
//                     <nav className="mt-4">
//                         {navLinks.map((link) => (
//                             <NavLink
//                                 key={link.name}
//                                 to={link.path}
//                                 className={({ isActive }) =>
//                                     isActive ? 'block px-4 py-2 text-primary bg-gray-200' : 'block px-4 py-2 text-gray-700 hover:bg-gray-200 transition'
//                                 }
//                             >
//                                 {link.name}
//                             </NavLink>
//                         ))}
//                     </nav>
//                 </div>
//             </div>
//         </header>
//     );
// };
//
// export default Header;

// import React, { useState, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
//
// const Header = () => {
//     const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//
//     const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
//     const closeSidebar = () => setIsSidebarOpen(false);
//
//     useEffect(() => {
//         const handleResize = () => {
//             if (window.innerWidth >= 768) {
//                 closeSidebar();
//             }
//         };
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);
//
//     return (
//         <header className="bg-white shadow-md py-4">
//             <div className="container mx-auto flex items-center justify-between px-4">
//                 {/* Desktop Layout */}
//                 <div className="hidden md:flex items-center justify-between w-full">
//                     {/* Logo */}
//                     <div className="text-2xl font-bold text-gray-800">
//                         <NavLink to="/" className="flex items-center">
//                             <span className="text-primary">Jewelry</span> Store
//                         </NavLink>
//                     </div>
//
//                     {/* Desktop Navigation Links */}
//                     <nav className="flex space-x-6">
//                         <NavLink
//                             to="/"
//                             className={({ isActive }) =>
//                                 isActive ? 'text-primary' : 'text-gray-700 hover:text-primary transition'
//                             }
//                         >
//                             Home
//                         </NavLink>
//                         <NavLink
//                             to="/shop"
//                             className={({ isActive }) =>
//                                 isActive ? 'text-primary' : 'text-gray-700 hover:text-primary transition'
//                             }
//                         >
//                             Shop
//                         </NavLink>
//                         <NavLink
//                             to="/about"
//                             className={({ isActive }) =>
//                                 isActive ? 'text-primary' : 'text-gray-700 hover:text-primary transition'
//                             }
//                         >
//                             About Us
//                         </NavLink>
//                         <NavLink
//                             to="/contact"
//                             className={({ isActive }) =>
//                                 isActive ? 'text-primary' : 'text-gray-700 hover:text-primary transition'
//                             }
//                         >
//                             Contact
//                         </NavLink>
//                     </nav>
//
//                     {/* Cart and Profile Icons */}
//                     <div className="flex items-center space-x-6">
//                         {/* Cart Icon */}
//                         <div className="relative">
//                             <NavLink to="/cart" className="text-gray-700 hover:text-primary transition flex items-center">
//                                 <FaShoppingCart className="text-2xl" />
//                                 <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-2 py-1">
//                                     3
//                                 </span>
//                             </NavLink>
//                         </div>
//
//                         {/* Profile Section */}
//                         <div className="relative">
//                             <NavLink to="/profile" className="text-gray-700 hover:text-primary transition flex items-center">
//                                 <FaUser className="text-2xl" />
//                             </NavLink>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Mobile Layout */}
//                 <div className="md:hidden flex items-center w-full">
//                     {/* Logo */}
//                     <div className="flex-grow text-xl font-bold text-gray-800">
//                         <NavLink to="/" className="flex items-center">
//                             <span className="text-primary">Jewelry</span> Store
//                         </NavLink>
//                     </div>
//
//                     {/* Cart, Profile, and Menu Icon */}
//                     <div className="flex items-center space-x-4">
//                         {/* Cart Icon */}
//                         <div className="relative">
//                             <NavLink to="/cart" className="text-gray-700 hover:text-primary transition flex items-center">
//                                 <FaShoppingCart className="text-xl" />
//                                 <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-2 py-1">
//                                     3
//                                 </span>
//                             </NavLink>
//                         </div>
//
//                         {/* Profile Section */}
//                         <div className="relative">
//                             <NavLink to="/profile" className="text-gray-700 hover:text-primary transition flex items-center">
//                                 <FaUser className="text-xl" />
//                             </NavLink>
//                         </div>
//
//                         {/* Menu Icon */}
//                         <button
//                             className="text-gray-700 hover:text-primary transition"
//                             onClick={toggleSidebar}
//                         >
//                             <FaBars className="text-xl" />
//                         </button>
//                     </div>
//                 </div>
//             </div>
//
//             {/* Mobile Sidebar */}
//             <div
//                 className={`fixed inset-0 z-50 flex transform ${
//                     isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//                 } transition-transform duration-300 ease-in-out`}
//             >
//                 <div
//                     className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity"
//                     onClick={closeSidebar}
//                 ></div>
//                 <div
//                     className="relative bg-white w-64 max-w-xs h-full shadow-lg"
//                 >
//                     <div className="flex items-center justify-between p-4 border-b">
//                         <div className="text-2xl font-bold text-gray-800">
//                             <NavLink to="/" className="flex items-center">
//                                 <span className="text-primary">Jewelry</span> Store
//                             </NavLink>
//                         </div>
//                         <button
//                             className="text-gray-700 hover:text-primary"
//                             onClick={closeSidebar}
//                         >
//                             <FaTimes className="w-6 h-6" />
//                         </button>
//                     </div>
//                     <nav className="mt-4">
//                         <NavLink
//                             to="/"
//                             className={({ isActive }) =>
//                                 isActive ? 'block px-4 py-2 text-primary bg-gray-200' : 'block px-4 py-2 text-gray-700 hover:bg-gray-200 transition'
//                             }
//                         >
//                             Home
//                         </NavLink>
//                         <NavLink
//                             to="/shop"
//                             className={({ isActive }) =>
//                                 isActive ? 'block px-4 py-2 text-primary bg-gray-200' : 'block px-4 py-2 text-gray-700 hover:bg-gray-200 transition'
//                             }
//                         >
//                             Shop
//                         </NavLink>
//                         <NavLink
//                             to="/about"
//                             className={({ isActive }) =>
//                                 isActive ? 'block px-4 py-2 text-primary bg-gray-200' : 'block px-4 py-2 text-gray-700 hover:bg-gray-200 transition'
//                             }
//                         >
//                             About Us
//                         </NavLink>
//                         <NavLink
//                             to="/contact"
//                             className={({ isActive }) =>
//                                 isActive ? 'block px-4 py-2 text-primary bg-gray-200' : 'block px-4 py-2 text-gray-700 hover:bg-gray-200 transition'
//                             }
//                         >
//                             Contact
//                         </NavLink>
//                     </nav>
//                 </div>
//             </div>
//         </header>
//     );
// };
//
// export default Header;
