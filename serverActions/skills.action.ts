import { connectDB } from '@/lib/mongoclient';
import { Skill } from '@/models/skill.models';



export async function getSkills(): Promise<Skill[]> {
  try {
    const db = await connectDB();

    const skills = await db
      .collection('skills')
      .find({})
      .sort({ display_order: 1 })
      .toArray();

    // Convert _id → id
    const formatted = skills.map((skill:Skill) => ({
      id: skill._id?.toString(),
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      display_order: skill.display_order,
    }));

    

    return formatted;
  } catch (error) {
    console.error('❌ Failed to fetch skills:', error);
    return [];
  }
}