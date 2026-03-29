'use client';

import { ContactActionResult, submitContactForm } from '../../serverActions/contact.action';
import { motion, useInView } from 'framer-motion';
import { Mail, Linkedin, Github, Phone, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useRef, useState, useTransition, useEffect } from 'react';
import { useTheme } from 'next-themes';


/* ─── Theme tokens (matches HeroSection / ResumeSection) ─────────────────── */
const T = {
  dark: {
    bg:           '#05050f',
    accent:       '#e2ff5d',
    accent2:      '#00e5ff',
    accent3:      '#a78bfa',
    cardBg:       'rgba(5,5,20,0.75)',
    cardBorder:   'rgba(0,229,255,0.12)',
    inputBg:      'rgba(255,255,255,0.04)',
    inputBorder:  'rgba(255,255,255,0.10)',
    inputFocus:   'rgba(0,229,255,0.35)',
    label:        'rgba(255,255,255,0.45)',
    text:         'rgba(255,255,255,0.85)',
    muted:        'rgba(255,255,255,0.28)',
    scanColor:    'rgba(0,229,255,0.12)',
  },
  light: {
    bg:           'linear-gradient(145deg,#f8faff 0%,#f0f4ff 40%,#fafffe 70%,#f5f8ff 100%)',
    accent:       '#4f46e5',
    accent2:      '#0284c7',
    accent3:      '#7c3aed',
    cardBg:       'rgba(255,255,255,0.82)',
    cardBorder:   'rgba(79,70,229,0.14)',
    inputBg:      'rgba(248,250,255,0.9)',
    inputBorder:  'rgba(79,70,229,0.18)',
    inputFocus:   'rgba(79,70,229,0.40)',
    label:        'rgba(30,30,80,0.5)',
    text:         'rgba(20,20,60,0.9)',
    muted:        'rgba(30,30,80,0.35)',
    scanColor:    'rgba(79,70,229,0.08)',
  },
};

/* ─── CSS ────────────────────────────────────────────────────────────────── */
const CONTACT_CSS = `
  
  .cs-root {  }
  .cs-display {  }
  @keyframes cs-scan { 0%{top:-2px} 100%{top:100%} }
  @keyframes cs-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
  @keyframes cs-fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes cs-shake  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-5px)} 40%{transform:translateX(5px)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }
  .cs-scan-line { position:absolute;left:0;right:0;height:1px;pointer-events:none;animation:cs-scan 10s linear infinite; }

  /* inputs */
  .cs-input {
    width:100%; padding:12px 14px; border-radius:10px; outline:none;
   font-size:13px; font-weight:500;
    transition:border-color .18s, box-shadow .18s, background .18s;
    resize:vertical;
  }
  .cs-input::placeholder { opacity: 0.45; }
  .cs-input:focus { box-shadow: 0 0 0 3px; }

  /* send button */
  .cs-btn-send {
    width:100%; padding:13px 20px; border-radius:11px; border:none; cursor:pointer;
   font-size:13px; font-weight:700;
    letter-spacing:.1em; text-transform:uppercase;
    display:flex; align-items:center; justify-content:center; gap:9px;
    transition:transform .2s, box-shadow .2s, opacity .2s;
    position:relative; overflow:hidden;
  }
  .cs-btn-send:not(:disabled):hover { transform:translateY(-2px); }
  .cs-btn-send:disabled { opacity:.65; cursor:not-allowed; }
  .cs-btn-send::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
    transform:translateX(-100%); transition:transform .4s;
  }
  .cs-btn-send:not(:disabled):hover::before { transform:translateX(100%); }

  /* contact info cards */
  .cs-info-card {
    display:flex; align-items:center; gap:14px;
    padding:14px 16px; border-radius:13px; cursor:pointer;
    text-decoration:none;
    transition:transform .2s, box-shadow .2s, border-color .2s;
  }
  .cs-info-card:hover { transform:translateY(-2px); }

  @media(max-width:900px){ .cs-two-col{ grid-template-columns:1fr !important; } }
`;

/* ─── Contact info items ─────────────────────────────────────────────────── */
const CONTACT_INFO = [
  { icon: Mail,     label: 'Email',    value: 'santramanoj1997@gmail.com',        href: 'mailto:santramanoj1997@gmail.com',              dotColor: '#e2ff5d', lightDot: '#4f46e5' },
  { icon: Phone,    label: 'Phone',    value: '+91 9748159138',                   href: 'tel:+919748159138',                             dotColor: '#00e5ff', lightDot: '#0284c7' },
  { icon: Linkedin, label: 'LinkedIn', value: 'manoj-santra',                     href: 'https://linkedin.com/in/manoj-santra-38ab181ba', dotColor: '#a78bfa', lightDot: '#7c3aed' },
  { icon: Github,   label: 'GitHub',   value: 'manoj19-github',                   href: 'https://github.com/manoj19-github',             dotColor: '#4ade80', lightDot: '#059669' },
];

/* ─── Floating label input ───────────────────────────────────────────────── */
function Field({
  id, label, type = 'text', rows, value, onChange, disabled, isDark,
}: {
  id: string; label: string; type?: string; rows?: number;
  value: string; onChange: (v: string) => void; disabled: boolean; isDark: boolean;
}) {
  const tk = isDark ? T.dark : T.light;
  const Tag = rows ? 'textarea' : 'input';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label htmlFor={id} style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: tk.label,

      }}>
        {label}
      </label>
      <Tag
        id={id}
        className="cs-input"
        type={type}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        disabled={disabled}
        required
        style={{
          background:   tk.inputBg,
          border:       `1.5px solid ${tk.inputBorder}`,
          color:        tk.text,
          minHeight:    rows ? 110 : undefined,
        } as React.CSSProperties}
        onFocus={e => {
          (e.currentTarget as HTMLElement).style.borderColor = tk.accent;
          (e.currentTarget as HTMLElement).style.boxShadow  = `0 0 0 3px ${tk.accent}28`;
        }}
        onBlur={e => {
          (e.currentTarget as HTMLElement).style.borderColor = tk.inputBorder;
          (e.currentTarget as HTMLElement).style.boxShadow  = 'none';
        }}
      />
    </div>
  );
}

/* ─── Main ContactSection ────────────────────────────────────────────────── */
export function ContactSection() {
  const ref      = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // ── Same pattern as HeroSection ──────────────────────────────────────────
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === 'dark' : true;
  // ─────────────────────────────────────────────────────────────────────────

  const tk = isDark ? T.dark : T.light;

  const [form, setForm]              = useState({ name: '', email: '', message: '' });
  const [result, setResult]          = useState<ContactActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const set = (k: keyof typeof form) => (v: string) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    startTransition(async () => {
      const res = await submitContactForm(form);
      setResult(res);
      if (res.success) setForm({ name: '', email: '', message: '' });
    });
  };

  return (
    <>
      <style>{CONTACT_CSS}</style>

      <section
        id="contact"
        ref={ref}
        className="cs-root relative overflow-hidden py-24"
        style={{ background: tk.bg }}
      >
        {/* Scan line */}
        <div
          className="cs-scan-line"
          style={{ background: `linear-gradient(90deg,transparent,${tk.scanColor},transparent)` }}
        />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: isDark
            ? `linear-gradient(rgba(0,229,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.5) 1px,transparent 1px)`
            : `radial-gradient(circle,rgba(99,102,241,0.18) 1px,transparent 1px)`,
          backgroundSize: isDark ? '60px 60px' : '32px 32px',
          opacity: isDark ? 0.03 : 1,
          maskImage: isDark ? undefined : 'radial-gradient(ellipse 80% 80% at 50% 50%,black 30%,transparent 100%)',
        }} />

        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div style={{
            position: 'absolute', top: '10%', left: '5%', width: 400, height: 400,
            borderRadius: '50%',
            background: isDark ? 'rgba(226,255,93,0.05)' : 'rgba(99,102,241,0.08)',
            filter: 'blur(60px)',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', right: '5%', width: 350, height: 350,
            borderRadius: '50%',
            background: isDark ? 'rgba(0,229,255,0.06)' : 'rgba(2,132,199,0.07)',
            filter: 'blur(50px)',
          }} />
        </div>

        {/* Corner brackets */}
        {(
          ['top-8 left-8 border-t-2 border-l-2', 'top-8 right-8 border-t-2 border-r-2',
           'bottom-8 left-8 border-b-2 border-l-2', 'bottom-8 right-8 border-b-2 border-r-2'] as const
        ).map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 + i * 0.08 }}
            className={`absolute w-7 h-7 ${c}`}
            style={{ borderColor: isDark ? 'rgba(0,229,255,0.18)' : 'rgba(79,70,229,0.14)' }}
          />
        ))}

        <div className="relative z-10 w-[95%] mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Heading ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            {/* Badge */}
            <div style={{
              display:        'inline-flex', alignItems: 'center', gap: 8,
              padding:        '5px 16px 5px 10px', borderRadius: 999, marginBottom: 20,
              background:     isDark ? 'rgba(226,255,93,0.06)' : 'rgba(255,255,255,0.82)',
              border:         isDark ? '1px solid rgba(226,255,93,0.2)' : '1px solid rgba(79,70,229,0.15)',
              backdropFilter: 'blur(12px)',
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                background: isDark ? '#e2ff5d' : '#059669',
                animation: 'cs-pulse 2s infinite', display: 'inline-block',
              }} />
              <Mail size={12} style={{ color: tk.accent }} />
              <span style={{
                fontSize: 11,
                color: tk.accent, letterSpacing: '0.1em',
              }}>
                get in touch
              </span>
            </div>

            <h2 className="cs-display" style={{
              fontSize: 'clamp(2.2rem,5.5vw,3.8rem)', fontWeight: 900,
              lineHeight: 1.08, marginBottom: 12,
            }}>
              <span style={{
                color: isDark ? '#e2ff5d' : '#4f46e5',
          
              }}>
                Let&apos;s Work Together
              </span>
            </h2>

            <p style={{
              fontSize: 13,
              color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(30,30,80,0.5)',
              maxWidth: 460, margin: '0 auto',
            }}>
              <span style={{ color: isDark ? 'rgba(0,229,255,0.6)' : 'rgba(79,70,229,0.5)' }}>{'/* '}</span>
              Have a project in mind? Drop me a message — I read every one.
                <span style={{ color: isDark ? 'rgba(0,229,255,0.6)' : 'rgba(79,70,229,0.5)' }}>{'*/ '}</span>
            </p>
          </motion.div>

          {/* ── Two column grid ── */}
          <div
            className="cs-two-col"
            style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 28, alignItems: 'start' }}
          >

            {/* ════ FORM CARD ════ */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{
                padding:        '28px 26px',
                borderRadius:   16,
                border:         `1.5px solid ${tk.cardBorder}`,
                background:     tk.cardBg,
                backdropFilter: 'blur(18px)',
                boxShadow:      isDark
                  ? '0 20px 60px rgba(0,0,0,0.4)'
                  : '0 20px 60px rgba(79,70,229,0.08)',
              }}
            >
              {/* Form header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 22 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: isDark ? 'rgba(226,255,93,0.10)' : 'rgba(79,70,229,0.10)',
                  border:     isDark ? '1px solid rgba(226,255,93,0.22)' : '1px solid rgba(79,70,229,0.20)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Send size={16} style={{ color: tk.accent }} />
                </div>
                <div>
                  <div className="cs-display" style={{
                    fontSize: 16, fontWeight: 800,
                    color: isDark ? '#fff' : '#1e1b4b',
                  }}>
                    Send a Message
                  </div>
                  <div style={{ fontSize: 10, color: tk.muted, letterSpacing: '0.08em' }}>
                    I&apos;ll reply within 24–48 hours
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Field id="cs-name"    label="Your Name"     value={form.name}    onChange={set('name')}    disabled={isPending} isDark={isDark} />
                <Field id="cs-email"   label="Email Address" type="email" value={form.email}   onChange={set('email')}   disabled={isPending} isDark={isDark} />
                <Field id="cs-message" label="Message"       rows={5}     value={form.message} onChange={set('message')} disabled={isPending} isDark={isDark} />

                {/* Result feedback */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display:     'flex', alignItems: 'flex-start', gap: 10,
                      padding:     '12px 14px', borderRadius: 10,
                      background:  result.success
                        ? (isDark ? 'rgba(16,185,129,0.08)'  : 'rgba(5,150,105,0.06)')
                        : (isDark ? 'rgba(220,38,38,0.08)'   : 'rgba(239,68,68,0.06)'),
                      border: `1px solid ${result.success
                        ? (isDark ? 'rgba(16,185,129,0.25)'  : 'rgba(5,150,105,0.22)')
                        : (isDark ? 'rgba(220,38,38,0.25)'   : 'rgba(239,68,68,0.22)')}`,
                      animation: result.success ? undefined : 'cs-shake 0.4s ease',
                    }}
                  >
                    {result.success
                      ? <CheckCircle2 size={15} style={{ color: isDark ? '#34d399' : '#059669', flexShrink: 0, marginTop: 1 }} />
                      : <AlertCircle  size={15} style={{ color: isDark ? '#f87171' : '#dc2626', flexShrink: 0, marginTop: 1 }} />
                    }
                    <span style={{
                      fontSize:   12, lineHeight: 1.6,
                      
                      color:      result.success
                        ? (isDark ? '#34d399' : '#059669')
                        : (isDark ? '#f87171' : '#dc2626'),
                    }}>
                      {result.message}
                    </span>
                  </motion.div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  className="cs-btn-send"
                  disabled={isPending}
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg,rgba(226,255,93,0.16),rgba(0,229,255,0.12))'
                      : 'linear-gradient(135deg,#4f46e5,#0284c7)',
                    color:     isDark ? '#e2ff5d' : '#fff',
                    border:    isDark ? '1px solid rgba(226,255,93,0.30)' : 'none',
                    boxShadow: isDark
                      ? '0 0 28px rgba(226,255,93,0.08)'
                      : '0 6px 24px rgba(79,70,229,0.30)',
                  }}
                >
                  {isPending
                    ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
                    : <><Send size={14} /> Send Message</>
                  }
                </button>
              </form>
            </motion.div>

            {/* ════ INFO CARDS ════ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Availability status */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding:    '16px 18px', borderRadius: 13,
                  background: isDark ? 'rgba(226,255,93,0.05)' : 'rgba(5,150,105,0.05)',
                  border:     isDark ? '1px solid rgba(226,255,93,0.18)' : '1px solid rgba(5,150,105,0.20)',
                  display:    'flex', alignItems: 'center', gap: 12,
                }}
              >
                <span style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: isDark ? '#e2ff5d' : '#10b981',
                  boxShadow:  isDark ? '0 0 8px #e2ff5d' : '0 0 8px #10b981',
                  animation:  'cs-pulse 2s infinite', display: 'inline-block',
                }} />
                <div>
                  <div style={{
                    fontSize: 13, fontWeight: 700,
                    color: isDark ? '#e2ff5d' : '#059669',
                  }}>
                    Available for new projects
                  </div>
                  <div style={{ fontSize: 10, color: tk.muted, marginTop: 2 }}>
                    Open to freelance &amp; full-time opportunities
                  </div>
                </div>
              </motion.div>

              {/* Contact info list */}
              {CONTACT_INFO.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: 24 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="cs-info-card"
                  style={{
                    background:     tk.cardBg,
                    border:         `1.5px solid ${tk.cardBorder}`,
                    backdropFilter: 'blur(14px)',
                    boxShadow:      isDark ? 'none' : '0 2px 16px rgba(0,0,0,0.04)',
                    color:          'inherit',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = isDark
                      ? `${item.dotColor}44`
                      : `${item.lightDot}44`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = tk.cardBorder;
                  }}
                >
                  {/* Icon box */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                    background: isDark ? `${item.dotColor}14` : `${item.lightDot}12`,
                    border:     isDark ? `1.5px solid ${item.dotColor}28` : `1.5px solid ${item.lightDot}22`,
                    display:    'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <item.icon size={18} style={{ color: isDark ? item.dotColor : item.lightDot }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color:         isDark ? item.dotColor : item.lightDot,
                      
                      marginBottom:  3,
                    }}>{item.label}</div>
                    <div style={{
                      fontSize:     13, fontWeight: 600,
                      
                      color:        tk.text,
                      overflow:     'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{item.value}</div>
                  </div>
                  {/* Arrow */}
                  <span style={{ fontSize: 16, color: tk.muted, flexShrink: 0 }}>›</span>
                </motion.a>
              ))}

              {/* Quick note */}
           

            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactSection;