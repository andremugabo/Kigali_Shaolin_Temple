import React, { useState, useEffect } from 'react';
import apiClient, { getMediaPath } from '../../api/apiClient';
import { Link } from 'react-router-dom';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

const BlogListPage = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await apiClient.get('/blogs');
                if (response.data.success) {
                    setBlogs(response.data.data.blogs);
                }
            } catch (error) {
                console.error('Failed to fetch blogs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) return (
        <div className="h-screen bg-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-dark pt-32 lg:pt-48 pb-32">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-playfair font-black text-white/[0.03] select-none uppercase tracking-tighter">
                        Articles
                    </div>
                    <p className="text-gold font-bold tracking-[0.6em] uppercase text-sm mb-6 drop-shadow-lg">Temple News</p>
                    <h1 className="text-6xl md:text-9xl font-playfair font-black text-white text-glow leading-none italic mb-8 uppercase">
                        Temple <span className="text-primary italic font-playfair">Blog</span>
                    </h1>
                    <p className="text-white/60 text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                        Latest news, articles, and training tips from our masters and the temple community.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                    {blogs.map((blog) => (
                        <Link
                            key={blog.id}
                            to={`/blog/${blog.id}`}
                            className="group flex flex-col bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-gold/20 transition-all duration-700 hover:shadow-luxury"
                        >
                            {/* Manuscript Image */}
                            <div className="relative h-[280px] overflow-hidden">
                                <img
                                    src={getMediaPath(blog.image)}
                                    alt={blog.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent opacity-60" />

                                <div className="absolute top-6 left-6">
                                    <span className="bg-primary/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg border border-white/10">
                                        {blog.category}
                                    </span>
                                </div>
                            </div>

                            {/* Manuscript Content */}
                            <div className="p-8 lg:p-10 flex-1 flex flex-col">
                                <div className="flex flex-wrap items-center gap-4 text-white/30 text-[10px] font-bold uppercase tracking-widest mb-6">
                                    <div className="flex items-center space-x-1.5">
                                        <Calendar size={12} className="text-gold" />
                                        <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                                    <div className="flex items-center space-x-2 text-gold/80">
                                        {blog.author?.image ? (
                                            <img
                                                src={getMediaPath(blog.author.image)}
                                                alt={blog.author?.name}
                                                className="w-5 h-5 rounded-full object-cover border border-gold/20"
                                            />
                                        ) : (
                                            <Tag size={12} className="text-gold" />
                                        )}
                                        <span>{blog.author?.name || 'KST Master'}</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl lg:text-3xl font-playfair font-black text-white mb-6 group-hover:text-gold transition-colors italic leading-tight">
                                    {blog.title}
                                </h3>

                                <p className="text-white/40 text-sm leading-relaxed mb-8 line-clamp-3">
                                    {blog.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                </p>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Read Article</span>
                                    <ArrowRight size={18} className="text-white/20 group-hover:text-gold group-hover:translate-x-2 transition-all duration-500" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogListPage;
