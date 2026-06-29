import React from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const contactCards = [
  {
    icon: User,
    label: 'Name',
    value: 'Balraj',
    href: null,
  },
  {
    icon: Phone,
    label: 'Phone Number',
    value: '+91 98427 26655',
    href: 'tel:+919842726655',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'balrajvs@gmail.com',
    href: 'mailto:balrajvs@gmail.com',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const ContactInfo = () => {
  const handleConnect = () => {
    const consultationSection = document.getElementById('consultation-form');
    if (consultationSection) {
      consultationSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open('https://wa.me/919842726655', '_blank');
    }
  };

  return (
    <section className="relative section-padding overflow-hidden bg-black">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-transparent via-green-500/[0.02] to-green-500/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-green-400 text-xs font-semibold tracking-[0.2em] uppercase block mb-4">
            Contact Me
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Get in Touch
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Have questions about cryptocurrency investments or the Beldex ecosystem? Get in touch and I'll be happy to help.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto"
        >
          {contactCards.map((card, i) => {
            const CardWrapper = card.href ? motion.a : motion.div;
            const wrapperProps = card.href
              ? {
                  href: card.href,
                  target: card.href.startsWith('http') ? '_blank' : undefined,
                  rel: card.href.startsWith('http') ? 'noopener noreferrer' : undefined,
                }
              : {};

            return (
              <CardWrapper
                key={i}
                variants={fadeInUp}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="group relative bg-[#0A0A0A] rounded-2xl border border-white/[0.04] p-6 sm:p-8 flex flex-col items-center text-center hover:border-green-500/20 transition-all duration-500 cursor-pointer"
                {...wrapperProps}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/15 flex items-center justify-center mb-4 group-hover:bg-green-500/15 group-hover:border-green-500/30 transition-all duration-300">
                    <card.icon size={24} className="text-green-400" />
                  </div>
                  <span className="block text-xs text-zinc-500 font-medium tracking-wider uppercase mb-1">
                    {card.label}
                  </span>
                  <span className="block text-white text-lg sm:text-xl font-bold group-hover:text-green-400 transition-colors duration-300">
                    {card.value}
                  </span>
                </div>
              </CardWrapper>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center mt-10"
        >
          <Button
            size="lg"
            className="gap-2 group shadow-lg shadow-green-500/15"
            onClick={handleConnect}
          >
            Let's Connect
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactInfo;
