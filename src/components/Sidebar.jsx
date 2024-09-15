// Sidebar.js
import React from 'react';
import SidebarList from './SidebarList';

const Sidebar = ({ drawerOpen }) => {
    return (
        <aside className={`fixed top-[3rem] left-0 w-60 h-screen bg-dark-blue shadow-lg z-40 transform ${drawerOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300`}>
            <nav className="p-4">
                <SidebarList />
            </nav>
        </aside>
    );
};

export default Sidebar;
