import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGallery, deleteMedia } from '../../store/slices/gallerySlice';
import { Button, Modal } from '../../components/Shared';
import { Plus, Edit, Trash2, Eye, Filter, Search, Image as ImageIcon, Video, Calendar, Tag, MoreVertical } from 'lucide-react';
import { toast } from 'react-toastify';
import { getMediaPath } from '../../api/apiClient';
import GalleryForm from './GalleryForm';

const GalleryPage = () => {
    const dispatch = useDispatch();
    const { items, pagination, loading } = useSelector((state) => state.gallery);
    const { user } = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMedia, setCurrentMedia] = useState(null);
    const [mediaType, setMediaType] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        dispatch(fetchGallery({ page: 1, mediaType, category }));
    }, [dispatch, mediaType, category]);

    const handlePageChange = (page) => {
        dispatch(fetchGallery({ page, mediaType, category }));
    };

    const handleUpload = () => {
        setCurrentMedia(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item) => {
        setCurrentMedia(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Erase this visual memory from the archives?')) {
            const resultAction = await dispatch(deleteMedia(id));
            if (deleteMedia.fulfilled.match(resultAction)) {
                toast.success('Visual memory erased');
            } else {
                toast.error(resultAction.payload || 'Failed to erase memory');
            }
        }
    };

    const showActions = ['Super Admin', 'Admin', 'Content Manager'].includes(user.role);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 lowercase tracking-tight">
                        <span className="bg-primary/10 text-primary p-2.5 rounded-2xl shadow-inner border border-primary/10"><ImageIcon size={28} /></span>
                        Sacred Mirror (Gallery)
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Chronicle the visual path of the Kigali Shaolin Temple.</p>
                </div>
                {showActions && (
                    <Button
                        onClick={handleUpload}
                        icon={Plus}
                        className="shadow-xl shadow-primary/20 hover:shadow-primary/30"
                    >
                        Annex Visual Memory
                    </Button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <button
                        onClick={() => setMediaType('')}
                        className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${mediaType === '' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                        All Essence
                    </button>
                    <button
                        onClick={() => setMediaType('IMAGE')}
                        className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${mediaType === 'IMAGE' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                        Stills (Images)
                    </button>
                    <button
                        onClick={() => setMediaType('VIDEO')}
                        className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${mediaType === 'VIDEO' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                        Flows (Videos)
                    </button>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-none">
                        <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                            className="appearance-none w-full lg:w-48 bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-10 text-xs font-bold uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">All Scopes</option>
                            <option value="Training">Training</option>
                            <option value="Exhibition">Exhibition</option>
                            <option value="Community">Community</option>
                        </select>
                    </div>
                    <button className="p-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-400 hover:text-primary transition-all">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-[2.5rem] animate-pulse"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {items.map((item) => (
                        <div key={item.id} className="group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-700 hover:-translate-y-2">
                            <div className="aspect-square relative overflow-hidden">
                                {item.mediaType === 'VIDEO' ? (
                                    <div className="w-full h-full bg-gray-900 relative">
                                        <video
                                            src={getMediaPath(item.mediaUrl)}
                                            className="w-full h-full object-cover"
                                            muted
                                            playsInline
                                            onMouseOver={(e) => e.target.play()}
                                            onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none" />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform pointer-events-none">
                                            <Video size={20} className="text-white fill-white" />
                                        </div>
                                    </div>
                                ) : (
                                    <img
                                        src={getMediaPath(item.mediaUrl)}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h4 className="text-white font-black text-sm lowercase tracking-tight mb-1">{item.title}</h4>
                                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest flex items-center">
                                            <Tag size={10} className="mr-1.5" /> {item.category || 'General'}
                                        </p>
                                    </div>

                                    {showActions && (
                                        <div className="absolute top-6 right-6 flex flex-col gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-primary transition-all active:scale-95"
                                                title="View / Edit Memory"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-red-500 transition-all active:scale-95"
                                                title="Erase Memory"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 bg-white flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar size={12} className="text-gray-300" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        {item.eventDate ? new Date(item.eventDate).toLocaleDateString() : 'Sacred Time'}
                                    </span>
                                </div>
                                <div className={`p-1.5 rounded-lg border ${item.mediaType === 'VIDEO' ? 'bg-blue-50 border-blue-100 text-blue-500' : 'bg-emerald-50 border-emerald-100 text-emerald-500'}`}>
                                    {item.mediaType === 'VIDEO' ? <Video size={12} /> : <ImageIcon size={12} />}
                                </div>
                            </div>
                        </div>
                    ))}

                    {items.length === 0 && (
                        <div className="col-span-full py-32 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center animate-in fade-in duration-1000">
                            <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 mb-8 text-gray-200">
                                <ImageIcon size={64} />
                            </div>
                            <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">Mirror reflecting void</p>
                            <p className="text-gray-400 text-[10px] mt-4 font-medium italic">Seek visuals to fill the sacred void.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination component can be added here if needed */}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentMedia ? 'Refine Memory' : 'Annex Memory'}
                size="lg"
            >
                <GalleryForm
                    item={currentMedia}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default GalleryPage;
