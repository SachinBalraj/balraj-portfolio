import { motion } from 'framer-motion';
import { Clock, Users, Star, ShieldCheck, ArrowRight } from 'lucide-react';
import StatsCard from '@/components/StatsCard';
import ExpertiseBadge from '@/components/ExpertiseBadge';

const stats = [
  { icon: Clock, value: '6+', label: 'Years Experience' },
  { icon: Users, value: '1500+', label: 'Consultations' },
  { icon: Star, value: '95%', label: 'Client Satisfaction' },
  { icon: ShieldCheck, value: '98%', label: 'Client Confidence' },
];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AboutHero = () => {
  const scrollToNext = () => {
    const el = document.getElementById('about-content');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-24 sm:pt-28 pb-20 overflow-hidden bg-black">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-green-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-green-500/3 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-6"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-green-400 text-xs font-semibold tracking-[0.2em] uppercase block"
            >
              ABOUT BALRAJ
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight"
            >
              Crypto Investment{' '}
              <span className="text-gradient">Advisor</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl"
            >
              I help investors confidently navigate the cryptocurrency market
              through strategic investment guidance, blockchain expertise, and
              long-term wealth-building strategies. My focus is on helping
              clients make informed decisions while minimizing risk.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="space-y-4"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={fadeInUp}>
                  <StatsCard icon={stat.icon} value={stat.value} label={stat.label} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <ExpertiseBadge />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 sm:mt-20"
        >
          <div className="w-full h-px bg-gradient-to-r from-green-500/20 via-green-500/10 to-transparent mb-8" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-2xl">
              Helping investors through the world of cryptocurrency with
              strategic insights, blockchain expertise, and proven investment
              approaches designed for sustainable growth and long-term financial
              success.
            </p>

            <button
              onClick={scrollToNext}
              className="group shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
            >
              Learn More About Me
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutHero;
