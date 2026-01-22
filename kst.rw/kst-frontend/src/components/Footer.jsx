import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, ExternalLink } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative z-10 bg-black border-t border-white/5 pt-24 pb-12 overflow-hidden">
            {/* Background elements */}
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center border border-gold/20 shadow-luxury group overflow-hidden">
                                <img src="/logo.png" alt="KST" className="w-6 h-6 object-contain group-hover:scale-125 transition-transform duration-500" />
                            </div>
                            <span className="font-playfair font-black text-white tracking-widest uppercase text-lg">Kigali Shaolin</span>
                        </Link>
                        <p className="text-white/40 text-sm leading-relaxed font-medium">
                            A bridge between tradition and modern strength. Dedicated to preserving the authentic spirit of Shaolin Kung Fu in the heart of Africa.
                        </p>
                        <div className="flex space-x-4">
                            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-lg glass-gold flex items-center justify-center text-white/40 hover:text-gold hover:border-gold/40 transition-all">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Paths */}
                    <div>
                        <h4 className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-8">Quick Links</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'About Us', path: '/about' },
                                { name: 'Programs', path: '/programs' },
                                { name: 'Locations', path: '/clubs' },
                                { name: 'Blog', path: '/blog' }
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-white/60 hover:text-white font-medium transition-colors text-sm flex items-center group">
                                        <div className="w-0 group-hover:w-4 h-px bg-gold mr-0 group-hover:mr-3 transition-all duration-300" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-8">Contact Us</h4>
                        <ul className="space-y-6">
                            {[
                                { icon: Phone, text: '+250 788 000 000' },
                                { icon: Mail, text: 'contact@kst.rw' },
                                { icon: MapPin, text: 'Kigali, Rwanda' }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center space-x-4 text-white/50 group cursor-pointer hover:text-white transition-colors">
                                    <item.icon size={16} className="text-gold/40 group-hover:text-gold transition-colors" />
                                    <span className="text-sm font-medium">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter/CTA */}
                    <div className="space-y-8">
                        <h4 className="text-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-8">Newsletter</h4>
                        <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-loose">
                            Subscribe to receive updates, news, and training tips from our temple.
                        </p>
                        <div className="relative group">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/40 transition-all font-medium"
                            />
                            <button className="absolute right-2 top-2 bottom-2 px-4 bg-primary hover:bg-gold text-white rounded-lg transition-all active:scale-95">
                                <ExternalLink size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] font-bold uppercase tracking-[0.4em] text-white/20">
                    <p>© {new Date().getFullYear()} Kigali Shaolin Temple. All rights reserved.</p>
                    <div className="flex space-x-8">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
