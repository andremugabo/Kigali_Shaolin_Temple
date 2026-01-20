import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuditLogs } from '../../store/slices/auditLogSlice';
import { Table } from '../../components/Shared';
import { Activity, Search, Filter, Calendar, User as UserIcon, Tag, Terminal, ChevronDown, Eye } from 'lucide-react';

const AuditLogPage = () => {
    const dispatch = useDispatch();
    const { logs, pagination, loading } = useSelector((state) => state.auditLogs);

    const [filters, setFilters] = useState({
        action: '',
        entity: '',
        userId: '',
        page: 1
    });

    const [expandedLog, setExpandedLog] = useState(null);

    useEffect(() => {
        dispatch(fetchAuditLogs(filters));
    }, [dispatch, filters]);

    const handlePageChange = (page) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const headers = ['Action', 'Entity', 'Initiator', 'Temporal Mark'];

    const getActionBadge = (action) => {
        const styles = {
            'CREATE': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'UPDATE': 'bg-indigo-100 text-indigo-700 border-indigo-200',
            'DELETE': 'bg-rose-100 text-rose-700 border-rose-200',
            'LOGIN': 'bg-amber-100 text-amber-700 border-amber-200',
            'RESTORE': 'bg-teal-100 text-teal-700 border-teal-200',
            'FORCE_DELETE': 'bg-black text-white border-black',
        };

        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black tracking-[0.1em] border shadow-sm ${styles[action] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                {action}
            </span>
        );
    };

    const renderRow = (log) => {
        const isExpanded = expandedLog === log.id;

        return (
            <React.Fragment key={log.id}>
                <tr className={`hover:bg-gray-50/80 transition-colors cursor-pointer ${isExpanded ? 'bg-gray-50/50' : ''}`} onClick={() => setExpandedLog(isExpanded ? null : log.id)}>
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-400 group-hover:text-primary transition-colors">
                                <Terminal size={14} />
                            </div>
                            {getActionBadge(log.action)}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{log.entity}</span>
                            <span className="text-[10px] text-gray-300 font-medium italic">#{log.entityId?.substring(0, 8)}...</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-6 w-6 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 overflow-hidden border border-gray-200">
                                {log.userId ? <UserIcon size={12} /> : 'SYS'}
                            </div>
                            <span className="text-xs font-bold text-gray-500 lowercase tracking-tighter">
                                {log.User?.name || 'System / Auto'}
                            </span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-400 lowercase tracking-tight">
                        {new Date(log.createdAt).toLocaleString('en-GB', {
                            day: '2-digit', month: 'short',
                            hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <button className={`p-2 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : 'text-gray-300'}`}>
                            <ChevronDown size={16} />
                        </button>
                    </td>
                </tr>
                {isExpanded && (
                    <tr>
                        <td colSpan="5" className="px-8 py-6 bg-gray-50/50 border-b border-gray-100">
                            <div className="bg-white rounded-[2rem] p-6 shadow-inner border border-gray-100 animate-in slide-in-from-top-2 duration-300">
                                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-50">
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Eye size={12} /> Detailed Manifest
                                    </h5>
                                    <div className="flex gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-gray-300 uppercase tracking-widest font-bold">IP Address</span>
                                            <span className="text-[10px] font-bold text-gray-500">{log.ipAddress || 'Internal Loop'}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-gray-300 uppercase tracking-widest font-bold">User Agent</span>
                                            <span className="text-[10px] font-bold text-gray-500 max-w-[200px] truncate">{log.userAgent || 'Server Script'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Metadata Context</p>
                                        <pre className="text-[10px] font-mono bg-gray-50 p-4 rounded-2xl border border-gray-100 overflow-auto max-h-[150px] text-gray-600">
                                            {JSON.stringify(log.details, null, 2)}
                                        </pre>
                                    </div>
                                    <div className="flex flex-col justify-center bg-primary/5 rounded-[2rem] p-6 border border-primary/10">
                                        <p className="text-xs font-medium text-gray-600 italic">
                                            "This marker chronicles the {log.action.toLowerCase()} of {log.entity.toLowerCase()} record {log.entityId} established by {log.User?.name || 'the system'}."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
            </React.Fragment>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 lowercase tracking-tight">
                        <span className="bg-gray-900 text-white p-2.5 rounded-2xl shadow-xl shadow-gray-200 ring-4 ring-gray-50"><Activity size={28} /></span>
                        Sacred Chronicles (Audit)
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Observe every interaction within the temple's digital walls.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-1 px-3 bg-indigo-50 border border-indigo-100 rounded-full flex items-center gap-2">
                        <ShieldCheck size={14} className="text-indigo-500" />
                        <span className="text-[9px] font-black text-indigo-700 uppercase tracking-widest">Immune Records</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="relative group">
                    <Terminal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        name="action"
                        className="appearance-none w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-10 text-[10px] font-black uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={filters.action}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Actions</option>
                        <option value="CREATE">Creation</option>
                        <option value="UPDATE">Refinement</option>
                        <option value="DELETE">Removal</option>
                        <option value="LOGIN">Covenant Entry</option>
                    </select>
                </div>

                <div className="relative group">
                    <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                        name="entity"
                        className="appearance-none w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-10 text-[10px] font-black uppercase tracking-widest text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={filters.entity}
                        onChange={handleFilterChange}
                    >
                        <option value="">All Entities</option>
                        <option value="Blog">Blogs</option>
                        <option value="User">Members</option>
                        <option value="Club">Clubs</option>
                        <option value="Program">Curriculums</option>
                        <option value="Gallery">Gallery</option>
                    </select>
                </div>

                <div className="relative group col-span-1 sm:col-span-2">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Seek specific initiators or identifiers..."
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                    />
                </div>
            </div>

            <Table
                headers={headers}
                data={logs}
                renderRow={renderRow}
                loading={loading}
                pagination={{
                    totalItems: pagination?.totalItems || 0,
                    totalPages: pagination?.totalPages || 0,
                    currentPage: pagination?.currentPage || 1,
                    currentItems: logs?.length || 0
                }}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

// Internal icon for usage
const ShieldCheck = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default AuditLogPage;
