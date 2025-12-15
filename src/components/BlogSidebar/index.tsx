import React from 'react';
import { Search, Tag, Grid, List, X } from 'lucide-react';
import type { BlogSidebarProps } from '../../types';

const BlogSidebar: React.FC<BlogSidebarProps> = ({
    categories,
    selectedCategoryId,
    onCategorySelect,
    searchQuery,
    onSearchChange,
    viewMode,
    onViewModeChange,
}) => {
    return (
        <div className="flex flex-col gap-6 sticky top-6">
            {/* Search */}
            <div className="bg-[#1D1D1D] rounded-2xl p-4 border border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-3 border-b border-[#2A2A2A] pb-2">
                    <Search size={18} className="text-[#00E6E6]" />
                    <h3 className="text-sm font-bold text-[#E0E0E0] uppercase tracking-wide">
                        Search
                    </h3>
                </div>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search posts..."
                        className="w-full bg-[#181818] text-[#E0E0E0] px-4 py-2.5 pr-10 rounded-xl border border-[#2A2A2A] focus:border-[#00E6E6] focus:ring-1 focus:ring-[#00E6E6] transition-all outline-none text-sm"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666] hover:text-[#00E6E6] transition-colors"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Categories */}
            <div className="bg-[#1D1D1D] rounded-2xl p-4 border border-[#2A2A2A]">
                <div className="flex items-center gap-2 mb-3 border-b border-[#2A2A2A] pb-2">
                    <Tag size={18} className="text-[#00E6E6]" />
                    <h3 className="text-sm font-bold text-[#E0E0E0] uppercase tracking-wide">
                        Categories
                    </h3>
                </div>
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => onCategorySelect(null)}
                            className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between group ${selectedCategoryId === null
                                ? 'bg-[#2A2A2A] border-[#333] text-[#00E6E6]'
                                : 'border-transparent hover:bg-[#2A2A2A] hover:border-[#333] text-[#CCC]'
                                }`}
                        >
                            <span className="text-sm font-medium">All Posts</span>
                            <span className="text-xs opacity-60">
                                {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
                            </span>
                        </button>
                    </li>
                    {categories.map((category) => (
                        <li key={category.id}>
                            <button
                                onClick={() => onCategorySelect(category.id)}
                                className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between group ${selectedCategoryId === category.id
                                    ? 'bg-[#2A2A2A] border-[#333]'
                                    : 'border-transparent hover:bg-[#2A2A2A] hover:border-[#333]'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-2 h-2 rounded-full transition-opacity"
                                        style={{
                                            backgroundColor: category.color,
                                            opacity: selectedCategoryId === category.id ? 1 : 0.5,
                                        }}
                                    />
                                    <span
                                        className={`text-sm font-medium ${selectedCategoryId === category.id ? 'text-[#E0E0E0]' : 'text-[#CCC]'
                                            }`}
                                    >
                                        {category.name}
                                    </span>
                                </div>
                                <span className="text-xs text-[#666]">{category.postCount}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* View Mode */}
            <div className="bg-[#1D1D1D] rounded-2xl p-4 border border-[#2A2A2A]">
                <h3 className="text-sm font-bold text-[#E0E0E0] uppercase tracking-wide mb-3 border-b border-[#2A2A2A] pb-2">
                    View Mode
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-all border ${viewMode === 'grid'
                            ? 'bg-[#00E6E6] text-[#001F1F] border-[#00E6E6]'
                            : 'bg-[#181818] text-[#CCC] border-[#2A2A2A] hover:bg-[#2A2A2A]'
                            }`}
                    >
                        <Grid size={16} />
                        <span className="text-sm font-medium">Grid</span>
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl transition-all border ${viewMode === 'list'
                            ? 'bg-[#00E6E6] text-[#001F1F] border-[#00E6E6]'
                            : 'bg-[#181818] text-[#CCC] border-[#2A2A2A] hover:bg-[#2A2A2A]'
                            }`}
                    >
                        <List size={16} />
                        <span className="text-sm font-medium">List</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogSidebar;
