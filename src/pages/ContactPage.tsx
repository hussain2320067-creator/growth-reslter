import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { contactService } from '../services/api';
import { useToast } from '../context/ToastContext';

interface ContactPageProps {
  navigate: (route: string, params?: Record<string, any>) => void;
  initialSubject?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({ initialSubject = '' }) => {
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(initialSubject || 'General Luxury Real Estate Advisory');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await contactService.sendMessage({
        name,
        email,
        phone,
        subject,
        message
      });
      if (res.success) {
        setIsSubmitted(true);
        success('Thank you for contacting Growth Realtors. Our senior advisory desk has received your message.');
      }
    } catch (err: any) {
      error(err.message || 'Failed to submit message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const offices = [
    {
      city: 'Islamabad (Headquarters)',
      address: '4th Floor, Beverly Centre, Blue Area, Islamabad',
      phone: '+92 51 8899770',
      email: 'islamabad@growthrealtors.com',
      hours: 'Mon - Sat: 9:00 AM - 7:00 PM'
    },
    {
      city: 'Lahore Advisory Office',
      address: 'Phase 5 Commercial Hub, DHA, Lahore',
      phone: '+92 42 3578990',
      email: 'lahore@growthrealtors.com',
      hours: 'Mon - Sat: 9:30 AM - 7:00 PM'
    },
    {
      city: 'Karachi Oceanfront Desk',
      address: 'Emaar Oceanfront Promenade, Phase 8, DHA Karachi',
      phone: '+92 21 3890123',
      email: 'karachi@growthrealtors.com',
      hours: 'Mon - Sat: 10:00 AM - 7:30 PM'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-black/10 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-sm">
        <div className="relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDFCF9] border border-black/10 text-[#B5945E] text-[10px] font-bold uppercase tracking-widest">
            <Mail className="w-3 h-3 text-[#B5945E]" />
            Advisory Concierge
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Connect with Growth Realtors
          </h1>
          <p className="text-xs sm:text-sm text-black/60 max-w-2xl mx-auto leading-relaxed">
            Directly engage our managing partners, schedule private property audits, or request unlisted portfolio briefings.
          </p>
        </div>
      </div>

      {/* Main Grid: Form + Office Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Contact Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-black/10 p-6 sm:p-10 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
                Message Dispatched
              </h3>
              <p className="text-xs text-black/70 max-w-md mx-auto">
                Thank you, {name}. A dedicated senior advisor will reach out to you via {phone || email} within 2 business hours.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setMessage('');
                }}
                className="px-6 py-2 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-1">
                  Send a Confidential Message
                </h3>
                <p className="text-xs text-black/60">
                  Fill out the details below and our concierge team will respond promptly.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-black/70 mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-black/70 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-black/70 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-black/70 mb-1">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  placeholder="e.g. F-7 Villa Inquiry, DHA Plot Valuation..."
                  className="w-full px-3 py-2 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-black/70 mb-1">Message Details</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Please specify your investment requirements, timeline, and preferred locations..."
                  className="w-full p-3 bg-[#FDFCF9] border border-black/10 text-[#1A1A1A] text-xs focus:outline-none focus:border-[#B5945E]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-6 bg-[#1A1A1A] hover:bg-[#B5945E] text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              >
                <span>{isSubmitting ? 'Transmitting Message...' : 'Submit Message to Advisory'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Office Locations (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="mb-2">
            <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
              Executive Presence
            </h3>
            <p className="text-xs text-black/60">
              Visit our offices or connect directly via dedicated lines.
            </p>
          </div>

          {offices.map((office) => (
            <div
              key={office.city}
              className="p-5 bg-white border border-black/10 space-y-2"
            >
              <h4 className="font-serif text-base font-bold text-[#B5945E]">
                {office.city}
              </h4>
              <div className="space-y-1 text-xs text-black/70">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B5945E] shrink-0 mt-0.5" />
                  <span>{office.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#B5945E] shrink-0" />
                  <span>{office.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#B5945E] shrink-0" />
                  <span>{office.email}</span>
                </div>
                <div className="flex items-center gap-2 text-black/50 pt-1">
                  <Clock className="w-3.5 h-3.5 text-black/40 shrink-0" />
                  <span>{office.hours}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
