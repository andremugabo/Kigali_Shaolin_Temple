import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md'
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'sm:max-w-md',
        md: 'sm:max-w-lg',
        lg: 'sm:max-w-2xl',
        xl: 'sm:max-w-5xl',
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden p-4 sm:p-6 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className={`relative bg-white rounded-3xl shadow-2xl w-full ${sizes[size]} transform transition-all animate-in zoom-in-95 fade-in duration-300 border border-gray-100`}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-50">
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight lowercase">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="p-6 border-t border-gray-50 bg-gray-50/30 rounded-b-3xl flex items-center justify-end gap-3 font-bold">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
