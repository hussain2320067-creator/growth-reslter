import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Inbox,
  Calendar,
  FilePlus2,
  Users,
  BookOpen,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  X,
  Sparkles,
  Save,
  RotateCcw
} from 'lucide-react';
import {
  IProperty,
  IInquiry,
  IViewingRequest,
  IPropertySubmission,
  IAgent,
  IBlogPost,
  IUser,
  PropertyType,
  ListingType
} from '../types';
import {
  adminService,
  propertyService,
  inquiryService,
  viewingService,
  sellService,
  agentService,
  blogService
} from '../services/api';
import { formatPKRPrice } from '../components/common/PropertyCard';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardPageProps {
  navigate: (route: string, params?: Record<string, any>) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { success, error, info } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'properties' | 'inquiries' | 'viewings' | 'submissions' | 'agents' | 'blog' | 'users'
  >('overview');

  const [stats, setStats] = useState<any>(null);
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [viewings, setViewings] = useState<IViewingRequest[]>([]);
  const [submissions, setSubmissions] = useState<IPropertySubmission[]>([]);
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [posts, setPosts] = useState<IBlogPost[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Property Modal State (Create / Edit)
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [propForm, setPropForm] = useState({
    title: '',
    description: '',
    propertyType: 'Villa' as PropertyType,
    listingType: 'Buy' as ListingType,
    price: 85000000,
    priceUsd: 300000,
    city: 'Islamabad',
    location: 'Sector F-7',
    address: 'Street 18, Sector F-7/2',
    bedrooms: 5,
    bathrooms: 6,
    area: 1,
    areaUnit: 'Kanal',
    yearBuilt: 2024,
    featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    images: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    features: 'Smart Home Automation, Italian Marble Flooring, Swimming Pool, Servant Quarters, Solar System',
    amenities: '24/7 Security, Backup Generator, Central Air Conditioning, Private Garden',
    isFeatured: false,
    status: 'available'
  });

  // Agent Modal State
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [agentForm, setAgentForm] = useState({
    name: '',
    role: '',
    position: 'Senior Real Estate Advisor',
    phone: '+92 300 1234567',
    email: '',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    specialization: 'Islamabad Luxury Mansions & Diplomatic Enclaves',
    experienceYears: 10
  });

  // Blog Modal State
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Market Trends',
    excerpt: '',
    content: '',
    featuredImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    tags: 'Islamabad, Real Estate, Investment',
    readTime: '4 min read'
  });

  // Load Admin Data
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, propsRes, inqRes, viewRes, subRes, agentRes, blogRes, userRes] = await Promise.all([
        adminService.getStats(),
        propertyService.getProperties({ limit: 100 }),
        inquiryService.getInquiries(),
        viewingService.getViewings(),
        sellService.getSubmissions(),
        agentService.getAgents(),
        blogService.getPosts(),
        adminService.getUsers()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (propsRes.success) setProperties(propsRes.properties);
      if (inqRes.success) setInquiries(inqRes.inquiries);
      if (viewRes.success) setViewings(viewRes.viewings);
      if (subRes.success) setSubmissions(subRes.submissions);
      if (agentRes.success) setAgents(agentRes.agents);
      if (blogRes.success) setPosts(blogRes.posts);
      if (userRes.success) setUsers(userRes.users);
    } catch (err: any) {
      console.error('Admin loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 pt-36 pb-24 text-center space-y-4">
        <div className="w-16 h-16 bg-[#FDFCF9] text-[#B5945E] border border-black/10 flex items-center justify-center mx-auto shadow-xs">
          <ShieldCheck className="w-8 h-8 text-[#B5945E]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Admin Privileges Required</h2>
        <p className="text-xs text-black/60">
          This portal is restricted to authorized Growth Realtors administrators.
        </p>
        <button
          onClick={() => navigate('home')}
          className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
        >
          Return to Public Site
        </button>
      </div>
    );
  }

  // --- PROPERTY HANDLERS ---
  const handleOpenCreateProperty = () => {
    setEditingPropertyId(null);
    setPropForm({
      title: '',
      description: '',
      propertyType: 'Villa',
      listingType: 'Buy',
      price: 85000000,
      priceUsd: 300000,
      city: 'Islamabad',
      location: 'Sector F-7',
      address: 'Street 18, Sector F-7/2',
      bedrooms: 5,
      bathrooms: 6,
      area: 1,
      areaUnit: 'Kanal',
      yearBuilt: 2024,
      featuredImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      images: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      features: 'Smart Home Automation, Italian Marble Flooring, Swimming Pool, Servant Quarters, Solar System',
      amenities: '24/7 Security, Backup Generator, Central Air Conditioning, Private Garden',
      isFeatured: false,
      status: 'available'
    });
    setIsPropertyModalOpen(true);
  };

  const handleOpenEditProperty = (prop: IProperty) => {
    setEditingPropertyId(prop.id);
    setPropForm({
      title: prop.title,
      description: prop.description,
      propertyType: prop.propertyType,
      listingType: prop.listingType,
      price: prop.price,
      priceUsd: prop.priceUsd || Math.round(prop.price / 280),
      city: prop.city,
      location: prop.location,
      address: prop.address,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      area: prop.area,
      areaUnit: prop.areaUnit,
      yearBuilt: prop.yearBuilt,
      featuredImage: prop.featuredImage,
      images: prop.images?.join('\n') || prop.featuredImage,
      features: prop.features?.join(', ') || '',
      amenities: prop.amenities?.join(', ') || '',
      isFeatured: prop.isFeatured || false,
      status: prop.status
    });
    setIsPropertyModalOpen(true);
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...propForm,
        images: propForm.images.split('\n').map(s => s.trim()).filter(Boolean),
        features: propForm.features.split(',').map(s => s.trim()).filter(Boolean),
        amenities: propForm.amenities.split(',').map(s => s.trim()).filter(Boolean)
      };

      if (editingPropertyId) {
        const res = await propertyService.updateProperty(editingPropertyId, payload);
        if (res.success) {
          success('Property updated successfully.');
          setIsPropertyModalOpen(false);
          loadAdminData();
        }
      } else {
        const res = await propertyService.createProperty(payload);
        if (res.success) {
          success('New luxury property published to live catalog.');
          setIsPropertyModalOpen(false);
          loadAdminData();
        }
      }
    } catch (err: any) {
      error(err.message || 'Failed to save property.');
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this property listing?')) return;
    try {
      const res = await propertyService.deleteProperty(id);
      if (res.success) {
        success('Property listing removed.');
        loadAdminData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to delete property.');
    }
  };

  // --- INQUIRY HANDLERS ---
  const handleUpdateInquiryStatus = async (id: string, status: any) => {
    try {
      const res = await inquiryService.updateInquiry(id, { status });
      if (res.success) {
        success('Inquiry status updated.');
        loadAdminData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update inquiry.');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Delete this client inquiry?')) return;
    try {
      const res = await inquiryService.deleteInquiry(id);
      if (res.success) {
        success('Inquiry deleted.');
        loadAdminData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to delete inquiry.');
    }
  };

  // --- VIEWING HANDLERS ---
  const handleUpdateViewingStatus = async (id: string, status: any) => {
    try {
      const res = await viewingService.updateViewing(id, { status });
      if (res.success) {
        success('Viewing appointment status updated.');
        loadAdminData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update viewing.');
    }
  };

  // --- SUBMISSION HANDLERS ---
  const handleUpdateSubmissionStatus = async (id: string, status: any) => {
    try {
      const res = await sellService.updateSubmission(id, { status });
      if (res.success) {
        success(`Submission marked as ${status}.`);
        loadAdminData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to update submission.');
    }
  };

  // --- AGENT HANDLERS ---
  const handleSaveAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await agentService.createAgent(agentForm);
      if (res.success) {
        success('Senior Advisor added to council.');
        setIsAgentModalOpen(false);
        loadAdminData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to add advisor.');
    }
  };

  const handleDeleteAgent = async (id: string) => {
    if (!confirm('Remove this advisor from the council?')) return;
    try {
      const res = await agentService.deleteAgent(id);
      if (res.success) {
        success('Advisor removed.');
        loadAdminData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to delete advisor.');
    }
  };

  // --- BLOG HANDLERS ---
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...blogForm,
        tags: blogForm.tags.split(',').map(s => s.trim()).filter(Boolean),
        author: {
          name: user?.name || 'Growth Research Desk',
          role: 'Senior Market Strategist',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        }
      };
      const res = await blogService.createPost(payload);
      if (res.success) {
        success('Article published to Journal.');
        setIsBlogModalOpen(false);
        loadAdminData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to publish article.');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Delete this journal article?')) return;
    try {
      const res = await blogService.deletePost(id);
      if (res.success) {
        success('Article deleted.');
        loadAdminData();
      }
    } catch (err: any) {
      error(err.message || 'Failed to delete article.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-white border border-black/10 shadow-sm relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B5945E] block">
            Executive Command Center
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
            Growth Realtors Admin Portal
          </h1>
          <p className="text-xs text-black/60">
            Real-time management of properties, client inquiries, private viewings, and market intelligence.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#FDFCF9] border border-black/10 text-black/70 text-xs font-bold uppercase tracking-wider hover:text-black self-start sm:self-auto transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* TABS NAVIGATION BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin border-b border-black/10">
        {[
          { id: 'overview', label: 'Overview & Metrics', icon: LayoutDashboard },
          { id: 'properties', label: `Properties (${properties.length})`, icon: Building2 },
          { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Inbox },
          { id: 'viewings', label: `Viewings (${viewings.length})`, icon: Calendar },
          { id: 'submissions', label: `Submissions (${submissions.length})`, icon: FilePlus2 },
          { id: 'agents', label: `Advisors (${agents.length})`, icon: Users },
          { id: 'blog', label: `Journal (${posts.length})`, icon: BookOpen },
          { id: 'users', label: `Registered Users (${users.length})`, icon: ShieldCheck }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#1A1A1A] text-white shadow-sm'
                  : 'bg-white text-black/60 hover:text-black border border-black/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white border border-black/10 shadow-sm space-y-1">
              <div className="text-xs text-black/60 font-medium flex items-center justify-between">
                <span>Active Properties</span>
                <Building2 className="w-4 h-4 text-[#B5945E]" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{properties.length}</div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Published in live portfolio</span>
            </div>

            <div className="p-5 bg-white border border-black/10 shadow-sm space-y-1">
              <div className="text-xs text-black/60 font-medium flex items-center justify-between">
                <span>Direct Inquiries</span>
                <Inbox className="w-4 h-4 text-blue-600" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{inquiries.length}</div>
              <span className="text-[10px] text-black/50">
                {inquiries.filter(i => i.status === 'new').length} new unread
              </span>
            </div>

            <div className="p-5 bg-white border border-black/10 shadow-sm space-y-1">
              <div className="text-xs text-black/60 font-medium flex items-center justify-between">
                <span>Scheduled Viewings</span>
                <Calendar className="w-4 h-4 text-[#B5945E]" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{viewings.length}</div>
              <span className="text-[10px] text-[#B5945E] font-semibold">VIP Walkthroughs</span>
            </div>

            <div className="p-5 bg-white border border-black/10 shadow-sm space-y-1">
              <div className="text-xs text-black/60 font-medium flex items-center justify-between">
                <span>Owner Submissions</span>
                <FilePlus2 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">{submissions.length}</div>
              <span className="text-[10px] text-black/50">Pending review desk</span>
            </div>
          </div>

          {/* Quick Action Tables (Recent Inquiries & Recent Submissions) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Inquiries */}
            <div className="p-6 bg-white border border-black/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Recent Client Inquiries</h3>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className="text-xs text-[#B5945E] font-bold uppercase tracking-wider hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {inquiries.slice(0, 5).map((inq) => (
                  <div key={inq.id} className="p-3 bg-[#FDFCF9] border border-black/10 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-[#1A1A1A]">{inq.name}</h5>
                      <p className="text-[11px] text-black/60 truncate max-w-xs">{inq.message}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                      inq.status === 'new' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="p-6 bg-white border border-black/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Recent Owner Listings</h3>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className="text-xs text-[#B5945E] font-bold uppercase tracking-wider hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {submissions.slice(0, 5).map((sub) => (
                  <div key={sub.id} className="p-3 bg-[#FDFCF9] border border-black/10 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-[#1A1A1A]">{sub.propertyAddress}</h5>
                      <p className="text-[11px] text-black/60">{sub.propertyType} • {sub.city} • PKR {(sub.askingPrice / 10000000).toFixed(2)} Cr</p>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROPERTIES MANAGEMENT */}
      {activeTab === 'properties' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                Live Portfolio Management
              </h3>
              <p className="text-xs text-black/60">
                Manage, publish, feature, or archive luxury listings.
              </p>
            </div>

            <button
              onClick={handleOpenCreateProperty}
              className="px-5 py-2 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Property</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-black/10 bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-black/10 text-black/60 bg-[#FDFCF9]">
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Property</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Type & City</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Valuation (PKR)</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Specs</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Featured</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.featuredImage}
                          alt={p.title}
                          referrerPolicy="no-referrer"
                          className="w-12 h-9 object-cover border border-black/10"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-[#1A1A1A] block truncate">{p.title}</span>
                          <span className="text-[11px] text-black/50 truncate block">{p.address}, {p.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-[#1A1A1A]">{p.propertyType}</span>
                      <span className="text-black/50 block text-[11px]">{p.city} ({p.listingType})</span>
                    </td>
                    <td className="p-3.5 font-serif font-bold text-[#B5945E]">
                      {formatPKRPrice(p.price, p.listingType)}
                    </td>
                    <td className="p-3.5 text-black/70">
                      {p.bedrooms} Beds • {p.bathrooms} Baths • {p.area} {p.areaUnit}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                        p.isFeatured ? 'bg-[#FDFCF9] text-[#B5945E] border border-black/10' : 'bg-black/5 text-black/40'
                      }`}>
                        {p.isFeatured ? 'Featured' : 'Standard'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditProperty(p)}
                          className="p-1.5 bg-white text-black/70 hover:text-black border border-black/10 transition-colors"
                          title="Edit Property"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(p.id)}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
                          title="Delete Property"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INQUIRIES MANAGEMENT */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Client Inquiries</h3>
            <p className="text-xs text-black/60">Direct messages submitted from property cards & contact desk.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inquiries.map((inq) => (
              <div key={inq.id} className="p-5 bg-white border border-black/10 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#1A1A1A]">{inq.name}</h4>
                    <p className="text-xs text-[#B5945E]">{inq.email} • {inq.phone || 'No phone'}</p>
                  </div>
                  <select
                    value={inq.status}
                    onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value)}
                    className="bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-[11px] px-2 py-1 focus:outline-none focus:border-[#B5945E]"
                  >
                    <option value="new">New</option>
                    <option value="in-progress">In-Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <p className="text-xs text-black/70 p-3 bg-[#FDFCF9] border border-black/10">
                  "{inq.message}"
                </p>

                <div className="flex items-center justify-between text-[11px] text-black/50 pt-2 border-t border-black/10">
                  <span>Property Ref: {inq.propertyId || 'General Inquiry'}</span>
                  <button
                    onClick={() => handleDeleteInquiry(inq.id)}
                    className="text-red-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: VIEWINGS MANAGEMENT */}
      {activeTab === 'viewings' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Private Walkthrough Appointments</h3>
            <p className="text-xs text-black/60">Scheduled client visits and on-site property tours.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {viewings.map((view) => (
              <div key={view.id} className="p-5 bg-white border border-black/10 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#1A1A1A]">{view.name}</h4>
                    <p className="text-xs text-[#B5945E]">{view.email} • {view.phone}</p>
                  </div>
                  <select
                    value={view.status}
                    onChange={(e) => handleUpdateViewingStatus(view.id, e.target.value)}
                    className="bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-[11px] px-2 py-1 focus:outline-none focus:border-[#B5945E]"
                  >
                    <option value="pending">Pending Confirmation</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="p-3 bg-[#FDFCF9] border border-black/10 text-xs text-black/70 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#B5945E]" />
                    <span>Requested Date: <strong className="text-[#1A1A1A]">{view.preferredDate}</strong> ({view.preferredTime})</span>
                  </div>
                  {view.notes && <p className="text-black/60 italic">Notes: {view.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PROPERTY SUBMISSIONS */}
      {activeTab === 'submissions' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Owner Listing Submissions</h3>
            <p className="text-xs text-black/60">Properties submitted by owners for Growth Realtors advisory onboarding.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {submissions.map((sub) => (
              <div key={sub.id} className="p-5 bg-white border border-black/10 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[#1A1A1A]">{sub.propertyAddress}</h4>
                    <p className="text-xs text-[#B5945E]">{sub.city} • {sub.propertyType} • {sub.area} {sub.areaUnit}</p>
                  </div>
                  <select
                    value={sub.status}
                    onChange={(e) => handleUpdateSubmissionStatus(sub.id, e.target.value)}
                    className="bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-[11px] px-2 py-1 focus:outline-none focus:border-[#B5945E]"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="approved">Approved & Published</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="p-3 bg-[#FDFCF9] border border-black/10 text-xs text-black/70 space-y-1">
                  <div>Owner: <strong className="text-[#1A1A1A]">{sub.ownerName}</strong> ({sub.phone} • {sub.email})</div>
                  <div>Asking Price: <strong className="text-[#B5945E]">PKR {(sub.askingPrice / 10000000).toFixed(2)} Crore</strong></div>
                  <p className="text-black/60 line-clamp-2 mt-1">{sub.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: AGENTS ADVISORY COUNCIL */}
      {activeTab === 'agents' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Advisory Council Roster</h3>
              <p className="text-xs text-black/60">Senior brokers, legal directors, and portfolio specialists.</p>
            </div>
            <button
              onClick={() => setIsAgentModalOpen(true)}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Advisor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="p-4 bg-white border border-black/10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={agent.image} alt={agent.name} referrerPolicy="no-referrer" className="w-12 h-12 object-cover border border-black/10" />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-[#1A1A1A]">{agent.name}</h4>
                    <p className="text-[11px] text-[#B5945E]">{agent.position}</p>
                    <p className="text-[10px] text-black/50">{agent.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAgent(agent.id)}
                  className="p-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: BLOG JOURNAL */}
      {activeTab === 'blog' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Journal Articles & Analysis</h3>
              <p className="text-xs text-black/60">Publish thought leadership articles and market updates.</p>
            </div>
            <button
              onClick={() => setIsBlogModalOpen(true)}
              className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Article</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <div key={post.id} className="p-4 bg-white border border-black/10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={post.featuredImage} alt={post.title} referrerPolicy="no-referrer" className="w-16 h-12 object-cover border border-black/10" />
                  <div className="min-w-0 max-w-sm">
                    <h4 className="font-serif text-sm font-bold text-[#1A1A1A] truncate">{post.title}</h4>
                    <p className="text-[11px] text-[#B5945E]">{post.category} • {post.readTime}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteBlog(post.id)}
                  className="p-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: USERS */}
      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">Registered Client Accounts</h3>
            <p className="text-xs text-black/60">Total registered clients and system administrators.</p>
          </div>

          <div className="overflow-x-auto border border-black/10 bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-black/10 text-black/60 bg-[#FDFCF9]">
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">User</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Email</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Phone</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Role</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider text-[10px]">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="p-3.5 font-bold text-[#1A1A1A]">{u.name}</td>
                    <td className="p-3.5 text-black/70">{u.email}</td>
                    <td className="p-3.5 text-black/50">{u.phone || '—'}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-[#FDFCF9] text-[#B5945E] border border-black/10' : 'bg-black/5 text-black/60'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-black/40">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROPERTY MODAL (CREATE / EDIT) */}
      {isPropertyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-black/10 p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
                {editingPropertyId ? 'Edit Property Listing' : 'Publish New Luxury Property'}
              </h3>
              <button onClick={() => setIsPropertyModalOpen(false)} className="text-black/40 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-4">
              <div>
                <label className="block text-black/70 font-semibold mb-1">Property Title</label>
                <input
                  type="text"
                  value={propForm.title}
                  onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                  required
                  placeholder="e.g., Ultra-Luxury 2 Kanal Designer Mansion"
                  className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] focus:outline-none focus:border-[#B5945E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-black/70 font-semibold mb-1">Property Type</label>
                  <select
                    value={propForm.propertyType}
                    onChange={(e) => setPropForm({ ...propForm, propertyType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                  >
                    <option value="Villa">Villa</option>
                    <option value="Mansion">Mansion</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-black/70 font-semibold mb-1">Listing Purpose</label>
                  <select
                    value={propForm.listingType}
                    onChange={(e) => setPropForm({ ...propForm, listingType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                  >
                    <option value="Buy">For Sale</option>
                    <option value="Rent">For Rent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-black/70 font-semibold mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    value={propForm.price}
                    onChange={(e) => setPropForm({ ...propForm, price: Number(e.target.value) })}
                    required
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-black/70 font-semibold mb-1">City</label>
                  <select
                    value={propForm.city}
                    onChange={(e) => setPropForm({ ...propForm, city: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                  >
                    <option value="Islamabad">Islamabad</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-black/70 font-semibold mb-1">Location / Sector</label>
                  <input
                    type="text"
                    value={propForm.location}
                    onChange={(e) => setPropForm({ ...propForm, location: e.target.value })}
                    required
                    placeholder="Sector F-7"
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-black/70 font-semibold mb-1">Street Address</label>
                  <input
                    type="text"
                    value={propForm.address}
                    onChange={(e) => setPropForm({ ...propForm, address: e.target.value })}
                    required
                    placeholder="Street 18"
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-black/70 font-semibold mb-1">Beds</label>
                  <input
                    type="number"
                    value={propForm.bedrooms}
                    onChange={(e) => setPropForm({ ...propForm, bedrooms: Number(e.target.value) })}
                    className="w-full px-2 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-black/70 font-semibold mb-1">Baths</label>
                  <input
                    type="number"
                    value={propForm.bathrooms}
                    onChange={(e) => setPropForm({ ...propForm, bathrooms: Number(e.target.value) })}
                    className="w-full px-2 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-black/70 font-semibold mb-1">Area</label>
                  <input
                    type="number"
                    value={propForm.area}
                    onChange={(e) => setPropForm({ ...propForm, area: Number(e.target.value) })}
                    className="w-full px-2 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-black/70 font-semibold mb-1">Unit</label>
                  <select
                    value={propForm.areaUnit}
                    onChange={(e) => setPropForm({ ...propForm, areaUnit: e.target.value as any })}
                    className="w-full px-2 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                  >
                    <option value="Kanal">Kanal</option>
                    <option value="Marla">Marla</option>
                    <option value="sq ft">sq ft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-black/70 font-semibold mb-1">Featured Image URL</label>
                <input
                  type="url"
                  value={propForm.featuredImage}
                  onChange={(e) => setPropForm({ ...propForm, featuredImage: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-black/70 font-semibold mb-1">Gallery Images (1 per line)</label>
                <textarea
                  rows={2}
                  value={propForm.images}
                  onChange={(e) => setPropForm({ ...propForm, images: e.target.value })}
                  className="w-full p-2.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-black/70 font-semibold mb-1">Description Narrative</label>
                <textarea
                  rows={3}
                  value={propForm.description}
                  onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                  required
                  className="w-full p-2.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={propForm.isFeatured}
                  onChange={(e) => setPropForm({ ...propForm, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-[#B5945E]"
                />
                <label htmlFor="isFeatured" className="text-[#1A1A1A] font-semibold">
                  Promote as Featured Listing on Homepage
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setIsPropertyModalOpen(false)}
                  className="px-4 py-2 bg-black/5 text-black/70 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold uppercase tracking-wider transition-colors"
                >
                  {editingPropertyId ? 'Save Changes' : 'Publish Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AGENT MODAL */}
      {isAgentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-black/10 p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Add Advisor</h3>
              <button onClick={() => setIsAgentModalOpen(false)} className="text-black/40 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAgent} className="space-y-3">
              <div>
                <label className="block text-black/70 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={agentForm.name}
                  onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })}
                  required
                  placeholder="e.g. Daniyal Qureshi"
                  className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-black/70 font-semibold mb-1">Position / Title</label>
                <input
                  type="text"
                  value={agentForm.position}
                  onChange={(e) => setAgentForm({ ...agentForm, position: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-black/70 font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    value={agentForm.phone}
                    onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                  />
                </div>
                <div>
                  <label className="block text-black/70 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={agentForm.email}
                    onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-black/70 font-semibold mb-1">Headshot URL</label>
                <input
                  type="url"
                  value={agentForm.image}
                  onChange={(e) => setAgentForm({ ...agentForm, image: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setIsAgentModalOpen(false)}
                  className="px-4 py-2 bg-black/5 text-black/70 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold uppercase tracking-wider transition-colors"
                >
                  Add Advisor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOG MODAL */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-black/10 p-6 max-w-lg w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-black/10">
              <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">Publish Journal Article</h3>
              <button onClick={() => setIsBlogModalOpen(false)} className="text-black/40 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-3">
              <div>
                <label className="block text-black/70 font-semibold mb-1">Article Title</label>
                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  required
                  placeholder="Market Analysis 2025"
                  className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-black/70 font-semibold mb-1">Category</label>
                <select
                  value={blogForm.category}
                  onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                >
                  <option value="Market Trends">Market Trends</option>
                  <option value="Investment Advisory">Investment Advisory</option>
                  <option value="Architecture & Design">Architecture & Design</option>
                  <option value="Legal & Tax Framework">Legal & Tax Framework</option>
                </select>
              </div>

              <div>
                <label className="block text-black/70 font-semibold mb-1">Summary Excerpt</label>
                <textarea
                  rows={2}
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  required
                  className="w-full p-2.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-black/70 font-semibold mb-1">Full Article Content</label>
                <textarea
                  rows={4}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  required
                  className="w-full p-2.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A]"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 bg-black/5 text-black/70 font-bold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold uppercase tracking-wider transition-colors"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
