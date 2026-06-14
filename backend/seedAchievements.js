require('dotenv').config();
const mongoose = require('mongoose');
const Achievement = require('./models/Achievement');

const seedAchievements = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await Achievement.countDocuments();
    if (existing > 0) {
      console.log(`Achievements already exist (${existing}). Skipping seed.`);
      await mongoose.disconnect();
      return;
    }

    const achievements = [
      { title: 'Excellence in Digital Asset Advisory', year: '2026', displayOrder: 0 },
      { title: 'Blockchain Innovation Recognition', year: '2025', displayOrder: 1 },
      { title: 'Outstanding Crypto Research Contribution', year: '2025', displayOrder: 2 },
      { title: 'Digital Wealth Strategy Excellence', year: '2024', displayOrder: 3 },
      { title: 'Blockchain Ecosystem Leadership', year: '2024', displayOrder: 4 },
      { title: 'Trusted Investment Advisory Award', year: '2023', displayOrder: 5 },
      { title: 'Emerging FinTech Excellence', year: '2023', displayOrder: 6 },
      { title: 'Strategic Market Analysis Recognition', year: '2022', displayOrder: 7 },
      { title: 'Community Growth & Education Award', year: '2022', displayOrder: 8 },
      { title: 'Excellence in Investor Guidance', year: '2021', displayOrder: 9 },
    ];

    await Achievement.insertMany(achievements);
    console.log(`Seeded ${achievements.length} achievements`);
    await mongoose.disconnect();
    console.log('Done');
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedAchievements();
