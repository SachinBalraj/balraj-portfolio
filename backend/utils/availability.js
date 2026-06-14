const DEFAULT_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00',
];

const getDefaultSlots = () =>
  DEFAULT_SLOTS.map((time) => ({ time, status: 'available' }));

const mapSlot = (s) => ({
  time: s.time,
  status: s.status || 'available',
});

module.exports = { DEFAULT_SLOTS, getDefaultSlots, mapSlot };
