import { motion } from 'motion/react';
import { Users } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePageLoader() {
  return (
    <div className="flex min-h-screen bg-base-200/50">
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {/* Header */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
        >
          <div className="skeleton h-7 w-48 mb-1 rounded" />
          <div className="skeleton h-4 w-64 rounded" />
        </motion.div>

        {/* Stat cards row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="dashboard-card p-5 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <div className="skeleton h-3 w-28 mb-2 rounded" />
              <div className="skeleton h-6 w-16 rounded" />
            </div>
          </div>
          <div className="dashboard-card p-5 flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <SiWhatsapp size={20} />
            </div>
            <div>
              <div className="skeleton h-3 w-24 mb-2 rounded" />
              <div className="skeleton h-6 w-20 rounded" />
            </div>
          </div>
        </motion.div>

        {/* Customer Directory card */}
        <motion.div
          className="dashboard-card overflow-hidden"
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-base-200">
            <div>
              <div className="skeleton h-4 w-36 mb-1 rounded" />
              <div className="skeleton h-3 w-56 rounded" />
            </div>
            <div className="skeleton h-8 w-72 rounded-btn" />
          </div>

          {/* Wave bar animation */}
          <div className="flex flex-col items-center gap-5 py-14">
            <div className="flex items-end gap-[3px] h-20">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[6px] rounded-full bg-primary/60"
                  style={{
                    height: `${40 + Math.sin(i * 0.5) * 30}%`,
                    animation: `wave-bounce 0.6s ease-in-out ${i * 0.06}s infinite alternate`,
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-base-content/40 font-medium tracking-wide">
              Loading your customer directory...
            </p>
          </div>

          {/* CSS bar loader */}
          <div className="flex justify-center pb-6">
            <span className="loading loading-bars loading-lg text-primary/50"></span>
          </div>

          {/* Pagination skeleton */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-base-200">
            <div className="skeleton h-3 w-32 rounded" />
            <div className="skeleton h-6 w-24 rounded" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
