import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  SlidersHorizontal,
  Grid,
  List,
  ChevronDown,
  RotateCcw,
  Sparkles,
  MapPin,
  Building,
  Bed,
  Bath,
  Maximize2,
  DollarSign,
  ArrowRight
} from 'lucide-react';
import { IProperty, PropertyType, ListingType } from '../types';
import { propertyService } from '../services/api';
import { PropertyCard } from '../components/common/PropertyCard';

interface PropertiesPageProps {
  navigate: (route: string, params?: Record<string, any>) => void;
  onSelectProperty: (property: IProperty) => void;
  onQuickInquire: (property: IProperty) => void;
  initialFilters?: {
    city?: string;
    propertyType?: string;
    listingType?: string;
    search?: string;
    isFeatured?: boolean;
    [key: string]: any;
  };
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  navigate,
  onSelectProperty,
  onQuickInquire,
  initialFilters = {}
}) => {
  const filters: Record<string, any> = initialFilters;
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filters State
  const [search, setSearch] = useState<string>(filters.search || '');
  const [city, setCity] = useState<string>(filters.city || 'All');
  const [propertyType, setPropertyType] = useState<string>(filters.propertyType || 'All');
  const [listingType, setListingType] = useState<string>(filters.listingType || 'All');
  const [bedrooms, setBedrooms] = useState<number | undefined>(undefined);
  const [bathrooms, setBathrooms] = useState<number | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<string>('newest');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await propertyService.getProperties({
        search: search.trim() || undefined,
        city: city !== 'All' ? city : undefined,
        propertyType: propertyType !== 'All' ? propertyType : undefined,
        listingType: listingType !== 'All' ? listingType : undefined,
        bedrooms: bedrooms || undefined,
        bathrooms: bathrooms || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sort,
        page: currentPage,
        limit: 12
      });

      if (res.success) {
        setProperties(res.properties);
        setTotalCount(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
    } finally {
      setIsLoading(false);
    }
  }, [search, city, propertyType, listingType, bedrooms, bathrooms, minPrice, maxPrice, sort, currentPage]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleResetFilters = () => {
    setSearch('');
    setCity('All');
    setPropertyType('All');
    setListingType('All');
    setBedrooms(undefined);
    setBathrooms(undefined);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setSort('newest');
    setCurrentPage(1);
  };

  const citiesList = ['All', 'Islamabad', 'Lahore', 'Karachi', 'Rawalpindi'];
  const propertyTypesList = ['All', 'Villa', 'Mansion', 'Penthouse', 'Apartment', 'Townhouse', 'Commercial', 'Plot'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white border border-black/10 p-8 sm:p-10 relative overflow-hidden shadow-sm">
        <div className="max-w-2xl relative z-10">
          <span className="text-[#B5945E] uppercase tracking-[0.3em] text-[10px] font-bold block mb-1">
            Growth Realtors Portfolio
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Explore Prime Properties
          </h1>
          <p className="text-xs sm:text-sm text-black/60 mt-2 leading-relaxed">
            Filter through Pakistan’s most prestigious residential mansions, sea-facing penthouses, and high-yield commercial assets.
          </p>
        </div>
      </div>

      {/* Main Layout (Filters Sidebar + Listings Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* FILTERS SIDEBAR */}
        <div className={`lg:col-span-1 space-y-5 bg-white border border-black/10 p-5 h-fit ${isFilterDrawerOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between pb-3.5 border-b border-black/5">
            <div className="flex items-center gap-2 font-serif text-sm font-bold text-[#1A1A1A]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B5945E]" />
              <span>Filter Portfolio</span>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-[10px] uppercase tracking-wider font-bold text-black/40 hover:text-[#B5945E] flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Search Keyword */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-black/60">Keyword / Sector</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-black/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="e.g. F-7, DHA, Emaar..."
                className="w-full pl-8 pr-3 py-1.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs placeholder-black/40 focus:outline-none focus:border-[#B5945E]"
              />
            </div>
          </div>

          {/* Listing Type (Buy / Rent) */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-black/60">Listing Purpose</label>
            <div className="grid grid-cols-3 gap-1 bg-[#FDFCF9] p-1 border border-black/10">
              {['All', 'Buy', 'Rent'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setListingType(type);
                    setCurrentPage(1);
                  }}
                  className={`py-1 text-[10px] uppercase tracking-wider font-bold transition-all ${
                    listingType === type
                      ? 'bg-[#1A1A1A] text-white shadow-sm'
                      : 'text-black/60 hover:text-[#1A1A1A]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-black/60">City</label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
            >
              {citiesList.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-black/60">Property Type</label>
            <select
              value={propertyType}
              onChange={(e) => {
                setPropertyType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-1.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
            >
              {propertyTypesList.map((t) => (
                <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-black/60">Bedrooms</label>
            <div className="flex gap-1">
              {[undefined, 1, 2, 3, 4, 5].map((bed) => (
                <button
                  key={bed ?? 'any'}
                  type="button"
                  onClick={() => {
                    setBedrooms(bed);
                    setCurrentPage(1);
                  }}
                  className={`flex-1 py-1 text-[10px] font-bold border transition-all ${
                    bedrooms === bed
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-[#FDFCF9] border-black/10 text-black/60 hover:text-[#1A1A1A]'
                  }`}
                >
                  {bed === undefined ? 'Any' : `${bed}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-black/60">Price Range (PKR)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minPrice ?? ''}
                onChange={(e) => {
                  setMinPrice(e.target.value ? Number(e.target.value) : undefined);
                  setCurrentPage(1);
                }}
                placeholder="Min Price"
                className="w-full px-2.5 py-1.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs placeholder-black/40 focus:outline-none focus:border-[#B5945E]"
              />
              <input
                type="number"
                value={maxPrice ?? ''}
                onChange={(e) => {
                  setMaxPrice(e.target.value ? Number(e.target.value) : undefined);
                  setCurrentPage(1);
                }}
                placeholder="Max Price"
                className="w-full px-2.5 py-1.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs placeholder-black/40 focus:outline-none focus:border-[#B5945E]"
              />
            </div>
          </div>
        </div>

        {/* LISTINGS DISPLAY */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Controls Bar (Total count, mobile toggle, sort, view mode) */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white border border-black/10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
                className="lg:hidden px-3 py-1.5 bg-[#FDFCF9] border border-black/10 text-xs font-bold text-[#1A1A1A] flex items-center gap-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#B5945E]" />
                <span>Filters {isFilterDrawerOpen ? '(Close)' : ''}</span>
              </button>

              <span className="text-xs text-black/60">
                Showing <strong className="text-[#1A1A1A] font-bold">{properties.length}</strong> of <strong className="text-[#1A1A1A] font-bold">{totalCount}</strong> properties
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort Selection */}
              <div className="flex items-center gap-2 text-xs text-black/60">
                <span>Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => {
                    setSort(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs px-2.5 py-1 focus:outline-none focus:border-[#B5945E]"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="area_desc">Area: Largest First</option>
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="hidden sm:flex items-center gap-1 bg-[#FDFCF9] p-0.5 border border-black/10">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1 ${viewMode === 'grid' ? 'bg-[#1A1A1A] text-white' : 'text-black/50 hover:text-[#1A1A1A]'}`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1 ${viewMode === 'list' ? 'bg-[#1A1A1A] text-white' : 'text-black/50 hover:text-[#1A1A1A]'}`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Properties Grid / List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 bg-black/5 animate-pulse border border-black/5" />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelect={onSelectProperty}
                  onQuickInquire={onQuickInquire}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-black/10 p-8 space-y-4">
              <Building className="w-10 h-10 text-[#B5945E] mx-auto opacity-50" />
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">No Matching Properties Found</h3>
              <p className="text-xs text-black/60 max-w-sm mx-auto">
                No listings match your active filters. Try clearing some criteria or searching for different sectors.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2 bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#B5945E]"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="px-3.5 py-1.5 bg-white border border-black/10 text-xs font-semibold text-black/70 hover:text-[#1A1A1A] disabled:opacity-40"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-white border border-black/10 text-black/70 hover:text-[#1A1A1A]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="px-3.5 py-1.5 bg-white border border-black/10 text-xs font-semibold text-black/70 hover:text-[#1A1A1A] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
