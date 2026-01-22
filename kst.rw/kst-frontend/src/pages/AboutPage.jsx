import React, { useState, useEffect } from 'react';
import apiClient, { getMediaPath } from '../api/apiClient';

const AboutPage = () => {
    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const response = await apiClient.get('/about');
                if (response.data.success) {
                    const d = response.data.data;
                    setAbout(Array.isArray(d) ? d[0] : d);
                }
            } catch (error) {
                console.error('Failed to fetch about content:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAbout();
    }, []);

    if (loading) return (
        <div className="h-screen bg-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-dark pt-32 lg:pt-48">
            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="text-center mb-24 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-playfair font-black text-white/[0.03] select-none uppercase tracking-tighter">
                        History
                    </div>
                    <p className="text-gold font-bold tracking-[0.6em] uppercase text-sm mb-6 drop-shadow-lg">Since 2012</p>
                    <h1 className="text-6xl md:text-9xl font-playfair font-black text-white text-glow leading-none italic uppercase">
                        About <span className="text-primary italic font-playfair">Us</span>
                    </h1>
                </div>

                {about && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-start mb-40">
                        {/* Narrative */}
                        <div className="space-y-12">
                            <div className="relative">
                                <span className="absolute -left-12 top-0 text-7xl font-playfair text-primary/40 italic">"</span>
                                <h2 className="text-4xl md:text-5xl font-playfair font-black text-white leading-tight italic">
                                    Preserving the ancient soul of <span className="text-gold italic">Kung Fu</span> in the heart of Africa.
                                </h2>
                            </div>

                            <div className="prose prose-invert prose-xl text-white/70 font-medium leading-relaxed max-w-none space-y-8">
                                {about.content?.split('\n').map((para, i) => para && (
                                    <p key={i} className="mb-6">{para}</p>
                                ))}
                            </div>

                            {/* Principles Grid */}
                            <div className="grid grid-cols-2 gap-6 pt-12">
                                {[
                                    { label: 'Wisdom', icon: '01' },
                                    { label: 'Spirit', icon: '02' },
                                    { label: 'Mastery', icon: '03' },
                                    { label: 'Unity', icon: '04' }
                                ].map((item) => (
                                    <div key={item.label} className="glass p-8 rounded-3xl border-white/5 hover:border-gold/20 transition-all group">
                                        <span className="text-gold/40 font-black text-xs block mb-2">{item.icon}</span>
                                        <h3 className="text-2xl font-playfair font-black text-white group-hover:text-gold transition-colors">{item.label}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visuals/Founder */}
                        <div className="sticky top-48">
                            <div className="relative group">
                                <div className="absolute -inset-6 bg-primary/20 rounded-[4rem] blur-[100px] opacity-50" />
                                <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-luxury aspect-[3/4]">
                                    <img
                                        src={getMediaPath(about.image)}
                                        alt="Founder"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />

                                    {/* Founder Badge */}
                                    <div className="absolute bottom-10 left-10 right-10 glass-gold p-8 rounded-3xl border-gold/30">
                                        <h3 className="text-3xl font-playfair font-black text-white italic mb-1">{about.founder_name}</h3>
                                        <p className="text-gold font-bold uppercase tracking-[0.3em] text-[10px]">Head of the Temple</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center justify-center space-x-12 opacity-30 italic font-playfair text-xl">
                                <span>Tradition</span>
                                <div className="w-12 h-px bg-white/40" />
                                <span>Honor</span>
                                <div className="w-12 h-px bg-white/40" />
                                <span>Strength</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AboutPage;
