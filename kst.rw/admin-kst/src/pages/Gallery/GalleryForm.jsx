import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadMedia, updateMedia } from '../../store/slices/gallerySlice';
import { Button, Input } from '../../components/Shared';
import { Save, X, Image as ImageIcon, Video, Type, FileText, Calendar, Tag, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const GalleryForm = ({ item, onClose }) => {
    const dispatch = useDispatch();
    const { submitting } = useSelector((state) => state.gallery);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Training',
        mediaType: 'IMAGE',
        eventDate: new Date().toISOString().split('T')[0],
    });
    const [mediaFile, setMediaFile] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (item) {
            setFormData({
                title: item.title || '',
                description: item.description || '',
                category: item.category || 'Training',
                mediaType: item.mediaType || 'IMAGE',
                eventDate: item.eventDate ? new Date(item.eventDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            });
            setPreview(item.mediaUrl);
        }
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaFile(file);
            // Update mediaType based on file type
            if (file.type.startsWith('video/')) {
                setFormData(prev => ({ ...prev, mediaType: 'VIDEO' }));
            } else {
                setFormData(prev => ({ ...prev, mediaType: 'IMAGE' }));
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            if (file.type.startsWith('image/')) {
                reader.readAsDataURL(file);
            } else {
                setPreview(null); // No preview for videos for now
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!item && !mediaFile) {
            toast.error('A visual memory is required for annexation.');
            return;
        }

        let resultAction;
        if (item) {
            // Only metadata updates supported here for simplicity in this turn
            resultAction = await dispatch(updateMedia({ id: item.id, metadata: formData }));
        } else {
            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });
            data.append('file', mediaFile);
            resultAction = await dispatch(uploadMedia(data));
        }

        if (uploadMedia.fulfilled.match(resultAction) || updateMedia.fulfilled.match(resultAction)) {
            toast.success(item ? 'Visual memory refined' : 'Visual memory annexed');
            onClose();
        } else {
            toast.error(resultAction.payload || 'Failed to annex visual memory.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Input
                        label="Memory Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Morning Training at Kigali Dojo"
                        icon={Type}
                        required
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none shadow-sm"
                            >
                                <option value="Training">Training</option>
                                <option value="Exhibition">Exhibition</option>
                                <option value="Community">Community</option>
                                <option value="Ceremony">Ceremony</option>
                            </select>
                            <div className="absolute right-4 bottom-3 text-gray-400 pointer-events-none">
                                <Tag size={14} />
                            </div>
                        </div>

                        <Input
                            label="Event Date"
                            name="eventDate"
                            type="date"
                            value={formData.eventDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Chronicle Description</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-4 text-gray-300 group-focus-within:text-primary transition-colors">
                                <FileText size={20} />
                            </div>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="4"
                                className="w-full bg-white border border-gray-200 rounded-[2rem] py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium min-h-[120px] shadow-inner"
                                placeholder="Elaborate on this visual chronicle..."
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Visual Essence</label>
                    {!item && (
                        <div
                            className={`relative group border-2 border-dashed rounded-[2.5rem] h-full min-h-[250px] flex flex-col items-center justify-center transition-all ${preview || mediaFile ? 'border-primary/50 bg-primary/5' : 'border-gray-200 hover:border-gray-400 bg-gray-50/50'
                                }`}
                        >
                            {preview ? (
                                <div className="w-full h-full p-4">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-[2rem] shadow-xl border border-white/20" />
                                    <button
                                        type="button"
                                        onClick={() => { setMediaFile(null); setPreview(null); }}
                                        className="absolute top-8 right-8 p-2.5 bg-red-500 text-white rounded-xl shadow-2xl hover:bg-red-600 transition-all"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : mediaFile ? (
                                <div className="text-center p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm transition-transform hover:scale-105">
                                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Video size={32} />
                                    </div>
                                    <p className="text-sm font-black text-gray-800 lowercase tracking-tight truncate max-w-[200px]">{mediaFile.name}</p>
                                    <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-widest">Video Ready</p>
                                    <button
                                        type="button"
                                        onClick={() => { setMediaFile(null); setPreview(null); }}
                                        className="mt-4 p-2 bg-gray-100 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all font-bold uppercase text-[9px] tracking-[0.2em]"
                                    >
                                        Reset Visual
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        <ImageIcon size={40} className="text-gray-300" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-500">Drop visual essence or <span className="text-primary">select</span></p>
                                    <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-tighter">Images (JPG/PNG) or Videos (MP4)</p>
                                </>
                            )}
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*,video/*"
                            />
                        </div>
                    )}
                    {item && item.mediaUrl && (
                        <div className="h-full min-h-[250px] relative rounded-[2.5rem] overflow-hidden border border-gray-100 group">
                            {item.mediaType === 'VIDEO' ? (
                                <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                                    <video
                                        src={item.mediaUrl}
                                        className="w-full h-full object-contain"
                                        controls
                                    />
                                </div>
                            ) : (
                                <img src={item.mediaUrl} alt="" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Locked Architecture</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-50 bg-gray-50/10 -mx-6 -mb-6 p-6 rounded-b-[2.5rem]">
                <Button
                    type="submit"
                    loading={submitting}
                    icon={item ? CheckCircle2 : Save}
                    className="shadow-2xl shadow-primary/20 w-full sm:w-auto"
                >
                    {item ? 'Finalize Refinement' : 'Finalize Annexation'}
                </Button>
            </div>
        </form>
    );
};

export default GalleryForm;
