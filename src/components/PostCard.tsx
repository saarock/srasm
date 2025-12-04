import React from 'react';
import { Clock, Eye, Heart, Calendar, Tag } from 'lucide-react';
import type { PostCardProps } from '../types/blog.types';

const PostCard: React.FC<PostCardProps> = ({ post, onClick, viewMode }) => {
    if (viewMode === 'list') {
        return (
            <div
                onClick={onClick}
                className="bg-[#1D1D1D] rounded-xl border border-[#2A2A2A] hover:border-[#00E6E6] transition-all cursor-pointer p-4 flex gap-4 group"
            >
                {/* Featured Image */}
                <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-[#181818]">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                        <span
                            className="text-xs px-2 py-1 rounded-md font-medium"
                            style={{ backgroundColor: `${post.categoryId === '1' ? '#00E6E6' : post.categoryId === '2' ? '#3178C6' : post.categoryId === '3' ? '#FF6B6B' : '#51CF66'}20`, color: post.categoryId === '1' ? '#00E6E6' : post.categoryId === '2' ? '#3178C6' : post.categoryId === '3' ? '#FF6B6B' : '#51CF66' }}
                        >
                            {post.category}
                        </span>
                        <span className="text-xs text-[#666]">•</span>
                        <span className="text-xs text-[#666] flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#E0E0E0] mb-2 group-hover:text-[#00E6E6] transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    <p className="text-sm text-[#999] mb-3 line-clamp-2">{post.excerpt}</p>

                    <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm text-[#CCC]">by {post.author}</span>
                        <div className="flex items-center gap-4 text-xs text-[#666]">
                            <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {post.readTime} min
                            </span>
                            <span className="flex items-center gap-1">
                                <Eye size={14} />
                                {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                                <Heart size={14} />
                                {post.likes}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Grid view
    return (
        <div
            onClick={onClick}
            className="bg-[#1D1D1D] rounded-xl border border-[#2A2A2A] hover:border-[#00E6E6] transition-all cursor-pointer overflow-hidden group"
        >
            {/* Featured Image */}
            <div className="h-48 overflow-hidden bg-[#181818]">
                <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                    <span
                        className="text-xs px-2.5 py-1 rounded-md font-medium"
                        style={{ backgroundColor: `${post.categoryId === '1' ? '#00E6E6' : post.categoryId === '2' ? '#3178C6' : post.categoryId === '3' ? '#FF6B6B' : '#51CF66'}20`, color: post.categoryId === '1' ? '#00E6E6' : post.categoryId === '2' ? '#3178C6' : post.categoryId === '3' ? '#FF6B6B' : '#51CF66' }}
                    >
                        {post.category}
                    </span>
                    <span className="text-xs text-[#666]">•</span>
                    <span className="text-xs text-[#666] flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-[#E0E0E0] mb-2 group-hover:text-[#00E6E6] transition-colors line-clamp-2">
                    {post.title}
                </h3>

                <p className="text-sm text-[#999] mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex items-center justify-between pt-3 border-t border-[#2A2A2A]">
                    <span className="text-sm text-[#CCC]">by {post.author}</span>
                    <div className="flex items-center gap-3 text-xs text-[#666]">
                        <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {post.readTime} min
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart size={14} />
                            {post.likes}
                        </span>
                    </div>
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs px-2 py-1 bg-[#181818] text-[#999] rounded-md flex items-center gap-1"
                            >
                                <Tag size={10} />
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostCard;
