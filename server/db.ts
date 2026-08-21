import fs from 'fs';
import path from 'path';
import { IUser, IProperty, IAgent, IInquiry, IViewingRequest, IContactMessage, IPropertySubmission, IBlogPost, ITestimonial } from './types';
import { generateSeedData } from './seedData';

interface DatabaseSchema {
  users: IUser[];
  properties: IProperty[];
  agents: IAgent[];
  inquiries: IInquiry[];
  viewingRequests: IViewingRequest[];
  contactMessages: IContactMessage[];
  propertySubmissions: IPropertySubmission[];
  blogPosts: IBlogPost[];
  testimonials: ITestimonial[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'growth_realtors_db.json');

class Database {
  private data: DatabaseSchema;
  private isLoaded = false;

  constructor() {
    this.data = {
      users: [],
      properties: [],
      agents: [],
      inquiries: [],
      viewingRequests: [],
      contactMessages: [],
      propertySubmissions: [],
      blogPosts: [],
      testimonials: []
    };
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        if (fileContent.trim()) {
          const parsed = JSON.parse(fileContent);
          this.data = {
            users: parsed.users || [],
            properties: parsed.properties || [],
            agents: parsed.agents || [],
            inquiries: parsed.inquiries || [],
            viewingRequests: parsed.viewingRequests || [],
            contactMessages: parsed.contactMessages || [],
            propertySubmissions: parsed.propertySubmissions || [],
            blogPosts: parsed.blogPosts || [],
            testimonials: parsed.testimonials || []
          };
          this.isLoaded = true;
          // If properties are empty, re-seed
          if (this.data.properties.length === 0) {
            this.seed();
          }
          return;
        }
      }

      // If file doesn't exist or is empty, seed
      this.seed();
    } catch (err) {
      console.error('Error initializing database file, falling back to seed in memory:', err);
      this.seed();
    }
  }

  private seed() {
    const seed = generateSeedData();
    this.data.users = seed.users;
    this.data.properties = seed.properties;
    this.data.agents = seed.agents;
    this.data.blogPosts = seed.blogPosts;
    this.data.testimonials = seed.testimonials;
    
    // Sample initial inquiry and viewing request
    this.data.inquiries = [
      {
        id: 'inq-1',
        userId: 'usr-demo-1',
        propertyId: 'prop-1',
        propertyTitle: 'The Margalla Horizon Estate - 2 Kanal Architectural Mansion',
        name: 'Hamza Khan',
        email: 'user@growthrealtors.com',
        phone: '+92 300 1234567',
        message: 'Interested in scheduling a private VIP walkthrough and discussing title transfer timelines.',
        status: 'Contacted',
        adminNotes: 'Spoke with client on phone. Scheduled initial briefing with Tariq Malik.',
        createdAt: '2025-02-15T14:30:00.000Z'
      }
    ];

    this.data.viewingRequests = [
      {
        id: 'vr-1',
        userId: 'usr-demo-1',
        propertyId: 'prop-2',
        propertyTitle: 'Royal Palms Grand Villa - 1 Kanal Designer Residence',
        name: 'Hamza Khan',
        email: 'user@growthrealtors.com',
        phone: '+92 300 1234567',
        date: '2025-03-05',
        time: '15:00',
        message: 'Requesting on-site inspection with family.',
        status: 'Approved',
        adminNotes: 'Confirmed with Ayesha Rahman.',
        createdAt: '2025-02-18T10:15:00.000Z'
      }
    ];

    this.data.contactMessages = [
      {
        id: 'msg-1',
        name: 'Syed Ali Raza',
        email: 'ali.raza@example.com',
        phone: '+92 321 9876543',
        subject: 'Commercial Portfolio Consultation in Islamabad',
        message: 'Looking for 2-3 Kanal commercial development land or retail plaza investment in Islamabad Blue Area or Gulberg.',
        status: 'Read',
        createdAt: '2025-02-19T09:00:00.000Z'
      }
    ];

    this.data.propertySubmissions = [
      {
        id: 'sub-1',
        userId: 'usr-demo-1',
        ownerName: 'Hamza Khan',
        email: 'user@growthrealtors.com',
        phone: '+92 300 1234567',
        propertyAddress: 'House 42, Street 9, Sector F-8/3, Islamabad',
        city: 'Islamabad',
        propertyType: 'Villa',
        listingType: 'Buy',
        askingPrice: 220000000,
        area: 5400,
        areaUnit: 'sq ft',
        bedrooms: 5,
        bathrooms: 6,
        description: 'Brand new 1.2 Kanal designer house with imported finishes, pool, and basement theater. Available for immediate sale.',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
        ],
        status: 'Pending',
        createdAt: '2025-02-20T11:00:00.000Z'
      }
    ];

    this.save();
  }

  private save() {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database to disk:', err);
    }
  }

  // USERS
  public getUsers(): IUser[] {
    return this.data.users;
  }

  public findUserById(id: string): IUser | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public findUserByEmail(email: string): IUser | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: IUser): IUser {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<IUser>): IUser | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = {
      ...this.data.users[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.users[idx];
  }

  public deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    if (this.data.users.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // FAVORITES
  public toggleFavorite(userId: string, propertyId: string): { isFavorite: boolean; favorites: string[] } {
    const user = this.findUserById(userId);
    if (!user) throw new Error('User not found');

    if (!user.favorites) {
      user.favorites = [];
    }

    const index = user.favorites.indexOf(propertyId);
    let isFavorite = false;
    if (index > -1) {
      user.favorites.splice(index, 1);
      isFavorite = false;
    } else {
      user.favorites.push(propertyId);
      isFavorite = true;
    }

    this.save();
    return { isFavorite, favorites: user.favorites };
  }

  // PROPERTIES
  public getProperties(query: {
    search?: string;
    city?: string;
    propertyType?: string;
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    minArea?: number;
    status?: string;
    isFeatured?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }): { properties: IProperty[]; total: number; page: number; totalPages: number } {
    let list = [...this.data.properties];

    if (query.search) {
      const s = query.search.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(s) ||
        p.location.toLowerCase().includes(s) ||
        p.city.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.address.toLowerCase().includes(s)
      );
    }

    if (query.city) {
      list = list.filter(p => p.city.toLowerCase() === query.city!.toLowerCase());
    }

    if (query.propertyType && query.propertyType !== 'All') {
      list = list.filter(p => p.propertyType.toLowerCase() === query.propertyType!.toLowerCase());
    }

    if (query.listingType && query.listingType !== 'All') {
      list = list.filter(p => p.listingType.toLowerCase() === query.listingType!.toLowerCase());
    }

    if (query.minPrice !== undefined && !isNaN(query.minPrice)) {
      list = list.filter(p => p.price >= query.minPrice!);
    }

    if (query.maxPrice !== undefined && !isNaN(query.maxPrice)) {
      list = list.filter(p => p.price <= query.maxPrice!);
    }

    if (query.bedrooms !== undefined && !isNaN(query.bedrooms) && query.bedrooms > 0) {
      list = list.filter(p => p.bedrooms >= query.bedrooms!);
    }

    if (query.bathrooms !== undefined && !isNaN(query.bathrooms) && query.bathrooms > 0) {
      list = list.filter(p => p.bathrooms >= query.bathrooms!);
    }

    if (query.minArea !== undefined && !isNaN(query.minArea) && query.minArea > 0) {
      list = list.filter(p => p.area >= query.minArea!);
    }

    if (query.status && query.status !== 'All') {
      list = list.filter(p => p.status.toLowerCase() === query.status!.toLowerCase());
    }

    if (query.isFeatured !== undefined) {
      list = list.filter(p => p.isFeatured === query.isFeatured);
    }

    // Sorting
    switch (query.sort) {
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'oldest':
        list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    const total = list.length;
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 12;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return {
      properties: paginated,
      total,
      page,
      totalPages
    };
  }

  public getFeaturedProperties(limit = 6): IProperty[] {
    return this.data.properties.filter(p => p.isFeatured && p.status === 'Available').slice(0, limit);
  }

  public getPropertyById(id: string): IProperty | undefined {
    return this.data.properties.find(p => p.id === id);
  }

  public getPropertyBySlug(slug: string): IProperty | undefined {
    return this.data.properties.find(p => p.slug === slug || p.id === slug);
  }

  public createProperty(property: IProperty): IProperty {
    this.data.properties.unshift(property);
    this.save();
    return property;
  }

  public updateProperty(id: string, updates: Partial<IProperty>): IProperty | null {
    const idx = this.data.properties.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.properties[idx] = {
      ...this.data.properties[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.properties[idx];
  }

  public deleteProperty(id: string): boolean {
    const initialLen = this.data.properties.length;
    this.data.properties = this.data.properties.filter(p => p.id !== id);
    if (this.data.properties.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // AGENTS
  public getAgents(): IAgent[] {
    return this.data.agents;
  }

  public getAgentById(id: string): IAgent | undefined {
    return this.data.agents.find(a => a.id === id);
  }

  public createAgent(agent: IAgent): IAgent {
    this.data.agents.push(agent);
    this.save();
    return agent;
  }

  public updateAgent(id: string, updates: Partial<IAgent>): IAgent | null {
    const idx = this.data.agents.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.agents[idx] = { ...this.data.agents[idx], ...updates };
    this.save();
    return this.data.agents[idx];
  }

  public deleteAgent(id: string): boolean {
    const initialLen = this.data.agents.length;
    this.data.agents = this.data.agents.filter(a => a.id !== id);
    if (this.data.agents.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // INQUIRIES
  public getInquiries(userId?: string): IInquiry[] {
    if (userId) {
      return this.data.inquiries.filter(i => i.userId === userId);
    }
    return this.data.inquiries;
  }

  public createInquiry(inquiry: IInquiry): IInquiry {
    this.data.inquiries.unshift(inquiry);
    this.save();
    return inquiry;
  }

  public updateInquiry(id: string, updates: Partial<IInquiry>): IInquiry | null {
    const idx = this.data.inquiries.findIndex(i => i.id === id);
    if (idx === -1) return null;
    this.data.inquiries[idx] = { ...this.data.inquiries[idx], ...updates };
    this.save();
    return this.data.inquiries[idx];
  }

  public deleteInquiry(id: string): boolean {
    const initialLen = this.data.inquiries.length;
    this.data.inquiries = this.data.inquiries.filter(i => i.id !== id);
    if (this.data.inquiries.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // VIEWING REQUESTS
  public getViewingRequests(userId?: string): IViewingRequest[] {
    if (userId) {
      return this.data.viewingRequests.filter(v => v.userId === userId);
    }
    return this.data.viewingRequests;
  }

  public createViewingRequest(viewing: IViewingRequest): IViewingRequest {
    this.data.viewingRequests.unshift(viewing);
    this.save();
    return viewing;
  }

  public updateViewingRequest(id: string, updates: Partial<IViewingRequest>): IViewingRequest | null {
    const idx = this.data.viewingRequests.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.data.viewingRequests[idx] = { ...this.data.viewingRequests[idx], ...updates };
    this.save();
    return this.data.viewingRequests[idx];
  }

  public deleteViewingRequest(id: string): boolean {
    const initialLen = this.data.viewingRequests.length;
    this.data.viewingRequests = this.data.viewingRequests.filter(v => v.id !== id);
    if (this.data.viewingRequests.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // PROPERTY SUBMISSIONS (SELL)
  public getPropertySubmissions(userId?: string): IPropertySubmission[] {
    if (userId) {
      return this.data.propertySubmissions.filter(s => s.userId === userId);
    }
    return this.data.propertySubmissions;
  }

  public createPropertySubmission(sub: IPropertySubmission): IPropertySubmission {
    this.data.propertySubmissions.unshift(sub);
    this.save();
    return sub;
  }

  public updatePropertySubmission(id: string, updates: Partial<IPropertySubmission>): IPropertySubmission | null {
    const idx = this.data.propertySubmissions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.data.propertySubmissions[idx] = { ...this.data.propertySubmissions[idx], ...updates };
    this.save();
    return this.data.propertySubmissions[idx];
  }

  public deletePropertySubmission(id: string): boolean {
    const initialLen = this.data.propertySubmissions.length;
    this.data.propertySubmissions = this.data.propertySubmissions.filter(s => s.id !== id);
    if (this.data.propertySubmissions.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // CONTACT MESSAGES
  public getContactMessages(): IContactMessage[] {
    return this.data.contactMessages;
  }

  public createContactMessage(msg: IContactMessage): IContactMessage {
    this.data.contactMessages.unshift(msg);
    this.save();
    return msg;
  }

  public updateContactMessage(id: string, updates: Partial<IContactMessage>): IContactMessage | null {
    const idx = this.data.contactMessages.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.contactMessages[idx] = { ...this.data.contactMessages[idx], ...updates };
    this.save();
    return this.data.contactMessages[idx];
  }

  public deleteContactMessage(id: string): boolean {
    const initialLen = this.data.contactMessages.length;
    this.data.contactMessages = this.data.contactMessages.filter(m => m.id !== id);
    if (this.data.contactMessages.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // BLOG
  public getBlogPosts(category?: string): IBlogPost[] {
    let posts = [...this.data.blogPosts];
    if (category && category !== 'All') {
      posts = posts.filter(b => b.category.toLowerCase() === category.toLowerCase());
    }
    return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getBlogPostBySlug(slug: string): IBlogPost | undefined {
    return this.data.blogPosts.find(b => b.slug === slug || b.id === slug);
  }

  public createBlogPost(post: IBlogPost): IBlogPost {
    this.data.blogPosts.unshift(post);
    this.save();
    return post;
  }

  public updateBlogPost(id: string, updates: Partial<IBlogPost>): IBlogPost | null {
    const idx = this.data.blogPosts.findIndex(b => b.id === id);
    if (idx === -1) return null;
    this.data.blogPosts[idx] = {
      ...this.data.blogPosts[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.blogPosts[idx];
  }

  public deleteBlogPost(id: string): boolean {
    const initialLen = this.data.blogPosts.length;
    this.data.blogPosts = this.data.blogPosts.filter(b => b.id !== id);
    if (this.data.blogPosts.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // TESTIMONIALS
  public getTestimonials(): ITestimonial[] {
    return this.data.testimonials;
  }

  public createTestimonial(test: ITestimonial): ITestimonial {
    this.data.testimonials.unshift(test);
    this.save();
    return test;
  }

  public updateTestimonial(id: string, updates: Partial<ITestimonial>): ITestimonial | null {
    const idx = this.data.testimonials.findIndex(t => t.id === id);
    if (idx === -1) return null;
    this.data.testimonials[idx] = { ...this.data.testimonials[idx], ...updates };
    this.save();
    return this.data.testimonials[idx];
  }

  public deleteTestimonial(id: string): boolean {
    const initialLen = this.data.testimonials.length;
    this.data.testimonials = this.data.testimonials.filter(t => t.id !== id);
    if (this.data.testimonials.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // ADMIN STATS
  public getAdminStats() {
    const totalProperties = this.data.properties.length;
    const activeListings = this.data.properties.filter(p => p.status === 'Available').length;
    const soldProperties = this.data.properties.filter(p => p.status === 'Sold').length;
    const rentalProperties = this.data.properties.filter(p => p.listingType === 'Rent').length;
    const totalUsers = this.data.users.length;
    const totalAgents = this.data.agents.length;
    const pendingInquiries = this.data.inquiries.filter(i => i.status === 'Pending').length;
    const pendingViewings = this.data.viewingRequests.filter(v => v.status === 'Pending').length;
    const pendingSubmissions = this.data.propertySubmissions.filter(s => s.status === 'Pending').length;
    const unreadMessages = this.data.contactMessages.filter(m => m.status === 'Unread').length;

    const totalPortfolioValue = this.data.properties.reduce((acc, p) => acc + p.price, 0);

    return {
      totalProperties,
      activeListings,
      soldProperties,
      rentalProperties,
      totalUsers,
      totalAgents,
      totalInquiries: this.data.inquiries.length,
      pendingInquiries,
      totalViewings: this.data.viewingRequests.length,
      pendingViewings,
      totalSubmissions: this.data.propertySubmissions.length,
      pendingSubmissions,
      totalMessages: this.data.contactMessages.length,
      unreadMessages,
      totalBlogPosts: this.data.blogPosts.length,
      totalPortfolioValue
    };
  }
}

export const db = new Database();
