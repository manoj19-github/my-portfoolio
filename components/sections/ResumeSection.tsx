'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Download, FileText, MapPin, Mail, Phone, Globe, Github, Linkedin, Award, Briefcase, GraduationCap, Code2, X as CloseIcon, ExternalLink } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import * as React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { useTheme } from 'next-themes';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

/* ─── Config — edit these ─────────────────────────────────────────────────── */
const RESUME_PDF_URL  = '/santra-manoj-2026-resume.pdf';
const RESUME_FILENAME = 'Manoj-Santra-Resume-2026.pdf';

const PROFILE = {
  name:     'Manoj Santra',
  title:    'Full Stack Developer',
  location: 'West Bengal, India',
  email:    'santramanoj1997@gmail.com',
  phone:    '+919748159138',
  github:   'github.com/manoj19-github',
  linkedin: 'linkedin.com/in/manoj-santra-38ab181ba/',
};

const HIGHLIGHTS = [
  { icon: Briefcase,     label: 'Experience',  value: '4+ Years',     color: '#e2ff5d', darkOnly: true,  lightColor: '#4f46e5' },
  { icon: Code2,         label: 'Projects',    value: '15+',          color: '#00e5ff', darkOnly: true,  lightColor: '#0284c7' },
  { icon: Award,         label: 'Users Served',value: '50K+',         color: '#a78bfa', darkOnly: true,  lightColor: '#7c3aed' },
  { icon: GraduationCap, label: 'Role',   value: 'Full Stack Dev',   color: '#4ade80', darkOnly: true,  lightColor: '#059669' },
];

const SKILLS_SUMMARY = [
  { group: 'Frontend',  items: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
  { group: 'Backend',   items: ['Django & Python','Node.js', 'Express', 'REST APIs', 'GraphQL'] },
  { group: 'Mobile',    items: ['React Native', 'Flutter'] },
  { group: 'Database',  items: ['PostgreSQL',, 'MongoDB', 'Redis', 'Prisma'] },
];

// const EXPERIENCE_PEEK = [
//   { role: 'Full Stack Developer', company: 'TechCorp Pvt. Ltd.', period: '2022 – Present',  current: true },
//   { role: 'React Developer',      company: 'StartupXYZ',          period: '2021 – 2022',     current: false },
//   { role: 'MERN Intern',          company: 'WebSolutions Co.',     period: '2020 – 2021',     current: false },
// ];

/* ─── CSS injected once ───────────────────────────────────────────────────── */
const SECTION_CSS = `
  

  .rs-root {  }
  .rs-display { }

  @keyframes rs-fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rs-scanH    { 0%{top:-2px} 100%{top:100%} }
  @keyframes rs-blink    { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes rs-pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
  @keyframes rs-glitch1  { 0%,100%{clip-path:inset(0 0 98% 0);transform:translateX(0)} 20%{clip-path:inset(10% 0 80% 0);transform:translateX(-3px)} 60%{clip-path:inset(80% 0 5% 0);transform:translateX(-2px)} }
  @keyframes rs-glitch2  { 0%,100%{clip-path:inset(0 0 98% 0);transform:translateX(0)} 20%{clip-path:inset(20% 0 60% 0);transform:translateX(3px)} 60%{clip-path:inset(85% 0 3% 0);transform:translateX(2px)} }

  .rs-scan-line { position:absolute;left:0;right:0;height:1px;pointer-events:none;animation:rs-scanH 10s linear infinite; }
  .rs-cursor    { display:inline-block;width:2px;height:1em;margin-left:3px;vertical-align:middle;border-radius:1px;animation:rs-blink 1s step-end infinite; }

  /* ── Viewer theming ── */
  .rs-pdf-wrap [class*="rpv-core__viewer"]        { background: transparent !important; }
  .rs-pdf-wrap [class*="rpv-core__inner-pages"]   { padding: 12px !important; }
  .rs-pdf-wrap [class*="rpv-default-layout__toolbar"] { background: transparent !important; border-bottom: 1px solid rgba(255,255,255,0.08) !important; }
  .rs-pdf-wrap [class*="rpv-core__page-layer"]    { border-radius: 6px !important; overflow: hidden !important; }

  /* dark mode toolbar text */
  .rs-pdf-dark [class*="rpv-toolbar__item"] svg   { fill: rgba(255,255,255,0.7) !important; }
  .rs-pdf-dark [class*="rpv-core__textbox"]       { color: #fff !important; background: rgba(255,255,255,0.08) !important; border-color: rgba(255,255,255,0.15) !important; }
`;

/* ─── Inline PDF Viewer panel ─────────────────────────────────────────────── */
function PdfPanel({ isDark }: { isDark: boolean }) {
  const pluginInstance  = defaultLayoutPlugin();
  const [loaded, setLoaded] = useState(false);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const check = () => setIsSmall(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href     = RESUME_PDF_URL;
    a.download = RESUME_FILENAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div  style={{
      display:       'flex',
      flexDirection: 'column',
      borderRadius:  16,
      overflow:      'hidden',
      border:        isDark ? '1px solid rgba(0,229,255,0.15)' : '1px solid rgba(79,70,229,0.15)',
      boxShadow:     isDark
        ? '0 0 0 1px rgba(0,229,255,0.05), 0 20px 60px rgba(0,0,0,0.5)'
        : '0 20px 60px rgba(79,70,229,0.1), 0 0 0 1px rgba(79,70,229,0.06)',
      height:        '90vh',
      minHeight:     520,
      background:    isDark ? 'rgba(5,5,20,0.85)' : 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(20px)',
    }}>

      {/* ── Panel header ── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '12px 16px',
        borderBottom:   isDark ? '1px solid rgba(0,229,255,0.10)' : '1px solid rgba(79,70,229,0.10)',
        background:     isDark ? 'rgba(0,229,255,0.03)' : 'rgba(79,70,229,0.03)',
        flexShrink:     0,
      }}>
        {/* Mac-style dots */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
          ))}
          <span style={{
            marginLeft:     10,
            fontSize:       11,
            
            color:          isDark ? 'rgba(0,229,255,0.5)' : 'rgba(79,70,229,0.5)',
            letterSpacing:  '0.08em',
          }}>
            {RESUME_FILENAME}
          </span>
        </div>

        {/* Status + download */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#10b981',
              display: 'inline-block',
              animation: 'rs-pulseDot 2s infinite',
            }} />
            {/* <span style={{
              fontSize: 10,
              color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
              letterSpacing: '0.08em',
            }}>LIVE</span> */}
          </div>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleDownload}
            style={{
              display:    'flex', alignItems: 'center', gap: 6,
              padding:    '5px 12px', borderRadius: 6, cursor: 'pointer', border: 'none',
              background: isDark ? 'rgba(226,255,93,0.12)' : 'rgba(79,70,229,0.10)',
              color:      isDark ? '#e2ff5d' : '#4f46e5',
              fontSize:   11, 
              fontWeight: 600, letterSpacing: '0.08em',
            }}
          >
            <Download size={12} />
            DOWNLOAD
          </motion.button>
        </div>
      </div>

      {/* ── PDF viewer ── */}
      <div
        className={`rs-pdf-wrap${isDark ? ' rs-pdf-dark' : ''}`}
        style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
      >
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
          <Viewer
            fileUrl={RESUME_PDF_URL}
            plugins={[pluginInstance]}
            defaultScale={isSmall ? 0.9 : 0.9}
          />
        </Worker>
      </div>
    </div>
  );
}

/* ─── Highlight card ──────────────────────────────────────────────────────── */
function HighlightCard({
  icon: Icon, label, value, color, delay, isDark,
}: {
  icon: any; label: string; value: string; color: string; delay: number; isDark: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.04, y: -2 }}
      style={{
        padding:     '16px 14px',
        borderRadius: 12,
        border:      isDark
          ? `1px solid ${color}22`
          : '1px solid rgba(79,70,229,0.12)',
        background:  isDark ? `${color}08` : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(12px)',
        display:     'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        cursor:      'default',
        boxShadow:   isDark ? 'none' : '0 2px 16px rgba(0,0,0,0.05)',
      }}
    >
      <Icon size={16} style={{ color }} />
      <span style={{
        fontSize:   22, fontWeight: 900,
        
        color,
        lineHeight: 1,
      }}>{value}</span>
      <span style={{
        fontSize:      9, letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color:         isDark ? 'rgba(255,255,255,0.28)' : 'rgba(30,30,80,0.4)',
        
      }}>{label}</span>
    </motion.div>
  );
}

/* ─── Contact chip ────────────────────────────────────────────────────────── */
function ContactChip({ icon: Icon, text, href, isDark, accent }: {
  icon: any; text: string; href?: string; isDark: boolean; accent: string;
}) {
  const inner = (
    <div style={{
      display:     'flex', alignItems: 'center', gap: 7,
      padding:     '7px 13px', borderRadius: 999,
      border:      isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(79,70,229,0.14)',
      background:  isDark ? 'rgba(255,255,255,0.04)' : 'rgba(79,70,229,0.04)',
      fontSize:    11,
      
      color:       isDark ? 'rgba(255,255,255,0.55)' : 'rgba(30,30,80,0.6)',
      cursor:      href ? 'pointer' : 'default',
      transition:  'all 0.18s',
      whiteSpace:  'nowrap',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = isDark ? accent + '55' : 'rgba(79,70,229,0.35)';
      (e.currentTarget as HTMLDivElement).style.color       = accent;
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(79,70,229,0.14)';
      (e.currentTarget as HTMLDivElement).style.color       = isDark ? 'rgba(255,255,255,0.55)' : 'rgba(30,30,80,0.6)';
    }}
    >
      <Icon size={12} style={{ color: accent, flexShrink: 0 }} />
      {text}
      {href && <ExternalLink size={10} style={{ opacity: 0.5 }} />}
    </div>
  );
  return href ? <a href={href} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>{inner}</a> : inner;
}

/* ─── Skill group pill ────────────────────────────────────────────────────── */
function SkillGroup({ group, items, isDark, accent, delay }: {
  group: string; items: string[]; isDark: boolean; accent: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ marginBottom: 10 }}
    >
      <div style={{
        fontSize:   9, fontWeight: 700, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: accent,
        
        marginBottom: 6,
      }}>{group}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {items.map(s => (
          <span key={s} style={{
            fontSize:   10, 
            padding:    '3px 9px', borderRadius: 999,
            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(79,70,229,0.06)',
            border:     isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(79,70,229,0.14)',
            color:      isDark ? 'rgba(255,255,255,0.6)' : 'rgba(30,30,80,0.65)',
          }}>{s}</span>
        ))}
      </div>
    </motion.div>
  );
}



/* ─── Main ResumeSection ──────────────────────────────────────────────────── */
export function ResumeSection() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  const isDark = mounted ? theme === 'dark' : true;

  const accent  = isDark ? '#e2ff5d' : '#4f46e5';
  const accent2 = isDark ? '#00e5ff' : '#0284c7';
  const accent3 = isDark ? '#a78bfa' : '#7c3aed';

  const sectionBg = isDark
    ? '#05050f'
    : 'linear-gradient(145deg,#f8faff 0%,#f0f4ff 40%,#fafffe 70%,#f5f8ff 100%)';

  return (
    <>
      <style>{SECTION_CSS}</style>

      <section
        id="resume"
        className="rs-root relative overflow-hidden py-24 "
        style={{ background: sectionBg }}
      >
        {/* Scan line */}
        <div
          className="rs-scan-line"
          style={{ background: `linear-gradient(90deg,transparent,${isDark ? 'rgba(0,229,255,0.12)' : 'rgba(79,70,229,0.08)'},transparent)` }}
        />

        {/* Background dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: isDark
            ? `linear-gradient(rgba(0,229,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.6) 1px,transparent 1px)`
            : `radial-gradient(circle,rgba(99,102,241,0.18) 1px,transparent 1px)`,
          backgroundSize: isDark ? '60px 60px' : '32px 32px',
          opacity:        isDark ? 0.03 : 1,
          maskImage:      isDark ? undefined : 'radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)',
        }} />

        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{ position:'absolute', top:'10%', right:'5%', width:400, height:400, borderRadius:'50%', background: isDark?'rgba(226,255,93,0.05)':'rgba(99,102,241,0.09)', filter:'blur(60px)' }}/>
          <div style={{ position:'absolute', bottom:'15%', left:'5%', width:350, height:350, borderRadius:'50%', background: isDark?'rgba(0,229,255,0.06)':'rgba(2,132,199,0.07)', filter:'blur(50px)' }}/>
        </div>

        {/* Corner brackets */}
        {(['top-8 left-8 border-t-2 border-l-2','top-8 right-8 border-t-2 border-r-2','bottom-8 left-8 border-b-2 border-l-2','bottom-8 right-8 border-b-2 border-r-2'] as const).map((cls, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className={`absolute w-7 h-7 ${cls}`}
            style={{ borderColor: isDark ? 'rgba(0,229,255,0.18)' : 'rgba(79,70,229,0.14)' }}
          />
        ))}

        <div className="relative z-10 w-[98%] mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Section heading ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            {/* Badge */}
            <div style={{
              display:       'inline-flex', alignItems: 'center', gap: 8,
              padding:       '5px 16px 5px 10px',
              borderRadius:  999, marginBottom: 20,
              background:    isDark ? 'rgba(226,255,93,0.06)' : 'rgba(255,255,255,0.82)',
              border:        isDark ? '1px solid rgba(226,255,93,0.2)' : '1px solid rgba(79,70,229,0.15)',
              backdropFilter: 'blur(12px)',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                background: isDark ? '#e2ff5d' : '#059669',
                animation: 'rs-pulseDot 2s infinite',
                display: 'inline-block',
              }} />
              <FileText size={12} style={{ color: accent }} />
              <span style={{
                fontSize: 11, 
                color: accent, letterSpacing: '0.1em',
              }}>curriculum vitae</span>
            </div>

            {/* Heading */}
            <h2
              className="rs-display"
              style={{
                fontSize:   'clamp(2.4rem, 6vw, 4rem)',
                fontWeight: 900, lineHeight: 1.08,
                marginBottom: 14,
              }}
            >
              <span style={{
                // background: isDark
                //   ? 'linear-gradient(135deg,#ffffff 30%,#e2ff5d 65%,#00e5ff 100%)'
                //   : 'linear-gradient(135deg,#5545E6 30%,#5545E6 65%,#00e5ff 100%)',
                // WebkitBackgroundClip: isDark ? 'text' : 'text',
                // WebkitTextFillColor: isDark ? 'transparent' : '#5545E6',
                // backgroundClip:   isDark ? 'text' : 'text',
                color: isDark ? '#e2ff5d' : '#4f46e5',
          
              }}>
                My Resume
              </span>
            </h2>

            <p style={{
              fontSize:   14, lineHeight: 1.8,
              
              color:      isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,30,80,0.5)',
              maxWidth:   520, margin: '0 auto',
            }}>
              {/* <span style={{ color: isDark ? 'rgba(0,229,255,0.6)' : 'rgba(79,70,229,0.5)' }}>{'// '}</span> */}
              <span style={{ color: accent }}>view or download</span> the full document
            </p>
          </motion.div>

          {/* ── Two-col layout: sidebar | PDF viewer ── */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)',
            gap:                 16,
            alignItems:          'start',
            
          }}
          className="flex-col-on-mobile"
          >
            {/* ════ LEFT SIDEBAR ════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* ── Identity card ── */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding:    '20px 18px',
                  borderRadius: 14,
                  border:     isDark ? '1px solid rgba(0,229,255,0.12)' : '1px solid rgba(79,70,229,0.12)',
                  background: isDark ? 'rgba(5,5,20,0.7)' : 'rgba(255,255,255,0.72)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                {/* Avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                    background: isDark
                      ? 'linear-gradient(135deg,rgba(226,255,93,0.15),rgba(0,229,255,0.12))'
                      : 'linear-gradient(135deg,rgba(79,70,229,0.15),rgba(2,132,199,0.12))',
                    border:    isDark ? '1.5px solid rgba(226,255,93,0.25)' : '1.5px solid rgba(79,70,229,0.22)',
                    display:   'flex', alignItems: 'center', justifyContent: 'center',
                     fontWeight: 900, fontSize: 18,
                    color:     accent,
                    letterSpacing: '-1px',
                  }}>
                    MS
                  </div>
                  <div>
                    <div className="rs-display" style={{
                      fontSize: 18, fontWeight: 800,
                      color:    isDark ? '#fff' : '#1e1b4b',
                      letterSpacing: '-0.02em',
                    }}>{PROFILE.name}</div>
                    <div style={{
                      fontSize: 11, 
                      color: accent, marginTop: 2,
                    }}>{PROFILE.title}</div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(79,70,229,0.07)', marginBottom: 14 }} />

                {/* Contact chips */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  <ContactChip icon={MapPin}   text={PROFILE.location} isDark={isDark} accent={accent} />
                  <ContactChip icon={Mail}     text={PROFILE.email}    isDark={isDark} accent={accent} href={`mailto:${PROFILE.email}`} />
                  <ContactChip icon={Phone}    text={PROFILE.phone}    isDark={isDark} accent={accent} />
                  {/* <ContactChip icon={Globe}    text={PROFILE.website}  isDark={isDark} accent={accent2} href={`https://${PROFILE.website}`} /> */}
                  <ContactChip icon={Github}   text={PROFILE.github}   isDark={isDark} accent={accent2} href={`https://${PROFILE.github}`} />
                  <ContactChip icon={Linkedin} text={PROFILE.linkedin} isDark={isDark} accent={accent3} href={`https://${PROFILE.linkedin}`} />
                </div>
              </motion.div>

              {/* ── Stats grid ── */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {HIGHLIGHTS.map((h, i) => (
                  <HighlightCard
                    key={h.label}
                    icon={h.icon}
                    label={h.label}
                    value={h.value}
                    color={isDark ? h.color : h.lightColor}
                    delay={0.3 + i * 0.08}
                    isDark={isDark}
                  />
                ))}
              </div>

              {/* ── Skills summary ── */}
              {/* <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                style={{
                  padding:    '18px 16px',
                  borderRadius: 14,
                  border:     isDark ? '1px solid rgba(0,229,255,0.10)' : '1px solid rgba(79,70,229,0.10)',
                  background: isDark ? 'rgba(5,5,20,0.6)' : 'rgba(255,255,255,0.65)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <div style={{
                  fontSize:   9, fontWeight: 800, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: accent2,
                  
                  marginBottom: 14,
                }}>Tech Stack</div>
                {SKILLS_SUMMARY.map((s, i) => (
                  <SkillGroup key={s.group} group={s.group} items={s.items} isDark={isDark} accent={accent} delay={0.45 + i * 0.06} />
                ))}
              </motion.div> */}

              {/* ── Experience peek ── */}
              {/* <motion.div
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                style={{
                  padding:    '18px 16px',
                  borderRadius: 14,
                  border:     isDark ? '1px solid rgba(167,139,250,0.14)' : '1px solid rgba(124,58,237,0.12)',
                  background: isDark ? 'rgba(5,5,20,0.6)' : 'rgba(255,255,255,0.65)',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <div style={{
                  fontSize:   9, fontWeight: 800, letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: accent3,
                  
                  marginBottom: 14,
                }}>Experience</div>
                {EXPERIENCE_PEEK.map((e, i) => (
                  <ExperienceRow
                    key={i}
                    {...e}
                    isDark={isDark}
                    accent={accent}
                    delay={0.5 + i * 0.07}
                  />
                ))}
              </motion.div> */}

              {/* ── Download CTA ── */}
              <motion.a
                href={RESUME_PDF_URL}
                download={RESUME_FILENAME}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display:        'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding:        '13px 20px',
                  borderRadius:   12, textDecoration: 'none',
                  background:     isDark
                    ? 'linear-gradient(135deg,rgba(226,255,93,0.15),rgba(0,229,255,0.10))'
                    : 'linear-gradient(135deg,#4f46e5,#0284c7)',
                  border:         isDark ? '1px solid rgba(226,255,93,0.28)' : 'none',
                  color:          isDark ? '#e2ff5d' : '#fff',
                  
                  fontSize:       12, fontWeight: 700,
                  letterSpacing:  '0.12em', textTransform: 'uppercase',
                  boxShadow:      isDark
                    ? '0 0 30px rgba(226,255,93,0.08)'
                    : '0 6px 24px rgba(79,70,229,0.28)',
                }}
              >
                <Download size={14} />
                Download PDF Resume
              </motion.a>

            </div>{/* end sidebar */}

            {/* ════ RIGHT — PDF VIEWER ════ */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <PdfPanel isDark={isDark} />

              {/* Quick note below viewer */}
              <div style={{
                marginTop:  12, textAlign: 'center',
                fontSize:   10, 
                letterSpacing: '0.08em',
                color:      isDark ? 'rgba(255,255,255,0.18)' : 'rgba(30,30,80,0.28)',
              }}>
                Use the toolbar to zoom · navigate pages · or{' '}
                <a
                  href={RESUME_PDF_URL} download={RESUME_FILENAME}
                  style={{ color: accent, textDecoration: 'none' }}
                >
                  download
                </a>
                {' '}the full PDF
              </div>
            </motion.div>

          </div>{/* end grid */}

        </div>{/* end container */}
      </section>

      {/* ── Responsive collapse ── */}
      <style>{`
        @media (max-width: 900px) {
          .flex-col-on-mobile {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

export default ResumeSection;