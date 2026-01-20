import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { Bell, Search, User, LogOut, Settings, Menu } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                >
                    <Menu size={20} />
                </button>
                <div className="relative hidden md:block">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                        <Search size={16} />
                    </span>
                    <input
                        type="text"
                        placeholder="Search everything..."
                        className="w-80 bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm focus:bg-white"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-5">
                <div className="flex items-center space-x-1">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative transition-all group">
                        <Bell size={20} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
                    </button>

                    <div className="h-4 w-px bg-gray-200 mx-2"></div>

                    <div
                        onClick={() => navigate('/profile')}
                        className="flex items-center space-x-3 group cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-all"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-800 truncate leading-none">{user?.name}</p>
                            <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">{user?.role}</p>
                        </div>
                        <div className="relative group">
                            <img
                                src={user?.image || 'https://via.placeholder.com/40'}
                                alt="Avatar"
                                className="w-9 h-9 rounded-full border-2 border-gray-100 object-cover group-hover:border-primary transition-all"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="ml-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
