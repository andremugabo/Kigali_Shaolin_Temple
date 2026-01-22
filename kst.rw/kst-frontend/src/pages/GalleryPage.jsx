import React, { useState, useEffect } from 'react';
import apiClient, { getMediaPath } from '../api/apiClient';
import { Image as ImageIcon, Video, Calendar, Filter, X } from 'lucide-react';

const GalleryPage = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [selectedItem, setSelectedItem] = useState(null);

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
                <div className="text-center mb-24 relative">
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

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-20">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${activeCategory === cat
                                ? 'bg-gold text-dark border-gold shadow-[0_0_20px_rgba(201,162,77,0.4)]'
                                : 'bg-white/5 text-white/40 border-white/10 hover:border-gold/30 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Gallery Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                    {media.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="relative group cursor-pointer overflow-hidden rounded-[2rem] border border-white/5 hover:border-gold/30 transition-all duration-700 break-inside-avoid shadow-luxury"
                        >
                            <img
                                src={getMediaPath(item.mediaUrl)}
                                alt={item.title}
                                className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                <div className="flex items-center space-x-3 text-gold/80 mb-3">
                                    {item.mediaType === 'VIDEO' ? <Video size={18} /> : <ImageIcon size={18} />}
                                    <span className="text-[10px] font-black uppercase tracking-widest">{item.category}</span>
                                </div>
                                <h3 className="text-xl font-playfair font-black text-white italic truncate">{item.title}</h3>
                            </div>

                            {item.mediaType === 'VIDEO' && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full glass-gold flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                                    <Video size={24} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* No Data State */}
                {media.length === 0 && (
                    <div className="py-40 text-center">
                        <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center text-white/20 mb-8">
                            <Filter size={32} />
                        </div>
                        <h2 className="text-2xl font-playfair font-black text-white italic mb-4">Gallery is Empty</h2>
                        <p className="text-white/40 uppercase tracking-widest text-xs">No media found in this category.</p>
                    </div>
                )}
            </div>

            {/* Lightbox / Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-20">
                    <div
                        className="absolute inset-0 bg-dark/95 backdrop-blur-3xl"
                        onClick={() => setSelectedItem(null)}
                    />

                    <div className="relative max-w-6xl w-full max-h-full overflow-hidden rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-500 bg-black">
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-8 right-8 z-10 w-12 h-12 rounded-full glass-gold flex items-center justify-center text-white hover:bg-primary transition-colors hover:rotate-90 duration-500"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex flex-col lg:flex-row h-full">
                            <div className="lg:w-2/3 bg-black flex items-center justify-center overflow-hidden">
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

                            <div className="lg:w-1/3 p-12 lg:p-16 flex flex-col justify-center border-l border-white/5">
                                <div className="flex items-center space-x-4 mb-8">
                                    <div className="w-12 h-12 rounded-2xl glass-gold flex items-center justify-center text-gold">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-white/30 font-bold uppercase tracking-[0.2em] text-[10px] mb-1">Date Captured</p>
                                        <p className="text-white font-black tracking-wide">
                                            {new Date(selectedItem.eventDate || selectedItem.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>

                                <h3 className="text-4xl lg:text-5xl font-playfair font-black text-white mb-8 italic leading-tight">
                                    {selectedItem.title}
                                </h3>
                                <p className="text-white/50 text-lg leading-relaxed mb-12">
                                    {selectedItem.description || "A moment captured within the temple, preserving our legacy for the future."}
                                </p>

                                <div className="pt-8 border-t border-white/5">
                                    <span className="px-4 py-2 bg-primary/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20">
                                        {selectedItem.category}
                                    </span>
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
