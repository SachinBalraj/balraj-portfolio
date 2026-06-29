import { Download, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const API_BASE = import.meta.env.VITE_API_URL || '';

const InvestmentPlanCard = ({ plan, index }) => {
  const initial = plan.name.charAt(0).toUpperCase();

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const fileUrl = plan.fileUrl ? `${API_BASE}${plan.fileUrl}` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="group rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-green-500/[0.04] hover:border-green-500/20 transition-all duration-500 p-5 hover:-translate-y-0.5 flex flex-col"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400/20 to-emerald-500/10 border border-green-500/20 flex items-center justify-center">
          <span className="text-green-400 font-bold text-base">{initial}</span>
        </div>
        <div>
          <h4 className="text-white font-semibold text-sm">{plan.name}</h4>
          {plan.fileName && (
            <span className="text-zinc-500 text-[10px]">{plan.fileName} {plan.fileSize ? `(${formatSize(plan.fileSize)})` : ''}</span>
          )}
        </div>
      </div>

      <p className="text-muted-foreground text-xs leading-relaxed mb-3">
        {plan.description || plan.bestFor}
      </p>

      {plan.features && plan.features.length > 0 && (
        <div className="space-y-1.5 mb-4 flex-1">
          {plan.features.map((feature, j) => (
            <div key={j} className="flex items-start gap-2">
              <CheckCircle2 size={12} className="text-green-400 mt-0.5 shrink-0" />
              <span className="text-zinc-400 text-[11px] leading-relaxed">{feature}</span>
            </div>
          ))}
        </div>
      )}

      {fileUrl ? (
        <a
          href={fileUrl}
          download={plan.fileName}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 text-xs w-fit"
        >
          <Download size={12} />
          {plan.button || 'View Plan'}
        </a>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/[0.03] text-zinc-500 rounded-xl border border-white/[0.04] text-xs w-fit cursor-default">
          {plan.button || 'View Plan'}
        </span>
      )}
    </motion.div>
  );
};

export default InvestmentPlanCard;
