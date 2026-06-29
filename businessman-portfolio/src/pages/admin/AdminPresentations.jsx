import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Save,
  Trash2,
  Upload,
  Download,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  X,
  Sparkles,
} from 'lucide-react';
import AdminLayout, { fadeInUp, Skeleton, Toast } from '@/components/admin/AdminLayout';
import {
  getAdminPresentations,
  createPresentation,
  updatePresentation,
  deletePresentation,
  reorderPresentations,
} from '@/config/admin';

const API_BASE = import.meta.env.VITE_API_URL || '';

const formatSize = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const ACCEPTED_TYPES = '.ppt,.pptx,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.jpg,.jpeg,.png,.webp,.mp4,.mov,.mp3';

const AdminPresentations = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [presentations, setPresentations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({ title: '', description: '', published: true });
  const [formFile, setFormFile] = useState(null);
  const [formFilePreview, setFormFilePreview] = useState('');
  const [formDragOver, setFormDragOver] = useState(false);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const clearToast = () => setToast(null);

  const fetchData = () => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) { navigate('/admin-login', { replace: true }); return; }
    setLoading(true);
    getAdminPresentations(token)
      .then((res) => setPresentations(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [navigate]);

  const resetForm = () => {
    setForm({ title: '', description: '', published: true });
    setFormFile(null);
    setFormFilePreview('');
    setEditingId(null);
  };

  const openAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const openEdit = (pres) => {
    setForm({
      title: pres.title || '',
      description: pres.description || '',
      published: pres.published !== false,
    });
    setFormFile(null);
    setFormFilePreview('');
    setEditingId(pres._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleFormFileSelect = (file) => {
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      showToast('File size exceeds 100 MB limit', 'error');
      return;
    }
    setFormFile(file);
    setFormFilePreview(file.name);
  };

  const handleFormInputChange = (e) => {
    const file = e.target.files[0];
    handleFormFileSelect(file);
    e.target.value = '';
  };

  const handleFormDrop = (e) => {
    e.preventDefault();
    setFormDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFormFileSelect(file);
  };

  const handleFormDragOver = (e) => {
    e.preventDefault();
    setFormDragOver(true);
  };

  const handleFormDragLeave = () => {
    setFormDragOver(false);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }
    if (!editingId && !formFile) {
      showToast('Please select a file to upload', 'error');
      return;
    }

    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    const fd = new FormData();
    fd.append('title', form.title.trim());
    fd.append('description', form.description);
    fd.append('published', form.published);
    if (formFile) fd.append('presentation', formFile);

    setSaving(true);
    try {
      if (editingId) {
        const res = await updatePresentation(token, editingId, fd);
        showToast(res.message || 'Updated');
      } else {
        const res = await createPresentation(token, fd);
        showToast(res.message || 'Created');
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
      await deletePresentation(token, id);
      showToast('Deleted');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const togglePublished = async (pres) => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;
    try {
      const fd = new FormData();
      fd.append('published', !pres.published);
      await updatePresentation(token, pres._id, fd);
      showToast(pres.published ? 'Unpublished' : 'Published');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const moveItem = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= presentations.length) return;
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    const updated = [...presentations];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    const items = updated.map((p, i) => ({ id: p._id, displayOrder: i }));

    try {
      await reorderPresentations(token, items);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <AdminLayout
      title="Crypto Presentations"
      subtitle="Manage presentation files displayed on the public website"
      titleIcon={FileText}
    >
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      <div className="flex items-center justify-between mb-6">
        <p className="text-zinc-400 text-sm">{presentations.length} presentation{presentations.length !== 1 ? 's' : ''}</p>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-black text-sm font-semibold hover:bg-green-400 transition-all"
        >
          <Plus size={16} />
          Add Presentation
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : presentations.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <p>No presentations yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {presentations.map((pres, i) => (
              <motion.div
                key={pres._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={`rounded-2xl border p-5 transition-all ${
                  pres.published
                    ? 'border-white/[0.04] bg-[#0A0A0A]'
                    : 'border-zinc-500/10 bg-[#080808] opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-white">{pres.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider ${
                        pres.published
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-zinc-500/10 text-zinc-500 border border-zinc-500/20'
                      }`}>
                        {pres.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    {pres.description && (
                      <p className="text-zinc-500 text-xs mt-1 line-clamp-1">{pres.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                      <span>{pres.fileName}</span>
                      {pres.fileSize > 0 && <span>({formatSize(pres.fileSize)})</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => moveItem(i, -1)} disabled={i === 0}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all">
                      <ArrowUp size={14} />
                    </button>
                    <button onClick={() => moveItem(i, 1)} disabled={i === presentations.length - 1}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all">
                      <ArrowDown size={14} />
                    </button>
                    <button onClick={() => togglePublished(pres)}
                      className={`p-1.5 rounded-lg transition-all ${
                        pres.published ? 'text-green-400 hover:bg-green-500/10' : 'text-zinc-500 hover:text-white hover:bg-white/5'
                      }`}>
                      {pres.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => openEdit(pres)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                    </button>
                    <a href={`${API_BASE}${pres.fileUrl}`} download={pres.fileName}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                      <Download size={14} />
                    </a>
                    <button onClick={() => { if (window.confirm('Delete this presentation?')) handleDelete(pres._id); }}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
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
              className="relative bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04] w-full max-w-lg shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Presentation' : 'Add Presentation'}</h3>
                <button onClick={closeForm} className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="Q4 2026 Market Analysis"
                    className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="A comprehensive analysis of the cryptocurrency market..."
                    rows={2}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 resize-none"
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                    File {editingId ? '(leave empty to keep current)' : '*'}
                  </label>
                  <div
                    onDrop={handleFormDrop}
                    onDragOver={handleFormDragOver}
                    onDragLeave={handleFormDragLeave}
                    onClick={() => editFileInputRef.current?.click()}
                    className={`relative cursor-pointer rounded-xl border-2 border-dashed p-5 transition-all duration-300 text-center ${
                      formDragOver
                        ? 'border-green-500/50 bg-green-500/[0.04]'
                        : formFile
                          ? 'border-green-500/20 bg-white/[0.02]'
                          : 'border-white/[0.08] bg-white/[0.01] hover:border-white/[0.15]'
                    }`}
                  >
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept={ACCEPTED_TYPES}
                      onChange={handleFormInputChange}
                      className="hidden"
                    />
                    {formFile ? (
                      <div className="flex items-center gap-3">
                        <FileText size={20} className="text-green-400 shrink-0" />
                        <div className="text-left min-w-0 flex-1">
                          <p className="text-white text-sm font-medium truncate">{formFile.name}</p>
                          <p className="text-zinc-500 text-xs">{formatSize(formFile.size)}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setFormFile(null); setFormFilePreview(''); }}
                          className="shrink-0 p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-2">
                          <Upload size={18} className="text-green-400" />
                        </div>
                        <p className="text-zinc-300 text-sm font-medium mb-1">
                          {editingId ? 'Drop a file or click to replace' : 'Drop a file or click to browse'}
                        </p>
                        <p className="text-zinc-600 text-xs">PDF, PPT, DOC, XLS, ZIP, JPG, MP4, MP3 (max 100 MB)</p>
                      </>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 text-green-500 focus:ring-green-500"
                  />
                  <span className="text-xs text-zinc-400">Published (visible to visitors)</span>
                </label>
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

export default AdminPresentations;
