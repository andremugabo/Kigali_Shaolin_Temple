import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog, updateBlog } from '../../store/slices/blogSlice';
import { Button, Input } from '../../components/Shared';
import { Send, Save, X, Image as ImageIcon, Type, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const BlogForm = ({ blog, onClose }) => {
    const dispatch = useDispatch();
    const { submitting } = useSelector((state) => state.blogs);
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Philosophy',
        published: true,
        userId: user?.id || '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (blog) {
            setFormData({
                title: blog.title || '',
                content: blog.content || '',
                category: blog.category || 'Philosophy',
                published: blog.published !== undefined ? blog.published : true,
                userId: blog.userId || user?.id || '',
            });
            if (blog.image) {
                setImagePreview(blog.image);
            }
        }
    }, [blog, user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        if (imageFile) {
            data.append('image', imageFile);
        }

        let resultAction;
        if (blog) {
            resultAction = await dispatch(updateBlog({ id: blog.id, formData: data }));
        } else {
            resultAction = await dispatch(createBlog(data));
        }

        if (createBlog.fulfilled.match(resultAction) || updateBlog.fulfilled.match(resultAction)) {
            toast.success(blog ? 'Wisdom refined successfully' : 'New wisdom manifested');
            onClose();
        } else {
            toast.error(resultAction.payload || 'The manifestation failed. Try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <Input
                        label="Title of Wisdom"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., The Flow of Qi in Daily Practice"
                        icon={Type}
                        required
                    />

                    <div className="relative group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                            Category
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold uppercase tracking-widest text-gray-700 appearance-none shadow-sm"
                        >
                            <option value="Philosophy">Philosophy</option>
                            <option value="Technique">Technique</option>
                            <option value="History">History</option>
                            <option value="Events">Events</option>
                        </select>
                        <div className="absolute right-4 bottom-3.5 pointer-events-none text-gray-400">
                            <Save size={16} className="rotate-90" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-gray-200 rounded-full cursor-pointer focus-within:ring-2 focus-within:ring-primary/50">
                            <input
                                type="checkbox"
                                name="published"
                                checked={formData.published}
                                onChange={handleChange}
                                className="absolute w-6 h-6 opacity-0 cursor-pointer z-10"
                            />
                            <div className={`w-6 h-6 transition-transform duration-200 ease-in-out transform bg-white rounded-full border border-gray-300 ${formData.published ? 'translate-x-6 border-primary bg-primary' : ''}`}></div>
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-800 uppercase tracking-wider">Public Visibility</p>
                            <p className="text-[10px] text-gray-500 font-medium">Manifest this wisdom to the entire world instantly.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                        Visual Manifestation (Image)
                    </label>
                    <div
                        className={`relative group border-2 border-dashed rounded-[2rem] h-64 flex flex-col items-center justify-center transition-all ${imagePreview ? 'border-primary/50 bg-primary/5' : 'border-gray-200 hover:border-gray-400 bg-gray-50/50'
                            }`}
                    >
                        {imagePreview ? (
                            <div className="w-full h-full p-3">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-[1.5rem] shadow-lg border border-white/20" />
                                <button
                                    type="button"
                                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                                    className="absolute top-6 right-6 p-2 bg-red-500 text-white rounded-xl shadow-xl hover:bg-red-600 transition-all active:scale-95"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="p-5 bg-white rounded-3xl shadow-sm border border-gray-100 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                    <ImageIcon size={36} className="text-gray-300" />
                                </div>
                                <p className="text-sm font-bold text-gray-500">Drop scroll visual or <span className="text-primary">select</span></p>
                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">JPG, PNG or WEBP (max 5MB)</p>
                            </>
                        )}
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            accept="image/*"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                    Manuscript Content
                </label>
                <div className="relative group">
                    <div className="absolute left-4 top-4 text-gray-300 group-focus-within:text-primary transition-colors">
                        <FileText size={20} />
                    </div>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows="8"
                        className="w-full bg-white border border-gray-200 rounded-[2rem] py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium min-h-[200px] shadow-inner"
                        placeholder="Inscribe the depths of your wisdom here..."
                        required
                    ></textarea>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-50 bg-gray-50/10 -mx-6 -mb-6 p-6 rounded-b-[2.5rem]">
                <Button
                    type="submit"
                    loading={submitting}
                    icon={blog ? CheckCircle2 : Send}
                    className="shadow-2xl shadow-primary/20 w-full sm:w-auto"
                >
                    {blog ? 'Inscribe Refinement' : 'Inscribe Manifestation'}
                </Button>
            </div>
        </form>
    );
};

export default BlogForm;
