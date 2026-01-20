import React from 'react';
import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';

const Table = ({
    headers = [],
    data = [],
    renderRow,
    loading = false,
    pagination,
    onPageChange
}) => {
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest"
                                >
                                    {header}
                                </th>
                            ))}
                            <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            [1, 2, 3].map((i) => (
                                <tr key={i} className="animate-pulse">
                                    {headers.map((_, j) => (
                                        <td key={j} className="px-6 py-5">
                                            <div className="h-4 bg-gray-100 rounded-full w-24"></div>
                                        </td>
                                    ))}
                                    <td className="px-6 py-5 text-right">
                                        <div className="h-8 w-8 bg-gray-100 rounded-lg ml-auto"></div>
                                    </td>
                                </tr>
                            ))
                        ) : data.length > 0 ? (
                            data.map((item, index) => renderRow(item, index))
                        ) : (
                            <tr>
                                <td colSpan={headers.length + 1} className="px-6 py-20 text-center">
                                    <p className="text-gray-400 font-medium">No records found matching your criteria.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                        Showing <span className="font-bold text-gray-900">{pagination.currentItems}</span> of{' '}
                        <span className="font-bold text-gray-900">{pagination.totalItems}</span> results
                    </p>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="p-2 border border-gray-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all shadow-sm"
                        >
                            <ChevronLeft size={18} className="text-gray-500" />
                        </button>
                        <div className="flex items-center space-x-1 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <span className="text-sm font-bold text-primary">{pagination.currentPage}</span>
                            <span className="text-sm font-bold text-gray-300">/</span>
                            <span className="text-sm font-bold text-gray-500">{pagination.totalPages}</span>
                        </div>
                        <button
                            onClick={() => onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="p-2 border border-gray-200 rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition-all shadow-sm"
                        >
                            <ChevronRight size={18} className="text-gray-500" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;
