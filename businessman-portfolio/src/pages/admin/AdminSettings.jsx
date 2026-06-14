import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Lock,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import AdminLayout, { fadeInUp, Skeleton, Toast } from '@/components/admin/AdminLayout';
import { useAuth } from '@/context/AuthContext';
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
} from '@/config/admin';

const AdminSettings = () => {
  const { updateAdmin } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const [profile, setProfile] = useState({ name: '', email: '' });
  const [originalProfile, setOriginalProfile] = useState(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const showToast = (message, type = 'success') => setToast({ message, type });
  const clearToast = () => setToast(null);

  useEffect(() => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) {
      navigate('/admin-login', { replace: true });
      return;
    }

    setLoading(true);
    getAdminProfile(token)
      .then((res) => {
        const data = res.data;
        setProfile({ name: data.name || '', email: data.email });
        setOriginalProfile({ name: data.name || '', email: data.email });
      })
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    if (!profile.email.trim()) {
      showToast('Email is required', 'error');
      return;
    }

    setSavingProfile(true);
    try {
      const payload = {};
      if (profile.name !== originalProfile.name) payload.name = profile.name;
      if (profile.email !== originalProfile.email) payload.email = profile.email;

      if (Object.keys(payload).length === 0) {
        showToast('No changes to save', 'error');
        setSavingProfile(false);
        return;
      }

      const res = await updateAdminProfile(token, payload);
      setOriginalProfile({ name: res.data.name, email: res.data.email });
      updateAdmin(res.data);
      showToast('Profile updated successfully');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showToast('All password fields are required', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await changeAdminPassword(token, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (res.token) {
        localStorage.setItem('balraj_admin_token', res.token);
      }

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Password changed successfully');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AdminLayout title="Settings" subtitle="Manage your account and security." titleIcon={Settings}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      {/* Profile Form */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <User size={18} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Profile Information</h2>
            <p className="text-xs text-zinc-500">Update your name and email</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : (
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your name"
                className="w-full bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="admin@example.com"
                className="w-full bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all duration-300"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-400 text-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </motion.div>

      {/* Password Form */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Lock size={18} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Change Password</h2>
            <p className="text-xs text-zinc-500">Update your account password</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password (min 6 characters)"
                  className="w-full bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="w-full bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingPassword}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-400 text-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock size={16} />
                {savingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminSettings;
