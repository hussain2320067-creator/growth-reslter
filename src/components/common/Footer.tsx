import React, { useState } from 'react';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface FooterProps {
  navigate: (route: string, params?: Record<string, any>) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { success } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setIsSubscribed(true);
    success('Thank you for subscribing to Growth Realtors Luxury Market Intelligence.');
    setNewsletterEmail('');
  };

  return (
    <footer id="growth-realtors-footer" className="bg-[#F7F5F2] border-t border-black/10 text-black/70">
      {/* Top Banner / Newsletter */}
      <div className="border-b border-black/5 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-black/10 p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#B5945E]/10 pointer-events-none" />
            
            <div className="max-w-xl text-center lg:text-left z-10">
              <span className="text-[#B5945E] uppercase tracking-[0.3em] text-[10px] font-bold block mb-2">
                Exclusive Market Intelligence
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-bold tracking-tight">
                Subscribe to Private Portfolio Reports
              </h3>
              <p className="text-xs text-black/60 mt-2 leading-relaxed">
                Receive unlisted off-market opportunities, quarterly valuation indices, and premier architectural listings across Pakistan and abroad.
              </p>
            </div>

            <div className="w-full lg:w-auto min-w-[320px] max-w-md z-10">
              {isSubscribed ? (
                <div className="flex items-center gap-2 p-3.5 bg-[#FDFCF9] border border-[#B5945E]/40 text-[#B5945E] text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You are subscribed to our private investor briefings.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    required
                    className="flex-1 px-4 py-3 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] placeholder-black/40 text-xs focus:outline-none focus:border-[#B5945E] transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#1A1A1A] hover:bg-[#B5945E] text-white text-[10px] uppercase tracking-widest font-bold transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <span>Join</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-8 h-8 bg-[#1A1A1A] flex items-center justify-center">
                <div className="w-4 h-4 border border-white rotate-45"></div>
              </div>
              <div>
                <span className="block font-serif text-lg font-bold tracking-tighter text-[#1A1A1A]">
                  GROWTH REALTORS
                </span>
                <span className="block text-[8px] tracking-[0.2em] uppercase text-black/40 font-bold -mt-0.5">
                  Luxury Real Estate Advisory
                </span>
              </div>
            </button>

            <p className="text-xs leading-relaxed text-black/60 max-w-sm">
              Growth Realtors is Pakistan’s premier luxury real estate brokerage and advisory firm. We curate extraordinary residential mansions, designer farmhouses, sky penthouses, and grade-A commercial developments with absolute discretion and institutional integrity.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-black/70">
                <MapPin className="w-3.5 h-3.5 text-[#B5945E] shrink-0" />
                <span>Executive Office: 4th Floor, Beverly Centre, Blue Area, Islamabad</span>
              </div>
              <div className="flex items-center gap-2 text-black/70">
                <Phone className="w-3.5 h-3.5 text-[#B5945E] shrink-0" />
                <span>+92 51 8899770 / +92 300 1234567</span>
              </div>
              <div className="flex items-center gap-2 text-black/70">
                <Mail className="w-3.5 h-3.5 text-[#B5945E] shrink-0" />
                <span>advisory@growthrealtors.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-[#1A1A1A] text-xs font-bold tracking-widest uppercase border-l-2 border-[#B5945E] pl-2">
              Explore Portfolios
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('properties')}
                  className="hover:text-[#B5945E] transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-black/30" />
                  All Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('buy')}
                  className="hover:text-[#B5945E] transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-black/30" />
                  Properties for Sale
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('rent')}
                  className="hover:text-[#B5945E] transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-black/30" />
                  Luxury Rentals
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('sell')}
                  className="hover:text-[#B5945E] transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-black/30" />
                  Sell Your Property
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('agents')}
                  className="hover:text-[#B5945E] transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="w-2.5 h-2.5 text-black/30" />
                  Elite Advisory Team
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Prime Locations */}
          <div className="space-y-3">
            <h4 className="font-serif text-[#1A1A1A] text-xs font-bold tracking-widest uppercase border-l-2 border-[#B5945E] pl-2">
              Prime Locations
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('properties', { city: 'Islamabad' })}
                  className="hover:text-[#B5945E] transition-colors text-left"
                >
                  Islamabad (F-6, F-7, E-7)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('properties', { city: 'Lahore' })}
                  className="hover:text-[#B5945E] transition-colors text-left"
                >
                  Lahore (DHA Phase 5 & 6, Gulberg)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('properties', { city: 'Karachi' })}
                  className="hover:text-[#B5945E] transition-colors text-left"
                >
                  Karachi (Clifton, Emaar Oceanfront)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('properties', { city: 'Rawalpindi' })}
                  className="hover:text-[#B5945E] transition-colors text-left"
                >
                  Bahria Town & Safari Valley
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('properties', { search: 'Gulberg Greens' })}
                  className="hover:text-[#B5945E] transition-colors text-left"
                >
                  Gulberg Greens Farmhouses
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate & Advisory */}
          <div className="space-y-3">
            <h4 className="font-serif text-[#1A1A1A] text-xs font-bold tracking-widest uppercase border-l-2 border-[#B5945E] pl-2">
              Corporate
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('about')} className="hover:text-[#B5945E] transition-colors">
                  About Growth Realtors
                </button>
              </li>
              <li>
                <button onClick={() => navigate('blog')} className="hover:text-[#B5945E] transition-colors">
                  Market Trends & Articles
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-[#B5945E] transition-colors">
                  Contact Advisory Concierge
                </button>
              </li>
              <li>
                <div className="pt-2 text-[11px] text-black/50 space-y-1">
                  <div className="flex items-center gap-1.5 text-black/70">
                    <Clock className="w-3 h-3 text-[#B5945E]" />
                    <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
                  </div>
                  <p>Sunday: By VIP Appointment Only</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Minimal Status Footer / Metrics */}
      <div className="border-t border-black/10 py-5 bg-white text-[9px] text-black/50 uppercase tracking-[0.2em] font-medium">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2">
              <span className="text-[#1A1A1A] font-bold text-xs">850+</span>
              <span>Properties Sold</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#1A1A1A] font-bold text-xs">45</span>
              <span>Active Agents</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#1A1A1A] font-bold text-xs">12</span>
              <span>City Centers</span>
            </div>
          </div>
          <div>&copy; {new Date().getFullYear()} Growth Realtors Luxury Division. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};
