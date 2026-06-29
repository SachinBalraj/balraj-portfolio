import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Play,
  Shield,
  TrendingUp,
  ChevronRight,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import CryptoCircuitBackground from '@/components/CryptoCircuitBackground';
import { getHomepageStats } from '@/config/admin';
import { getFounder } from '@/config/api';

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const SectionBadge = ({ children }) => (
  <motion.span variants={fadeInUp} className="inline-block text-green-400 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase mb-4">
    {children}
  </motion.span>
);

const SectionHeading = ({ children }) => (
  <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
    {children}
  </motion.h2>
);



const Home = () => {
  const [stats, setStats] = useState(null);
  const [founder, setFounder] = useState(null);
  const [founderLoading, setFounderLoading] = useState(true);
  const [heroImgError, setHeroImgError] = useState(false);

  useEffect(() => {
    getHomepageStats()
      .then((res) => setStats(res.data))
      .catch(() => console.error('Failed to load homepage stats'));
    getFounder()
      .then((res) => {
        setFounder(res.data);
        setHeroImgError(false);
      })
      .catch(() => console.error('Failed to load founder'))
      .finally(() => setFounderLoading(false));
  }, []);

  return (
    <div>
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-green-500/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-green-500/3 to-transparent rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-20">
            {/* Mobile: Founder Photo at top */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="lg:hidden flex justify-center"
            >
              <div className="relative w-[220px] h-[220px] sm:w-[260px] sm:h-[260px]">
                <div className="absolute inset-0 rounded-full bg-green-500/20 blur-[40px] sm:blur-[60px]" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-400/20 to-emerald-500/10 border-[3px] border-green-500/30 overflow-hidden shadow-[0_0_25px_-3px_rgba(34,197,94,0.3)] sm:shadow-[0_0_40px_-5px_rgba(34,197,94,0.3)]">
                  {founderLoading ? (
                    <div className="w-full h-full bg-white/[0.03] animate-pulse" />
                  ) : founder?.profilePhoto && !heroImgError ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL || ''}${founder.profilePhoto}`}
                      alt={`${founder?.name || 'Balraj'} - Founder & CEO`}
                      className="w-full h-full object-cover"
                      onError={() => setHeroImgError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/[0.03]">
                      <User size={48} className="text-zinc-600" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6 sm:mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-green-400 text-sm font-medium">Available for Consulting</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-2xl sm:text-3xl lg:text-5xl font-bold leading-tight mb-6"
              >
                <span className="text-white">I'm </span>
                <span className="text-gradient">{founder?.name || 'Balraj'}</span>
                <br />
                {(founder?.title
                  ? founder.title.split(' ')
                  : ['Crypto', 'Investment', 'Advisor']
                ).map((word, i, arr) => (
                  <React.Fragment key={i}>
                    <span className="text-white/90">{word}</span>
                    {i < arr.length - 1 && ' '}
                    {i === Math.floor(arr.length / 2) - 1 && <br />}
                  </React.Fragment>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
              >
                {founder?.shortDescription || 'Guiding investors through the world of cryptocurrency with strategic insights, blockchain expertise, and proven investment approaches designed for sustainable growth and long-term financial success.'}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full"
              >
                <Link to="/consultation" className="w-full sm:w-auto">
                  <Button size="lg" className="gap-2 w-full sm:w-auto">
                    Let's Work Together
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/services" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                    <Play size={18} />
                    Explore Services
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-[4/5]">
                <motion.div
                  className="absolute -top-2 right-0 z-20 glass rounded-xl p-3 pr-4 shadow-xl border border-green-500/20"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                      <TrendingUp size={20} className="text-green-400" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-bold">95%</div>
                      <div className="text-muted-foreground text-[10px]">Client Satisfaction</div>
                    </div>
                  </div>
                </motion.div>

                <div className="relative mt-6">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[100px] z-0" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-emerald-400/15 rounded-full blur-[80px] z-0" />

                  <CryptoCircuitBackground />

                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full bg-green-400/60 z-10"
                      style={{
                        top: `${15 + Math.random() * 70}%`,
                        left: `${10 + Math.random() * 80}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}

                  <motion.div
                    className="relative flex items-center justify-center z-10"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {founderLoading ? (
                      <div className="w-72 h-72 rounded-full bg-white/[0.03] animate-pulse" />
                    ) : founder?.profilePhoto && !heroImgError ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL || ''}${founder.profilePhoto}`}
                        alt={`${founder?.name || 'Balraj'} - Founder & CEO`}
                        className="w-full h-auto object-contain scale-[0.82] translate-y-4 drop-shadow-2xl"
                        onError={() => setHeroImgError(true)}
                      />
                    ) : (
                      <div className="w-48 h-48 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                        <User size={64} className="text-zinc-600" />
                      </div>
                    )}
                  </motion.div>
                </div>

                <div className="absolute -bottom-4 left-0 right-0 flex items-end justify-between gap-4 z-20">
                  <motion.div
                    className="glass rounded-xl p-3 shadow-xl border border-green-500/20"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                        <Shield size={20} className="text-green-400" />
                      </div>
                      <div>
                        <div className="text-white text-sm font-bold">100+</div>
                        <div className="text-muted-foreground text-[10px]">Clients Protected</div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="glass rounded-xl p-3 pr-4 shadow-xl border border-green-500/20"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">98%</span>
                      </div>
                      <div>
                        <div className="text-white text-sm font-semibold">Success Rate</div>
                        <div className="text-muted-foreground text-[10px]">Client Satisfaction</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT BALRAJ PREVIEW ===== */}
      <section className="relative section-padding overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-green-500/[0.03] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-emerald-500/[0.02] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="relative glass rounded-3xl p-8 sm:p-10 lg:p-12 border border-white/[0.03] hover:border-green-500/10 transition-all duration-500 group overflow-hidden"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/[0.02] to-transparent pointer-events-none" />
            <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-16">
              {/* LEFT: About + Headlines */}
              <motion.div
                variants={fadeInLeft}
                className="w-full lg:w-[40%] shrink-0"
              >
                <SectionBadge>About {founder?.name || 'Balraj'}</SectionBadge>
                <SectionHeading>
                  {(founder?.title
                    ? founder.title.split(' ')
                    : ['Crypto', 'Investment', 'Advisor']
                  ).map((word, i, arr) => (
                    i === arr.length - 1
                      ? <span key={i} className="text-gradient">{word}</span>
                      : <span key={i} className="text-white">{word} </span>
                  ))}
                </SectionHeading>
              </motion.div>

              {/* RIGHT: Stat cards 2x2 */}
              <motion.div
                variants={fadeInRight}
                className="flex-1 grid grid-cols-2 gap-4"
              >
                {[
                  { value: stats?.yearsExperience || '6+', label: 'Years Experience' },
                  { value: stats?.consultations || '1500+', label: 'Consultations' },
                  { value: stats?.clientSatisfaction || '95%', label: 'Client Satisfaction' },
                  { value: stats?.clientConfidence || '98%', label: 'Client Confidence' },
                  { label: 'Beldex Ecosystem Expert', full: true },
                ].map((item) => (
                  <motion.div
                    key={item.label}
                    variants={fadeInUp}
                    className={`rounded-2xl border border-white/[0.03] bg-white/[0.02] hover:bg-green-500/[0.04] hover:border-green-500/20 transition-all duration-500 ${
                      item.full
                        ? 'col-span-2 flex items-center gap-3 px-6 py-5'
                        : 'flex flex-col items-center justify-center text-center p-6'
                    }`}
                  >
                    {item.full ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                        <span className="text-green-300 text-sm sm:text-base font-semibold">{item.label}</span>
                      </>
                    ) : (
                      <>
                        <div className="text-green-400 font-bold text-2xl sm:text-3xl lg:text-4xl mb-1 glow-text">
                          {item.value}
                        </div>
                        <div className="text-muted-foreground text-xs sm:text-sm font-medium">
                          {item.label}
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* BOTTOM: Description + CTA */}
            <motion.div
              variants={fadeInUp}
              className="relative z-10 mt-10 pt-8 border-t border-white/[0.04]"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed flex-1">
                  {founder?.bio || founder?.shortDescription || 'Guiding investors through the digital asset revolution with strategic insights, risk management, blockchain expertise, and long-term wealth creation strategies designed for sustainable growth.'}
                </p>
                <Link to="/about" className="shrink-0">
                  <Button variant="outline" size="sm" className="group/btn whitespace-nowrap">
                    Learn More About Me
                    <ChevronRight size={14} className="ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default Home;
