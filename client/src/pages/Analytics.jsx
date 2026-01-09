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
import { PLATFORMS } from '../utils/constants';
import { calculateConsistencyScore } from '../utils/formatters';

const Analytics = () => {
  const { platforms, submissions, isLoading } = usePlatforms();

  // Build daily stats from submissions
  const dailyStats = useMemo(() => {
    const statsMap = {};
    const today = new Date();
    
    // Initialize last 365 days
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      statsMap[dateStr] = { date: dateStr, problemsSolved: 0 };
    }
    
    // Count submissions per day
    submissions.forEach(sub => {
      const dateStr = sub.submittedAt?.split('T')[0];
      if (dateStr && statsMap[dateStr] && sub.status === 'solved') {
        statsMap[dateStr].problemsSolved++;
      }
    });
    
    return Object.values(statsMap).sort((a, b) => a.date.localeCompare(b.date));
  }, [submissions]);

  // Build topic stats from submission tags
  const topicStats = useMemo(() => {
    const topicMap = {};
    
    submissions.forEach(sub => {
      if (sub.status === 'solved' && sub.tags) {
        sub.tags.forEach(tag => {
          if (!topicMap[tag]) {
            topicMap[tag] = { topic: tag, solved: 0, total: 0 };
          }
          topicMap[tag].solved++;
          topicMap[tag].total++;
        });
      }
    });
    
    return Object.values(topicMap)
      .map(t => ({ ...t, percentage: Math.round((t.solved / t.total) * 100) }))
      .sort((a, b) => b.solved - a.solved)
      .slice(0, 20);
  }, [submissions]);

  // Calculate total problems from platforms
  const totalProblemsSolved = useMemo(() => {
    return platforms.reduce((sum, p) => sum + (p.profileData?.problemsSolved || 0), 0);
  }, [platforms]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const consistencyScore = calculateConsistencyScore(dailyStats, 4);
    const activeDays = dailyStats.filter(d => d.problemsSolved > 0).length;
    const totalDays = dailyStats.length;
    const weeklyAverage = (dailyStats.slice(-28).reduce((sum, d) => sum + d.problemsSolved, 0) / 4);
    
    // Find strongest platform
    const platformSolved = platforms.map(p => ({
      platform: p.platform,
      solved: p.profileData?.problemsSolved || 0,
      rating: p.profileData?.rating || 0,
    }));
    const strongestPlatform = platformSolved.reduce((max, p) => p.solved > max.solved ? p : max, { solved: 0 });

    // Contest vs Practice split (estimate from contest history)
    const contestProblems = platforms.reduce((sum, p) => {
      const contests = p.profileData?.contestHistory || p.profileData?.ratingHistory || [];
      return sum + contests.length * 2; // Estimate 2 problems per contest
    }, 0);
    const practiceProblems = Math.max(0, totalProblemsSolved - contestProblems);

    return {
      consistencyScore,
      activeDays,
      totalDays,
      weeklyAverage,
      strongestPlatform,
      contestProblems,
      practiceProblems,
      totalProblemsSolved,
    };
  }, [platforms, dailyStats, totalProblemsSolved]);

  // Heatmap data format
  const heatmapData = dailyStats.map(d => ({
    date: d.date,
    problemsSolved: d.problemsSolved,
  }));

  if (isLoading) {
    return (
      <PageContainer title="Analytics" description="Loading your analytics...">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
        </div>
      </PageContainer>
    );
  }

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
          topics={topicStats.length > 0 ? topicStats : [{ topic: 'No data yet', solved: 0, total: 0, percentage: 0 }]}
          title="Topics Needing Improvement"
          limit={5}
        />
      </div>

      {/* Topic Breakdown */}
      <TopicBreakdown
        topics={topicStats.length > 0 ? topicStats : [{ topic: 'Connect platforms to see topics', solved: 0, total: 0, percentage: 0 }]}
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
          {platforms.length === 0 ? (
            <p className="text-[#94a3b8] text-center py-8">Connect platforms to see comparison</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.filter(p => p.profileData?.problemsSolved > 0).map((platform, index) => {
                const platformInfo = PLATFORMS[platform.platform];
                const maxSolved = Math.max(...platforms.map(p => p.profileData?.problemsSolved || 0));
                const percentage = maxSolved > 0 ? (platform.profileData?.problemsSolved / maxSolved) * 100 : 0;

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
          )}
        </div>
      </motion.div>

      {/* Contest vs Practice */}
      {metrics.totalProblemsSolved > 0 && (
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
                        {metrics.contestProblems} ({((metrics.contestProblems / metrics.totalProblemsSolved) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-3 bg-[#1a1a25] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(metrics.contestProblems / metrics.totalProblemsSolved) * 100}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-[#8b5cf6] rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#94a3b8]">Practice Problems</span>
                      <span className="text-sm font-medium text-[#f8fafc]">
                        {metrics.practiceProblems} ({((metrics.practiceProblems / metrics.totalProblemsSolved) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-3 bg-[#1a1a25] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(metrics.practiceProblems / metrics.totalProblemsSolved) * 100}%` }}
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
                <span>
                  {metrics.practiceProblems > metrics.contestProblems 
                    ? 'You solve more problems in practice than contests. Consider joining more live contests!'
                    : 'Great job participating in contests! Keep up the competitive spirit.'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </PageContainer>
  );
};

export default Analytics;
