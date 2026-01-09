import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

const WeakTopics = ({
  topics, // Array of { topic: string, solved: number, total: number, percentage: number }
  title = 'Topics Needing Improvement',
  limit = 5,
  className,
}) => {
  // Sort by percentage (ascending) to get weakest topics
  const weakTopics = [...topics]
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, limit);

  const getProgressColor = (percentage) => {
    if (percentage < 50) return 'bg-[#ef4444]';
    if (percentage < 70) return 'bg-[#f59e0b]';
    return 'bg-[#22c55e]';
  };

  const getTextColor = (percentage) => {
    if (percentage < 50) return 'text-[#ef4444]';
    if (percentage < 70) return 'text-[#f59e0b]';
    return 'text-[#22c55e]';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-[#f59e0b]" />
          <h3 className="text-lg font-semibold text-[#f8fafc]">{title}</h3>
        </div>

        <div className="space-y-4">
          {weakTopics.map((topic, index) => (
            <motion.div
              key={topic.topic}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-[#f8fafc]">{topic.topic}</span>
                <span className={clsx('text-sm font-medium', getTextColor(topic.percentage))}>
                  {topic.percentage}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-[#1a1a25] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${topic.percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={clsx('h-full rounded-full', getProgressColor(topic.percentage))}
                  />
                </div>
                <span className="text-xs text-[#64748b] w-16 text-right">
                  {topic.solved}/{topic.total}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {weakTopics.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#2a2a35]">
            <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
              <TrendingUp className="w-4 h-4" />
              <span>Focus on these topics to improve your overall performance</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WeakTopics;
