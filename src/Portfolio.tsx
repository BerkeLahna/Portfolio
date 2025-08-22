import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, ArrowDown, ExternalLink, Play, Pause } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

// -------------------------
// Helper: sample data (customize)
// -------------------------
const PROJECTS = [
  {
    id: 1,
    title: "Transit Insights Dashboard",
    category: "Development",
    description:
      "A real-time metro and bus analytics dashboard with map overlays, filters, and performance charts.",
    tech: ["React", "Node", "PostGIS"],
    image: "data:image/svg+xml;utf8,\
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>\
        <defs>\
          <linearGradient id='g' x1='0' x2='1'>\
            <stop offset='0%' stop-color='%231e293b'/>\
            <stop offset='100%' stop-color='%230a0f1f'/>\
          </linearGradient>\
        </defs>\
        <rect width='800' height='500' fill='url(%23g)'/>\
        <g fill='none' stroke='%2345ffce' stroke-width='3' opacity='0.8'>\
          <polyline points='0,420 120,380 240,390 360,340 480,360 600,310 720,330 800,280'/>\
          <circle cx='360' cy='340' r='5' fill='%2345ffce'/>\
          <circle cx='600' cy='310' r='5' fill='%2345ffce'/>\
        </g>\
        <text x='40' y='70' fill='%23d1fae5' font-family='Inter, sans-serif' font-size='36'>Transit Insights</text>\
      </svg>",
    link: "#",
  },
  {
    id: 2,
    title: "E‑Commerce Starter",
    category: "Web Design",
    description:
      "Responsive storefront with product grid, search, cart flow, and accessible components.",
    tech: ["Next.js", "Tailwind", "Stripe"],
    image: "data:image/svg+xml;utf8,\
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>\
        <defs>\
          <linearGradient id='p' x1='0' x2='1'>\
            <stop offset='0%' stop-color='%231a1a1a'/>\
            <stop offset='100%' stop-color='%230d0d0d'/>\
          </linearGradient>\
        </defs>\
        <rect width='800' height='500' fill='url(%23p)'/>\
        <rect x='60' y='80' width='300' height='160' fill='%23222' rx='12'/>\
        <rect x='420' y='80' width='300' height='160' fill='%23222' rx='12'/>\
        <rect x='60' y='270' width='660' height='150' fill='%23222' rx='12'/>\
        <text x='80' y='140' fill='%23ffd1f7' font-size='28' font-family='Inter, sans-serif'>Hero</text>\
        <text x='440' y='140' fill='%2345ffce' font-size='28' font-family='Inter, sans-serif'>Cards</text>\
        <text x='80' y='340' fill='%23c7d2fe' font-size='28' font-family='Inter, sans-serif'>Grid</text>\
      </svg>",
    link: "#",
  },
  {
    id: 3,
    title: "UX Research Notes",
    category: "UX/UI",
    description:
      "Interactive research repository with tags, heatmaps, and insight synthesis boards.",
    tech: ["Svelte", "Firebase"],
    image: "data:image/svg+xml;utf8,\
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>\
        <rect width='800' height='500' fill='%230b1220'/>\
        <g stroke='%23c7d2fe' stroke-width='3' fill='none'>\
          <rect x='80' y='80' width='640' height='340' rx='16'/>\
          <circle cx='200' cy='180' r='40'/>\
          <circle cx='400' cy='240' r='60'/>\
          <circle cx='600' cy='200' r='30'/>\
        </g>\
        <text x='100' y='120' fill='%23ffd1f7' font-size='32' font-family='Inter, sans-serif'>UX Research</text>\
      </svg>",
    link: "#",
  },
  {
    id: 4,
    title: "Realtime Chat",
    category: "Development",
    description:
      "End‑to‑end encrypted chat with presence, typing indicators, and optimistic UI.",
    tech: ["React", "WebSocket", "Zustand"],
    image: "data:image/svg+xml;utf8,\
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500'>\
        <rect width='800' height='500' fill='%230a0f1f'/>\
        <g fill='%2345ffce'>\
          <rect x='130' y='120' width='540' height='40' rx='8' opacity='0.6'/>\
          <rect x='130' y='190' width='320' height='40' rx='8' opacity='0.9'/>\
          <rect x='130' y='260' width='470' height='40' rx='8' opacity='0.7'/>\
        </g>\
        <text x='130' y='90' fill='%23c7d2fe' font-size='30' font-family='Inter, sans-serif'>Chat UI</text>\
      </svg>",
    link: "#",
  },
];

const SKILLS = [
  { name: "JavaScript", level: 88, blurb: "6 projects, heavy on React + tooling." },
  { name: "React", level: 86, blurb: "Hooks, state mgmt, perf patterns." },
  { name: "Node.js", level: 74, blurb: "REST APIs, auth, queues, caching." },
  { name: "UI/UX", level: 70, blurb: "Figma to code, accessibility first." },
  { name: "DevOps", level: 55, blurb: "Docker, CI, preview envs." },
];

const TESTIMONIALS = [
  {
    quote:
      "Delivers clean, scalable frontends with excellent attention to details and performance.",
    name: "A. Kaya",
    role: "Senior Engineer",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=kaya",
  },
  {
    quote:
      "Understands product needs and translates them into delightful interactions.",
    name: "M. Demir",
    role: "Product Manager",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=demir",
  },
  {
    quote:
      "Reliable teammate—ship dates met, code reviews solid, docs on point.",
    name: "Z. Arslan",
    role: "Tech Lead",
    avatar: "https://api.dicebear.com/7.x/notionists/svg?seed=arslan",
  },
];

const CATEGORIES = ["All", "Web Design", "Development", "UX/UI"] as const;

// -------------------------
// Hooks & Utils
// -------------------------
const useInViewOnce = (threshold = 0.2) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    if (!ref.current || isInView) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [isInView, threshold]);
  return { ref, isInView } as const;
};

// Micro glow utility
const Glow = ({ className = "" }) => (
  <div
    className={`pointer-events-none absolute -inset-32 opacity-25 blur-3xl ${className}`}
    style={{
      background:
        "radial-gradient(600px circle at 20% 10%, rgba(69,255,206,.55), transparent 40%), radial-gradient(600px circle at 80% 20%, rgba(199,210,254,.25), transparent 35%), radial-gradient(600px circle at 50% 80%, rgba(255,209,247,.35), transparent 40%)",
    }}
  />
);

// Floating particles in hero
const Particles = ({ count = 24 }) => {
  const particles = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 3 + Math.random() * 6,
      delay: Math.random() * 6,
      duration: 12 + Math.random() * 12,
      blur: Math.random() > 0.6 ? 4 : 0,
    })), [count]);
  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute top-full rounded-full bg-white/30"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            filter: p.blur ? `blur(${p.blur}px)` : undefined,
            animation: `floatUp ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};

// Button
const CTA = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <a
    href={href}
    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-base font-semibold text-white shadow-xl shadow-black/30 backdrop-blur transition-transform duration-300 hover:scale-105 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
  >
    {children}
  </a>
);

// Badge
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide text-white/80">
    {children}
  </span>
);

// Modal for projects
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-6"
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-xl"
      >
        {children}
      </motion.div>
    </div>
  );
}

// Sticky footer reveal on scroll down
function useScrollDirection() {
  const [dir, setDir] = useState<"up" | "down">("up");
  const last = useRef<number>(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setDir(y > last.current ? "down" : "up");
      last.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return dir;
}

// -------------------------
// Main Page
// -------------------------
export default function Portfolio() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Parallax for hero background
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -120]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.05]);

  const [activeCat, setActiveCat] = useState<(typeof CATEGORIES)[number]>("All");
  const filtered = PROJECTS.filter((p) => activeCat === "All" || p.category === activeCat);

  const [modalProject, setModalProject] = useState<typeof PROJECTS[number] | null>(null);

  const dir = useScrollDirection();

  // Contact form state (no backend—demo only)
  const [sending, setSending] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    alert("Thanks! Your message has been queued.");
  };

  // Testimonials autoplay
  const [idx, setIdx] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % TESTIMONIALS.length), 3500);
    return () => clearInterval(id);
  }, [autoPlay]);

  return (
    <div className="relative min-h-screen scroll-smooth bg-slate-950 font-[Inter,ui-sans-serif,system-ui] text-slate-100 selection:bg-cyan-300/30">
      <style>{`
        :root { --accent: #45ffce; --accent2: #ffd1f7; --accent3:#c7d2fe; }
        html, body, #root { height: 100%; }
        @keyframes floatUp { from { transform: translateY(0); } to { transform: translateY(-120vh); } }
        .text-gradient { background: linear-gradient(90deg, var(--accent), var(--accent2), var(--accent3)); -webkit-background-clip:text; background-clip:text; color: transparent; }
      `}</style>

      {/* Top Nav */}
      <header className="fixed inset-x-0 top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-900/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#home" className="text-sm tracking-wider text-white/80 hover:text-white">PORTFOLIO</a>
          <nav className="hidden gap-6 md:flex">
            {[
              ["About", "#about"],
              ["Work", "#work"],
              ["Skills", "#skills"],
              ["Testimonials", "#testimonials"],
              ["Contact", "#contact"],
            ].map(([label, link]) => (
              <a
                key={label}
                href={link}
                className="text-sm text-white/70 transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              aria-label="GitHub"
              href="#"
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 transition hover:scale-105 hover:text-white"
            >
              <Github size={18} />
            </a>
            <a
              aria-label="LinkedIn"
              href="#"
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 transition hover:scale-105 hover:text-white"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="home" className="relative grid min-h-screen place-items-center overflow-hidden">
        <Glow />
        <motion.div style={{ y, scale }} className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(1200px circle at 20% 20%, rgba(69,255,206,.12), transparent 35%), radial-gradient(1200px circle at 90% 10%, rgba(199,210,254,.10), transparent 35%), linear-gradient(180deg, #0b1220 0%, #05080f 100%)",
            }}
          />
          <Particles />
        </motion.div>

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 pt-28 text-center">
          <Badge>Available for freelance & full‑time</Badge>
          <h1 className="text-balance text-5xl font-black tracking-tight sm:text-6xl md:text-7xl">
            Hi, I'm <span className="text-gradient">Your Name</span><br />
            <span className="text-white/80">a Creative Web Developer</span>
          </h1>
          <p className="max-w-2xl text-lg text-white/70">
            I craft fast, accessible interfaces and rich interactions—bringing ideas to life with clean code and modern aesthetics.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <CTA href="#work">See My Work</CTA>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-cyan-500/30 transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              Contact Me <ArrowDown size={18} />
            </a>
          </div>
          <div className="mt-8 flex items-center gap-3 text-xs text-white/60">
            <span className="h-1 w-1 rounded-full bg-[var(--accent)]"></span>
            Smooth scroll • Parallax • Micro‑interactions
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="relative mx-auto max-w-6xl px-6 py-24 sm:py-28">
        <div className="grid items-center gap-12 md:grid-cols-[320px,1fr]">
          <div className="group relative mx-auto h-64 w-64 overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-[6px] shadow-2xl">
            <div className="absolute inset-0 -z-10 rounded-full opacity-40 blur-2xl" style={{ background: "conic-gradient(from 0deg, var(--accent), var(--accent2), var(--accent3), var(--accent))" }} />
            <div className="h-full w-full overflow-hidden rounded-full bg-slate-900">
              {/* Portrait placeholder */}
              <div className="grid h-full w-full place-items-center">
                <div className="text-6xl font-black text-white/80">YL</div>
              </div>
            </div>
            {/* 3D tilt on hover */}
            <div className="pointer-events-none absolute inset-0 rounded-full transition-transform duration-500 group-hover:[transform:rotateX(12deg)_rotateY(-12deg)]" />
          </div>

          <AboutReveal />
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Selected Work</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeCat === c
                    ? "bg-white/10 text-white"
                    : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl"
            >
              <div className="aspect-[4/2.5] overflow-hidden">
                <img
                  src={p.image}
                  alt="Project thumbnail"
                  loading="lazy"
                  className="h-full w-full transform-gpu object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2 text-xs text-white/60">
                  <Badge>{p.category}</Badge>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{p.tech.join(" · ")}</span>
                </div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-white/70">{p.description}</p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={() => setModalProject(p)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:scale-[1.02] hover:bg-white/10"
                  >
                    View Details <ExternalLink size={16} />
                  </button>
                  <a
                    href={p.link}
                    className="text-sm text-[var(--accent)] underline-offset-4 hover:underline"
                  >
                    Live
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="relative mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-10 text-3xl font-bold tracking-tight sm:text-4xl">Skills</h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Radial chart cloud */}
          <div className="relative rounded-3xl border border-white/10 bg-white/5 p-6">
            <h3 className="mb-4 text-lg font-semibold">Proficiency Snapshot</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <RadialBarChart innerRadius="30%" outerRadius="100%" data={SKILLS.map((s) => ({ name: s.name, level: s.level }))}>
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar dataKey="level" cornerRadius={8} background={{ fill: "#0f172a" }} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-3 text-sm text-white/70">Animated on mount. Hover individual skills on the right for details.</p>
          </div>

          {/* Bars with hover blurbs */}
          <div className="space-y-4">
            {SKILLS.map((s, i) => (
              <SkillBar key={s.name} delay={i * 0.1} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="relative mx-auto max-w-6xl px-6 py-24">
        <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Testimonials</h2>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-white/60">Swipe (drag) or use controls</div>
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10"
              onClick={() => setAutoPlay((a) => !a)}
            >
              {autoPlay ? <Pause size={16} /> : <Play size={16} />} {autoPlay ? "Pause" : "Play"}
            </button>
          </div>

          <motion.div
            drag="x"
            dragConstraints={{ left: -40, right: 40 }}
            className="relative"
          >
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="grid gap-6 sm:grid-cols-[80px,1fr]"
            >
              <img
                src={TESTIMONIALS[idx].avatar}
                alt="Avatar"
                className="h-20 w-20 rounded-full border border-white/10"
              />
              <blockquote>
                <p className="text-lg leading-relaxed text-white/90">“{TESTIMONIALS[idx].quote}”</p>
                <footer className="mt-3 text-sm text-white/70">
                  {TESTIMONIALS[idx].name} • {TESTIMONIALS[idx].role}
                </footer>
              </blockquote>
            </motion.div>
          </motion.div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-2 w-2 rounded-full transition ${i === idx ? "bg-[var(--accent)]" : "bg-white/30"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative mx-auto max-w-7xl px-6 py-24">
        <h2 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Get in touch</h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr,520px]">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input required name="name" className="input" placeholder="Your name" />
              </Field>
              <Field label="Email">
                <input required type="email" name="email" className="input" placeholder="you@example.com" />
              </Field>
              <Field label="Subject" className="sm:col-span-2">
                <input required name="subject" className="input" placeholder="Let's build something" />
              </Field>
              <Field label="Message" className="sm:col-span-2">
                <textarea required name="message" className="input min-h-[140px]" placeholder="Tell me about your project" />
              </Field>
            </div>
            <div className="mt-5 flex items-center justify-between gap-3 text-sm text-white/60">
              <div className="flex items-center gap-2"><Mail size={16} /> you@domain.com</div>
              <button
                type="submit"
                disabled={sending}
                className="rounded-xl bg-[var(--accent)] px-5 py-3 font-semibold text-slate-900 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Sending…" : "Send Message"}
              </button>
            </div>
          </motion.form>

          {/* Interactive map (zoom on hover/click) */}
          <InteractiveMap />
        </div>
      </section>

      {/* FOOTER (sticky reveal) */}
      <footer
        className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-500 ${
          dir === "down" ? "translate-y-0" : "translate-y-[70%]"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 pb-4">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-white/70">© {new Date().getFullYear()} Your Name — All rights reserved.</p>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 transition hover:scale-105 hover:text-white"
                  aria-label="GitHub"
                >
                  <Github size={18} />
                </a>
                <a
                  href="#"
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 transition hover:scale-105 hover:text-white"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="#contact"
                  className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/80 transition hover:scale-105 hover:text-white"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Project modal */}
      <Modal open={!!modalProject} onClose={() => setModalProject(null)}>
        {modalProject && (
          <div className="grid gap-0 sm:grid-cols-[1.2fr,1fr]">
            <img src={modalProject.image} alt="Project" className="h-full w-full object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold">{modalProject.title}</h3>
              <p className="mt-2 text-sm text-white/70">{modalProject.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
                {modalProject.tech.map((t) => (
                  <Badge key={t}>{t}</Badge>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-3">
                <a
                  href={modalProject.link}
                  className="rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-slate-900"
                >
                  Open Live
                </a>
                <button
                  onClick={() => setModalProject(null)}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// -------------------------
// Subcomponents
// -------------------------
function AboutReveal() {
  const { ref, isInView } = useInViewOnce(0.3);
  return (
    <div ref={ref} className="space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold sm:text-4xl"
      >
        About Me
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.05 }}
        className="text-white/80"
      >
        I'm a developer focused on building immersive, performant web experiences. I combine strong fundamentals with thoughtful design to ship delightful products.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {[
          ["Location", <span className="inline-flex items-center gap-2" key="loc"><MapPin size={16} /> Türkiye</span>],
          ["Focus", "Frontend • Interaction • Performance"],
          ["Stack", "React, TypeScript, Node, Tailwind"],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
            <div className="text-xs uppercase tracking-wider text-white/60">{label}</div>
            <div className="mt-1 text-white">{value as React.ReactNode}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`space-y-1 ${className}`}>
      <span className="text-xs uppercase tracking-wider text-white/60">{label}</span>
      {children}
      <style>{`
        .input { width: 100%; border-radius: 0.9rem; padding: 0.9rem 1rem; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: white; outline: none; }
        .input:focus { border-color: rgba(69,255,206,.7); box-shadow: 0 0 0 3px rgba(69,255,206,.2); }
      `}</style>
    </label>
  );
}

function SkillBar({ name, level, blurb, delay = 0 }: { name: string; level: number; blurb: string; delay?: number }) {
  const { ref, isInView } = useInViewOnce(0.3);
  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{name}</span>
        <span className="text-white/60">{level}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${level}%` } : {}}
          transition={{ duration: 0.8, delay }}
          className="h-full rounded-full bg-[var(--accent)]"
        />
      </div>
      <div className="mt-2 text-xs text-white/70">{blurb}</div>
    </div>
  );
}

function InteractiveMap() {
  const [zoomed, setZoomed] = useState(false);
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="absolute right-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1 text-xs text-white/80">
        Hover or click to zoom
      </div>
      <div className="relative aspect-[4/3] w-full">
        {/* <iframe
          title="Map"
          loading="lazy"
          src="https://www.google.com/maps?q=Istanbul%2C%20Turkey&z=6&output=embed"
          className={`absolute inset-0 h-full w-full origin-center transition-transform duration-700 ${
            zoomed ? "scale-125" : "group-hover:scale-110"
          }`}
          style={{ filter: "grayscale(40%) contrast(110%) brightness(90%)" }}
        /> */}
        <button
          onClick={() => setZoomed((z) => !z)}
          className="absolute inset-0"
          aria-label="Toggle map zoom"
        />
      </div>
      <div className="flex items-center justify-between p-4 text-sm text-white/70">
        <div className="inline-flex items-center gap-2"><MapPin size={16} /> Istanbul, TR</div>
        <a href="#contact" className="text-[var(--accent)] underline-offset-4 hover:underline">
          Plan a coffee chat
        </a>
      </div>
    </div>
  );
}
