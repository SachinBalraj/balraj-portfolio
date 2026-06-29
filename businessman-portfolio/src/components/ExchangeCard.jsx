import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const ExchangeCard = ({ name, description, url, index }) => {
  const initial = name.charAt(0).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="group rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-green-500/[0.04] hover:border-green-500/20 transition-all duration-500 p-5 hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-500/10 border border-green-500/20 flex items-center justify-center">
          <span className="text-green-400 font-bold text-sm">{initial}</span>
        </div>
        <h4 className="text-white font-semibold text-sm">{name}</h4>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed mb-4 min-h-[2.5rem]">
        {description}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 text-xs"
      >
        Visit {name}
        <ExternalLink size={12} />
      </a>
    </motion.div>
  );
};

export default ExchangeCard;
