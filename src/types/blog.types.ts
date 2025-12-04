/**
 * Blog-related type definitions
 */

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  authorId: string;
  date: string;
  category: string;
  categoryId: string;
  tags: string[];
  featuredImage: string;
  readTime: number;
  likes: number;
  views: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  postCount: number;
  color: string;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  role: string;
  socialLinks: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
  likes: number;
}

export interface BlogSidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export interface PostCardProps {
  post: BlogPost;
  onClick: () => void;
  viewMode: 'grid' | 'list';
}

export interface BlogPostViewProps {
  post: BlogPost;
  author: Author;
  comments: Comment[];
  relatedPosts: BlogPost[];
  onBack: () => void;
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: string) => void;
}

export interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: string) => void;
}
