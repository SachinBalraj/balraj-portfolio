import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const StatsCard = ({ icon: Icon, value, label }) => (
  <motion.div
    whileHover={{ scale: 1.03, y: -4 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
    className={cn(
      'group relative bg-white/[0.03] backdrop-blur-xl rounded-[20px] border border-white/[0.06] p-5 sm:p-6',
      'hover:border-green-500/20 hover:bg-green-500/[0.03] transition-all duration-500'
    )}
  >
    <div className="absolute inset-0 rounded-[20px] bg-gradient-to-br from-green-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative">
      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-3 group-hover:bg-green-500/15 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all duration-300">
        <Icon size={18} className="text-green-400" />
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-zinc-400 font-medium">
        {label}
      </div>
    </div>
  </motion.div>
);

export default StatsCard;
