import { NavLink } from "react-router-dom";
import { LayoutDashboard, Mic, Phone, ChartArea } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const NAV_ITEMS = [
  { id: 1, label: "Customer Listings", icon: <LayoutDashboard />, path: "/" },
  { id: 2, label: "Speech Analysis", icon: <Mic />, path: "/speech" },
  { id: 3, label: "WhatsApp Conversation", icon: <Phone />, path: "/whatsapp" },
  { id: 4, label: "Metrics", icon: <ChartArea />, path: "/metrics" },
];

function Navigation() {
  return (
    <ul className="menu w-full grow">
      {NAV_ITEMS.map((item) => (
        <li key={item.id}>
          <NavLink
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? `active ${item.activeColour} font-semibold` : "text-base-content/60"}`
            }
            data-tip={item.label}
          >
            {item.icon}
            <span className="is-drawer-close:hidden">{item.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default Navigation;
