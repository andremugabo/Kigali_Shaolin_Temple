import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft, Home, Sword } from 'lucide-react';
import { Button } from '../components/Shared';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full relative z-10 space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex justify-center relative">
                    <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center text-primary border border-gray-100 relative z-20 hover:scale-105 transition-transform duration-500">
                        <Compass size={64} className="animate-spin-slow" />
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 rounded-full animate-ping opacity-20 z-10"></div>
                </div>

                <div className="space-y-4">
                    <h1 className="text-[120px] font-black text-gray-900 leading-none lowercase tracking-tighter">404</h1>
                    <div className="space-y-2">
                        <h2 className="text-xl font-black text-gray-900 lowercase tracking-tight">Path Obscured</h2>
                        <p className="text-gray-500 font-medium italic">
                            The trail you seek has been hidden by the mists of time.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Button
                        onClick={() => navigate(-1)}
                        className="bg-white text-gray-900 border border-gray-200 hover:border-gray-900 shadow-xl"
                        icon={ArrowLeft}
                    >
                        Retrace Steps
                    </Button>
                    <Button
                        onClick={() => navigate('/dashboard')}
                        className="shadow-2xl shadow-primary/20"
                        icon={Home}
                    >
                        Temple Grounds
                    </Button>
                </div>

                <div className="pt-12 flex flex-col items-center">
                    <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-primary mb-4 shadow-lg border border-gray-800">
                        <Sword size={16} />
                    </div>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.4em]">Kigali Shaolin Temple</p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;