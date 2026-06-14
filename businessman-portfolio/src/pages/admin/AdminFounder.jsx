import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Save,
  RotateCcw,
  User,
  Upload,
  Trash2,
  Link,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Image,
} from 'lucide-react';
import AdminLayout, { fadeInUp, Skeleton, Toast } from '@/components/admin/AdminLayout';
import { getFounder, updateFounder } from '@/config/admin';

const API_BASE = import.meta.env.VITE_API_URL || '';

const InputField = ({ label, icon: Icon, value, onChange, placeholder, type = 'text', multiline }) => {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
        {Icon && <Icon size={12} />}
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all duration-300 resize-none"
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all duration-300"
        />
      )}
    </div>
  );
};

const ImageUpload = ({ label, currentImage, onImageSelect, onRemove, uploading }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      alert('Only JPG, JPEG, PNG, and WEBP files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setPreview(URL.createObjectURL(file));
    onImageSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
    onRemove();
  };

  const imageUrl = preview || (currentImage ? `${API_BASE}${currentImage}` : null);

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
        <Image size={12} />
        {label}
      </label>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-xl border border-white/[0.06] bg-[#050505] overflow-hidden flex items-center justify-center shrink-0">
          {imageUrl ? (
            <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
          ) : (
            <User size={32} className="text-zinc-600" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="hidden"
            id={`file-${label}`}
          />
          <label
            htmlFor={`file-${label}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all duration-300 cursor-pointer"
          >
            <Upload size={14} />
            {uploading ? 'Uploading...' : 'Choose Image'}
          </label>
          {imageUrl && (
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300"
            >
              <Trash2 size={14} />
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminFounder = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: '',
    title: '',
    shortDescription: '',
    bio: '',
    linkedinUrl: '',
    twitterUrl: '',
    telegramUrl: '',
    email: '',
    phone: '',
  });
  const [originalForm, setOriginalForm] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [existingProfilePhoto, setExistingProfilePhoto] = useState('');
  const [existingCoverImage, setExistingCoverImage] = useState('');
  const [removeProfilePhoto, setRemoveProfilePhoto] = useState(false);
  const [removeCoverImage, setRemoveCoverImage] = useState(false);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const clearToast = () => setToast(null);

  const fetchData = () => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) {
      navigate('/admin-login', { replace: true });
      return;
    }

    setLoading(true);
    getFounder(token)
      .then((res) => {
        const data = res.data;
        const defaults = {
          name: data.name || '',
          title: data.title || '',
          shortDescription: data.shortDescription || '',
          bio: data.bio || '',
          linkedinUrl: data.linkedinUrl || '',
          twitterUrl: data.twitterUrl || '',
          telegramUrl: data.telegramUrl || '',
          email: data.email || '',
          phone: data.phone || '',
        };
        setForm(defaults);
        setOriginalForm(defaults);
        setExistingProfilePhoto(data.profilePhoto || '');
        setExistingCoverImage(data.coverImage || '');
        setProfilePhoto(null);
        setCoverImage(null);
        setRemoveProfilePhoto(false);
        setRemoveCoverImage(false);
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const hasChanges = () => {
    if (!originalForm) return false;
    return JSON.stringify(form) !== JSON.stringify(originalForm)
      || profilePhoto !== null
      || coverImage !== null
      || removeProfilePhoto
      || removeCoverImage;
  };

  const handleReset = () => {
    if (originalForm) {
      setForm(originalForm);
      setProfilePhoto(null);
      setCoverImage(null);
      setRemoveProfilePhoto(false);
      setRemoveCoverImage(false);
    }
    showToast('Changes discarded');
  };

  const handleSave = async () => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (profilePhoto) formData.append('profilePhoto', profilePhoto);
      if (coverImage) formData.append('coverImage', coverImage);
      if (removeProfilePhoto) formData.append('removeProfilePhoto', 'true');
      if (removeCoverImage) formData.append('removeCoverImage', 'true');

      const res = await updateFounder(token, formData);
      showToast('Founder profile saved');

      const data = res.data;
      setForm({
        name: data.name || '',
        title: data.title || '',
        shortDescription: data.shortDescription || '',
        bio: data.bio || '',
        linkedinUrl: data.linkedinUrl || '',
        twitterUrl: data.twitterUrl || '',
        telegramUrl: data.telegramUrl || '',
        email: data.email || '',
        phone: data.phone || '',
      });
      setOriginalForm({
        name: data.name || '',
        title: data.title || '',
        shortDescription: data.shortDescription || '',
        bio: data.bio || '',
        linkedinUrl: data.linkedinUrl || '',
        twitterUrl: data.twitterUrl || '',
        telegramUrl: data.telegramUrl || '',
        email: data.email || '',
        phone: data.phone || '',
      });
      setExistingProfilePhoto(data.profilePhoto || '');
      setExistingCoverImage(data.coverImage || '');
      setProfilePhoto(null);
      setCoverImage(null);
      setRemoveProfilePhoto(false);
      setRemoveCoverImage(false);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Founder Profile" subtitle="Manage your founder profile photo and details." titleIcon={User}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Images Section */}
          <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04] space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Image size={18} className="text-green-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Photos</h2>
                <p className="text-xs text-zinc-500">Profile photo and cover image</p>
              </div>
            </div>

            <ImageUpload
              label="Profile Photo"
              currentImage={removeProfilePhoto ? '' : existingProfilePhoto}
              onImageSelect={(file) => {
                setProfilePhoto(file);
                setRemoveProfilePhoto(false);
              }}
              onRemove={() => {
                setProfilePhoto(null);
                setRemoveProfilePhoto(true);
              }}
              uploading={saving}
            />

            <ImageUpload
              label="Cover Image"
              currentImage={removeCoverImage ? '' : existingCoverImage}
              onImageSelect={(file) => {
                setCoverImage(file);
                setRemoveCoverImage(false);
              }}
              onRemove={() => {
                setCoverImage(null);
                setRemoveCoverImage(true);
              }}
              uploading={saving}
            />
          </div>

          {/* Basic Info Section */}
          <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <User size={18} className="text-green-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Basic Information</h2>
                <p className="text-xs text-zinc-500">Name, title, and description</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Founder Name"
                icon={User}
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                placeholder="Balraj"
              />
              <InputField
                label="Founder Title"
                icon={Globe}
                value={form.title}
                onChange={(v) => setForm({ ...form, title: v })}
                placeholder="Crypto Investment Advisor"
              />
            </div>

            <div className="mt-4">
              <InputField
                label="Short Description"
                icon={MessageSquare}
                value={form.shortDescription}
                onChange={(v) => setForm({ ...form, shortDescription: v })}
                placeholder="Brief description for hero section..."
                multiline
              />
            </div>

            <div className="mt-4">
              <InputField
                label="Bio"
                icon={MessageSquare}
                value={form.bio}
                onChange={(v) => setForm({ ...form, bio: v })}
                placeholder="Full biography..."
                multiline
              />
            </div>
          </div>

          {/* Contact & Social Section */}
          <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Link size={18} className="text-green-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Contact & Social</h2>
                <p className="text-xs text-zinc-500">Social links and contact details</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="LinkedIn URL"
                icon={Link}
                value={form.linkedinUrl}
                onChange={(v) => setForm({ ...form, linkedinUrl: v })}
                placeholder="https://linkedin.com/in/..."
              />
              <InputField
                label="Twitter / X URL"
                icon={Link}
                value={form.twitterUrl}
                onChange={(v) => setForm({ ...form, twitterUrl: v })}
                placeholder="https://x.com/..."
              />
              <InputField
                label="Telegram URL"
                icon={Link}
                value={form.telegramUrl}
                onChange={(v) => setForm({ ...form, telegramUrl: v })}
                placeholder="https://t.me/..."
              />
              <InputField
                label="Email"
                icon={Mail}
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                placeholder="balraj@example.com"
              />
              <InputField
                label="Phone"
                icon={Phone}
                type="tel"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleReset}
              disabled={!hasChanges() || saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 border border-white/[0.06] hover:border-white/[0.12] hover:text-zinc-200 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges() || saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-400 text-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </motion.div>
      )}
    </AdminLayout>
  );
};

export default AdminFounder;
