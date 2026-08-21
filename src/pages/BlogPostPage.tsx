import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, ArrowLeft, Share2, Tag, ArrowRight } from 'lucide-react';
import { IBlogPost } from '../types';
import { blogService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { BlogCard } from '../components/common/BlogCard';

interface BlogPostPageProps {
  slug: string;
  navigate: (route: string, params?: Record<string, any>) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, navigate }) => {
  const { info } = useToast();
  const [post, setPost] = useState<IBlogPost | null>(null);
  const [related, setRelated] = useState<IBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadPost() {
      setIsLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        const res = await blogService.getPost(slug);
        if (res.success && res.post) {
          setPost(res.post);
          setRelated(res.related || []);
        }
      } catch (err) {
        console.error('Failed to load article:', err);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      info('Article link copied to clipboard.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#B5945E] border-t-transparent animate-spin mx-auto" />
        <p className="text-black/60 font-serif">Loading Market Intelligence Article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Article Not Found</h2>
        <button
          onClick={() => navigate('blog')}
          className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider transition-colors"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-8">
      
      {/* Back Button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('blog')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-black/60 hover:text-[#B5945E] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-black/10 text-xs font-semibold text-black/70 hover:text-black transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Article</span>
        </button>
      </div>

      {/* Article Title & Meta */}
      <div className="space-y-4">
        <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-white text-[#B5945E] border border-black/10 inline-block">
          {post.category}
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1A1A1A] leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-black/60 pt-2 border-t border-black/10">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-black/10"
            />
            <div>
              <span className="font-semibold text-[#1A1A1A] block">{post.author.name}</span>
              <span className="text-[10px] text-black/50">{post.author.role}</span>
            </div>
          </div>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#B5945E]" />
            {formattedDate}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#B5945E]" />
            {post.readTime}
          </span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="aspect-[16/9] overflow-hidden bg-black/5 border border-black/10 shadow-sm">
        <img
          src={post.featuredImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="max-w-none text-black/80 leading-relaxed text-sm sm:text-base space-y-6">
        <p className="text-base sm:text-lg font-normal text-black/90 leading-relaxed italic border-l-2 border-[#B5945E] pl-4 bg-black/[0.02] py-2">
          {post.excerpt}
        </p>

        {post.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="pt-6 border-t border-black/10 flex flex-wrap items-center gap-2">
          <span className="text-xs text-black/60 mr-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#B5945E]" />
            Topics:
          </span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-white border border-black/10 text-xs text-black/70 font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="pt-10 border-t border-black/10 space-y-6">
          <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Related Intelligence Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((relPost) => (
              <BlogCard
                key={relPost.id}
                post={relPost}
                onSelect={(p) => navigate('blog-post', { slug: p.slug })}
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
};
