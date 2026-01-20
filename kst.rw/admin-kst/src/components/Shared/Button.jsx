import React from 'react';

const Button = ({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    icon: Icon,
    loading = false,
    disabled = false,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

    const variants = {
        primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-md hover:shadow-lg',
        secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300',
        outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-md',
        ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:ring-gray-300',
        dark: 'bg-dark text-white hover:bg-black focus:ring-dark',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-lg',
        md: 'px-6 py-3 text-sm rounded-xl',
        lg: 'px-8 py-4 text-base rounded-2xl',
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    {Icon && <Icon className={`${children ? 'mr-2' : ''}`} size={size === 'sm' ? 16 : 20} />}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
