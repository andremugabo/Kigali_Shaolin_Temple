import React, { useState, useEffect } from 'react';
import apiClient, { getMediaPath } from '../../api/apiClient';
import { MapPin, Users, Globe } from 'lucide-react';

const ClubListPage = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return (
        <div className="h-screen bg-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-dark pt-32 lg:pt-48 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-playfair font-black text-white/[0.03] select-none uppercase tracking-tighter">
                        Locations
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
                    {clubs.map((club) => (
                        <div
                            key={club.id}
                            className="group flex flex-col lg:flex-row bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden hover:border-gold/20 transition-all duration-700 hover:shadow-luxury"
                        >
                            {/* Cinematic Visual */}
                            <div className="lg:w-1/2 h-[400px] lg:h-auto overflow-hidden relative">
                                <img
                                    src={getMediaPath(club.image)}
                                    alt={club.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-dark/60 via-transparent to-transparent hidden lg:block" />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-dark via-transparent to-transparent lg:hidden" />
                            </div>

                            {/* Details */}
                            <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center">
                                <h3 className="text-4xl font-playfair font-black text-white mb-6 group-hover:text-gold transition-colors italic leading-tight">
                                    {club.name}
                                </h3>

                                <div className="space-y-6 mb-10">
                                    <div className="flex items-center space-x-4 text-white/50">
                                        <div className="w-10 h-10 rounded-xl glass-gold flex items-center justify-center text-gold">
                                            <MapPin size={20} />
                                        </div>
                                        <span className="font-medium text-lg">{club.location}</span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-white/50">
                                        <div className="w-10 h-10 rounded-xl glass-gold flex items-center justify-center text-gold">
                                            <Users size={20} />
                                        </div>
                                        <span className="font-medium text-lg italic">Head Instructor</span>
                                    </div>
                                </div>

                                <p className="text-white/40 text-base leading-relaxed mb-10 line-clamp-4">
                                    {club.description}
                                </p>

                                <button className="inline-flex items-center space-x-4 px-8 py-4 bg-primary rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:bg-gold transition-all shadow-xl self-start">
                                    <span>Join This Club</span>
                                    <Globe size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClubListPage;
