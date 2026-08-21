import React from 'react';
import { Heart, Building, Trash2, ArrowRight } from 'lucide-react';
import { IProperty } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import { PropertyCard } from '../components/common/PropertyCard';

interface FavoritesPageProps {
  navigate: (route: string, params?: Record<string, any>) => void;
  onSelectProperty: (property: IProperty) => void;
  onQuickInquire: (property: IProperty) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  navigate,
  onSelectProperty,
  onQuickInquire
}) => {
  const { favorites, clearFavorites } = useFavorites();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-black/10">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B5945E] block mb-1">
            Private Shortlist
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] tracking-tight">
            Saved Properties ({favorites.length})
          </h1>
          <p className="text-xs sm:text-sm text-black/60 mt-1">
            Review and compare your bookmarked luxury residences and prime investments.
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            type="button"
            onClick={clearFavorites}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-600 border border-red-200 text-xs font-bold uppercase tracking-wider hover:bg-red-100 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Saved List</span>
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelect={onSelectProperty}
              onQuickInquire={onQuickInquire}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-black/10 p-8 space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 bg-[#FDFCF9] text-[#B5945E] border border-black/10 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7 opacity-60" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Your Shortlist is Empty
          </h3>
          <p className="text-xs text-black/60 leading-relaxed">
            Click the heart icon on any villa, mansion, or penthouse to bookmark properties for private review.
          </p>
          <button
            onClick={() => navigate('properties')}
            className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 mx-auto transition-colors"
          >
            <span>Explore Properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
