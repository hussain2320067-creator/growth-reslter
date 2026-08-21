import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { ITestimonial } from '../../types';

interface TestimonialCardProps {
  testimonial: ITestimonial;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  return (
    <div
      id={`testimonial-card-${testimonial.id}`}
      className="bg-white border border-black/10 p-6 shadow-sm relative flex flex-col justify-between hover:border-[#B5945E]/60 transition-colors"
    >
      <Quote className="absolute top-6 right-6 w-8 h-8 text-[#B5945E]/15" />

      <div>
        {/* Rating Stars */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < testimonial.rating
                  ? 'text-[#B5945E] fill-[#B5945E]'
                  : 'text-black/20'
              }`}
            />
          ))}
          <span className="text-[10px] uppercase tracking-wider text-black/50 ml-1.5 font-bold">5.0 Verified</span>
        </div>

        {/* Quote Text */}
        <p className="text-xs leading-relaxed text-black/70 italic mb-5">
          "{testimonial.review}"
        </p>
      </div>

      {/* Client Profile */}
      <div className="pt-3.5 border-t border-black/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={testimonial.clientImage}
            alt={testimonial.clientName}
            referrerPolicy="no-referrer"
            className="w-9 h-9 rounded-full object-cover border border-[#B5945E]/40"
          />
          <div>
            <h5 className="font-serif text-xs font-bold text-[#1A1A1A] flex items-center gap-1">
              {testimonial.clientName}
              <CheckCircle2 className="w-3 h-3 text-[#B5945E]" />
            </h5>
            <p className="text-[10px] text-black/50">{testimonial.clientTitle}</p>
          </div>
        </div>

        <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 bg-[#F7F5F2] text-[#1A1A1A] border border-black/5">
          {testimonial.transactionType}
        </span>
      </div>
    </div>
  );
};
