import { motion } from 'framer-motion';
import {
  Target,
  Trophy,
  Flame,
  TrendingUp,
  Calendar,
  Clock,
  RefreshCw,
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
import {
  mockSummaryStats,
  mockRatingHistory,
  mockDifficultyDistribution,
  mockProblemsTrend,
  mockContests,
} from '../data/mockData';
import { formatRelativeTime } from '../utils/formatters';

const Dashboard = () => {
  const { user } = useAuth();
  const { platforms, syncAllPlatforms, isSyncingAll, isPlatformSyncing, syncPlatform } = usePlatforms();

  // Get current time of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Get recent contests
  const recentContests = mockContests.slice(0, 3);

  return (
    <PageContainer
      title={`${getGreeting()}, ${user?.name?.split(' ')[0] || 'Developer'}!`}
      description="Here's an overview of your coding progress across all platforms."
      actions={
        <Button
          variant="secondary"
          leftIcon={<RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />}
          onClick={syncAllPlatforms}
          isLoading={isSyncingAll}
        >
          Sync All
        </Button>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total Problems Solved"
          value={mockSummaryStats.totalProblemsSolved}
          icon={Target}
          trend="up"
          trendValue="+23 this week"
          variant="primary"
          delay={0}
        />
        <StatsCard
          title="Current Streak"
          value={mockSummaryStats.currentStreak}
          suffix="days"
          icon={Flame}
          trend="up"
          trendValue="Personal best: 45"
          variant="warning"
          delay={0.1}
        />
        <StatsCard
          title="Contests Participated"
          value={mockSummaryStats.totalContests}
          icon={Trophy}
          trend="up"
          trendValue="+3 this month"
          variant="success"
          delay={0.2}
        />
        <StatsCard
          title="Connected Platforms"
          value={platforms.length}
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
            ratingHistory={mockRatingHistory}
            platforms={['codeforces', 'leetcode', 'codechef']}
            title="Rating Progression"
          />

          {/* Problems Trend */}
          <ActivityGraph
            data={mockProblemsTrend}
            title="Problems Solved Over Time"
          />
        </div>

        {/* Right Column - Streak & Difficulty */}
        <div className="space-y-6">
          <StreakTracker
            currentStreak={mockSummaryStats.currentStreak}
            longestStreak={mockSummaryStats.longestStreak}
            lastActiveDate={new Date().toISOString()}
          />

          <DifficultyChart
            data={mockDifficultyDistribution}
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
              {recentContests.map((contest) => (
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

      {/* Weekly Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-8"
      >
        <h2 className="text-xl font-semibold text-[#f8fafc] mb-4">This Week's Activity</h2>
        <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-5">
          <div className="grid grid-cols-7 gap-2">
            {mockSummaryStats.weeklyProblems.map((day, index) => (
              <div key={day.day} className="text-center">
                <p className="text-xs text-[#64748b] mb-2">{day.day}</p>
                <div className="relative h-24 bg-[#1a1a25] rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.count / 10) * 100}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#6366f1] to-[#8b5cf6] rounded-b-lg"
                  />
                </div>
                <p className="text-sm font-medium text-[#f8fafc] mt-2">{day.count}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#2a2a35]">
            <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
              <Clock className="w-4 h-4" />
              <span>Average: {mockSummaryStats.averageProblemsPerDay.toFixed(1)} problems/day</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#22c55e]">
              <TrendingUp className="w-4 h-4" />
              <span>+15% from last week</span>
            </div>
          </div>
        </div>
      </motion.div>
    </PageContainer>
  );
};

export default Dashboard;
