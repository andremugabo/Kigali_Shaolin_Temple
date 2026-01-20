import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, markMessageAsRead, deleteMessage } from '../../store/slices/messageSlice';
import { Table, Modal, Button } from '../../components/Shared';
import { MessageSquare, Mail, User, Calendar, Trash2, Eye, CheckCircle, Search, Clock, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const MessageListPage = () => {
    const dispatch = useDispatch();
    const { messages, pagination, loading } = useSelector((state) => state.messages);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchMessages({ page: 1 }));
    }, [dispatch]);

    const handlePageChange = (page) => {
        dispatch(fetchMessages({ page }));
    };

    const handleView = (message) => {
        setSelectedMessage(message);
        setIsModalOpen(true);
        if (!message.is_read) {
            dispatch(markMessageAsRead(message.id));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Excommunicate this message from the archives?')) {
            const resultAction = await dispatch(deleteMessage(id));
            if (deleteMessage.fulfilled.match(resultAction)) {
                toast.success('Message removed');
            } else {
                toast.error(resultAction.payload || 'Failed to remove message');
            }
        }
    };

    const headers = ['Digital Pilgrim', 'Inquiry Intent', 'Temporal Mark', 'Soul Status'];

    const renderRow = (message) => {
        return (
            <tr key={message.id} className={`hover:bg-gray-50/80 transition-colors group ${!message.is_read ? 'bg-primary/5' : ''}`}>
                <td className="px-6 py-5">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                            <User size={18} />
                        </div>
                        <div>
                            <div className="text-sm font-black text-gray-900 lowercase tracking-tight">{message.name}</div>
                            <div className="text-[10px] text-gray-400 font-bold flex items-center gap-1 mt-0.5">
                                <Mail size={10} className="opacity-70" /> {message.email}
                            </div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <div className="text-[11px] font-medium text-gray-600 line-clamp-1 max-w-[200px] italic">"{message.message}"</div>
                </td>
                <td className="px-6 py-5 text-xs font-bold text-gray-400 lowercase tracking-tight">
                    <div className="flex items-center gap-2">
                        <Clock size={12} className="opacity-40" />
                        {new Date(message.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                </td>
                <td className="px-6 py-5">
                    {message.is_read ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <CheckCircle size={10} className="mr-1" /> Enlightened
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                            <Info size={10} className="mr-1" /> Awaiting
                        </span>
                    )}
                </td>
                <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => handleView(message)}
                            className="p-2.5 text-gray-400 hover:text-indigo-600 transition-all hover:bg-indigo-50 rounded-xl"
                        ><Eye size={18} /></button>
                        <button
                            onClick={() => handleDelete(message.id)}
                            className="p-2.5 text-gray-400 hover:text-red-500 transition-all hover:bg-red-50 rounded-xl"
                        ><Trash2 size={18} /></button>
                    </div>
                </td>
            </tr>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 lowercase tracking-tight">
                        <span className="bg-emerald-50 text-emerald-600 p-2.5 rounded-2xl shadow-inner border border-emerald-100"><MessageSquare size={28} /></span>
                        Pilgrim Inquiry (Messages)
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Hear the voices of those seeking the path of the warrior.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                            {messages.filter(m => !m.is_read).length} New Inquiries
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative w-full sm:w-80 group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Seek voices..."
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Table
                headers={headers}
                data={messages}
                renderRow={renderRow}
                loading={loading}
                pagination={{
                    totalItems: pagination?.totalItems || 0,
                    totalPages: pagination?.totalPages || 0,
                    currentPage: pagination?.currentPage || 1,
                    currentItems: messages.length
                }}
                onPageChange={handlePageChange}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Voice of the Pilgrim"
                size="md"
            >
                {selectedMessage && (
                    <div className="space-y-8 py-4">
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-primary">
                                    <User size={28} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-gray-900 lowercase tracking-tight">{selectedMessage.name}</h4>
                                    <p className="text-sm font-bold text-gray-400 lowercase italic">{selectedMessage.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Received On</p>
                                <p className="text-xs font-bold text-gray-600 mt-1">
                                    {new Date(selectedMessage.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 relative p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-inner">
                            <div className="absolute top-4 left-4 text-gray-100">
                                <MessageSquare size={48} />
                            </div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4 relative z-10">The Inquiry</p>
                            <div className="text-gray-700 leading-relaxed font-semibold italic text-lg relative z-10">
                                "{selectedMessage.message}"
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-50">
                            <Button
                                onClick={() => window.open(`mailto:${selectedMessage.email}`)}
                                icon={Mail}
                                className="shadow-xl shadow-primary/20"
                            >
                                Ascend Response (Reply)
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default MessageListPage;
