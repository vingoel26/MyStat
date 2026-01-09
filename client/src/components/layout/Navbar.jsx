import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  User,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Avatar from '../common/Avatar';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
  };

  // Mock notifications
  const notifications = [
    { id: 1, title: 'New rating update', message: 'Your Codeforces rating increased by 45!', time: '2h ago', unread: true },
    { id: 2, title: 'Sync complete', message: 'All platforms synced successfully', time: '5h ago', unread: true },
    { id: 3, title: 'Achievement unlocked', message: 'You solved 500 problems!', time: '1d ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#2a2a35]">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
            <input
              type="text"
              placeholder="Search problems, platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#12121a] border border-[#2a2a35] rounded-lg text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#6366f1] transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 ml-auto lg:gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1a1a25] transition-all duration-200"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <div ref={notificationsRef} className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#1a1a25] transition-all duration-200"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#ef4444] rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-[#12121a] border border-[#2a2a35] rounded-xl shadow-2xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-[#2a2a35]">
                    <h3 className="font-semibold text-[#f8fafc]">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={clsx(
                          'px-4 py-3 border-b border-[#2a2a35] last:border-0 hover:bg-[#1a1a25] transition-colors cursor-pointer',
                          notification.unread && 'bg-[#6366f1]/5'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <span className="w-2 h-2 mt-2 rounded-full bg-[#6366f1] flex-shrink-0" />
                          )}
                          <div className={clsx(!notification.unread && 'ml-5')}>
                            <p className="text-sm font-medium text-[#f8fafc]">{notification.title}</p>
                            <p className="text-xs text-[#94a3b8] mt-0.5">{notification.message}</p>
                            <p className="text-xs text-[#64748b] mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-[#2a2a35]">
                    <button className="text-sm text-[#6366f1] hover:text-[#818cf8] transition-colors">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1a1a25] transition-all duration-200"
            >
              <Avatar
                src={user?.avatarUrl}
                name={user?.name}
                size="sm"
                status="online"
              />
              <span className="hidden md:block text-sm font-medium text-[#f8fafc]">
                {user?.name}
              </span>
              <ChevronDown className={clsx(
                'hidden md:block w-4 h-4 text-[#64748b] transition-transform duration-200',
                isProfileOpen && 'rotate-180'
              )} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-[#12121a] border border-[#2a2a35] rounded-xl shadow-2xl overflow-hidden"
                >
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-[#2a2a35]">
                    <p className="font-semibold text-[#f8fafc]">{user?.name}</p>
                    <p className="text-sm text-[#94a3b8]">@{user?.username}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <Link
                      to={`/u/${user?.username}`}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[#94a3b8] hover:text-white hover:bg-[#1a1a25] transition-colors"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-[#94a3b8] hover:text-white hover:bg-[#1a1a25] transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="py-1 border-t border-[#2a2a35]">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
