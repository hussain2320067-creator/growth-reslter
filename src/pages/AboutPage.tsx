import React from 'react';
import {
  Building2,
  ShieldCheck,
  Award,
  Globe,
  Users,
  Target,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface AboutPageProps {
  navigate: (route: string, params?: Record<string, any>) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const milestones = [
    {
      year: '2010',
      title: 'Founding in Islamabad',
      description: 'Growth Realtors established its premier headquarters in Blue Area, Islamabad, focusing on Sectors F-6, F-7, and E-7 private estates.'
    },
    {
      year: '2015',
      title: 'Lahore Luxury Expansion',
      description: 'Launched our DHA Phase 5 and Gulberg advisory desks, orchestrating landmark residential acquisitions for prominent corporate leaders.'
    },
    {
      year: '2019',
      title: 'Karachi Oceanfront & Overseas Desk',
      description: 'Expanded into Emaar Oceanfront and Clifton waterfront penthouses, inaugurating our dedicated Roshan Digital Account expatriate concierge.'
    },
    {
      year: '2024',
      title: 'PKR 50 Billion Valuation Milestone',
      description: 'Surpassed PKR 50 Billion in cumulative managed transactions with 100% clean title verification record and zero regulatory disputes.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-16">
      
      {/* 1. HERO HERITAGE BANNER */}
      <div className="bg-white border border-black/10 p-8 sm:p-14 relative overflow-hidden shadow-sm">
        <div className="max-w-3xl relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDFCF9] border border-black/10 text-[#B5945E] text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-[#B5945E]" />
            The Growth Realtors Ethos
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
            Stewarding Pakistan’s Most Prestigious Real Estate Assets
          </h1>
          <p className="text-xs sm:text-sm text-black/60 leading-relaxed font-light">
            Founded on the pillars of absolute title integrity, architectural discernment, and confidential transaction management, Growth Realtors is the chosen advisory partner for high-net-worth families, diplomats, and global Pakistani expatriates.
          </p>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-6 bg-white border border-black/10 text-center space-y-1">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#B5945E]">PKR 50B+</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-black/50">Cumulative Transactions</div>
        </div>
        <div className="p-6 bg-white border border-black/10 text-center space-y-1">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#B5945E]">1,200+</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-black/50">Families Advised</div>
        </div>
        <div className="p-6 bg-white border border-black/10 text-center space-y-1">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#B5945E]">100%</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-black/50">Legal Clean Titles</div>
        </div>
        <div className="p-6 bg-white border border-black/10 text-center space-y-1">
          <div className="font-serif text-3xl sm:text-4xl font-bold text-[#B5945E]">15+</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-black/50">Years Mastery</div>
        </div>
      </div>

      {/* 3. MISSION & VISION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-white border border-black/10 space-y-3">
          <div className="w-10 h-10 bg-[#FDFCF9] text-[#B5945E] border border-black/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-[#B5945E]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Our Mission</h3>
          <p className="text-xs text-black/60 leading-relaxed">
            To eliminate ambiguity and legal friction from luxury real estate transactions in Pakistan through institutional due diligence, transparent valuation benchmarks, and peerless bespoke client representation.
          </p>
        </div>

        <div className="p-8 bg-white border border-black/10 space-y-3">
          <div className="w-10 h-10 bg-[#FDFCF9] text-[#B5945E] border border-black/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#B5945E]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Our Vision</h3>
          <p className="text-xs text-black/60 leading-relaxed">
            To set the international benchmark for South Asian luxury real estate advisory, bridging overseas capital with landmark architectural holdings that preserve and compound generational wealth.
          </p>
        </div>
      </div>

      {/* 4. HISTORIC TIMELINE */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B5945E] block mb-1">
            Our Journey
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#1A1A1A]">
            Milestones of Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m) => (
            <div
              key={m.year}
              className="p-6 bg-white border border-black/10 hover:border-[#B5945E] transition-colors space-y-2"
            >
              <span className="font-serif text-2xl font-bold text-[#B5945E] block">
                {m.year}
              </span>
              <h4 className="font-serif text-lg font-bold text-[#1A1A1A]">
                {m.title}
              </h4>
              <p className="text-xs text-black/60 leading-relaxed">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CALL TO ACTION */}
      <div className="bg-[#1A1A1A] text-white p-8 sm:p-12 text-center max-w-4xl mx-auto space-y-4">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Begin Your Private Portfolio Consultation
        </h3>
        <p className="text-xs sm:text-sm text-white/70 max-w-xl mx-auto">
          Whether acquiring a signature residence or divesting a trophy asset, connect directly with our senior partners.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => navigate('contact')}
            className="px-6 py-2.5 bg-[#B5945E] hover:bg-[#a3824e] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <span>Schedule Confidential Meeting</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
