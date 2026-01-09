import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Share2,
  Copy,
  ExternalLink,
  Twitter,
  Linkedin,
  Globe,
  MapPin,
  Calendar,
  Check,
} from 'lucide-react';
import { useState } from 'react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import { Footer } from '../components/layout';
import { PlatformCard, RatingGraph, DifficultyChart } from '../components/dashboard';
import {
  mockUser,
  mockPlatformAccounts,
  mockRatingHistory,
  mockDifficultyDistribution,
  mockAchievements,
  mockSummaryStats,
} from '../data/mockData';
import { formatDate } from '../utils/formatters';

const PublicProfile = () => {
  const { username } = useParams();
  const [copied, setCopied] = useState(false);

  // In production, fetch user data based on username
  const user = mockUser;
  const platforms = mockPlatformAccounts;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${user.name}'s coding profile on DevStats!`);
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };

    window.open(shareUrls[platform], '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#6366f1]/20 to-[#8b5cf6]/20 border-b border-[#2a2a35]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6366f1] rounded-full blur-[128px] opacity-10" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#8b5cf6] rounded-full blur-[128px] opacity-10" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Avatar
                src={user.avatarUrl}
                name={user.name}
                size="xl"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 text-center md:text-left"
            >
              <h1 className="text-3xl font-bold text-[#f8fafc]">{user.name}</h1>
              <p className="text-[#94a3b8] mt-1">@{user.username}</p>
              {user.bio && (
                <p className="text-[#94a3b8] mt-3 max-w-2xl">{user.bio}</p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4 text-sm text-[#64748b]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(user.createdAt, 'medium')}</span>
                </div>
              </div>

              {/* Skills */}
              {user.skills?.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  {user.skills.slice(0, 6).map(skill => (
                    <Badge key={skill} variant="primary" size="sm">
                      {skill}
                    </Badge>
                  ))}
                  {user.skills.length > 6 && (
                    <Badge variant="default" size="sm">
                      +{user.skills.length - 6} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Social Links */}
              {user.socialLinks && (
                <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                  {user.socialLinks.twitter && (
                    <a
                      href={user.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#1a1a25] text-[#94a3b8] hover:text-[#1da1f2] transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {user.socialLinks.linkedin && (
                    <a
                      href={user.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#1a1a25] text-[#94a3b8] hover:text-[#0077b5] transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                  {user.socialLinks.website && (
                    <a
                      href={user.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#1a1a25] text-[#94a3b8] hover:text-[#6366f1] transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              )}
            </motion.div>

            {/* Share Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Button
                variant="secondary"
                size="sm"
                leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                onClick={handleCopyLink}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 text-center">
            <p className="text-3xl font-bold gradient-text">{mockSummaryStats.totalProblemsSolved}</p>
            <p className="text-sm text-[#64748b]">Problems Solved</p>
          </div>
          <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-[#22c55e]">{mockSummaryStats.currentStreak}</p>
            <p className="text-sm text-[#64748b]">Day Streak</p>
          </div>
          <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-[#f59e0b]">{mockSummaryStats.totalContests}</p>
            <p className="text-sm text-[#64748b]">Contests</p>
          </div>
          <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-[#8b5cf6]">{platforms.length}</p>
            <p className="text-sm text-[#64748b]">Platforms</p>
          </div>
        </motion.div>

        {/* Connected Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-[#f8fafc] mb-4">Connected Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.slice(0, 4).map((platform, index) => (
              <PlatformCard
                key={platform.id}
                platform={platform.platform}
                username={platform.platformUsername}
                profileData={platform.profileData}
                isVerified={platform.isVerified}
                lastSyncedAt={platform.lastSyncedAt}
                showActions={false}
                delay={index * 0.1}
              />
            ))}
          </div>
        </motion.div>

        {/* Rating Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8"
        >
          <RatingGraph
            ratingHistory={mockRatingHistory}
            platforms={['codeforces', 'leetcode']}
            title="Rating History"
          />
        </motion.div>

        {/* Difficulty Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          <DifficultyChart
            data={mockDifficultyDistribution}
            title="Difficulty Distribution"
          />
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h2 className="text-xl font-semibold text-[#f8fafc] mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockAchievements.slice(0, 8).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-4 text-center hover:border-[#6366f1]/50 transition-colors"
              >
                <span className="text-3xl mb-2 block">{achievement.icon}</span>
                <h3 className="text-sm font-medium text-[#f8fafc]">{achievement.name}</h3>
                <p className="text-xs text-[#64748b] mt-1">{achievement.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default PublicProfile;
