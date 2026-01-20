import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, updateUser } from '../../store/slices/userSlice';
import { Button, Input } from '../../components/Shared';
import { Save, X, User as UserIcon, Mail, Shield, CheckCircle2, Lock, Type, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const UserForm = ({ user, onClose }) => {
    const dispatch = useDispatch();
    const { submitting } = useSelector((state) => state.users);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Editor',
        password: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'Editor',
                password: '', // Password is not returned from API for security
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let resultAction;
        if (user) {
            // For updates, password can be empty to keep unchanged
            const updateData = { ...formData };
            if (!updateData.password) delete updateData.password;
            resultAction = await dispatch(updateUser({ id: user.id, formData: updateData }));
        } else {
            resultAction = await dispatch(createUser(formData));
        }

        if (createUser.fulfilled.match(resultAction) || updateUser.fulfilled.match(resultAction)) {
            toast.success(user ? 'Member permissions refined' : 'New member annexed to covenant');
            onClose();
        } else {
            toast.error(resultAction.payload || 'Failed to annex member to covenant.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Input
                        label="Full Name / Moniker"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Brother Zhang"
                        icon={Type}
                        required
                    />

                    <Input
                        label="Digital Address (Email)"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="zhang@kst.rw"
                        icon={Mail}
                        required
                    />
                </div>

                <div className="space-y-6">
                    <div className="relative group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                            Covenant Role
                        </label>
                        <div className="relative">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-10 text-xs font-black uppercase tracking-widest text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none shadow-sm"
                            >
                                <option value="Super Admin">Super Admin (Universal Access)</option>
                                <option value="Admin">Admin (Temple Keeper)</option>
                                <option value="Content Manager">Content Manager (Scroll Keeper)</option>
                                <option value="Blogger">Blogger (Chronicle Maker)</option>
                                <option value="Editor">Editor (Manuscript Polisher)</option>
                            </select>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Shield size={16} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Input
                            label={user ? "Secure Key (Optional Update)" : "Secure Key (Password)"}
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min. 8 characters"
                            icon={Lock}
                            required={!user}
                        />
                        {user && (
                            <p className="text-[10px] text-gray-400 font-medium italic ml-1">Leave empty to preserve existing secure key.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-100 p-6 rounded-3xl">
                <div className="flex items-start space-x-4">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-amber-900 uppercase tracking-widest">Access Warning</p>
                        <p className="text-[10px] text-amber-700 leading-relaxed mt-1 font-medium">
                            Granting high-level roles (Super Admin/Admin) provides access to sensitive temple records and audit logs. Verify the identity before annexation.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-50 bg-gray-50/10 -mx-6 -mb-6 p-6 rounded-b-[2.5rem]">
                <Button
                    type="submit"
                    loading={submitting}
                    icon={user ? CheckCircle2 : Save}
                    className="shadow-2xl shadow-primary/20 w-full sm:w-auto"
                >
                    {user ? 'Seal Refined Covenant' : 'Seal New Covenant'}
                </Button>
            </div>
        </form>
    );
};

export default UserForm;
