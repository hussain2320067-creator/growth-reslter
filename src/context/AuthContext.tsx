import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { IUser } from '../types';
import { authService } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, phone?: string, role?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<IUser> & { password?: string }) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  loginAsDemoAdmin: () => Promise<boolean>;
  loginAsDemoUser: () => Promise<boolean>;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('growth_realtors_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const { success, error } = useToast();

  // Designated Admin User IDs and Emails
  const ADMIN_UIDS = ['fv5jT4NLFuYZKrPHkLX7sSzfi983', 'usr-admin-1'];
  const ADMIN_EMAILS = ['admin@growthrealtors.com', 'hussain2320067@gmail.com'];

  const isUserAdminRole = (u: IUser | null, fbUid?: string, fbEmail?: string | null): boolean => {
    if (!u && !fbUid && !fbEmail) return false;
    if (fbUid && ADMIN_UIDS.includes(fbUid)) return true;
    if (fbEmail && ADMIN_EMAILS.includes(fbEmail.toLowerCase())) return true;
    if (u?.id && ADMIN_UIDS.includes(u.id)) return true;
    if (u?.email && ADMIN_EMAILS.includes(u.email.toLowerCase())) return true;
    return u?.role === 'admin';
  };

  // Sync Firebase Auth & local user profile
  const syncFirebaseUserDoc = async (fbUser: FirebaseUser): Promise<IUser> => {
    const userRef = doc(db, 'users', fbUser.uid);
    const snap = await getDoc(userRef);
    const shouldBeAdmin = isUserAdminRole(null, fbUser.uid, fbUser.email);

    if (snap.exists()) {
      const data = snap.data() as IUser;
      if (shouldBeAdmin && data.role !== 'admin') {
        const updatedUser: IUser = { ...data, role: 'admin', id: fbUser.uid };
        await setDoc(userRef, { role: 'admin' }, { merge: true });
        return updatedUser;
      }
      return { ...data, id: fbUser.uid, role: shouldBeAdmin ? 'admin' : (data.role || 'user') };
    }

    // Default new user profile in Firestore
    const newUser: IUser = {
      id: fbUser.uid,
      name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
      email: fbUser.email || '',
      phone: fbUser.phoneNumber || '',
      role: shouldBeAdmin ? 'admin' : 'user',
      profileImage: fbUser.photoURL || undefined,
      favorites: [],
      createdAt: new Date().toISOString()
    };

    await setDoc(userRef, newUser);
    return newUser;
  };

  const loadUser = useCallback(async () => {
    const storedToken = localStorage.getItem('growth_realtors_token');
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authService.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        localStorage.removeItem('growth_realtors_token');
        setToken(null);
        setUser(null);
      }
    } catch {
      localStorage.removeItem('growth_realtors_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();

    // Firebase Auth State Listener
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const syncedUser = await syncFirebaseUserDoc(fbUser);
          setUser(syncedUser);
          const idToken = await fbUser.getIdToken();
          setToken(idToken);
          localStorage.setItem('growth_realtors_token', idToken);
        } catch (e) {
          console.warn('Firebase user sync note:', e);
        }
      }
    });

    return () => unsubscribe();
  }, [loadUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // 1. Try Firebase Auth
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const syncedUser = await syncFirebaseUserDoc(userCred.user);
        const idToken = await userCred.user.getIdToken();
        localStorage.setItem('growth_realtors_token', idToken);
        setToken(idToken);
        setUser(syncedUser);
        success(`Welcome back, ${syncedUser.name}`);
        setIsAuthModalOpen(false);
        return true;
      } catch (fbErr: any) {
        // Fallback to local server auth for pre-seeded users
        const res = await authService.login({ email, password });
        if (res.success && res.token && res.user) {
          localStorage.setItem('growth_realtors_token', res.token);
          setToken(res.token);
          setUser(res.user);
          success(`Welcome back, ${res.user.name}`);
          setIsAuthModalOpen(false);
          return true;
        }
        throw fbErr;
      }
    } catch (err: any) {
      error(err.message || 'Login failed.');
      return false;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string, role?: string): Promise<boolean> => {
    try {
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const newUser: IUser = {
          id: userCred.user.uid,
          name,
          email,
          phone: phone || '',
          role: (role as any) || 'user',
          favorites: [],
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', userCred.user.uid), newUser);
        const idToken = await userCred.user.getIdToken();
        localStorage.setItem('growth_realtors_token', idToken);
        setToken(idToken);
        setUser(newUser);
        success(`Account created! Welcome to Growth Realtors, ${name}`);
        setIsAuthModalOpen(false);
        return true;
      } catch {
        const res = await authService.register({ name, email, password, phone, role });
        if (res.success && res.token && res.user) {
          localStorage.setItem('growth_realtors_token', res.token);
          setToken(res.token);
          setUser(res.user);
          success(`Account created! Welcome to Growth Realtors, ${res.user.name}`);
          setIsAuthModalOpen(false);
          return true;
        }
        return false;
      }
    } catch (err: any) {
      error(err.message || 'Registration failed.');
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const userCred = await signInWithPopup(auth, googleProvider);
      const syncedUser = await syncFirebaseUserDoc(userCred.user);
      const idToken = await userCred.user.getIdToken();
      localStorage.setItem('growth_realtors_token', idToken);
      setToken(idToken);
      setUser(syncedUser);
      success(`Signed in with Google as ${syncedUser.name}`);
      setIsAuthModalOpen(false);
      return true;
    } catch (err: any) {
      error(err.message || 'Google sign-in cancelled or failed.');
      return false;
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {}
    authService.logout();
    setToken(null);
    setUser(null);
    success('You have been logged out.');
  };

  const updateProfile = async (data: Partial<IUser> & { password?: string }): Promise<boolean> => {
    try {
      if (user?.id) {
        try {
          await setDoc(doc(db, 'users', user.id), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
        } catch {}
      }
      const res = await authService.updateProfile(data);
      if (res.success && res.user) {
        setUser(res.user);
        success('Profile updated successfully.');
        return true;
      }
      return false;
    } catch (err: any) {
      error(err.message || 'Failed to update profile.');
      return false;
    }
  };

  const forgotPassword = async (emailToReset: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, emailToReset);
      success('Password reset email sent. Please check your inbox.');
      return true;
    } catch (err: any) {
      try {
        const res = await authService.forgotPassword(emailToReset);
        if (res.success) {
          success(res.message || 'Password reset link dispatched.');
          return true;
        }
      } catch {}
      error(err.message || 'Unable to send password reset email.');
      return false;
    }
  };

  const loginAsDemoAdmin = async () => {
    return login('admin@growthrealtors.com', 'admin123456');
  };

  const loginAsDemoUser = async () => {
    return login('user@growthrealtors.com', 'user123456');
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: isUserAdminRole(user),
        login,
        register,
        loginWithGoogle,
        logout,
        updateProfile,
        forgotPassword,
        loginAsDemoAdmin,
        loginAsDemoUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
