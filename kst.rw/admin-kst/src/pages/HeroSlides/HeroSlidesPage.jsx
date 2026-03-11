import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHeroSlides, deleteHeroSlide } from '../../store/slices/heroSlideSlice';
import { Button, Modal } from '../../components/Shared';
import { Plus, Edit, Trash2, Layout, Image as ImageIcon, ExternalLink, MoveUpRight, Info } from 'lucide-react';
import { toast } from 'react-toastify';
import { getMediaPath } from '../../api/apiClient';
import HeroSlideForm from './HeroSlideForm';

const HeroSlidesPage = () => {
    const dispatch = useDispatch();
    const { slides, loading } = useSelector((state) => state.heroSlides);
    const { user } = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(null);

    useEffect(() => {
        dispatch(fetchHeroSlides());
    }, [dispatch]);

    const handleCreate = () => {
        setCurrentSlide(null);
        setIsModalOpen(true);
    };

    const handleEdit = (slide) => {
        setCurrentSlide(slide);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Dismiss this grand visual from the temple entrance?')) {
            const resultAction = await dispatch(deleteHeroSlide(id));
            if (deleteHeroSlide.fulfilled.match(resultAction)) {
                toast.success('Slide dismissed');
            } else {
                toast.error(resultAction.payload || 'Failed to dismiss slide');
            }
        }
    };

    const showActions = ['Super Admin', 'Admin'].includes(user.role);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 lowercase tracking-tight">
                        <span className="bg-indigo-50 text-indigo-600 p-2.5 rounded-2xl shadow-inner border border-indigo-100"><Layout size={28} /></span>
                        Entrance Spectacle (Hero)
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Command the first impression of the digital temple.</p>
                </div>
                {showActions && (
                    <Button
                        onClick={handleCreate}
                        icon={Plus}
                        className="shadow-xl shadow-primary/20 hover:shadow-primary/30"
                    >
                        Inaugurate Slide
                    </Button>
                )}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                <div className="grid grid-cols-1 gap-12">
                    {loading ? (
                        <div className="space-y-8">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="aspect-[21/9] bg-gray-100 rounded-[2.5rem] animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        slides.map((slide, index) => (
                            <div key={slide.id} className="group relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 bg-gray-900 text-white rounded-xl flex items-center justify-center text-xs font-black italic">0{index + 1}</span>
                                        <h3 className="text-sm font-black text-gray-900 lowercase tracking-tight">{slide.title}</h3>
                                    </div>
                                    {showActions && (
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(slide)}
                                                className="p-2.5 text-gray-400 hover:text-indigo-600 transition-all hover:bg-indigo-50 rounded-xl"
                                            ><Edit size={18} /></button>
                                            <button
                                                onClick={() => handleDelete(slide.id)}
                                                className="p-2.5 text-gray-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl"
                                            ><Trash2 size={18} /></button>
                                        </div>
                                    )}
                                </div>

                                <div className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100">
                                    <img src={getMediaPath(slide.image)} alt={slide.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-12 lg:p-24">
                                        <div className="max-w-xl space-y-4">
                                            <span className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-[0.3em] border border-white/20">Active Spectacle</span>
                                            <h2 className="text-3xl lg:text-5xl font-black text-white lowercase tracking-tighter leading-tight">{slide.title}</h2>
                                            <p className="text-white/80 text-sm lg:text-base font-medium italic line-clamp-2">{slide.subtitle}</p>
                                            {slide.button_text && (
                                                <div className="inline-flex items-center gap-3 px-6 py-3 bg-white text-gray-900 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
                                                    {slide.button_text} <MoveUpRight size={14} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {slides.length === 0 && !loading && (
                        <div className="py-24 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
                            <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 mb-8 text-gray-200">
                                <ImageIcon size={64} />
                            </div>
                            <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">The entrance is vacant</p>
                            <p className="text-gray-400 text-[10px] mt-4 font-medium italic">Create a slide to welcome the world.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-100 p-8 rounded-[2.5rem]">
                <div className="flex items-start space-x-6">
                    <div className="p-4 bg-indigo-100 text-indigo-600 rounded-[1.5rem] shadow-sm">
                        <Info size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-1">Entrance Wisdom</p>
                        <p className="text-xs text-indigo-700 leading-relaxed font-medium">
                            The entrance (hero slider) defines the soul of the temple for digital pilgrims. Use high-resolution vertical-aligned images (Recommended: 1920x800) and concise, powerful messages.
                        </p>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentSlide ? 'Refine Spectacle' : 'Inaugurate Spectacle'}
                size="lg"
            >
                <HeroSlideForm
                    slide={currentSlide}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default HeroSlidesPage;
