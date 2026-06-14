import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  ArrowUp,
  ArrowDown,
  Image,
  X,
  FileImage,
} from 'lucide-react';
import AdminLayout, { fadeInUp, Skeleton, Toast } from '@/components/admin/AdminLayout';
import {
  getAdminAchievements,
  updateAchievement,
  deleteAchievement,
  reorderAchievements,
} from '@/config/admin';

const API_BASE = import.meta.env.VITE_API_URL;

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp';

const EditModal = ({ achievement, open, onClose, onSave, saving, showToast }) => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const xhrRef = useRef(null);

  useEffect(() => {
    if (achievement) {
      setTitle(achievement.title);
      setYear(achievement.year);
      setImageFile(null);
      setImagePreview('');
      setUploadProgress(0);
      setUploading(false);
    }
  }, [achievement]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      showToast('Only JPG, JPEG, PNG, and WEBP files are allowed', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be under 5MB', 'error');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setUploadProgress(0);
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !year.trim()) {
      showToast('Title and year are required', 'error');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('year', year.trim());

    if (imageFile) {
      formData.append('image', imageFile);
    } else if (achievement?.image && !imagePreview && !imageFile) {
      formData.append('removeImage', 'true');
    }

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      setUploading(false);
      setUploadProgress(0);
      xhrRef.current = null;
      if (xhr.status >= 200 && xhr.status < 300) {
        const result = JSON.parse(xhr.responseText);
        onSave(result.data);
      } else {
        try {
          const result = JSON.parse(xhr.responseText);
          showToast(result.message || 'Failed to update achievement', 'error');
        } catch {
          showToast('Failed to update achievement', 'error');
        }
      }
    });

    xhr.addEventListener('error', () => {
      setUploading(false);
      setUploadProgress(0);
      xhrRef.current = null;
      showToast('Network error', 'error');
    });

    xhr.addEventListener('abort', () => {
      setUploading(false);
      setUploadProgress(0);
      xhrRef.current = null;
    });

    xhr.open('PUT', `${API_BASE}/api/admin/achievements/${achievement._id}`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  };

  if (!open) return null;

  const hasExistingImage = achievement?.image && !imageFile && imagePreview === '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-[#0A0A0A] rounded-2xl border border-white/[0.06] w-full max-w-lg shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Trophy size={16} className="text-green-400" />
            </div>
            <h3 className="text-base font-semibold text-white">Edit Achievement</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Achievement title"
              className="w-full bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Year</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
              className="w-full bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1.5">Achievement Image</label>

            {/* Current / Preview image */}
            {(hasExistingImage || imagePreview) && (
              <div className="relative mb-3">
                <div className="w-full h-40 rounded-xl overflow-hidden border border-white/[0.06] bg-[#050505]">
                  <img
                    src={imagePreview || `${API_BASE}${achievement.image}`}
                    alt="Achievement"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/[0.08] text-zinc-400 hover:text-red-400 hover:bg-red-500/20 transition-all"
                  title="Remove image"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Drag-and-drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 transition-all duration-300 text-center ${
                dragOver
                  ? 'border-green-400 bg-green-500/5'
                  : 'border-white/[0.06] hover:border-green-500/30 hover:bg-green-500/[0.02]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS}
                onChange={handleInputChange}
                className="hidden"
              />

              {uploading ? (
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                    <FileImage size={20} className="text-green-400" />
                  </div>
                  <p className="text-sm text-zinc-400">Uploading... {uploadProgress}%</p>
                  <div className="w-full max-w-xs mx-auto h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      className="h-full bg-green-500 rounded-full"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                    <Upload size={20} className="text-green-400" />
                  </div>
                  <p className="text-sm text-zinc-300">
                    {hasExistingImage || imagePreview
                      ? 'Drop a new image or click to replace'
                      : 'Drop an image here or click to browse'}
                  </p>
                  <p className="text-xs text-zinc-600">JPG, JPEG, PNG, WEBP (max 5MB)</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-5 border-t border-white/[0.04]">
          <button
            onClick={onClose}
            disabled={uploading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading || saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-400 text-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                {uploadProgress}%
              </>
            ) : (
              <>
                <Upload size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AddFormSection = ({ onCreated, showToast }) => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef(null);
  const xhrRef = useRef(null);

  const reset = () => {
    setTitle('');
    setYear('');
    setImageFile(null);
    setImagePreview('');
    setUploadProgress(0);
    setUploading(false);
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      showToast('Only JPG, JPEG, PNG, and WEBP files are allowed', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size must be under 5MB', 'error');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files[0]);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !year.trim()) return;

    setUploading(true);
    setUploadProgress(0);

    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('year', year.trim());
    if (imageFile) formData.append('image', imageFile);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      setUploading(false);
      setUploadProgress(0);
      xhrRef.current = null;
      if (xhr.status >= 200 && xhr.status < 300) {
        reset();
        setOpen(false);
        onCreated();
      } else {
        try {
          const result = JSON.parse(xhr.responseText);
          showToast(result.message || 'Failed to create achievement', 'error');
        } catch {
          showToast('Failed to create achievement', 'error');
        }
      }
    });

    xhr.addEventListener('error', () => {
      setUploading(false);
      setUploadProgress(0);
      xhrRef.current = null;
      showToast('Network error', 'error');
    });

    xhr.addEventListener('abort', () => {
      setUploading(false);
      setUploadProgress(0);
      xhrRef.current = null;
    });

    xhr.open('POST', `${API_BASE}/api/admin/achievements`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
    >
      <button
        onClick={() => { setOpen(!open); if (!open) reset(); }}
        className="flex items-center gap-2 text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
      >
        <Plus size={16} />
        {open ? 'Cancel' : 'Add New Achievement'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Achievement title"
                  className="w-full bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Year</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2026"
                  className="w-full bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1.5">Image (optional)</label>

                {/* Preview */}
                {imagePreview && (
                  <div className="relative mb-3">
                    <div className="w-full h-32 rounded-xl overflow-hidden border border-white/[0.06] bg-[#050505]">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={() => { setImageFile(null); setImagePreview(''); }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/[0.08] text-zinc-400 hover:text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}

                {/* Drag-and-drop zone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 transition-all duration-300 text-center ${
                    dragOver
                      ? 'border-green-400 bg-green-500/5'
                      : 'border-white/[0.06] hover:border-green-500/30 hover:bg-green-500/[0.02]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={ACCEPTED_EXTENSIONS}
                    onChange={handleInputChange}
                    className="hidden"
                  />

                  {uploading ? (
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                        <FileImage size={20} className="text-green-400" />
                      </div>
                      <p className="text-sm text-zinc-400">Uploading... {uploadProgress}%</p>
                      <div className="w-full max-w-xs mx-auto h-2 rounded-full bg-white/[0.04] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-green-500 rounded-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                        <Upload size={20} className="text-green-400" />
                      </div>
                      <p className="text-sm text-zinc-300">Drop an image here or click to browse</p>
                      <p className="text-xs text-zinc-600">JPG, JPEG, PNG, WEBP (max 5MB)</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={uploading || !title.trim() || !year.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-400 text-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Create Achievement
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AdminAchievements = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [editTarget, setEditTarget] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const clearToast = () => setToast(null);

  const fetchData = useCallback(() => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) {
      navigate('/admin-login', { replace: true });
      return;
    }
    setLoading(true);
    getAdminAchievements(token)
      .then((res) => setAchievements(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenEdit = (ach) => {
    setEditTarget(ach);
    setEditOpen(true);
  };

  const handleEditSave = (updated) => {
    setAchievements((prev) =>
      prev.map((a) => (a._id === updated._id ? updated : a))
    );
    setEditOpen(false);
    setEditTarget(null);
    showToast('Achievement updated successfully');
    fetchData();
  };

  const handleToggleActive = async (ach) => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    const formData = new FormData();
    formData.append('isActive', !ach.isActive);

    setSaving(true);
    try {
      await updateAchievement(token, ach._id, formData);
      showToast(ach.isActive ? 'Achievement disabled' : 'Achievement enabled');
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

    setSaving(true);
    try {
      await deleteAchievement(token, id);
      showToast('Achievement deleted');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveUp = async (index) => {
    if (index === 0) return;
    const updated = [...achievements];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setAchievements(updated);

    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;
    try {
      await reorderAchievements(token, updated.map((a, i) => ({ id: a._id, displayOrder: i })));
    } catch (err) {
      showToast(err.message, 'error');
      fetchData();
    }
  };

  const handleMoveDown = async (index) => {
    if (index === achievements.length - 1) return;
    const updated = [...achievements];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setAchievements(updated);

    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;
    try {
      await reorderAchievements(token, updated.map((a, i) => ({ id: a._id, displayOrder: i })));
    } catch (err) {
      showToast(err.message, 'error');
      fetchData();
    }
  };

  const handleRemoveImage = async (ach) => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    const formData = new FormData();
    formData.append('removeImage', 'true');

    setSaving(true);
    try {
      await updateAchievement(token, ach._id, formData);
      showToast('Image removed');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Achievements" subtitle="Manage award cards displayed on the Achievements page." titleIcon={Trophy}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      <AddFormSection onCreated={fetchData} showToast={showToast} />

      {/* List */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Trophy size={18} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">All Achievements</h2>
            <p className="text-xs text-zinc-500">{achievements.length} total</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : achievements.length === 0 ? (
          <div className="text-center py-12 text-zinc-600 text-sm">
            No achievements yet. Add one above.
          </div>
        ) : (
          <div className="space-y-2">
            {achievements.map((ach, index) => (
              <div
                key={ach._id}
                className={`rounded-2xl border p-4 transition-all duration-300 ${
                  ach.isActive === false ? 'border-red-500/20 bg-red-500/5 opacity-60' : 'border-white/[0.04] bg-[#0A0A0A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-0.5 opacity-40">
                    <button onClick={() => handleMoveUp(index)} disabled={index === 0 || saving} className="hover:text-green-400 disabled:opacity-30 transition-colors"><ArrowUp size={12} /></button>
                    <button onClick={() => handleMoveDown(index)} disabled={index === achievements.length - 1 || saving} className="hover:text-green-400 disabled:opacity-30 transition-colors"><ArrowDown size={12} /></button>
                  </div>

                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-br from-green-400/20 to-emerald-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                    {ach.image ? (
                      <img src={`${API_BASE}${ach.image}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Trophy size={16} className="text-green-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{ach.title}</p>
                    <p className="text-xs text-zinc-500">{ach.year}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {ach.image && (
                      <button
                        onClick={() => handleRemoveImage(ach)}
                        disabled={saving}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Remove image"
                      >
                        <Image size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenEdit(ach)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-green-400 hover:bg-green-500/10 transition-all"
                      title="Edit"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button
                      onClick={() => handleToggleActive(ach)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all"
                      title={ach.isActive ? 'Disable' : 'Enable'}
                    >
                      {ach.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(ach._id)}
                      disabled={saving}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            <Eye size={18} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Preview</h2>
            <p className="text-xs text-zinc-500">How cards appear on the Achievements page</p>
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-40" />
        ) : achievements.length === 0 ? (
          <div className="text-center py-8 text-zinc-600 text-sm">No achievements to preview</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {achievements.filter((a) => a.isActive !== false).slice(0, 5).map((ach) => (
              <div
                key={ach._id}
                className="bg-[#050505] rounded-xl p-4 border border-white/[0.04] flex flex-col items-center text-center min-h-[180px]"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-500/10 border border-green-500/20 flex items-center justify-center mb-3 overflow-hidden">
                  {ach.image ? (
                    <img src={`${API_BASE}${ach.image}`} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Trophy size={18} className="text-green-400" />
                  )}
                </div>
                <h3 className="text-white text-xs font-semibold leading-snug mb-2 flex-1">{ach.title}</h3>
                <span className="text-green-400/70 text-sm font-mono tracking-wider">{ach.year}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <EditModal
        achievement={editTarget}
        open={editOpen}
        onClose={() => { setEditOpen(false); setEditTarget(null); }}
        onSave={handleEditSave}
        saving={saving}
        showToast={showToast}
      />
    </AdminLayout>
  );
};

export default AdminAchievements;
