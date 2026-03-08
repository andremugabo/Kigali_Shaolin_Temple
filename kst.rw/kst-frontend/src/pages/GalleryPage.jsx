import React, { useState, useEffect } from 'react';
import apiClient, { getMediaPath } from '../api/apiClient';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { Image as ImageIcon, Video, Calendar, Filter, X } from 'lucide-react';

const GalleryPage = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [selectedItem, setSelectedItem] = useState(null);

    const [headerRef, headerVisible] = useScrollReveal();
    const [gridRef, gridVisible] = useScrollReveal();

    const categories = ['ALL', 'TRAINING', 'CEREMONY', 'HERITAGE', 'COMMUNITY'];

    useEffect(() => {
        const fetchMedia = async () => {
            setLoading(true);
            try {
                const categoryParam = activeCategory !== 'ALL' ? `?category=${activeCategory}` : '';
                const response = await apiClient.get(`/gallery${categoryParam}`);
                if (response.data.success) {
                    setMedia(response.data.data.items || []);
                }
            } catch (error) {
                console.error('Failed to fetch gallery:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMedia();
    }, [activeCategory]);

    if (loading) return (
        <div className="h-screen bg-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-dark pt-32 lg:pt-48 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                <div ref={headerRef} className={`text-center mb-24 relative reveal-hidden ${headerVisible ? 'reveal-visible' : ''}`}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-playfair font-black text-white/[0.03] select-none uppercase tracking-tighter">
                        Gallery
                    </div>
                    <p className="text-gold font-bold tracking-[0.6em] uppercase text-sm mb-6 drop-shadow-lg">Temple Gallery</p>
                    <h1 className="text-6xl md:text-9xl font-playfair font-black text-white text-glow leading-none italic mb-8 uppercase">
                        The <span className="text-primary italic font-playfair">Gallery</span>
                    </h1>
                    <p className="text-white/60 text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                        A collection of photos and videos from our training, ceremonies, and temple events.
                    </p>
                </div>

                {/* Enhanced Filters */}
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-24">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`group relative px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-700 overflow-hidden border ${activeCategory === cat
                                ? 'text-white border-primary/40 shadow-luxury'
                                : 'text-white/40 border-white/5 hover:text-white'
                                }`}
                        >
                            <span className="relative z-10">{cat}</span>
                            <div className={`absolute inset-0 bg-primary/20 transition-transform duration-700 ease-out translate-y-full group-hover:translate-y-[85%] ${activeCategory === cat ? 'translate-y-0 bg-primary/40' : ''}`} />
                            {activeCategory === cat && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary animate-in fade-in slide-in-from-left duration-700" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 reveal-hidden ${gridVisible ? 'reveal-visible' : ''}`}>
                    {media.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/40 transition-all duration-1000 shadow-luxury aspect-video bg-black/60"
                        >
                            {item.mediaType === 'VIDEO' ? (
                                <video
                                    src={getMediaPath(item.mediaUrl)}
                                    className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                                    preload="metadata"
                                    muted
                                />
                            ) : (
                                <img
                                    src={getMediaPath(item.mediaUrl)}
                                    alt={item.title}
                                    className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-105"
                                />
                            )}

                            {/* Cinematic Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-dark/95 via-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 flex flex-col justify-end p-10 transform translate-y-4 group-hover:translate-y-0">
                                <div className="flex items-center space-x-4 text-gold/80 mb-4">
                                    <div className="w-8 h-8 rounded-full glass-gold flex items-center justify-center">
                                        {item.mediaType === 'VIDEO' ? <Video size={14} /> : <ImageIcon size={14} />}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">{item.category}</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-playfair font-black text-white italic leading-tight mb-2 drop-shadow-2xl">
                                    {item.title}
                                </h3>
                                <p className="text-white/60 text-xs font-medium uppercase tracking-widest line-clamp-1">
                                    {item.description || "View details"}
                                </p>
                            </div>

                            {/* Video Play Indicator */}
                            {item.mediaType === 'VIDEO' && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full glass-gold flex items-center justify-center text-white scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-700 shadow-[0_0_50px_rgba(201,162,77,0.4)]">
                                    <Video size={28} className="fill-white" />
                                </div>
                            )}

                            {/* Decorative Corner */}
                            <div className="absolute top-6 right-6 w-10 h-10 border-t-2 border-r-2 border-gold/0 group-hover:border-gold/40 transition-all duration-1000 rounded-tr-xl" />
                        </div>
                    ))}
                </div>

                {/* No Data State */}
                {media.length === 0 && (
                    <div className="py-40 text-center">
                        <div className="w-24 h-24 mx-auto bg-white/[0.03] rounded-full flex items-center justify-center text-white/10 mb-8 border border-white/5">
                            <Filter size={40} strokeWidth={1} />
                        </div>
                        <h2 className="text-3xl font-playfair font-black text-white italic mb-4">Gallery is Empty</h2>
                        <p className="text-white/30 uppercase tracking-[0.4em] text-[10px]">No echoes found in this category.</p>
                    </div>
                )}
            </div>

            {/* Lightbox / Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-20">
                    <div
                        className="absolute inset-0 bg-dark/98 backdrop-blur-3xl animate-in fade-in duration-700"
                        onClick={() => setSelectedItem(null)}
                    />

                    <div className="relative max-w-7xl w-full max-h-full overflow-hidden rounded-[3.5rem] border border-white/10 shadow-[0_0_150px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-700 bg-black flex flex-col lg:flex-row">
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-10 right-10 z-[110] w-14 h-14 rounded-full glass-gold flex items-center justify-center text-white hover:bg-primary transition-all hover:rotate-90 duration-700 shadow-2xl active:scale-95"
                        >
                            <X size={28} />
                        </button>

                        <div className="lg:w-3/4 bg-black flex items-center justify-center overflow-hidden h-[50vh] lg:h-auto border-b lg:border-b-0 lg:border-r border-white/5">
                            {selectedItem.mediaType === 'VIDEO' ? (
                                <video
                                    src={getMediaPath(selectedItem.mediaUrl)}
                                    controls
                                    className="w-full h-full object-contain"
                                    autoPlay
                                />
                            ) : (
                                <img
                                    src={getMediaPath(selectedItem.mediaUrl)}
                                    alt={selectedItem.title}
                                    className="w-full h-full object-contain"
                                />
                            )}
                        </div>

                        <div className="lg:w-1/4 p-12 lg:p-16 flex flex-col justify-center bg-dark/40 relative overflow-hidden">
                            {/* Decorative Background Icon */}
                            <div className="absolute -top-10 -right-10 opacity-[0.03] rotate-12">
                                <ImageIcon size={300} strokeWidth={1} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex items-center space-x-5 mb-12">
                                    <div className="w-14 h-14 rounded-2xl glass-gold flex items-center justify-center text-gold shadow-luxury">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-white/30 font-bold uppercase tracking-[0.3em] text-[10px] mb-1">Date Captured</p>
                                        <p className="text-white font-black tracking-wide text-lg">
                                            {new Date(selectedItem.eventDate || selectedItem.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <h3 className="text-4xl lg:text-6xl font-playfair font-black text-white mb-10 italic leading-[1.1] text-glow">
                                    {selectedItem.title}
                                </h3>

                                <div className="relative mb-12">
                                    <div className="absolute -left-6 top-0 w-1 h-full bg-primary/40 rounded-full" />
                                    <p className="text-white/50 text-xl leading-relaxed font-medium italic">
                                        {selectedItem.description || "A moment captured within the temple, preserving our legacy for the future generations of practitioners."}
                                    </p>
                                </div>

                                <div className="pt-10 border-t border-white/10 flex flex-wrap gap-4">
                                    <span className="px-6 py-3 bg-primary/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-primary border border-primary/20 shadow-luxury">
                                        {selectedItem.category}
                                    </span>
                                    <div className="flex-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
