import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { mockPlatformAccounts, mockSubmissions, mockRatingHistory, mockDailyStats } from '../data/mockData';
import { PLATFORMS } from '../utils/constants';
import { platformApi } from '../services/api';

const PlatformContext = createContext(null);

// Check if we should use real API (backend available)
const USE_REAL_API = true; // Set to false to force mock data

export const PlatformProvider = ({ children }) => {
  const [platforms, setPlatforms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [ratingHistory, setRatingHistory] = useState({});
  const [dailyStats] = useState(mockDailyStats);
  const [syncingPlatforms, setSyncingPlatforms] = useState(new Set());
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load connected platforms on mount
  useEffect(() => {
    const loadPlatforms = async () => {
      if (!USE_REAL_API) {
        // Use mock data
        setPlatforms(mockPlatformAccounts);
        setSubmissions(mockSubmissions);
        setRatingHistory(mockRatingHistory);
        setIsLoading(false);
        return;
      }

      try {
        const response = await platformApi.getConnected();
        if (response.success) {
          setPlatforms(response.data || []);
          // Build rating history from platform data
          const history = {};
          (response.data || []).forEach(p => {
            if (p.profileData?.ratingHistory || p.profileData?.contestHistory) {
              history[p.platform] = (p.profileData.ratingHistory || p.profileData.contestHistory || [])
                .map(c => ({
                  date: c.ratingUpdateTimeSeconds 
                    ? new Date(c.ratingUpdateTimeSeconds * 1000).toISOString().split('T')[0]
                    : c.endTime || c.startTime || new Date().toISOString().split('T')[0],
                  rating: c.newRating || c.rating || 0,
                }));
            }
          });
          setRatingHistory(Object.keys(history).length > 0 ? history : {});
        } else {
          // Start with empty platforms - user can add their own
          setPlatforms([]);
          setRatingHistory({});
        }
      } catch (err) {
        console.error('Backend not available, starting fresh:', err);
        // Start with empty platforms - allows user to add real ones
        setPlatforms([]);
        setSubmissions([]);
        setRatingHistory({});
        setError(null); // Don't show error, just start fresh
      } finally {
        setIsLoading(false);
      }
    };

    loadPlatforms();
  }, []);

  // Get available platforms to add
  const getAvailablePlatforms = useCallback(() => {
    const connectedIds = new Set(platforms.map(p => p.platform));
    return Object.values(PLATFORMS).filter(p => !connectedIds.has(p.id));
  }, [platforms]);

  // Add a new platform
  const addPlatform = useCallback(async (platformId, username) => {
    if (!USE_REAL_API) {
      // Mock mode
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
    }

    try {
      const response = await platformApi.connect(platformId, username);
      if (response.success) {
        setPlatforms(prev => [...prev, response.data]);
        return { success: true, platform: response.data };
      }
      return { success: false, error: response.error || 'Failed to connect platform' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Remove a platform
  const removePlatform = useCallback(async (platformId) => {
    if (!USE_REAL_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setPlatforms(prev => prev.filter(p => p.id !== platformId));
      return { success: true };
    }

    try {
      const response = await platformApi.disconnect(platformId);
      if (response.success) {
        setPlatforms(prev => prev.filter(p => p.id !== platformId));
        setSubmissions(prev => {
          const platform = platforms.find(p => p.id === platformId);
          if (!platform) return prev;
          return prev.filter(s => s.platform !== platform.platform);
        });
      }
      return { success: response.success };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [platforms]);

  // Sync a single platform
  const syncPlatform = useCallback(async (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return { success: false, error: 'Platform not found' };

    setSyncingPlatforms(prev => new Set([...prev, platformId]));

    try {
      if (!USE_REAL_API) {
        // Mock mode
        await new Promise(resolve => setTimeout(resolve, 2000));
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
      }

      const response = await platformApi.sync(platformId);
      if (response.success) {
        setPlatforms(prev => prev.map(p => {
          if (p.id === platformId) {
            return response.data;
          }
          return p;
        }));
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (err) {
      return { success: false, error: err.message };
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
      if (!USE_REAL_API) {
        const results = await Promise.all(
          platforms.map(p => syncPlatform(p.id))
        );
        const allSuccess = results.every(r => r.success);
        return { success: allSuccess };
      }

      const response = await platformApi.syncAll();
      if (response.success) {
        setPlatforms(response.data || []);
      }
      return { success: response.success };
    } catch (err) {
      return { success: false, error: err.message };
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
    isLoading,
    error,
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
