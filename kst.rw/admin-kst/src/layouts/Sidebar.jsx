import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    LayoutDashboard,
    FileText,
    Image as ImageIcon,
    Users,
    Settings,
    LogOut,
    MessageSquare,
    Clapperboard,
    Layers,
    Activity,
    Info,
    ChevronRight
} from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, roles }) => {
    const { user } = useSelector((state) => state.auth);

    if (roles && !roles.includes(user.role)) return null;

    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
            }
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </NavLink>
    );
};

const Sidebar = () => {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="w-64 bg-dark h-full flex flex-col border-r border-gray-800 shrink-0">
            <div className="p-6">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg border border-gray-100 overflow-hidden transform hover:scale-110 transition-transform duration-500">
                        <img src="/logo.png" alt="KST Logo" className="w-full h-full object-contain p-1" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg leading-tight uppercase tracking-wider">KST Portal</h1>
                        <p className="text-gray-500 text-xs font-medium">Administration</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                <SidebarItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />

                <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Content</div>
                <SidebarItem to="/blogs" icon={FileText} label="Blogs" roles={['Super Admin', 'Admin', 'Content Manager', 'Blogger', 'Editor']} />
                <SidebarItem to="/clubs" icon={Layers} label="Clubs" roles={['Super Admin', 'Admin', 'Content Manager', 'Editor']} />
                <SidebarItem to="/programs" icon={Clapperboard} label="Programs" roles={['Super Admin', 'Admin', 'Content Manager', 'Editor']} />
                <SidebarItem to="/gallery" icon={ImageIcon} label="Gallery" roles={['Super Admin', 'Admin', 'Content Manager', 'Editor']} />
                <SidebarItem to="/about" icon={Info} label="About" roles={['Super Admin', 'Admin', 'Content Manager', 'Editor']} />

                <div className="pt-4 pb-2 px-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Settings</div>
                <SidebarItem to="/messages" icon={MessageSquare} label="Messages" roles={['Super Admin', 'Admin', 'Content Manager']} />
                <SidebarItem to="/users" icon={Users} label="Users" roles={['Super Admin', 'Admin']} />
                <SidebarItem to="/audit-logs" icon={Activity} label="Audit Logs" roles={['Super Admin']} />
                <SidebarItem to="/hero-slides" icon={Settings} label="Hero Slides" roles={['Super Admin', 'Admin']} />
            </nav>

            <div className="p-4 border-t border-gray-800 bg-black/20">
                <div className="flex items-center space-x-3 p-2 rounded-lg bg-gray-900/50">
                    <img
                        src={user?.image || 'https://placehold.co/100/png?text=User'}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border border-gray-700 object-cover"
                    />
                    <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-primary font-medium">{user?.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
