import { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";

import {
  PanelLeftOpen,
  PanelLeftClose,
  Settings,
  LogOut,
  Bell,
  LayoutDashboard
} from "lucide-react";

import Navigation from "./Navigation";

function Sidebar({ setUser }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const navigate = useNavigate();

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
                className="btn btn-square btn-ghost"
                onClick={() => setIsDrawerOpen((e) => !e)}
              >
                {/* Render Open Close icon based on isDrawer flag */}
                {isDrawerOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
              </button>
            </div>
            {/* <div className="navbar-center">
              <div className="px-4">CALLIO</div>
            </div> */}
            <div className="navbar-end gap-1">
              <button className="btn btn-ghost btn-sm btn-circle">
                <Bell size={18} />
              </button>
              <div className="w-px h-5 bg-base-content opacity-15 mx-1" />
              <button className="btn btn-ghost btn-sm btn-circle">
                <Settings size={18} />
              </button>
              {/* Divider */}
              <div className="w-px h-5 bg-base-content opacity-15 mx-1" />
              <div className="avatar">
                <div className="w-7 rounded-full">
                  <img
                    src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp"
                    alt="User avatar"
                  />
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
