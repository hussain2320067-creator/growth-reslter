import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, ArrowRight, Building, Sparkles } from 'lucide-react';
import { IProperty } from '../../types';
import { propertyService } from '../../services/api';
import { formatPKRPrice } from '../common/PropertyCard';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty: (property: IProperty) => void;
  onNavigateToSearch: (query: string) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProperty,
  onNavigateToSearch
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<IProperty[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await propertyService.search(query);
        if (res.success) {
          setResults(res.properties);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const popularSearches = [
    'Islamabad F-7 Villa',
    'DHA Lahore Phase 6',
    'Emaar Karachi Oceanfront',
    'Eighteen Islamabad Penthouse',
    'Gulberg Greens Farmhouse',
    'Commercial Plots'
  ];

  return (
    <div
      id="quick-search-modal"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 text-xs"
    >
      <div className="relative w-full max-w-2xl bg-white border border-black/10 shadow-xl overflow-hidden">
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-black/10 flex items-center gap-3 bg-[#FDFCF9]">
          <Search className="w-4 h-4 text-[#B5945E] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, sector, title (e.g. F-7, DHA, Penthouse)..."
            className="flex-1 bg-transparent text-[#1A1A1A] placeholder-black/40 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-black/40 hover:text-black text-xs font-semibold"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-black/40 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 bg-white">
          {isSearching && (
            <div className="py-8 text-center text-xs text-black/50">
              Searching luxury portfolios...
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-black/50 uppercase tracking-wider block">
                Found {results.length} properties
              </span>
              <div className="space-y-2">
                {results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectProperty(item);
                      onClose();
                    }}
                    className="flex items-center gap-3 p-2.5 bg-[#FDFCF9] hover:bg-black/5 border border-black/10 hover:border-[#B5945E] transition-colors cursor-pointer group"
                  >
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-14 h-12 object-cover border border-black/10"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#B5945E] transition-colors truncate">
                        {item.title}
                      </h5>
                      <div className="flex items-center gap-1 text-[11px] text-black/50">
                        <MapPin className="w-3 h-3 text-[#B5945E]" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-serif font-bold text-[#B5945E]">
                        {formatPKRPrice(item.price, item.listingType)}
                      </div>
                      <span className="text-[9px] font-bold text-black/40 uppercase">
                        For {item.listingType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isSearching && results.length === 0 && query.length >= 2 && (
            <div className="py-8 text-center text-xs text-black/50">
              No matching properties found for "{query}". Try checking city names or sectors like "Islamabad", "DHA", or "Villa".
            </div>
          )}

          {/* Popular searches suggestions */}
          {results.length === 0 && (
            <div>
              <span className="text-[10px] font-bold text-black/50 uppercase tracking-wider block mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#B5945E]" />
                Trending Luxury Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      onNavigateToSearch(tag);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-[#FDFCF9] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-xs font-semibold border border-black/10 transition-colors flex items-center gap-1.5"
                  >
                    <span>{tag}</span>
                    <ArrowRight className="w-3 h-3 text-black/40" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
