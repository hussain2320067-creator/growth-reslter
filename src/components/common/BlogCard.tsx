import React from 'react';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { IBlogPost } from '../../types';

interface BlogCardProps {
  post: IBlogPost;
  onSelect: (post: IBlogPost) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onSelect }) => {
  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <article
      id={`blog-card-${post.id}`}
      onClick={() => onSelect(post)}
      className="group bg-white border border-black/10 hover:border-[#B5945E]/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Featured Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE7E2]">
        <img
          src={post.featuredImage}
          alt={post.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-[8px] font-bold tracking-wider uppercase bg-[#1A1A1A] text-white">
            {post.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Meta (Date & Read Time) */}
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-black/50 mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#B5945E]" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#B5945E]" />
              {post.readTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-base font-bold text-[#1A1A1A] group-hover:text-[#B5945E] transition-colors line-clamp-2 mb-2 leading-snug">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs leading-relaxed text-black/60 line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        </div>

        {/* Author & Read More Footer */}
        <div className="pt-3.5 border-t border-black/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover border border-[#B5945E]/40"
              />
            ) : (
              <User className="w-3.5 h-3.5 text-black/40" />
            )}
            <span className="text-[11px] text-black/70 font-medium">{post.author.name}</span>
          </div>

          <span className="text-[10px] uppercase tracking-widest font-bold text-[#B5945E] group-hover:text-[#1A1A1A] flex items-center gap-1 transition-colors">
            Read Article
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </article>
  );
};
