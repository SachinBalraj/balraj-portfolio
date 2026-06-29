import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Save,
  Trash2,
  ArrowUp,
  ArrowDown,
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Upload,
  Download,
  FileText,
} from 'lucide-react';
import AdminLayout, { fadeInUp, Skeleton, Toast } from '@/components/admin/AdminLayout';
import {
  getAdminPlans,
  createPlan,
  updatePlan,
  deletePlan,
  reorderPlans,
  uploadPlanFile,
  deletePlanFile,
} from '@/config/admin';

const emptyPlan = {
  name: '',
  description: '',
  bestFor: '',
  features: [''],
  horizon: '',
  risk: '',
  button: 'View Plan',
  featured: false,
  isActive: true,
};

const formatSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const AdminInvestmentPlans = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadingId, setUploadingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [plans, setPlans] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyPlan });

  const showToast = (message, type = 'success') => setToast({ message, type });
  const clearToast = () => setToast(null);

  const fetchData = () => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) {
      navigate('/admin-login', { replace: true });
      return;
    }
    setLoading(true);
    getAdminPlans(token)
      .then((res) => setPlans(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [navigate]);

  const openAdd = () => {
    setForm({ ...emptyPlan, features: [''] });
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (plan) => {
    setForm({
      name: plan.name || '',
      description: plan.description || '',
      bestFor: plan.bestFor || '',
      features: plan.features?.length ? [...plan.features] : [''],
      horizon: plan.horizon || '',
      risk: plan.risk || '',
      button: plan.button || 'View Plan',
      featured: plan.featured || false,
      isActive: plan.isActive !== false,
    });
    setEditingId(plan._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyPlan });
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...form.features];
    updated[index] = value;
    setForm((prev) => ({ ...prev, features: updated }));
  };

  const addFeature = () => {
    setForm((prev) => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index) => {
    if (form.features.length <= 1) return;
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const moveFeature = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= form.features.length) return;
    const updated = [...form.features];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setForm((prev) => ({ ...prev, features: updated }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast('Plan name is required', 'error');
      return;
    }
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    const cleaned = {
      ...form,
      name: form.name.trim(),
      features: form.features.filter((f) => f.trim()),
    };

    setSaving(true);
    try {
      if (editingId) {
        const res = await updatePlan(token, editingId, cleaned);
        showToast(res.message || 'Plan updated');
      } else {
        const res = await createPlan(token, cleaned);
        showToast(res.message || 'Plan created');
      }
      closeForm();
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;
    try {
      await deletePlan(token, id);
      showToast('Plan deleted');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const movePlan = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= plans.length) return;
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    const updated = [...plans];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    const items = updated.map((p, i) => ({ id: p._id, displayOrder: i }));

    try {
      await reorderPlans(token, items);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const toggleActive = async (plan) => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;
    try {
      await updatePlan(token, plan._id, { isActive: !plan.isActive });
      showToast(plan.isActive ? 'Plan deactivated' : 'Plan activated');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const toggleFeatured = async (plan) => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;
    try {
      await updatePlan(token, plan._id, { featured: !plan.featured });
      showToast(plan.featured ? 'Featured removed' : 'Marked as featured');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleFileUpload = async (id, file) => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;
    setUploadingId(id);
    try {
      const res = await uploadPlanFile(token, id, file);
      showToast(res.message || 'File uploaded');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setUploadingId(null);
    }
  };

  const handleFileDelete = async (id) => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;
    try {
      const res = await deletePlanFile(token, id);
      showToast(res.message || 'File deleted');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const API_BASE = import.meta.env.VITE_API_URL || '';

  return (
    <AdminLayout
      title="Investment Plans"
      subtitle="Manage service plans displayed on the public website"
      titleIcon={DollarSign}
    >
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      <div className="flex items-center justify-between mb-6">
        <p className="text-zinc-400 text-sm">{plans.length} plan{plans.length !== 1 ? 's' : ''}</p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-black text-sm font-semibold hover:bg-green-400 transition-all"
        >
          <Plus size={16} />
          Add Plan
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <DollarSign size={48} className="mx-auto mb-4 opacity-30" />
          <p>No investment plans yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {plans.map((plan, i) => (
              <motion.div
                key={plan._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`rounded-2xl border p-5 transition-all ${
                  plan.featured
                    ? 'border-green-500/30 bg-[#0C0C0C]'
                    : 'border-white/[0.04] bg-[#0A0A0A]'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-bold text-base ${plan.featured ? 'text-green-400' : 'text-white'}`}>
                        {plan.name}
                      </h3>
                      {plan.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-semibold uppercase tracking-wider">
                          <Sparkles size={10} />
                          Featured
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                        plan.isActive
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                      }`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-xs mt-1">{plan.bestFor}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                      <span>Horizon: {plan.horizon}</span>
                      <span>Risk: {plan.risk}</span>
                      <span>{plan.features?.length || 0} features</span>
                    </div>

                    {/* File info */}
                    {plan.fileName && (
                      <div className="flex items-center gap-2 mt-2 text-xs text-zinc-400">
                        <FileText size={12} />
                        <span>{plan.fileName}</span>
                        {plan.fileSize > 0 && <span>({formatSize(plan.fileSize)})</span>}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => movePlan(i, -1)} disabled={i === 0}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all">
                      <ArrowUp size={14} />
                    </button>
                    <button onClick={() => movePlan(i, 1)} disabled={i === plans.length - 1}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all">
                      <ArrowDown size={14} />
                    </button>
                    <button onClick={() => toggleFeatured(plan)}
                      className={`p-1.5 rounded-lg transition-all ${
                        plan.featured ? 'text-green-400 hover:bg-green-500/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                      }`}>
                      <Sparkles size={14} />
                    </button>
                    <button onClick={() => openEdit(plan)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    </button>
                    <button onClick={() => toggleActive(plan)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button onClick={() => { if (window.confirm('Delete this plan?')) handleDelete(plan._id); }}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* File upload / download bar */}
                <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        handleFileUpload(plan._id, e.target.files[0]);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingId === plan._id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium border border-green-500/20 hover:border-green-500/40 transition-all disabled:opacity-50"
                  >
                    {uploadingId === plan._id ? (
                      <div className="w-3 h-3 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Upload size={12} />
                    )}
                    {plan.fileUrl ? 'Replace File' : 'Upload File'}
                  </button>
                  {plan.fileUrl && (
                    <>
                      <a
                        href={`${API_BASE}${plan.fileUrl}`}
                        download={plan.fileName}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium border border-white/10 hover:border-white/20 transition-all"
                      >
                        <Download size={12} />
                        Download
                      </a>
                      <button
                        onClick={() => { if (window.confirm('Delete this file?')) handleFileDelete(plan._id); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 hover:border-red-500/40 transition-all"
                      >
                        <Trash2 size={12} />
                        Delete File
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-12 pb-8 overflow-y-auto"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeForm} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04] w-full max-w-2xl shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Plan' : 'Add Plan'}</h3>
                <button onClick={closeForm} className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Plan Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Starter Plan"
                    className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Best For (Subtitle)</label>
                  <input
                    type="text"
                    value={form.bestFor}
                    onChange={(e) => handleChange('bestFor', e.target.value)}
                    placeholder="Beginners"
                    className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="A cryptocurrency investment plan designed for investors seeking long-term growth..."
                    rows={2}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Investment Horizon</label>
                  <input
                    type="text"
                    value={form.horizon}
                    onChange={(e) => handleChange('horizon', e.target.value)}
                    placeholder="1-2 Years"
                    className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Risk Level</label>
                  <input
                    type="text"
                    value={form.risk}
                    onChange={(e) => handleChange('risk', e.target.value)}
                    placeholder="Low"
                    className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Button Text</label>
                  <input
                    type="text"
                    value={form.button}
                    onChange={(e) => handleChange('button', e.target.value)}
                    placeholder="View Plan"
                    className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>
                <div className="flex items-end gap-4 pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => handleChange('featured', e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-xs text-zinc-400">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => handleChange('isActive', e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-white/5 text-green-500 focus:ring-green-500"
                    />
                    <span className="text-xs text-zinc-400">Active</span>
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Features</label>
                <div className="space-y-2">
                  {form.features.map((feature, fi) => (
                    <div key={fi} className="flex items-center gap-2">
                      <button
                        onClick={() => moveFeature(fi, -1)}
                        disabled={fi === 0}
                        className="p-1 rounded text-zinc-500 hover:text-white disabled:opacity-20"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => moveFeature(fi, 1)}
                        disabled={fi === form.features.length - 1}
                        className="p-1 rounded text-zinc-500 hover:text-white disabled:opacity-20"
                      >
                        <ArrowDown size={12} />
                      </button>
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(fi, e.target.value)}
                        placeholder="Enter a feature..."
                        className="flex-1 h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                      />
                      <button
                        onClick={() => removeFeature(fi)}
                        className="p-1.5 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={addFeature}
                  className="mt-2 flex items-center gap-1 text-xs text-green-400 hover:text-green-300 transition-all"
                >
                  <Plus size={12} />
                  Add Feature
                </button>
              </div>

              {/* Preview Card */}
              <div className="mb-4 rounded-xl border border-white/[0.04] bg-black/30 p-4">
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-3">Preview</p>
                <div className={`relative rounded-xl border p-5 ${
                  form.featured ? 'border-green-500/30 bg-[#0C0C0C]' : 'border-white/[0.04] bg-[#0A0A0A]'
                }`}>
                  {form.featured && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-semibold uppercase tracking-wider">
                        <Sparkles size={10} />
                        Featured
                      </span>
                    </div>
                  )}
                  <h4 className={`text-sm font-bold mb-0.5 ${form.featured ? 'text-green-400' : 'text-white'}`}>
                    {form.name || 'Plan Name'}
                  </h4>
                  <p className="text-[10px] text-zinc-500 mb-3">Best For: {form.bestFor || '—'}</p>
                  {form.description && (
                    <p className="text-[10px] text-zinc-400 mb-3 leading-relaxed">{form.description}</p>
                  )}
                  <div className="space-y-1.5 mb-3">
                    {form.features.filter((f) => f.trim()).map((f, fi) => (
                      <div key={fi} className="flex items-start gap-2">
                        <CheckCircle2 size={12} className="text-green-400 mt-0.5 shrink-0" />
                        <span className="text-zinc-400 text-[11px]">{f}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[10px] border-t border-white/[0.04] pt-3 mb-3">
                    <div>
                      <span className="text-zinc-500 uppercase tracking-wider">Horizon</span>
                      <p className="text-white text-xs font-medium">{form.horizon || '—'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-500 uppercase tracking-wider">Risk</span>
                      <p className="text-green-400 text-xs font-medium">{form.risk || '—'}</p>
                    </div>
                  </div>
                  <div className="w-full h-9 rounded-lg bg-green-500 flex items-center justify-center">
                    <span className="text-black text-xs font-semibold">{form.button}</span>
                    <ArrowRight size={12} className="ml-1 text-black" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={closeForm} className="px-5 py-2 rounded-xl text-sm text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 transition-all">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-500 text-black text-sm font-semibold hover:bg-green-400 disabled:opacity-50 transition-all"
                >
                  {saving ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminInvestmentPlans;
