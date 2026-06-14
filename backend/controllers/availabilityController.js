const Availability = require('../models/Availability');
const { getDefaultSlots, mapSlot } = require('../utils/availability');

const getAvailabilityByDate = async (req, res, next) => {
  try {
    const { date } = req.params;

    let availability = await Availability.findOne({ date });

    if (!availability) {
      availability = await Availability.create({
        date,
        slots: getDefaultSlots(),
      });
    }

    const slots = availability.slots.map(mapSlot);
    const availableCount = slots.filter((s) => s.status === 'available').length;
    const bookedCount = slots.filter((s) => s.status === 'booked').length;
    const blockedCount = slots.filter((s) => s.status === 'blocked').length;

    res.json({
      success: true,
      data: {
        date: availability.date,
        totalSlots: slots.length,
        availableCount,
        bookedCount,
        blockedCount,
        slots,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMonthAvailability = async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const start = `${prefix}-01`;
    const end = `${prefix}-31`;

    const entries = await Availability.find({
      date: { $gte: start, $lte: end },
    });

    const result = entries.map((entry) => {
      const slots = entry.slots.map(mapSlot);
      return {
        date: entry.date,
        totalSlots: slots.length,
        availableCount: slots.filter((s) => s.status === 'available').length,
      };
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAvailabilityByDate, getMonthAvailability };
