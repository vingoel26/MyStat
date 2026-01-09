import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Trophy,
  Flame,
  TrendingUp,
  Calendar,
  Clock,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { PageContainer } from '../components/layout';
import Button from '../components/common/Button';
import {
  StatsCard,
  PlatformCard,
  RatingGraph,
  StreakTracker,
  DifficultyChart,
  ActivityGraph,
} from '../components/dashboard';
import { useAuth } from '../context/AuthContext';
import { usePlatforms } from '../context/PlatformContext';
import { formatRelativeTime } from '../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const { 
    platforms, 
    ratingHistory, 
    syncAllPlatforms, 
    isSyncingAll, 
    isPlatformSyncing, 
    syncPlatform,
    getAggregatedStats,
    isLoading,
  } = usePlatforms();

  // Compute live stats from connected platforms
  const liveStats = useMemo(() => {
    const stats = getAggregatedStats();
    
    // Calculate difficulty distribution from platform data
    let easy = 0, medium = 0, hard = 0;
    platforms.forEach(p => {
      if (p.profileData) {
        easy += p.profileData.easy || 0;
        medium += p.profileData.medium || 0;
        hard += p.profileData.hard || 0;
      }
    });
    
    // Extract recent contests from platform data
    const contests = [];
    platforms.forEach(p => {
      const history = p.profileData?.contestHistory || p.profileData?.ratingHistory || [];
      history.slice(-5).forEach(c => {
        contests.push({
          id: `${p.platform}_${c.contestId || c.contestName || Math.random()}`,
          platform: p.platform,
          contestName: c.contestName || c.ContestName || 'Contest',
          rank: c.rank || c.place || c.ranking || '-',
          ratingChange: c.ratingChange || (c.newRating - c.oldRating) || 0,
          newRating: c.newRating || c.rating || 0,
          participatedAt: c.ratingUpdateTimeSeconds 
            ? new Date(c.ratingUpdateTimeSeconds * 1000).toISOString()
            : c.endTime || c.startTime || new Date().toISOString(),
        });
      });
    });
    
    // Sort contests by date (most recent first)
    contests.sort((a, b) => new Date(b.participatedAt) - new Date(a.participatedAt));
    
    return {
      ...stats,
      difficultyDistribution: { easy, medium, hard },
      recentContests: contests.slice(0, 5),
    };
  }, [platforms, getAggregatedStats]);

  // Build problems trend from platform data
  const problemsTrend = useMemo(() => {
    // Generate last 6 months placeholder
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        count: Math.floor(Math.random() * 50) + 20, // Placeholder - would need submission history
      });
    }
    return months;
  }, []);

  // Get current time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Show empty state if no platforms connected
  const hasNoPlatforms = platforms.length === 0;

  return (
    <PageContainer
      title={`${getGreeting()}, ${user?.name?.split(' ')[0] || 'Developer'}!`}
      description={hasNoPlatforms 
        ? "Connect your coding platforms to see your progress."
        : "Here's an overview of your coding progress across all platforms."
      }
      actions={
        <Button
          variant="secondary"
          leftIcon={<RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />}
          onClick={syncAllPlatforms}
          isLoading={isSyncingAll}
          disabled={hasNoPlatforms}
        >
          Sync All
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : hasNoPlatforms ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-[#6366f1]" />
          </div>
          <h2 className="text-2xl font-bold text-[#f8fafc] mb-3">
            Welcome to DevStats!
          </h2>
          <p className="text-[#94a3b8] mb-8 max-w-md mx-auto">
            Connect your competitive programming platforms to start tracking your progress, 
            see your rating history, and get insights on your performance.
          </p>
          <a href="/platforms">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Add Your First Platform
            </Button>
          </a>
          
          {/* Supported Platforms Preview */}
          <div className="mt-12 pt-8 border-t border-[#2a2a35]">
            <p className="text-sm text-[#64748b] mb-4">Supported Platforms</p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              {['Codeforces', 'LeetCode', 'CodeChef', 'AtCoder', 'GitHub', 'Stack Overflow'].map(name => (
                <span key={name} className="px-3 py-1.5 bg-[#1a1a25] rounded-full text-sm text-[#94a3b8]">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Problems Solved"
              value={liveStats.totalSolved}
              icon={Target}
              variant="primary"
              delay={0}
            />
            <StatsCard
              title="Highest Rating"
              value={liveStats.highestRating}
              suffix={liveStats.highestRatingPlatform ? `on ${liveStats.highestRatingPlatform}` : ''}
              icon={Flame}
              variant="warning"
              delay={0.1}
            />
            <StatsCard
              title="Contests Participated"
              value={liveStats.totalContests}
              icon={Trophy}
              variant="success"
              delay={0.2}
            />
            <StatsCard
              title="Connected Platforms"
              value={liveStats.connectedPlatforms}
              icon={TrendingUp}
              variant="default"
              delay={0.3}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Rating Graph */}
              <RatingGraph
                ratingHistory={ratingHistory}
                platforms={platforms.filter(p => p.profileData?.rating).map(p => p.platform)}
                title="Rating Progression"
              />

              {/* Problems Trend */}
              <ActivityGraph
                data={problemsTrend}
                title="Problems Solved Over Time"
              />
            </div>

            {/* Right Column - Stats */}
            <div className="space-y-6">
              <StreakTracker
                currentStreak={0}
                longestStreak={0}
                lastActiveDate={new Date().toISOString()}
              />

              <DifficultyChart
                data={liveStats.difficultyDistribution}
                title="Difficulty Distribution"
              />
            </div>
          </div>

          {/* Platform Cards */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#f8fafc]">Connected Platforms</h2>
              <a href="/platforms" className="text-sm text-[#6366f1] hover:text-[#818cf8] transition-colors">
                Manage all →
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.slice(0, 6).map((platform, index) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform.platform}
                  username={platform.platformUsername}
                  profileData={platform.profileData}
                  isVerified={platform.isVerified}
                  lastSyncedAt={platform.lastSyncedAt}
                  isSyncing={isPlatformSyncing(platform.id)}
                  onSync={() => syncPlatform(platform.id)}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </div>

          {/* Recent Contests */}
          {liveStats.recentContests.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#f8fafc]">Recent Contests</h2>
                <a href="/analytics" className="text-sm text-[#6366f1] hover:text-[#818cf8] transition-colors">
                  View analytics →
                </a>
              </div>
              <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2a2a35]">
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#64748b] uppercase tracking-wider">
                        Contest
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#64748b] uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#64748b] uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#64748b] uppercase tracking-wider">
                        Rating Change
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#64748b] uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2a35]">
                    {liveStats.recentContests.map((contest) => (
                      <tr key={contest.id} className="hover:bg-[#1a1a25] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-[#f8fafc]">{contest.contestName}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-[#94a3b8] capitalize">{contest.platform}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-[#f8fafc]">#{contest.rank}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-medium ${contest.ratingChange >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                            {contest.ratingChange >= 0 ? '+' : ''}{contest.ratingChange}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-[#64748b]">
                            <Calendar className="w-4 h-4" />
                            {formatRelativeTime(contest.participatedAt)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default Dashboard;
