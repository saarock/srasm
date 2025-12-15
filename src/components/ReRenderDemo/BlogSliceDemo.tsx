import React, { useRef, useEffect, memo } from "react";
import { useSRASM } from "../../srsm";
import { Heart, MessageCircle } from "lucide-react";
import type { BlogPost } from "../../types";

// Connected Post Card Component (Fetches its own data)
const ConnectedPostCard = memo(({ postId }: { postId: string }) => {
  // Each card subscribes to the WHOLE 'blog' slice
  const { state: post, setState } = useSRASM("blog", (p: { posts: BlogPost[] }) =>
    p.posts.find((p) => p.id === postId)
  );
  const { state: comments } = useSRASM("blog", (p: { comments: any[] }) => p.comments);

  useEffect(() => {
    // alert(JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    console.log(post);
  }, [post]);
  const renderCountRef = useRef(0);
  const highlightRef = useRef<HTMLDivElement>(null);

  renderCountRef.current++;

  // Visual flash on render
  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.style.backgroundColor = "#FFFFFF20";
      setTimeout(() => {
        if (highlightRef.current) {
          highlightRef.current.style.backgroundColor = "#1D1D1D";
        }
      }, 300);
    }
  });

  const handleLike = React.useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      posts: prevState.posts.map((p: BlogPost) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ),
    }));
  }, [postId, setState]);

  if (!post) return null;

  return (
    <div
      ref={highlightRef}
      className="p-4 rounded-xl border border-[#333] bg-[#1D1D1D] transition-colors duration-300 transform"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-white line-clamp-1" title={post.title}>
          {post.title}
        </h4>
        <span className="text-xs bg-[#2A2A2A] text-gray-400 px-2 py-1 rounded">
          Renders: {renderCountRef.current}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-4 line-clamp-2">{post.excerpt}</p>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 text-xs text-[#FF6B6B] hover:text-[#FF8787] transition-colors bg-[#FF6B6B10] px-2 py-1 rounded"
        >
          <Heart size={12} fill={post.likes > 0 ? "currentColor" : "none"} />
          {post.likes} Likes
        </button>
        <div className="flex items-center gap-1 text-xs text-[#00E6E6]">
          <MessageCircle size={12} />
          {post.id}
        </div>
      </div>
    </div>
  );
});

export const BlogSliceDemo: React.FC = () => {
  // We still need to know WHICH posts to render, so we likely need to fetch the IDs from the store or just hardcode some for the demo.
  // To match previous behavior of "first 3 posts", we should fetch the list of IDs.
  const { state } = useSRASM("blog");
  // const { posts } = state; // We will use this only to get IDs to render

  // We only take the first 3 posts for this demo
  // Note: This parent component will also re-render on any blog change,
  // re-rendering the list of ConnectedPostCards.
  // However, since ConnectedPostCard is also connected, it would re-render anyway.
  const demoPostIds = state.posts.slice(0, 3).map((p: BlogPost) => p.id);

  return (
    <div className="mt-12 pt-12 border-t border-[#333]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          <span className="text-[#eab308]">Intra-Slice</span> Optimization Demo
          (Connected Components)
        </h2>
        <p className="text-gray-400">
          Now each card fetches its own data using <code>useSRASM</code>{" "}
          directly.
          <br />
          <span className="text-yellow-500">
            Warning: Since they all subscribe to the same 'blog' slice, updating
            ONE post will cause ALL cards to re-render.
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {demoPostIds.map((postId:string) => (
          <ConnectedPostCard key={postId} postId={postId} />
        ))}
      </div>

      <div className="mt-4 p-3 bg-[#1A1A1A] border border-[#333] rounded text-sm text-gray-500">
        <p>
          Try clicking "Like" on one card. Observe that the "Renders" count
          increases for <strong>ALL</strong> cards because the slice reference
          changes.
        </p>
      </div>
    </div>
  );
};
