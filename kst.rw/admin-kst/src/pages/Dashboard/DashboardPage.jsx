import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';
import {
    Users,
    FileText,
    Layers,
    Clapperboard,
    MessageSquare,
    Image as ImageIcon,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    RefreshCcw,
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, change, trend, color, loading }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform`}></div>
        <div className="flex items-center justify-between mb-4 relative z-10">
            <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600`}>
                <Icon size={24} />
            </div>
            {!loading && change && (
                <div className={`flex items-center space-x-1 text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    <span>{change}</span>
                    {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                </div>
            )}
        </div>
        <h3 className="text-gray-400 text-xs font-bold mb-1 tracking-widest uppercase relative z-10">{label}</h3>
        {loading ? (
            <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-lg mt-1"></div>
        ) : (
            <p className="text-3xl font-black text-gray-900 relative z-10">{value}</p>
        )}
    </div>
);

const DashboardPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { stats, loading, error } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    const handleRefresh = () => {
        dispatch(fetchDashboardStats());
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 lowercase tracking-tight">
                        <span className="bg-primary/10 text-primary p-2.5 rounded-2xl shadow-inner border border-primary/10"><TrendingUp size={28} /></span>
                        Master Overview
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Peace be upon you, <span className="text-primary font-bold not-italic">{user?.name}</span>. The temple operations are currently stable.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="bg-white border border-gray-200 text-gray-600 p-2.5 rounded-2xl shadow-sm hover:border-primary hover:text-primary transition-all active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button className="bg-white border border-gray-200 text-gray-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-sm hover:border-primary transition-all active:scale-95">Download PDF Report</button>
                    <button className="bg-primary text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg hover:shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">Create New Content</button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard icon={Users} label="Total Disciples" value={stats.users?.total || 0} change="+2" trend="up" color="blue" loading={loading} />
                <StatCard icon={FileText} label="Published Wisdom" value={stats.blogs?.published || 0} change={`${stats.blogs?.total || 0} total`} trend="up" color="purple" loading={loading} />
                <StatCard icon={Layers} label="Active Clubs" value={stats.clubs?.total || 0} color="emerald" loading={loading} />
                <StatCard icon={MessageSquare} label="New Inquiries" value={stats.messages?.unread || 0} change={`${stats.messages?.total || 0} total`} trend={(stats.messages?.unread || 0) > 0 ? 'up' : 'down'} color="amber" loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 min-h-[450px] flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="text-center relative z-10">
                        <div className="bg-gray-50/50 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-gray-100 shadow-inner group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                            <Activity className="text-gray-300" size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Temporal Insight Chart</h3>
                        <p className="text-gray-400 max-w-sm mx-auto text-sm font-medium leading-relaxed">
                            The visual flow of temple engagement will be manifested here using high-performance charting libraries in the final refinement stage.
                        </p>
                    </div>
                </div>

                <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl min-h-[450px] relative overflow-hidden border border-gray-800">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full filter blur-[100px] -mr-40 -mt-40 animate-pulse"></div>
                    <h3 className="text-xl font-bold text-white mb-10 flex items-center gap-4">
                        <span className="w-2.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(123,30,30,0.5)]"></span>
                        Sacred Activity Log
                    </h3>
                    <div className="space-y-8 relative z-10">
                        {[
                            { action: 'System deployed successfully', time: 'Initial Sync', role: 'Super Admin' },
                            { action: 'Dashboard statistics integrated', time: 'Just now', role: 'System' },
                            { action: 'Redux store synchronized', time: '5 mins ago', role: 'Admin' }
                        ].map((log, i) => (
                            <div key={i} className="flex items-start space-x-5 group cursor-pointer">
                                <div className="relative flex flex-col items-center">
                                    <div className="w-3 h-3 bg-gray-700 rounded-full border-2 border-gray-800 group-hover:bg-primary group-hover:border-primary/30 group-hover:scale-125 transition-all duration-300"></div>
                                    {i !== 2 && <div className="w-0.5 h-12 bg-gray-800 mt-2"></div>}
                                </div>
                                <div className="transform group-hover:translate-x-1 transition-transform">
                                    <p className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors leading-snug">{log.action}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1.5">{log.time} • {log.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute bottom-10 left-10 right-10">
                        <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/50 text-xs font-bold uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all active:scale-95">
                            View Full Chronicle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
