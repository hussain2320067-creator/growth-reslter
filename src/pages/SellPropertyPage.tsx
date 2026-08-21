import React, { useState } from 'react';
import {
  FilePlus,
  Building2,
  ShieldCheck,
  Upload,
  CheckCircle2,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { PropertyType, ListingType } from '../types';
import { sellService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { uploadPropertyImage } from '../lib/firebase';

interface SellPropertyPageProps {
  navigate: (route: string, params?: Record<string, any>) => void;
}

export const SellPropertyPage: React.FC<SellPropertyPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submissionId, setSubmissionId] = useState<string>('');

  // Form State
  const [ownerName, setOwnerName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState('Islamabad');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('Villa');
  const [listingType, setListingType] = useState<ListingType>('Buy');
  const [askingPrice, setAskingPrice] = useState<number>(65000000);
  const [area, setArea] = useState<number>(1);
  const [areaUnit, setAreaUnit] = useState<'Kanal' | 'Marla' | 'sq ft'>('Kanal');
  const [bedrooms, setBedrooms] = useState<number>(5);
  const [bathrooms, setBathrooms] = useState<number>(6);
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedUrl = await uploadPropertyImage(file, 'property_submissions');
        setImageUrls(prev => [...prev, uploadedUrl]);
      }
      success('Image(s) uploaded successfully to Firebase Storage.');
    } catch (err: any) {
      error('Failed to upload image: ' + (err.message || 'Error'));
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim() && newImageUrl.startsWith('http')) {
      setImageUrls(prev => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await sellService.createSubmission({
        ownerName,
        email,
        phone,
        propertyAddress,
        city,
        propertyType,
        listingType,
        askingPrice,
        area,
        areaUnit,
        bedrooms,
        bathrooms,
        description: description || `Executive ${propertyType} in ${city} spanning ${area} ${areaUnit}. Fully titled and possessional.`,
        images: imageUrls
      });

      if (res.success && res.submission) {
        setSubmissionId(res.submission.id);
        setIsSubmitted(true);
        success('Property listing submitted for review by Growth Realtors acquisitions desk.');
      }
    } catch (err: any) {
      error(err.message || 'Failed to submit property listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-10">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-black/10 text-[#B5945E] text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B5945E]" />
          Private Seller & Developer Desk
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
          List Your Extraordinary Property
        </h1>
        <p className="text-xs sm:text-sm text-black/60">
          Connect directly with Pakistan's most affluent domestic and expatriate buyer networks through Growth Realtors.
        </p>
      </div>

      {/* SUBMISSION PROCESS CARD */}
      <div className="bg-white border border-black/10 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        
        {isSubmitted ? (
          <div className="text-center py-10 space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                Property Submitted for Review
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#B5945E]">
                Submission Reference: #{submissionId}
              </p>
              <p className="text-xs text-black/70 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-[#1A1A1A]">{ownerName}</strong>. Our senior acquisitions director will perform preliminary title checks and contact you at <strong className="text-[#1A1A1A]">{phone}</strong> within 24 hours to schedule photography and marketing onboarding.
              </p>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => navigate('properties')}
                className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider"
              >
                Browse Current Listings
              </button>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setStep(1);
                }}
                className="px-6 py-2.5 bg-[#FDFCF9] text-[#1A1A1A] font-bold text-xs uppercase tracking-wider border border-black/10 hover:bg-black/5"
              >
                Submit Another Property
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Step Progress Tracker */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/10">
              {[
                { s: 1, label: 'Owner Details' },
                { s: 2, label: 'Property Specs' },
                { s: 3, label: 'Pricing & Description' },
                { s: 4, label: 'Photos & Review' }
              ].map((item) => (
                <div key={item.s} className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 flex items-center justify-center text-xs font-bold transition-all ${
                      step === item.s
                        ? 'bg-[#1A1A1A] text-white'
                        : step > item.s
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-[#FDFCF9] text-black/40 border border-black/10'
                    }`}
                  >
                    {step > item.s ? <Check className="w-3.5 h-3.5" /> : item.s}
                  </div>
                  <span className="text-xs font-semibold text-black/70 hidden sm:inline-block">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: OWNER DETAILS */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A] border-l-2 border-[#B5945E] pl-3">
                    Step 1: Ownership & Contact Information
                  </h3>
                  
                  <div>
                    <label className="block text-xs font-medium text-black/70 mb-1">Owner / Authorized Representative Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-black/40" />
                      <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        required
                        placeholder="e.g., Salman Farooq"
                        className="w-full pl-10 pr-4 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-black/70 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 w-4 h-4 text-black/40" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="owner@example.com"
                          className="w-full pl-10 pr-4 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-black/70 mb-1">Phone / WhatsApp</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 w-4 h-4 text-black/40" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          placeholder="+92 300 1234567"
                          className="w-full pl-10 pr-4 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={!ownerName || !email || !phone}
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                      <span>Continue to Property Specs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PROPERTY SPECS */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A] border-l-2 border-[#B5945E] pl-3">
                    Step 2: Property Type & Dimensions
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-black/70 mb-1">City</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                      >
                        <option value="Islamabad">Islamabad</option>
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-black/70 mb-1">Listing Type</label>
                      <select
                        value={listingType}
                        onChange={(e) => setListingType(e.target.value as ListingType)}
                        className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                      >
                        <option value="Buy">For Sale (Outright Acquisition)</option>
                        <option value="Rent">For Rent / Lease</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-black/70 mb-1">Property Category</label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                        className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                      >
                        <option value="Villa">Designer Villa</option>
                        <option value="Mansion">Private Mansion</option>
                        <option value="Penthouse">Sky Penthouse</option>
                        <option value="Apartment">Luxury Apartment</option>
                        <option value="Commercial">Commercial Building / Office</option>
                        <option value="Plot">Residential Plot</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-black/70 mb-1">Full Address / Sector & Street</label>
                      <input
                        type="text"
                        value={propertyAddress}
                        onChange={(e) => setPropertyAddress(e.target.value)}
                        required
                        placeholder="e.g., House 14, Street 22, Sector F-7/2"
                        className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-black/70 mb-1">Area Size</label>
                      <input
                        type="number"
                        value={area}
                        onChange={(e) => setArea(Number(e.target.value) || 1)}
                        className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-black/70 mb-1">Unit</label>
                      <select
                        value={areaUnit}
                        onChange={(e) => setAreaUnit(e.target.value as any)}
                        className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                      >
                        <option value="Kanal">Kanal</option>
                        <option value="Marla">Marla</option>
                        <option value="sq ft">sq ft</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-black/70 mb-1">Bedrooms</label>
                      <input
                        type="number"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-black/70 mb-1">Bathrooms</label>
                      <input
                        type="number"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(Number(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-2 bg-[#FDFCF9] text-black/70 text-xs font-bold uppercase tracking-wider border border-black/10 hover:bg-black/5 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      disabled={!propertyAddress}
                      onClick={() => setStep(3)}
                      className="px-6 py-2 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                      <span>Continue to Pricing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: PRICING & DESCRIPTION */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A] border-l-2 border-[#B5945E] pl-3">
                    Step 3: Asking Valuation & Narrative
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-black/70 mb-1">
                      Asking Price (PKR)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3.5 top-3 w-4 h-4 text-black/40" />
                      <input
                        type="number"
                        value={askingPrice}
                        onChange={(e) => setAskingPrice(Number(e.target.value) || 0)}
                        step="500000"
                        className="w-full pl-10 pr-4 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                      />
                    </div>
                    <span className="text-[10px] text-[#B5945E] font-bold mt-1 block">
                      ≈ PKR {(askingPrice / 10000000).toFixed(2)} Crore
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-black/70 mb-1">
                      Property Description & Architectural Highlights
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe interior materials, imported fixtures, swimming pool, solar power system, generator capacity, possession timeline, and registry status..."
                      className="w-full p-3 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-5 py-2 bg-[#FDFCF9] text-black/70 text-xs font-bold uppercase tracking-wider border border-black/10 hover:bg-black/5 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(4)}
                      className="px-6 py-2 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
                    >
                      <span>Continue to Photos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: PHOTOS & FINAL SUBMIT */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="font-serif text-xl font-bold text-[#1A1A1A] border-l-2 border-[#B5945E] pl-3">
                    Step 4: Photography & Final Submission
                  </h3>

                  <div className="p-4 bg-[#FDFCF9] border border-black/10 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <label className="block text-xs font-semibold text-[#1A1A1A]">
                        Add High-Resolution Images (Firebase Storage or URL)
                      </label>
                      <label className="cursor-pointer px-3 py-1.5 bg-[#FDFCF9] hover:bg-[#1A1A1A] hover:text-white text-[#1A1A1A] text-xs font-bold uppercase tracking-wider border border-black/10 transition-colors inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-[#B5945E]" />
                        <span>{isUploadingImage ? 'Uploading...' : 'Upload Photos'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          disabled={isUploadingImage}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Or paste image URL (https://images.unsplash.com/...)"
                        className="flex-1 px-3 py-2 bg-white border border-black/10 text-[#1A1A1A] text-xs placeholder-black/40 focus:outline-none focus:border-[#B5945E]"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-colors"
                      >
                        Add URL
                      </button>
                    </div>

                    {/* Previews */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      {imageUrls.map((img, idx) => (
                        <div key={idx} className="relative aspect-video overflow-hidden border border-black/10 group">
                          <img src={img} alt="Upload preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 px-2 py-0.5 bg-red-600 text-white text-[9px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-[#F7F5F2] border border-black/10 text-xs text-black/70 space-y-1">
                    <span className="font-bold text-[#1A1A1A] block">By submitting this listing, you confirm:</span>
                    <p>• You are the verified legal title holder or authorized attorney of the property.</p>
                    <p>• You agree to Growth Realtors performing independent CDA / LDA / DHA registry checks.</p>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-5 py-2 bg-[#FDFCF9] text-black/70 text-xs font-bold uppercase tracking-wider border border-black/10 hover:bg-black/5 flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-2.5 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 transition-colors"
                    >
                      <span>{isSubmitting ? 'Submitting to Review Desk...' : 'Complete & Submit Listing'}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
