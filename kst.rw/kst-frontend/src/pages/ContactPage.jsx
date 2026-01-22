import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { Send, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { toast } from 'react-toastify';
import { useScrollReveal } from '../hooks/useScrollReveal';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [infoRef, infoVisible] = useScrollReveal();
    const [formRef, formVisible] = useScrollReveal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await apiClient.post('/messages', formData);
            if (response.data.success) {
                toast.success('Your message has been sent to the temple team.');
                setFormData({ name: '', email: '', message: '' });
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark pt-32 lg:pt-48 pb-32 relative overflow-hidden">
            {/* Cinematic background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 blur-[150px] rounded-full -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start">
                    {/* Contact Information */}
                    <div ref={infoRef} className={`reveal-hidden ${infoVisible ? 'reveal-visible' : ''}`}>
                        <p className="text-gold font-bold tracking-[0.6em] uppercase text-sm mb-6 drop-shadow-lg">Contact Us</p>
                        <h1 className="text-6xl md:text-8xl font-playfair font-black text-white text-glow leading-none italic mb-12 uppercase">
                            Get In <span className="text-primary italic font-playfair">Touch</span>
                        </h1>
                        <p className="text-white/60 text-xl font-medium mb-16 leading-relaxed">
                            Reach out to us for training inquiries, club locations, or general information about our temple.
                        </p>

                        <div className="space-y-10">
                            {[
                                { icon: Phone, label: 'Phone Number', value: '+250 788 000 000' },
                                { icon: Mail, label: 'Email Address', value: 'contact@kst.rw' },
                                { icon: MapPin, label: 'Headquarters', value: 'Kigali, Rwanda' }
                            ].map((item, i) => (
                                <div key={i} className="group flex items-center space-x-6">
                                    <div className="w-16 h-16 rounded-2xl glass-gold flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-dark transition-all duration-500 shadow-xl">
                                        <item.icon size={28} />
                                    </div>
                                    <div>
                                        <p className="text-white/30 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">{item.label}</p>
                                        <p className="text-white text-xl font-playfair font-black tracking-wide">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-20 pt-12 border-t border-white/5">
                            <h3 className="text-gold font-bold uppercase tracking-[0.4em] text-xs mb-6">Follow Us</h3>
                            <div className="flex space-x-6">
                                {['Instagram', 'Twitter', 'Facebook'].map(social => (
                                    <a key={social} href="#" className="text-white/40 hover:text-gold font-black uppercase tracking-widest text-xs transition-colors">{social}</a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div ref={formRef} className={`glass-gold p-10 lg:p-16 rounded-[3rem] shadow-luxury border-white/10 relative group reveal-hidden ${formVisible ? 'reveal-visible' : ''}`}>
                        <div className="absolute -inset-1 bg-gradient-to-br from-gold/20 via-transparent to-primary/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                            <div>
                                <label className="block text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 ml-1">Your Name</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all font-medium text-lg"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 ml-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all font-medium text-lg"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block text-white/40 font-bold uppercase tracking-[0.3em] text-[10px] mb-3 ml-1">Your Message</label>
                                <textarea
                                    required
                                    rows="6"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-white/20 focus:outline-none focus:border-gold/50 focus:bg-white/10 transition-all font-medium text-lg resize-none"
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full group relative flex items-center justify-center space-x-4 bg-primary px-8 py-6 rounded-2xl text-white font-black tracking-[0.2em] uppercase text-sm hover:bg-gold transition-all duration-500 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_20px_40px_rgba(123,30,30,0.3)]"
                            >
                                <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                                <Send size={20} className={`relative z-10 transition-all duration-500 ${isSubmitting ? 'translate-x-12 -translate-y-12 opacity-0' : 'group-hover:translate-x-2'}`} />
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
