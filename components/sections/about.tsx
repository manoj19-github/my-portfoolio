'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Code, Smartphone, Server, Award } from 'lucide-react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const highlights = [
    {
      icon: Award,
      title: '4 Years',
      subtitle: 'Professional Experience',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Code,
      title: 'MERN Stack',
      subtitle: 'Full Stack Expertise',
      color: 'from-cyan-500 to-teal-500',
    },
    {
      icon: Smartphone,
      title: 'Mobile Dev',
      subtitle: 'Flutter & React Native',
      color: 'from-teal-500 to-green-500',
    },
    {
      icon: Server,
      title: 'Backend',
      subtitle: 'Node.js & Python',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="py-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            About <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Me</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
            I am a skilled Software Developer at{' '}
            <a href="https://www.msqube.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold">
              MSQUBE Technology Solutions PVT LTD
            </a>{' '}
            with nearly four years of experience in the MERN stack domain.
            I specialize in building efficient, scalable, and user-friendly web
            and mobile applications using modern technologies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 hover:border-blue-500/50">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.subtitle}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <Card className="p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <h3 className="text-2xl font-bold mb-4">Current Role</h3>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-blue-600">
                Senior Software Developer
              </p>
              <a
                href="https://www.msqube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground !cursor-pointer hover:text-blue-600 transition-colors"
              >
                MSQUBE Technology Solutions PVT LTD
              </a>
              <p className="text-sm text-muted-foreground">
                Feb 2023 - Present
              </p>
              <p className="mt-4 leading-relaxed">
                Leading development of enterprise-scale applications including a
                Computer-Based Examination Platform serving 50,000+ candidates,
                Grievance Management System, and various e-commerce solutions.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
