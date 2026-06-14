const Contact = require('../models/Contact');
const Consultation = require('../models/Consultation');

const getAnalytics = async (req, res, next) => {
  try {
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    const buildMonthArray = () => {
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
          month: d.toLocaleString('default', { month: 'short' }),
          year: d.getFullYear(),
          monthNum: d.getMonth() + 1,
          yearNum: d.getFullYear(),
        });
      }
      return months;
    };

    const [contactAgg, consultationAgg, statusAgg, totals] = await Promise.all([
      Contact.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Consultation.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Consultation.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' }, status: '$status' },
            count: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Promise.all([
        Contact.countDocuments(),
        Consultation.countDocuments(),
        Consultation.countDocuments({ status: 'Pending' }),
        Consultation.countDocuments({ status: 'Contacted' }),
        Consultation.countDocuments({ status: 'Converted' }),
        Consultation.countDocuments({ status: 'Rejected' }),
      ]),
    ]);

    const [totalContacts, totalConsultations, pendingCount, contactedCount, convertedCount, rejectedCount] = totals;

    const months = buildMonthArray();

    // Build monthlyLeads (contacts + consultations per month)
    const monthlyLeads = months.map((m) => {
      const c = contactAgg.find((a) => a._id.month === m.monthNum && a._id.year === m.yearNum);
      const co = consultationAgg.find((a) => a._id.month === m.monthNum && a._id.year === m.yearNum);
      return {
        month: m.month,
        contacts: c ? c.count : 0,
        consultations: co ? co.count : 0,
        total: (c ? c.count : 0) + (co ? co.count : 0),
      };
    });

    // Build monthlyConsultations (per month by status)
    const monthlyConsultations = months.map((m) => {
      const pending = statusAgg.find((a) => a._id.month === m.monthNum && a._id.year === m.yearNum && a._id.status === 'Pending');
      const contacted = statusAgg.find((a) => a._id.month === m.monthNum && a._id.year === m.yearNum && a._id.status === 'Contacted');
      const converted = statusAgg.find((a) => a._id.month === m.monthNum && a._id.year === m.yearNum && a._id.status === 'Converted');
      const rejected = statusAgg.find((a) => a._id.month === m.monthNum && a._id.year === m.yearNum && a._id.status === 'Rejected');
      return {
        month: m.month,
        pending: pending ? pending.count : 0,
        contacted: contacted ? contacted.count : 0,
        converted: converted ? converted.count : 0,
        rejected: rejected ? rejected.count : 0,
      };
    });

    res.json({
      success: true,
      data: {
        summary: {
          totalContacts,
          totalConsultations,
          pendingCount,
          contactedCount,
          convertedCount,
          rejectedCount,
          conversionRate: totalConsultations > 0
            ? Math.round((convertedCount / totalConsultations) * 100)
            : 0,
        },
        monthlyLeads,
        monthlyConsultations,
        contactVsConsultation: monthlyLeads.map((m) => ({
          month: m.month,
          contacts: m.contacts,
          consultations: m.consultations,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAnalytics };
