'use client';

import { motion, useInView } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRef } from 'react';
import { Skill } from '@/models/skill.models';



export default function SkillsSectionClient({
  skills,
}: {
  skills: Skill[];
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const categories = [
    { name: 'Frontend', color: 'from-blue-500 to-cyan-500' },
    { name: 'Backend', color: 'from-cyan-500 to-teal-500' },
    { name: 'Mobile', color: 'from-teal-500 to-green-500' },
    { name: 'Languages', color: 'from-green-500 to-emerald-500' },
    { name: 'Database', color: 'from-emerald-500 to-lime-500' },
    { name: 'Tools', color: 'from-orange-500 to-red-500' },
  ];

  const getSkillsByCategory = (category: string) => {
    return skills.filter((skill) => skill.category === category);
  };

  return (
    <section id="skills" ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/5 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Technical{' '}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Skills
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Expertise across multiple technologies and frameworks
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const categorySkills = getSkillsByCategory(category.name);
            if (categorySkills.length === 0) return null;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500/50">
                  <div className="mb-4">
                    <div
                      className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${category.color} text-white font-semibold`}
                    >
                      {category.name}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {categorySkills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.1 + skillIndex * 0.05,
                        }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {skill.proficiency}%
                          </span>
                        </div>

                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={
                              isInView
                                ? { width: `${skill.proficiency}%` }
                                : {}
                            }
                            transition={{
                              duration: 1,
                              delay: index * 0.1 + skillIndex * 0.05,
                            }}
                            className={`h-full bg-gradient-to-r ${category.color}`}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {skills.slice(0, 10).map((skill) => (
              <Badge
                key={skill._id}
                variant="secondary"
                className="px-4 py-2 text-sm hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
              >
                {skill.name}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}