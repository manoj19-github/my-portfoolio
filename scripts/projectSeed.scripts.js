require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.DATABASE_URL;
console.log('uri: ', uri);

if (!uri) {
  console.error('❌ DATABASE_URL is not defined in .env');
  process.exit(1);
}

const projects = [
  {
    title: 'QCBT Examination Platform',
    description:
      'Online & Offline Computer-Based Examination Platform capable of conducting exams for 50,000+ candidates using a distributed local-to-central server architecture.',
    features: [
      'Offline Exam Engine',
      'Secure Question Encryption & Decryption',
      'Timed Exam Execution',
      'Local-to-Central Data Synchronization',
    ],
    tech_stack: ['React.js', 'Zustand', 'Django', 'PostgreSQL'],
    live_url: 'https://qcbt.in',
    github_url: '',
    is_featured: true,
    display_order: 1,
  },
  {
    title: 'Grievance Management System',
    description:
      'Role-based web application for managing citizen grievances with dynamic dashboards and optimized data handling.',
    features: [
      'Role-based Dashboard',
      'Data Visualization with ECharts',
      'Optimized Data Fetching using TanStack Query',
      'Reusable UI Components & Scalable Redux Store',
    ],
    tech_stack: ['React.js', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'ECharts'],
    live_url: 'https://cmo.wb.gov.in',
    github_url: '',
    is_featured: true,
    display_order: 2,
  },
  {
    title: 'Daily Market Price Checker Mobile App For Sufal Bangla',
    description:
      'Mobile application for monitoring daily market prices of agricultural commodities with smooth navigation and performance optimization.',
    features: [
      'Stack & Drawer Navigation',
      'Category-based Product Listing',
      'Real-time Price Monitoring',
      'Optimized Mobile Performance',
    ],
    tech_stack: ['React Native', 'JavaScript'],
    live_url: '',
    github_url: '',
    is_featured: false,
    display_order: 3,
  },
  {
    title: 'SrishtiShree E-commerce Platform',
    description:
      'E-commerce platform to showcase handmade products from rural women with seamless online payment integration.',
    features: [
      'Product Showcase Platform',
      'Razorpay Payment Integration',
      'Responsive UI',
      'Fast Loading Landing Page',
    ],
    tech_stack: ['React.js', 'Tailwind CSS', 'Redux'],
    live_url: 'https://srishtishree.wb.gov.in',
    github_url: '',
    is_featured: true,
    display_order: 4,
  }
];

async function main() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const dbName = new URL(uri).pathname.replace('/', '');
    const db = client.db(dbName);
    const collection = db.collection('projects');

    // clear existing
    const deleted = await collection.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing projects`);

    // insert
    const result = await collection.insertMany(projects);
    console.log(`✅ Inserted ${result.insertedCount} projects successfully`);

    // verify
    const inserted = await collection
      .find({})
      .sort({ display_order: 1 })
      .toArray();

    console.log('\n📋 Inserted projects:');
    inserted.forEach((p) => {
      console.log(
        `   [${p.display_order}] ${p.title} ${
          p.is_featured ? '⭐' : ''
        }`
      );
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