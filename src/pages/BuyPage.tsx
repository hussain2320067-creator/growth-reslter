import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  Calculator,
  Compass,
  ArrowRight,
  Sparkles,
  FileCheck,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { IProperty } from '../types';
import { propertyService } from '../services/api';
import { PropertyCard } from '../components/common/PropertyCard';

interface BuyPageProps {
  navigate: (route: string, params?: Record<string, any>) => void;
  onSelectProperty: (property: IProperty) => void;
  onQuickInquire: (property: IProperty) => void;
  onOpenMortgageCalculator: () => void;
}

export const BuyPage: React.FC<BuyPageProps> = ({
  navigate,
  onSelectProperty,
  onQuickInquire,
  onOpenMortgageCalculator
}) => {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBuyProperties() {
      setIsLoading(true);
      try {
        const res = await propertyService.getProperties({ listingType: 'Buy', limit: 9 });
        if (res.success) {
          setProperties(res.properties);
        }
      } catch (err) {
        console.error('Error loading buy listings:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBuyProperties();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-black/10 p-8 sm:p-12 relative overflow-hidden shadow-sm">
        <div className="max-w-3xl relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDFCF9] border border-black/10 text-[#B5945E] text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#B5945E]" />
            Prime Acquisitions
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
            Acquire Extraordinary Real Estate in Pakistan
          </h1>
          <p className="text-xs sm:text-sm text-black/60 leading-relaxed">
            Browse legally vetted, high-capital-growth luxury properties across Islamabad, Lahore, and Karachi. From designer mansions to sea-view duplexes.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('properties', { listingType: 'Buy' })}
              className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Browse All For Sale</span>
            </button>
            <button
              onClick={onOpenMortgageCalculator}
              className="px-5 py-2.5 bg-[#FDFCF9] hover:bg-[#F7F5F2] text-[#1A1A1A] text-[10px] uppercase tracking-widest font-bold border border-black/10 flex items-center gap-2 transition-colors"
            >
              <Calculator className="w-3.5 h-3.5 text-[#B5945E]" />
              <span>Estimate Financing</span>
            </button>
          </div>
        </div>
      </div>

      {/* Buyer Protection Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-black/10 space-y-2">
          <ShieldCheck className="w-6 h-6 text-[#B5945E]" />
          <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Title & Mutation Guarantee</h3>
          <p className="text-xs text-black/60 leading-relaxed">
            Every property undergoes exhaustive due diligence with CDA, LDA, and DHA revenue departments prior to contract signing.
          </p>
        </div>

        <div className="p-6 bg-white border border-black/10 space-y-2">
          <Lock className="w-6 h-6 text-[#B5945E]" />
          <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Secure Escrow & Banking</h3>
          <p className="text-xs text-black/60 leading-relaxed">
            Seamless Roshan Digital Account (RDA) compliance and structured bank token disbursements for resident and overseas investors.
          </p>
        </div>

        <div className="p-6 bg-white border border-black/10 space-y-2">
          <FileCheck className="w-6 h-6 text-[#B5945E]" />
          <h3 className="font-serif text-base font-bold text-[#1A1A1A]">Direct Advisory Support</h3>
          <p className="text-xs text-black/60 leading-relaxed">
            Dedicated legal advisors and tax consultants to optimize capital value tax (CVT), advance tax, and registration stamp duties.
          </p>
        </div>
      </div>

      {/* Signature Properties For Sale */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Signature Residential Holdings For Sale
            </h2>
            <p className="text-xs text-black/60 mt-0.5">
              Hand-picked properties ready for immediate possession and title transfer.
            </p>
          </div>
          <button
            onClick={() => navigate('properties', { listingType: 'Buy' })}
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
