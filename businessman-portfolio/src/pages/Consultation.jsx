import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePhone = (phone) => /^\+?\d{7,15}$/.test(phone.replace(/[\s\-]/g, ''));

const Consultation = () => {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', preferredDate: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    else if (!validateEmail(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.phone.trim()) errs.phone = 'Phone number is required.';
    else if (!validatePhone(form.phone)) errs.phone = 'Enter a valid phone number.';
    if (!form.preferredDate) errs.preferredDate = 'Please select a date.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const WA_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || '919842726655';
      const waText = [
        '\u{1F6A8} NEW CONSULTATION REQUEST \u{1F6A8}',
        '',
        '\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}',
        '',
        `\u{1F464} Name: ${form.fullName}`,
        `\u{1F4E7} Email: ${form.email}`,
        `\u{1F4F1} Phone: ${form.phone}`,
        `\u{1F4C5} Preferred Date: ${form.preferredDate}`,
        '',
        '\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}',
        `\u{1F310} Source: Balraj Portfolio Website`,
        `\u{23F0} ${new Date().toLocaleString()}`,
      ].join('\n');

      window.open(`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(waText)}`, '_blank');
      setSubmitted(true);
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div>
        <section className="relative pt-28 pb-20 overflow-hidden bg-black min-h-screen flex items-center">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[150px]" />
          </div>
          <div className="relative max-w-lg mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-[#0A0A0A] rounded-3xl p-10 border border-white/[0.04] text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Thank you!</h2>
              <p className="text-zinc-400 text-base leading-relaxed">
                Your request has been submitted successfully.<br />We'll contact you soon.
              </p>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="relative pt-28 pb-20 overflow-hidden bg-black min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-lg mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center mb-8"
          >
            <span className="text-green-400 text-xs font-semibold tracking-[0.2em] uppercase block mb-4">
              Get In Touch
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Get In{' '}
              <span className="text-gradient">Touch</span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base mt-3 leading-relaxed">
              We'd love to hear from you. Fill out the form below.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-[#0A0A0A] rounded-2xl p-6 sm:p-8 border border-white/[0.04]"
          >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-1.5">
                  Full Name <span className="text-green-400">*</span>
                </label>
                <Input
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={handleChange('fullName')}
                />
                {errors.fullName && (
                  <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-1.5">
                  Email Address <span className="text-green-400">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange('email')}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-1.5">
                  Phone Number <span className="text-green-400">*</span>
                </label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange('phone')}
                />
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-1.5">
                  Preferred Date <span className="text-green-400">*</span>
                </label>
                <Input
                  type="date"
                  value={form.preferredDate}
                  onChange={handleChange('preferredDate')}
                />
                {errors.preferredDate && (
                  <p className="text-red-400 text-xs mt-1">{errors.preferredDate}</p>
                )}
              </div>

              {errors.form && (
                <p className="text-red-400 text-sm text-center">{errors.form}</p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 group shadow-lg shadow-green-500/15"
                disabled={loading}
              >
                {loading ? (
                  'Submitting...'
                ) : (
                  <>
                    Submit
                    <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Consultation;
