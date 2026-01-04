import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './TopBar';

const Layout = () => {
    const location = useLocation();
    const hideTopBarPaths = ['/login', '/signup', '/ngoapply', '/ngo-success', '/complete-profile'];
    const shouldHideTopBar = hideTopBarPaths.includes(location.pathname);

    return (
        <div className="min-h-screen bg-gray-50">
            {!shouldHideTopBar && <TopBar />}
            <main>
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
