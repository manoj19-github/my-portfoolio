export type Project = {
  _id?: string;
  title: string;
  description: string;
  features: string[];
  tech_stack: string[];
  live_url?: string;
  github_url?: string;
  is_featured?: boolean;
  display_order: number;
};