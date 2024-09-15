// HomePage.js
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const HomePage = ({ children }) => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleResize = () => {
        setDrawerOpen(window.innerWidth >= 1024);
    };

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleDrawer = () => setDrawerOpen(!drawerOpen);

    return (
        <div className="flex h-screen">
            <Header toggleDrawer={toggleDrawer} />
            <Sidebar drawerOpen={drawerOpen} />
            <div className={`flex-1 transition-transform duration-300 ${drawerOpen ? 'ml-60' : 'ml-0'}`}>
                <main className=" mt-10">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default HomePage;
