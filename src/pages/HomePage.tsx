import React, { useState, useEffect } from 'react';
import {
  Search,
  Building2,
  Shield,
  Award,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Key,
  FileCheck,
  PhoneCall,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { IProperty, IAgent, IBlogPost, ITestimonial } from '../types';
import { propertyService, agentService, blogService, testimonialService } from '../services/api';
import { PropertyCard } from '../components/common/PropertyCard';
import { AgentCard } from '../components/common/AgentCard';
import { BlogCard } from '../components/common/BlogCard';
import { TestimonialCard } from '../components/common/TestimonialCard';

interface HomePageProps {
  navigate: (route: string, params?: Record<string, any>) => void;
  onSelectProperty: (property: IProperty) => void;
  onQuickInquire: (property: IProperty) => void;
  onOpenMortgageCalculator: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  navigate,
  onSelectProperty,
  onQuickInquire,
  onOpenMortgageCalculator
}) => {
  const [featuredProperties, setFeaturedProperties] = useState<IProperty[]>([]);
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [blogPosts, setBlogPosts] = useState<IBlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hero Search state
  const [searchListingType, setSearchListingType] = useState<'Buy' | 'Rent'>('Buy');
  const [searchCity, setSearchCity] = useState('All');
  const [searchType, setSearchType] = useState('All');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    async function loadHomeData() {
      setIsLoading(true);
      try {
        const [propRes, agentRes, blogRes, testRes] = await Promise.all([
          propertyService.getProperties({ isFeatured: true, limit: 6 }),
          agentService.getAgents(),
          blogService.getPosts(),
          testimonialService.getTestimonials()
        ]);

        if (propRes.success) setFeaturedProperties(propRes.properties);
        if (agentRes.success) setAgents(agentRes.agents);
        if (blogRes.success) setBlogPosts(blogRes.posts.slice(0, 3));
        if (testRes.success) setTestimonials(testRes.testimonials.slice(0, 3));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('properties', {
      listingType: searchListingType,
      city: searchCity !== 'All' ? searchCity : undefined,
      propertyType: searchType !== 'All' ? searchType : undefined,
      search: searchKeyword.trim() || undefined
    });
  };

  const propertyCategories = [
    {
      title: 'Mansions & Estates',
      count: '24+ Exclusive',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      type: 'Mansion'
    },
    {
      title: 'Sky Penthouses',
      count: '18+ Available',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      type: 'Penthouse'
    },
    {
      title: 'Designer Villas',
      count: '42+ Listings',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      type: 'Villa'
    },
    {
      title: 'Luxury Apartments',
      count: '35+ Units',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      type: 'Apartment'
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center pt-16 pb-16 px-4 overflow-hidden border-b border-black/10">
        {/* Background Image with Ambient Architectural Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85"
            alt="Growth Realtors Luxury Real Estate"
            className="w-full h-full object-cover object-center brightness-95 filter"
          />
          <div className="absolute inset-0 bg-[#FDFCF9]/85 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCF9]/70 via-transparent to-[#FDFCF9]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white border border-black/10 text-[#1A1A1A] text-[10px] font-bold tracking-[0.25em] uppercase shadow-sm">
            <Sparkles className="w-3 h-3 text-[#B5945E]" />
            <span>Pakistan's Premier Architectural Brokerage</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1A1A1A] tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Architectural Excellence. <br />
            <span className="text-[#B5945E] font-normal italic">
              Extraordinary Living.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-black/70 max-w-2xl mx-auto leading-relaxed">
            Curating private estates, designer residences, and premier commercial holdings across Islamabad, Lahore, and Karachi with institutional rigor.
          </p>

          {/* SEARCH BAR WIDGET */}
          <div className="max-w-4xl mx-auto bg-white border border-black/10 p-3 sm:p-5 shadow-lg">
            
            {/* Buy / Rent Switch Tabs */}
            <div className="flex gap-2 mb-3 border-b border-black/5 pb-3 px-1">
              <button
                type="button"
                onClick={() => setSearchListingType('Buy')}
                className={`px-5 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-all ${
                  searchListingType === 'Buy'
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-black/60 hover:text-[#1A1A1A] hover:bg-black/5'
                }`}
              >
                Buy Properties
              </button>
              <button
                type="button"
                onClick={() => setSearchListingType('Rent')}
                className={`px-5 py-1.5 text-[10px] uppercase tracking-widest font-bold transition-all ${
                  searchListingType === 'Rent'
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-black/60 hover:text-[#1A1A1A] hover:bg-black/5'
                }`}
              >
                Rent Luxury
              </button>
            </div>

            {/* Filter Inputs Grid */}
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              
              {/* City Selection */}
              <div className="px-3 py-2 bg-[#FDFCF9] border border-black/10 text-left">
                <label className="block text-[8px] uppercase tracking-wider font-bold text-black/50">Location / City</label>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#1A1A1A] font-semibold focus:outline-none cursor-pointer mt-0.5"
                >
                  <option value="All">All Major Cities</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                </select>
              </div>

              {/* Property Type */}
              <div className="px-3 py-2 bg-[#FDFCF9] border border-black/10 text-left">
                <label className="block text-[8px] uppercase tracking-wider font-bold text-black/50">Property Type</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#1A1A1A] font-semibold focus:outline-none cursor-pointer mt-0.5"
                >
                  <option value="All">All Categories</option>
                  <option value="Villa">Designer Villa</option>
                  <option value="Mansion">Private Mansion</option>
                  <option value="Penthouse">Sky Penthouse</option>
                  <option value="Apartment">Luxury Apartment</option>
                  <option value="Commercial">Commercial Tower</option>
                  <option value="Plot">Residential Plot</option>
                </select>
              </div>

              {/* Keyword / Sector */}
              <div className="px-3 py-2 bg-[#FDFCF9] border border-black/10 text-left">
                <label className="block text-[8px] uppercase tracking-wider font-bold text-black/50">Sector / Community</label>
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="e.g. F-7, DHA, Emaar"
                  className="w-full bg-transparent text-xs text-[#1A1A1A] font-semibold focus:outline-none placeholder-black/40 mt-0.5"
                />
              </div>

              {/* Search Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Properties</span>
              </button>
            </form>
          </div>

          {/* Quick stats counter badge row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 max-w-3xl mx-auto border-t border-black/10">
            <div>
              <div className="font-serif text-2xl font-bold text-[#1A1A1A]">PKR 50B+</div>
              <div className="text-[10px] uppercase tracking-wider text-black/50 font-medium">Portfolio Managed</div>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-[#1A1A1A]">1,200+</div>
              <div className="text-[10px] uppercase tracking-wider text-black/50 font-medium">Prime Transactions</div>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-[#1A1A1A]">100%</div>
              <div className="text-[10px] uppercase tracking-wider text-black/50 font-medium">Verified Titles</div>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold text-[#1A1A1A]">15+ Yrs</div>
              <div className="text-[10px] uppercase tracking-wider text-black/50 font-medium">Excellence Heritage</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROPERTIES CAROUSEL / GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-black/10">
          <div>
            <span className="text-[#B5945E] uppercase tracking-[0.3em] text-[10px] font-bold block mb-1">
              Curated Selection
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Featured Luxury Listings
            </h2>
            <p className="text-xs text-black/60 mt-1 max-w-lg">
              Explore handpicked signature residences meeting our stringent standards of architectural pedigree and legal title verification.
            </p>
          </div>

          <button
            onClick={() => navigate('properties', { isFeatured: true })}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-[10px] uppercase tracking-widest font-bold border border-black/10 transition-all"
          >
            <span>View All Curated Properties</span>
            <ArrowRight className="w-3 h-3" />
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
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
                onQuickInquire={onQuickInquire}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. PROPERTY CATEGORIES BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[#B5945E] uppercase tracking-[0.3em] text-[10px] font-bold block mb-1">
            Diverse Portfolio
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Explore by Architectural Type
          </h2>
          <p className="text-xs text-black/60 mt-1">
            From secluded mountain villas in Islamabad to waterfront penthouses in Karachi.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {propertyCategories.map((cat) => (
            <div
              key={cat.title}
              onClick={() => navigate('properties', { propertyType: cat.type })}
              className="group relative h-80 overflow-hidden cursor-pointer border border-black/10 hover:border-[#B5945E] transition-all bg-white"
            >
              <img
                src={cat.image}
                alt={cat.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[9px] font-bold text-[#B5945E] uppercase tracking-widest block mb-1">
                  {cat.count}
                </span>
                <h3 className="font-serif text-lg font-bold group-hover:text-[#B5945E] transition-colors flex items-center justify-between">
                  <span>{cat.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. THE GROWTH REALTORS STANDARD (WHY CHOOSE US) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-black/10 p-8 sm:p-12 lg:p-14 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#B5945E] uppercase tracking-[0.3em] text-[10px] font-bold block mb-1">
                The Growth Advantage
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">
                Redefining the Luxury Real Estate Experience
              </h2>
              <p className="text-xs leading-relaxed text-black/60 mb-8">
                In a market filled with uncertainty, Growth Realtors provides institutional clarity. Every transaction is backed by rigorous legal due diligence, title scrutiny, and dedicated private banking coordination.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FDFCF9] border border-black/5">
                  <Shield className="w-5 h-5 text-[#B5945E] mb-2" />
                  <h4 className="font-serif text-sm font-bold text-[#1A1A1A] mb-1">Title Verification</h4>
                  <p className="text-[11px] text-black/60">100% CDA, LDA, and DHA legal clearance prior to listing.</p>
                </div>

                <div className="p-4 bg-[#FDFCF9] border border-black/5">
                  <Key className="w-5 h-5 text-[#B5945E] mb-2" />
                  <h4 className="font-serif text-sm font-bold text-[#1A1A1A] mb-1">Off-Market Discretion</h4>
                  <p className="text-[11px] text-black/60">Confidential transactions for high-net-worth families.</p>
                </div>

                <div className="p-4 bg-[#FDFCF9] border border-black/5">
                  <TrendingUp className="w-5 h-5 text-[#B5945E] mb-2" />
                  <h4 className="font-serif text-sm font-bold text-[#1A1A1A] mb-1">Valuation Accuracy</h4>
                  <p className="text-[11px] text-black/60">Data-backed pricing models and quarterly market reports.</p>
                </div>

                <div className="p-4 bg-[#FDFCF9] border border-black/5">
                  <Award className="w-5 h-5 text-[#B5945E] mb-2" />
                  <h4 className="font-serif text-sm font-bold text-[#1A1A1A] mb-1">Concierge Advisory</h4>
                  <p className="text-[11px] text-black/60">End-to-end relocation, interior styling, and escrow support.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80"
                alt="Growth Realtors Luxury Living"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover border border-black/10"
              />
              <div className="absolute -bottom-4 -left-4 bg-white border border-black/10 p-4 shadow-md hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#1A1A1A] text-white font-bold text-sm flex items-center justify-center">
                    15+
                  </div>
                  <div>
                    <h5 className="font-serif text-xs font-bold text-[#1A1A1A]">Years of Integrity</h5>
                    <p className="text-[10px] text-black/50">Guiding generational wealth.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOP ADVISORS / AGENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-black/10">
          <div>
            <span className="text-[#B5945E] uppercase tracking-[0.3em] text-[10px] font-bold block mb-1">
              Private Advisory Team
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Meet Our Senior Property Consultants
            </h2>
            <p className="text-xs text-black/60 mt-1 max-w-lg">
              Seasoned specialists with deep local networks, market analytics, and discreet transaction management.
            </p>
          </div>

          <button
            onClick={() => navigate('agents')}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-[10px] uppercase tracking-widest font-bold border border-black/10 transition-all"
          >
            <span>View Full Advisory Board</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onContactAgent={() => navigate('contact', { subject: `Inquiry with Advisor: ${agent.name}` })}
            />
          ))}
        </div>
      </section>

      {/* 6. VERIFIED CLIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[#B5945E] uppercase tracking-[0.3em] text-[10px] font-bold block mb-1">
            Client Endorsements
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Trusted by Leaders & Discerning Families
          </h2>
          <p className="text-xs text-black/60 mt-1">
            Read firsthand accounts from our esteemed clientele across Pakistan and the diaspora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <TestimonialCard key={test.id} testimonial={test} />
          ))}
        </div>
      </section>

      {/* 7. REAL ESTATE JOURNAL / BLOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-black/10">
          <div>
            <span className="text-[#B5945E] uppercase tracking-[0.3em] text-[10px] font-bold block mb-1">
              Market Intelligence
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Latest Insights & Property Trends
            </h2>
            <p className="text-xs text-black/60 mt-1 max-w-lg">
              Analytical articles on luxury property valuations, capital gains, tax frameworks, and architectural innovations.
            </p>
          </div>

          <button
            onClick={() => navigate('blog')}
            className="inline-flex items-center gap-2 px-5 py-2 bg-white hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-[10px] uppercase tracking-widest font-bold border border-black/10 transition-all"
          >
            <span>Read Growth Journal</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              onSelect={(p) => navigate('blog-post', { slug: p.slug })}
            />
          ))}
        </div>
      </section>

      {/* 8. SELL YOUR PROPERTY CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-black/10 p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F7F5F2] border border-black/5 text-[#B5945E] text-[10px] font-bold tracking-widest uppercase">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B5945E]" />
              Private Acquisitions & Marketing
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
              Looking to Sell or Lease an Extraordinary Property?
            </h2>
            <p className="text-xs leading-relaxed text-black/60">
              Reach pre-qualified high-net-worth buyers and overseas investors through Growth Realtors’ private global distribution network.
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => navigate('sell')}
                className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors"
              >
                <span>Submit Your Property</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate('contact')}
                className="px-6 py-2.5 bg-white hover:bg-black/5 text-[#1A1A1A] font-bold text-[10px] uppercase tracking-widest border border-black/10 transition-colors"
              >
                Request Free Property Valuation
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
