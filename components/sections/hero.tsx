'use client';

import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Download, Mail, Terminal, Code2, Zap, GitBranch, Globe, ArrowDown, FileText, X as CloseIcon } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '../ui/button';
import * as React from 'react';
import PdfModal from '../PDFModal';

// ─── PDF Modal ────────────────────────────────────────────────────────────────


// ─── Typing effect ────────────────────────────────────────────────────────────
function useTypingEffect(texts: string[], speed = 60, pause = 1800) {
  const [displayText, setDisplayText] = useState('');
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && charIdx <= current.length) {
      timeout = setTimeout(() => { setDisplayText(current.slice(0, charIdx)); setCharIdx(c => c + 1); }, speed);
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx >= 0) {
      timeout = setTimeout(() => { setDisplayText(current.slice(0, charIdx)); setCharIdx(c => c - 1); }, speed / 2);
    } else {
      setDeleting(false);
      setTextIdx(i => (i + 1) % texts.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  return displayText;
}

// ─── Matrix rain column (dark only) ──────────────────────────────────────────
const CHARS = 'アイウエオカキ01{}[]<>=/\\;:ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function MatrixColumn({ x, delay }: { x: number; delay: number }) {
  const [chars, setChars] = useState<string[]>([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setActive(true);
      setChars(Array.from({ length: Math.floor(Math.random() * 14) + 6 }, () =>
        CHARS[Math.floor(Math.random() * CHARS.length)]));
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => {
      setChars(p => p.map(() => CHARS[Math.floor(Math.random() * CHARS.length)]));
    }, 120);
    return () => clearInterval(iv);
  }, [active]);

  if (!active) return null;
  return (
    <div className="absolute flex flex-col items-center" style={{ left: x, top: 0, gap: 2 }}>
      {chars.map((ch, i) => (
        <span key={i} style={{
          fontFamily: 'monospace', fontSize: 11, lineHeight: '16px',
          color: i === 0 ? '#e2ff5d' : `rgba(0,229,255,${0.6 - i * 0.04})`,
          textShadow: i === 0 ? '0 0 8px #e2ff5d' : i < 3 ? '0 0 4px #00e5ff' : 'none',
        }}>{ch}</span>
      ))}
    </div>
  );
}

// ─── Floating code snippet ────────────────────────────────────────────────────
function FloatingSnippet({ code, x, y, delay, isDark }: {
  code: string; x: string; y: string; delay: number; isDark: boolean;
}) {
  const accent = isDark ? '#e2ff5d' : '#4f46e5';
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      transition={{ delay, duration: 0.5, y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay } }}
      className="absolute hidden xl:block pointer-events-none select-none"
      style={{ left: x, top: y }}
    >
      <div style={{
        padding: '8px 14px', borderRadius: 6, fontSize: 11,
      fontWeight: 500,
        whiteSpace: 'nowrap',
        background: isDark ? 'rgba(5,5,15,0.85)' : 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${accent}28`,
        color: accent,
        boxShadow: isDark
          ? `0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px ${accent}10`
          : `0 4px 20px rgba(0,0,0,0.07), 0 0 0 1px ${accent}10`,
      }}>{code}</div>
    </motion.div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, icon: Icon, color, delay, isDark }: {
  value: string; label: string; icon: any; color: string; delay: number; isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04, y: -3 }}
      className="relative flex flex-col items-center gap-1.5 px-5 py-5 cursor-default group"
      style={{
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(12px)',
        border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)',
        borderRadius: 10,
        boxShadow: isDark ? 'none' : '0 2px 16px rgba(0,0,0,0.05)',
      }}
    >
      <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ borderRadius: 10, background: `radial-gradient(ellipse at center,${color}12,transparent 70%)` }} />
      <Icon className="h-4 w-4" style={{ color }} />
      <span style={{ fontSize: 28, fontWeight: 900, color, lineHeight: 1, textShadow: `0 0 30px ${color}40` }}>
        {value}
      </span>
      <span style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,30,50,0.4)' }}>
        {label}
      </span>
    </motion.div>
  );
}

// ─── Code window ──────────────────────────────────────────────────────────────
function CodeWindow({ isDark }: { isDark: boolean }) {
  const lines = [
    [{ t: 'const ', c: '#7c3aed' }, { t: 'developer', c: isDark ? '#e2e8f0' : '#1e1b4b' }, { t: ' = {', c: '#64748b' }],
    [{ t: '  name:', c: '#94a3b8' }, { t: ' "Manoj Santra"', c: '#059669' }, { t: ',', c: '#64748b' }],
    [{ t: '  role:', c: '#94a3b8' }, { t: ' "Full Stack"', c: '#059669' }, { t: ',', c: '#64748b' }],
    [{ t: '  stack:', c: '#94a3b8' }, { t: ' [', c: '#64748b' }],
    [{ t: '    "React"', c: '#059669' }, { t: ', ', c: '#64748b' }, { t: '"Node.js"', c: '#059669' }, { t: ',', c: '#64748b' }],
    [{ t: '    "TypeScript"', c: '#059669' }, { t: ', ', c: '#64748b' }, { t: '"Next.js"', c: '#059669' }],
    [{ t: '  ],', c: '#64748b' }],
    [{ t: '  experience:', c: '#94a3b8' }, { t: ' "4 years"', c: '#059669' }, { t: ',', c: '#64748b' }],
    [{ t: '  available:', c: '#94a3b8' }, { t: ' true', c: '#d97706' }, { t: ',', c: '#64748b' }],
    [{ t: '};', c: '#64748b' }],
    [],
    [{ t: 'console', c: '#7c3aed' }, { t: '.', c: '#64748b' }, { t: 'log', c: '#0284c7' }, { t: '(', c: '#64748b' }, { t: '"hire me 🚀"', c: '#059669' }, { t: ');', c: '#64748b' }],
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="absolute right-[60px] top-[55%] -translate-y-1/2 hidden xl:block"
    >
      <div style={{
        width: 340,
        background: isDark ? 'rgba(10,10,20,0.85)' : 'rgba(255,255,255,0.84)',
        backdropFilter: 'blur(20px)',
        border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(79,70,229,0.1)',
        borderRadius: 14,
        boxShadow: isDark
          ? '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'
          : '0 24px 64px rgba(0,0,0,0.09), 0 0 0 1px rgba(255,255,255,0.9)',
        overflow: 'hidden',
      }}>
        {/* Window chrome */}
        <div style={{
          padding: '10px 14px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)',
          display: 'flex', alignItems: 'center', gap: 8,
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(248,250,252,0.95)',
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          </div>
          <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono,monospace', color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.28)', marginLeft: 8 }}>developer.ts</span>
        </div>
        {/* Code */}
        <div style={{ padding: '14px 0', fontFamily: 'JetBrains Mono,monospace', fontSize: 12.5, lineHeight: '22px' }}>
          {lines.map((toks, li) => (
            <motion.div key={li} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 + li * 0.06 }}
              style={{ display: 'flex', paddingLeft: 16 }}>
              <span style={{ color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)', width: 24, fontSize: 11, userSelect: 'none' }}>{li + 1}</span>
              <span>{toks.map((tok, ti) => <span key={ti} style={{ color: tok.c }}>{tok.t}</span>)}</span>
            </motion.div>
          ))}
          <div style={{ display: 'flex', paddingLeft: 16 }}>
            <span style={{ color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)', width: 24, fontSize: 11 }}>{lines.length + 1}</span>
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}
              style={{ width: 2, height: 16, background: '#4f46e5', display: 'inline-block', borderRadius: 1 }} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 18 });
  const [columns, setColumns] = useState<{ x: number; delay: number }[]>([]);

  // ─── PDF Modal state ───────────────────────────────────────────────────────
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const RESUME_PDF_URL = '/santra-manoj-2026-resume.pdf'; // place PDF in /public
  const RESUME_FILE_NAME = 'Manoj-Santra-Resume-2026.pdf';

  const roles = ['Full Stack Developer', 'MERN Stack Engineer', 'React Native Builder', 'API Architect', 'UI/UX Craftsman'];
  const typedRole = useTypingEffect(roles, 55, 2000);

  useEffect(() => {
    setMounted(true);
    const cols = Math.floor(window.innerWidth / 38);
    setColumns(Array.from({ length: cols }, (_, i) => ({
      x: i * 38 + Math.random() * 10,
      delay: Math.random() * 6000,
    })));
  }, []);

  const isDark = mounted ? theme === 'dark' : true;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.012);
    mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.012);
  }, [mouseX, mouseY]);

  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  // ── theme tokens ──────────────────────────────────────────────────────────
  const tk = {
    bg:            isDark
      ? '#05050f'
      : 'linear-gradient(145deg,#f8faff 0%,#f0f4ff 40%,#fafffe 70%,#f5f8ff 100%)',
    accent:        isDark ? '#e2ff5d'  : '#4f46e5',
    accent2:       isDark ? '#00e5ff'  : '#0284c7',
    accent3:       isDark ? '#a78bfa'  : '#7c3aed',
    nameGrad:      isDark
      ? 'linear-gradient(135deg,#ffffff 30%,#e2ff5d 60%,#00e5ff 100%)'
      : 'linear-gradient(135deg,#1e1b4b 0%,#4f46e5 38%,#0284c7 65%,#059669 100%)',
    badgeBg:       isDark ? 'rgba(226,255,93,0.06)' : 'rgba(255,255,255,0.82)',
    badgeBorder:   isDark ? 'rgba(226,255,93,0.2)'  : 'rgba(79,70,229,0.15)',
    badgeColor:    isDark ? '#e2ff5d'               : '#4f46e5',
    dotBg:         isDark ? '#e2ff5d'               : '#059669',
    dotShadow:     isDark ? '0 0 8px #e2ff5d'       : '0 0 8px #059669',
    helloColor:    isDark ? 'rgba(255,255,255,0.25)' : 'rgba(30,30,80,0.32)',
    roleColor:     isDark ? '#e2ff5d'               : '#4f46e5',
    cursorColor:   isDark ? '#e2ff5d'               : '#4f46e5',
    descBase:      isDark ? 'rgba(255,255,255,0.35)' : 'rgba(30,30,80,0.42)',
    descComment:   isDark ? 'rgba(0,229,255,0.6)'   : 'rgba(79,70,229,0.5)',
    descHighlight: isDark ? '#a78bfa'               : '#7c3aed',
    descAccent:    isDark ? '#e2ff5d'               : '#059669',
    pillBg:        isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.65)',
    pillBorder:    isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
    pillColor:     isDark ? 'rgba(255,255,255,0.28)' : 'rgba(30,30,60,0.48)',
    cornerBorder:  isDark ? 'rgba(0,229,255,0.2)'   : 'rgba(79,70,229,0.14)',
    blob1:         isDark ? 'rgba(226,255,93,0.07)'  : 'rgba(99,102,241,0.12)',
    blob2:         isDark ? 'rgba(0,229,255,0.08)'   : 'rgba(2,132,199,0.1)',
    blob3:         isDark ? 'rgba(167,139,250,0.06)' : 'rgba(5,150,105,0.07)',
    dotGrid:       isDark
      ? 'rgba(0,229,255,0.6)'
      : 'rgba(99,102,241,0.18)',
    scanColor:     isDark ? 'rgba(0,229,255,0.15)'   : 'rgba(79,70,229,0.1)',
    orbitBorder:   isDark ? 'rgba(0,229,255,0.08)'   : 'rgba(79,70,229,0.08)',
    scrollDot:     isDark ? '#e2ff5d'               : '#4f46e5',
    scrollBorder:  isDark ? 'rgba(255,255,255,0.1)'  : 'rgba(79,70,229,0.2)',
    scrollLabel:   isDark ? 'rgba(255,255,255,0.2)'  : 'rgba(30,30,80,0.25)',
    stat1:         isDark ? '#e2ff5d'               : '#4f46e5',
    stat2:         isDark ? '#00e5ff'               : '#0284c7',
    stat3:         isDark ? '#a78bfa'               : '#059669',
  };

  const snippets = isDark ? [
    { code: 'const dev = new Manoj();',   x: '4%',  y: '22%', delay: 1.2 },
    { code: 'git commit -m "ship it 🚀"', x: '72%', y: '18%', delay: 1.6 },
    { code: 'npm run build --prod',       x: '78%', y: '65%', delay: 2.0 },
    { code: '<Hero animate={true} />',    x: '3%',  y: '70%', delay: 1.4 },
  ] : [
    { code: 'const dev = new Manoj();',   x: '2%',  y: '22%', delay: 1.3 },
    { code: 'git push origin main ✓',     x: '2%',  y: '70%', delay: 1.7 },
    { code: 'npm run build  ✓ 1.2s',      x: '66%', y: '80%', delay: 2.1 },
  ];

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@300;400;500;700&display=swap');
        .hero-display { font-family:'Syne',sans-serif; }
        .hero-mono    { font-family:'JetBrains Mono',monospace; }

        @keyframes shimmerName {
          0%   { background-position:0% 50%; }
          100% { background-position:200% 50%; }
        }
        @keyframes glitch1 {
          0%,100% { clip-path:inset(0 0 98% 0); transform:translateX(0); }
          20%     { clip-path:inset(10% 0 80% 0); transform:translateX(-4px); }
          40%     { clip-path:inset(50% 0 30% 0); transform:translateX(4px); }
          60%     { clip-path:inset(80% 0 5% 0);  transform:translateX(-2px); }
        }
        @keyframes glitch2 {
          0%,100% { clip-path:inset(0 0 98% 0); transform:translateX(0); }
          20%     { clip-path:inset(20% 0 60% 0); transform:translateX(4px); }
          40%     { clip-path:inset(60% 0 20% 0); transform:translateX(-4px); }
          60%     { clip-path:inset(85% 0 3% 0);  transform:translateX(2px); }
        }
        @keyframes scanH { 0%{ top:-2px } 100%{ top:100% } }
        @keyframes pulseDot { 0%,100%{ opacity:1;transform:scale(1) } 50%{ opacity:.4;transform:scale(.75) } }
        @keyframes blink    { 0%,100%{ opacity:1 } 50%{ opacity:0 } }
        @keyframes spinSlow { from{ transform:rotate(0deg) } to{ transform:rotate(360deg) } }

        .name-shimmer {
          background-size:200% auto;
          -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
          animation:shimmerName 7s linear infinite;
        }

        .glitch-dark { position:relative; }
        .glitch-dark::before, .glitch-dark::after {
          content:attr(data-text);
          position:absolute; top:0; left:0; width:100%;
          font-family:inherit; font-size:inherit; font-weight:inherit;
          background:inherit; -webkit-background-clip:text; background-clip:text;
          -webkit-text-fill-color:transparent;
        }
        .glitch-dark::before { color:#00e5ff; -webkit-text-fill-color:#00e5ff99; animation:glitch1 4s infinite; }
        .glitch-dark::after  { color:#ff6b9d; -webkit-text-fill-color:#ff6b9d99; animation:glitch2 4s infinite 0.08s; }

        .cursor-bar {
          display:inline-block; width:2px; height:1em;
          margin-left:3px; vertical-align:middle; border-radius:1px;
          animation:blink 1s step-end infinite;
        }
        .scan-line {
          position:absolute; left:0; right:0; height:1px;
          animation:scanH 9s linear infinite; pointer-events:none;
        }
        .orbit-ring { position:absolute; border-radius:50%; border:1px solid; }

        .cta-dark-primary {
          display:inline-flex; align-items:center; gap:8px;
          padding:14px 28px;
          background:linear-gradient(135deg,#e2ff5d,#a3e635);
          color:#050510;
          font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:700;
          letter-spacing:.15em; text-transform:uppercase;
          border:none; cursor:pointer; overflow:hidden; position:relative;
          clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
          transition:transform .2s,box-shadow .2s;
        }
        .cta-dark-primary:hover { transform:translateY(-2px); box-shadow:0 0 30px #e2ff5d50; }

        .cta-dark-secondary {
          display:inline-flex; align-items:center; gap:8px;
          padding:13px 28px;
          background:transparent; color:#00e5ff;
          font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:500;
          letter-spacing:.15em; text-transform:uppercase;
          border:1px solid rgba(0,229,255,0.3); cursor:pointer; overflow:hidden; position:relative;
          clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
          transition:all .2s;
        }
        .cta-dark-secondary:hover { background:rgba(0,229,255,0.06); border-color:rgba(0,229,255,0.6); transform:translateY(-2px); }

        .cta-light-primary {
          display:inline-flex; align-items:center; gap:8px;
          padding:13px 28px;
          background:linear-gradient(135deg,#4f46e5,#7c3aed); color:white;
          font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600;
          letter-spacing:.1em; text-transform:uppercase;
          border:none; border-radius:8px; cursor:pointer; overflow:hidden; position:relative;
          box-shadow:0 4px 20px rgba(79,70,229,.35);
          transition:transform .2s,box-shadow .2s;
        }
        .cta-light-primary:hover { transform:translateY(-2px); box-shadow:0 8px 30px rgba(79,70,229,.45); }

        .cta-light-secondary {
          display:inline-flex; align-items:center; gap:8px;
          padding:12px 28px;
          background:rgba(255,255,255,.72); backdrop-filter:blur(10px);
          color:#374151;
          font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:500;
          letter-spacing:.1em; text-transform:uppercase;
          border:1px solid rgba(0,0,0,.09); border-radius:8px; cursor:pointer;
          box-shadow:0 2px 10px rgba(0,0,0,.05); transition:all .2s;
        }
        .cta-light-secondary:hover { background:rgba(255,255,255,.96); border-color:rgba(79,70,229,.28); color:#4f46e5; transform:translateY(-2px); }

        .tech-pill {
          font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500;
          letter-spacing:.12em; text-transform:uppercase;
          padding:5px 12px; border-radius:100px; cursor:default;
          transition:all .2s;
        }
      `}</style>

      {/* ─── PDF Resume Modal ─────────────────────────────────────────────────── */}
      <PdfModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        pdfUrl={RESUME_PDF_URL}
        fileName={RESUME_FILE_NAME}
      />

      <section
        id="home"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: tk.bg }}
      >
        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: isDark
            ? `linear-gradient(${tk.dotGrid} 1px,transparent 1px),linear-gradient(90deg,${tk.dotGrid} 1px,transparent 1px)`
            : `radial-gradient(circle,${tk.dotGrid} 1px,transparent 1px)`,
          backgroundSize: isDark ? '60px 60px' : '32px 32px',
          opacity: isDark ? 0.04 : 1,
          maskImage: isDark ? undefined : 'radial-gradient(ellipse 80% 80% at 50% 50%,black 40%,transparent 100%)',
        }} />

        {/* Scan line */}
        <div className="scan-line" style={{ background: `linear-gradient(90deg,transparent,${tk.scanColor},transparent)` }} />

        {/* Parallax blobs */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ x: smoothX, y: smoothY }}>
          <div style={{ position: 'absolute', top: '15%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle,${tk.blob1} 0%,transparent 70%)`, filter: 'blur(50px)' }} />
          <div style={{ position: 'absolute', top: '40%', right: '15%', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle,${tk.blob2} 0%,transparent 70%)`, filter: 'blur(40px)' }} />
          <div style={{ position: 'absolute', bottom: '20%', left: '30%', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle,${tk.blob3} 0%,transparent 70%)`, filter: 'blur(35px)' }} />
        </motion.div>

        {/* Matrix rain — dark only */}
        {isDark && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            {mounted && columns.map((col, i) => <MatrixColumn key={i} x={col.x} delay={col.delay} />)}
          </div>
        )}

        {/* Orbit rings — light only */}
        {!isDark && [200, 340, 480].map((size, i) => (
          <div key={i} className="orbit-ring" style={{
            width: size, height: size,
            top: `calc(50% - ${size / 2}px)`, left: `calc(50% - ${size / 2}px)`,
            borderColor: tk.orbitBorder,
            opacity: 0.4 - i * 0.1,
            animation: `spinSlow ${30 + i * 15}s linear infinite`,
            borderStyle: i === 1 ? 'dashed' : 'solid',
          }} />
        ))}

        {/* Floating snippets */}
        {snippets.map((s, i) => <FloatingSnippet key={i} code={s.code} x={s.x} y={s.y} delay={s.delay} isDark={isDark} />)}

        {/* Code window */}
        <CodeWindow isDark={isDark} />

        {/* Corner brackets */}
        {[['top-6 left-6', 'border-t-2 border-l-2'], ['top-6 right-6', 'border-t-2 border-r-2'], ['bottom-6 left-6', 'border-b-2 border-l-2'], ['bottom-6 right-6', 'border-b-2 border-r-2']].map(([pos, borders], i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * .1 }}
            className={`absolute ${pos} w-7 h-7 ${borders}`} style={{ borderColor: tk.cornerBorder }} />
        ))}

        {/* Main content */}
        <div className={`relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center xl:text-left ${isDark ? 'xl:max-w-5xl' : 'xl:mr-[380px]'}`}>

          {/* Status badge */}
          <motion.div initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, ease: [.16, 1, .3, 1] }}
            className="flex justify-center xl:justify-start mb-8 mt-20">
            <div className="text-[11px] flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{ background: tk.badgeBg, backdropFilter: 'blur(12px)', border: `1px solid ${tk.badgeBorder}`, color: tk.badgeColor, letterSpacing: '0.08em' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: tk.dotBg, boxShadow: tk.dotShadow, display: 'inline-block', animation: 'pulseDot 2s infinite' }} />
              <Terminal className="h-3 w-3 inline" />
              {isDark ? '~/portfolio $ whoami' : 'Available for hire · Open to work'}
            </div>
          </motion.div>

          {/* Hello */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-blue-600 dark:text-blue-400 font-medium mb-4 mt-8"
              >
                Hi, I&apos;m
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
                  Manoj Santra
                </span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-4xl font-semibold mb-6 text-muted-foreground"
              >
                MERN Stack Developer
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg sm:text-xl max-w-3xl mx-auto mb-8 text-muted-foreground leading-relaxed"
              >
                Full Stack Developer specializing in scalable web & mobile
                applications with 4 years of professional experience
              </motion.p>

              {/* ─── CTA Buttons (top block) — View Projects · Get in Touch · View Resume ─── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button
                  size="lg"
                  onClick={scrollToProjects}
                  className="bg-gradient-to-r from-blue-600 !cursor-pointer to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg"
                >
                  View Projects
                  <ArrowDown className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={scrollToContact}
                  className="border-2 px-8 py-6 text-lg  !cursor-pointer"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Get in Touch
                </Button>
                {/* ── View Resume button ── */}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsResumeModalOpen(true)}
                  className="border-2 px-8 py-6 text-lg !cursor-pointer"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  View Resume
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Typing role */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .52 }}
            className="flex items-center justify-center xl:justify-start gap-3 mb-6 mt-10">
            <div className="h-px w-8" style={{ background: `linear-gradient(90deg,${tk.accent},transparent)` }} />
            <span className="hero-mono text-base sm:text-xl font-medium" style={{ color: tk.roleColor }}>
              {typedRole}
              <span className="cursor-bar" style={{ background: tk.cursorColor }} />
            </span>
          </motion.div>

          {/* Description */}
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .62 }}
            className="hero-mono text-sm sm:text-base max-w-xl mx-auto xl:mx-0 mb-10 leading-loose"
            style={{ color: tk.descBase, fontWeight: 300 }}>
            <span style={{ color: tk.descComment }}>{'// '}</span>
            Building scalable web &amp; mobile apps with{' '}
            <span style={{ color: tk.descHighlight, fontWeight: 500 }}>4 years</span> of professional experience.
            {' '}Turning caffeine into{' '}
            <span style={{ color: tk.descAccent, fontWeight: 500 }}>clean code</span> since 2020.
          </motion.p>

          {/* ─── CTAs (bottom block, dark/light themed) — same 3 buttons ─────── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .74, ease: [.16, 1, .3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4 mb-14">
            {isDark ? (
              <>
                <motion.button whileTap={{ scale: .96 }} className="cta-dark-primary" onClick={() => scrollTo('#projects')}>
                  <Code2 className="h-4 w-4" /> View Projects
                  <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.4 }} />
                </motion.button>
                <motion.button whileTap={{ scale: .96 }} className="cta-dark-secondary" onClick={() => scrollTo('#contact')}>
                  <Mail className="h-4 w-4" /> Get in Touch
                </motion.button>
                <motion.button whileTap={{ scale: .96 }} className="cta-dark-secondary" onClick={() => setIsResumeModalOpen(true)}>
                  <FileText className="h-4 w-4" /> View Resume
                </motion.button>
              </>
            ) : (
              <>
                <motion.button whileTap={{ scale: .96 }} className="cta-light-primary" onClick={() => scrollTo('#projects')}>
                  <Code2 className="h-4 w-4" /> View Projects
                  <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }} whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
                </motion.button>
                <motion.button whileTap={{ scale: .96 }} className="cta-light-secondary" onClick={() => scrollTo('#contact')}>
                  <Mail className="h-4 w-4" /> Get in Touch
                </motion.button>
                <motion.button whileTap={{ scale: .96 }} className="cta-light-secondary" onClick={() => setIsResumeModalOpen(true)}>
                  <FileText className="h-4 w-4" /> View Resume
                </motion.button>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .85 }}
            className="grid grid-cols-3 gap-10 w-full xl:mx-0 mt-32 mb-20">
            <StatCard value="4+"   label="Yrs Exp"  icon={Zap}       color={tk.stat1} delay={0.9}  isDark={isDark} />
            <StatCard value="50K+" label="Users"    icon={Globe}     color={tk.stat2} delay={1.0}  isDark={isDark} />
            <StatCard value="15+"  label="Projects" icon={GitBranch} color={tk.stat3} delay={1.1}  isDark={isDark} />
          </motion.div>

        </div>
      </section>
    </>
  );
}


export default HeroSection;