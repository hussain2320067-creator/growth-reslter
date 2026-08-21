import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    loginWithGoogle,
    loginAsDemoAdmin,
    loginAsDemoUser
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (authModalMode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, phone);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-container"
        className="relative w-full max-w-md bg-white border border-black/10 p-6 sm:p-8 shadow-xl overflow-hidden text-xs"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-black/40 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-11 h-11 bg-[#FDFCF9] text-[#B5945E] border border-black/10 mb-2.5">
            <Lock className="w-5 h-5 text-[#B5945E]" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">
            {authModalMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <p className="text-xs text-black/60 mt-0.5">
            {authModalMode === 'login'
              ? 'Sign in to access your saved properties, inquiries, and viewing requests.'
              : 'Join Growth Realtors for exclusive off-market listings and VIP advisory.'}
          </p>
        </div>

        {/* Fast Demo Account Login Shortcuts */}
        <div className="mb-4 p-3 bg-[#FDFCF9] border border-black/10 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#B5945E] uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#B5945E]" />
              Quick Test Sign-In
            </span>
            <span className="text-black/40 font-normal">1-Click</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={loginAsDemoAdmin}
              className="py-1.5 px-2.5 bg-white hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider transition-colors border border-black/10 flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
            <button
              type="button"
              onClick={loginAsDemoUser}
              className="py-1.5 px-2.5 bg-white hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-[11px] font-bold uppercase tracking-wider transition-colors border border-black/10 flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Client User</span>
            </button>
          </div>
        </div>

        {/* Google Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full mb-4 py-2 px-3 bg-white hover:bg-black/5 text-[#1A1A1A] text-xs font-semibold border border-black/10 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex py-1 items-center mb-4">
          <div className="flex-grow border-t border-black/10"></div>
          <span className="flex-shrink mx-2 text-[10px] uppercase font-bold text-black/40">Or with Email</span>
          <div className="flex-grow border-t border-black/10"></div>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#FDFCF9] p-1 border border-black/10 mb-4">
          <button
            type="button"
            onClick={() => setAuthModalMode('login')}
            className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              authModalMode === 'login'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-black/50 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthModalMode('register')}
            className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              authModalMode === 'register'
                ? 'bg-[#1A1A1A] text-white shadow-xs'
                : 'text-black/50 hover:text-black'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-black/70 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-black/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Hamza Khan"
                  required
                  className="w-full pl-9 pr-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] placeholder-black/40 text-xs focus:outline-none focus:border-[#B5945E] transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-black/70 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-black/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full pl-9 pr-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] placeholder-black/40 text-xs focus:outline-none focus:border-[#B5945E] transition-colors"
              />
            </div>
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-black/70 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 w-4 h-4 text-black/40" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full pl-9 pr-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] placeholder-black/40 text-xs focus:outline-none focus:border-[#B5945E] transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-black/70">Password</label>
              {authModalMode === 'login' && (
                <span className="text-[10px] text-[#B5945E] font-semibold">
                  Demo Passwords: admin123456 / user123456
                </span>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-black/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full pl-9 pr-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] placeholder-black/40 text-xs focus:outline-none focus:border-[#B5945E] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Processing...' : authModalMode === 'login' ? 'Sign In to Account' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
