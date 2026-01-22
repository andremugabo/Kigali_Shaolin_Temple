import React, { useState, useEffect } from 'react';
import apiClient, { getMediaPath } from '../api/apiClient';
import { ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const [slides, setSlides] = useState([]);
    const [about, setAbout] = useState(null);
    const [programs, setPrograms] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const [heroRes, aboutRes, programsRes, blogsRes] = await Promise.all([
                    apiClient.get('/hero-slides'),
                    apiClient.get('/about'),
                    apiClient.get('/programs?limit=3'),
                    apiClient.get('/blogs?limit=3')
                ]);

                if (heroRes.data.success) setSlides(heroRes.data.data);
                if (aboutRes.data.success) {
                    const d = aboutRes.data.data;
                    setAbout(Array.isArray(d) ? d[0] : d);
                }
                if (programsRes.data.success) setPrograms(programsRes.data.data.programs);
                if (blogsRes.data.success) setBlogs(blogsRes.data.data.blogs);
            } catch (error) {
                console.error('Failed to fetch homepage data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomeData();
    }, []);

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [slides]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    if (loading) return (
        <div className="h-screen bg-dark flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-dark">
            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden bg-black">
                {slides.length > 0 ? (
                    <div className="relative h-full w-full">
                        {slides.map((slide, index) => (
                            <div
                                key={slide.id}
                                className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${index === currentSlide ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-105 invisible'
                                    }`}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={getMediaPath(slide.image)}
                                        alt={slide.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 cinematic-overlay" />
                                </div>

                                {/* Content */}
                                <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
                                    <div className={`transition-all duration-1000 delay-300 transform ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                        }`}>
                                        <p className="text-gold font-bold tracking-[0.5em] uppercase text-[10px] md:text-sm mb-6 drop-shadow-lg opacity-80">
                                            {slide.subtitle || 'Heritage & Discipline'}
                                        </p>
                                        <h1 className="text-5xl md:text-8xl lg:text-[7vw] font-playfair font-black text-white text-glow mb-10 leading-[0.85] max-w-6xl mx-auto uppercase italic letter-spacing-hero">
                                            {slide.title}
                                        </h1>
                                        {slide.buttonText && (
                                            <Link
                                                to={slide.buttonLink || '/programs'}
                                                className="group relative inline-flex items-center space-x-4 bg-primary px-8 py-5 rounded-2xl text-white font-black tracking-widest uppercase text-sm hover:bg-gold transition-all duration-500 shadow-2xl active:scale-95 overflow-hidden"
                                            >
                                                <span className="relative z-10">{slide.buttonText}</span>
                                                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Navigation Arrows */}
                        {slides.length > 1 && (
                            <>
                                <button
                                    onClick={prevSlide}
                                    className="absolute left-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full glass-gold text-white hover:bg-gold hover:text-black transition-all active:scale-95"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={nextSlide}
                                    className="absolute right-8 top-1/2 -translate-y-1/2 z-30 p-4 rounded-full glass-gold text-white hover:bg-gold hover:text-black transition-all active:scale-95"
                                >
                                    <ChevronRight size={24} />
                                </button>

                                {/* Progress Indicators */}
                                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
                                    {slides.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`h-1 transition-all duration-500 rounded-full ${index === currentSlide ? 'w-12 bg-gold shadow-[0_0_10px_rgba(201,162,77,0.8)]' : 'w-6 bg-white/20 hover:bg-white/40'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="h-full w-full flex items-center justify-center px-6 text-center">
                        <div>
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white text-glow mb-6 leading-none uppercase letter-spacing-hero">Kigali <span className="text-primary italic">Shaolin</span></h1>
                            <p className="text-gold text-sm md:text-xl font-bold tracking-[0.5em] uppercase opacity-80">Heritage & Discipline</p>
                        </div>
                    </div>
                )}
            </section>

            {/* Mission Section (About Preview) */}
            {about && (
                <section className="py-32 relative overflow-hidden bg-dark">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl group-hover:bg-primary/30 transition-all duration-700" />
                            <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-luxury aspect-[4/5]">
                                <img
                                    src={getMediaPath(about.image)}
                                    alt="Temple Heritage"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60" />
                            </div>
                            <div className="absolute -bottom-8 -right-8 glass-gold p-8 rounded-[2rem] shadow-luxury max-w-xs hidden md:block border-gold/40">
                                <p className="text-gold font-playfair italic text-xl leading-relaxed">
                                    "{about.content?.substring(0, 100)}..."
                                </p>
                                <div className="flex items-center space-x-4 mt-6">
                                    <div className="w-8 h-px bg-gold/40" />
                                    <p className="text-white font-black uppercase tracking-widest text-[10px]">{about.founder_name}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="text-gold font-bold tracking-[0.4em] uppercase text-xs mb-4">Our Heritage</p>
                            <h2 className="text-5xl md:text-7xl font-playfair font-black text-white mb-8 leading-tight italic">
                                Shaolin <span className="text-primary italic">Heritage</span> in Rwanda
                            </h2>
                            <div className="space-y-6 text-white/50 font-medium text-lg leading-relaxed mb-10">
                                <p>{about.content?.substring(0, 400)}...</p>
                            </div>
                            <Link
                                to="/about"
                                className="group inline-flex items-center space-x-3 text-gold font-black uppercase tracking-widest text-sm hover:text-white transition-colors"
                            >
                                <span>Learn More About Us</span>
                                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Programs */}
            {programs.length > 0 && (
                <section className="py-32 bg-black/40">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <p className="text-gold font-bold tracking-[0.4em] uppercase text-xs mb-4">Training Programs</p>
                            <h2 className="text-5xl md:text-7xl font-playfair font-black text-white italic">Our <span className="text-primary italic">Programs</span></h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {programs.map((program) => (
                                <Link
                                    key={program.id}
                                    to="/programs"
                                    className="group relative h-[550px] rounded-[3rem] overflow-hidden border border-white/5 shadow-luxury card-lift"
                                >
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src={getMediaPath(program.image)}
                                            alt={program.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-all duration-500 group-hover:via-primary/20" />
                                    </div>
                                    <div className="absolute inset-0 z-10 p-10 flex flex-col justify-end">
                                        <h3 className="text-3xl font-playfair font-black text-white mb-4 group-hover:text-gold transition-colors italic">
                                            {program.name}
                                        </h3>
                                        <p className="text-white/60 text-sm font-medium line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                            {program.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-16">
                            <Link
                                to="/programs"
                                className="inline-flex items-center space-x-4 px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all"
                            >
                                <span>View All Programs</span>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Latest Wisdom (Blog Preview) */}
            {blogs.length > 0 && (
                <section className="py-32 bg-dark">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 space-y-6 md:space-y-0">
                            <div>
                                <p className="text-gold font-bold tracking-[0.4em] uppercase text-xs mb-4">Latest Articles</p>
                                <h2 className="text-5xl md:text-7xl font-playfair font-black text-white italic">Temple <span className="text-primary italic">Blog</span></h2>
                            </div>
                            <Link
                                to="/blog"
                                className="group flex items-center space-x-3 text-white font-black uppercase tracking-widest text-sm hover:text-gold transition-all"
                            >
                                <span>Read More Articles</span>
                                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Featured Blog (Large) */}
                            {blogs[0] && (
                                <Link to={`/blog/${blogs[0].id}`} className="group relative h-[600px] lg:h-full rounded-[3rem] overflow-hidden border border-white/10 shadow-luxury card-lift">
                                    <img src={getMediaPath(blogs[0].image)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent" />
                                    <div className="absolute inset-0 p-12 flex flex-col justify-end">
                                        <span className="bg-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-6 w-fit">{blogs[0].category}</span>
                                        <h3 className="text-4xl md:text-5xl font-playfair font-black text-white mb-4 group-hover:text-gold transition-colors italic leading-tight">{blogs[0].title}</h3>
                                        <p className="text-white/60 text-lg line-clamp-2 max-w-xl">{blogs[0].content?.replace(/<[^>]*>/g, '').substring(0, 150)}...</p>
                                    </div>
                                </Link>
                            )}

                            {/* Blog List (Stacked) */}
                            <div className="flex flex-col space-y-8">
                                {blogs.slice(1, 3).map((blog) => (
                                    <Link key={blog.id} to={`/blog/${blog.id}`} className="group flex space-x-8 bg-white/[0.03] p-8 rounded-[3rem] border border-white/5 hover:border-gold/20 transition-all card-lift">
                                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden shrink-0">
                                            <img src={getMediaPath(blog.image)} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <span className="text-gold font-black uppercase tracking-widest text-[9px] mb-2">{blog.category}</span>
                                            <h3 className="text-xl md:text-2xl font-playfair font-black text-white group-hover:text-gold transition-colors italic leading-tight mb-3">{blog.title}</h3>
                                            <p className="text-white/40 text-sm line-clamp-2">{blog.content?.replace(/<[^>]*>/g, '').substring(0, 100)}...</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Seek Guidance (Contact CTA) */}
            <section className="py-40 relative group overflow-hidden">
                <div className="absolute inset-0 bg-primary opacity-5 group-hover:opacity-10 transition-opacity duration-1000" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <p className="text-gold font-bold tracking-[0.5em] uppercase text-sm mb-6">Join Us Today</p>
                    <h2 className="text-6xl md:text-8xl font-playfair font-black text-white mb-10 leading-none italic">Contact <span className="text-primary italic">Us</span></h2>
                    <p className="text-white/60 text-xl font-medium mb-12 max-w-2xl mx-auto">Get in touch with us to start your training or learn more about our heritage programs.</p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center space-x-6 bg-white text-dark px-12 py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm hover:bg-gold hover:text-white transition-all transform hover:-translate-y-2 shadow-luxury"
                    >
                        <span>Get In Touch</span>
                        <ArrowRight size={20} />
                    </Link>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 blur-[150px] rounded-full translate-x-1/2 translate-y-1/2" />
            </section>
        </div>
    );
};

export default HomePage;
