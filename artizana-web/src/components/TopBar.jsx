import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Bars3Icon,
    MagnifyingGlassIcon,
    ShoppingCartIcon,
    BellIcon,
    UserIcon,
    ChevronDownIcon
} from '@heroicons/react/24/outline';

const TopBar = () => {
    const [category] = useState('Categories');
    const [language] = useState('ENG / LKR');
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

    // Update auth state on route change (e.g. after login/logout)
    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('authToken'));
    }, [location.pathname]);

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-[60]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Left Section: Menu & Logo */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 md:hidden" aria-label="Open menu">
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-2xl text-green-600 tracking-tight">Artizana</span>
                        </Link>
                    </div>

                    {/* Center Section: Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <div className="relative w-full flex">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-500 sm:text-sm transition-colors duration-200"
                                    placeholder="Search for products or artisans"
                                    aria-label="Search"
                                />
                            </div>
                            <div className="relative inline-block text-left">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-r-md border border-l-0 border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                                    aria-label="Select category"
                                >
                                    {category}
                                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Icons & Menu */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button className="p-2 rounded-full hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors relative" aria-label="Cart">
                            <ShoppingCartIcon className="h-6 w-6" />
                        </button>

                        <button className="p-2 rounded-full hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors relative" aria-label="Notifications">
                            <BellIcon className="h-6 w-6" />
                        </button>

                        {/* User Menu - Always visible */}
                        <div className="relative ml-2">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="p-2 rounded-full hover:bg-green-50 text-gray-500 hover:text-green-600 transition-colors"
                                aria-label="User menu"
                            >
                                <UserIcon className="h-6 w-6" />
                            </button>

                            {isProfileOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in-down">
                                    {isLoggedIn ? (
                                        <>
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                My Profile
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Settings
                                            </Link>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <button
                                                onClick={() => {
                                                    localStorage.removeItem('authToken');
                                                    localStorage.removeItem('currentUser');
                                                    window.location.href = '/';
                                                }}
                                                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/signup"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700"
                                                onClick={() => setIsProfileOpen(false)}
                                            >
                                                Sign Up
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button (Hidden here as we used the unified User Icon approach) */}
                        <div className="md:hidden">
                            {/* Mobile specific logic if needed, but the User Icon above works for both mobile and desktop now */}
                        </div>

                        {/* Language Switcher */}
                        <div className="hidden sm:flex items-center ml-2 border-l pl-4 border-gray-200">
                            <button className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900">
                                {language}
                                <ChevronDownIcon className="ml-1 h-4 w-4" />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default TopBar;
