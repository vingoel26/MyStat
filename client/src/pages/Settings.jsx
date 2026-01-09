import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Trash2,
  Save,
  ExternalLink,
  Shield,
  Bell,
  Palette,
} from 'lucide-react';
import { PageContainer } from '../components/layout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Avatar from '../components/common/Avatar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { usePlatforms } from '../context/PlatformContext';
import { PLATFORMS } from '../utils/constants';
import { formatRelativeTime } from '../utils/formatters';

const Settings = () => {
  const { user, updateProfile, isLoading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { platforms, syncPlatform, removePlatform, isPlatformSyncing } = usePlatforms();

  const [activeTab, setActiveTab] = useState('profile');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    username: user?.username || '',
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    isPublic: user?.isPublic ?? true,
    showEmail: false,
    showActivity: true,
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'platforms', label: 'Platforms', icon: ExternalLink },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'danger', label: 'Danger Zone', icon: Trash2 },
  ];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile(profileForm);
      // Show success toast
    } catch (error) {
      // Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
    // In production, save to API
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
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs ${colors[platformId] || 'bg-[#6366f1]'}`}>
        {PLATFORMS[platformId]?.name.substring(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <PageContainer
      title="Settings"
      description="Manage your account settings and preferences."
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#6366f1] text-white'
                      : 'text-[#94a3b8] hover:bg-[#1a1a25] hover:text-white'
                  } ${tab.id === 'danger' ? 'text-[#ef4444] hover:text-[#ef4444]' : ''}`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[#f8fafc] mb-6">Profile Information</h2>
                
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <Avatar src={user?.avatarUrl} name={user?.name} size="lg" />
                  <div>
                    <Button variant="secondary" size="sm">Change Avatar</Button>
                    <p className="text-xs text-[#64748b] mt-1">JPG, PNG, or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    name="name"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    placeholder="Your full name"
                  />
                  <Input
                    label="Username"
                    name="username"
                    value={profileForm.username}
                    onChange={handleProfileChange}
                    placeholder="username"
                    helperText={`Your public profile: devstats.io/u/${profileForm.username}`}
                  />
                  <div>
                    <label className="block text-sm font-medium text-[#f8fafc] mb-1.5">Bio</label>
                    <textarea
                      name="bio"
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      rows={4}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2.5 bg-[#1a1a25] border border-[#2a2a35] rounded-lg text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent transition-colors resize-none"
                    />
                    <p className="text-xs text-[#64748b] mt-1">{profileForm.bio.length}/256 characters</p>
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-6 border-t border-[#2a2a35]">
                  <Button
                    variant="primary"
                    onClick={handleSaveProfile}
                    isLoading={isSaving}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {/* Platforms Tab */}
            {activeTab === 'platforms' && (
              <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[#f8fafc] mb-6">Connected Platforms</h2>
                
                <div className="space-y-4">
                  {platforms.map((platform) => {
                    const platformInfo = PLATFORMS[platform.platform];
                    const isSyncing = isPlatformSyncing(platform.id);

                    return (
                      <div
                        key={platform.id}
                        className="flex items-center justify-between p-4 bg-[#1a1a25] rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          {getPlatformIcon(platform.platform)}
                          <div>
                            <h3 className="font-medium text-[#f8fafc]">{platformInfo?.name}</h3>
                            <p className="text-sm text-[#94a3b8]">@{platform.platformUsername}</p>
                            <p className="text-xs text-[#64748b]">
                              {platform.lastSyncedAt
                                ? `Last synced ${formatRelativeTime(platform.lastSyncedAt)}`
                                : 'Never synced'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => syncPlatform(platform.id)}
                            isLoading={isSyncing}
                          >
                            Resync
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#ef4444] hover:bg-[#ef4444]/10"
                            onClick={() => removePlatform(platform.id)}
                          >
                            Disconnect
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-[#2a2a35]">
                  <Button variant="secondary" onClick={() => window.location.href = '/platforms'}>
                    Manage Platforms
                  </Button>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[#f8fafc] mb-6">Privacy Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[#f8fafc]">Public Profile</h3>
                      <p className="text-sm text-[#94a3b8]">Make your profile visible to everyone</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange('isPublic', !privacySettings.isPublic)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        privacySettings.isPublic ? 'bg-[#6366f1]' : 'bg-[#2a2a35]'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          privacySettings.isPublic ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[#f8fafc]">Show Activity</h3>
                      <p className="text-sm text-[#94a3b8]">Display your activity heatmap publicly</p>
                    </div>
                    <button
                      onClick={() => handlePrivacyChange('showActivity', !privacySettings.showActivity)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        privacySettings.showActivity ? 'bg-[#6366f1]' : 'bg-[#2a2a35]'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          privacySettings.showActivity ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[#f8fafc] mb-6">Appearance</h2>
                
                <div>
                  <h3 className="font-medium text-[#f8fafc] mb-4">Theme</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => theme !== 'dark' && toggleTheme()}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                        theme === 'dark'
                          ? 'border-[#6366f1] bg-[#6366f1]/10'
                          : 'border-[#2a2a35] hover:border-[#6366f1]/50'
                      }`}
                    >
                      <Moon className="w-5 h-5 text-[#6366f1]" />
                      <span className="font-medium text-[#f8fafc]">Dark</span>
                    </button>
                    <button
                      onClick={() => theme !== 'light' && toggleTheme()}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                        theme === 'light'
                          ? 'border-[#6366f1] bg-[#6366f1]/10'
                          : 'border-[#2a2a35] hover:border-[#6366f1]/50'
                      }`}
                    >
                      <Sun className="w-5 h-5 text-[#f59e0b]" />
                      <span className="font-medium text-[#f8fafc]">Light</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <div className="bg-[#12121a] border border-[#ef4444]/30 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-[#ef4444] mb-6">Danger Zone</h2>
                
                <div className="p-4 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl">
                  <h3 className="font-medium text-[#f8fafc]">Delete Account</h3>
                  <p className="text-sm text-[#94a3b8] mt-1">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    className="mt-4"
                    onClick={() => setIsDeleteModalOpen(true)}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Account"
        description="This action cannot be undone."
      >
        <p className="text-[#94a3b8]">
          Are you sure you want to delete your account? All of your data will be permanently removed.
        </p>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger">
            Yes, Delete My Account
          </Button>
        </Modal.Footer>
      </Modal>
    </PageContainer>
  );
};

export default Settings;
