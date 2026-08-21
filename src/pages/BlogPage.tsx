import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Search, ArrowRight } from 'lucide-react';
import { IBlogPost } from '../types';
import { blogService } from '../services/api';
import { BlogCard } from '../components/common/BlogCard';

interface BlogPageProps {
  navigate: (route: string, params?: Record<string, any>) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ navigate }) => {
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const categories = ['All', 'Market Trends', 'Investment Advisory', 'Architecture & Design', 'Legal & Tax Framework'];

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      try {
        const res = await blogService.getPosts(selectedCategory);
        if (res.success) {
          setPosts(res.posts);
        }
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, [selectedCategory]);

  const filteredPosts = posts.filter(p => {
    if (!searchQuery.trim()) return true;
    return (
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-10">
      
      {/* Header Banner */}
      <div className="bg-white border border-black/10 p-8 sm:p-12 shadow-sm">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDFCF9] border border-black/10 text-[#B5945E] text-[10px] font-bold uppercase tracking-widest">
            <BookOpen className="w-3 h-3 text-[#B5945E]" />
            Growth Realtors Journal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
            Market Intelligence & Wealth Perspectives
          </h1>
          <p className="text-xs sm:text-sm text-black/60 leading-relaxed font-light">
            In-depth analysis of Pakistan’s luxury residential indices, Roshan Digital Account regulations, architecture showcases, and tax structuring.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white border border-black/10">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-[#FDFCF9] text-black/60 hover:text-black border border-black/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-black/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles & analysis..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs placeholder-black/40 focus:outline-none focus:border-[#B5945E]"
          />
        </div>
      </div>

      {/* Blog Posts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 bg-black/5 animate-pulse border border-black/5" />
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              onSelect={(p) => navigate('blog-post', { slug: p.slug })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-black/10 p-8 space-y-3">
          <BookOpen className="w-8 h-8 text-[#B5945E] mx-auto opacity-50" />
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">No Articles Found</h3>
          <p className="text-xs text-black/60">Try selecting another category or refining your search term.</p>
        </div>
      )}
    </div>
  );
};
