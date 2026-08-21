import React, { useState } from 'react';
import { X, Send, Mail, Phone, User, Building, CheckCircle2 } from 'lucide-react';
import { IProperty } from '../../types';
import { inquiryService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface InquiryModalProps {
  property: IProperty | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [message, setMessage] = useState('I am interested in this luxury listing and would like to receive verified documentation and pricing breakdown.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await inquiryService.createInquiry({
        propertyId: property.id,
        name,
        email,
        phone,
        message
      });
      if (res.success) {
        setIsSubmitted(true);
        success('Inquiry submitted. Our senior advisor will contact you within 2 business hours.');
      }
    } catch (err: any) {
      error(err.message || 'Failed to submit inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div
      id="inquiry-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="inquiry-modal-container"
        className="relative w-full max-w-lg bg-white border border-black/10 p-6 sm:p-8 shadow-xl overflow-hidden text-xs"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-black/40 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">
              Inquiry Dispatched
            </h3>
            <p className="text-xs text-black/70 max-w-sm mx-auto mb-6">
              Thank you, {name}. Your inquiry for <span className="text-[#B5945E] font-semibold">{property.title}</span> has been routed to assigned specialist <span className="text-[#1A1A1A] font-semibold">{property.agentName}</span>.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-black/10">
              <img
                src={property.featuredImage}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-16 h-12 object-cover border border-black/10"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B5945E]">
                  Property Inquiry
                </span>
                <h4 className="font-serif text-base font-bold text-[#1A1A1A] truncate">
                  {property.title}
                </h4>
                <p className="text-xs text-black/50 truncate">{property.location}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-black/70 mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-black/40" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full pl-9 pr-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] placeholder-black/40 text-xs focus:outline-none focus:border-[#B5945E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-black/70 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-black/40" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@domain.com"
                      className="w-full pl-9 pr-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] placeholder-black/40 text-xs focus:outline-none focus:border-[#B5945E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-black/70 mb-1">Phone / WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-black/40" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+92 300 1234567"
                      className="w-full pl-9 pr-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] placeholder-black/40 text-xs focus:outline-none focus:border-[#B5945E]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black/70 mb-1">Message / Questions</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full p-2.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] placeholder-black/40 text-xs focus:outline-none focus:border-[#B5945E]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Sending Inquiry...' : 'Submit Inquiry'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
