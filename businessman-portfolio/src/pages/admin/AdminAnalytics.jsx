import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Calendar,
  PieChart,
  BarChart3,
  Activity,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart as RePieChart,
  Pie,
  Cell,
} from 'recharts';
import AdminLayout, { fadeInUp, Skeleton } from '@/components/admin/AdminLayout';
import { getAnalytics } from '@/config/admin';

const STATUS_COLORS = {
  Pending: '#F59E0B',
  Contacted: '#3B82F6',
  Converted: '#22C55E',
  Rejected: '#EF4444',
};

const PIE_COLORS = ['#22C55E', '#3B82F6', '#F59E0B', '#EF4444'];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const StatCard = ({ icon: Icon, label, value, subtext, color = 'green' }) => {
  const colorMap = {
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
  };
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04] hover:border-green-500/20 transition-all duration-500 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl border flex items-center justify-center group-hover:bg-opacity-15 transition-all duration-300 ${colorMap[color]}`}>
          <Icon size={22} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-zinc-500">{label}</p>
      {subtext && <p className="text-xs text-zinc-600 mt-1">{subtext}</p>}
    </motion.div>
  );
};

const ChartCard = ({ title, subtitle, icon: Icon, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
        <Icon size={18} className="text-green-400" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <p className="text-xs text-zinc-500">{subtitle}</p>
      </div>
    </div>
    {children}
  </motion.div>
);

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

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0];
  return (
    <div className="bg-[#0A0A0A]/95 backdrop-blur-xl border border-white/[0.06] rounded-xl px-4 py-3 shadow-xl">
      <div className="flex items-center gap-2 text-sm">
        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.payload.fill }} />
        <span className="text-zinc-400">{d.name}:</span>
        <span className="text-white font-medium">{d.value}</span>
      </div>
    </div>
  );
};

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) { navigate('/admin-login', { replace: true }); return; }

    setLoading(true);
    getAnalytics(token)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [navigate]);

  const summary = data?.summary;

  return (
    <AdminLayout>
      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
          <AlertCircle size={16} />
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : summary ? (
        <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Total Contacts" value={summary.totalContacts} color="green" />
          <StatCard icon={Calendar} label="Total Consultations" value={summary.totalConsultations} color="blue" />
          <StatCard icon={CheckCircle2} label="Conversion Rate" value={`${summary.conversionRate}%`} subtext={`${summary.convertedCount} converted`} color="green" />
          <StatCard icon={Activity} label="Active Pipeline" value={summary.pendingCount + summary.contactedCount} subtext={`${summary.pendingCount} pending, ${summary.contactedCount} contacted`} color="amber" />
        </motion.div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-80" />)}
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Monthly Leads" subtitle="Contacts + Consultations per month" icon={TrendingUp} delay={0.1}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyLeads} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
                  <defs>
                    <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.04)' }} tickLine={false} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)' }} />
                  <Area type="monotone" dataKey="total" stroke="#22C55E" strokeWidth={2.5} fill="url(#leadsGradient)" name="Total Leads" dot={{ r: 3, fill: '#22C55E', stroke: '#22C55E' }} activeDot={{ r: 5, fill: '#22C55E', stroke: '#0A0A0A', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Consultations by Status" subtitle="Monthly breakdown by pipeline stage" icon={BarChart3} delay={0.2}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyConsultations} barGap={2} barCategoryGap={8} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.04)' }} tickLine={false} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
                  <Bar dataKey="pending" name="Pending" fill={STATUS_COLORS.Pending} stackId="a" radius={[0, 0, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="contacted" name="Contacted" fill={STATUS_COLORS.Contacted} stackId="a" radius={[0, 0, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="converted" name="Converted" fill={STATUS_COLORS.Converted} stackId="a" radius={[0, 0, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="rejected" name="Rejected" fill={STATUS_COLORS.Rejected} stackId="a" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Contact vs Consultation" subtitle="Monthly comparison" icon={MessageSquare} delay={0.3}>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.contactVsConsultation} barGap={4} barCategoryGap={12} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="month" tick={{ fill: '#71717a', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.04)' }} tickLine={false} />
                  <YAxis tick={{ fill: '#71717a', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} iconType="circle" iconSize={8} />
                  <Bar name="Contacts" dataKey="contacts" fill="#22C55E" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar name="Consultations" dataKey="consultations" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Pipeline Distribution" subtitle="All consultations by status" icon={PieChart} delay={0.4}>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={(() => {
                      const items = [
                        { name: 'Pending', value: summary.pendingCount },
                        { name: 'Contacted', value: summary.contactedCount },
                        { name: 'Converted', value: summary.convertedCount },
                        { name: 'Rejected', value: summary.rejectedCount },
                      ];
                      return items.filter((d) => d.value > 0);
                    })()}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {[
                      { name: 'Pending', value: summary.pendingCount },
                      { name: 'Contacted', value: summary.contactedCount },
                      { name: 'Converted', value: summary.convertedCount },
                      { name: 'Rejected', value: summary.rejectedCount },
                    ].filter((d) => d.value > 0).map((d) => (
                      <Cell key={d.name} fill={STATUS_COLORS[d.name]} stroke="rgba(0,0,0,0)" />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span className="text-zinc-400">{value}</span>}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      ) : null}
    </AdminLayout>
  );
};

export default AdminAnalytics;
