import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAbout, updateAbout, createAbout } from '../../store/slices/aboutSlice';
import { Button, Input } from '../../components/Shared';
import { Info, User, FileText, Save, Image as ImageIcon, X, CheckCircle2, History } from 'lucide-react';
import { toast } from 'react-toastify';

const AboutManagement = () => {
    const dispatch = useDispatch();
    const { about, loading, submitting } = useSelector((state) => state.about);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        content: '',
        founder_name: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        dispatch(fetchAbout());
    }, [dispatch]);

    useEffect(() => {
        if (about) {
            setFormData({
                content: about.content || '',
                founder_name: about.founder_name || '',
            });
            setImagePreview(about.image);
        }
    }, [about]);

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
        if (about) {
            resultAction = await dispatch(updateAbout({ id: about.id, formData: data }));
        } else {
            resultAction = await dispatch(createAbout(data));
        }

        if (updateAbout.fulfilled.match(resultAction) || createAbout.fulfilled.match(resultAction)) {
            toast.success('Temple history solidified');
            setIsEditing(false);
        } else {
            toast.error(resultAction.payload || 'Failed to preserve history.');
        }
    };

    const showActions = ['Super Admin', 'Admin', 'Content Manager'].includes(user.role);

    if (loading && !about) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 lowercase tracking-tight">
                        <span className="bg-amber-50 text-amber-600 p-2.5 rounded-2xl shadow-inner border border-amber-100"><History size={28} /></span>
                        Sacred Chronicles (About)
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Chronicle the origin and soul of the Kigali Shaolin Temple.</p>
                </div>
                {showActions && !isEditing && (
                    <Button
                        onClick={() => setIsEditing(true)}
                        icon={FileText}
                        className="shadow-xl shadow-primary/20 hover:shadow-primary/30"
                    >
                        Refine Chronicles
                    </Button>
                )}
            </div>

            {!isEditing ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-2">
                                <Info size={14} /> The Sacred Origin
                            </h2>
                            <div className="text-gray-600 leading-relaxed font-medium text-lg italic whitespace-pre-wrap">
                                {about?.content || 'No chronicles have been recorded yet.'}
                            </div>
                        </div>

                        <div className="flex items-center gap-4 pt-6 mt-12 border-t border-gray-50">
                            <div className="h-16 w-16 rounded-2xl bg-gray-100 border-2 border-white shadow-lg overflow-hidden shrink-0">
                                <img src={about?.image || 'https://via.placeholder.com/150'} alt="Founder" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900 lowercase tracking-tight">{about?.founder_name || 'The Founder'}</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Master & Founder</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-1000 border-8 border-white group">
                            <img src={about?.image || 'https://via.placeholder.com/600x800'} alt="Temple Founder" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-[2rem] shadow-2xl shadow-primary/40 -rotate-6">
                            <p className="text-xs font-black uppercase tracking-widest">Est. 1996</p>
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3.5rem] border-2 border-primary/10 shadow-2xl shadow-primary/5 space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black text-gray-900 lowercase tracking-tight flex items-center gap-2">
                            <span className="p-2 bg-primary/10 text-primary rounded-xl"><FileText size={18} /></span>
                            Refining the Chronicles
                        </h3>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">The Chronicle Content</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows="12"
                                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[2.5rem] py-8 px-8 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium leading-relaxed shadow-inner"
                                    placeholder="Record the sacred history of the temple..."
                                    required
                                ></textarea>
                            </div>

                            <Input
                                label="Master / Founder Name"
                                name="founder_name"
                                value={formData.founder_name}
                                onChange={handleChange}
                                icon={User}
                                placeholder="e.g., Master Niyonzima Jean"
                                required
                            />
                        </div>

                        <div className="space-y-6">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2 mb-2">Master Visual (Portrait)</label>
                            <div className={`relative group border-2 border-dashed rounded-[3rem] aspect-square lg:h-full flex flex-col items-center justify-center transition-all ${imagePreview ? 'border-primary/50 bg-primary/5' : 'border-gray-100 hover:border-primary/20 bg-gray-50/30'}`}>
                                {imagePreview ? (
                                    <div className="p-6 h-full w-full relative">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl border border-white" />
                                        <button
                                            type="button"
                                            onClick={() => { setImageFile(null); setImagePreview(null); }}
                                            className="absolute top-10 right-10 p-4 bg-red-500 text-white rounded-2xl shadow-xl hover:bg-red-600 transition-all z-10"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="p-8 bg-white rounded-[2.5rem] shadow-sm mb-6">
                                            <ImageIcon size={48} className="text-gray-200" />
                                        </div>
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Annex Master Portrait</p>
                                    </div>
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

                    <div className="flex justify-end pt-8 border-t border-gray-50">
                        <Button
                            type="submit"
                            loading={submitting}
                            icon={CheckCircle2}
                            className="w-full lg:w-auto shadow-2xl shadow-primary/20 h-14 px-12 rounded-2xl"
                        >
                            Solidify the Chronicles
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AboutManagement;
