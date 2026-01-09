import { createContext, useContext, useState, useCallback } from 'react';
import { mockPlatformAccounts, mockSubmissions, mockRatingHistory, mockDailyStats } from '../data/mockData';
import { PLATFORMS } from '../utils/constants';

const PlatformContext = createContext(null);

export const PlatformProvider = ({ children }) => {
  const [platforms, setPlatforms] = useState(mockPlatformAccounts);
  const [submissions, setSubmissions] = useState(mockSubmissions);
  const [ratingHistory] = useState(mockRatingHistory);
  const [dailyStats] = useState(mockDailyStats);
  const [syncingPlatforms, setSyncingPlatforms] = useState(new Set());
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Get available platforms to add
  const getAvailablePlatforms = useCallback(() => {
    const connectedIds = new Set(platforms.map(p => p.platform));
    return Object.values(PLATFORMS).filter(p => !connectedIds.has(p.id));
  }, [platforms]);

  // Add a new platform
  const addPlatform = useCallback(async (platformId, username) => {
    // TODO: Replace with real API call to verify and connect platform
    await new Promise(resolve => setTimeout(resolve, 1500));

    const platformInfo = PLATFORMS[platformId];
    const newPlatform = {
      id: `pa_${platformId}_${Date.now()}`,
      platform: platformId,
      platformUsername: username,
      isVerified: false,
      lastSyncedAt: null,
      profileData: {
        rating: platformInfo.hasRating ? 1000 : null,
        problemsSolved: 0,
        contestsParticipated: platformInfo.hasContests ? 0 : null,
      },
    };

    setPlatforms(prev => [...prev, newPlatform]);
    return { success: true, platform: newPlatform };
  }, []);

  // Remove a platform
  const removePlatform = useCallback(async (platformId) => {
    // TODO: Replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));

    setPlatforms(prev => prev.filter(p => p.id !== platformId));
    setSubmissions(prev => {
      const platform = platforms.find(p => p.id === platformId);
      if (!platform) return prev;
      return prev.filter(s => s.platform !== platform.platform);
    });
    return { success: true };
  }, [platforms]);

  // Sync a single platform
  const syncPlatform = useCallback(async (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return { success: false, error: 'Platform not found' };

    setSyncingPlatforms(prev => new Set([...prev, platformId]));

    try {
      // TODO: Replace with real API call
      // const data = await platformApi.sync(platform.platform, platform.platformUsername);
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update with mock refreshed data
      setPlatforms(prev => prev.map(p => {
        if (p.id === platformId) {
          return {
            ...p,
            lastSyncedAt: new Date().toISOString(),
            isVerified: true,
            profileData: {
              ...p.profileData,
              problemsSolved: (p.profileData?.problemsSolved || 0) + Math.floor(Math.random() * 5),
            },
          };
        }
        return p;
      }));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setSyncingPlatforms(prev => {
        const next = new Set(prev);
        next.delete(platformId);
        return next;
      });
    }
  }, [platforms]);

  // Sync all platforms
  const syncAllPlatforms = useCallback(async () => {
    setIsSyncingAll(true);
    
    try {
      const results = await Promise.all(
        platforms.map(p => syncPlatform(p.id))
      );
      
      const allSuccess = results.every(r => r.success);
      return { success: allSuccess };
    } finally {
      setIsSyncingAll(false);
    }
  }, [platforms, syncPlatform]);

  // Get platform by ID
  const getPlatformById = useCallback((platformId) => {
    return platforms.find(p => p.id === platformId);
  }, [platforms]);

  // Get platform by platform name
  const getPlatformByName = useCallback((platformName) => {
    return platforms.find(p => p.platform === platformName);
  }, [platforms]);

  // Check if a platform is syncing
  const isPlatformSyncing = useCallback((platformId) => {
    return syncingPlatforms.has(platformId);
  }, [syncingPlatforms]);

  // Get aggregated stats
  const getAggregatedStats = useCallback(() => {
    const totalSolved = platforms.reduce((sum, p) => {
      return sum + (p.profileData?.problemsSolved || 0);
    }, 0);

    const totalContests = platforms.reduce((sum, p) => {
      return sum + (p.profileData?.contestsParticipated || 0);
    }, 0);

    const platformWithMaxRating = platforms.reduce((max, p) => {
      if (!p.profileData?.rating) return max;
      if (!max || p.profileData.rating > max.profileData.rating) return p;
      return max;
    }, null);

    return {
      totalSolved,
      totalContests,
      connectedPlatforms: platforms.length,
      highestRating: platformWithMaxRating?.profileData?.rating || 0,
      highestRatingPlatform: platformWithMaxRating?.platform || null,
    };
  }, [platforms]);

  const value = {
    platforms,
    submissions,
    ratingHistory,
    dailyStats,
    syncingPlatforms,
    isSyncingAll,
    getAvailablePlatforms,
    addPlatform,
    removePlatform,
    syncPlatform,
    syncAllPlatforms,
    getPlatformById,
    getPlatformByName,
    isPlatformSyncing,
    getAggregatedStats,
  };

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  );
};

export const usePlatforms = () => {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatforms must be used within a PlatformProvider');
  }
  return context;
};

export default PlatformContext;
