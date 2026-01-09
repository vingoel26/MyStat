import { motion } from 'framer-motion';
import { Flame, Calendar, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

const StreakTracker = ({
  currentStreak,
  longestStreak,
  lastActiveDate,
  className,
}) => {
  const isActiveToday = () => {
    if (!lastActiveDate) return false;
    const today = new Date().toDateString();
    const lastActive = new Date(lastActiveDate).toDateString();
    return today === lastActive;
  };

  const getStreakColor = () => {
    if (currentStreak >= 30) return 'from-[#f59e0b] to-[#ef4444]';
    if (currentStreak >= 14) return 'from-[#6366f1] to-[#8b5cf6]';
    if (currentStreak >= 7) return 'from-[#22c55e] to-[#16a34a]';
    return 'from-[#64748b] to-[#475569]';
  };

  const getFlameSize = () => {
    if (currentStreak >= 30) return 'w-16 h-16';
    if (currentStreak >= 14) return 'w-14 h-14';
    if (currentStreak >= 7) return 'w-12 h-12';
    return 'w-10 h-10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'relative overflow-hidden rounded-xl bg-[#12121a] border border-[#2a2a35] p-5',
        className
      )}
    >
      {/* Background glow */}
      {currentStreak > 0 && (
        <div className={clsx(
          'absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20',
          currentStreak >= 7 ? 'bg-[#f59e0b]' : 'bg-[#6366f1]'
        )} />
      )}

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#f8fafc]">Daily Streak</h3>
          {isActiveToday() && (
            <span className="px-2 py-1 text-xs font-medium text-[#22c55e] bg-[#22c55e]/10 rounded-full border border-[#22c55e]/30">
              Active Today ✓
            </span>
          )}
        </div>

        <div className="flex items-center gap-6">
          {/* Flame Icon */}
          <div className="relative">
            <motion.div
              animate={{
                scale: currentStreak > 0 ? [1, 1.1, 1] : 1,
              }}
              transition={{
                duration: 1.5,
                repeat: currentStreak > 0 ? Infinity : 0,
                ease: 'easeInOut',
              }}
              className={clsx(
                'flex items-center justify-center rounded-2xl bg-gradient-to-br',
                getStreakColor(),
                getFlameSize()
              )}
            >
              <Flame className="w-8 h-8 text-white" />
            </motion.div>
            {currentStreak >= 7 && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#ef4444] blur-xl opacity-30"
              />
            )}
          </div>

          {/* Streak Count */}
          <div>
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="flex items-baseline gap-2"
            >
              <span className="text-5xl font-bold text-[#f8fafc]">{currentStreak}</span>
              <span className="text-lg text-[#94a3b8]">days</span>
            </motion.div>
            <p className="text-sm text-[#64748b] mt-1">
              {currentStreak === 0
                ? 'Start your streak today!'
                : currentStreak === 1
                ? 'Great start! Keep going!'
                : currentStreak < 7
                ? 'Building momentum!'
                : currentStreak < 30
                ? 'Amazing consistency!'
                : 'Legendary streak! 🔥'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-[#2a2a35]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#8b5cf6]/10">
              <TrendingUp className="w-5 h-5 text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Longest Streak</p>
              <p className="text-lg font-bold text-[#f8fafc]">{longestStreak} days</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#22c55e]/10">
              <Calendar className="w-5 h-5 text-[#22c55e]" />
            </div>
            <div>
              <p className="text-xs text-[#64748b]">Last Active</p>
              <p className="text-lg font-bold text-[#f8fafc]">
                {isActiveToday() ? 'Today' : 'Yesterday'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StreakTracker;
