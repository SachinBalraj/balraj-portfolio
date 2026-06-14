require('dotenv').config();
const mongoose = require('mongoose');
const TeamCategory = require('./models/TeamCategory');

const seedTeam = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await TeamCategory.countDocuments();
    if (existing > 0) {
      console.log(`Team data already exists (${existing} categories). Skipping seed.`);
      await mongoose.disconnect();
      return;
    }

    const categories = [
      {
        categoryName: 'Millineral',
        order: 0,
        description: 'Responsible for research, ecosystem analysis, and identifying strategic opportunities for growth and development.',
        members: [
          { name: 'Michael Chen' },
          { name: 'Sarah Williams' },
          { name: 'David Kumar' },
          { name: 'Emily Rodriguez' },
          { name: 'James Thompson' },
        ],
      },
      {
        categoryName: 'Builder',
        order: 1,
        description: 'Focused on creating infrastructure, improving systems, and supporting long-term ecosystem expansion.',
        members: [
          { name: 'Alex Johnson' },
          { name: 'Priya Sharma' },
          { name: 'Ryan Mitchell' },
          { name: 'Lisa Anderson' },
        ],
      },
      {
        categoryName: 'Converter',
        order: 2,
        description: 'Works on adoption initiatives, user engagement, and transforming ideas into practical applications.',
        members: [
          { name: 'Daniel Lee' },
          { name: 'Maria Garcia' },
          { name: 'Kevin O\'Brien' },
        ],
      },
      {
        categoryName: 'Beliver',
        order: 3,
        description: 'Supports community growth, ecosystem advocacy, and long-term vision alignment.',
        members: [
          { name: 'Sophie Martin' },
          { name: 'Raj Patel' },
        ],
      },
      {
        categoryName: 'Desider',
        order: 4,
        description: 'Responsible for planning, decision-making, and identifying future opportunities within the ecosystem.',
        members: [
          { name: 'Chris Evans' },
        ],
      },
    ];

    await TeamCategory.insertMany(categories);
    console.log(`Seeded ${categories.length} team categories with members`);
    await mongoose.disconnect();
    console.log('Done');
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedTeam();
