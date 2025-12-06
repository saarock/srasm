import React, { useState } from 'react';
import { MessageSquare, Heart, Send, User } from 'lucide-react';
import type { CommentSectionProps } from '../types';

const CommentSection: React.FC<CommentSectionProps> = ({
    comments,
    onAddComment,
    onLikeComment,
}) => {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment);
            setNewComment('');
        }
    };

    return (
        <div className="bg-[#1D1D1D] rounded-2xl p-6 border border-[#2A2A2A]">
            <div className="flex items-center gap-2 mb-6 border-b border-[#2A2A2A] pb-4">
                <MessageSquare size={20} className="text-[#00E6E6]" />
                <h3 className="text-lg font-bold text-[#E0E0E0]">
                    Comments ({comments.length})
                </h3>
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="bg-[#181818] rounded-xl border border-[#2A2A2A] focus-within:border-[#00E6E6] transition-all">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="w-full bg-transparent text-[#E0E0E0] px-4 py-3 rounded-xl outline-none resize-none"
                        rows={3}
                    />
                    <div className="px-4 pb-3 flex justify-end">
                        <button
                            type="submit"
                            disabled={!newComment.trim()}
                            className="px-4 py-2 bg-[#00E6E6] text-[#001F1F] rounded-lg font-medium hover:bg-[#00CCCC] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send size={16} />
                            Post Comment
                        </button>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            {comments.length === 0 ? (
                <div className="text-center py-12 text-[#666]">
                    <MessageSquare size={48} className="mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No comments yet</p>
                    <p className="text-xs mt-1">Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-[#181818] rounded-xl p-4 border border-[#2A2A2A]"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                                    <User size={20} className="text-[#666]" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h4 className="text-sm font-bold text-[#E0E0E0]">{comment.author}</h4>
                                            <p className="text-xs text-[#666]">
                                                {new Date(comment.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => onLikeComment(comment.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A2A2A] hover:bg-[#333] transition-all text-sm group"
                                        >
                                            <Heart
                                                size={14}
                                                className={comment.likes > 0 ? 'fill-[#FF6B6B] text-[#FF6B6B]' : 'text-[#666] group-hover:text-[#FF6B6B]'}
                                            />
                                            <span className="text-[#CCC]">{comment.likes}</span>
                                        </button>
                                    </div>
                                    <p className="text-sm text-[#CCC] leading-relaxed">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentSection;
