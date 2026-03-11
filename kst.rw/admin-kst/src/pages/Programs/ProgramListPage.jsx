import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPrograms, deleteProgram } from '../../store/slices/programSlice';
import { Button, Table, Modal } from '../../components/Shared';
import { Plus, Edit, Trash2, Eye, Layout, Calendar, Search, Activity, Heart, Shield } from 'lucide-react';
import { toast } from 'react-toastify';
import { getMediaPath } from '../../api/apiClient';
import ProgramForm from './ProgramForm';

const ProgramListPage = () => {
    const dispatch = useDispatch();
    const { programs, pagination, loading } = useSelector((state) => state.programs);
    const { user } = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProgram, setCurrentProgram] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchPrograms({ page: 1 }));
    }, [dispatch]);

    const handlePageChange = (page) => {
        dispatch(fetchPrograms({ page }));
    };

    const handleCreate = () => {
        setCurrentProgram(null);
        setIsModalOpen(true);
    };

    const handleEdit = (program) => {
        setCurrentProgram(program);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this sacred training program?')) {
            const resultAction = await dispatch(deleteProgram(id));
            if (deleteProgram.fulfilled.match(resultAction)) {
                toast.success('Program dismantled successfully');
            } else {
                toast.error(resultAction.payload || 'Failed to dismantle program');
            }
        }
    };

    const headers = ['Curriculum', 'Status', 'Focus', 'Established On'];

    const renderRow = (program) => {
        return (
            <tr key={program.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-14 w-14 relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm transition-all group-hover:rotate-3 group-hover:scale-105">
                            <img
                                className="h-full w-full object-cover"
                                src={getMediaPath(program.image) || 'https://via.placeholder.com/150'}
                                alt=""
                            />
                        </div>
                        <div>
                            <div className="text-sm font-black text-gray-900 lowercase tracking-tight">{program.name}</div>
                            <p className="text-[10px] text-gray-400 font-medium italic truncate max-w-[200px] mt-1">{program.description?.substring(0, 50)}...</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${program.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm shadow-emerald-100'
                        : 'bg-rose-100 text-rose-700 border border-rose-200 shadow-sm shadow-rose-100'
                        }`}>
                        <Activity size={10} className="mr-1.5" />
                        {program.status || 'Active'}
                    </span>
                </td>
                <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5">
                        <div className="p-1 bgColor-white rounded-lg shadow-sm border border-gray-100 text-primary">
                            {program.name.toLowerCase().includes('yoga') ? <Heart size={14} /> : <Shield size={14} />}
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            {program.name.toLowerCase().includes('yoga') ? 'Internal Focus' : 'Martial Arts'}
                        </span>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <div className="flex items-center text-xs font-bold text-gray-500 lowercase tracking-tighter">
                        <Calendar size={14} className="mr-1.5 opacity-50" />
                        {new Date(program.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </td>
                <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                        <button className="p-2.5 text-gray-400 hover:text-primary transition-all hover:bg-primary/5 rounded-xl"><Eye size={18} /></button>
                        {showActions && (
                            <>
                                <button
                                    onClick={() => handleEdit(program)}
                                    className="p-2.5 text-gray-400 hover:text-emerald-500 transition-all hover:bg-emerald-50 rounded-xl"
                                ><Edit size={18} /></button>
                                <button
                                    onClick={() => handleDelete(program.id)}
                                    className="p-2.5 text-gray-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl"
                                ><Trash2 size={18} /></button>
                            </>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    const showActions = ['Super Admin', 'Admin', 'Content Manager'].includes(user.role);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 lowercase tracking-tight">
                        <span className="bg-primary/10 text-primary p-2.5 rounded-2xl shadow-inner border border-primary/10"><Layout size={28} /></span>
                        Sacred Curriculums
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Shape the training paths and discipleship programs.</p>
                </div>
                {showActions && (
                    <Button
                        onClick={handleCreate}
                        icon={Plus}
                        className="shadow-xl shadow-primary/20 hover:shadow-primary/30"
                    >
                        Inaugurate Program
                    </Button>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative w-full sm:w-80 group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Seek curricula..."
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Filters can go here in the future */}
                </div>
            </div>

            <Table
                headers={headers}
                data={programs}
                renderRow={renderRow}
                loading={loading}
                pagination={{
                    totalItems: pagination?.totalItems || 0,
                    totalPages: pagination?.totalPages || 0,
                    currentPage: pagination?.currentPage || 1,
                    currentItems: programs.length
                }}
                onPageChange={handlePageChange}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentProgram ? 'Refine Curriculum' : 'Inaugurate Curriculum'}
                size="lg"
            >
                <ProgramForm
                    program={currentProgram}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default ProgramListPage;
