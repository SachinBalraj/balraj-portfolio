import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Target,
  DollarSign,
  MessageSquare,
  Send,
  CheckCircle,
  ArrowRight,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { submitConsultation, getAvailability } from '@/config/api';
import CalendarWidget from '@/components/CalendarWidget';

const budgetRanges = [
  'Under $10,000',
  '$10,000 – $50,000',
  '$50,000 – $100,000',
  '$100,000 – $500,000',
  '$500,000 – $1,000,000',
  'Over $1,000,000',
];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const BudgetCard = ({ label, selected, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`p-5 rounded-xl text-sm font-medium border transition-all duration-300 ${
      selected
        ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_20px_-5px_rgba(34,197,94,0.2)] scale-[1.02]'
        : 'bg-[#0A0A0A] border-white/[0.04] text-zinc-400 hover:border-white/[0.08] hover:bg-white/[0.02]'
    } ${disabled && !selected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    {label}
  </button>
);

const SlotButton = ({ slot, isSelected, onSelect, formatTimeDisplay }) => {
  const isAvailable = slot.status === 'available';
  const isBooked = slot.status === 'booked';
  const isBlocked = slot.status === 'blocked';

  return (
    <button
      type="button"
      onClick={() => isAvailable && onSelect(slot.time)}
      disabled={!isAvailable}
      className={`
        relative py-3 px-2 rounded-xl text-sm font-medium border transition-all duration-200 overflow-hidden group
        ${isAvailable
          ? isSelected
            ? 'bg-green-500/20 border-green-500 text-green-400 ring-1 ring-green-500/30 scale-[1.02]'
            : 'bg-[#050505] border-white/[0.06] text-zinc-300 hover:border-green-500/30 hover:text-green-400 cursor-pointer'
          : ''
        }
        ${isBooked
          ? 'bg-[#3B0A0A] border-[#EF4444] text-[#F87171] cursor-not-allowed pointer-events-none'
          : ''
        }
        ${isBlocked
          ? 'bg-zinc-800/40 border-zinc-700/30 text-zinc-600 cursor-not-allowed pointer-events-none'
          : ''
        }
      `}
    >
      <div className="flex flex-col items-center gap-0.5">
        <span className={isBooked || isBlocked ? 'opacity-70' : ''}>
          {formatTimeDisplay(slot.time)}
        </span>
        {isBooked && (
          <span className="flex items-center gap-1 text-[10px] text-[#F87171]/70">
            <Lock size={10} />
            Booked
          </span>
        )}
      </div>
    </button>
  );
};

const Legend = () => (
  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/[0.04]">
    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
      <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
      Available
    </span>
    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
      Booked
    </span>
    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
      <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
      Unavailable
    </span>
  </div>
);

const Consultation = () => {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [investmentBudget, setInvestmentBudget] = useState(null);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isNavigating, setIsNavigating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const handleBudgetSelect = (budget) => {
    if (isNavigating) return;
    setIsNavigating(true);
    setInvestmentBudget(budget);
    setTimeout(() => {
      setStep(3);
      setIsNavigating(false);
    }, 300);
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setMeetingDate(date);
    setMeetingTime('');

    if (!date) {
      setSlots([]);
      return;
    }

    const today = new Date();
    const selected = new Date(date + 'T00:00:00');
    if (selected < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      setError('Cannot select a past date');
      return;
    }
    setError('');

    setLoadingSlots(true);
    try {
      const res = await getAvailability(date);
      setSlots(res.data.slots || []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSlotSelect = (time) => {
    setMeetingTime(time);
  };

  const formatTimeDisplay = (time) => {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  const WA_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || '919842726655';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await submitConsultation({
        fullName,
        email,
        phone,
        company,
        investmentBudget,
        meetingDate,
        meetingTime,
        notes,
      });

      const waText = `\u{1F6A8} NEW CONSULTATION REQUEST \u{1F6A8}

\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}

\u{1F464} Name: ${fullName}
\u{1F4E7} Email: ${email}
\u{1F4F1} Phone: ${phone}
\u{1F3E2} Company: ${company || 'N/A'}

\u{1F4B0} Investment Budget:
${investmentBudget || 'N/A'}

\u{1F4C5} Preferred Date:
${meetingDate}

\u{23F0} Preferred Time:
${meetingTime}

\u{1F4DD} Notes:
${notes || 'N/A'}

\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}
\u{1F310} Source: Balraj Portfolio Website
\u{23F0} ${new Date().toLocaleString()}`;

      window.open(
        `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(waText)}`,
        '_blank'
      );

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
      if (err.message.includes('already booked') || err.message.includes('booked by another user')) {
        setSlots((prev) =>
          prev.map((s) =>
            s.time === meetingTime ? { ...s, status: 'booked' } : s
          )
        );
        setMeetingTime('');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div>
        <section className="relative pt-24 pb-1 overflow-hidden bg-black">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[150px]" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-green-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
                Consultation
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                Schedule Your{' '}
                <span className="text-gradient">Consultation</span>
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
                Book a personalized session to discuss your investment strategy and long-term goals.
              </p>
            </motion.div>
          </div>
        </section>
        <section className="relative section-padding pt-0 overflow-hidden bg-black">
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0A0A0A] rounded-3xl p-10 border border-white/[0.04] text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Consultation Request Submitted</h2>
              <p className="text-zinc-400 text-base max-w-md mx-auto mb-8">
                Thank you. Balraj will review your details and reach out within 24 hours to confirm your session.
              </p>
              <a
                href={`https://wa.me/${WA_PHONE}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-base font-medium hover:bg-green-500/15 transition-all duration-300"
              >
                <MessageSquare size={20} />
                Chat on WhatsApp
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-24 pb-1 overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-green-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
              Consultation
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Schedule Your{' '}
              <span className="text-gradient">Consultation</span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              Book a personalized session to discuss your investment strategy and long-term goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Consultation Form */}
      <section className="relative section-padding pt-0 overflow-hidden bg-black">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-0">
            {/* Left - Form */}
            <div className="w-full lg:w-[55%] xl:w-[60%] lg:pr-5 xl:pr-7">
              <div className="bg-[#0A0A0A] rounded-3xl p-8 sm:p-10 border border-white/[0.04]">
            {/* Steps Progress */}
            <div className="flex items-center gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                    step >= s
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-white/[0.04] text-zinc-600 border border-white/[0.04]'
                  }`}>
                    {s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-0.5 transition-all duration-300 ${
                      step > s ? 'bg-green-500/30' : 'bg-white/[0.04]'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Info + Goals */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Target size={28} className="text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-base font-medium text-[#A1A1AA] mb-2">
                        Full Name <span className="text-green-400">*</span>
                      </label>
                      <Input
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="h-14 text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-[#A1A1AA] mb-2">
                        Email Address <span className="text-green-400">*</span>
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-14 text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-[#A1A1AA] mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+91 98427 26655"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="h-14 text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-base font-medium text-[#A1A1AA] mb-2">
                        Company (Optional)
                      </label>
                      <Input
                        placeholder="Your company name"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="h-14 text-base"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="button" onClick={() => setStep(2)} size="xl" className="gap-3">
                      Next Step
                      <ArrowRight size={20} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Risk Profile + Budget */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <DollarSign size={28} className="text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Investment Budget</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {budgetRanges.map((range) => (
                      <BudgetCard
                        key={range}
                        label={range}
                        selected={investmentBudget === range}
                        onClick={() => handleBudgetSelect(range)}
                        disabled={isNavigating}
                      />
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button type="button" variant="outline" size="xl" onClick={() => setStep(1)} className="w-full sm:w-auto">
                      Back
                    </Button>
                    <Button type="button" onClick={() => setStep(3)} size="xl" className="gap-3 w-full sm:w-auto">
                      Next Step
                      <ArrowRight size={20} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Schedule + Message */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Calendar size={28} className="text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Preferred Meeting</h2>
                  </div>

                  <div className="space-y-6 mb-8">
                    <div>
                      <label className="block text-base font-medium text-[#A1A1AA] mb-2">
                        Preferred Date <span className="text-green-400">*</span>
                      </label>
                      <Input
                        type="date"
                        value={meetingDate}
                        onChange={handleDateChange}
                        required
                        className="h-14 text-base"
                      />
                    </div>

                    {meetingDate && (
                      <div>
                        <label className="block text-base font-medium text-[#A1A1AA] mb-3">
                          Time Slots <span className="text-green-400">*</span>
                        </label>

                        {loadingSlots ? (
                          <div className="flex items-center gap-2 text-sm text-zinc-500">
                            <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                            Loading time slots...
                          </div>
                        ) : slots.length === 0 ? (
                          <p className="text-sm text-red-400">
                            No slots available for this date. Please select another date.
                          </p>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {slots.map((slot) => (
                                <SlotButton
                                  key={slot.time}
                                  slot={slot}
                                  isSelected={meetingTime === slot.time}
                                  onSelect={handleSlotSelect}
                                  formatTimeDisplay={formatTimeDisplay}
                                />
                              ))}
                            </div>
                            <Legend />
                          </>
                        )}

                        {meetingTime && (
                          <p className="mt-2 text-xs text-green-400">
                            Selected: {meetingDate} at {formatTimeDisplay(meetingTime)}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <MessageSquare size={28} className="text-green-400" />
                    <h2 className="text-2xl font-bold text-white">Additional Notes</h2>
                  </div>

                  <div className="mb-8">
                    <Textarea
                      placeholder="Share any specific questions, goals, or topics you'd like to discuss during the consultation..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="text-base"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Button type="button" variant="outline" size="xl" onClick={() => setStep(2)} className="w-full sm:w-auto">
                      Back
                    </Button>
                    <Button type="submit" size="xl" className="flex-1 gap-3 group shadow-lg shadow-green-500/15 w-full sm:w-auto" disabled={loading}>
                      {loading ? (
                        'Submitting...'
                      ) : (
                        <>
                          <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                          Submit Consultation Request
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </form>
          </div>

          {/* WhatsApp CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 text-center"
          >
            <a
              href={`https://wa.me/${WA_PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-green-500/10 border border-green-500/15 text-green-400 text-base font-medium hover:bg-green-500/15 transition-all duration-300"
            >
              <MessageSquare size={20} />
              Prefer WhatsApp? Chat directly with Balraj
            </a>
          </motion.div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden lg:block w-px flex-shrink-0 bg-gradient-to-b from-transparent via-green-500/30 to-transparent" />

            {/* Right - Calendar */}
            <div className="w-full lg:w-[calc(45%-1px)] xl:w-[calc(40%-1px)] lg:pl-5 xl:pl-7 mt-8 lg:mt-0">
              <CalendarWidget />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Consultation;
