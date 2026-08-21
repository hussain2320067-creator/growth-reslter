import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Save,
  Clock,
  Building2,
  Calendar,
  Sparkles,
  Heart,
  FilePlus,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/api';

interface ProfilePageProps {
  navigate: (route: string, params?: Record<string, any>) => void;
  onOpenAuthModal: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ navigate, onOpenAuthModal }) => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 pt-36 pb-24 text-center space-y-4">
        <div className="w-14 h-14 bg-white text-[#B5945E] border border-black/10 flex items-center justify-center mx-auto shadow-sm">
          <User className="w-7 h-7 opacity-60" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">Client Portal Access</h2>
        <p className="text-xs text-black/60">
          Please sign in to view your account details, private appointments, and shortlists.
        </p>
        <button
          onClick={onOpenAuthModal}
          className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider transition-colors"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const res = await authService.updateProfile({
        name,
        phone,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });
      if (res.success && res.user) {
        updateUser(res.user);
        success('Profile details updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err: any) {
      error(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 bg-white border border-black/10 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 bg-[#FDFCF9] border border-black/10 flex items-center justify-center text-[#B5945E] font-serif text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                {user.name}
              </h1>
              <span className="px-2 py-0.5 bg-[#FDFCF9] text-black/70 text-[9px] font-bold uppercase tracking-widest border border-black/10">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-black/60 mt-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#B5945E]" />
              {user.email}
            </p>
          </div>
        </div>

        {user.role === 'admin' && (
          <button
            onClick={() => navigate('admin')}
            className="px-5 py-2 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-auto transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Open Executive Admin Portal</span>
          </button>
        )}
      </div>

      {/* Quick Action Navigation Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => navigate('favorites')}
          className="p-5 bg-white border border-black/10 hover:border-[#B5945E] text-left transition-all group"
        >
          <Heart className="w-5 h-5 text-red-500 mb-2" />
          <h4 className="font-serif text-base font-bold text-[#1A1A1A] group-hover:text-[#B5945E] transition-colors">
            Saved Properties
          </h4>
          <p className="text-xs text-black/60 mt-1">View and manage bookmarked villas and apartments</p>
        </button>

        <button
          onClick={() => navigate('sell')}
          className="p-5 bg-white border border-black/10 hover:border-[#B5945E] text-left transition-all group"
        >
          <FilePlus className="w-5 h-5 text-[#B5945E] mb-2" />
          <h4 className="font-serif text-base font-bold text-[#1A1A1A] group-hover:text-[#B5945E] transition-colors">
            List a Property
          </h4>
          <p className="text-xs text-black/60 mt-1">Submit your private property for review</p>
        </button>

        <button
          onClick={() => navigate('properties')}
          className="p-5 bg-white border border-black/10 hover:border-[#B5945E] text-left transition-all group"
        >
          <Building2 className="w-5 h-5 text-blue-600 mb-2" />
          <h4 className="font-serif text-base font-bold text-[#1A1A1A] group-hover:text-[#B5945E] transition-colors">
            Explore Portfolio
          </h4>
          <p className="text-xs text-black/60 mt-1">Discover prime residential and commercial holdings</p>
        </button>
      </div>

      {/* Edit Profile Form */}
      <div className="bg-white border border-black/10 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
            Account Preferences & Security
          </h3>
          <p className="text-xs text-black/60 mt-1">
            Update your personal contact details and password credentials.
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-black/70 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-black/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-black/70 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-black/40" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full pl-9 pr-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-black/10">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#B5945E] mb-3 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#B5945E]" />
              Change Password (Optional)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-black/70 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-black/70 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isUpdating}
              className="px-6 py-2 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isUpdating ? 'Saving Changes...' : 'Save Profile Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
