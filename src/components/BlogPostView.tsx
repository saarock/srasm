import React, { useState } from 'react';
import { ArrowLeft, Clock, Eye, Heart, Calendar, Tag, Twitter, Github, Linkedin } from 'lucide-react';
import type { BlogPostViewProps } from '../types';
import CommentSection from './CommentSection';
import ReactMarkdown from 'react-markdown';

const BlogPostView: React.FC<BlogPostViewProps> = ({
    post,
    author,
    comments,
    relatedPosts,
    onBack,
    onAddComment,
    onLikeComment,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentPreviewLength = 1000;
    const shouldShowReadMore = post.content.length > contentPreviewLength;

    const displayContent = isExpanded || !shouldShowReadMore
        ? post.content
        : post.content.slice(0, contentPreviewLength) + '...';

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Header */}
            <div className="bg-[#181818] border-b border-[#2A2A2A] sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-[#00E6E6] hover:text-[#00CCCC] transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Blog</span>
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Post Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span
                            className="text-sm px-3 py-1.5 rounded-lg font-medium"
                            style={{ backgroundColor: `${post.categoryId === '1' ? '#00E6E6' : post.categoryId === '2' ? '#3178C6' : post.categoryId === '3' ? '#FF6B6B' : '#51CF66'}20`, color: post.categoryId === '1' ? '#00E6E6' : post.categoryId === '2' ? '#3178C6' : post.categoryId === '3' ? '#FF6B6B' : '#51CF66' }}
                        >
                            {post.category}
                        </span>
                        <span className="text-sm text-[#666]">•</span>
                        <span className="text-sm text-[#666] flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-[#E0E0E0] mb-4 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-6 text-sm text-[#999]">
                        <span className="flex items-center gap-1.5">
                            <Clock size={16} />
                            {post.readTime} min read
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Eye size={16} />
                            {post.views} views
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Heart size={16} />
                            {post.likes} likes
                        </span>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="mb-8 rounded-2xl overflow-hidden">
                    <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-[400px] object-cover"
                    />
                </div>

                {/* Post Content */}
                <div className="bg-[#1D1D1D] rounded-2xl p-8 border border-[#2A2A2A] mb-8">
                    <div className="prose prose-invert max-w-none">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-[#E0E0E0] mb-4 mt-8" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-[#E0E0E0] mb-3 mt-6" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-bold text-[#E0E0E0] mb-2 mt-4" {...props} />,
                                p: ({ node, ...props }) => <p className="text-[#CCC] mb-4 leading-relaxed" {...props} />,
                                code: ({ node, inline, ...props }: any) =>
                                    inline ? (
                                        <code className="bg-[#181818] text-[#00E6E6] px-1.5 py-0.5 rounded text-sm" {...props} />
                                    ) : (
                                        <code className="block bg-[#181818] text-[#E0E0E0] p-4 rounded-lg overflow-x-auto my-4 text-sm" {...props} />
                                    ),
                                ul: ({ node, ...props }) => <ul className="list-disc list-inside text-[#CCC] mb-4 space-y-2" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-[#CCC] mb-4 space-y-2" {...props} />,
                                li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                            }}
                        >
                            {displayContent}
                        </ReactMarkdown>
                    </div>

                    {/* Read More/Less Button */}
                    {shouldShowReadMore && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="px-6 py-3 bg-[#00E6E6] text-[#001F1F] rounded-xl font-medium hover:bg-[#00CCCC] transition-all"
                            >
                                {isExpanded ? 'Read Less' : 'Read More'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-[#E0E0E0] uppercase tracking-wide mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 bg-[#1D1D1D] text-[#CCC] rounded-lg border border-[#2A2A2A] text-sm flex items-center gap-1.5 hover:border-[#00E6E6] transition-colors"
                                >
                                    <Tag size={14} />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Author Card */}
                <div className="bg-[#1D1D1D] rounded-2xl p-6 border border-[#2A2A2A] mb-8">
                    <h3 className="text-sm font-bold text-[#E0E0E0] uppercase tracking-wide mb-4">About the Author</h3>
                    <div className="flex gap-4">
                        <img
                            src={author.avatar}
                            alt={author.name}
                            className="w-20 h-20 rounded-full border-2 border-[#00E6E6]"
                        />
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-[#E0E0E0] mb-1">{author.name}</h4>
                            <p className="text-sm text-[#00E6E6] mb-2">{author.role}</p>
                            <p className="text-sm text-[#999] mb-3">{author.bio}</p>
                            <div className="flex gap-3">
                                {author.socialLinks.twitter && (
                                    <a
                                        href={author.socialLinks.twitter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#666] hover:text-[#00E6E6] transition-colors"
                                    >
                                        <Twitter size={18} />
                                    </a>
                                )}
                                {author.socialLinks.github && (
                                    <a
                                        href={author.socialLinks.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#666] hover:text-[#00E6E6] transition-colors"
                                    >
                                        <Github size={18} />
                                    </a>
                                )}
                                {author.socialLinks.linkedin && (
                                    <a
                                        href={author.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#666] hover:text-[#00E6E6] transition-colors"
                                    >
                                        <Linkedin size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-[#E0E0E0] mb-4">Related Posts</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {relatedPosts.map((relatedPost) => (
                                <div
                                    key={relatedPost.id}
                                    className="bg-[#1D1D1D] rounded-xl p-4 border border-[#2A2A2A] hover:border-[#00E6E6] transition-all cursor-pointer"
                                >
                                    <h4 className="text-sm font-bold text-[#E0E0E0] mb-2 line-clamp-2">
                                        {relatedPost.title}
                                    </h4>
                                    <p className="text-xs text-[#999] line-clamp-2">{relatedPost.excerpt}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comments */}
                <CommentSection
                    comments={comments}
                    onAddComment={onAddComment}
                    onLikeComment={onLikeComment}
                />
            </div>
        </div>
    );
};

export default BlogPostView;
