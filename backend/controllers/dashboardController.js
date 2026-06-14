const Consultation = require('../models/Consultation');
const Contact = require('../models/Contact');

const getMonthlyStats = async () => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [contactAgg, consultationAgg] = await Promise.all([
    Contact.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Consultation.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: d.toLocaleString('default', { month: 'short' }),
      year: d.getFullYear(),
      monthNum: d.getMonth() + 1,
      yearNum: d.getFullYear(),
      contacts: 0,
      consultations: 0,
    });
  }

  contactAgg.forEach((s) => {
    const m = months.find((m) => m.monthNum === s._id.month && m.yearNum === s._id.year);
    if (m) m.contacts = s.count;
  });

  consultationAgg.forEach((s) => {
    const m = months.find((m) => m.monthNum === s._id.month && m.yearNum === s._id.year);
    if (m) m.consultations = s.count;
  });

  return months;
};

const getDashboard = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalContacts,
      totalConsultations,
      todayContacts,
      todayConsultations,
      recentContacts,
      recentConsultations,
      monthlyStats,
    ] = await Promise.all([
      Contact.countDocuments(),
      Consultation.countDocuments(),
      Contact.countDocuments({ createdAt: { $gte: startOfToday } }),
      Consultation.countDocuments({ createdAt: { $gte: startOfToday } }),
      Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
      Consultation.find().sort({ createdAt: -1 }).limit(5).lean(),
      getMonthlyStats(),
    ]);

    const recentActivity = [
      ...recentContacts.map((c) => ({ ...c, type: 'contact' })),
      ...recentConsultations.map((c) => ({ ...c, type: 'consultation' })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        totalContacts,
        totalConsultations,
        todayLeads: todayContacts + todayConsultations,
        recentActivity,
        leadStatistics: monthlyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
