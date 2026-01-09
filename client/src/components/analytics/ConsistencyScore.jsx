import { motion } from 'framer-motion';
import { Activity, Target, Zap } from 'lucide-react';
import clsx from 'clsx';

const ConsistencyScore = ({
  score, // 0-100
  activeDays,
  totalDays,
  weeklyAverage,
  className,
}) => {
  const getScoreColor = () => {
    if (score >= 80) return 'text-[#22c55e]';
    if (score >= 60) return 'text-[#6366f1]';
    if (score >= 40) return 'text-[#f59e0b]';
    return 'text-[#ef4444]';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const getProgressColor = () => {
    if (score >= 80) return 'from-[#22c55e] to-[#16a34a]';
    if (score >= 60) return 'from-[#6366f1] to-[#8b5cf6]';
    if (score >= 40) return 'from-[#f59e0b] to-[#d97706]';
    return 'from-[#ef4444] to-[#dc2626]';
  };

  // Calculate circumference for the circular progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-[#6366f1]" />
          <h3 className="text-lg font-semibold text-[#f8fafc]">Consistency Score</h3>
        </div>

        <div className="flex items-center justify-between">
          {/* Circular Progress */}
          <div className="relative">
            <svg width="160" height="160" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#1a1a25"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: progressOffset }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={score >= 60 ? '#6366f1' : '#ef4444'} />
                  <stop offset="100%" stopColor={score >= 60 ? '#22c55e' : '#f59e0b'} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className={clsx('text-4xl font-bold', getScoreColor())}
              >
                {score}
              </motion.span>
              <span className="text-sm text-[#64748b]">{getScoreLabel()}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#6366f1]/10">
                <Target className="w-5 h-5 text-[#6366f1]" />
              </div>
              <div>
                <p className="text-xs text-[#64748b]">Active Days</p>
                <p className="text-lg font-bold text-[#f8fafc]">
                  {activeDays}/{totalDays}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#22c55e]/10">
                <Zap className="w-5 h-5 text-[#22c55e]" />
              </div>
              <div>
                <p className="text-xs text-[#64748b]">Weekly Average</p>
                <p className="text-lg font-bold text-[#f8fafc]">
                  {weeklyAverage.toFixed(1)} problems
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 pt-4 border-t border-[#2a2a35]">
          <p className="text-sm text-[#94a3b8]">
            {score >= 80
              ? '🎉 Amazing consistency! Keep up the great work!'
              : score >= 60
              ? '💪 Good progress! Try to maintain daily practice.'
              : score >= 40
              ? '📈 Room for improvement. Set daily goals to improve.'
              : '🎯 Start with small daily goals and build consistency.'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsistencyScore;
