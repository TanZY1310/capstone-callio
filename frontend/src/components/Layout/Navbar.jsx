// Navbar.jsx
import { NavLink } from "react-router-dom";
import {
  PanelLeftOpen,
  PanelLeftClose,
  Settings,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "motion/react";

function Navbar({ isDrawerOpen, setIsDrawerOpen, theme, toggleTheme }) {
  return (
    <motion.div className="navbar w-full bg-base-300" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1}} transition={{ duration: 0.3 }}>
      <div className="navbar-start">
        <motion.button
          className="btn btn-square btn-ghost"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 1.0 }}
          onClick={() => setIsDrawerOpen((e) => !e)}>
          {isDrawerOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </motion.button>
      </div>
      <div className="navbar-end gap-1">
        {/* Theme toggle */}
        <motion.button
          className="btn btn-ghost btn-sm btn-circle"
          whileHover={{ scale: 1.5 }}
          whileTap={{ scale: 1.0 }}
          onClick={toggleTheme}
          aria-label="Toggle theme">
          {theme === "corporate" ? <Moon size={18} /> : <Sun size={18} />}
        </motion.button>
        {/* Divider */}
        <div className="w-px h-5 bg-base-content opacity-15 mx-1" />
        <motion.button
          className="btn btn-ghost btn-sm btn-circle"
          whileHover={{ scale: 1.5 }}
          whileTap={{ scale: 1.0 }}>
          <Bell size={18} />
        </motion.button>
        <div className="w-px h-5 bg-base-content opacity-15 mx-1" />
        <motion.button
          className="btn btn-ghost btn-sm btn-circle"
          whileHover={{ scale: 1.5 }}
          whileTap={{ scale: 1.0 }}>
          <Settings size={18} />
        </motion.button>
        <div className="w-px h-5 bg-base-content opacity-15 mx-1" />
        <div className="avatar">
          <div className="w-7 rounded-full">
            <NavLink to="/profile">
              <motion.button
                className="btn btn-circle"
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 1.0 }}>
                <img
                  src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                  alt="User avatar"
                />
              </motion.button>
            </NavLink>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Navbar;
