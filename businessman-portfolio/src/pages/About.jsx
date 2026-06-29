import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeamCategories } from '@/config/admin';
import {
  Plus,
  Minus,
} from 'lucide-react';
import ContactInfo from '@/components/ContactInfo';

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

const AccordionItem = ({ name, members, description, isOpen, onToggle }) => (
  <motion.div
    layout
    className={`rounded-2xl border transition-all duration-500 ${
      isOpen
        ? 'border-green-500/30 bg-[#0C0C0C]'
        : 'border-white/[0.04] bg-[#0A0A0A] hover:border-white/[0.08]'
    }`}
  >
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
    >
      <div className="flex-1 min-w-0">
        <h3 className={`text-base sm:text-lg font-bold transition-colors duration-300 ${
          isOpen ? 'text-green-400' : 'text-white'
        }`}>
          {name}
        </h3>
      </div>
      <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
        isOpen
          ? 'bg-green-500/20 text-green-400'
          : 'bg-white/[0.04] text-zinc-500'
      }`}>
        {isOpen ? <Minus size={16} /> : <Plus size={16} />}
      </div>
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0">
            <div className="w-full h-px bg-gradient-to-r from-green-500/20 via-green-500/10 to-transparent mb-4" />
            {members && members.length > 0 ? (
              <div className="space-y-2">
                {members.map((member, i) => (
                  <motion.div
                    key={member._id || i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2 }}
                    className="flex items-center gap-2.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400/60 shrink-0" />
                    <span className="text-zinc-300 text-sm">{member.name}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const About = () => {
  const [openTeamIndex, setOpenTeamIndex] = useState(null);
  const [teamCategories, setTeamCategories] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    getTeamCategories()
      .then((res) => setTeamCategories(res.data))
      .catch((err) => console.error('Failed to load team categories:', err?.message || err))
      .finally(() => setTeamLoading(false));
  }, []);

  return (
    <div>
      {/* ===== TEAM STRUCTURE ===== */}
      <section id="about-content" className="relative section-padding overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-transparent via-green-500/[0.02] to-green-500/[0.02] rounded-full blur-[150px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <span className="text-green-400 text-3xl sm:text-[42px] lg:text-5xl font-extrabold tracking-[0.15em] uppercase block mb-3 leading-none">
              Meet The Team
            </span>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-medium text-white max-w-3xl mx-auto leading-relaxed">
              A dedicated team driving innovation, strategy,{' '}
              <span className="text-gradient">and ecosystem growth.</span>
            </h2>
          </motion.div>

          {teamLoading ? (
            <div className="max-w-3xl mx-auto space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse bg-[#0A0A0A] rounded-2xl h-16 border border-white/[0.04]" />
              ))}
            </div>
          ) : !teamCategories || teamCategories.length === 0 ? (
            <div className="max-w-3xl mx-auto text-center py-8 text-zinc-600 text-sm">
              No team data available
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="max-w-3xl mx-auto space-y-3"
            >
              {teamCategories.map((cat, i) => (
                <motion.div key={cat._id} variants={fadeInUp}>
                  <AccordionItem
                    name={cat.categoryName}
                    members={cat.members}
                    description={cat.description}
                    isOpen={openTeamIndex === i}
                    onToggle={() => setOpenTeamIndex(openTeamIndex === i ? null : i)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <ContactInfo />

    </div>
  );
};

export default About;
