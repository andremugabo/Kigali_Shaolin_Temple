import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans antialiased text-gray-900">
            {/* Sidebar - Desktop */}
            <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0'} fixed lg:relative z-40 h-full transition-all duration-300 ease-in-out`}>
                <Sidebar />
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Navbar toggleSidebar={toggleSidebar} />

                <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-6 lg:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
