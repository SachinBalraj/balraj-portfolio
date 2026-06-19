import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getTeamCategories } from '@/config/admin';
import {
  Plus,
  Minus,
} from 'lucide-react';

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

const timeline = [
  {
    stage: 'Stage 01',
    title: 'Discover Beldex',
    description: 'Learn about the Beldex ecosystem, privacy-focused blockchain technology, and its vision for decentralized communication and digital finance.',
  },
  {
    stage: 'Stage 02',
    title: 'Create Your Exchange Account',
    description: 'Register on a supported cryptocurrency exchange, complete KYC verification, and secure your account with two-factor authentication.',
  },
  {
    stage: 'Stage 03',
    title: 'Fund Your Wallet',
    description: 'Deposit INR or supported cryptocurrencies into your exchange account and prepare funds for your first digital asset investment.',
  },
  {
    stage: 'Stage 04',
    title: 'Purchase BDX',
    description: 'Buy Beldex (BDX) through a trusted exchange and transfer assets securely to your preferred wallet for long-term storage.',
  },
  {
    stage: 'Stage 05',
    title: 'Build Long-Term Holdings',
    description: 'Monitor ecosystem developments, network growth, and market opportunities while focusing on disciplined long-term investment strategies.',
  },
];

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
      {/* ===== SECTION 1: BELDEX OVERVIEW HERO ===== */}
      <section className="relative pt-8 pb-20 overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-green-500/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-green-500/3 to-transparent rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Beldex Image Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-emerald-500/10 rounded-full blur-[80px]" />
                <div className="relative w-full h-full bg-[#0A0A0A] rounded-3xl border border-white/[0.04] overflow-hidden flex items-center justify-center backdrop-blur-xl group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.03] to-transparent" />
                  <div className="relative flex flex-col items-center gap-5">
                    <motion.img
                      src="/beldex-logo.png"
                      alt="Beldex"
                      className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] object-contain"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="text-center">
                      <div className="text-white text-xl sm:text-2xl font-bold tracking-tight">Beldex</div>
                      <div className="text-green-400 text-xs sm:text-sm font-medium tracking-[0.15em] uppercase mt-1">Privacy Ecosystem</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className="space-y-6"
            >
              <div>
                <span className="text-green-400 text-xs font-semibold tracking-[0.2em] uppercase block mb-4">
                  About Beldex
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                  Building the Future of{' '}
                  <span className="text-gradient">Privacy-Focused</span> Digital Assets
                </h1>
              </div>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Beldex has demonstrated consistent growth through its focus on building a secure,
                privacy-oriented blockchain ecosystem. By expanding its technology infrastructure,
                enhancing network capabilities, and developing real-world applications, the project
                continues to strengthen its position within the digital asset industry. The
                ecosystem's commitment to innovation and long-term sustainability has attracted
                a growing community of users, developers, and blockchain enthusiasts who believe
                in the future of decentralized technologies.
              </p>

              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                As the blockchain sector evolves, Beldex continues to pursue development through
                strategic ecosystem expansion, improved utility, and technological advancement.
                Its emphasis on privacy, security, and user empowerment creates a strong foundation
                for future opportunities. With ongoing upgrades, increasing awareness, and broader
                adoption of blockchain solutions worldwide, Beldex remains focused on delivering
                value while contributing to the next generation of digital finance and decentralized
                innovation.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                {['Privacy', 'Security', 'Innovation', 'Decentralization'].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-green-500/10 text-green-400 border border-green-500/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>



      {/* ===== SECTION 2: PROFESSIONAL JOURNEY TIMELINE ===== */}
      <section className="relative section-padding overflow-hidden bg-black">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-green-500/[0.02] rounded-full blur-[120px]" />
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
              Growth & Development Journey
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Key milestones in the evolution of expertise{' '}
              <span className="text-gradient">and ecosystem involvement.</span>
            </h2>
          </motion.div>

          <div className="relative max-w-3xl mx-auto">
            {/* Glowing vertical line */}
            <div className="absolute left-[23px] top-0 bottom-0 w-px">
              <div className="w-full h-full bg-gradient-to-b from-green-500/40 via-green-500/20 to-transparent" />
              <div className="absolute inset-0 w-full h-full bg-green-500/20 blur-[4px]" />
            </div>

            <div className="space-y-6 sm:space-y-6">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.stage}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative pl-14 sm:pl-16"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-[14px] top-1.5">
                    <div className="w-[19px] h-[19px] rounded-full bg-black border-2 border-green-500/60 flex items-center justify-center">
                      <div className="w-[7px] h-[7px] rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="bg-[#0A0A0A] rounded-2xl p-5 sm:p-6 border border-white/[0.04] hover:border-green-500/15 transition-all duration-500">
                    <span className="text-green-400 font-bold text-xs sm:text-sm tracking-wider mb-2 block">
                      {item.stage}
                    </span>
                    <h3 className="text-white font-bold text-base sm:text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: TEAM STRUCTURE ===== */}
      <section className="relative section-padding overflow-hidden bg-black">
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


    </div>
  );
};

export default About;
