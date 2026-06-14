import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Save,
  RotateCcw,
  Plus,
  TrendingUp,
  BarChart3,
  Shield,
  X,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import AdminLayout, { fadeInUp, Skeleton } from '@/components/admin/AdminLayout';
import {
  getAdminMarketDashboard,
  updateMarketDashboard,
} from '@/config/admin';

const DEFAULT_DASHBOARD = {
  title: 'BDX Current Price',
  currentPrice: '\u20B97.51',
  networkStatus: 'Active',
  recommendedHorizon: '3\u20135 Years',
  currentTrend: 'Bullish',
  chartData: [
    { label: 'Jan', value: 6.8 },
    { label: 'Feb', value: 7.0 },
    { label: 'Mar', value: 7.2 },
    { label: 'Apr', value: 7.4 },
    { label: 'May', value: 7.5 },
    { label: 'Jun', value: 7.5 },
  ],
};

const AdminMarketDashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ ...DEFAULT_DASHBOARD });
  const [original, setOriginal] = useState(null);
  const [newChartLabel, setNewChartLabel] = useState('');
  const [newChartValue, setNewChartValue] = useState('');

  const showToast = (message, type = 'success') => setToast({ message, type });
  const clearToast = () => setToast(null);

  useEffect(() => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) {
      navigate('/admin-login', { replace: true });
      return;
    }

    setLoading(true);
    getAdminMarketDashboard(token)
      .then((res) => {
        const d = res.data;
        setForm({
          title: d.title,
          currentPrice: d.currentPrice,
          networkStatus: d.networkStatus,
          recommendedHorizon: d.recommendedHorizon,
          currentTrend: d.currentTrend,
          chartData: d.chartData.map((c) => ({ label: c.label, value: c.value, _key: crypto.randomUUID?.() || Math.random().toString() })),
        });
        setOriginal({ ...d });
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleChartLabelChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      chartData: prev.chartData.map((c) => (c._key === key ? { ...c, label: value } : c)),
    }));
  };

  const handleChartValueChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      chartData: prev.chartData.map((c) => (c._key === key ? { ...c, value: parseFloat(value) || 0 } : c)),
    }));
  };

  const handleAddChartPoint = () => {
    if (!newChartLabel.trim() || !newChartValue.trim()) {
      showToast('Label and value are required', 'error');
      return;
    }
    setForm((prev) => ({
      ...prev,
      chartData: [
        ...prev.chartData,
        { label: newChartLabel.trim(), value: parseFloat(newChartValue) || 0, _key: crypto.randomUUID?.() || Math.random().toString() },
      ],
    }));
    setNewChartLabel('');
    setNewChartValue('');
  };

  const handleRemoveChartPoint = (key) => {
    setForm((prev) => ({
      ...prev,
      chartData: prev.chartData.filter((c) => c._key !== key),
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    const payload = {
      title: form.title,
      currentPrice: form.currentPrice,
      networkStatus: form.networkStatus,
      recommendedHorizon: form.recommendedHorizon,
      currentTrend: form.currentTrend,
      chartData: form.chartData.map((c) => ({ label: c.label, value: c.value })),
    };

    setSaving(true);
    try {
      const res = await updateMarketDashboard(token, payload);
      const d = res.data;
      setForm({
        title: d.title,
        currentPrice: d.currentPrice,
        networkStatus: d.networkStatus,
        recommendedHorizon: d.recommendedHorizon,
        currentTrend: d.currentTrend,
        chartData: d.chartData.map((c) => ({ label: c.label, value: c.value, _key: crypto.randomUUID?.() || Math.random().toString() })),
      });
      setOriginal({ ...d });
      showToast('Market dashboard updated successfully');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm({
      title: DEFAULT_DASHBOARD.title,
      currentPrice: DEFAULT_DASHBOARD.currentPrice,
      networkStatus: DEFAULT_DASHBOARD.networkStatus,
      recommendedHorizon: DEFAULT_DASHBOARD.recommendedHorizon,
      currentTrend: DEFAULT_DASHBOARD.currentTrend,
      chartData: DEFAULT_DASHBOARD.chartData.map((c) => ({ ...c, _key: crypto.randomUUID?.() || Math.random().toString() })),
    });
  };

  const TrendBadge = ({ trend }) => {
    const colors = {
      Bullish: 'bg-green-500/10 text-green-400 border-green-500/20',
      Bearish: 'bg-red-500/10 text-red-400 border-red-500/20',
      Neutral: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };
    const color = colors[trend] || colors.Neutral;
    return (
      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${color}`}>
        {trend}
      </span>
    );
  };

  return (
    <AdminLayout title="Market Dashboard" subtitle="Manage the Beldex Ecosystem Dashboard displayed on the Services page." titleIcon={TrendingUp}>
      {/* Fields Form */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <TrendingUp size={18} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Dashboard Fields</h2>
            <p className="text-xs text-zinc-500">Edit the display values</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { key: 'title', label: 'Dashboard Title' },
              { key: 'currentPrice', label: 'Current Price' },
              { key: 'networkStatus', label: 'Network Status' },
              { key: 'recommendedHorizon', label: 'Recommended Horizon' },
              { key: 'currentTrend', label: 'Current Trend' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">{field.label}</label>
                <input
                  type="text"
                  value={form[field.key]}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  placeholder={field.label}
                  className="w-full bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Chart Data */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <BarChart3 size={18} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Chart Data</h2>
            <p className="text-xs text-zinc-500">Manage reference chart points</p>
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-40" />
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {form.chartData.map((point) => (
                <div key={point._key} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400/60 shrink-0" />
                  <input
                    type="text"
                    value={point.label}
                    onChange={(e) => handleChartLabelChange(point._key, e.target.value)}
                    placeholder="Label"
                    className="w-28 bg-[#050505] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 transition-all duration-300"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={point.value}
                    onChange={(e) => handleChartValueChange(point._key, e.target.value)}
                    placeholder="Value"
                    className="w-24 bg-[#050505] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 transition-all duration-300"
                  />
                  <button
                    onClick={() => handleRemoveChartPoint(point._key)}
                    className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newChartLabel}
                onChange={(e) => setNewChartLabel(e.target.value)}
                placeholder="Label"
                className="w-28 bg-[#050505] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 transition-all duration-300"
              />
              <input
                type="number"
                step="0.1"
                value={newChartValue}
                onChange={(e) => setNewChartValue(e.target.value)}
                placeholder="Value"
                className="w-24 bg-[#050505] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 transition-all duration-300"
              />
              <button
                onClick={handleAddChartPoint}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all duration-300"
              >
                <Plus size={12} />
                Add
              </button>
            </div>
          </>
        )}
      </motion.div>

      {/* Preview */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Shield size={18} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Preview</h2>
            <p className="text-xs text-zinc-500">How the dashboard will look on the Services page</p>
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-48" />
        ) : (
          <div className="bg-zinc-950 rounded-2xl p-5 border border-white/[0.04]">
            <div className="text-center mb-3">
              <div className="text-zinc-200 text-sm font-semibold tracking-[0.35em] uppercase mb-1">
                {form.title}
              </div>
              <div className="text-4xl font-black text-emerald-400 font-mono glow-text leading-none">
                {form.currentPrice}
              </div>
            </div>

            {form.chartData.length > 0 && (
              <div className="mb-3 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={form.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" />
                    <XAxis dataKey="label" tick={{ fill: '#555', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{ background: '#000', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '8px' }}
                      labelStyle={{ color: '#a3a3a3', fontSize: '11px' }}
                    />
                    <Bar dataKey="value" fill="#22C55E" radius={[3, 3, 0, 0]} maxBarSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded-xl bg-black/50 border border-white/[0.04]">
                <div className="text-zinc-500 text-[9px] font-semibold uppercase tracking-wider mb-1">Network</div>
                <div className="text-emerald-400 text-xs font-bold">{form.networkStatus}</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-black/50 border border-white/[0.04]">
                <div className="text-zinc-500 text-[9px] font-semibold uppercase tracking-wider mb-1">Horizon</div>
                <div className="text-emerald-400 text-xs font-bold">{form.recommendedHorizon}</div>
              </div>
              <div className="text-center p-2 rounded-xl bg-black/50 border border-white/[0.04]">
                <div className="text-zinc-500 text-[9px] font-semibold uppercase tracking-wider mb-1">Trend</div>
                <TrendBadge trend={form.currentTrend} />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-white border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-400 text-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminMarketDashboard;
