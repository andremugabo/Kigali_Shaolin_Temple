import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient, { getMediaPath } from '../../api/apiClient';
import { Calendar, Tag, ArrowLeft, Share2, Clock } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const BlogDetailPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [headerRef, headerVisible] = useScrollReveal();
    const [contentRef, contentVisible] = useScrollReveal();
    const [relatedRef, relatedVisible] = useScrollReveal();

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const [blogRes, allBlogsRes] = await Promise.all([
                    apiClient.get(`/blogs/${id}`),
                    apiClient.get('/blogs')
                ]);

                if (blogRes.data.success) {
                    setBlog(blogRes.data.data);
                }

                if (allBlogsRes.data.success) {
                    const filtered = allBlogsRes.data.data.blogs
                        .filter(b => b.id !== parseInt(id))
                        .slice(0, 3);
                    setRelatedBlogs(filtered);
                }
            } catch (error) {
                console.error('Failed to fetch blog data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return (
        <div className="h-screen bg-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
    );

    if (!blog) return (
        <div className="h-screen bg-dark flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-4xl font-playfair font-black text-white mb-6 uppercase tracking-tighter">Wisdom Lost</h1>
            <p className="text-white/40 mb-12 max-w-md">The scroll you seek has not been found in our archives.</p>
            <Link to="/blog" className="group flex items-center space-x-3 bg-primary px-8 py-4 rounded-2xl text-white font-black uppercase tracking-widest text-xs hover:bg-gold transition-all">
                <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
                <span>Back to Library</span>
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-dark pb-32">
            {/* Ergonomic Back Button */}
            <Link
                to="/blog"
                className="fixed top-8 left-8 z-[60] w-12 h-12 glass-gold rounded-full flex items-center justify-center text-gold hover:scale-110 hover:text-white transition-all group shadow-luxury"
                title="Back to Blog"
            >
                <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </Link>

            {/* Hero Header */}
            <div ref={headerRef} className="relative h-[85vh] w-full overflow-hidden">
                <img
                    src={getMediaPath(blog.image)}
                    alt={blog.title}
                    className="w-full h-full object-cover ken-burns scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-dark/20 via-dark/40 to-dark" />

                <div className="absolute inset-x-0 bottom-0 pb-24 px-6">
                    <div className="max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-10 duration-1000 fill-mode-both">
                        <div className="flex items-center space-x-4 mb-8">
                            <span className="bg-primary/80 backdrop-blur-md px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white border border-white/10">
                                {blog.category}
                            </span>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-playfair font-black text-white text-glow italic leading-[1.1] mb-10 tracking-tighter">
                            {blog.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">
                            <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                <Calendar size={14} className="text-gold" />
                                <span>{new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                <Clock size={14} className="text-gold" />
                                <span>5 min read</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-gold/10 px-3 py-1.5 rounded-full border border-gold/20 text-gold shadow-glow-gold/10">
                                {blog.author?.image ? (
                                    <img
                                        src={getMediaPath(blog.author.image)}
                                        alt={blog.author?.name}
                                        className="w-6 h-6 rounded-full object-cover border border-gold/30"
                                    />
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
                                        <Tag size={12} />
                                    </div>
                                )}
                                <span className="text-[10px] font-black tracking-widest text-white">{blog.author?.name || 'KST Master'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-6 mt-32">
                <div
                    className="animate-in fade-in duration-1000 slide-in-from-bottom-10 fill-mode-both"
                >
                    <div
                        className="text-white/80 leading-[1.9] font-medium text-xl md:text-2xl space-y-8 blog-content-area"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                </div>

                {/* Tags & Tools */}
                <div className="mt-24 py-12 border-y border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center space-x-8">
                        <button className="flex items-center space-x-3 text-white/40 hover:text-gold transition-colors text-xs font-black uppercase tracking-widest group">
                            <Share2 size={20} className="group-hover:rotate-12 transition-transform" />
                            <span>Share the Wisdom</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-[10px] text-white/20 uppercase tracking-[0.3em]">Knowledge Base:</span>
                        <div className="px-4 py-2 glass-gold rounded-xl text-[10px] text-gold uppercase tracking-widest font-black border border-gold/20">
                            {blog.category}
                        </div>
                    </div>
                </div>

                {/* Related Wisdom */}
                {relatedBlogs.length > 0 && (
                    <div ref={relatedRef} className={`mt-32 reveal-hidden ${relatedVisible ? 'reveal-visible' : ''}`}>
                        <div className="text-center mb-16">
                            <p className="text-gold font-bold tracking-[0.5em] uppercase text-[10px] mb-4">Further Learning</p>
                            <h2 className="text-4xl md:text-5xl font-playfair font-black text-white italic">Related <span className="text-primary">Wisdom</span></h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedBlogs.map(item => (
                                <Link key={item.id} to={`/blog/${item.id}`} className="group block h-full">
                                    <div className="aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 group-hover:border-gold/30 transition-all duration-700 bg-white/[0.02]">
                                        <img src={getMediaPath(item.image)} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                                    </div>
                                    <div className="mt-6">
                                        <div className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-widest text-gold/60 mb-3">
                                            {item.author?.image ? (
                                                <img src={getMediaPath(item.author.image)} alt="" className="w-4 h-4 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full bg-gold/10 flex items-center justify-center">
                                                    <Tag size={8} />
                                                </div>
                                            )}
                                            <span>{item.author?.name || 'KST Master'}</span>
                                        </div>
                                        <h4 className="text-xl font-playfair font-black text-white group-hover:text-gold transition-colors line-clamp-2 leading-tight">{item.title}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Compact Final Navigation */}
                <div className="mt-20 flex flex-col items-center">
                    <div className="w-20 h-px bg-gold/20 mb-10" />
                    <Link to="/blog" className="group flex items-center space-x-3 text-gold font-black uppercase tracking-[0.4em] text-[10px] hover:text-white transition-all">
                        <ArrowLeft size={14} className="group-hover:-translate-x-2 transition-transform" />
                        <span>Return to Knowledge Library</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogDetailPage;
