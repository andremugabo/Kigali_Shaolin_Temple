import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/slices/authSlice';
import { Button, Input } from '../../components/Shared';
import { User, Mail, Lock, Camera, Save, CheckCircle2, Shield, Activity, Calendar, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
            });
            setImagePreview(user.image);
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        data.append('name', formData.name);
        data.append('email', formData.email);
        if (formData.password) {
            data.append('password', formData.password);
        }
        if (imageFile) {
            data.append('image', imageFile);
        }

        const resultAction = await dispatch(updateProfile(data));
        if (updateProfile.fulfilled.match(resultAction)) {
            toast.success('Your identity in the covenant has been refined.');
            setFormData(prev => ({ ...prev, password: '' }));
        } else {
            toast.error(resultAction.payload || 'Failed to refine identity.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 lowercase tracking-tight">
                        <span className="bg-rose-50 text-rose-600 p-2.5 rounded-2xl shadow-inner border border-rose-100"><User size={28} /></span>
                        Your Covenant Identity
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Refine your presence within the temple's digital chronicles.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl ring-1 ring-gray-100 group-hover:scale-105 transition-transform duration-500">
                                <img
                                    src={imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name)}&background=random`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="text-white" size={32} />
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-xl shadow-primary/30 border-2 border-white">
                                <Shield size={20} />
                            </div>
                        </div>

                        <div className="mt-8 space-y-1">
                            <h2 className="text-2xl font-black text-gray-900 lowercase tracking-tight">{user?.name}</h2>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{user?.role}</p>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-50">
                            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Joined On</p>
                                <p className="text-xs font-bold text-gray-700">
                                    {new Date(user?.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                <div className="flex items-center justify-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <p className="text-xs font-bold text-gray-700">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-900 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full filter blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-3">
                            <ShieldCheck size={18} className="text-primary" />
                            Role Permissions
                        </h3>
                        <ul className="space-y-4">
                            {['Manage Content', 'Access Dashboard', 'View Stats'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/70 text-xs font-medium italic">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_rgba(123,30,30,0.8)]"></div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Form Section */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm space-y-8">
                        <h3 className="text-sm font-black text-gray-900 lowercase tracking-tight flex items-center gap-3">
                            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Activity size={18} /></span>
                            Refine Your Manifest
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Input
                                label="Full Name / Moniker"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                icon={User}
                                placeholder="Your Name"
                                required
                            />
                            <Input
                                label="Digital Address (Email)"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                icon={Mail}
                                placeholder="admin@kst.rw"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                label="Secure Key (Optional Update)"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                icon={Lock}
                                placeholder="New Secure Key"
                            />
                            <p className="text-[10px] text-gray-400 font-medium italic ml-1">Leave empty to preserve your current secure key.</p>
                        </div>

                        <div className="pt-6 border-t border-gray-50 flex justify-end">
                            <Button
                                type="submit"
                                loading={loading}
                                icon={CheckCircle2}
                                className="shadow-2xl shadow-primary/20 h-14 px-12 rounded-2xl w-full sm:w-auto"
                            >
                                Seal Refinements
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
