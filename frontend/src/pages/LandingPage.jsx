import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Mic,
  BarChart3,
  Sheet,
  Languages,
  Check,
  Building2,
  Users,
  Phone,
  MapPin,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  Sun,
  Moon,
  ChevronRight,
  Mail,
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = '' }) {
  const ref = useScrollReveal();
  return (
    <div ref={ref} className={`reveal-section ${className}`}>
      {children}
    </div>
  );
}

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Integrations', href: '/#integrations' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'For Teams', href: '/#teams' },
];

export function Navbar({ theme, toggleTheme }) {
  return (
    <nav className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="bg-primary text-primary-content rounded-lg w-8 h-8 flex items-center justify-center">
            <Building2 size={16} />
          </div>
          <span className="text-primary font-bold tracking-widest text-sm">
            CALLIO
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-base-content/60 hover:text-base-content transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-base-content"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'corporate' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <Link to="/login" className="btn btn-ghost btn-sm text-sm">
            Log in
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroVisual() {
  return (
    <div className="relative">
      <div className="bg-base-100 border border-base-200 rounded-xl overflow-hidden shadow-lg">
        <div className="px-5 py-3.5 border-b border-base-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs font-medium text-base-content/70">
              Customer Directory
            </span>
          </div>
          <span className="text-[10px] text-base-content/30 font-mono">
            127 leads
          </span>
        </div>

        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-base-200/50 rounded-lg p-3">
              <p className="text-[10px] text-base-content/40 uppercase tracking-wider mb-1">
                This Month
              </p>
              <p className="text-xl font-bold text-base-content">23</p>
              <p className="text-[10px] text-success flex items-center gap-0.5">
                <TrendingUp size={10} />
                +12% vs last month
              </p>
            </div>
            <div className="bg-base-200/50 rounded-lg p-3">
              <p className="text-[10px] text-base-content/40 uppercase tracking-wider mb-1">
                Conversion
              </p>
              <p className="text-xl font-bold text-base-content">34%</p>
              <p className="text-[10px] text-success flex items-center gap-0.5">
                <TrendingUp size={10} />
                +5% vs last month
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              {
                name: 'Ahmad bin Ismail',
                location: 'Mont Kiara',
                budget: 'RM 850K',
                status: 'Booking',
                statusColor: 'badge-success',
              },
              {
                name: 'Lim Wei Ting',
                location: 'Bangsar South',
                budget: 'RM 1.2M',
                status: 'Appointment',
                statusColor: 'badge-info',
              },
              {
                name: 'Priya d/o Rajan',
                location: 'Petaling Jaya',
                budget: 'RM 650K',
                status: 'WhatsApp',
                statusColor: 'badge-primary',
              },
            ].map((lead) => (
              <div
                key={lead.name}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-base-200/30 hover:bg-base-200/60 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                  {lead.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-base-content truncate">
                    {lead.name}
                  </p>
                  <p className="text-[10px] text-base-content/40 flex items-center gap-1">
                    <MapPin size={8} />
                    {lead.location} &middot; {lead.budget}
                  </p>
                </div>
                <span className={`badge ${lead.statusColor} badge-xs`}>
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        className="absolute -bottom-4 -left-4 bg-base-100 border border-base-200 rounded-lg p-3 shadow-md max-w-50"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
            <Mic size={12} className="text-success" />
          </div>
          <span className="text-[10px] font-medium text-base-content/70">
            Call analysed
          </span>
        </div>
        <p className="text-[10px] text-base-content/50 leading-relaxed">
          &quot;Mixed BM-English detected. Sentiment: Positive. Follow up on
          Mont Kiara unit.&quot;
        </p>
      </motion.div>
    </div>
  );
}

function Hero() {
  return (
    <section className="py-16 lg:py-24 bg-base-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.div variants={fadeInUp} className="mb-5">
              <span className="badge badge-primary badge-outline gap-1.5 text-xs">
                <Zap size={12} />
                Built for Malaysian property agents
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl lg:text-5xl font-bold text-base-content leading-tight mb-5"
            >
              Close more deals.
              <br />
              <span className="text-primary">Track every conversation.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-base text-base-content/60 max-w-lg mb-8 leading-relaxed"
            >
              Callio brings your WhatsApp chats, call recordings, and lead
              tracking into one workspace. AI-powered analysis that understands
              BM, English, and Mandarin — even in the same call.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
              <a href="#features" className="btn btn-outline gap-2">
                See how it works
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="hidden lg:block"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { value: '3x', label: 'Faster lead follow-up' },
    { value: '34%', label: 'Average conversion lift' },
    { value: '3', label: 'Languages in one call' },
    { value: '127+', label: 'Agents already onboard' },
  ];

  return (
    <section className="py-12 bg-base-200/50 border-y border-base-200">
      <div className="max-w-6xl mx-auto px-6">
        <RevealSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-base-content/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    icon: MessageSquare,
    title: 'WhatsApp where you work',
    description:
      'Link your WhatsApp, review AI-drafted replies before sending, and keep every conversation attached to the right lead. No switching between apps.',
    accent: 'text-success',
    bg: 'bg-success/5',
  },
  {
    icon: Mic,
    title: 'Call analysis that understands Malaysia',
    description:
      'Record calls and get instant transcriptions, sentiment scores, and next-action suggestions. Works across BM, English, and Mandarin — even when speakers switch mid-sentence.',
    accent: 'text-warning',
    bg: 'bg-warning/5',
  },
  {
    icon: BarChart3,
    title: 'Team performance at a glance',
    description:
      'Leader dashboards with conversion funnels, daily call volume, and regional breakdowns. Spot your top performers and coach the rest.',
    accent: 'text-info',
    bg: 'bg-info/5',
  },
  {
    icon: Sheet,
    title: 'Google Sheets, two-way sync',
    description:
      'Your leads already live in Sheets. Callio syncs both ways — update a status here, it reflects there. No manual data entry, no copy-paste.',
    accent: 'text-secondary',
    bg: 'bg-secondary/5',
  },
];

function Features() {
  return (
    <section id="features" className="py-20 bg-base-100">
      <div className="max-w-6xl mx-auto px-6">
        <RevealSection className="mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            Features
          </p>
          <h2 className="text-3xl font-bold text-base-content mb-3">
            Everything you need to close faster
          </h2>
          <p className="text-base-content/50 max-w-xl">
            Stop juggling five apps. Callio puts your leads, conversations, and
            call insights in one place — so you spend less time admin and more
            time selling.
          </p>
        </RevealSection>

        <div className="grid md:grid-cols-2 gap-5">
          {FEATURES.map((feature) => (
            <RevealSection key={feature.title}>
              <div className="card bg-base-100 border border-base-200 hover:border-base-300 transition-colors">
                <div className="card-body p-6">
                  <div
                    className={`w-10 h-10 rounded-lg ${feature.bg} flex items-center justify-center mb-4`}
                  >
                    <feature.icon size={20} className={feature.accent} />
                  </div>
                  <h3 className="text-lg font-semibold text-base-content mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-base-content/50 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

const INTEGRATIONS = [
  {
    icon: MessageSquare,
    name: 'WhatsApp',
    description:
      'Connect your WhatsApp number and every conversation flows straight into Callio, attached to the right lead automatically.',
  },
  {
    icon: Sheet,
    name: 'Google Sheets',
    description:
      'Already tracking leads in a spreadsheet? Callio syncs both ways so nothing needs to be re-entered by hand.',
  },
];

function Integrations() {
  return (
    <section id="integrations" className="py-20 bg-base-200/50 border-y border-base-200">
      <div className="max-w-6xl mx-auto px-6">
        <RevealSection className="mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            Integrations
          </p>
          <h2 className="text-3xl font-bold text-base-content mb-3">
            Works with the tools you already use
          </h2>
          <p className="text-base-content/50 max-w-xl">
            No need to change how your team communicates or tracks leads
            today — Callio plugs into it.
          </p>
        </RevealSection>

        <div className="grid md:grid-cols-2 gap-5">
          {INTEGRATIONS.map((integration) => (
            <RevealSection key={integration.name}>
              <div className="card bg-base-100 border border-base-200 hover:border-base-300 transition-colors">
                <div className="card-body p-6 flex-row items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <integration.icon size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-base-content mb-2">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-base-content/50 leading-relaxed">
                      {integration.description}
                    </p>
                  </div>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function Spotlight() {
  return (
    <section className="py-20 bg-base-200/50">
      <div className="max-w-6xl mx-auto px-6">
        <RevealSection>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                Malaysian market
              </p>
              <h2 className="text-3xl font-bold text-base-content mb-4">
                One call. Four languages. Zero missed context.
              </h2>
              <p className="text-base-content/50 mb-6 leading-relaxed">
                Malaysian property conversations don&apos;t stick to one
                language. A prospect might open in BM, switch to English for
                pricing, and throw in Mandarin for numbers. Callio&apos;s AI
                captures every word — no matter the mix.
              </p>
              <ul className="space-y-3">
                {[
                  'Auto-detect language switches within a single call',
                  'Accurate transcription across BM, English, Mandarin',
                  'Sentiment analysis that understands local expressions',
                  'Next-action suggestions based on conversation context',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} className="text-primary" />
                    </div>
                    <span className="text-sm text-base-content/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-base-100 border border-base-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Languages size={16} className="text-primary" />
                <span className="text-xs font-medium text-base-content/70">
                  Live transcription
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1 h-full bg-primary/20 rounded-full shrink-0" />
                  <div>
                    <p className="text-xs text-base-content/40 mb-1">
                      Agent — BM + English
                    </p>
                    <p className="text-sm text-base-content/80">
                      &quot;Selamat pagi, saya nak inform yang unit di Mont
                      Kiara tu masih available. Price around RM 850,000.&quot;
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-1 h-full bg-warning/20 rounded-full shrink-0" />
                  <div>
                    <p className="text-xs text-base-content/40 mb-1">
                      Prospect — English + Mandarin
                    </p>
                    <p className="text-sm text-base-content/80">
                      &quot;Okay, the price is a bit high. Can you do RM 八十万?
                      I want to view this weekend.&quot;
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-1 h-full bg-success/20 rounded-full shrink-0" />
                  <div>
                    <p className="text-xs text-base-content/40 mb-1">
                      AI Analysis
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="badge badge-success badge-sm gap-1">
                        <Check size={10} />
                        Positive sentiment
                      </span>
                      <span className="badge badge-warning badge-sm gap-1">
                        <Clock size={10} />
                        Price negotiation
                      </span>
                      <span className="badge badge-info badge-sm gap-1">
                        <MapPin size={10} />
                        Viewing requested
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function Pricing() {
  const addons = [
    {
      name: 'AI Call Analysis',
      price: 'RM 49',
      unit: '/month',
      description:
        '100 call recordings with full transcription and sentiment analysis',
    },
    {
      name: 'Extra Team Seats',
      price: 'RM 29',
      unit: '/seat/month',
      description: 'Add agents to your workspace as your team grows',
    },
    {
      name: 'Priority Support',
      price: 'RM 99',
      unit: '/month',
      description: 'Dedicated account manager and 4-hour response SLA',
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-base-100">
      <div className="max-w-6xl mx-auto px-6">
        <RevealSection className="mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            Pricing
          </p>
          <h2 className="text-3xl font-bold text-base-content mb-3">
            One plan. Add what you need.
          </h2>
          <p className="text-base-content/50 max-w-xl">
            Start with the base plan and scale up as your pipeline grows. No
            hidden fees, no long-term contracts.
          </p>
        </RevealSection>

        <RevealSection>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card bg-base-100 border-2 border-primary">
              <div className="card-body p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-base-content">
                      Callio Base
                    </h3>
                    <p className="text-xs text-base-content/40 mt-1">
                      Everything you need to manage leads
                    </p>
                  </div>
                  <span className="badge badge-primary">Popular</span>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-base-content">
                    RM 79
                  </span>
                  <span className="text-base-content/40 text-sm">/month</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {[
                    'Unlimited lead management',
                    'WhatsApp integration with AI reply review',
                    'Google Sheets two-way sync',
                    'Agent dashboard with key metrics',
                    'Customer status tracking',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Check size={12} className="text-primary" />
                      </div>
                      <span className="text-sm text-base-content/70">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-medium text-base-content/60 mb-2">
                Scale with add-ons
              </p>
              {addons.map((addon) => (
                <div
                  key={addon.name}
                  className="card bg-base-100 border border-base-200 hover:border-base-300 transition-colors"
                >
                  <div className="card-body p-5 flex-row items-center gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-base-content">
                        {addon.name}
                      </h4>
                      <p className="text-xs text-base-content/40 mt-0.5">
                        {addon.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-lg font-bold text-base-content">
                        {addon.price}
                      </span>
                      <span className="text-xs text-base-content/40">
                        {addon.unit}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <a href="#contact" className="btn btn-outline btn-block gap-2">
                  Book a demo for your agency
                  <ChevronRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section id="teams" className="py-20 bg-base-200/50">
      <div className="max-w-6xl mx-auto px-6">
        <RevealSection>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-base-100 border border-base-200 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Users size={16} className="text-primary" />
                  <span className="text-xs font-medium text-base-content/70">
                    Team Leader Dashboard
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Active agents', value: '12' },
                    { label: 'Calls today', value: '47' },
                    { label: 'Bookings', value: '8' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-base-200/50 rounded-lg p-3 text-center"
                    >
                      <p className="text-xl font-bold text-base-content">
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-base-content/40">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {[
                    { name: 'Sarah Chen', calls: 12, bookings: 3 },
                    { name: 'Amir Hassan', calls: 9, bookings: 2 },
                    { name: 'Kavitha Nair', calls: 8, bookings: 1 },
                  ].map((agent) => (
                    <div
                      key={agent.name}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-base-200/30"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-semibold">
                          {agent.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span className="text-xs font-medium text-base-content">
                          {agent.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-base-content/40">
                        <span className="flex items-center gap-1">
                          <Phone size={10} />
                          {agent.calls} calls
                        </span>
                        <span className="flex items-center gap-1 text-success">
                          <TrendingUp size={10} />
                          {agent.bookings} booked
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                For teams & agencies
              </p>
              <h2 className="text-3xl font-bold text-base-content mb-4">
                Lead your team with data, not guesswork
              </h2>
              <p className="text-base-content/50 mb-6 leading-relaxed">
                See who&apos;s calling, who&apos;s converting, and where your
                pipeline is stuck. Team leader dashboards give you the metrics
                to coach effectively and scale your agency.
              </p>
              <ul className="space-y-3">
                {[
                  'Conversion funnels from first call to booking',
                  'Daily call volume and response-time tracking',
                  'Regional lead distribution and performance',
                  'Objection analysis across your team',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} className="text-primary" />
                    </div>
                    <span className="text-sm text-base-content/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

const TEAM_MEMBERS = [
  { name: 'Ze Yan', role: 'Team Lead' },
  { name: 'Izzat', role: 'Team Member' },
  { name: 'Yong Hong', role: 'Team Member' },
  { name: 'Dhanesh', role: 'Team Member' },
  { name: 'Solehah', role: 'Team Member' },
  { name: 'Yang', role: 'Team Member' },
];

function About() {
  return (
    <section id="about" className="py-20 bg-base-100">
      <div className="max-w-6xl mx-auto px-6">
        <RevealSection className="mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            About
          </p>
          <h2 className="text-3xl font-bold text-base-content mb-3">
            Why we built Callio
          </h2>
          <p className="text-base-content/50 max-w-2xl leading-relaxed">
            Malaysian property agents juggle WhatsApp, spreadsheets, and
            phone calls just to keep track of a single lead. Callio brings
            all of that into one workspace — so agents spend less time on
            admin and more time closing deals. This page exists to show you
            what Callio does and how to get started with your own team.
          </p>
        </RevealSection>

        <RevealSection>
          <p className="text-sm font-medium text-base-content/60 mb-4">
            The team
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TEAM_MEMBERS.map((member) => (
              <div
                key={member.name}
                className="card bg-base-100 border border-base-200"
              >
                <div className="card-body p-4 flex-row items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content">
                      {member.name}
                    </p>
                    <p className="text-xs text-base-content/40">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-base-200/50 border-y border-base-200">
      <div className="max-w-6xl mx-auto px-6">
        <RevealSection className="text-center">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
            Contact
          </p>
          <h2 className="text-3xl font-bold text-base-content mb-3">
            Talk to us
          </h2>
          <p className="text-base-content/50 max-w-xl mx-auto mb-8">
            Questions about Callio, or want to book a demo for your agency?
            Reach out directly.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:jane@gmail.com"
              className="card bg-base-100 border border-base-200 hover:border-base-300 transition-colors"
            >
              <div className="card-body p-5 flex-row items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail size={16} className="text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-base-content/40">Email</p>
                  <p className="text-sm font-medium text-base-content">
                    jane@gmail.com
                  </p>
                </div>
              </div>
            </a>

            <a
              href="https://wa.me/60123456789"
              target="_blank"
              rel="noopener noreferrer"
              className="card bg-base-100 border border-base-200 hover:border-base-300 transition-colors"
            >
              <div className="card-body p-5 flex-row items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare size={16} className="text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-base-content/40">WhatsApp</p>
                  <p className="text-sm font-medium text-base-content">
                    012-345 6789
                  </p>
                </div>
              </div>
            </a>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

function BottomCTA() {
  return (
    <section className="py-20 bg-primary text-primary-content">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <RevealSection>
          <h2 className="text-3xl font-bold mb-4">
            Ready to close more deals?
          </h2>
          <p className="text-primary-content/70 mb-8 max-w-lg mx-auto">
            Join Malaysian property agents who use Callio to track leads,
            analyse calls, and grow their pipeline — without the admin overhead.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="#contact"
              className="btn btn-ghost text-primary-content hover:bg-primary-content/10 gap-2"
            >
              Book a demo
            </a>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-base-100 border-t border-base-200 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="bg-primary text-primary-content rounded-lg w-8 h-8 flex items-center justify-center">
                <Building2 size={16} />
              </div>
              <span className="font-bold tracking-widest text-sm">CALLIO</span>
            </div>
            <p className="text-sm text-base-content/50 max-w-sm">
              The CRM built for Malaysian property agents. Manage leads, analyse
              calls, and grow your pipeline — all in one workspace.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-base-content uppercase tracking-wider mb-3">
              Product
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Features', href: '/#features' },
                { label: 'Pricing', href: '/#pricing' },
                { label: 'For Teams', href: '/#teams' },
                { label: 'Integrations', href: '/#integrations' },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-base-content/50 hover:text-base-content transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-base-content uppercase tracking-wider mb-3">
              Company
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#about"
                  className="text-sm text-base-content/50 hover:text-base-content transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/#contact"
                  className="text-sm text-base-content/50 hover:text-base-content transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-base-content/50 hover:text-base-content transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-base-content/50 hover:text-base-content transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-base-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-base-content/40">
            &copy; {new Date().getFullYear()} Callio. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-base-content/40 hover:text-base-content transition-colors"
              aria-label="Twitter"
            >
              <Shield size={16} />
            </a>
            <a
              href="#"
              className="text-base-content/40 hover:text-base-content transition-colors"
              aria-label="LinkedIn"
            >
              <Users size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function LandingPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <StatsBar />
      <Features />
      <Integrations />
      <Spotlight />
      <Pricing />
      <TeamSection />
      <About />
      <ContactSection />
      <BottomCTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
