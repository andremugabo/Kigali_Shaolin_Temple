import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClubs, deleteClub, fetchTutorials } from '../../store/slices/clubSlice';
import { Button, Table, Modal } from '../../components/Shared';
import { Plus, Edit, Trash2, Eye, MapPin, Film, Info, Search, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import ClubForm from './ClubForm';
import TutorialManagement from './TutorialManagement';

const ClubListPage = () => {
    const dispatch = useDispatch();
    const { clubs, pagination, loading } = useSelector((state) => state.clubs);
    const { user } = useSelector((state) => state.auth);

    const [isClubModalOpen, setIsClubModalOpen] = useState(false);
    const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);
    const [currentClub, setCurrentClub] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchClubs({ page: 1 }));
    }, [dispatch]);

    const handlePageChange = (page) => {
        dispatch(fetchClubs({ page }));
    };

    const handleCreateClub = () => {
        setCurrentClub(null);
        setIsClubModalOpen(true);
    };

    const handleEditClub = (club) => {
        setCurrentClub(club);
        setIsClubModalOpen(true);
    };

    const handleManageTutorials = (club) => {
        setCurrentClub(club);
        dispatch(fetchTutorials(club.id));
        setIsTutorialModalOpen(true);
    };

    const handleDeleteClub = async (id) => {
        if (window.confirm('Are you sure you want to remove this temple branch?')) {
            const resultAction = await dispatch(deleteClub(id));
            if (deleteClub.fulfilled.match(resultAction)) {
                toast.success('Club removed successfully');
            } else {
                toast.error(resultAction.payload || 'Failed to remove club');
            }
        }
    };

    const headers = ['Branch Details', 'Location', 'Content', 'Creation Date'];

    const renderRow = (club) => {
        return (
            <tr key={club.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-14 w-14 relative overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                            <img
                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                src={club.image || 'https://via.placeholder.com/150'}
                                alt=""
                            />
                        </div>
                        <div>
                            <div className="text-sm font-black text-gray-900 lowercase tracking-tight">{club.name}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Branch #{club.id.substring(0, 6)}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <div className="flex items-center space-x-1.5 text-gray-600 font-bold text-xs uppercase tracking-wider">
                        <MapPin size={14} className="text-primary" />
                        <span>{club.location || 'Kigali, Rwanda'}</span>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <div className="flex flex-col space-y-1">
                        <div className="inline-flex items-center space-x-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            <Film size={12} />
                            <span>Tutorials Available</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium truncate max-w-xs italic">
                            {club.description?.substring(0, 40) || 'Traditional Shaolin training...'}...
                        </p>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <div className="text-xs font-bold text-gray-500 lowercase tracking-tighter">
                        {new Date(club.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </td>
                <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                        <button
                            onClick={() => handleManageTutorials(club)}
                            className="p-2.5 text-gray-400 hover:text-blue-500 transition-all hover:bg-blue-50 rounded-xl flex items-center gap-1.5"
                            title="Manage Tutorials"
                        >
                            <Film size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Tutorials</span>
                        </button>
                        <button
                            onClick={() => handleEditClub(club)}
                            className="p-2.5 text-gray-400 hover:text-emerald-500 transition-all hover:bg-emerald-50 rounded-xl"
                        ><Edit size={18} /></button>
                        <button
                            onClick={() => handleDeleteClub(club.id)}
                            className="p-2.5 text-gray-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl"
                        ><Trash2 size={18} /></button>
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
                        <span className="bg-primary/10 text-primary p-2.5 rounded-2xl shadow-inner border border-primary/10"><MapPin size={28} /></span>
                        Temple Branches
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Oversee the physical manifestations of the Shaolin Temple.</p>
                </div>
                {showActions && (
                    <Button
                        onClick={handleCreateClub}
                        icon={Plus}
                        className="shadow-xl shadow-primary/20 hover:shadow-primary/30"
                    >
                        Establish New Branch
                    </Button>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative w-full sm:w-80 group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Seek branches..."
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => dispatch(fetchClubs({ page: 1 }))}
                        className="p-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-400 hover:text-primary hover:border-primary transition-all active:scale-95 shadow-sm"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <Table
                headers={headers}
                data={clubs}
                renderRow={renderRow}
                loading={loading}
                pagination={{
                    totalItems: pagination?.totalItems || 0,
                    totalPages: pagination?.totalPages || 0,
                    currentPage: pagination?.currentPage || 1,
                    currentItems: clubs.length
                }}
                onPageChange={handlePageChange}
            />

            {/* Club Form Modal */}
            <Modal
                isOpen={isClubModalOpen}
                onClose={() => setIsClubModalOpen(false)}
                title={currentClub ? 'Refine Branch' : 'Establish Branch'}
                size="lg"
            >
                <ClubForm
                    club={currentClub}
                    onClose={() => setIsClubModalOpen(false)}
                />
            </Modal>

            {/* Tutorial Management Modal */}
            <Modal
                isOpen={isTutorialModalOpen}
                onClose={() => setIsTutorialModalOpen(false)}
                title={`Climbing the Ranks: ${currentClub?.name} Tutorials`}
                size="xl"
            >
                <TutorialManagement
                    club={currentClub}
                    onClose={() => setIsTutorialModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default ClubListPage;
