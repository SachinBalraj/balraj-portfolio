import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, FileSearch, Handshake, Monitor, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: TrendingUp,
    title: 'Crypto Buy & Sell',
    description: 'Expert guidance on buying and selling cryptocurrencies with market insights and strategic timing to maximise your investment potential.',
    features: ['Real-time market analysis', 'Best exchange selection', 'Secure transaction support', 'Portfolio rebalancing'],
  },
  {
    icon: FileSearch,
    title: 'Crypto Details',
    description: 'In-depth research and detailed analysis of cryptocurrencies, blockchain projects, and market trends to inform your investment decisions.',
    features: ['Project fundamentals research', 'Tokenomics breakdown', 'Team & roadmap analysis', 'Risk assessment reports'],
  },
  {
    icon: Handshake,
    title: 'Investment Consultation',
    description: 'Personalised one-on-one consultation to develop a tailored crypto investment strategy aligned with your financial goals.',
    features: ['Goal-based strategy planning', 'Risk profile assessment', 'Portfolio diversification', 'Ongoing strategy reviews'],
  },
  {
    icon: Monitor,
    title: 'Crypto Presentations',
    description: 'Comprehensive presentations and workshops covering blockchain technology, market analysis, and investment opportunities.',
    features: ['Custom presentation decks', 'Educational workshops', 'Market trend briefings', 'Q&A sessions'],
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

const ServicesCards = () => {
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
            What I Offer
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Comprehensive Crypto{' '}
            <span className="text-gradient">Advisory Services</span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-4 max-w-2xl mx-auto leading-relaxed">
            From market analysis to personalised strategy, I provide end-to-end guidance to help you navigate the cryptocurrency landscape with confidence.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {services.map((service, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              whileHover={{ scale: 1.03, y: -4 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="group relative bg-[#0A0A0A] rounded-2xl border border-white/[0.04] p-6 sm:p-7 flex flex-col hover:border-green-500/20 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.05)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex flex-col flex-1">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/15 flex items-center justify-center mb-4 group-hover:bg-green-500/15 group-hover:border-green-500/30 group-hover:scale-110 transition-all duration-300">
                  <service.icon size={22} className="text-green-400" />
                </div>

                <h3 className="text-white font-bold text-base sm:text-lg mb-2 group-hover:text-green-400 transition-colors duration-300">
                  {service.title}
                </h3>

                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                <div className="space-y-2 mb-6 flex-1">
                  {service.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-green-400 mt-0.5 shrink-0" />
                      <span className="text-zinc-500 text-xs leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to="/consultation"
                  className="inline-flex items-center gap-1.5 text-green-400 text-xs font-medium group/link mt-auto pt-4 border-t border-white/[0.04]"
                >
                  Learn More
                  <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesCards;
