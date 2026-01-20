import React from 'react';

const Input = ({
    label,
    error,
    icon: Icon,
    type = 'text',
    className = '',
    ...props
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none group-focus-within:text-primary transition-colors text-gray-400">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={type}
                    className={`block w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm shadow-sm focus:shadow-md ${error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : ''
                        }`}
                    {...props}
                />
            </div>
            {error && <p className="mt-1 text-xs font-medium text-red-500 ml-1">{error}</p>}
        </div>
    );
};

export default Input;
