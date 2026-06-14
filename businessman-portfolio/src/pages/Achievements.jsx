import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { getAchievements } from '@/config/admin';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const API_BASE = import.meta.env.VITE_API_URL || '';

const Achievements = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAchievements()
      .then((res) => setAwards(res.data))
      .catch((err) => console.error('Failed to load achievements:', err?.message || err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Awards & Recognition */}
      <section className="relative section-padding pt-24 md:pt-28 lg:pt-32 overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-green-500/[0.02] rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <span className="text-green-400 text-xs font-semibold tracking-[0.2em] uppercase block mb-4">
              Awards & Recognition
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Celebrating{' '}
              <span className="text-gradient">Innovation & Leadership</span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mt-3">
              Recognizing achievements that inspire growth, innovation, and long-term success.
            </p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04] min-h-[320px] animate-pulse flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-xl bg-white/[0.03] mb-4" />
                  <div className="h-4 bg-white/[0.03] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/[0.03] rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : !awards || awards.length === 0 ? (
            <div className="max-w-7xl mx-auto text-center py-12 text-zinc-600 text-sm">
              No achievements available.
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              {awards.map((award) => (
                <motion.div
                  key={award._id}
                  variants={fadeInUp}
                  className="group bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04] hover:border-green-500/20 hover:shadow-[0_0_25px_-5px_rgba(34,197,94,0.1)] transition-all duration-500 flex flex-col items-center text-center min-h-[320px]"
                >
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-green-400/20 to-emerald-500/10 border border-green-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                    {award.image ? (
                      <img src={`${API_BASE}${award.image}`} alt={award.title} className="w-full h-full object-cover" />
                    ) : (
                      <Trophy size={28} className="text-green-400" />
                    )}
                  </div>
                  <h3 className="text-white text-xl font-semibold leading-snug mb-2 flex-1">
                    {award.title}
                  </h3>
                  <span className="text-green-400/70 text-lg font-mono tracking-wider">
                    {award.year}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

    </div>
  );
};

export default Achievements;
