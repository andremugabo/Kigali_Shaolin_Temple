import React, { useState, useEffect } from 'react';
import apiClient, { getMediaPath } from '../api/apiClient';
import { useScrollReveal } from '../hooks/useScrollReveal';

const ProgramListPage = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);

    const [headerRef, headerVisible] = useScrollReveal();
    const [gridRef, gridVisible] = useScrollReveal();

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const response = await apiClient.get('/programs');
                if (response.data.success) {
                    setPrograms(response.data.data.programs);
                }
            } catch (error) {
                console.error('Failed to fetch programs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    if (loading) return (
        <div className="h-screen bg-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-dark pt-32 lg:pt-48 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                <div ref={headerRef} className={`text-center mb-24 reveal-hidden ${headerVisible ? 'reveal-visible' : ''}`}>
                    <p className="text-gold font-bold tracking-[0.6em] uppercase text-sm mb-6 drop-shadow-lg">Training & Discipline</p>
                    <h1 className="text-6xl md:text-9xl font-playfair font-black text-white text-glow leading-none italic mb-8 uppercase">
                        Training <span className="text-primary italic font-playfair">Programs</span>
                    </h1>
                    <p className="text-white/60 text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                        Explore our training programs designed for physical health, mental focus, and personal development.
                    </p>
                </div>

                <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 reveal-hidden ${gridVisible ? 'reveal-visible' : ''}`}>
                    {programs.map((program) => (
                        <div
                            key={program.id}
                            className="group relative flex flex-col bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden hover:border-gold/20 transition-all duration-700 hover:shadow-luxury"
                        >
                            {/* Image Header */}
                            <div className="relative h-[300px] overflow-hidden">
                                <img
                                    src={getMediaPath(program.image)}
                                    alt={program.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ken-burns"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />

                                <div className="absolute top-6 left-6">
                                    <span className="bg-primary/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg border border-white/10">
                                        Active Training
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-10 flex-1 flex flex-col">
                                <h3 className="text-3xl font-playfair font-black text-white mb-6 group-hover:text-gold transition-colors italic">
                                    {program.name}
                                </h3>
                                <p className="text-white/50 text-base leading-relaxed mb-8 flex-1">
                                    {program.description}
                                </p>

                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Temple Program</span>
                                    <div className="w-10 h-10 rounded-full glass-gold flex items-center justify-center text-white group-hover:bg-gold group-hover:text-dark transition-all duration-500">
                                        <div className="w-2 h-2 bg-current rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProgramListPage;
