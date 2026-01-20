import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTutorial, removeTutorial } from '../../store/slices/clubSlice';
import { Button, Input } from '../../components/Shared';
import { Video, Trash2, Plus, Play, Info, Type, FileText, X } from 'lucide-react';
import { toast } from 'react-toastify';

const TutorialManagement = ({ club, onClose }) => {
    const dispatch = useDispatch();
    const tutorials = useSelector((state) => state.clubs.tutorials[club?.id] || []);
    const { submitting } = useSelector((state) => state.clubs);

    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [videoFile, setVideoFile] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleVideoChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile) {
            toast.error('Please select a video file');
            return;
        }

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('video', videoFile);

        const resultAction = await dispatch(addTutorial({ clubId: club.id, formData: data }));
        if (addTutorial.fulfilled.match(resultAction)) {
            toast.success('Tutorial added to the archives');
            setIsAdding(false);
            setFormData({ title: '', description: '' });
            setVideoFile(null);
        } else {
            toast.error(resultAction.payload || 'Failed to archive tutorial');
        }
    };

    const handleRemove = async (tutorialId) => {
        if (window.confirm('Remove this tutorial from the archives?')) {
            const resultAction = await dispatch(removeTutorial({ clubId: club.id, tutorialId }));
            if (removeTutorial.fulfilled.match(resultAction)) {
                toast.success('Tutorial removed');
            } else {
                toast.error(resultAction.payload || 'Removal failed');
            }
        }
    };

    return (
        <div className="space-y-8 min-h-[500px]">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Sacred Knowledge Base</p>
                    <h4 className="text-xl font-black text-gray-900 lowercase tracking-tight">Active Manuscripts</h4>
                </div>
                <Button
                    variant={isAdding ? 'ghost' : 'outline'}
                    onClick={() => setIsAdding(!isAdding)}
                    icon={isAdding ? X : Plus}
                    size="sm"
                >
                    {isAdding ? 'Withdraw' : 'Annex Tutorial'}
                </Button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 shadow-inner animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <Input
                                label="Tutorial Title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                icon={Type}
                                placeholder="e.g., Fundamentals of Qi-Gong"
                                required
                            />
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">
                                    Description
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-4 text-gray-300 group-focus-within:text-primary transition-colors">
                                        <FileText size={20} />
                                    </div>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium min-h-[100px] shadow-sm"
                                        placeholder="Elucidate the core concepts..."
                                        required
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 ml-1">
                                Video Transmission
                            </label>
                            <div className={`relative group border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all ${videoFile ? 'border-primary/50 bg-primary/5' : 'border-gray-200 hover:border-gray-400 bg-white shadow-sm'
                                }`}>
                                <div className={`p-4 rounded-2xl mb-4 transition-transform group-hover:scale-110 ${videoFile ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <Video size={32} />
                                </div>
                                {videoFile ? (
                                    <div className="text-center">
                                        <p className="text-sm font-black text-gray-900 truncate max-w-[200px]">{videoFile.name}</p>
                                        <p className="text-[10px] text-primary font-bold mt-1">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB Ready</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm font-bold text-gray-500 text-center">Inscribe video file or <span className="text-primary">select</span></p>
                                        <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">MP4, MOV, WEBM (Limit: 100MB)</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    onChange={handleVideoChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    accept="video/*"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end mt-8">
                        <Button type="submit" loading={submitting} icon={Plus}>Synchronize Tutorial</Button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutorials.length > 0 ? (
                    tutorials.map((tutorial) => (
                        <div key={tutorial.id} className="group bg-white rounded-3xl border border-gray-100 p-5 hover:shadow-xl hover:shadow-gray-200/40 transition-all flex flex-col justify-between">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-primary shadow-lg group-hover:rotate-6 transition-transform">
                                        <Play size={20} fill="currentColor" />
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors lowercase tracking-tight">{tutorial.title}</h5>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Video Component</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRemove(tutorial.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed h-10 mb-4">{tutorial.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex items-center space-x-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <Info size={12} />
                                    <span>Tutorial ID: {tutorial.id.substring(0, 8)}</span>
                                </div>
                                <a
                                    href={tutorial.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center"
                                >
                                    Watch Transmission <Play size={10} className="ml-1" fill="currentColor" />
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center">
                        <div className="p-5 bg-white rounded-full shadow-sm border border-gray-100 mb-6 text-gray-200">
                            <Video size={48} />
                        </div>
                        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">Knowledge Base Empty</p>
                        <p className="text-gray-400 text-xs mt-2 italic">Seek the wisdom to annex new tutorials.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorialManagement;
