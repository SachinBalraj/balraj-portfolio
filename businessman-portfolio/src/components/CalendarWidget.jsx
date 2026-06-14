import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getMonthAvailability } from '@/config/api';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CalendarWidget = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState({});

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    getMonthAvailability(year, month + 1)
      .then((res) => {
        const map = {};
        (res.data || []).forEach((entry) => {
          map[entry.date] = entry;
        });
        setMonthData(map);
      })
      .catch(() => console.error('Failed to load month availability'));
  }, [year, month]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const today = new Date();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, currentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, currentMonth: true });
  }

  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, currentMonth: false });
  }

  const isToday = (day, cm) =>
    cm &&
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const getDateStr = (day, cm) => {
    if (!cm) return null;
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isPast = (day, cm) => {
    if (!cm) return false;
    const d = new Date(year, month, day);
    return d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="sticky top-24 bg-[#0A0A0A]/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/[0.04] green-glow"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-shrink-0">
          <CalendarIcon size={22} className="text-green-400 relative z-10" />
          <div className="absolute inset-0 blur-md scale-150 opacity-60">
            <CalendarIcon size={22} className="text-green-400" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-white">Availability</h2>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg text-zinc-400 hover:text-green-400 hover:bg-green-500/10 transition-all duration-300"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-semibold text-white tracking-wide">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg text-zinc-400 hover:text-green-400 hover:bg-green-500/10 transition-all duration-300"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((name) => (
          <div
            key={name}
            className="text-center text-xs font-medium text-zinc-500 py-2 select-none"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayObj, i) => {
          const dateStr = getDateStr(dayObj.day, dayObj.currentMonth);
          const avail = dateStr ? monthData[dateStr] : null;
          const hasAvailability = avail && avail.availableCount > 0;

          return (
            <div
              key={i}
              className={`
                relative text-center py-2 text-sm rounded-lg transition-all duration-200 select-none
                ${dayObj.currentMonth && !isPast(dayObj.day, dayObj.currentMonth)
                  ? 'text-zinc-300 hover:bg-green-500/10 hover:text-green-400 cursor-pointer'
                  : dayObj.currentMonth
                  ? 'text-zinc-700'
                  : 'text-zinc-700'
                }
                ${isToday(dayObj.day, dayObj.currentMonth)
                  ? 'bg-green-500/20 text-green-400 font-bold ring-1 ring-green-500/30 scale-105'
                  : ''
                }
              `}
            >
              {dayObj.day}
              {hasAvailability && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-400" />
              )}
              {dateStr && monthData[dateStr] && monthData[dateStr].availableCount === 0 && dayObj.currentMonth && !isPast(dayObj.day, dayObj.currentMonth) && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400" />
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom accent */}
      <div className="mt-6 pt-4 border-t border-white/[0.04]">
        <p className="text-xs text-zinc-600 text-center">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1.5 align-middle" />
          Available
          <span className="inline-block w-2 h-2 rounded-full bg-red-400 ml-3 mr-1.5 align-middle" />
          Fully booked
        </p>
      </div>
    </motion.div>
  );
};

export default CalendarWidget;
