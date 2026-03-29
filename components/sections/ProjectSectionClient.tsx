'use client';

import { motion, useInView } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import { useRef } from 'react';
import { Project } from '@/models/projects.models';


export default function ProjectsSectionClient({
  projects,
}: {
  projects: Project[];
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="projects"
      ref={ref}
      className="py-20 relative overflow-hidden bg-gradient-to-b from-transparent via-blue-500/5 to-transparent"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Featured{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Showcasing my best work in web and mobile development
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-2xl transition-all duration-300 border-2 hover:border-blue-500/50 group flex flex-col">
                
                {/* Title + Badge */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-bold group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>

                    {project.is_featured && (
                      <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Features */}
                {project.features?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2 text-sm">
                      Key Features:
                    </h4>
                    <ul className="space-y-1">
                      {project.features.slice(0, 3).map((feature, i) => (
                        <li
                          key={i}
                          className="text-sm text-muted-foreground flex items-start"
                        >
                          <span className="text-blue-600 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tech Stack */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-auto pt-4 border-t">
                  {project.live_url && (
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                      onClick={() =>
                        window.open(project.live_url!, '_blank')
                      }
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </Button>
                  )}

                  {project.github_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        window.open(project.github_url!, '_blank')
                      }
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}