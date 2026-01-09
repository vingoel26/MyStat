import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { PageContainer } from '../components/layout';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { usePlatforms } from '../context/PlatformContext';
import { PLATFORMS } from '../utils/constants';
import { formatRelativeTime } from '../utils/formatters';
import { validatePlatformUsername } from '../utils/validators';

const Platforms = () => {
  const {
    platforms,
    getAvailablePlatforms,
    addPlatform,
    removePlatform,
    syncPlatform,
    syncAllPlatforms,
    isPlatformSyncing,
    isSyncingAll,
  } = usePlatforms();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedPlatformToRemove, setSelectedPlatformToRemove] = useState(null);
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const availablePlatforms = getAvailablePlatforms();

  const filteredPlatforms = platforms.filter(p => {
    const platformInfo = PLATFORMS[p.platform];
    const searchLower = searchQuery.toLowerCase();
    return (
      platformInfo?.name.toLowerCase().includes(searchLower) ||
      p.platformUsername.toLowerCase().includes(searchLower)
    );
  });

  const handleAddPlatform = async () => {
    if (!selectedPlatform) return;

    const validation = validatePlatformUsername(selectedPlatform, username);
    if (!validation.isValid) {
      setUsernameError(validation.message);
      return;
    }

    setIsAdding(true);
    try {
      await addPlatform(selectedPlatform, username);
      setIsAddModalOpen(false);
      setSelectedPlatform(null);
      setUsername('');
    } catch (error) {
      setUsernameError('Failed to add platform. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemovePlatform = async () => {
    if (!selectedPlatformToRemove) return;

    setIsRemoving(true);
    try {
      await removePlatform(selectedPlatformToRemove.id);
      setIsRemoveModalOpen(false);
      setSelectedPlatformToRemove(null);
    } finally {
      setIsRemoving(false);
    }
  };

  const openRemoveModal = (platform) => {
    setSelectedPlatformToRemove(platform);
    setIsRemoveModalOpen(true);
  };

  const getPlatformIcon = (platformId) => {
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
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm ${colors[platformId] || 'bg-[#6366f1]'}`}>
        {PLATFORMS[platformId]?.name.substring(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <PageContainer
      title="Platforms"
      description="Manage your connected coding platforms and sync your data."
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            leftIcon={<RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />}
            onClick={syncAllPlatforms}
            isLoading={isSyncingAll}
          >
            Sync All
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
            disabled={availablePlatforms.length === 0}
          >
            Add Platform
          </Button>
        </div>
      }
    >
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
          <input
            type="text"
            placeholder="Search platforms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#12121a] border border-[#2a2a35] rounded-lg text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#6366f1] transition-colors"
          />
        </div>
      </div>

      {/* Connected Platforms */}
      {filteredPlatforms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredPlatforms.map((platform, index) => {
              const platformInfo = PLATFORMS[platform.platform];
              const isSyncing = isPlatformSyncing(platform.id);

              return (
                <motion.div
                  key={platform.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-5 hover:border-[#6366f1]/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getPlatformIcon(platform.platform)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[#f8fafc]">{platformInfo?.name}</h3>
                          {platform.isVerified ? (
                            <CheckCircle className="w-4 h-4 text-[#22c55e]" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
                          )}
                        </div>
                        <p className="text-sm text-[#94a3b8]">@{platform.platformUsername}</p>
                      </div>
                    </div>
                    <a
                      href={`https://${platform.platform}.com`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-[#64748b] hover:text-[#f8fafc] hover:bg-[#1a1a25] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {platformInfo?.hasRating && platform.profileData?.rating && (
                      <div className="bg-[#1a1a25] rounded-lg p-3">
                        <p className="text-xs text-[#64748b]">Rating</p>
                        <p className="text-lg font-bold text-[#f8fafc]">
                          {platform.profileData.rating}
                        </p>
                      </div>
                    )}
                    <div className="bg-[#1a1a25] rounded-lg p-3">
                      <p className="text-xs text-[#64748b]">
                        {platform.platform === 'github' ? 'Repos' : 
                         platform.platform === 'stackoverflow' ? 'Reputation' : 'Solved'}
                      </p>
                      <p className="text-lg font-bold text-[#f8fafc]">
                        {platform.profileData?.problemsSolved || 
                         platform.profileData?.publicRepos ||
                         platform.profileData?.reputation || 0}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#2a2a35]">
                    <p className="text-xs text-[#64748b]">
                      {platform.lastSyncedAt 
                        ? `Synced ${formatRelativeTime(platform.lastSyncedAt)}`
                        : 'Never synced'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => syncPlatform(platform.id)}
                        isLoading={isSyncing}
                        leftIcon={<RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />}
                      >
                        Sync
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#ef4444] hover:bg-[#ef4444]/10"
                        onClick={() => openRemoveModal(platform)}
                        leftIcon={<Trash2 className="w-4 h-4" />}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1a1a25] flex items-center justify-center">
            <Search className="w-8 h-8 text-[#64748b]" />
          </div>
          <h3 className="text-lg font-medium text-[#f8fafc] mb-2">
            {searchQuery ? 'No platforms found' : 'No platforms connected'}
          </h3>
          <p className="text-[#94a3b8] mb-6">
            {searchQuery 
              ? 'Try a different search term'
              : 'Add your first coding platform to get started'}
          </p>
          {!searchQuery && (
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Platform
            </Button>
          )}
        </motion.div>
      )}

      {/* Available Platforms to Add */}
      {availablePlatforms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold text-[#f8fafc] mb-4">Available Platforms</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {availablePlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => {
                  setSelectedPlatform(platform.id);
                  setIsAddModalOpen(true);
                }}
                className="flex flex-col items-center gap-3 p-4 bg-[#12121a] border border-[#2a2a35] rounded-xl hover:border-[#6366f1]/50 hover:bg-[#1a1a25] transition-all duration-300"
              >
                {getPlatformIcon(platform.id)}
                <span className="text-sm text-[#94a3b8]">{platform.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Add Platform Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedPlatform(null);
          setUsername('');
          setUsernameError('');
        }}
        title="Add Platform"
        description="Connect a new coding platform to track your progress."
      >
        <div className="space-y-4">
          {/* Platform Selection */}
          {!selectedPlatform ? (
            <div className="grid grid-cols-3 gap-3">
              {availablePlatforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setSelectedPlatform(platform.id)}
                  className="flex flex-col items-center gap-2 p-4 bg-[#1a1a25] border border-[#2a2a35] rounded-xl hover:border-[#6366f1]/50 transition-all duration-300"
                >
                  {getPlatformIcon(platform.id)}
                  <span className="text-xs text-[#94a3b8]">{platform.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-4 bg-[#1a1a25] rounded-xl">
                {getPlatformIcon(selectedPlatform)}
                <div>
                  <h3 className="font-semibold text-[#f8fafc]">
                    {PLATFORMS[selectedPlatform]?.name}
                  </h3>
                  <p className="text-sm text-[#94a3b8]">Enter your username</p>
                </div>
                <button
                  onClick={() => setSelectedPlatform(null)}
                  className="ml-auto text-sm text-[#6366f1] hover:text-[#818cf8]"
                >
                  Change
                </button>
              </div>

              <Input
                label="Username"
                placeholder={`Your ${PLATFORMS[selectedPlatform]?.name} username`}
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameError('');
                }}
                error={usernameError}
              />

              <p className="text-xs text-[#64748b]">
                We'll verify your account and start syncing your data automatically.
              </p>
            </>
          )}
        </div>

        {selectedPlatform && (
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setIsAddModalOpen(false);
                setSelectedPlatform(null);
                setUsername('');
                setUsernameError('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddPlatform}
              isLoading={isAdding}
              disabled={!username}
            >
              Connect Platform
            </Button>
          </Modal.Footer>
        )}
      </Modal>

      {/* Remove Platform Modal */}
      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => {
          setIsRemoveModalOpen(false);
          setSelectedPlatformToRemove(null);
        }}
        title="Remove Platform"
        description="Are you sure you want to disconnect this platform?"
      >
        {selectedPlatformToRemove && (
          <div className="flex items-center gap-3 p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl">
            {getPlatformIcon(selectedPlatformToRemove.platform)}
            <div>
              <h3 className="font-semibold text-[#f8fafc]">
                {PLATFORMS[selectedPlatformToRemove.platform]?.name}
              </h3>
              <p className="text-sm text-[#94a3b8]">@{selectedPlatformToRemove.platformUsername}</p>
            </div>
          </div>
        )}

        <p className="mt-4 text-sm text-[#94a3b8]">
          This will remove all synced data from this platform. You can always reconnect later.
        </p>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setIsRemoveModalOpen(false);
              setSelectedPlatformToRemove(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleRemovePlatform}
            isLoading={isRemoving}
          >
            Remove Platform
          </Button>
        </Modal.Footer>
      </Modal>
    </PageContainer>
  );
};

export default Platforms;
