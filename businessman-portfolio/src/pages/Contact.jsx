import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { submitContact } from '@/config/api';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'balrajvs@gmail.com', href: 'mailto:balrajvs@gmail.com' },
  { icon: Phone, label: 'Phone', value: '9842726655', href: 'tel:+919842726655' },
  { icon: MapPin, label: 'Office', value: 'Digital Asset Advisory\nSalem, Tamil Nadu', href: null },
];

const Contact = () => {
  const formRef = useRef(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      formRef.current?.querySelector('input')?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const WA_PHONE = import.meta.env.VITE_WHATSAPP_PHONE || '919842726655';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await submitContact({ name, email, phone, subject, message });

      const waText = `\u{1F6A8} NEW CONTACT ALERT \u{1F6A8}

\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}

\u{1F464} Name: ${name}
\u{1F4E7} Email: ${email}
\u{1F4F1} Phone: ${phone}

\u{1F4CC} Subject:
${subject}

\u{1F4AC} Message:
${message}

\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}
\u{1F310} Source: Balraj Portfolio Website
\u{23F0} ${new Date().toLocaleString()}`;

      window.open(
        `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(waText)}`,
        '_blank'
      );

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-4 pb-3 overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[150px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-green-400 text-xs font-semibold tracking-[0.2em] uppercase mb-4 block">
              Contact
            </span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Get in Touch with{' '}
              <span className="text-gradient">Balraj</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="relative section-padding pt-0 pb-20 lg:pb-28 overflow-hidden bg-black">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xl font-bold text-white mb-6">Send a Message</h2>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                      Name <span className="text-green-400">*</span>
                    </label>
                    <Input
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                      Email <span className="text-green-400">*</span>
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    placeholder="+91 98427 26655"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                    Subject <span className="text-green-400">*</span>
                  </label>
                  <Input
                    placeholder="How can I help you?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                    Message <span className="text-green-400">*</span>
                  </label>
                  <Textarea
                    placeholder="Tell me about your investment goals and how I can assist..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full gap-2 group shadow-lg shadow-green-500/15" disabled={loading}>
                  {loading ? (
                    'Submitting...'
                  ) : success ? (
                    <>
                      <CheckCircle size={18} />
                      Message Sent Successfully
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>

              <div className="space-y-5 mb-8">
                {contactInfo.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  >
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="flex items-start gap-4 group"
                      >
                        <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/15 flex items-center justify-center shrink-0 group-hover:bg-green-500/15 transition-colors duration-300">
                          <item.icon size={18} className="text-green-400" />
                        </div>
                        <div>
                          <div className="text-xs text-[#A1A1AA] mb-0.5">{item.label}</div>
                          <div className="text-white text-sm font-medium group-hover:text-green-400 transition-colors duration-300 whitespace-pre-line">
                            {item.value}
                          </div>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/15 flex items-center justify-center shrink-0">
                          <item.icon size={18} className="text-green-400" />
                        </div>
                        <div>
                          <div className="text-xs text-[#A1A1AA] mb-0.5">{item.label}</div>
                          <div className="text-white text-sm font-medium whitespace-pre-line">{item.value}</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Office Hours */}
              <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]">
                <div className="flex items-center gap-3 mb-4">
                  <Clock size={18} className="text-green-400" />
                  <h4 className="text-white font-semibold text-sm">Office Hours</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Monday – Friday</span>
                    <span className="text-white">9:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Saturday</span>
                    <span className="text-white">10:00 AM – 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Sunday</span>
                    <span className="text-white">Closed</span>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
