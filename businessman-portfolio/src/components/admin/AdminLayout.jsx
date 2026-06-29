import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Shield,
  Mail,
  LogOut,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
  Home,
  Trophy,
  Calendar,
  MessageSquare,
  CalendarCheck,
  BarChart3,
  Users,
  TrendingUp,
  Settings,
  User,
  Briefcase,
  FileText,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/[0.03] rounded-2xl ${className}`} />
);

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/homepage', icon: Home, label: 'Homepage' },
  { to: '/admin/founder', icon: User, label: 'Founder' },
  { to: '/admin/achievements', icon: Trophy, label: 'Achievements' },
  { to: '/admin/presentations', icon: FileText, label: 'Presentations' },
  { to: '/admin/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/admin/contacts', icon: MessageSquare, label: 'Contacts' },
  { to: '/admin/consultations', icon: CalendarCheck, label: 'Consultations' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/plans', icon: Briefcase, label: 'Plans' },
  { to: '/admin/team', icon: Users, label: 'Team' },
  { to: '/admin/market-dashboard', icon: TrendingUp, label: 'Market' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

const SidebarLink = ({ to, icon: Icon, label, isActive }) => (
  <NavLink
    to={to}
    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
      isActive
        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
        : 'text-zinc-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
    }`}
  >
    <Icon size={18} />
    {label}
  </NavLink>
);

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className={`fixed top-4 right-4 left-4 sm:left-auto z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-xl backdrop-blur-xl ${
        type === 'success'
          ? 'bg-green-500/10 border-green-500/20 text-green-400'
          : 'bg-red-500/10 border-red-500/20 text-red-400'
      }`}
    >
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
        &times;
      </button>
    </motion.div>
  );
};

const AdminLayout = ({ title, subtitle, children, titleIcon: TitleIcon, onLogout }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin-login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top header */}
      <header className="border-b border-white/[0.04] bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-green-400 hover:bg-green-500/10 transition-all mr-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                <Shield size={18} className="text-background" />
              </div>
              <div>
                <span className="text-lg font-bold text-white">Admin</span>
                {title && <span className="text-xs text-zinc-600 ml-2 hidden sm:inline">{title}</span>}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-400 items-center gap-2 hidden sm:flex">
                <Mail size={14} />
                {admin?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-white/[0.04] transition-all duration-300"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar overlay backdrop */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r border-white/[0.04] transform transition-transform duration-300 ease-in-out overflow-y-auto lg:relative lg:w-56 lg:border-0 lg:bg-transparent lg:translate-x-0 lg:overflow-visible ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:block`}
          >
            <div className="bg-[#0A0A0A] rounded-2xl border border-white/[0.04] p-3 space-y-1 min-h-[200px] lg:min-h-0">
              {/* Admin info */}
              <div className="px-4 py-3 mb-2 border-b border-white/[0.04]">
                <p className="text-sm font-semibold text-white truncate">{admin?.name || 'Admin'}</p>
                <p className="text-xs text-zinc-500 truncate">{admin?.email}</p>
              </div>

              {navItems.map((item) => (
                <SidebarLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.to}
                />
              ))}

              <div className="pt-2 mt-2 border-t border-white/[0.04]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all duration-300"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Content */}
          <div className="flex-1 space-y-6">
            {/* Page title */}
            {title && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="mb-2"
              >
                <div className="flex items-center gap-3">
                  {TitleIcon && (
                    <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <TitleIcon size={18} className="text-green-400" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                    {subtitle && <p className="text-zinc-400 text-sm mt-0.5">{subtitle}</p>}
                  </div>
                </div>
              </motion.div>
            )}

            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export { Toast };
export default AdminLayout;
