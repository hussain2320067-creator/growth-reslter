import React, { useState } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';
import { IProperty } from '../../types';
import { viewingService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface ViewingModalProps {
  property: IProperty | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewingModal: React.FC<ViewingModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('11:00 AM');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await viewingService.createViewing({
        propertyId: property.id,
        name,
        email,
        phone,
        date,
        time,
        message
      });
      if (res.success) {
        setIsScheduled(true);
        success('Private viewing appointment requested. Our concierge will confirm timing.');
      }
    } catch (err: any) {
      error(err.message || 'Failed to schedule viewing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsScheduled(false);
    onClose();
  };

  return (
    <div
      id="viewing-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="viewing-modal-container"
        className="relative w-full max-w-lg bg-white border border-black/10 p-6 sm:p-8 shadow-xl overflow-hidden text-xs"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-black/40 hover:text-black transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isScheduled ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">
              Viewing Appointment Requested
            </h3>
            <p className="text-xs text-black/70 max-w-sm mx-auto mb-6">
              Your private walkthrough for <span className="text-[#B5945E] font-semibold">{property.title}</span> on <span className="text-[#1A1A1A] font-semibold">{date}</span> at <span className="text-[#1A1A1A] font-semibold">{time}</span> has been logged.
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
            <div className="mb-5 pb-4 border-b border-black/10">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#B5945E] mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                VIP Private Walkthrough
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                Schedule a Property Viewing
              </h3>
              <p className="text-xs text-black/60 mt-1">
                Tour <span className="text-[#B5945E] font-semibold">{property.title}</span> with our dedicated property specialist.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-black/70 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-black/40" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your Name"
                    className="w-full pl-9 pr-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] placeholder-black/40 text-xs focus:outline-none focus:border-[#B5945E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-black/70 mb-1">Email</label>
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
                  <label className="block text-xs font-semibold text-black/70 mb-1">Phone Number</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-black/70 mb-1">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-black/40" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-9 pr-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-black/70 mb-1">Preferred Time Slot</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 w-4 h-4 text-black/40" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                    >
                      <option value="10:00 AM">10:00 AM - Morning</option>
                      <option value="11:30 AM">11:30 AM - Morning</option>
                      <option value="02:00 PM">02:00 PM - Afternoon</option>
                      <option value="04:00 PM">04:00 PM - Late Afternoon</option>
                      <option value="05:30 PM">05:30 PM - Sunset Walkthrough</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black/70 mb-1">Special Requirements / Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Interested in checking structural foundation and security systems..."
                  className="w-full p-2.5 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] placeholder-black/40 text-xs focus:outline-none focus:border-[#B5945E]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Booking Slot...' : 'Confirm Viewing Appointment'}</span>
                <Calendar className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
