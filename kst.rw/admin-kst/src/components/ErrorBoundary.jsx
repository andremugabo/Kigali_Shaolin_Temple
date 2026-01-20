import React, { Component } from 'react';
import { ShieldAlert, RefreshCw, Home, Sword } from 'lucide-react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Covenant disruption detected:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/dashboard';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
                    {/* Abstract Background Decoration */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-10">
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse"></div>
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-red-600 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
                    </div>

                    <div className="max-w-md w-full relative z-10 space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="flex justify-center">
                            <div className="w-24 h-24 bg-red-500/10 border-2 border-red-500/20 rounded-[2.5rem] flex items-center justify-center text-red-500 shadow-2xl animate-bounce shadow-red-500/10">
                                <ShieldAlert size={48} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-4xl font-black text-white lowercase tracking-tight">Covenant Disruption</h1>
                            <p className="text-gray-400 font-medium italic">
                                An unexpected force has disturbed the digital temple's harmony.
                            </p>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="bg-black/40 border border-gray-800 p-4 rounded-2xl text-left overflow-auto max-h-40 custom-scrollbar">
                                <p className="text-red-400 font-mono text-xs uppercase font-bold mb-2">Error Log:</p>
                                <code className="text-gray-500 text-[10px] whitespace-pre-wrap font-mono">
                                    {this.state.error?.toString()}
                                </code>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
                            <button
                                onClick={this.handleReload}
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all active:scale-95 shadow-xl"
                            >
                                <RefreshCw size={18} />
                                Refresh Temple
                            </button>
                            <button
                                onClick={this.handleGoHome}
                                className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-700 transition-all active:scale-95 shadow-xl border border-gray-700"
                            >
                                <Home size={18} />
                                Back to Safety
                            </button>
                        </div>

                        <div className="pt-8 flex justify-center flex-col items-center">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-3">
                                <Sword size={20} />
                            </div>
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">Protecting the Heritage</p>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;