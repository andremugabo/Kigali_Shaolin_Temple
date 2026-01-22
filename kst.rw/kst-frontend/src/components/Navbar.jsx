import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Programs', path: '/programs' },
        { name: 'Blog', path: '/blog' },
        { name: 'Locations', path: '/clubs' },
        { name: 'Gallery', path: '/gallery' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3 glass-gold shadow-luxury' : 'py-6 bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo Area */}
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center border border-gold/30 shadow-lg group-hover:rotate-12 transition-transform duration-500 overflow-hidden">
                        <img src="/logo.png" alt="KST Logo" className="w-full h-full object-contain p-1" />
                    </div>
                    <div>
                        <span className="block text-xl font-playfair font-black tracking-widest text-white leading-none uppercase group-hover:text-gold transition-colors">Kigali Shaolin</span>
                        <span className="block text-[10px] font-inter font-bold tracking-[0.3em] text-gold/80 uppercase mt-0.5">Heritage & Training</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`px-4 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition-all duration-300 relative group overflow-hidden ${isActive(link.path) ? 'text-gold' : 'text-white/70 hover:text-white'
                                }`}
                        >
                            <span className="relative z-10">{link.name}</span>
                            {isActive(link.path) && (
                                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold rounded-full" />
                            )}
                            <span className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                        </Link>
                    ))}

                    <div className="h-6 w-px bg-white/10 mx-4" />

                    {/* Language Switcher Placeholder */}
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all group">
                        <Globe size={16} className="text-gold group-hover:rotate-180 transition-transform duration-700" />
                        <span className="text-xs font-black uppercase tracking-tighter">EN</span>
                        <ChevronDown size={14} className="text-white/40" />
                    </button>
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 text-white hover:text-gold transition-colors"
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}>
                <div className="absolute inset-0 bg-dark/95 backdrop-blur-2xl" />
                <div className="relative h-full flex flex-col items-center justify-center p-8">
                    {navLinks.map((link, index) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-3xl font-playfair font-black text-white hover:text-gold mb-8 transition-all tracking-tight"
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
