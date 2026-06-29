import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, FileSearch, Handshake, Monitor } from 'lucide-react';
import ServiceItem from '@/components/ServiceItem';

const services = [
  {
    icon: TrendingUp,
    title: 'Crypto Buy & Sell',
    exchanges: [
      {
        name: 'KuCoin',
        description: 'A global cryptocurrency exchange offering spot trading, futures trading, staking, and hundreds of digital assets.',
        url: 'https://www.kucoin.com/',
      },
      {
        name: 'KoinBX',
        description: 'An Indian cryptocurrency exchange that supports secure INR deposits, crypto trading, and easy onboarding for Indian users.',
        url: 'https://koinbx.com/',
      },
    ],
  },
  {
    icon: FileSearch,
    title: 'Crypto Details',
    features: [
      'Blockchain fundamentals',
      'Coin analysis',
      'Tokenomics',
      'Project roadmap',
      'Market capitalization',
      'Future growth potential',
    ],
    button: 'Learn More',
  },
  {
    icon: Handshake,
    title: 'Investment Consultation',
    features: [
      'Personalized investment strategy',
      'Portfolio planning',
      'Risk assessment',
      'Long-term investment guidance',
      'Diversification recommendations',
    ],
    button: 'Book Consultation',
  },
  {
    icon: Monitor,
    title: 'Crypto Presentations',
    features: [
      'Crypto awareness sessions',
      'Blockchain presentations',
      'Web3 workshops',
      'Beldex ecosystem training',
      'Corporate and college seminars',
    ],
    button: 'Learn More',
  },
];

const ServiceAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative section-padding pt-24 md:pt-28 lg:pt-32 overflow-hidden bg-black">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-green-500/5 rounded-full blur-[120px]" />
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
            My Services
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Professional Crypto Consulting{' '}
            <span className="text-gradient">& Investment Solutions</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            Explore the services I offer to help you invest, learn, and grow in
            the cryptocurrency ecosystem.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <ServiceItem
                service={service}
                isOpen={openIndex === i}
                onToggle={() => handleToggle(i)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceAccordion;
