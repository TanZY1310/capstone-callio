import { useState } from 'react';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import {
  LogOut,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
} from 'lucide-react';
import Navigation from './Navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../hooks/useTheme';

function Sidebar({ logout, profile }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const navigate = useNavigate();
  const role = profile?.role || 'agent';

  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ===== SIDEBAR ===== */}
      <motion.aside
        className={`relative flex flex-col h-full bg-base-100 border-r border-base-200 overflow-visible shrink-0 z-20`}
        animate={{ width: isDrawerOpen ? 256 : 64 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      >
        {/* ── Toggle button sitting on the right border edge ── */}
        <motion.button
          className={`absolute -right-3.5 top-6 z-30 w-7 h-7 rounded-full bg-base-100 border border-base-200 shadow-sm flex items-center justify-center text-base-content/60 hover:text-base-content transition-colors`}
          onClick={() => setIsDrawerOpen((o) => !o)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isDrawerOpen ? (
            <PanelLeftClose size={14} />
          ) : (
            <PanelLeftOpen size={14} />
          )}
        </motion.button>

        {/* ── Logo header ── */}
        <div
          className={`flex items-center gap-2 px-4 py-4 border-b border-base-200 overflow-hidden`}
        >
          {/* Logo icon */}
          <div className="bg-primary rounded-lg w-8 h-8 flex items-center justify-center shrink-0">
            <Building2 size={16} />
          </div>

          {/* CALLIO text + theme toggle */}
          <AnimatePresence>
            {isDrawerOpen && (
              <motion.div
                className="flex items-center justify-between flex-1 overflow-hidden"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >
                <span className="font-bold tracking-widest text-sm text-base-content whitespace-nowrap">
                  CALLIO
                </span>

                {/* ✅ Theme toggle right beside CALLIO */}
                <motion.button
                  className="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-base-content"
                  onClick={toggleTheme}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Toggle theme"
                >
                  {theme === 'corporate' ? (
                    <Moon size={15} />
                  ) : (
                    <Sun size={15} />
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── User profile block — matches reference image ── */}
        <div
          className={`flex items-center gap-3 px-4 py-4 border-b border-base-200 overflow-hidden`}
        >
          <NavLink to="/profile" className="shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="avatar"
            >
              <div className="w-10 h-10 rounded-full ring-2 ring-primary/20">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
                  alt="User avatar"
                />
              </div>
            </motion.div>
          </NavLink>
          <AnimatePresence>
            {isDrawerOpen && (
              <motion.div
                className="flex flex-col overflow-hidden"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >
                <span className="text-sm font-semibold text-base-content whitespace-nowrap">
                  {profile?.first_name} {profile?.last_name}
                </span>
                <span className="text-xs text-base-content/50 whitespace-nowrap capitalize">
                  {role === 'team_lead' ? 'Team Lead' : 'Agent'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Navigation items ── */}
        <div className="flex-1 overflow-hidden">
          <Navigation isDrawerOpen={isDrawerOpen} role={role} />
        </div>

        {/* ── Bottom actions ── */}
        <div className="border-t border-base-200">
          <ul className="menu w-full p-2 gap-0.5">
            <li>
              <motion.button
                onClick={handleLogout}
                className={`is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center gap-3 text-logout-icon hover:bg-logout-icon/10 ${!isDrawerOpen ? 'justify-center' : ''}`}
                data-tip="Logout"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={18} />
                <AnimatePresence>
                  {isDrawerOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      Logout
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </li>
          </ul>
        </div>
      </motion.aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-y-auto bg-base-200">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default Sidebar;
