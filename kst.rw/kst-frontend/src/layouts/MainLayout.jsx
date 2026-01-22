import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-dark flex flex-col font-inter selection:bg-gold selection:text-black">
            {/* Nav sits on top with absolute positioning to allow hero content behind it */}
            <Navbar />

            {/* Main content area */}
            <main className="flex-grow relative z-0">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;
