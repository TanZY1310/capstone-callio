import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mic, ChartArea } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { motion, AnimatePresence } from 'motion/react';

const NAV_ITEMS = [
  {
    id: 1,
    label: 'Customer Listings',
    icon: <LayoutDashboard />,
    path: '/',
    activeColour: 'text-blue-500',
  },
  {
    id: 2,
    label: 'Speech Analysis',
    icon: <Mic />,
    path: '/speech',
    activeColour: 'text-yellow-500',
  },
  {
    id: 3,
    label: 'WhatsApp Conversation',
    icon: <SiWhatsapp size={24} />,
    path: '/whatsapp',
    activeColour: 'text-green-500',
  },
  {
    id: 4,
    label: 'Metrics',
    icon: <ChartArea />,
    path: '/metrics',
    activeColour: 'text-purple-500',
  },
];

function Navigation({ isDrawerOpen }) {
  return (
    <motion.ul
      className="menu w-full grow"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { delayChildren: 0.07 } } }}
    >
      {NAV_ITEMS.map((item) => (
        <motion.li
          key={item.id}
          variants={{
            hidden: { opacity: 0, x: -10 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <NavLink
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? `active ${item.activeColour} font-semibold` : 'text-base-content/60'}`
            }
            data-tip={item.label}
          >
            {item.icon}
            <AnimatePresence>
              {isDrawerOpen && (
                <motion.div
                  className="flex flex-col overflow-hidden"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="is-drawer-close:hidden">{item.label}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </NavLink>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export default Navigation;
