import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaFileUpload } from 'react-icons/fa';

const SidebarList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeItem, setActiveItem] = useState(location.pathname);

    const navItems = [
        { label: 'Dashboard', key:"dashboard" ,icon: FaTachometerAlt, path: '/' },
        { label: 'File Upload', key:"file_upload" ,icon: FaFileUpload, path: '/file-upload' }
    ];

    const handleNavigation = (path) => {
        setActiveItem(path);
        navigate(path);
    };

    return (
        <React.Fragment>
            {navItems.map(({ label, icon: Icon, path, key }) => (
                <div className='p-2' key={key}>
                <button
                    key={key}
                    onClick={() => handleNavigation(path)}
                    className={`flex items-center p-4 w-full text-left transition-colors border-2 duration-200 text-[#29e6c0]
                        font-karla text-base font-semibold ${
                            activeItem === path ? 'bg-forrest-green' : 'hover:bg-grey'
                        }`}
                >
                    <Icon className={`mr-4 text-aqua`} />
                    <span>{label}</span>
                </button>
                </div>
            ))}
        </React.Fragment>
    );
};

export default SidebarList;
