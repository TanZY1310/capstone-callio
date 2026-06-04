import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { LogOut, Building2 } from "lucide-react";
import Navigation from "./Navigation";
import Navbar from "./Navbar";
import { motion, AnimatePresence } from "motion/react";

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
          <Navbar
            isDrawerOpen={isDrawerOpen}
            setIsDrawerOpen={setIsDrawerOpen}
            theme={theme}
            toggleTheme={toggleTheme}
          />
          {/* Child route / component */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="drawer-side is-drawer-close:overflow-visible">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"></label>
          <motion.div
            className="flex min-h-full flex-col items-start bg-base-200"
            animate={{ width: isDrawerOpen ? 256 : 56 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}>
            <div className="flex items-center gap-3 px-4 py-4 w-full border-b border-base-300">
              <div className="bg-neutral text-neutral-content rounded-lg w-8 h-8 flex items-center justify-center shrink-0">
                <Building2 size={16} />
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
                  data-tip="Logout">
                  <LogOut />
                  <span className="is-drawer-close:hidden">Logout</span>
                </button>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
