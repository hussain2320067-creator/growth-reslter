import React from 'react';
import {
  Heart,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Eye,
  CheckCircle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { IProperty } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';

interface PropertyCardProps {
  property: IProperty;
  onSelect: (property: IProperty) => void;
  onQuickInquire?: (property: IProperty) => void;
}

// Utility to format Pakistani currency into Crores / Lakhs
export function formatPKRPrice(price: number, listingType: 'Buy' | 'Rent' = 'Buy'): string {
  if (listingType === 'Rent') {
    if (price >= 100000) {
      const lakhs = price / 100000;
      return `PKR ${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)} Lakh / mo`;
    }
    return `PKR ${price.toLocaleString()} / mo`;
  }

  if (price >= 10000000) {
    const crore = price / 10000000;
    return `PKR ${crore % 1 === 0 ? crore.toFixed(0) : crore.toFixed(2)} Crore`;
  }
  if (price >= 100000) {
    const lakhs = price / 100000;
    return `PKR ${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)} Lakh`;
  }
  return `PKR ${price.toLocaleString()}`;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  onQuickInquire
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(property.id);

  return (
    <div
      id={`property-card-${property.id}`}
      className="group relative bg-white border border-black/10 hover:border-[#B5945E]/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer"
      onClick={() => onSelect(property)}
    >
      {/* Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE7E2]">
        <img
          src={property.featuredImage || property.images[0]}
          alt={property.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center z-10">
          <span
            className={`px-2 py-1 text-[8px] font-bold tracking-wider uppercase ${
              property.listingType === 'Buy'
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-[#B5945E] text-white'
            }`}
          >
            For {property.listingType}
          </span>

          <span className="px-2 py-1 text-[8px] font-medium tracking-wide uppercase bg-white/90 text-[#1A1A1A] border border-black/5">
            {property.propertyType}
          </span>

          {property.isFeatured && (
            <span className="px-2 py-1 text-[8px] font-bold uppercase tracking-wider bg-[#B5945E] text-white flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          id={`fav-btn-${property.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property);
          }}
          className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all z-10 shadow-sm ${
            isFav
              ? 'bg-[#B5945E] text-white'
              : 'bg-white/90 text-[#1A1A1A]/70 hover:text-[#B5945E] hover:bg-white'
          }`}
          title={isFav ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Status Overlay if not Available */}
        {property.status !== 'Available' && (
          <div className="absolute bottom-2.5 left-3 z-10">
            <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider bg-black/80 text-white">
              {property.status}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Price and Title Header */}
          <div className="flex justify-between items-baseline gap-2 mb-1.5">
            <h3
              className="text-xs sm:text-sm font-bold text-[#1A1A1A] group-hover:text-[#B5945E] transition-colors line-clamp-1 pr-1"
              title={property.title}
            >
              {property.title}
            </h3>
            <span className="text-[#B5945E] text-xs font-bold whitespace-nowrap shrink-0">
              {formatPKRPrice(property.price, property.listingType)}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-[10px] text-black/50 mb-3">
            <MapPin className="w-3 h-3 text-[#B5945E] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Key Specs Row */}
          <div className="flex items-center gap-4 border-t border-black/5 pt-2.5 text-[10px] text-black/70 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 border border-black/40"></div>
              <span>{property.bedrooms > 0 ? `${property.bedrooms} Bed` : 'Plot'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full border border-black/40"></div>
              <span>{property.bathrooms > 0 ? `${property.bathrooms} Bath` : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-black/10"></div>
              <span>{property.area} {property.areaUnit}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-black/5 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            id={`view-details-${property.id}`}
            onClick={() => onSelect(property)}
            className="flex-1 py-2 px-3 bg-[#1A1A1A] hover:bg-[#B5945E] text-white text-[10px] uppercase tracking-widest font-medium transition-colors flex items-center justify-center gap-1"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>

          {onQuickInquire && (
            <button
              onClick={() => onQuickInquire(property)}
              className="py-2 px-3 border border-black/10 hover:border-[#B5945E] hover:text-[#B5945E] text-[#1A1A1A] text-[10px] uppercase tracking-widest font-medium transition-colors"
              title="Quick Inquiry"
            >
              Inquire
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
