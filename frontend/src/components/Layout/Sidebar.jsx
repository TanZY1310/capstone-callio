import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Phone,
  PanelLeftOpen,
  PanelLeftClose,
  Settings,
  Mic,
  ChartArea,
  LayoutDashboard,
} from "lucide-react";

const Nav_Items = [
  { id: 1, label: "Customer Listings", icon: <LayoutDashboard />, path: "" },
  { id: 2, label: "Speech Analysis", icon: <Mic />, path: "/speech" },
  {
    id: 3,
    label: "WhatsApp Conversation",
    icon: <Phone />,
    path: "/whatsapp",
  },
  { id: 4, label: "Metrics", icon: <ChartArea />, path: "/metrics" },
];

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
            <div className="navbar-center">
              <div className="px-4">CALLIO</div>
            </div>
            <div className="navbar-end">
              <button className="btn btn-ghost btn-circle">
                <Settings />
              </button>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                Logout
              </button>
              <div className="avatar">
                <div className="w-7 rounded-full">
                  <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
                </div>
              </div>
            </div>
          </div>
          {/* Page content here */}
          <div className="p-4">Page Content</div>
        </div>

        <div className="drawer-side is-drawer-close:overflow-visible">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
            {/* Sidebar content here */}
            <ul className="menu w-full grow">
              {Nav_Items.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? "active" : ""}`
                    }
                    data-tip={item.label}
                  >
                    {item.icon}
                    <span className="is-drawer-close:hidden">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
