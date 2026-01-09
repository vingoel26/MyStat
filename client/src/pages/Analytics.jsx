import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Award,
  Target,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { PageContainer } from '../components/layout';
import { StatsCard } from '../components/dashboard';
import {
  Heatmap,
  WeakTopics,
  TopicBreakdown,
  ConsistencyScore,
} from '../components/analytics';
import { usePlatforms } from '../context/PlatformContext';
import {
  mockDailyStats,
  mockTopicStats,
  mockSummaryStats,
  mockPlatformStats,
} from '../data/mockData';
import { PLATFORMS } from '../utils/constants';
import { calculateConsistencyScore, calculateStreak } from '../utils/formatters';

const Analytics = () => {
  const { platforms, dailyStats } = usePlatforms();

  // Calculate metrics
  const metrics = useMemo(() => {
    const consistencyScore = calculateConsistencyScore(mockDailyStats, 4);
    const activeDays = mockDailyStats.filter(d => d.problemsSolved > 0).length;
    const totalDays = mockDailyStats.length;
    const weeklyAverage = (mockDailyStats.slice(-28).reduce((sum, d) => sum + d.problemsSolved, 0) / 4);
    
    // Find strongest platform
    const platformSolved = platforms.map(p => ({
      platform: p.platform,
      solved: p.profileData?.problemsSolved || 0,
      rating: p.profileData?.rating || 0,
    }));
    const strongestPlatform = platformSolved.reduce((max, p) => p.solved > max.solved ? p : max, { solved: 0 });

    // Contest vs Practice split (mock)
    const contestProblems = 234;
    const practiceProblems = mockSummaryStats.totalProblemsSolved - contestProblems;

    return {
      consistencyScore,
      activeDays,
      totalDays,
      weeklyAverage,
      strongestPlatform,
      contestProblems,
      practiceProblems,
    };
  }, [platforms]);

  // Heatmap data format
  const heatmapData = mockDailyStats.map(d => ({
    date: d.date,
    problemsSolved: d.problemsSolved,
  }));

  return (
    <PageContainer
      title="Analytics"
      description="Deep insights into your coding journey and areas for improvement."
    >
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Consistency Score"
          value={`${metrics.consistencyScore}%`}
          icon={Target}
          variant={metrics.consistencyScore >= 70 ? 'success' : metrics.consistencyScore >= 40 ? 'warning' : 'danger'}
          delay={0}
        />
        <StatsCard
          title="Active Days (Year)"
          value={metrics.activeDays}
          suffix={`/ ${metrics.totalDays}`}
          icon={Calendar}
          variant="primary"
          delay={0.1}
        />
        <StatsCard
          title="Strongest Platform"
          value={PLATFORMS[metrics.strongestPlatform.platform]?.name || 'None'}
          icon={Award}
          variant="success"
          delay={0.2}
        />
        <StatsCard
          title="Weekly Average"
          value={metrics.weeklyAverage.toFixed(1)}
          suffix="problems"
          icon={BarChart3}
          variant="default"
          delay={0.3}
        />
      </div>

      {/* Heatmap */}
      <Heatmap
        data={heatmapData}
        title="Submission Activity (Past Year)"
        className="mb-8"
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Consistency Score */}
        <ConsistencyScore
          score={metrics.consistencyScore}
          activeDays={metrics.activeDays}
          totalDays={metrics.totalDays}
          weeklyAverage={metrics.weeklyAverage}
        />

        {/* Weak Topics */}
        <WeakTopics
          topics={mockTopicStats}
          title="Topics Needing Improvement"
          limit={5}
        />
      </div>

      {/* Topic Breakdown */}
      <TopicBreakdown
        topics={mockTopicStats}
        title="Topic Performance Overview"
        className="mb-8"
      />

      {/* Platform Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-[#f8fafc] mb-4">Platform Comparison</h2>
        <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.filter(p => p.profileData?.problemsSolved > 0).map((platform, index) => {
              const platformInfo = PLATFORMS[platform.platform];
              const maxSolved = Math.max(...platforms.map(p => p.profileData?.problemsSolved || 0));
              const percentage = (platform.profileData?.problemsSolved / maxSolved) * 100;

              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-[#1a1a25] rounded-xl"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-[#f8fafc]">{platformInfo?.name}</span>
                    <span className="text-sm text-[#94a3b8]">
                      {platform.profileData?.problemsSolved} solved
                    </span>
                  </div>
                  <div className="h-2 bg-[#2a2a35] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: platformInfo?.color || '#6366f1' }}
                    />
                  </div>
                  {platform.profileData?.rating && (
                    <p className="text-xs text-[#64748b] mt-2">
                      Rating: {platform.profileData.rating}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Contest vs Practice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold text-[#f8fafc] mb-4">Contest vs Practice</h2>
        <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-5">
          <div className="flex items-center gap-8">
            {/* Bar Chart */}
            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#94a3b8]">Contest Problems</span>
                    <span className="text-sm font-medium text-[#f8fafc]">
                      {metrics.contestProblems} ({((metrics.contestProblems / mockSummaryStats.totalProblemsSolved) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-[#1a1a25] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(metrics.contestProblems / mockSummaryStats.totalProblemsSolved) * 100}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-[#8b5cf6] rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#94a3b8]">Practice Problems</span>
                    <span className="text-sm font-medium text-[#f8fafc]">
                      {metrics.practiceProblems} ({((metrics.practiceProblems / mockSummaryStats.totalProblemsSolved) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 bg-[#1a1a25] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(metrics.practiceProblems / mockSummaryStats.totalProblemsSolved) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full bg-[#22c55e] rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="hidden sm:block">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
                  <span className="text-sm text-[#94a3b8]">Contest</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#22c55e]" />
                  <span className="text-sm text-[#94a3b8]">Practice</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#2a2a35]">
            <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
              <TrendingUp className="w-4 h-4 text-[#22c55e]" />
              <span>You solve more problems in practice than contests. Consider joining more live contests!</span>
            </div>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
};

export default Analytics;
