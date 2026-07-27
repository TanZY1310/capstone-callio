import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Mic, ChartArea, Users } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { motion, AnimatePresence } from 'motion/react';

const MotionNavLink = motion.create(NavLink);

const NAV_ITEMS = [
  {
    id: 1,
    label: 'Customer Listings',
    icon: <LayoutDashboard />,
    path: '/home',
    activeColour: 'text-primary',
  },
  {
    id: 2,
    label: 'Speech Analysis',
    icon: <Mic />,
    path: '/speech',
    activeColour: 'text-warning-icon',
  },
  {
    id: 3,
    label: 'WhatsApp Conversation',
    icon: <SiWhatsapp size={24} />,
    path: '/whatsapp',
    activeColour: 'text-success-icon',
  },
  {
    id: 4,
    label: 'Agent Dashboard',
    icon: <ChartArea />,
    path: '/agent-dashboard',
    activeColour: 'text-info-icon',
    roles: ['agent', 'team_lead'],
  },
  {
    id: 5,
    label: 'Team Dashboard',
    icon: <Users />,
    path: '/team-dashboard',
    activeColour: 'text-secondary-icon',
    roles: ['team_lead'],
  },
];

function Navigation({ isDrawerOpen, role }) {
  const filteredItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(role),
  );

  return (
    <motion.ul
      className="menu w-full grow"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { delayChildren: 0.07 } } }}
    >
      {filteredItems.map((item) => (
        <motion.li
          key={item.id}
          variants={{
            hidden: { opacity: 0, x: -10 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <MotionNavLink
            to={item.path}
            end={item.path === '/home'}
            className={({ isActive }) =>
              `is-drawer-close:tooltip is-drawer-close:tooltip-right ${isActive ? `active ${item.activeColour} font-semibold` : 'text-base-content/60'}`
            }
            data-tip={item.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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
          </MotionNavLink>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export default Navigation;
