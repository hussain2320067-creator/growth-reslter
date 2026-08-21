import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import {
  IUser,
  IProperty,
  IAgent,
  IInquiry,
  IViewingRequest,
  IPropertySubmission,
  IContactMessage,
  IBlogPost,
  ITestimonial,
  IAdminStats
} from '../types';

// Collection references
export const COLLECTIONS = {
  USERS: 'users',
  PROPERTIES: 'properties',
  AGENTS: 'agents',
  INQUIRIES: 'inquiries',
  VIEWINGS: 'viewingRequests',
  SUBMISSIONS: 'propertySubmissions',
  CONTACT: 'contactMessages',
  BLOGS: 'blogPosts',
  TESTIMONIALS: 'testimonials'
} as const;

// Auto-seed Firestore from backend API or default seed dataset if empty
export async function ensureFirestoreSeeded(): Promise<void> {
  try {
    const propsCol = collection(db, COLLECTIONS.PROPERTIES);
    const snap = await getDocs(query(propsCol, firestoreLimit(1)));
    if (!snap.empty) {
      return; // Already populated
    }

    console.log('⚡ Initializing & Seeding Firestore Database...');

    // Fetch initial dataset from local server API fallback
    const [resProps, resAgents, resBlogs, resTestimonials] = await Promise.all([
      fetch('/api/properties?limit=50').then(r => r.json()).catch(() => ({ properties: [] })),
      fetch('/api/agents').then(r => r.json()).catch(() => ({ agents: [] })),
      fetch('/api/blog').then(r => r.json()).catch(() => ({ posts: [] })),
      fetch('/api/testimonials').then(r => r.json()).catch(() => ({ testimonials: [] }))
    ]);

    const batchPromises: Promise<any>[] = [];

    // Seed Properties
    if (resProps.properties && Array.isArray(resProps.properties)) {
      for (const p of resProps.properties) {
        batchPromises.push(
          setDoc(doc(db, COLLECTIONS.PROPERTIES, p.id), {
            ...p,
            createdAt: p.createdAt || new Date().toISOString(),
            updatedAt: p.updatedAt || new Date().toISOString()
          })
        );
      }
    }

    // Seed Agents
    if (resAgents.agents && Array.isArray(resAgents.agents)) {
      for (const a of resAgents.agents) {
        batchPromises.push(
          setDoc(doc(db, COLLECTIONS.AGENTS, a.id), {
            ...a,
            createdAt: a.createdAt || new Date().toISOString()
          })
        );
      }
    }

    // Seed Blog Posts
    if (resBlogs.posts && Array.isArray(resBlogs.posts)) {
      for (const b of resBlogs.posts) {
        batchPromises.push(
          setDoc(doc(db, COLLECTIONS.BLOGS, b.id), {
            ...b,
            createdAt: b.createdAt || new Date().toISOString()
          })
        );
      }
    }

    // Seed Testimonials
    if (resTestimonials.testimonials && Array.isArray(resTestimonials.testimonials)) {
      for (const t of resTestimonials.testimonials) {
        batchPromises.push(
          setDoc(doc(db, COLLECTIONS.TESTIMONIALS, t.id), {
            ...t,
            createdAt: t.createdAt || new Date().toISOString()
          })
        );
      }
    }

    await Promise.all(batchPromises);
    console.log('✅ Firestore Database successfully populated.');
  } catch (err) {
    console.warn('Note on Firestore seeding:', err);
  }
}

// ----------------------------------------------------
// 1. PROPERTY SERVICE (FIRESTORE)
// ----------------------------------------------------
export const firebasePropertyService = {
  async getProperties(params: {
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
  } = {}) {
    try {
      const col = collection(db, COLLECTIONS.PROPERTIES);
      const snapshot = await getDocs(col);
      let list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as IProperty));

      // In case Firestore is still initializing or empty, return from API
      if (list.length === 0) {
        return null;
      }

      // Filter locally for rich full-text and range queries
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter(p =>
          p.title?.toLowerCase().includes(s) ||
          p.location?.toLowerCase().includes(s) ||
          p.city?.toLowerCase().includes(s) ||
          p.description?.toLowerCase().includes(s)
        );
      }

      if (params.city && params.city !== 'All') {
        list = list.filter(p => p.city?.toLowerCase() === params.city!.toLowerCase());
      }

      if (params.propertyType && params.propertyType !== 'All') {
        list = list.filter(p => p.propertyType?.toLowerCase() === params.propertyType!.toLowerCase());
      }

      if (params.listingType && params.listingType !== 'All') {
        list = list.filter(p => p.listingType?.toLowerCase() === params.listingType!.toLowerCase());
      }

      if (params.minPrice !== undefined && !isNaN(params.minPrice)) {
        list = list.filter(p => p.price >= params.minPrice!);
      }

      if (params.maxPrice !== undefined && !isNaN(params.maxPrice)) {
        list = list.filter(p => p.price <= params.maxPrice!);
      }

      if (params.bedrooms && params.bedrooms > 0) {
        list = list.filter(p => (p.bedrooms || 0) >= params.bedrooms!);
      }

      if (params.bathrooms && params.bathrooms > 0) {
        list = list.filter(p => (p.bathrooms || 0) >= params.bathrooms!);
      }

      if (params.minArea && params.minArea > 0) {
        list = list.filter(p => (p.area || 0) >= params.minArea!);
      }

      if (params.status && params.status !== 'All') {
        list = list.filter(p => p.status?.toLowerCase() === params.status!.toLowerCase());
      }

      if (params.isFeatured !== undefined) {
        list = list.filter(p => p.isFeatured === params.isFeatured);
      }

      // Sorting
      switch (params.sort) {
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
      const page = params.page && params.page > 0 ? params.page : 1;
      const limitVal = params.limit && params.limit > 0 ? params.limit : 12;
      const totalPages = Math.ceil(total / limitVal) || 1;
      const startIndex = (page - 1) * limitVal;
      const paginated = list.slice(startIndex, startIndex + limitVal);

      return {
        success: true,
        properties: paginated,
        total,
        page,
        totalPages
      };
    } catch (err) {
      console.warn('Firestore getProperties fallback:', err);
      return null;
    }
  },

  async getProperty(idOrSlug: string) {
    try {
      // Check by direct doc ID first
      const docRef = doc(db, COLLECTIONS.PROPERTIES, idOrSlug);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { success: true, property: { ...snap.data(), id: snap.id } as IProperty };
      }

      // Check by slug query
      const q = query(collection(db, COLLECTIONS.PROPERTIES), where('slug', '==', idOrSlug), firestoreLimit(1));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        const d = qSnap.docs[0];
        return { success: true, property: { ...d.data(), id: d.id } as IProperty };
      }
      return null;
    } catch {
      return null;
    }
  },

  async createProperty(propertyData: Partial<IProperty>) {
    const id = propertyData.id || `prop-${Date.now()}`;
    const slug = propertyData.slug || (propertyData.title || 'property').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProperty: IProperty = {
      id,
      slug,
      title: propertyData.title || 'Luxury Estate',
      description: propertyData.description || '',
      price: Number(propertyData.price) || 0,
      currency: propertyData.currency || 'PKR',
      location: propertyData.location || 'Islamabad',
      address: propertyData.address || '',
      city: propertyData.city || 'Islamabad',
      propertyType: propertyData.propertyType || 'Villa',
      listingType: (propertyData.listingType as any) || 'Buy',
      bedrooms: Number(propertyData.bedrooms) || 0,
      bathrooms: Number(propertyData.bathrooms) || 0,
      area: Number(propertyData.area) || 0,
      areaUnit: (propertyData.areaUnit as any) || 'sq ft',
      yearBuilt: propertyData.yearBuilt || new Date().getFullYear(),
      featuredImage: propertyData.featuredImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      images: propertyData.images && propertyData.images.length > 0 ? propertyData.images : [
        propertyData.featuredImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
      ],
      amenities: propertyData.amenities || ['Security', 'Backup Generator', 'Parking'],
      features: propertyData.features || ['Premium Finish'],
      status: (propertyData.status as any) || 'Available',
      isFeatured: !!propertyData.isFeatured,
      agentId: propertyData.agentId || 'agent-1',
      agentName: propertyData.agentName || 'Tariq Malik',
      agentPhone: propertyData.agentPhone || '+92 321 5550192',
      agentEmail: propertyData.agentEmail || 'tariq.malik@growthrealtors.com',
      agentImage: propertyData.agentImage || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, COLLECTIONS.PROPERTIES, id), newProperty);
    return { success: true, property: newProperty, message: 'Property created in Firestore' };
  },

  async updateProperty(id: string, updates: Partial<IProperty>) {
    const docRef = doc(db, COLLECTIONS.PROPERTIES, id);
    const updatedPayload = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await updateDoc(docRef, updatedPayload);
    const snap = await getDoc(docRef);
    return {
      success: true,
      property: { ...snap.data(), id: snap.id } as IProperty,
      message: 'Property updated in Firestore'
    };
  },

  async deleteProperty(id: string) {
    const docRef = doc(db, COLLECTIONS.PROPERTIES, id);
    await deleteDoc(docRef);
    return { success: true, message: 'Property deleted from Firestore' };
  }
};

// ----------------------------------------------------
// 2. INQUIRY SERVICE (FIRESTORE)
// ----------------------------------------------------
export const firebaseInquiryService = {
  async createInquiry(data: {
    propertyId: string;
    propertyTitle?: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    userId?: string;
  }) {
    const id = `inq-${Date.now()}`;
    const newInquiry: IInquiry = {
      id,
      userId: data.userId || 'guest',
      propertyId: data.propertyId,
      propertyTitle: data.propertyTitle || 'Property Inquiry',
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      status: 'Pending',
      adminNotes: '',
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, COLLECTIONS.INQUIRIES, id), newInquiry);
    return { success: true, inquiry: newInquiry, message: 'Inquiry submitted and recorded in Firestore' };
  },

  async getInquiries(userId?: string) {
    const col = collection(db, COLLECTIONS.INQUIRIES);
    let snap;
    if (userId && userId !== 'usr-admin-1') {
      const q = query(col, where('userId', '==', userId));
      snap = await getDocs(q);
    } else {
      snap = await getDocs(col);
    }
    const inquiries = snap.docs.map(d => ({ ...d.data(), id: d.id } as IInquiry));
    inquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { success: true, inquiries };
  },

  async updateInquiry(id: string, updates: { status: string; adminNotes?: string }) {
    const docRef = doc(db, COLLECTIONS.INQUIRIES, id);
    await updateDoc(docRef, updates);
    const snap = await getDoc(docRef);
    return { success: true, inquiry: { ...snap.data(), id: snap.id } as IInquiry, message: 'Inquiry updated' };
  },

  async deleteInquiry(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.INQUIRIES, id));
    return { success: true, message: 'Inquiry deleted' };
  }
};

// ----------------------------------------------------
// 3. VIEWING REQUEST SERVICE (FIRESTORE)
// ----------------------------------------------------
export const firebaseViewingService = {
  async createViewing(data: {
    propertyId: string;
    propertyTitle?: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    message?: string;
    userId?: string;
  }) {
    const id = `vr-${Date.now()}`;
    const newViewing: IViewingRequest = {
      id,
      userId: data.userId || 'guest',
      propertyId: data.propertyId,
      propertyTitle: data.propertyTitle || 'Property Walkthrough',
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      message: data.message || '',
      status: 'Pending',
      adminNotes: '',
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, COLLECTIONS.VIEWINGS, id), newViewing);
    return { success: true, viewing: newViewing, message: 'Viewing booked in Firestore' };
  },

  async getViewings(userId?: string) {
    const col = collection(db, COLLECTIONS.VIEWINGS);
    let snap;
    if (userId && userId !== 'usr-admin-1') {
      const q = query(col, where('userId', '==', userId));
      snap = await getDocs(q);
    } else {
      snap = await getDocs(col);
    }
    const viewings = snap.docs.map(d => ({ ...d.data(), id: d.id } as IViewingRequest));
    viewings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { success: true, viewings };
  },

  async updateViewing(id: string, updates: { status: string; adminNotes?: string }) {
    const docRef = doc(db, COLLECTIONS.VIEWINGS, id);
    await updateDoc(docRef, updates);
    const snap = await getDoc(docRef);
    return { success: true, viewing: { ...snap.data(), id: snap.id } as IViewingRequest, message: 'Viewing updated' };
  },

  async deleteViewing(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.VIEWINGS, id));
    return { success: true, message: 'Viewing deleted' };
  }
};

// ----------------------------------------------------
// 4. PROPERTY SUBMISSIONS (SELL) (FIRESTORE)
// ----------------------------------------------------
export const firebaseSellService = {
  async createSubmission(data: Partial<IPropertySubmission>) {
    const id = `sub-${Date.now()}`;
    const newSub: IPropertySubmission = {
      id,
      userId: data.userId || 'guest',
      ownerName: data.ownerName || '',
      email: data.email || '',
      phone: data.phone || '',
      propertyAddress: data.propertyAddress || '',
      city: data.city || 'Islamabad',
      propertyType: (data.propertyType as any) || 'Villa',
      listingType: (data.listingType as any) || 'Buy',
      askingPrice: Number(data.askingPrice) || 0,
      area: Number(data.area) || 0,
      areaUnit: data.areaUnit || 'sq ft',
      bedrooms: Number(data.bedrooms) || 0,
      bathrooms: Number(data.bathrooms) || 0,
      description: data.description || '',
      images: data.images || ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      status: 'Pending',
      adminNotes: '',
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, COLLECTIONS.SUBMISSIONS, id), newSub);
    return { success: true, submission: newSub, message: 'Property submitted to Firestore' };
  },

  async getSubmissions(userId?: string) {
    const col = collection(db, COLLECTIONS.SUBMISSIONS);
    let snap;
    if (userId && userId !== 'usr-admin-1') {
      const q = query(col, where('userId', '==', userId));
      snap = await getDocs(q);
    } else {
      snap = await getDocs(col);
    }
    const submissions = snap.docs.map(d => ({ ...d.data(), id: d.id } as IPropertySubmission));
    submissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { success: true, submissions };
  },

  async updateSubmission(id: string, updates: { status: string; adminNotes?: string }) {
    const docRef = doc(db, COLLECTIONS.SUBMISSIONS, id);
    await updateDoc(docRef, updates);
    const snap = await getDoc(docRef);
    return { success: true, submission: { ...snap.data(), id: snap.id } as IPropertySubmission, message: 'Submission updated' };
  },

  async deleteSubmission(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.SUBMISSIONS, id));
    return { success: true, message: 'Submission deleted' };
  }
};

// ----------------------------------------------------
// 5. CONTACT MESSAGES (FIRESTORE)
// ----------------------------------------------------
export const firebaseContactService = {
  async sendMessage(data: { name: string; email: string; phone?: string; subject?: string; message: string }) {
    const id = `msg-${Date.now()}`;
    const newMsg: IContactMessage = {
      id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject || 'General Inquiry',
      message: data.message,
      status: 'Unread',
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, COLLECTIONS.CONTACT, id), newMsg);
    return { success: true, contactMessage: newMsg, message: 'Message recorded in Firestore' };
  },

  async getMessages() {
    const col = collection(db, COLLECTIONS.CONTACT);
    const snap = await getDocs(col);
    const messages = snap.docs.map(d => ({ ...d.data(), id: d.id } as IContactMessage));
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { success: true, messages };
  },

  async updateStatus(id: string, status: string) {
    const docRef = doc(db, COLLECTIONS.CONTACT, id);
    await updateDoc(docRef, { status });
    const snap = await getDoc(docRef);
    return { success: true, contactMessage: { ...snap.data(), id: snap.id } as IContactMessage, message: 'Status updated' };
  },

  async deleteMessage(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.CONTACT, id));
    return { success: true, message: 'Message removed' };
  }
};

// ----------------------------------------------------
// 6. AGENTS & BLOGS & TESTIMONIALS (FIRESTORE)
// ----------------------------------------------------
export const firebaseAgentService = {
  async getAgents() {
    const col = collection(db, COLLECTIONS.AGENTS);
    const snap = await getDocs(col);
    const agents = snap.docs.map(d => ({ ...d.data(), id: d.id } as IAgent));
    return { success: true, agents };
  },
  async createAgent(agentData: Partial<IAgent>) {
    const id = agentData.id || `agent-${Date.now()}`;
    const newAgent = { ...agentData, id, createdAt: new Date().toISOString() };
    await setDoc(doc(db, COLLECTIONS.AGENTS, id), newAgent);
    return { success: true, agent: newAgent as IAgent, message: 'Agent saved' };
  },
  async updateAgent(id: string, updates: Partial<IAgent>) {
    const docRef = doc(db, COLLECTIONS.AGENTS, id);
    await updateDoc(docRef, updates);
    const snap = await getDoc(docRef);
    return { success: true, agent: { ...snap.data(), id: snap.id } as IAgent, message: 'Agent updated' };
  },
  async deleteAgent(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.AGENTS, id));
    return { success: true, message: 'Agent deleted' };
  }
};

export const firebaseBlogService = {
  async getPosts(category?: string) {
    const col = collection(db, COLLECTIONS.BLOGS);
    const snap = await getDocs(col);
    let posts = snap.docs.map(d => ({ ...d.data(), id: d.id } as IBlogPost));
    if (category && category !== 'All') {
      posts = posts.filter(p => p.category?.toLowerCase() === category.toLowerCase());
    }
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { success: true, posts };
  },
  async getPost(slugOrId: string) {
    const docRef = doc(db, COLLECTIONS.BLOGS, slugOrId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { success: true, post: { ...snap.data(), id: snap.id } as IBlogPost, related: [] };
    }
    const q = query(collection(db, COLLECTIONS.BLOGS), where('slug', '==', slugOrId), firestoreLimit(1));
    const qSnap = await getDocs(q);
    if (!qSnap.empty) {
      const d = qSnap.docs[0];
      return { success: true, post: { ...d.data(), id: d.id } as IBlogPost, related: [] };
    }
    return null;
  },
  async createPost(postData: Partial<IBlogPost>) {
    const id = postData.id || `blog-${Date.now()}`;
    const slug = postData.slug || (postData.title || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newPost: IBlogPost = {
      id,
      slug,
      title: postData.title || '',
      excerpt: postData.excerpt || '',
      content: postData.content || '',
      featuredImage: postData.featuredImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
      author: postData.author ? {
        name: postData.author.name || 'Growth Editorial Team',
        role: postData.author.role || 'Senior Analyst',
        avatar: postData.author.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
      } : {
        name: 'Growth Editorial Team',
        role: 'Senior Analyst',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
      },
      category: postData.category || 'Investment',
      tags: postData.tags || ['Market Update'],
      readTime: postData.readTime || '5 min read',
      published: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await setDoc(doc(db, COLLECTIONS.BLOGS, id), newPost);
    return { success: true, post: newPost, message: 'Article published in Firestore' };
  },
  async updatePost(id: string, updates: Partial<IBlogPost>) {
    const docRef = doc(db, COLLECTIONS.BLOGS, id);
    await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
    const snap = await getDoc(docRef);
    return { success: true, post: { ...snap.data(), id: snap.id } as IBlogPost, message: 'Article updated' };
  },
  async deletePost(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.BLOGS, id));
    return { success: true, message: 'Article deleted' };
  }
};

export const firebaseTestimonialService = {
  async getTestimonials() {
    const col = collection(db, COLLECTIONS.TESTIMONIALS);
    const snap = await getDocs(col);
    const testimonials = snap.docs.map(d => ({ ...d.data(), id: d.id } as ITestimonial));
    return { success: true, testimonials };
  },
  async createTestimonial(data: Partial<ITestimonial>) {
    const id = data.id || `test-${Date.now()}`;
    const newTest: ITestimonial = {
      id,
      clientName: data.clientName || 'Valued Client',
      clientTitle: data.clientTitle || 'Property Owner',
      clientImage: data.clientImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      rating: Number(data.rating) || 5,
      review: data.review || '',
      propertyType: data.propertyType || 'Luxury Residence',
      location: data.location || 'Islamabad',
      transactionType: data.transactionType || 'Bought',
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, COLLECTIONS.TESTIMONIALS, id), newTest);
    return { success: true, testimonial: newTest, message: 'Testimonial saved in Firestore' };
  },
  async updateTestimonial(id: string, updates: Partial<ITestimonial>) {
    const docRef = doc(db, COLLECTIONS.TESTIMONIALS, id);
    await updateDoc(docRef, updates);
    const snap = await getDoc(docRef);
    return { success: true, testimonial: { ...snap.data(), id: snap.id } as ITestimonial, message: 'Updated' };
  },
  async deleteTestimonial(id: string) {
    await deleteDoc(doc(db, COLLECTIONS.TESTIMONIALS, id));
    return { success: true, message: 'Deleted' };
  }
};
