import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createClub, updateClub } from '../../store/slices/clubSlice';
import { Button, Input } from '../../components/Shared';
import { Save, X, Image as ImageIcon, Type, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ClubForm = ({ club, onClose }) => {
    const dispatch = useDispatch();
    const { submitting } = useSelector((state) => state.clubs);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (club) {
            setFormData({
                name: club.name || '',
                description: club.description || '',
                location: club.location || '',
            });
            if (club.image) {
                setImagePreview(club.image);
            }
        }
    }, [club]);

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
        if (club) {
            resultAction = await dispatch(updateClub({ id: club.id, formData: data }));
        } else {
            resultAction = await dispatch(createClub(data));
        }

        if (createClub.fulfilled.match(resultAction) || updateClub.fulfilled.match(resultAction)) {
            toast.success(club ? 'Branch refined successfully' : 'New branch established');
            onClose();
        } else {
            toast.error(resultAction.payload || 'The manifestation failed. Try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Input
                        label="Branch Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Kigali Central Dojo"
                        icon={Type}
                        required
                    />

                    <Input
                        label="Geographic Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., KN 3 Rd, Kigali"
                        icon={MapPin}
                        required
                    />

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                            Mission Description
                        </label>
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
                                placeholder="Describe the specialized training at this branch..."
                                required
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Structural Essence (Image)
                    </label>
                    <div
                        className={`relative group border-2 border-dashed rounded-[2.5rem] h-full min-h-[250px] flex flex-col items-center justify-center transition-all ${imagePreview ? 'border-primary/50 bg-primary/5' : 'border-gray-200 hover:border-gray-400 bg-gray-50/50'
                            }`}
                    >
                        {imagePreview ? (
                            <div className="w-full h-full p-4">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-[2rem] shadow-xl border border-white/20" />
                                <button
                                    type="button"
                                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                                    className="absolute top-8 right-8 p-2.5 bg-red-500 text-white rounded-xl shadow-2xl hover:bg-red-600 transition-all active:scale-95"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                    <ImageIcon size={40} className="text-gray-300" />
                                </div>
                                <p className="text-sm font-bold text-gray-500">Drop branch visual or <span className="text-primary">select</span></p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Recommended aspect ratio 1:1 or 4:3</p>
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
                    icon={club ? CheckCircle2 : Save}
                    className="shadow-2xl shadow-primary/20 w-full sm:w-auto"
                >
                    {club ? 'Update Essence' : 'Manifest Branch'}
                </Button>
            </div>
        </form>
    );
};

export default ClubForm;
