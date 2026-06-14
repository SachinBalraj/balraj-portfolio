import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Save,
  Lock,
  Ban,
  Check,
} from 'lucide-react';
import AdminLayout, { Toast } from '@/components/admin/AdminLayout';
import {
  getAdminAvailability,
  updateDateAvailability,
  bulkSetAvailability,
} from '@/config/admin';

const STATUS_CYCLE = ['available', 'booked', 'blocked'];

const STATUS_CONFIG = {
  available: {
    label: 'Available',
    color: 'green',
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    text: 'text-green-400',
    hoverBg: 'hover:bg-green-500/15',
    icon: Check,
  },
  booked: {
    label: 'Booked',
    color: 'red',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    hoverBg: 'hover:bg-red-500/15',
    icon: Lock,
  },
  blocked: {
    label: 'Blocked',
    color: 'zinc',
    bg: 'bg-zinc-800/40',
    border: 'border-zinc-700/30',
    text: 'text-zinc-500',
    hoverBg: 'hover:bg-zinc-800/50',
    icon: Ban,
  },
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const today = new Date();

const nextStatus = (current) => {
  const idx = STATUS_CYCLE.indexOf(current);
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
};

const countByStatus = (slots) => ({
  available: slots.filter((s) => s.status === 'available').length,
  booked: slots.filter((s) => s.status === 'booked').length,
  blocked: slots.filter((s) => s.status === 'blocked').length,
});

const AdminCalendar = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [slots, setSlots] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateInput, setDateInput] = useState('');

  const showToast = (message, type = 'success') => setToast({ message, type });
  const clearToast = () => setToast(null);

  const fetchAvailability = (dateStr) => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) {
      navigate('/admin-login', { replace: true });
      return;
    }

    setLoading(true);
    getAdminAvailability(token, dateStr)
      .then((res) => {
        setSlots(res.data.slots || []);
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  };

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
    fetchAvailability(dateStr);
  };

  const handleDateInputSubmit = (e) => {
    e.preventDefault();
    if (dateInput) handleDateSelect(dateInput);
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const year = currentYear;
  const month = currentMonth;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ day: null, date: null });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = formatDate(year, month, i);
    const isPast = new Date(year, month, i) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    days.push({ day: i, date: dateStr, isPast });
  }

  const prevMonth = () => {
    if (month === 0) {
      setCurrentMonth(11);
      setCurrentYear(year - 1);
    } else {
      setCurrentMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setCurrentMonth(0);
      setCurrentYear(year + 1);
    } else {
      setCurrentMonth(month + 1);
    }
  };

  const handleToggleSlot = (index) => {
    setSlots((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, status: nextStatus(slot.status || 'available') } : slot
      )
    );
  };

  const handleSave = async () => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token || !selectedDate) return;

    setSaving(true);
    try {
      await updateDateAvailability(token, selectedDate, slots);
      showToast('Availability saved');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleBulk = async (status) => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token || !selectedDate) return;

    setSaving(true);
    try {
      await bulkSetAvailability(token, selectedDate, status);
      showToast(`All slots marked as ${status}`);
      fetchAvailability(selectedDate);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  const selectedDateObj = selectedDate ? new Date(selectedDate + 'T00:00:00') : null;
  const isPastSelected = selectedDateObj && selectedDateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const counts = countByStatus(slots);

  return (
    <AdminLayout title="Availability Calendar" subtitle="Manage daily time slots for consultation bookings." titleIcon={Calendar}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      {/* Calendar Picker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Calendar size={18} className="text-green-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Select Date</h2>
              <p className="text-xs text-zinc-500">Pick a date to manage slots</p>
            </div>
          </div>

          <form onSubmit={handleDateInputSubmit} className="flex items-center gap-2">
            <input
              type="date"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="bg-[#050505] border border-white/[0.06] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500/40 transition-all"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl text-sm bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/15 transition-all"
            >
              Go
            </button>
          </form>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-2 rounded-lg text-zinc-400 hover:text-green-400 hover:bg-green-500/10 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold text-white">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 rounded-lg text-zinc-400 hover:text-green-400 hover:bg-green-500/10 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((name) => (
            <div key={name} className="text-center text-xs font-medium text-zinc-500 py-2">
              {name}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <div key={i} className="aspect-square p-0.5">
              {d.day && (
                <button
                  onClick={() => !d.isPast && handleDateSelect(d.date)}
                  disabled={d.isPast}
                  className={`w-full h-full flex items-center justify-center text-sm rounded-lg transition-all duration-200 ${
                    d.isPast
                      ? 'text-zinc-800 cursor-not-allowed'
                      : selectedDate === d.date
                      ? 'bg-green-500/20 text-green-400 font-bold ring-1 ring-green-500/30'
                      : 'text-zinc-300 hover:bg-green-500/10 hover:text-green-400 cursor-pointer'
                  } ${d.date === todayStr && selectedDate !== todayStr ? 'ring-1 ring-green-500/20' : ''}`}
                >
                  {d.day}
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Slots Management */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Clock size={18} className="text-green-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">
                  Slots for {selectedDate}
                </h2>
                <p className="text-xs text-zinc-500">
                  {isPastSelected
                    ? 'Past date — read only'
                    : `${counts.available} available · ${counts.booked} booked · ${counts.blocked} blocked`
                  }
                </p>
              </div>
            </div>

            {!isPastSelected && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulk('available')}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/15 transition-all disabled:opacity-50"
                >
                  All Available
                </button>
                <button
                  onClick={() => handleBulk('booked')}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/15 transition-all disabled:opacity-50"
                >
                  All Booked
                </button>
                <button
                  onClick={() => handleBulk('blocked')}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-800/40 border border-zinc-700/30 text-zinc-400 hover:bg-zinc-800/50 transition-all disabled:opacity-50"
                >
                  All Blocked
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || isPastSelected}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-medium bg-green-500 hover:bg-green-400 text-background transition-all disabled:opacity-50"
                >
                  <Save size={14} />
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {Array.from({ length: 17 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse bg-white/[0.03] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {slots.map((slot, index) => {
                const config = STATUS_CONFIG[slot.status] || STATUS_CONFIG.available;
                const Icon = config.icon;
                return (
                  <button
                    key={slot.time}
                    onClick={() => !isPastSelected && handleToggleSlot(index)}
                    disabled={isPastSelected}
                    className={`py-3 px-3 rounded-xl text-sm font-medium border transition-all duration-200 ${config.bg} ${config.border} ${config.text} ${config.hoverBg} disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5`}
                  >
                    <Icon size={12} />
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default AdminCalendar;
