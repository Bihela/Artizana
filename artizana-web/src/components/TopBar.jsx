import React, { useState } from 'react';
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

    return (
        <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Left Section: Menu & Logo */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500">
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-bold text-xl text-gray-900">Artizana</span>
                        </div>
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
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Search for products or artisans"
                                />
                            </div>
                            <div className="relative inline-block text-left">
                                <button
                                    type="button"
                                    className="inline-flex justify-center w-full rounded-r-md border border-l-0 border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                                >
                                    {category}
                                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Icons & Menu */}
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 relative">
                            <ShoppingCartIcon className="h-6 w-6" />
                        </button>

                        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 relative">
                            <BellIcon className="h-6 w-6" />
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                            >
                                <UserIcon className="h-6 w-6" />
                            </button>

                            {isProfileOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                    <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                                    <a href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
                                </div>
                            )}
                        </div>

                        {/* Language Switcher */}
                        <div className="hidden sm:flex items-center">
                            <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
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
