import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Save,
  Shield,
} from 'lucide-react';
import AdminLayout, { fadeInUp, Skeleton } from '@/components/admin/AdminLayout';
import {
  getAdminHomepageStats,
  updateHomepageStats,
} from '@/config/admin';

const AdminHomepage = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({
    yearsExperience: '',
    consultations: '',
    clientSatisfaction: '',
    clientConfidence: '',
  });
  const [originalStats, setOriginalStats] = useState(null);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const clearToast = () => setToast(null);

  useEffect(() => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) {
      navigate('/admin-login', { replace: true });
      return;
    }

    setLoading(true);
    getAdminHomepageStats(token)
      .then((res) => {
        const d = res.data;
        setStats({
          yearsExperience: d.yearsExperience,
          consultations: d.consultations,
          clientSatisfaction: d.clientSatisfaction,
          clientConfidence: d.clientConfidence,
        });
        setOriginalStats({ ...d });
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleSave = async (e) => {
    e.preventDefault();

    const changed = {};
    if (stats.yearsExperience !== originalStats.yearsExperience) changed.yearsExperience = stats.yearsExperience;
    if (stats.consultations !== originalStats.consultations) changed.consultations = stats.consultations;
    if (stats.clientSatisfaction !== originalStats.clientSatisfaction) changed.clientSatisfaction = stats.clientSatisfaction;
    if (stats.clientConfidence !== originalStats.clientConfidence) changed.clientConfidence = stats.clientConfidence;

    if (Object.keys(changed).length === 0) {
      showToast('No changes to save', 'error');
      return;
    }

    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    setSaving(true);
    try {
      const res = await updateHomepageStats(token, changed);
      const d = res.data;
      setStats({
        yearsExperience: d.yearsExperience,
        consultations: d.consultations,
        clientSatisfaction: d.clientSatisfaction,
        clientConfidence: d.clientConfidence,
      });
      setOriginalStats({ ...d });
      showToast('Homepage stats updated successfully');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const previewCards = [
    { value: stats.yearsExperience, label: 'Years Experience' },
    { value: stats.consultations, label: 'Consultations' },
    { value: stats.clientSatisfaction, label: 'Client Satisfaction' },
    { value: stats.clientConfidence, label: 'Client Confidence' },
  ];

  return (
    <AdminLayout title="Homepage Statistics" subtitle="Manage the statistics displayed on your homepage." titleIcon={Home}>
      {/* Edit Form */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Home size={18} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Statistic Values</h2>
            <p className="text-xs text-zinc-500">Edit the values shown on the homepage stat cards</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {[
              { key: 'yearsExperience', label: 'Years Experience' },
              { key: 'consultations', label: 'Consultations' },
              { key: 'clientSatisfaction', label: 'Client Satisfaction' },
              { key: 'clientConfidence', label: 'Client Confidence' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">{field.label}</label>
                <input
                  type="text"
                  value={stats[field.key]}
                  onChange={(e) => setStats({ ...stats, [field.key]: e.target.value })}
                  placeholder={field.label}
                  className="w-full bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all duration-300"
                />
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-400 text-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Preview Cards */}
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
            <p className="text-xs text-zinc-500">How the cards will look on the homepage</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {previewCards.map((card) => (
              <motion.div
                key={card.label}
                variants={fadeInUp}
                className="rounded-2xl border border-white/[0.03] bg-white/[0.02] flex flex-col items-center justify-center text-center p-6"
              >
                <div className="text-green-400 font-bold text-2xl sm:text-3xl lg:text-4xl mb-1">
                  {card.value || '\u2014'}
                </div>
                <div className="text-muted-foreground text-xs sm:text-sm font-medium">
                  {card.label}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminHomepage;
