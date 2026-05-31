import { useState, useEffect } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";

import {
  PanelLeftOpen,
  PanelLeftClose,
  Settings,
  LogOut,
  Bell,
  LayoutDashboard,
  Sun,
  Moon,
} from "lucide-react";

import Navigation from "./Navigation";

function Sidebar({ setUser }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const navigate = useNavigate();

  //For Theme Toggle
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "corporate",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "corporate" ? "business" : "corporate"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input
          id="my-drawer-4"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={() => setIsDrawerOpen((e) => !e)}
        />
        <div className="drawer-content">
          {/* Navbar */}
          <div className="navbar w-full bg-base-300">
            <div className="navbar-start">
              <button
                className="btn btn-square btn-ghost transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110"
                onClick={() => setIsDrawerOpen((e) => !e)}
              >
                {/* Render Open Close icon based on isDrawer flag */}
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
              {/* Divider */}
              <div className="w-px h-5 bg-base-content opacity-15 mx-1" />
              <button className="btn btn-ghost btn-sm btn-circle transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                <Settings size={18} />
              </button>
              {/* Divider */}
              <div className="w-px h-5 bg-base-content opacity-15 mx-1" />
              <div className="avatar">
                <div className="w-7 rounded-full transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
                  <NavLink to="/profile">
                    <button className="btn btn btn-circle ">
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
          {/* Child route / component */}
          <Outlet />
        </div>

        <div className="drawer-side is-drawer-close:overflow-visible">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
            <div className="flex items-center gap-3 px-4 py-4 w-full border-b border-base-300">
              <div className="bg-neutral text-neutral-content rounded-lg w-8 h-8 flex items-center justify-center shrink-0">
                <LayoutDashboard size={16} />
              </div>
              <span className="is-drawer-close:hidden font-semibold tracking-wide text-sm">
                CALLIO
              </span>
            </div>
            <Navigation />
            <ul className="menu w-full p-3">
              <li>
                <button
                  onClick={handleLogout}
                  className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                  data-tip="Logout"
                >
                  <LogOut />
                  <span className="is-drawer-close:hidden">Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
