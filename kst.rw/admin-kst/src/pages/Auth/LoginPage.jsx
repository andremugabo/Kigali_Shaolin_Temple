import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, clearError } from '../../store/slices/authSlice';
import { Mail, Lock, LogIn, ShieldCheck, Sword } from 'lucide-react';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const from = location.state?.from?.pathname || '/dashboard';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
        return () => {
            dispatch(clearError());
        };
    }, [isAuthenticated, navigate, from, dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(formData));
    };

    return (
        <div className="min-h-screen bg-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary rounded-full filter blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center flex-col items-center">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-2xl border border-primary/50 transform rotate-12 hover:rotate-0 transition-transform duration-500">
                        <Sword size={32} />
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight uppercase">
                        KST Management
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400 font-medium">
                        Authorized Personnel Only
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-gray-900/50 backdrop-blur-xl py-8 px-10 shadow-2xl sm:rounded-3xl border border-gray-800">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-primary transition-colors text-gray-500">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm sm:text-base"
                                    placeholder="admin@kst.rw"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-primary transition-colors text-gray-500">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-10 pr-4 py-3 bg-black/30 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm sm:text-base"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 animate-shake">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <ShieldCheck className="h-5 w-5 text-red-500" aria-hidden="true" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-red-500">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white uppercase tracking-widest bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center space-x-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Authenticating...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <LogIn size={18} />
                                        <span>Enter Portal</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-800 text-center">
                        <p className="text-xs text-gray-500 font-medium italic">
                            Protecting Shaolin Heritage & Operations
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
