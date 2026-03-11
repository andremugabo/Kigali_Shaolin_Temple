import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../../store/slices/userSlice';
import { Button, Table, Modal } from '../../components/Shared';
import { Plus, Edit, Trash2, Shield, User as UserIcon, Mail, ShieldCheck, Search, MoreVertical, Activity } from 'lucide-react';
import { toast } from 'react-toastify';
import { getMediaPath } from '../../api/apiClient';
import UserForm from './UserForm';

const UserListPage = () => {
    const dispatch = useDispatch();
    const { users, pagination, loading } = useSelector((state) => state.users);
    const { user: currentUser } = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetUser, setTargetUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchUsers({ page: 1 }));
    }, [dispatch]);

    const handlePageChange = (page) => {
        dispatch(fetchUsers({ page }));
    };

    const handleCreate = () => {
        setTargetUser(null);
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setTargetUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Excommunicate this member from the digital temple?')) {
            const resultAction = await dispatch(deleteUser(id));
            if (deleteUser.fulfilled.match(resultAction)) {
                toast.success('Member removed from records');
            } else {
                toast.error(resultAction.payload || 'Excommunication failed');
            }
        }
    };

    const headers = ['Member', 'Role', 'Account Status', 'Activity Date'];

    const getRoleBadge = (role) => {
        const styles = {
            'Super Admin': 'bg-rose-100 text-rose-700 border-rose-200 shadow-rose-100',
            'Admin': 'bg-indigo-100 text-indigo-700 border-indigo-200 shadow-indigo-100',
            'Content Manager': 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-emerald-100',
            'Blogger': 'bg-amber-100 text-amber-700 border-amber-200 shadow-amber-100',
            'Editor': 'bg-blue-100 text-blue-700 border-blue-200 shadow-blue-100',
        };

        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm ${styles[role] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                <ShieldCheck size={10} className="mr-1.5" />
                {role}
            </span>
        );
    };

    const renderRow = (user) => {
        const isSelf = user.id === currentUser.id;

        return (
            <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-12 w-12 relative overflow-hidden rounded-2xl border-2 border-white shadow-md ring-1 ring-gray-100">
                            <img
                                className="h-full w-full object-cover"
                                src={getMediaPath(user.image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                alt=""
                            />
                            {isSelf && (
                                <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center">
                                    <span className="text-[8px] font-black text-white uppercase tracking-tighter">You</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="text-sm font-black text-gray-900 flex items-center gap-1.5 lowercase tracking-tight">
                                {user.name}
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 mt-0.5">
                                <Mail size={10} className="opacity-70" />
                                {user.email}
                            </div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-5">
                    {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-5">
                    <div className="flex items-center space-x-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Member</span>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <div className="flex items-center text-xs font-bold text-gray-400 lowercase tracking-tighter">
                        <Activity size={14} className="mr-1.5 opacity-40" />
                        {new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </td>
                <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                        {showActions && !isSelf && (
                            <>
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="p-2.5 text-gray-400 hover:text-indigo-600 transition-all hover:bg-indigo-50 rounded-xl"
                                    title="Modify Permissions"
                                ><Shield size={18} /></button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="p-2.5 text-gray-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl"
                                    title="Excommunicate"
                                ><Trash2 size={18} /></button>
                            </>
                        )}
                        {isSelf && (
                            <button
                                className="p-2.5 text-primary hover:bg-primary/5 rounded-xl transition-all"
                                title="Your Profile Settings"
                            ><MoreVertical size={18} /></button>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    const showActions = ['Super Admin', 'Admin'].includes(currentUser.role);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 lowercase tracking-tight">
                        <span className="bg-rose-50 text-rose-600 p-2.5 rounded-2xl shadow-inner border border-rose-100"><UserIcon size={28} /></span>
                        Covenant Members
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Manage the keepers of the temple's digital chronicles.</p>
                </div>
                {showActions && (
                    <Button
                        onClick={handleCreate}
                        icon={Plus}
                        className="shadow-xl shadow-primary/20 hover:shadow-primary/30"
                    >
                        Annex New Member
                    </Button>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative w-full sm:w-80 group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Seek members..."
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center space-x-2 text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 border-r border-gray-100">
                        <ShieldCheck size={14} className="text-gray-300" />
                        <span>Restricted Access Area</span>
                    </div>
                </div>
            </div>

            <Table
                headers={headers}
                data={users}
                renderRow={renderRow}
                loading={loading}
                pagination={{
                    totalItems: pagination?.totalItems || 0,
                    totalPages: pagination?.totalPages || 0,
                    currentPage: pagination?.currentPage || 1,
                    currentItems: users.length
                }}
                onPageChange={handlePageChange}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={targetUser ? 'Refine Covenant' : 'Annex to Covenant'}
                size="lg"
            >
                <UserForm
                    user={targetUser}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default UserListPage;
