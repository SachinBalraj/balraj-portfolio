import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const ExpertiseBadge = () => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className={cn(
      'w-full bg-white/[0.03] backdrop-blur-xl rounded-[20px] border border-green-500/15 p-4 sm:p-5',
      'flex items-center gap-3 group cursor-default transition-all duration-300',
      'hover:border-green-500/30 hover:bg-green-500/[0.04]'
    )}
  >
    <div className="relative shrink-0">
      <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
      <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-30" />
    </div>
    <span className="text-green-400 font-semibold text-sm tracking-wide">
      Beldex Ecosystem Expert
    </span>
  </motion.div>
);

export default ExpertiseBadge;
