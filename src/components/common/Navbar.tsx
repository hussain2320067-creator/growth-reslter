import React, { useState, useEffect } from 'react';
import {
  Building2,
  Heart,
  Search,
  User,
  Menu,
  X,
  Shield,
  LogOut,
  ChevronDown,
  Phone,
  Home,
  Compass,
  FilePlus,
  Users,
  Info,
  BookOpen,
  Mail,
  Calculator
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string, params?: Record<string, any>) => void;
  onOpenSearch?: () => void;
  onOpenMortgageCalculator?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  navigate,
  onOpenSearch,
  onOpenMortgageCalculator
}) => {
  const { user, isAuthenticated, isAdmin, logout, openAuthModal } = useAuth();
  const { favoriteIds } = useFavorites();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', route: 'home', icon: Home },
    { label: 'Properties', route: 'properties', icon: Compass },
    { label: 'Buy', route: 'buy', icon: Building2 },
    { label: 'Rent', route: 'rent', icon: Building2 },
    { label: 'Sell', route: 'sell', icon: FilePlus },
    { label: 'Agents', route: 'agents', icon: Users },
    { label: 'About', route: 'about', icon: Info },
    { label: 'Blog', route: 'blog', icon: BookOpen },
    { label: 'Contact', route: 'contact', icon: Mail },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header
      id="growth-realtors-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-black/5 shadow-sm py-3.5'
          : 'bg-[#FDFCF9]/90 backdrop-blur-sm border-b border-black/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LOGO & BRAND */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 bg-[#1A1A1A] flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <div className="w-4 h-4 border border-white rotate-45"></div>
            </div>
            <div>
              <span className="block font-serif text-base sm:text-lg font-bold tracking-tighter text-[#1A1A1A] group-hover:text-[#B5945E] transition-colors">
                GROWTH REALTORS
              </span>
              <span className="block text-[8px] tracking-[0.2em] uppercase text-[#1A1A1A]/50 font-medium -mt-1">
                Luxury Real Estate
              </span>
            </div>
          </button>

          {/* DESKTOP NAVIGATION LINKS */}
          <nav className="hidden xl:flex items-center gap-6 text-[11px] uppercase tracking-[0.15em] font-medium">
            {navLinks.map(link => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  id={`nav-link-${link.route}`}
                  onClick={() => handleNavClick(link.route)}
                  className={`transition-colors py-1 relative ${
                    isActive
                      ? 'text-[#B5945E] font-bold after:content-[""] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-0.5 after:bg-[#B5945E]'
                      : 'text-[#1A1A1A]/70 hover:text-[#B5945E]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Quick Search */}
            <button
              id="nav-quick-search-btn"
              onClick={onOpenSearch}
              className="p-2 rounded text-[#1A1A1A]/70 hover:text-[#B5945E] hover:bg-black/5 transition-all"
              title="Search Properties"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mortgage Calculator Shortcut */}
            {onOpenMortgageCalculator && (
              <button
                id="nav-mortgage-calc-btn"
                onClick={onOpenMortgageCalculator}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-widest font-medium text-[#1A1A1A]/80 hover:text-[#B5945E] border border-black/10 hover:border-[#B5945E] transition-all bg-white"
                title="Mortgage Calculator"
              >
                <Calculator className="w-3.5 h-3.5 text-[#B5945E]" />
                <span>Calculator</span>
              </button>
            )}

            {/* Favorites Icon with count */}
            <button
              id="nav-favorites-btn"
              onClick={() => handleNavClick('favorites')}
              className="relative p-2 rounded text-[#1A1A1A]/70 hover:text-[#B5945E] hover:bg-black/5 transition-all"
              title="Saved Favorites"
            >
              <Heart className={`w-4 h-4 ${favoriteIds.length > 0 ? 'text-[#B5945E] fill-[#B5945E]' : ''}`} />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B5945E] text-white font-bold text-[9px] flex items-center justify-center">
                  {favoriteIds.length}
                </span>
              )}
            </button>

            {/* User Account / Login Button */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  id="nav-user-dropdown-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-[#F7F5F2] hover:bg-[#EAE7E2] border border-black/10 text-xs font-medium text-[#1A1A1A] transition-all focus:outline-none"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 object-cover border border-[#B5945E]/40"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-[#1A1A1A] text-white font-bold text-[10px] flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium max-w-[100px] truncate hidden sm:inline-block">
                    {user.name.split(' ')[0]}
                  </span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider bg-[#B5945E] text-white hidden md:inline-block">
                      ADMIN
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-[#1A1A1A]/50" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div
                    id="nav-user-dropdown-menu"
                    className="absolute right-0 mt-2 w-56 bg-white border border-black/10 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-[#1A1A1A]"
                  >
                    <div className="px-4 py-2.5 border-b border-black/5">
                      <p className="text-[10px] uppercase tracking-wider text-black/40 font-bold">Signed in as</p>
                      <p className="text-sm font-semibold text-[#1A1A1A] truncate">{user.name}</p>
                      <p className="text-xs text-black/50 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNavClick('profile')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-[#1A1A1A]/80 hover:text-[#B5945E] hover:bg-black/5 flex items-center gap-2.5"
                      >
                        <User className="w-4 h-4 text-[#B5945E]" />
                        <span>My Dashboard & Inquiries</span>
                      </button>

                      <button
                        onClick={() => handleNavClick('favorites')}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-[#1A1A1A]/80 hover:text-[#B5945E] hover:bg-black/5 flex items-center gap-2.5"
                      >
                        <Heart className="w-4 h-4 text-[#B5945E]" />
                        <span>Favorite Properties ({favoriteIds.length})</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => handleNavClick('admin')}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-[#B5945E] hover:bg-[#B5945E]/10 flex items-center gap-2.5"
                        >
                          <Shield className="w-4 h-4 text-[#B5945E]" />
                          <span>Admin Portal</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-black/5">
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="nav-login-btn"
                onClick={() => openAuthModal('login')}
                className="bg-[#1A1A1A] text-white px-5 py-2 text-[10px] uppercase tracking-widest hover:bg-[#B5945E] transition-all font-medium shadow-sm"
              >
                Account
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              id="nav-mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-[#1A1A1A] hover:text-[#B5945E] hover:bg-black/5"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE FULL DRAWER NAVIGATION */}
      {isMobileMenuOpen && (
        <div
          id="nav-mobile-drawer"
          className="xl:hidden bg-white border-b border-black/10 px-4 pt-4 pb-6 space-y-2 max-h-[85vh] overflow-y-auto shadow-xl"
        >
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-black/5">
            <button
              onClick={() => handleNavClick('sell')}
              className="py-2 px-3 bg-[#B5945E] text-white text-[10px] uppercase tracking-widest font-bold text-center"
            >
              + Sell Property
            </button>
            <button
              onClick={() => {
                onOpenSearch?.();
                setIsMobileMenuOpen(false);
              }}
              className="py-2 px-3 bg-white text-[#1A1A1A] text-[10px] uppercase tracking-widest font-bold text-center border border-black/10"
            >
              Search Listings
            </button>
          </div>

          <div className="space-y-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                    isActive
                      ? 'bg-[#F7F5F2] text-[#B5945E] font-bold border-l-2 border-[#B5945E]'
                      : 'text-[#1A1A1A]/80 hover:bg-black/5 hover:text-[#B5945E]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#B5945E]' : 'text-stone-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {isAdmin && (
            <div className="pt-2 border-t border-black/5">
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase tracking-wider font-bold text-[#B5945E] bg-[#B5945E]/10 border border-[#B5945E]/30"
              >
                <Shield className="w-4 h-4 text-[#B5945E]" />
                <span>Admin Management Portal</span>
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-black/5 flex items-center justify-between text-[10px] uppercase tracking-wider text-black/50 px-2">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#B5945E]" />
              +92 51 8899770
            </span>
            <span>Islamabad • Lahore • Karachi</span>
          </div>
        </div>
      )}
    </header>
  );
};
