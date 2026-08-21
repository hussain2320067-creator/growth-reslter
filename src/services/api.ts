import {
  IUser,
  IProperty,
  IAgent,
  IInquiry,
  IViewingRequest,
  IContactMessage,
  IPropertySubmission,
  IBlogPost,
  ITestimonial,
  IAdminStats
} from '../types';
import {
  firebasePropertyService,
  firebaseInquiryService,
  firebaseViewingService,
  firebaseSellService,
  firebaseContactService,
  firebaseAgentService,
  firebaseBlogService,
  firebaseTestimonialService,
  ensureFirestoreSeeded
} from './firebaseDb';

// Trigger initial Firestore seed check on load
ensureFirestoreSeeded().catch(() => {});

const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('growth_realtors_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data as T;
}

// 1. AUTH SERVICE
export const authService = {
  async register(data: { name: string; email: string; password: string; phone?: string; role?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; token: string; user: IUser; message: string }>(res);
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; token: string; user: IUser; message: string }>(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; user: IUser }>(res);
  },

  async updateProfile(data: Partial<IUser> & { currentPassword?: string; newPassword?: string; password?: string }) {
    const res = await fetch(`${API_BASE}/auth/update-profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; user: IUser; message: string }>(res);
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  async logout() {
    localStorage.removeItem('growth_realtors_token');
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' }).catch(() => {});
  }
};

// 2. PROPERTY SERVICE (Firebase First with Backend Sync)
export const propertyService = {
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
      const fbResult = await firebasePropertyService.getProperties(params);
      if (fbResult && fbResult.properties && fbResult.properties.length > 0) {
        return fbResult;
      }
    } catch (e) {
      console.warn('Firebase property query:', e);
    }

    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });

    const res = await fetch(`${API_BASE}/properties?${query.toString()}`);
    return handleResponse<{
      success: boolean;
      properties: IProperty[];
      total: number;
      page: number;
      totalPages: number;
    }>(res);
  },

  async getFeatured() {
    try {
      const fbResult = await firebasePropertyService.getProperties({ isFeatured: true, limit: 6 });
      if (fbResult && fbResult.properties && fbResult.properties.length > 0) {
        return { success: true, properties: fbResult.properties };
      }
    } catch {}

    const res = await fetch(`${API_BASE}/properties/featured`);
    return handleResponse<{ success: boolean; properties: IProperty[] }>(res);
  },

  async getProperty(idOrSlug: string) {
    try {
      const fbResult = await firebasePropertyService.getProperty(idOrSlug);
      if (fbResult && fbResult.property) {
        return fbResult;
      }
    } catch {}

    const res = await fetch(`${API_BASE}/properties/${encodeURIComponent(idOrSlug)}`);
    return handleResponse<{ success: boolean; property: IProperty }>(res);
  },

  async search(q: string) {
    try {
      const fbResult = await firebasePropertyService.getProperties({ search: q });
      if (fbResult && fbResult.properties) {
        return { success: true, properties: fbResult.properties };
      }
    } catch {}

    const res = await fetch(`${API_BASE}/properties/search?q=${encodeURIComponent(q)}`);
    return handleResponse<{ success: boolean; properties: IProperty[] }>(res);
  },

  async createProperty(data: Partial<IProperty>) {
    try {
      await firebasePropertyService.createProperty(data);
    } catch (e) {
      console.warn('Firebase createProperty:', e);
    }

    const res = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; property: IProperty; message: string }>(res);
  },

  async updateProperty(id: string, data: Partial<IProperty>) {
    try {
      await firebasePropertyService.updateProperty(id, data);
    } catch (e) {
      console.warn('Firebase updateProperty:', e);
    }

    const res = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; property: IProperty; message: string }>(res);
  },

  async deleteProperty(id: string) {
    try {
      await firebasePropertyService.deleteProperty(id);
    } catch (e) {
      console.warn('Firebase deleteProperty:', e);
    }

    const res = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};

// 3. FAVORITES SERVICE
export const favoritesService = {
  async getFavorites() {
    const res = await fetch(`${API_BASE}/favorites`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; favorites: string[]; properties: IProperty[] }>(res);
  },

  async toggleFavorite(propertyId: string) {
    const res = await fetch(`${API_BASE}/favorites/${propertyId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; isFavorite: boolean; favorites: string[]; message: string }>(res);
  },

  async removeFavorite(propertyId: string) {
    const res = await fetch(`${API_BASE}/favorites/${propertyId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; favorites: string[]; message: string }>(res);
  }
};

// 4. INQUIRY SERVICE (Firebase First with Backend Sync)
export const inquiryService = {
  async createInquiry(data: { propertyId: string; name: string; email: string; phone: string; message: string; propertyTitle?: string }) {
    try {
      await firebaseInquiryService.createInquiry(data);
    } catch (e) {
      console.warn('Firebase inquiry sync:', e);
    }

    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; inquiry: IInquiry; message: string }>(res);
  },

  async getInquiries() {
    try {
      const fbResult = await firebaseInquiryService.getInquiries();
      if (fbResult && fbResult.inquiries && fbResult.inquiries.length > 0) {
        return fbResult;
      }
    } catch {}

    const res = await fetch(`${API_BASE}/inquiries`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; inquiries: IInquiry[] }>(res);
  },

  async updateInquiry(id: string, data: { status: string; adminNotes?: string }) {
    try {
      await firebaseInquiryService.updateInquiry(id, data);
    } catch {}

    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; inquiry: IInquiry; message: string }>(res);
  },

  async deleteInquiry(id: string) {
    try {
      await firebaseInquiryService.deleteInquiry(id);
    } catch {}

    const res = await fetch(`${API_BASE}/inquiries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};

// 5. VIEWING SERVICE (Firebase First with Backend Sync)
export const viewingService = {
  async createViewing(data: {
    propertyId: string;
    propertyTitle?: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    message?: string;
  }) {
    try {
      await firebaseViewingService.createViewing(data);
    } catch (e) {
      console.warn('Firebase viewing sync:', e);
    }

    const res = await fetch(`${API_BASE}/viewings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; viewing: IViewingRequest; message: string }>(res);
  },

  async getViewings() {
    try {
      const fbResult = await firebaseViewingService.getViewings();
      if (fbResult && fbResult.viewings && fbResult.viewings.length > 0) {
        return fbResult;
      }
    } catch {}

    const res = await fetch(`${API_BASE}/viewings`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; viewings: IViewingRequest[] }>(res);
  },

  async updateViewing(id: string, data: { status: string; adminNotes?: string }) {
    try {
      await firebaseViewingService.updateViewing(id, data);
    } catch {}

    const res = await fetch(`${API_BASE}/viewings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; viewing: IViewingRequest; message: string }>(res);
  },

  async deleteViewing(id: string) {
    try {
      await firebaseViewingService.deleteViewing(id);
    } catch {}

    const res = await fetch(`${API_BASE}/viewings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};

// 6. PROPERTY SUBMISSIONS (SELL) (Firebase First with Backend Sync)
export const sellService = {
  async createSubmission(data: Partial<IPropertySubmission>) {
    try {
      await firebaseSellService.createSubmission(data);
    } catch (e) {
      console.warn('Firebase sell submission sync:', e);
    }

    const res = await fetch(`${API_BASE}/property-submissions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; submission: IPropertySubmission; message: string }>(res);
  },

  async getSubmissions() {
    try {
      const fbResult = await firebaseSellService.getSubmissions();
      if (fbResult && fbResult.submissions && fbResult.submissions.length > 0) {
        return fbResult;
      }
    } catch {}

    const res = await fetch(`${API_BASE}/property-submissions`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; submissions: IPropertySubmission[] }>(res);
  },

  async updateSubmission(id: string, data: { status: string; adminNotes?: string; convertToListing?: boolean }) {
    try {
      await firebaseSellService.updateSubmission(id, data);
    } catch {}

    const res = await fetch(`${API_BASE}/property-submissions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; submission: IPropertySubmission; message: string }>(res);
  },

  async deleteSubmission(id: string) {
    try {
      await firebaseSellService.deleteSubmission(id);
    } catch {}

    const res = await fetch(`${API_BASE}/property-submissions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};

// 7. CONTACT SERVICE (Firebase First)
export const contactService = {
  async sendMessage(data: { name: string; email: string; phone?: string; subject?: string; message: string }) {
    try {
      await firebaseContactService.sendMessage(data);
    } catch (e) {
      console.warn('Firebase contact sync:', e);
    }

    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; contactMessage: IContactMessage; message: string }>(res);
  },

  async getMessages() {
    try {
      const fbResult = await firebaseContactService.getMessages();
      if (fbResult && fbResult.messages && fbResult.messages.length > 0) {
        return fbResult;
      }
    } catch {}

    const res = await fetch(`${API_BASE}/contact`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; messages: IContactMessage[] }>(res);
  },

  async updateStatus(id: string, status: string) {
    try {
      await firebaseContactService.updateStatus(id, status);
    } catch {}

    const res = await fetch(`${API_BASE}/contact/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse<{ success: boolean; contactMessage: IContactMessage; message: string }>(res);
  },

  async deleteMessage(id: string) {
    try {
      await firebaseContactService.deleteMessage(id);
    } catch {}

    const res = await fetch(`${API_BASE}/contact/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};

// 8. AGENT SERVICE
export const agentService = {
  async getAgents() {
    try {
      const fbResult = await firebaseAgentService.getAgents();
      if (fbResult && fbResult.agents && fbResult.agents.length > 0) {
        return fbResult;
      }
    } catch {}

    const res = await fetch(`${API_BASE}/agents`);
    return handleResponse<{ success: boolean; agents: IAgent[] }>(res);
  },

  async getAgent(id: string) {
    const res = await fetch(`${API_BASE}/agents/${id}`);
    return handleResponse<{ success: boolean; agent: IAgent }>(res);
  },

  async createAgent(data: Partial<IAgent>) {
    try {
      await firebaseAgentService.createAgent(data);
    } catch {}

    const res = await fetch(`${API_BASE}/agents`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; agent: IAgent; message: string }>(res);
  },

  async updateAgent(id: string, data: Partial<IAgent>) {
    try {
      await firebaseAgentService.updateAgent(id, data);
    } catch {}

    const res = await fetch(`${API_BASE}/agents/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; agent: IAgent; message: string }>(res);
  },

  async deleteAgent(id: string) {
    try {
      await firebaseAgentService.deleteAgent(id);
    } catch {}

    const res = await fetch(`${API_BASE}/agents/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};

// 9. BLOG SERVICE
export const blogService = {
  async getPosts(category?: string) {
    try {
      const fbResult = await firebaseBlogService.getPosts(category);
      if (fbResult && fbResult.posts && fbResult.posts.length > 0) {
        return fbResult;
      }
    } catch {}

    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    const res = await fetch(`${API_BASE}/blog${query}`);
    return handleResponse<{ success: boolean; posts: IBlogPost[] }>(res);
  },

  async getPost(slug: string) {
    try {
      const fbResult = await firebaseBlogService.getPost(slug);
      if (fbResult && fbResult.post) {
        return fbResult;
      }
    } catch {}

    const res = await fetch(`${API_BASE}/blog/${encodeURIComponent(slug)}`);
    return handleResponse<{ success: boolean; post: IBlogPost; related: IBlogPost[] }>(res);
  },

  async createPost(data: Partial<IBlogPost>) {
    try {
      await firebaseBlogService.createPost(data);
    } catch {}

    const res = await fetch(`${API_BASE}/blog`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; post: IBlogPost; message: string }>(res);
  },

  async updatePost(id: string, data: Partial<IBlogPost>) {
    try {
      await firebaseBlogService.updatePost(id, data);
    } catch {}

    const res = await fetch(`${API_BASE}/blog/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; post: IBlogPost; message: string }>(res);
  },

  async deletePost(id: string) {
    try {
      await firebaseBlogService.deletePost(id);
    } catch {}

    const res = await fetch(`${API_BASE}/blog/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};

// 10. TESTIMONIAL SERVICE
export const testimonialService = {
  async getTestimonials() {
    try {
      const fbResult = await firebaseTestimonialService.getTestimonials();
      if (fbResult && fbResult.testimonials && fbResult.testimonials.length > 0) {
        return fbResult;
      }
    } catch {}

    const res = await fetch(`${API_BASE}/testimonials`);
    return handleResponse<{ success: boolean; testimonials: ITestimonial[] }>(res);
  },

  async createTestimonial(data: Partial<ITestimonial>) {
    try {
      await firebaseTestimonialService.createTestimonial(data);
    } catch {}

    const res = await fetch(`${API_BASE}/testimonials`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; testimonial: ITestimonial; message: string }>(res);
  },

  async updateTestimonial(id: string, data: Partial<ITestimonial>) {
    try {
      await firebaseTestimonialService.updateTestimonial(id, data);
    } catch {}

    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; testimonial: ITestimonial; message: string }>(res);
  },

  async deleteTestimonial(id: string) {
    try {
      await firebaseTestimonialService.deleteTestimonial(id);
    } catch {}

    const res = await fetch(`${API_BASE}/testimonials/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};

// 11. ADMIN SERVICE
export const adminService = {
  async getStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; stats: IAdminStats }>(res);
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; users: IUser[] }>(res);
  },

  async updateUser(id: string, data: { role?: string; name?: string; phone?: string }) {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; user: IUser; message: string }>(res);
  },

  async deleteUser(id: string) {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};
