const Availability = require('../models/Availability');
const { getDefaultSlots, mapSlot } = require('../utils/availability');

const VALID_STATUSES = ['available', 'booked', 'blocked'];

const getAdminAvailabilityByDate = async (req, res, next) => {
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

    res.json({
      success: true,
      data: {
        date: availability.date,
        slots,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateDateAvailability = async (req, res, next) => {
  try {
    const { date } = req.params;
    const { slots } = req.body;

    if (!Array.isArray(slots)) {
      res.status(400);
      throw new Error('slots must be an array');
    }

    for (const slot of slots) {
      if (!slot.time) {
        res.status(400);
        throw new Error('Each slot must have a time');
      }
      if (slot.status && !VALID_STATUSES.includes(slot.status)) {
        res.status(400);
        throw new Error(`Invalid status "${slot.status}". Must be one of: ${VALID_STATUSES.join(', ')}`);
      }
    }

    const normalizedSlots = slots.map((s) => ({
      time: s.time,
      status: s.status || 'available',
    }));

    let availability = await Availability.findOne({ date });

    if (!availability) {
      availability = new Availability({ date, slots: [] });
    }

    availability.slots = normalizedSlots;
    await availability.save();

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: {
        date: availability.date,
        slots: availability.slots,
      },
    });
  } catch (error) {
    next(error);
  }
};

const bulkSetAvailability = async (req, res, next) => {
  try {
    const { date } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      res.status(400);
      throw new Error(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    let availability = await Availability.findOne({ date });

    if (!availability) {
      availability = new Availability({
        date,
        slots: getDefaultSlots(),
      });
    }

    availability.slots = availability.slots.map((s) => ({
      time: s.time,
      status,
    }));

    await availability.save();

    res.json({
      success: true,
      message: `All slots marked as ${status}`,
      data: {
        date: availability.date,
        slots: availability.slots,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminAvailabilityByDate, updateDateAvailability, bulkSetAvailability };
