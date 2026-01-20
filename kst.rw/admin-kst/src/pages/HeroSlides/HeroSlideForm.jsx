import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createHeroSlide, updateHeroSlide } from '../../store/slices/heroSlideSlice';
import { Button, Input } from '../../components/Shared';
import { Save, X, Image as ImageIcon, Type, Link, CheckCircle2, Layout, FileText } from 'lucide-react';
import { toast } from 'react-toastify';

const HeroSlideForm = ({ slide, onClose }) => {
    const dispatch = useDispatch();
    const { submitting } = useSelector((state) => state.heroSlides);

    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        button_text: '',
        button_link: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (slide) {
            setFormData({
                title: slide.title || '',
                subtitle: slide.subtitle || '',
                button_text: slide.button_text || '',
                button_link: slide.button_link || '',
            });
            setImagePreview(slide.image);
        }
    }, [slide]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        if (imageFile) {
            data.append('image', imageFile);
        }

        let resultAction;
        if (slide) {
            resultAction = await dispatch(updateHeroSlide({ id: slide.id, formData: data }));
        } else {
            resultAction = await dispatch(createHeroSlide(data));
        }

        if (createHeroSlide.fulfilled.match(resultAction) || updateHeroSlide.fulfilled.match(resultAction)) {
            toast.success(slide ? 'Spectacle refined successfully' : 'Entrance spectacle inaugurated');
            onClose();
        } else {
            toast.error(resultAction.payload || 'Failed to seal the spectacle.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Input
                        label="Spectacle Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., The Path of the Warrior"
                        icon={Type}
                        required
                    />

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                            Spectacle Subtitle / Lore
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-4 text-gray-300 group-focus-within:text-primary transition-colors">
                                <FileText size={20} />
                            </div>
                            <textarea
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleChange}
                                rows="3"
                                className="w-full bg-white border border-gray-200 rounded-[2rem] py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium shadow-inner"
                                placeholder="Elaborate on the vision..."
                                required
                            ></textarea>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Call to Action Text"
                            name="button_text"
                            value={formData.button_text}
                            onChange={handleChange}
                            placeholder="e.g., Join Us"
                            icon={Layout}
                        />
                        <Input
                            label="Destiny Path (Link)"
                            name="button_link"
                            value={formData.button_link}
                            onChange={handleChange}
                            placeholder="e.g., /membership"
                            icon={Link}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Visual Spectacle (Image)
                    </label>
                    <div
                        className={`relative group border-2 border-dashed rounded-[2.5rem] h-full min-h-[300px] flex flex-col items-center justify-center transition-all ${imagePreview ? 'border-primary/50 bg-primary/5' : 'border-gray-200 hover:border-gray-400 bg-gray-50/50'
                            }`}
                    >
                        {imagePreview ? (
                            <div className="w-full h-full p-4 relative">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-[2rem] shadow-xl border border-white/20" />
                                <button
                                    type="button"
                                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                                    className="absolute top-8 right-8 p-2.5 bg-red-500 text-white rounded-xl shadow-2xl hover:bg-red-600 transition-all active:scale-95 z-10"
                                >
                                    <X size={16} />
                                </button>
                                <div className="absolute inset-4 rounded-[2rem] bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white text-[10px] font-black uppercase tracking-[0.3em]">Replace Image</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100 mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                    <ImageIcon size={40} className="text-gray-300" />
                                </div>
                                <p className="text-sm font-bold text-gray-500">Drop high-res visual or <span className="text-primary">select</span></p>
                                <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-tighter text-center px-8 italic">Optimal size: 1920x1080 for temple entrance</p>
                            </>
                        )}
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-50 bg-gray-50/10 -mx-6 -mb-6 p-6 rounded-b-[2.5rem]">
                <Button
                    type="submit"
                    loading={submitting}
                    icon={slide ? CheckCircle2 : Save}
                    className="shadow-2xl shadow-primary/20 w-full sm:w-auto"
                >
                    {slide ? 'Solidify Spectacle' : 'Manifest Spectacle'}
                </Button>
            </div>
        </form>
    );
};

export default HeroSlideForm;
