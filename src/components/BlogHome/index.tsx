import React, { useMemo } from "react";
import { useSRASM } from "../../srsm";
import { Search, Grid, List } from "lucide-react";
import BlogSidebar from "../BlogSidebar";
import PostCard from "../PostCard";
import BlogPostView from "../BlogPostView";

const BlogHome: React.FC = () => {
    const { state, setState } = useSRASM("blog");

    
    if (!state) {
        return <div>Loading...</div>;
    }

    const {
        posts,
        categories,
        authors,
        comments,
        selectedPostId,
        selectedCategoryId,
        searchQuery,
        viewMode,
    } = state;


    // Filtered posts based on category and search
    const filteredPosts = useMemo(() => {
        if (!posts) return [];

        let filtered = posts;

        // Filter by category
        if (selectedCategoryId) {
            filtered = filtered.filter(
                (post) => post.categoryId === selectedCategoryId
            );
        }

        // Filter by search query
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (post) =>
                    post.title.toLowerCase().includes(query) ||
                    post.excerpt.toLowerCase().includes(query) ||
                    post.tags.some((tag) => tag.toLowerCase().includes(query))
            );
        }

        return filtered;
    }, [posts, selectedCategoryId, searchQuery]);

    const selectedPost = useMemo(() => {
        if (!selectedPostId || !posts) return null;
        return posts.find((p) => p.id === selectedPostId) || null;
    }, [selectedPostId, posts]);

    const selectedAuthor = useMemo(() => {
        if (!selectedPost || !authors) return null;
        return authors.find((a) => a.id === selectedPost.authorId) || null;
    }, [selectedPost, authors]);

    const postComments = useMemo(() => {
        if (!selectedPostId || !comments) return [];
        return comments.filter((c) => c.postId === selectedPostId);
    }, [selectedPostId, comments]);

    const relatedPosts = useMemo(() => {
        if (!selectedPost || !posts) return [];
        return posts
            .filter(
                (p) =>
                    p.id !== selectedPost.id && p.categoryId === selectedPost.categoryId
            )
            .slice(0, 3);
    }, [selectedPost, posts]);

    const handleCategorySelect = (categoryId: string | null) => {
        setState({ selectedCategoryId: categoryId });
    };

    const handleSearchChange = (query: string) => {
        setState({ searchQuery: query });
    };

    const handleViewModeChange = (mode: "grid" | "list") => {
        setState({ viewMode: mode });
    };

    const handlePostClick = (postId: string) => {
        setState({ selectedPostId: postId });
    };

    const handleBack = () => {
        setState({ selectedPostId: null });
    };

    const handleAddComment = (content: string) => {
        if (!selectedPostId || !comments) return;

        const newComment = {
            id: Date.now().toString(),
            postId: selectedPostId,
            author: "Anonymous User",
            content,
            date: new Date().toISOString().split("T")[0],
            likes: 0,
        };

        setState({ comments: [...comments, newComment] });
    };

    const handleLikeComment = (commentId: string) => {
        if (!comments) return;

        const updatedComments = comments.map((c) =>
            c.id === commentId ? { ...c, likes: c.likes + 1 } : c
        );

        setState({ comments: updatedComments });
    };

    // Show individual post view
    if (selectedPost && selectedAuthor) {
        return (
            <BlogPostView
                post={selectedPost}
                author={selectedAuthor}
                comments={postComments}
                relatedPosts={relatedPosts}
                onBack={handleBack}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
            />
        );
    }

    // Show blog home with post listing
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#001F1F] to-[#0A0A0A] border-b border-[#2A2A2A] py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-5xl font-bold mb-4">
                        <span className="text-[#00E6E6]">Tech</span> Blog
                    </h1>
                    <p className="text-xl text-[#CCC] max-w-2xl">
                        Insights, tutorials, and best practices for modern web development
                    </p>
                </div>
            </div>



            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className="w-80 flex-shrink-0">
                        <BlogSidebar
                            categories={categories || []}
                            selectedCategoryId={selectedCategoryId || null}
                            onCategorySelect={handleCategorySelect}
                            searchQuery={searchQuery || ""}
                            onSearchChange={handleSearchChange}
                            viewMode={viewMode || "grid"}
                            onViewModeChange={handleViewModeChange}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search and View Mode */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-[#CCC]">
                                <Search size={20} className="text-[#00E6E6]" />
                                <span className="text-sm">
                                    {filteredPosts.length}{" "}
                                    {filteredPosts.length === 1 ? "post" : "posts"} found
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleViewModeChange("grid")}
                                    className={`p-2 rounded-lg transition-all ${viewMode === "grid"
                                        ? "bg-[#00E6E6] text-[#001F1F]"
                                        : "bg-[#1D1D1D] text-[#CCC] hover:bg-[#2A2A2A]"
                                        }`}
                                    title="Grid view"
                                >
                                    <Grid size={20} />
                                </button>
                                <button
                                    onClick={() => handleViewModeChange("list")}
                                    className={`p-2 rounded-lg transition-all ${viewMode === "list"
                                        ? "bg-[#00E6E6] text-[#001F1F]"
                                        : "bg-[#1D1D1D] text-[#CCC] hover:bg-[#2A2A2A]"
                                        }`}
                                    title="List view"
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Posts Grid/List */}
                        {filteredPosts.length === 0 ? (
                            <div className="text-center py-20 text-[#666]">
                                <Search size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-lg">No posts found</p>
                                <p className="text-sm mt-2">
                                    Try adjusting your filters or search query
                                </p>
                            </div>
                        ) : (
                            <div
                                className={
                                    viewMode === "grid"
                                        ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                                        : "flex flex-col gap-4"
                                }
                            >
                                {filteredPosts.map((post) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        onClick={() => handlePostClick(post.id)}
                                        viewMode={viewMode || "grid"}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogHome;
