import { motion } from 'framer-motion';
import { RefreshCw, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { PLATFORMS } from '../../utils/constants';
import { formatNumber, formatRelativeTime, getRatingTier } from '../../utils/formatters';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Tooltip from '../common/Tooltip';

const PlatformCard = ({
  platform,
  username,
  profileData,
  isVerified,
  lastSyncedAt,
  isSyncing,
  onSync,
  onDisconnect,
  showActions = true,
  variant = 'full',
  delay = 0,
  className,
}) => {
  const platformInfo = PLATFORMS[platform];
  
  if (!platformInfo) return null;

  const rating = profileData?.rating;
  const ratingTier = rating ? getRatingTier(platform, rating) : null;

  // Platform logos (using colored divs as placeholders)
  const getPlatformIcon = () => {
    const iconClass = 'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm';
    const colors = {
      codeforces: 'bg-[#1890ff]',
      leetcode: 'bg-[#ffa116]',
      codechef: 'bg-[#5b4638]',
      atcoder: 'bg-[#222222] border border-[#444]',
      kattis: 'bg-[#00a651]',
      github: 'bg-[#24292f]',
      gitlab: 'bg-[#fc6d26]',
      kaggle: 'bg-[#20beff]',
      stackoverflow: 'bg-[#f48024]',
    };
    
    return (
      <div className={clsx(iconClass, colors[platform])}>
        {platformInfo.name.substring(0, 2).toUpperCase()}
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay }}
        className={clsx(
          'flex items-center gap-4 p-4 rounded-xl bg-[#12121a] border border-[#2a2a35]',
          'hover:border-[#6366f1]/50 transition-all duration-300',
          className
        )}
      >
        {getPlatformIcon()}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#f8fafc] truncate">{platformInfo.name}</p>
          <p className="text-sm text-[#94a3b8] truncate">@{username}</p>
        </div>
        {rating && (
          <div className="text-right">
            <p className="font-bold text-[#f8fafc]">{formatNumber(rating)}</p>
            {ratingTier && (
              <p className="text-xs" style={{ color: ratingTier.color }}>
                {ratingTier.label}
              </p>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4 }}
      className={clsx(
        'relative overflow-hidden rounded-xl bg-[#12121a] border border-[#2a2a35] p-5',
        'hover:border-[#6366f1]/50 hover:shadow-lg hover:shadow-[#6366f1]/5 transition-all duration-300',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getPlatformIcon()}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#f8fafc]">{platformInfo.name}</h3>
              <Tooltip content={isVerified ? 'Verified' : 'Not verified'}>
                {isVerified ? (
                  <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
                )}
              </Tooltip>
            </div>
            <p className="text-sm text-[#94a3b8]">@{username}</p>
          </div>
        </div>
        <a
          href={`https://${platform}.com/profile/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg text-[#64748b] hover:text-[#f8fafc] hover:bg-[#1a1a25] transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {platformInfo.hasRating && rating && (
          <div>
            <p className="text-xs text-[#64748b] uppercase tracking-wider">Rating</p>
            <p className="text-xl font-bold" style={{ color: ratingTier?.color || '#f8fafc' }}>
              {formatNumber(rating)}
            </p>
            {ratingTier && (
              <Badge variant={platform} size="sm" className="mt-1">
                {ratingTier.label}
              </Badge>
            )}
          </div>
        )}
        <div>
          <p className="text-xs text-[#64748b] uppercase tracking-wider">
            {platform === 'github' ? 'Repos' : platform === 'stackoverflow' ? 'Reputation' : 'Solved'}
          </p>
          <p className="text-xl font-bold text-[#f8fafc]">
            {formatNumber(
              profileData?.problemsSolved || 
              profileData?.publicRepos || 
              profileData?.reputation || 
              0
            )}
          </p>
        </div>
        {platformInfo.hasContests && profileData?.contestsParticipated && (
          <div>
            <p className="text-xs text-[#64748b] uppercase tracking-wider">Contests</p>
            <p className="text-xl font-bold text-[#f8fafc]">
              {formatNumber(profileData.contestsParticipated)}
            </p>
          </div>
        )}
        {platform === 'github' && profileData?.totalStars && (
          <div>
            <p className="text-xs text-[#64748b] uppercase tracking-wider">Stars</p>
            <p className="text-xl font-bold text-[#f8fafc]">
              {formatNumber(profileData.totalStars)}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#2a2a35]">
        <p className="text-xs text-[#64748b]">
          {lastSyncedAt ? `Synced ${formatRelativeTime(lastSyncedAt)}` : 'Never synced'}
        </p>
        {showActions && (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSync}
              isLoading={isSyncing}
              leftIcon={<RefreshCw className={clsx('w-4 h-4', isSyncing && 'animate-spin')} />}
            >
              Sync
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlatformCard;
