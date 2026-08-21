export type UserRole = 'user' | 'agent' | 'admin';

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  profileImage?: string;
  favorites: string[];
  createdAt: string;
}

export type PropertyType = 'Villa' | 'Apartment' | 'Penthouse' | 'Mansion' | 'Townhouse' | 'Commercial' | 'Plot';
export type ListingType = 'Buy' | 'Rent';
export type PropertyStatus = 'Available' | 'Under Offer' | 'Sold' | 'Rented';

export interface IProperty {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  priceUsd?: number;
  currency: string;
  location: string;
  address: string;
  city: string;
  propertyType: PropertyType;
  listingType: ListingType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: 'sq ft' | 'Marla' | 'Kanal';
  yearBuilt: number;
  images: string[];
  featuredImage: string;
  amenities: string[];
  features: string[];
  status: PropertyStatus;
  isFeatured: boolean;
  agentId: string;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  agentImage?: string;
  videoTourUrl?: string;
  floorPlanUrl?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  image: string;
  position: string;
  bio: string;
  experienceYears: number;
  specialization: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  propertiesCount: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  properties?: IProperty[];
}

export interface IInquiry {
  id: string;
  userId?: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'Pending' | 'Contacted' | 'Closed';
  adminNotes?: string;
  createdAt: string;
}

export interface IViewingRequest {
  id: string;
  userId?: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  message?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  adminNotes?: string;
  createdAt: string;
}

export interface IContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
  createdAt: string;
}

export interface IPropertySubmission {
  id: string;
  userId?: string;
  ownerName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  city: string;
  propertyType: PropertyType;
  listingType: ListingType;
  askingPrice: number;
  area: number;
  areaUnit: 'sq ft' | 'Marla' | 'Kanal';
  bedrooms: number;
  bathrooms: number;
  description: string;
  images: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
  adminNotes?: string;
  createdAt: string;
}

export interface IBlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  readTime: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITestimonial {
  id: string;
  clientName: string;
  clientTitle: string;
  clientImage: string;
  rating: number;
  review: string;
  propertyType: string;
  location: string;
  transactionType: 'Bought' | 'Sold' | 'Rented' | 'Investment';
  createdAt: string;
}

export interface IAdminStats {
  totalProperties: number;
  activeListings: number;
  soldProperties: number;
  rentalProperties: number;
  totalUsers: number;
  totalAgents: number;
  totalInquiries: number;
  pendingInquiries: number;
  totalViewings: number;
  pendingViewings: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  totalMessages: number;
  unreadMessages: number;
  totalBlogPosts: number;
  totalPortfolioValue: number;
}
