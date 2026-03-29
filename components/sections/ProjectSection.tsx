import { getProjects } from '@/serverActions/projects.action';
import ProjectsSectionClient from './ProjectSectionClient';


export default async function ProjectsSection() {
  const projects = await getProjects();

  return <ProjectsSectionClient projects={projects} />;
}