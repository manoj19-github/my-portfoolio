import { connectDB } from '@/lib/mongoclient';
import { Project } from '@/models/projects.models';

export async function getProjects(): Promise<any[]> {
  try {
    const db = await connectDB();

    const projects = await db
      .collection('projects')
      .find({})
      .sort({ display_order: 1 })
      .toArray();

    const formatted = projects.map((project: Project) => ({
      id: project._id?.toString(),
      title: project.title,
      description: project.description,
      features: project.features || [],
      tech_stack: project.tech_stack || [],
      live_url: project.live_url || null,
      github_url: project.github_url || null,
      is_featured: project.is_featured || false,
      display_order: project.display_order,
    }));
    return formatted;
  } catch (error) {
    console.error('❌ Failed to fetch projects:', error);
    return [];
  }
}