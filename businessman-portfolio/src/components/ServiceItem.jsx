import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const ServiceItem = ({ service, isOpen, onToggle }) => {
  const { icon: Icon, title, features, button } = service;

  return (
    <div
      className={cn(
        'rounded-[20px] border transition-all duration-500',
        isOpen
          ? 'border-green-500/30 bg-[#0C0C0C] shadow-[0_0_30px_-5px_rgba(34,197,94,0.1)]'
          : 'border-white/[0.04] bg-[#0A0A0A] hover:border-white/[0.08]'
      )}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 sm:p-6 text-left gap-4"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300',
              isOpen
                ? 'bg-green-500/15 border border-green-500/25'
                : 'bg-green-500/10 border border-green-500/15'
            )}
          >
            <Icon size={20} className={isOpen ? 'text-green-400' : 'text-green-400/80'} />
          </div>
          <h3
            className={cn(
              'text-base sm:text-lg font-bold transition-colors duration-300',
              isOpen ? 'text-green-400' : 'text-white'
            )}
          >
            {title}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            'shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300',
            isOpen
              ? 'bg-green-500/20 text-green-400'
              : 'bg-white/[0.04] text-zinc-500'
          )}
        >
          <ChevronDown size={16} />
        </motion.div>
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
            <div className="px-5 sm:px-6 pb-6 sm:pb-8 pt-0">
              <div className="w-full h-px bg-gradient-to-r from-green-500/20 via-green-500/10 to-transparent mb-5" />

              <div className="grid sm:grid-cols-2 gap-2.5 mb-6">
                {features.map((feature, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: j * 0.04, duration: 0.2 }}
                    className="flex items-start gap-2.5"
                  >
                    <CheckCircle2 size={15} className="text-green-400 mt-0.5 shrink-0" />
                    <span className="text-zinc-300 text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/consultation"
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-semibold rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 text-sm"
              >
                {button}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceItem;
