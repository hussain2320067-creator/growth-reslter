import React, { useState, useEffect } from 'react';
import {
  Heart,
  Share2,
  Printer,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  ShieldCheck,
  Sparkles,
  Phone,
  MessageSquare,
  Mail,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Send,
  Building2,
  X,
  Compass
} from 'lucide-react';
import { IProperty, IAgent } from '../types';
import { propertyService, agentService, inquiryService } from '../services/api';
import { formatPKRPrice } from '../components/common/PropertyCard';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PropertyCard } from '../components/common/PropertyCard';

interface PropertyDetailsPageProps {
  propertyIdOrSlug: string;
  navigate: (route: string, params?: Record<string, any>) => void;
  onScheduleViewing: (property: IProperty) => void;
  onOpenMortgageCalculator: (price: number) => void;
}

export const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({
  propertyIdOrSlug,
  navigate,
  onScheduleViewing,
  onOpenMortgageCalculator
}) => {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { success, error, info } = useToast();

  const [property, setProperty] = useState<IProperty | null>(null);
  const [agent, setAgent] = useState<IAgent | null>(null);
  const [relatedProperties, setRelatedProperties] = useState<IProperty[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // In-page Quick Inquiry form state
  const [inquiryName, setInquiryName] = useState(user?.name || '');
  const [inquiryEmail, setInquiryEmail] = useState(user?.email || '');
  const [inquiryPhone, setInquiryPhone] = useState(user?.phone || '');
  const [inquiryMessage, setInquiryMessage] = useState('I would like to inquire about this luxury listing, schedule a verified due diligence review, and inspect layout plans.');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);

  useEffect(() => {
    async function loadPropertyDetails() {
      setIsLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        const res = await propertyService.getProperty(propertyIdOrSlug);
        if (res.success && res.property) {
          setProperty(res.property);
          setActiveImageIndex(0);

          // Fetch agent details
          if (res.property.agentId) {
            const agentRes = await agentService.getAgent(res.property.agentId);
            if (agentRes.success) setAgent(agentRes.agent);
          }

          // Fetch related properties in same city or type
          const relatedRes = await propertyService.getProperties({
            city: res.property.city,
            limit: 4
          });
          if (relatedRes.success) {
            setRelatedProperties(relatedRes.properties.filter(p => p.id !== res.property.id).slice(0, 3));
          }
        }
      } catch (err: any) {
        console.error('Failed to load property details:', err);
        error('Property not found.');
      } finally {
        setIsLoading(false);
      }
    }

    if (propertyIdOrSlug) {
      loadPropertyDetails();
    }
  }, [propertyIdOrSlug]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    setIsSubmittingInquiry(true);
    try {
      const res = await inquiryService.createInquiry({
        propertyId: property.id,
        name: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        message: inquiryMessage
      });
      if (res.success) {
        success('Your inquiry has been directly assigned to the advisory specialist.');
      }
    } catch (err: any) {
      error(err.message || 'Failed to submit inquiry.');
    } finally {
      setIsSubmittingInquiry(false);
    }
  };

  const handleShare = () => {
    if (navigator.share && property) {
      navigator.share({
        title: property.title,
        text: `Check out ${property.title} on Growth Realtors`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      info('Property link copied to clipboard.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center space-y-6">
        <div className="w-12 h-12 border-2 border-[#B5945E] border-t-transparent animate-spin mx-auto" />
        <p className="font-serif text-base text-[#1A1A1A]">Loading Luxury Estate Details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Property Not Found</h2>
        <p className="text-xs text-black/60">The property you are looking for might have been sold or removed.</p>
        <button
          onClick={() => navigate('properties')}
          className="px-6 py-2.5 bg-[#1A1A1A] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#B5945E]"
        >
          Return to Properties
        </button>
      </div>
    );
  }

  const isFav = isFavorite(property.id);
  const images = property.images && property.images.length > 0 ? property.images : [property.featuredImage];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-10">
      
      {/* 1. BREADCRUMBS & ACTIONS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-black/60">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('home')} className="hover:text-[#B5945E]">Home</button>
          <span>/</span>
          <button onClick={() => navigate('properties')} className="hover:text-[#B5945E]">Properties</button>
          <span>/</span>
          <span className="text-[#1A1A1A] font-semibold truncate max-w-xs">{property.title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(property)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border transition-all text-xs font-semibold ${
              isFav
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-white border-black/10 text-black/80 hover:text-[#1A1A1A]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
            <span>{isFav ? 'Saved' : 'Save Favorite'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-black/10 text-black/80 hover:text-[#1A1A1A] transition-colors text-xs font-semibold"
            title="Share Property"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            onClick={() => window.print()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-black/10 text-black/80 hover:text-[#1A1A1A] transition-colors text-xs font-semibold"
            title="Print Flyer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Flyer</span>
          </button>
        </div>
      </div>

      {/* 2. PROPERTY HEADER OVERVIEW */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-black/10">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                property.listingType === 'Buy'
                  ? 'bg-[#1A1A1A] text-white'
                  : 'bg-[#B5945E] text-white'
              }`}
            >
              For {property.listingType}
            </span>
            <span className="px-3 py-0.5 text-[10px] font-semibold bg-[#F7F5F2] text-[#1A1A1A] border border-black/10">
              {property.propertyType}
            </span>
            {property.isFeatured && (
              <span className="px-3 py-0.5 text-[10px] font-bold bg-[#FDFCF9] text-[#B5945E] border border-[#B5945E]/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#B5945E]" />
                Featured
              </span>
            )}
            <span className="px-3 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              ✓ Verified Title
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            {property.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-black/60">
            <MapPin className="w-3.5 h-3.5 text-[#B5945E] shrink-0" />
            <span>{property.address}, {property.location}, {property.city}</span>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="lg:text-right bg-white border border-black/10 p-5 shadow-sm">
          <div className="text-[10px] uppercase font-bold text-black/50 tracking-wider">
            Valuation / Asking Price
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mt-1">
            {formatPKRPrice(property.price, property.listingType)}
          </div>
          {property.priceUsd && (
            <div className="text-xs text-black/50 mt-0.5">
              ≈ ${property.priceUsd.toLocaleString()} USD
            </div>
          )}
        </div>
      </div>

      {/* 3. MULTI-IMAGE GALLERY & LIGHTBOX */}
      <div className="space-y-3">
        {/* Main Stage Image */}
        <div
          onClick={() => setIsLightboxOpen(true)}
          className="relative aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-black/5 border border-black/10 cursor-pointer group shadow-sm"
        >
          <img
            src={images[activeImageIndex]}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
          
          {/* Zoom / Lightbox Trigger Badge */}
          <div className="absolute bottom-4 right-4 px-3.5 py-1.5 bg-white/90 border border-black/10 text-[#1A1A1A] text-xs font-semibold flex items-center gap-2 group-hover:bg-[#1A1A1A] group-hover:text-white transition-colors">
            <Eye className="w-3.5 h-3.5" />
            <span>View Full Gallery ({images.length} Photos)</span>
          </div>

          {/* Prev / Next Image Overlay buttons */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-[#1A1A1A] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-[#1A1A1A] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-24 h-16 overflow-hidden shrink-0 border transition-all ${
                  activeImageIndex === idx
                    ? 'border-[#B5945E]'
                    : 'border-black/10 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-white pb-4">
            <span className="font-serif text-sm font-bold text-[#FDFCF9]">{property.title} — Photo {activeImageIndex + 1} of {images.length}</span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-1.5 bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center max-h-[80vh]">
            <img
              src={images[activeImageIndex]}
              alt="Lightbox View"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImageIndex(prev => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-4 p-3 bg-black/80 text-white hover:bg-[#B5945E] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 p-3 bg-black/80 text-white hover:bg-[#B5945E] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto pt-4">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setActiveImageIndex(idx)}
                referrerPolicy="no-referrer"
                className={`w-16 h-12 object-cover cursor-pointer border ${activeImageIndex === idx ? 'border-[#B5945E]' : 'border-transparent opacity-50'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* 4. MAIN DETAILS GRID (SPECS + CONTENT vs STICKY ACTIONS SIDEBAR) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT 2 COLS: Specs, Description, Amenities, Location Map */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Key Specs Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white border border-black/10">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-black/50">
                <Bed className="w-3.5 h-3.5 text-[#B5945E]" />
                <span>Bedrooms</span>
              </div>
              <div className="font-serif text-lg font-bold text-[#1A1A1A]">
                {property.bedrooms > 0 ? `${property.bedrooms} Beds` : 'N/A'}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-black/50">
                <Bath className="w-3.5 h-3.5 text-[#B5945E]" />
                <span>Bathrooms</span>
              </div>
              <div className="font-serif text-lg font-bold text-[#1A1A1A]">
                {property.bathrooms > 0 ? `${property.bathrooms} Baths` : 'N/A'}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-black/50">
                <Maximize2 className="w-3.5 h-3.5 text-[#B5945E]" />
                <span>Total Area</span>
              </div>
              <div className="font-serif text-lg font-bold text-[#1A1A1A]">
                {property.area} {property.areaUnit}
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-black/50">
                <Calendar className="w-3.5 h-3.5 text-[#B5945E]" />
                <span>Year Built</span>
              </div>
              <div className="font-serif text-lg font-bold text-[#1A1A1A]">
                {property.yearBuilt}
              </div>
            </div>
          </div>

          {/* Architectural Narrative & Description */}
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] border-l-2 border-[#B5945E] pl-3">
              Architectural Overview & Narrative
            </h3>
            <div className="text-xs sm:text-sm text-black/70 leading-relaxed space-y-3">
              <p>{property.description}</p>
            </div>
          </div>

          {/* Highlights & Features Pills */}
          {property.features && property.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A] border-l-2 border-[#B5945E] pl-3">
                Key Residence Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {property.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 bg-white border border-black/10 text-xs text-[#1A1A1A]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B5945E] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Amenities Checklist */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A] border-l-2 border-[#B5945E] pl-3">
                Amenities & Infrastructure
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 bg-white border border-black/10 text-xs font-medium text-black/80"
                  >
                    <Sparkles className="w-3 h-3 text-[#B5945E]" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location & Interactive Simulated Map */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A] border-l-2 border-[#B5945E] pl-3">
                Location & Connectivity
              </h3>
              <span className="text-xs text-black/50">{property.city}, Pakistan</span>
            </div>

            <div className="relative aspect-[16/9] overflow-hidden bg-[#F7F5F2] border border-black/10 p-6 flex flex-col justify-between">
              <div className="relative z-10 max-w-sm space-y-1">
                <span className="inline-block px-2 py-0.5 bg-[#1A1A1A] text-white text-[9px] font-bold uppercase tracking-wider">
                  Verified Coordinates
                </span>
                <h4 className="font-serif text-base font-bold text-[#1A1A1A]">{property.location}</h4>
                <p className="text-xs text-black/60">{property.address}</p>
              </div>

              <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
                <div className="p-2 bg-white border border-black/10 text-[10px] text-black/80 font-medium">
                  ✈️ Airport: 20 Mins
                </div>
                <div className="p-2 bg-white border border-black/10 text-[10px] text-black/80 font-medium">
                  🏥 Tertiary Hospital: 5 Mins
                </div>
                <div className="p-2 bg-white border border-black/10 text-[10px] text-black/80 font-medium">
                  ⛳ Golf Club: 10 Mins
                </div>
                <div className="p-2 bg-white border border-black/10 text-[10px] text-black/80 font-medium">
                  🛍️ Luxury Mall: 8 Mins
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COL: Sticky Action Concierge & Direct Inquiry Form */}
        <div className="space-y-5">
          
          {/* Primary Action Card */}
          <div className="bg-white border border-black/10 p-5 shadow-sm space-y-4 sticky top-20">
            
            {/* Direct Viewing CTA */}
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#B5945E] block mb-1">
                Private Inspection
              </span>
              <h4 className="font-serif text-lg font-bold text-[#1A1A1A] mb-2">
                Experience This Residence
              </h4>
              <button
                type="button"
                onClick={() => onScheduleViewing(property)}
                className="w-full py-2.5 px-4 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Private Walkthrough</span>
              </button>
            </div>

            {/* Mortgage Calculator trigger */}
            {property.listingType === 'Buy' && (
              <button
                type="button"
                onClick={() => onOpenMortgageCalculator(property.price)}
                className="w-full py-2 px-3 bg-[#FDFCF9] hover:bg-[#F7F5F2] text-[#1A1A1A] text-xs font-semibold border border-black/10 flex items-center justify-center gap-2 transition-colors"
              >
                <Calculator className="w-3.5 h-3.5 text-[#B5945E]" />
                <span>Calculate Mortgage Payment</span>
              </button>
            )}

            {/* Assigned Advisor Section */}
            <div className="pt-3 border-t border-black/5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-black/40 block mb-2">
                Assigned Portfolio Specialist
              </span>
              
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={agent?.image || property.agentImage || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'}
                  alt={agent?.name || property.agentName}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 object-cover border border-black/10"
                />
                <div className="min-w-0 flex-1">
                  <h5 className="font-serif text-xs font-bold text-[#1A1A1A] truncate">
                    {agent?.name || property.agentName || 'Growth Senior Advisor'}
                  </h5>
                  <p className="text-[10px] text-[#B5945E] truncate">{agent?.position || 'Real Estate Consultant'}</p>
                  <p className="text-[10px] text-black/50 truncate">{property.agentPhone || '+92 51 8899770'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <a
                  href={`tel:${property.agentPhone || '+92518899770'}`}
                  className="py-1.5 px-2 bg-[#FDFCF9] hover:bg-black/5 text-[#1A1A1A] text-xs font-medium flex items-center justify-center gap-1.5 border border-black/10 transition-colors"
                >
                  <Phone className="w-3 h-3 text-[#B5945E]" />
                  <span>Call</span>
                </a>
                <a
                  href={`https://wa.me/${(property.agentPhone || '+923001234567').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2 bg-[#FDFCF9] hover:bg-black/5 text-emerald-700 text-xs font-medium flex items-center justify-center gap-1.5 border border-black/10 transition-colors"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Direct In-Page Inquiry Form */}
            <div className="pt-3 border-t border-black/5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-black/40 block mb-2">
                Send Direct Message
              </span>

              <form onSubmit={handleInquirySubmit} className="space-y-2">
                <input
                  type="text"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-full px-2.5 py-1.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs placeholder-black/40 focus:outline-none focus:border-[#B5945E]"
                />
                <input
                  type="email"
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className="w-full px-2.5 py-1.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs placeholder-black/40 focus:outline-none focus:border-[#B5945E]"
                />
                <input
                  type="tel"
                  value={inquiryPhone}
                  onChange={(e) => setInquiryPhone(e.target.value)}
                  placeholder="Phone / WhatsApp"
                  required
                  className="w-full px-2.5 py-1.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs placeholder-black/40 focus:outline-none focus:border-[#B5945E]"
                />
                <textarea
                  rows={2}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  required
                  className="w-full p-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs placeholder-black/40 focus:outline-none focus:border-[#B5945E]"
                />
                <button
                  type="submit"
                  disabled={isSubmittingInquiry}
                  className="w-full py-2 bg-[#1A1A1A] hover:bg-[#B5945E] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{isSubmittingInquiry ? 'Sending...' : 'Send Inquiry Message'}</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 5. SIMILAR / RELATED LUXURY LISTINGS */}
      {relatedProperties.length > 0 && (
        <div className="pt-10 border-t border-black/10 space-y-6">
          <div>
            <span className="text-[#B5945E] uppercase tracking-[0.3em] text-[10px] font-bold block mb-1">
              Similar Opportunities
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              More Properties in {property.city}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProperties.map((relProp) => (
              <PropertyCard
                key={relProp.id}
                property={relProp}
                onSelect={(p) => navigate('property-details', { id: p.slug || p.id })}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
