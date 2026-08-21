import React, { useState, useEffect } from 'react';
import {
  Building2,
  Key,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { IProperty } from '../types';
import { propertyService } from '../services/api';
import { PropertyCard } from '../components/common/PropertyCard';

interface RentPageProps {
  navigate: (route: string, params?: Record<string, any>) => void;
  onSelectProperty: (property: IProperty) => void;
  onQuickInquire: (property: IProperty) => void;
}

export const RentPage: React.FC<RentPageProps> = ({
  navigate,
  onSelectProperty,
  onQuickInquire
}) => {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRentProperties() {
      setIsLoading(true);
      try {
        const res = await propertyService.getProperties({ listingType: 'Rent', limit: 9 });
        if (res.success) {
          setProperties(res.properties);
        }
      } catch (err) {
        console.error('Error loading rent listings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRentProperties();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-black/10 p-8 sm:p-12 relative overflow-hidden shadow-sm">
        <div className="max-w-3xl relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDFCF9] border border-black/10 text-[#B5945E] text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#B5945E]" />
            Diplomatic & Executive Leases
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
            High-End Residences & Furnished Suites for Rent
          </h1>
          <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
            Catering to ambassadors, multinational corporate executives, and discerning families seeking fully managed, secure residences across Islamabad, Lahore, and Karachi.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('properties', { listingType: 'Rent' })}
              className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore All Rentals</span>
            </button>
            <button
              onClick={() => navigate('contact', { subject: 'Corporate / Diplomatic Lease Inquiry' })}
              className="px-5 py-2.5 bg-[#FDFCF9] hover:bg-[#F7F5F2] text-[#1A1A1A] text-[10px] uppercase tracking-widest font-bold border border-black/10 transition-colors"
            >
              Diplomatic Lease Concierge
            </button>
          </div>
        </div>
      </div>

      {/* Rental Features Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-black/10 space-y-2">
          <Key className="w-6 h-6 text-[#B5945E]" />
          <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Turnkey Designer Furnishing</h3>
          <p className="text-xs text-black/60 leading-relaxed">
            Curated homes featuring imported Italian furniture, smart automation, inverter climate control, and full back-up generators.
          </p>
        </div>

        <div className="p-6 bg-white border border-black/10 space-y-2">
          <ShieldCheck className="w-6 h-6 text-[#B5945E]" />
          <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Diplomatic Security Standards</h3>
          <p className="text-xs text-black/60 leading-relaxed">
            Properties verified for multi-layer security clearances, perimeter CCTV coverage, guard quarters, and secure access gates.
          </p>
        </div>

        <div className="p-6 bg-white border border-black/10 space-y-2">
          <Award className="w-6 h-6 text-[#B5945E]" />
          <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Corporate Tenancy Contracts</h3>
          <p className="text-xs text-black/60 leading-relaxed">
            Bespoke tenancy contracts compliant with international corporate relocation policies and embassy protocols.
          </p>
        </div>
      </div>

      {/* Available Rentals */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Featured Luxury Residences For Rent
            </h2>
            <p className="text-xs text-black/60 mt-0.5">
              Move-in ready luxury estates, diplomatic villas, and duplex apartments.
            </p>
          </div>
          <button
            onClick={() => navigate('properties', { listingType: 'Rent' })}
            className="text-xs text-[#1A1A1A] hover:text-[#B5945E] flex items-center gap-1 font-bold uppercase tracking-wider"
          >
            <span>View All ({properties.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-black/5 animate-pulse border border-black/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
                onQuickInquire={onQuickInquire}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
