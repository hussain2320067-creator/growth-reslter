import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ToastProvider, useToast } from './context/ToastContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Modals
import { AuthModal } from './components/modals/AuthModal';
import { InquiryModal } from './components/modals/InquiryModal';
import { ViewingModal } from './components/modals/ViewingModal';
import { MortgageCalculatorModal } from './components/modals/MortgageCalculatorModal';
import { QuickSearchModal } from './components/modals/QuickSearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { BuyPage } from './pages/BuyPage';
import { RentPage } from './pages/RentPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';
import { SellPropertyPage } from './pages/SellPropertyPage';
import { AgentsPage } from './pages/AgentsPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { ContactPage } from './pages/ContactPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

import { IProperty, IBlogPost } from './types';

function MainApp() {
  const { user } = useAuth();
  
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<Record<string, any>>({});

  // Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isMortgageOpen, setIsMortgageOpen] = useState(false);
  const [mortgageInitialPrice, setMortgageInitialPrice] = useState<number>(75000000);
  
  const [inquiryProperty, setInquiryProperty] = useState<IProperty | null>(null);
  const [viewingProperty, setViewingProperty] = useState<IProperty | null>(null);

  // Router Navigator
  const navigate = (route: string, params: Record<string, any> = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Triggers
  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenMortgage = (price?: number) => {
    if (price) setMortgageInitialPrice(price);
    setIsMortgageOpen(true);
  };

  const handleSelectProperty = (property: IProperty) => {
    navigate('property-details', { id: property.slug || property.id });
  };

  const handleQuickInquire = (property: IProperty) => {
    setInquiryProperty(property);
  };

  const handleScheduleViewing = (property: IProperty) => {
    setViewingProperty(property);
  };

  const handleSelectBlogPost = (post: IBlogPost) => {
    navigate('blog-post', { slug: post.slug });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCF9] text-[#1A1A1A] font-sans selection:bg-[#B5945E] selection:text-white">
      
      {/* Top Fixed Header Navbar */}
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        onOpenAuth={() => handleOpenAuth('login')}
        onOpenSearch={() => setIsQuickSearchOpen(true)}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            navigate={navigate}
            onSelectProperty={handleSelectProperty}
            onQuickInquire={handleQuickInquire}
            onScheduleViewing={handleScheduleViewing}
            onSelectBlogPost={handleSelectBlogPost}
            onOpenMortgageCalculator={() => handleOpenMortgage(75000000)}
          />
        )}

        {currentRoute === 'properties' && (
          <PropertiesPage
            navigate={navigate}
            onSelectProperty={handleSelectProperty}
            onQuickInquire={handleQuickInquire}
            initialFilters={routeParams}
          />
        )}

        {currentRoute === 'buy' && (
          <BuyPage
            navigate={navigate}
            onSelectProperty={handleSelectProperty}
            onQuickInquire={handleQuickInquire}
            onOpenMortgageCalculator={() => handleOpenMortgage(85000000)}
          />
        )}

        {currentRoute === 'rent' && (
          <RentPage
            navigate={navigate}
            onSelectProperty={handleSelectProperty}
            onQuickInquire={handleQuickInquire}
          />
        )}

        {currentRoute === 'property-details' && (
          <PropertyDetailsPage
            propertyIdOrSlug={routeParams.id || '1'}
            navigate={navigate}
            onScheduleViewing={handleScheduleViewing}
            onOpenMortgageCalculator={(price) => handleOpenMortgage(price)}
          />
        )}

        {currentRoute === 'sell' && (
          <SellPropertyPage navigate={navigate} />
        )}

        {currentRoute === 'agents' && (
          <AgentsPage navigate={navigate} />
        )}

        {currentRoute === 'about' && (
          <AboutPage navigate={navigate} />
        )}

        {currentRoute === 'blog' && (
          <BlogPage navigate={navigate} />
        )}

        {currentRoute === 'blog-post' && (
          <BlogPostPage slug={routeParams.slug || ''} navigate={navigate} />
        )}

        {currentRoute === 'contact' && (
          <ContactPage navigate={navigate} initialSubject={routeParams.subject} />
        )}

        {currentRoute === 'favorites' && (
          <FavoritesPage
            navigate={navigate}
            onSelectProperty={handleSelectProperty}
            onQuickInquire={handleQuickInquire}
          />
        )}

        {currentRoute === 'profile' && (
          <ProfilePage
            navigate={navigate}
            onOpenAuthModal={() => handleOpenAuth('login')}
          />
        )}

        {currentRoute === 'admin' && (
          <AdminDashboardPage navigate={navigate} />
        )}
      </main>

      {/* Global Footer */}
      <Footer navigate={navigate} />

      {/* Global Functional Modals */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      <InquiryModal
        isOpen={!!inquiryProperty}
        onClose={() => setInquiryProperty(null)}
        property={inquiryProperty}
      />

      <ViewingModal
        isOpen={!!viewingProperty}
        onClose={() => setViewingProperty(null)}
        property={viewingProperty}
      />

      <MortgageCalculatorModal
        isOpen={isMortgageOpen}
        onClose={() => setIsMortgageOpen(false)}
        initialPrice={mortgageInitialPrice}
      />

      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        onSelectProperty={handleSelectProperty}
      />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <FavoritesProvider>
          <MainApp />
        </FavoritesProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
