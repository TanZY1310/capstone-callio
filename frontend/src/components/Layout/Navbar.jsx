// Navbar.jsx
import { NavLink } from "react-router-dom";
import { PanelLeftOpen, PanelLeftClose, Settings, Bell, Sun, Moon } from "lucide-react";

function Navbar({ isDrawerOpen, setIsDrawerOpen, theme, toggleTheme }) {
  return (
    <div className="navbar w-full bg-base-300">
      <div className="navbar-start">
        <button
          className="btn btn-square btn-ghost transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
          onClick={() => setIsDrawerOpen((e) => !e)}
        >
          {isDrawerOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </button>
      </div>
      <div className="navbar-end gap-1">
        {/* Theme toggle */}
        <button
          className="btn btn-ghost btn-sm btn-circle transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === "corporate" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        {/* Divider */}
        <div className="w-px h-5 bg-base-content opacity-15 mx-1" />
        <button className="btn btn-ghost btn-sm btn-circle transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
          <Bell size={18} />
        </button>
        <div className="w-px h-5 bg-base-content opacity-15 mx-1" />
        <button className="btn btn-ghost btn-sm btn-circle transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
          <Settings size={18} />
        </button>
        <div className="w-px h-5 bg-base-content opacity-15 mx-1" />
        <div className="avatar">
          <div className="w-7 rounded-full transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
            <NavLink to="/profile">
              <button className="btn btn-circle">
                <img
                  src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                  alt="User avatar"
                />
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;