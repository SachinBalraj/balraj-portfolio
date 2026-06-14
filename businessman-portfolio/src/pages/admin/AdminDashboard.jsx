import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  TrendingUp,
  MessageSquare,
  Clock,
  Activity,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import AdminLayout, { fadeInUp, staggerContainer, Skeleton } from '@/components/admin/AdminLayout';
import { getDashboardData } from '@/config/admin';

const StatCard = ({ icon: Icon, label, value, subtext, trend }) => (
  <motion.div
    variants={fadeInUp}
    className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04] hover:border-green-500/20 transition-all duration-500 group"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-11 h-11 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center group-hover:bg-green-500/15 group-hover:border-green-500/30 transition-all duration-300">
        <Icon size={22} className="text-green-400" />
      </div>
      {trend !== undefined && (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-sm text-zinc-500">{label}</p>
    {subtext && <p className="text-xs text-zinc-600 mt-1">{subtext}</p>}
  </motion.div>
);

const RecentItem = ({ item }) => {
  const isContact = item.type === 'contact';
  const IconComponent = isContact ? MessageSquare : Calendar;
  const colorClass = isContact ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-green-400 bg-green-500/10 border-green-500/20';
  const title = isContact ? item.subject : `${item.fullName} — Consultation`;
  const detail = isContact ? item.name : `${item.fullName} — ${item.investmentBudget}`;

  return (
    <div className="flex items-start gap-3 py-3 px-4 rounded-xl hover:bg-white/[0.02] transition-colors duration-200 group">
      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 ${colorClass}`}>
        <IconComponent size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{title}</p>
        <p className="text-xs text-zinc-500 truncate">{detail}</p>
      </div>
      <div className="text-xs text-zinc-600 flex-shrink-0 pt-0.5 flex items-center gap-1">
        <Clock size={12} />
        {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/[0.06] rounded-xl px-4 py-3 shadow-xl">
      <p className="text-sm font-semibold text-white mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-zinc-400">{entry.name}:</span>
          <span className="text-white font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) {
      navigate('/admin-login', { replace: true });
      return;
    }

    setLoading(true);
    getDashboardData(token)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const statCards = data
    ? [
        { icon: Users, label: 'Total Contacts', value: data.totalContacts, subtext: 'From contact form', trend: 0 },
        { icon: Calendar, label: 'Total Consultations', value: data.totalConsultations, subtext: 'Scheduled meetings', trend: 0 },
        { icon: TrendingUp, label: "Today's Leads", value: data.todayLeads, subtext: 'New today', trend: 0 },
      ]
    : [];

  return (
    <AdminLayout>
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
        >
          <Activity size={16} />
          {error}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back,{' '}
          <span className="text-gradient">Admin</span>
        </h1>
        <p className="text-zinc-400 text-sm">
          Here&apos;s an overview of your portfolio activity.
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {statCards.map((card, i) => (
            <StatCard key={i} {...card} />
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3 bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <TrendingUp size={18} className="text-green-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Lead Statistics</h2>
              <p className="text-xs text-zinc-500">Last 6 months</p>
            </div>
          </div>

          {loading ? (
            <Skeleton className="h-64" />
          ) : data?.leadStatistics?.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.leadStatistics} barGap={4} barCategoryGap={12}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.04)' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#71717a', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    iconType="circle"
                    iconSize={8}
                  />
                  <Bar
                    name="Contacts"
                    dataKey="contacts"
                    fill="#22C55E"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                  <Bar
                    name="Consultations"
                    dataKey="consultations"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-zinc-600 text-sm">
              No data yet
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2 bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Activity size={18} className="text-green-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Recent Activity</h2>
              <p className="text-xs text-zinc-500">Latest 10 entries</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14" />
              ))}
            </div>
          ) : data?.recentActivity?.length > 0 ? (
            <div className="divide-y divide-white/[0.03]">
              {data.recentActivity.map((item, i) => (
                <RecentItem key={`${item.type}-${item._id || i}`} item={item} />
              ))}
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-zinc-600 text-sm">
              No activity yet
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
