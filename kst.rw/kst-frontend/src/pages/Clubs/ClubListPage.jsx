import React, { useState, useEffect } from 'react';
import apiClient, { getMediaPath } from '../../api/apiClient';
import { MapPin, Users, Globe, Award, Film, X, Play, BookOpen } from 'lucide-react';

const ClubListPage = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClub, setSelectedClub] = useState(null);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);


    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await apiClient.get('/clubs');
                if (response.data.success) {
                    setClubs(response.data.data.clubs);
                }
            } catch (error) {
                console.error('Failed to fetch clubs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClubs();
    }, []);

    const openLibrary = (club) => {
        setSelectedClub(club);
        setIsLibraryOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLibrary = () => {
        setIsLibraryOpen(false);
        setTimeout(() => setSelectedClub(null), 500);
        document.body.style.overflow = 'auto';
    };

    if (loading) return (
        <div className="h-screen bg-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-dark pt-32 lg:pt-48 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 relative animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-playfair font-black text-white/[0.03] select-none uppercase tracking-tighter">
                        Branches
                    </div>
                    <p className="text-gold font-bold tracking-[0.6em] uppercase text-sm mb-6 drop-shadow-lg">Our Locations</p>
                    <h1 className="text-6xl md:text-9xl font-playfair font-black text-white text-glow leading-none italic mb-8 uppercase">
                        Our <span className="text-primary italic font-playfair">Clubs</span>
                    </h1>
                    <p className="text-white/60 text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                        Find a training club near you. Our temple branches are open for students of all levels.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                    {clubs.map((club, index) => (
                        <div
                            key={club.id}
                            className="group flex flex-col lg:flex-row bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden hover:border-gold/20 transition-all duration-700 hover:shadow-luxury animate-in fade-in slide-in-from-bottom-10 fill-mode-both"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Cinematic Visual */}
                            <div className="lg:w-1/2 h-[400px] lg:h-auto overflow-hidden relative">
                                <img
                                    src={getMediaPath(club.image)}
                                    alt={club.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ken-burns"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-transparent to-transparent hidden lg:block" />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-dark via-transparent to-transparent lg:hidden" />

                                {club.tutorials?.length > 0 && (
                                    <div className="absolute top-6 left-6">
                                        <div className="glass-gold px-4 py-2 rounded-full flex items-center space-x-2 border border-gold/30">
                                            <Award size={14} className="text-gold" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                                {club.tutorials.length} Scrolls of Wisdom
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-white/[0.01] to-transparent">
                                <h3 className="text-4xl font-playfair font-black text-white mb-6 group-hover:text-gold transition-colors italic leading-tight">
                                    {club.name}
                                </h3>

                                <div className="space-y-6 mb-10">
                                    <div className="flex items-center space-x-4 text-white/50 group-hover:text-white/70 transition-colors">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold/10 group-hover:border-gold/30 transition-all">
                                            <MapPin size={20} />
                                        </div>
                                        <span className="font-medium text-lg">{club.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-white/50 group-hover:text-white/70 transition-colors">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold/10 group-hover:border-gold/30 transition-all">
                                            <Users size={20} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gold/60">Temple Guidance</span>
                                            <span className="font-medium text-lg italic">Master Instructor</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-white/40 text-base leading-relaxed mb-10 line-clamp-4 font-medium group-hover:text-white/60 transition-colors">
                                    {club.description}
                                </p>

                                <div className="flex flex-wrap items-center gap-4">
                                    <button className="inline-flex items-center space-x-4 px-8 py-5 bg-primary rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:bg-gold transition-all shadow-luxury active:scale-95 border border-white/5">
                                        <span>Join The Sanctuary</span>
                                        <Globe size={16} />
                                    </button>

                                    {club.tutorials?.length > 0 && (
                                        <button
                                            onClick={() => openLibrary(club)}
                                            className="inline-flex items-center space-x-4 px-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-gold font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all active:scale-95"
                                        >
                                            <Film size={16} />
                                            <span>Enter Library</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tutorial Library Modal */}
            {selectedClub && (
                <div
                    className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ${isLibraryOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-dark/95 backdrop-blur-2xl"
                        onClick={closeLibrary}
                    />

                    {/* Modal Content */}
                    <div
                        className={`relative w-full max-w-6xl max-h-[90vh] mx-6 bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden flex flex-col transition-all duration-700 ${isLibraryOpen ? 'translate-y-0 scale-100 rotate-0' : 'translate-y-20 scale-90 rotate-2'}`}
                    >
                        {/* Modal Header */}
                        <div className="p-8 md:p-12 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <BookOpen className="text-gold" size={20} />
                                    <span className="text-gold font-bold tracking-[0.4em] uppercase text-[10px]">Library of Knowledge</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-playfair font-black text-white italic">
                                    {selectedClub.name} <span className="text-primary italic">Archives</span>
                                </h2>
                            </div>
                            <button
                                onClick={closeLibrary}
                                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-gold/30 hover:rotate-90 transition-all duration-500"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-12">
                                {selectedClub.tutorials?.map((tutorial, idx) => (
                                    <div
                                        key={tutorial.id}
                                        className="group/item flex flex-col lg:flex-row gap-8 items-center bg-white/[0.01] p-8 rounded-[2rem] border border-white/5 hover:border-gold/20 transition-all duration-500"
                                    >
                                        <div className="w-full lg:w-3/5 rounded-2xl overflow-hidden aspect-video relative group/video">
                                            <video
                                                src={getMediaPath(tutorial.videoUrl)}
                                                controls
                                                className="w-full h-full object-cover"
                                                poster={getMediaPath(selectedClub.image)}
                                            />
                                            <div className="absolute inset-0 bg-dark/40 flex items-center justify-center opacity-100 group-hover/video:opacity-0 pointer-events-none transition-opacity duration-500">
                                                <div className="w-20 h-20 rounded-full bg-gold/20 backdrop-blur-md border border-gold/30 flex items-center justify-center group-hover/video:scale-110 transition-transform duration-500">
                                                    <Play className="text-gold fill-gold" size={32} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full lg:w-2/5 flex flex-col justify-center">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold text-xs font-black">
                                                    {idx + 1}
                                                </div>
                                                <span className="text-gold/60 font-black uppercase tracking-widest text-[10px]">Scroll {idx + 1}</span>
                                            </div>
                                            <h4 className="text-2xl font-playfair font-bold text-white mb-4 group-hover/item:text-gold transition-colors italic">
                                                {tutorial.title}
                                            </h4>
                                            <p className="text-white/40 text-sm leading-relaxed font-medium">
                                                {tutorial.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClubListPage;

