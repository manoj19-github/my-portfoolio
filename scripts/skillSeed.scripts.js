require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.DATABASE_URL;
console.log('Using DATABASE_URL:', uri);
if (!uri) {
  console.error('❌ DATABASE_URL is not defined in .env');
  process.exit(1);
}

const skills = [
  { name: 'React',        category: 'Frontend',  proficiency: 95, display_order: 1  },
  { name: 'Next.js',      category: 'Frontend',  proficiency: 90, display_order: 2  },
  { name: 'Tailwind CSS', category: 'Frontend',  proficiency: 92, display_order: 3  },
  { name: 'Node.js',      category: 'Backend',   proficiency: 90, display_order: 4  },
  { name: 'Express',      category: 'Backend',   proficiency: 88, display_order: 5  },
  { name: 'Nest.js',      category: 'Backend',   proficiency: 85, display_order: 6  },
  { name: 'React Native', category: 'Mobile',    proficiency: 88, display_order: 7  },
  { name: 'Flutter',      category: 'Mobile',    proficiency: 85, display_order: 8  },
  { name: 'JavaScript',   category: 'Languages', proficiency: 95, display_order: 9  },
  { name: 'Python',       category: 'Languages', proficiency: 80, display_order: 10 },
  { name: 'Dart',         category: 'Languages', proficiency: 83, display_order: 11 },
  { name: 'PHP',          category: 'Languages', proficiency: 75, display_order: 12 },
  { name: 'MongoDB',      category: 'Database',  proficiency: 87, display_order: 13 },
  { name: 'MySQL',        category: 'Database',  proficiency: 82, display_order: 14 },
  { name: 'PostgreSql',   category: 'Database',  proficiency: 90, display_order: 16 },
  { name: 'Git',          category: 'Tools',     proficiency: 90, display_order: 15 },
];

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    // get database name from connection string
    const dbName = new URL(uri).pathname.replace('/', '');
    const db = client.db(dbName);
    const collection = db.collection('skills');

    // clear existing
    const deleted = await collection.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing skills`);

    // bulk insert
    const result = await collection.insertMany(skills);
    console.log(`✅ Inserted ${result.insertedCount} skills successfully`);

    // verify
    const inserted = await collection.find({}).sort({ display_order: 1 }).toArray();
    console.log('\n📋 Inserted skills:');
    inserted.forEach(s => {
      console.log(`   [${s.display_order}] ${s.name} (${s.category}) — ${s.proficiency}%`);
    });

  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

main();