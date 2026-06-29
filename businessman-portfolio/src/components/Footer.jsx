import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  ArrowUp,
  ArrowRight,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const contactActions = [
  { icon: Mail, href: 'mailto:balrajvs@gmail.com', label: 'Email Balraj' },
  { icon: Phone, href: 'tel:+919842726655', label: 'Call Balraj' },
];

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Achievements', to: '/achievements' },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/5 mt-24 md:mt-28 lg:mt-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-green-500/[0.02]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center font-bold text-background text-base shadow-lg shadow-green-500/25">
                B
              </div>
              <span className="text-base font-bold tracking-tight">
                <span className="text-gradient">Balraj</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-md mb-3">
              Transforming visions into market-leading enterprises with strategic crypto advisory and blockchain expertise.
            </p>
            <div className="flex gap-2">
              {contactActions.map((action, i) => (
                <motion.a
                  key={i}
                  href={action.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-green-400 hover:border-green-500/30 transition-all duration-300"
                  aria-label={action.label}
                >
                  <action.icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-2">Quick Links</h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={scrollToTop}
                    className="text-muted-foreground text-xs hover:text-green-400 transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-green-400 text-[10px] font-semibold tracking-[0.15em] uppercase mb-1.5 block">
              Get Started Today
            </span>
            <h4 className="text-white font-bold text-xs mb-1 leading-snug">
              Ready to Build Your{' '}
              <span className="text-gradient">Crypto Future?</span>
            </h4>
            <p className="text-muted-foreground text-[10px] leading-relaxed mb-3">
              Take the first step toward building and managing your cryptocurrency portfolio with expert guidance.
            </p>
            <div className="flex flex-col gap-1">
              <Link to="/consultation">
                <Button size="sm" className="w-full gap-1 text-xs h-8">
                  Schedule Consultation
                  <ArrowRight size={12} />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="sm" variant="outline" className="w-full gap-1 text-xs h-8">
                  Explore Services
                  <Play size={10} />
                </Button>
              </Link>

            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Balraj. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground text-[10px] hover:text-green-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground text-[10px] hover:text-green-400 transition-colors">
              Terms of Service
            </a>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-all duration-300"
            >
              <ArrowUp size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
