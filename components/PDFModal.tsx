'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download,X as CloseIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// ─── PDF Modal ────────────────────────────────────────────────────────────────
interface PdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  fileName: string;
}

const PdfModal: React.FC<PdfModalProps> = ({ isOpen, onClose, pdfUrl, fileName }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const check = () => setIsSmallScreen(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurred backdrop */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={onClose}
          />

          {/* Modal shell */}
          <div
            className="relative z-10 mx-4 w-full"
            style={{
              maxWidth: 1000,
              height: '92vh',
              outline: 'none',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300, duration: 0.3 }}
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              }}
            >
              {/* ── Gradient Header ── */}
              <div
                className="relative flex items-center justify-between gap-4 flex-shrink-0 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                  color: 'white',
                  padding: '20px',
                }}
              >
                {/* Animated dot-grid pattern */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    opacity: 0.1,
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                  animate={{ backgroundPosition: ['0px 0px', '20px 20px'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />

                {/* File icon + name */}
                <div className="relative flex items-center gap-3 flex-1 overflow-hidden z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                    className="flex-shrink-0"
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="overflow-hidden flex-1"
                  >
                    <p
                      className="font-semibold truncate"
                      style={{
                        fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      {fileName}
                    </p>
                    <p className="text-xs mt-0.5" style={{ opacity: 0.9 }}>Resume Preview</p>
                  </motion.div>
                </div>

                {/* Action buttons */}
                <div className="relative z-10 flex items-center gap-2 flex-shrink-0">
                  {/* Download */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', damping: 15 }}
                    onClick={handleDownload}
                    title="Download"
                    style={{
                      width: 38, height: 38, borderRadius: 8,
                      background: 'rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'white', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.28)' }}
                    whileTap={{ scale: 0.94 }}
                  >
                    <Download size={18} />
                  </motion.button>

                  {/* Close */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35, type: 'spring', damping: 15 }}
                    onClick={onClose}
                    title="Close"
                    style={{
                      width: 38, height: 38, borderRadius: 8,
                      background: 'rgba(239,68,68,0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(239,68,68,0.3)',
                      color: 'white', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.3s ease',
                    }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(239,68,68,0.4)', rotate: 90 }}
                    whileTap={{ scale: 0.94 }}
                  >
                    <CloseIcon size={18} />
                  </motion.button>
                </div>
              </div>

              {/* ── PDF Viewer ── */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#f8fafc',
                }}
              >
                {/* Corner accent — top-left */}
                <div
                  className="absolute top-0 left-0 w-24 h-24 pointer-events-none z-10"
                  style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, transparent 100%)' }}
                />
                {/* Corner accent — bottom-right */}
                <div
                  className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none z-10"
                  style={{ background: 'linear-gradient(-45deg, rgba(59,130,246,0.1) 0%, transparent 100%)' }}
                />

                {/* Worker + Viewer */}
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                  className="
                    [&_.rpv-core\_\_viewer]:bg-[#f8fafc]
                    [&_.rpv-core\_\_inner-pages]:p-5
                    [&_.rpv-default-layout\_\_toolbar]:bg-gradient-to-r
                    [&_.rpv-default-layout\_\_toolbar]:from-[#f1f5f9]
                    [&_.rpv-default-layout\_\_toolbar]:to-[#e2e8f0]
                    [&_.rpv-default-layout\_\_toolbar]:border-b-2
                    [&_.rpv-default-layout\_\_toolbar]:border-[#cbd5e1]
                    [&_.rpv-core\_\_page-layer]:shadow-[0_4px_20px_rgba(0,0,0,0.1)]
                    [&_.rpv-core\_\_page-layer]:rounded-lg
                    [&_.rpv-core\_\_page-layer]:overflow-hidden
                  "
                >
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                    {pdfUrl && (
                      <Viewer
                        fileUrl={pdfUrl}
                        plugins={[defaultLayoutPluginInstance]}
                        defaultScale={isSmallScreen ? 0.75 : 1.0}
                      />
                    )}
                  </Worker>
                </div>
              </motion.div>

              {/* ── Footer ── */}
              <div
                className="flex items-center justify-between flex-shrink-0 px-5 py-3"
                style={{
                  background: 'linear-gradient(to right, #f8fafc, #f1f5f9)',
                  borderTop: '1px solid #e2e8f0',
                  fontSize: 12,
                  color: '#64748b',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2"
                >
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#10b981',
                    display: 'inline-block', animation: 'pulseDot 2s infinite',
                  }} />
                  <span style={{ fontWeight: 500 }}>Document Loaded</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  © {new Date().getFullYear()} Manoj Santra
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};



export default PdfModal;