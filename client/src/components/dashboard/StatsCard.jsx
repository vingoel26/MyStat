import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import clsx from 'clsx';
import { formatNumber } from '../../utils/formatters';

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  suffix,
  variant = 'default',
  className,
  delay = 0,
}) => {
  const variants = {
    default: 'from-[#12121a] to-[#1a1a25]',
    primary: 'from-[#6366f1]/10 to-[#8b5cf6]/10 border-[#6366f1]/30',
    success: 'from-[#22c55e]/10 to-[#16a34a]/10 border-[#22c55e]/30',
    warning: 'from-[#f59e0b]/10 to-[#d97706]/10 border-[#f59e0b]/30',
    danger: 'from-[#ef4444]/10 to-[#dc2626]/10 border-[#ef4444]/30',
  };

  const iconColors = {
    default: 'text-[#6366f1] bg-[#6366f1]/10',
    primary: 'text-[#6366f1] bg-[#6366f1]/20',
    success: 'text-[#22c55e] bg-[#22c55e]/20',
    warning: 'text-[#f59e0b] bg-[#f59e0b]/20',
    danger: 'text-[#ef4444] bg-[#ef4444]/20',
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-[#22c55e]';
    if (trend === 'down') return 'text-[#ef4444]';
    return 'text-[#64748b]';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4 }}
      className={clsx(
        'relative overflow-hidden rounded-xl border border-[#2a2a35] bg-gradient-to-br p-5',
        'hover:border-[#6366f1]/50 hover:shadow-lg hover:shadow-[#6366f1]/5 transition-all duration-300',
        variants[variant],
        className
      )}
    >
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[#6366f1]/5 to-transparent rounded-full blur-2xl" />
      
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#94a3b8]">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
              className="text-3xl font-bold text-[#f8fafc]"
            >
              {typeof value === 'number' ? formatNumber(value) : value}
            </motion.span>
            {suffix && (
              <span className="text-sm text-[#64748b]">{suffix}</span>
            )}
          </div>
          {(trend || trendValue) && (
            <div className={clsx('flex items-center gap-1 mt-2', getTrendColor())}>
              {getTrendIcon()}
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={clsx(
            'flex items-center justify-center w-12 h-12 rounded-xl',
            iconColors[variant]
          )}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;
