import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Link,
  Code2,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Zap,
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/platforms', label: 'Platforms', icon: Link },
  { path: '/problems', label: 'Problems', icon: Code2 },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={clsx(
        'flex items-center gap-3 px-4 h-16 border-b border-[#2a2a35]',
        isCollapsed && !isMobile && 'justify-center px-2'
      )}>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] shadow-lg shadow-[#6366f1]/30">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {(!isCollapsed || isMobile) && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="text-xl font-bold gradient-text overflow-hidden whitespace-nowrap"
            >
              DevStats
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setIsMobileOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'group relative',
                isActive
                  ? 'bg-[#6366f1] text-white shadow-lg shadow-[#6366f1]/25'
                  : 'text-[#94a3b8] hover:bg-[#1a1a25] hover:text-white',
                isCollapsed && !isMobile && 'justify-center px-2'
              )}
            >
              <Icon className={clsx(
                'flex-shrink-0 transition-transform duration-200',
                isActive ? 'w-5 h-5' : 'w-5 h-5 group-hover:scale-110'
              )} />
              <AnimatePresence>
                {(!isCollapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a25] text-white text-sm rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-[#2a2a35]">
        <button
          onClick={handleLogout}
          className={clsx(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200',
            'text-[#94a3b8] hover:bg-[#ef4444]/10 hover:text-[#ef4444]',
            isCollapsed && !isMobile && 'justify-center px-2'
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <AnimatePresence>
            {(!isCollapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-sm font-medium overflow-hidden whitespace-nowrap"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 72 : 240 }}
        transition={{ duration: 0.2 }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-[#12121a] border-r border-[#2a2a35] z-40"
      >
        <SidebarContent />
        
        {/* Collapse button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#12121a] border border-[#2a2a35] rounded-full flex items-center justify-center text-[#94a3b8] hover:text-white hover:border-[#6366f1] transition-all duration-200"
        >
          <ChevronLeft className={clsx(
            'w-4 h-4 transition-transform duration-200',
            isCollapsed && 'rotate-180'
          )} />
        </button>
      </motion.aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#12121a] border border-[#2a2a35] rounded-lg text-[#94a3b8] hover:text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 20 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-[#12121a] border-r border-[#2a2a35] z-50"
            >
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for desktop layout */}
      <div
        className={clsx(
          'hidden lg:block flex-shrink-0 transition-all duration-200',
          isCollapsed ? 'w-[72px]' : 'w-[240px]'
        )}
      />
    </>
  );
};

export default Sidebar;
