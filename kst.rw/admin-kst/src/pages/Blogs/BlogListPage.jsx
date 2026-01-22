import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, deleteBlog } from '../../store/slices/blogSlice';
import { Button, Table, Modal } from '../../components/Shared';
import { Plus, Edit, Trash2, Eye, Filter, Search, Calendar, User as UserIcon, Tag, FileText } from 'lucide-react';
import { toast } from 'react-toastify';
import BlogForm from './BlogForm';

const BlogListPage = () => {
    const dispatch = useDispatch();
    const { blogs, pagination, loading } = useSelector((state) => state.blogs);
    const { user } = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    useEffect(() => {
        dispatch(fetchBlogs({ page: 1 }));
    }, [dispatch]);

    const handlePageChange = (page) => {
        dispatch(fetchBlogs({ page, category: filterCategory }));
    };

    const handleCreate = () => {
        setCurrentBlog(null);
        setIsModalOpen(true);
    };

    const handleEdit = (blog) => {
        setCurrentBlog(blog);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            const resultAction = await dispatch(deleteBlog(id));
            if (deleteBlog.fulfilled.match(resultAction)) {
                toast.success('Blog deleted successfully');
            } else {
                toast.error(resultAction.payload || 'Failed to delete blog');
            }
        }
    };

    const headers = ['Post Details', 'Category', 'Author', 'Status', 'Date'];

    const renderRow = (blog) => {
        // RBAC: Blogger only sees/edits their own blogs
        if (user.role === 'Blogger' && blog.userId !== user.id) return null;

        return (
            <tr key={blog.id} className="hover:bg-gray-50/80 transition-colors group">
                <td className="px-6 py-5">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 h-12 w-16 relative overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                            <img
                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                src={blog.image || 'https://via.placeholder.com/150'}
                                alt=""
                            />
                        </div>
                        <div className="max-w-xs sm:max-w-md">
                            <div className="text-sm font-black text-gray-900 truncate hover:text-clip hover:whitespace-normal transition-all">{blog.title}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 line-clamp-1">{blog.content.substring(0, 60)}...</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary uppercase tracking-wider border border-primary/5">
                        <Tag size={10} className="mr-1" />
                        {blog.category || 'General'}
                    </span>
                </td>
                <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 overflow-hidden">
                            {blog.User?.image ? (
                                <img src={blog.User.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon size={12} className="text-gray-400" />
                            )}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{blog.User?.name || 'Anonymous Author'}</span>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${blog.published
                        ? 'bg-green-100 text-green-700 border border-green-200 shadow-sm shadow-green-100'
                        : 'bg-amber-100 text-amber-700 border border-amber-200 shadow-sm shadow-amber-100'
                        }`}>
                        {blog.published ? 'Published' : 'Draft'}
                    </span>
                </td>
                <td className="px-6 py-5">
                    <div className="flex items-center text-xs font-bold text-gray-500 lowercase tracking-tighter">
                        <Calendar size={14} className="mr-1.5 opacity-50" />
                        {new Date(blog.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                </td>
                <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-primary/5 rounded-xl"><Eye size={18} /></button>
                        {showActions && (
                            <>
                                <button
                                    onClick={() => handleEdit(blog)}
                                    className="p-2 text-gray-400 hover:text-emerald-500 transition-colors hover:bg-emerald-50 rounded-xl"
                                ><Edit size={18} /></button>
                                <button
                                    onClick={() => handleDelete(blog.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl"
                                ><Trash2 size={18} /></button>
                            </>
                        )}
                    </div>
                </td>
            </tr>
        );
    };

    const showActions = ['Super Admin', 'Admin', 'Content Manager', 'Blogger'].includes(user.role);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 lowercase tracking-tight">
                        <span className="bg-emerald-50 text-emerald-600 p-2.5 rounded-2xl shadow-inner border border-emerald-100"><FileText size={28} /></span>
                        Scroll of Wisdom
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Manage all temple manuscripts and chronicles here.</p>
                </div>
                {showActions && (
                    <Button
                        onClick={handleCreate}
                        icon={Plus}
                        className="shadow-xl shadow-primary/20 hover:shadow-primary/30"
                    >
                        Draft New Wisdom
                    </Button>
                )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                <div className="relative w-full sm:w-80 group">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Seek manuscripts..."
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none group">
                        <Tag size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <select
                            className="appearance-none w-full sm:w-48 bg-gray-50/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold uppercase tracking-widest text-gray-600"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="">All Scrolls</option>
                            <option value="Philosophy">Philosophy</option>
                            <option value="Technique">Technique</option>
                            <option value="History">History</option>
                        </select>
                    </div>
                    <button className="p-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-400 hover:text-primary hover:border-primary transition-all active:scale-95 shadow-sm">
                        <Filter size={20} />
                    </button>
                </div>
            </div>

            <Table
                headers={headers}
                data={blogs}
                renderRow={renderRow}
                loading={loading}
                pagination={{
                    totalItems: pagination?.totalItems || 0,
                    totalPages: pagination?.totalPages || 0,
                    currentPage: pagination?.currentPage || 1,
                    currentItems: blogs.length
                }}
                onPageChange={handlePageChange}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentBlog ? 'Refine Wisdom' : 'Manifest New Wisdom'}
                size="lg"
            >
                <BlogForm
                    blog={currentBlog}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default BlogListPage;
