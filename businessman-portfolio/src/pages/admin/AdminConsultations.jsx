import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Clock,
  Phone,
  PhoneCall,
  Inbox,
  Calendar,
  Filter,
  DollarSign,
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import AdminLayout, { fadeInUp, Skeleton } from '@/components/admin/AdminLayout';
import { getConsultations, updateConsultationStatus, deleteConsultation } from '@/config/admin';

const STATUS_CONFIG = {
  Pending: { icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  Contacted: { icon: PhoneCall, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400' },
  Converted: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', dot: 'bg-green-400' },
  Rejected: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', dot: 'bg-red-400' },
};

const STATUS_OPTIONS = ['Pending', 'Contacted', 'Converted', 'Rejected'];

const DeleteModal = ({ open, onClose, onConfirm, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04] max-w-sm w-full shadow-2xl"
      >
        <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white text-center mb-2">Delete Consultation</h3>
        <p className="text-sm text-zinc-400 text-center mb-6">
          Are you sure? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border border-white/[0.06] text-zinc-300 text-sm font-medium hover:bg-white/[0.03] transition-all duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-11 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-400 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color} ${cfg.border} border`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

const DROPDOWN_H = 160;
const DROPDOWN_W = 150;

const StatusSelect = ({ current, onChange }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    const compute = () => {
      if (!buttonRef.current) return false;
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUp = spaceBelow < DROPDOWN_H && spaceAbove >= DROPDOWN_H;
      const top = openUp ? rect.top - DROPDOWN_H - 4 : rect.bottom + 4;
      const left = Math.max(8, Math.min(rect.right - DROPDOWN_W, window.innerWidth - DROPDOWN_W - 8));
      setCoords({ top, left, openUp });
      return true;
    };
    compute();
    window.addEventListener('scroll', compute, true);
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute, true);
      window.removeEventListener('resize', compute);
    };
  }, [open]);

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="p-1 rounded-lg hover:bg-white/[0.03] transition-colors"
      >
        <StatusBadge status={current} />
      </button>
      {coords && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {createPortal(
            <div
              style={{
                position: 'fixed',
                top: coords.top,
                left: coords.left,
                zIndex: 9999,
              }}
              className="bg-[#0A0A0A] border border-white/[0.06] rounded-xl p-1.5 shadow-2xl min-w-[150px]"
            >
              {STATUS_OPTIONS.map((opt) => {
                const cfg = STATUS_CONFIG[opt];
                const Icon = cfg.icon;
                return (
                  <button
                    key={opt}
                    onClick={() => { onChange(opt); setOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      opt === current
                        ? `${cfg.bg} ${cfg.color}`
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]'
                    }`}
                  >
                    <Icon size={14} />
                    {opt}
                  </button>
                );
              })}
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  );
};

const AdminConsultations = () => {
  const navigate = useNavigate();

  const [consultations, setConsultations] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem('balraj_admin_token');

  const fetchConsultations = useCallback(async () => {
    if (!token) {
      navigate('/admin-login', { replace: true });
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await getConsultations(token, {
        search,
        startDate,
        endDate,
        status: statusFilter || undefined,
        page,
        limit: 10,
      });
      setConsultations(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, search, startDate, endDate, statusFilter, page, navigate]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearch('');
    setPage(1);
  };

  const handleStatusChange = async (id, newStatus) => {
    setConsultations((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
    );
    try {
      await updateConsultationStatus(token, id, newStatus);
    } catch (err) {
      setError(err.message);
      fetchConsultations();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteConsultation(token, deleteTarget);
      setConsultations((prev) => prev.filter((c) => c._id !== deleteTarget));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      setDeleteTarget(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const hasActiveFilters = search || startDate || endDate || statusFilter;

  return (
    <AdminLayout>
      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-6 space-y-3"
      >
        <div className="flex gap-3">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#0A0A0A] border border-white/[0.04] text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300"
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-11 px-4 rounded-xl border text-sm transition-all duration-300 flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-[#0A0A0A] border-white/[0.04] text-zinc-400 hover:border-white/[0.08]'
            }`}
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-end gap-3 p-4 rounded-xl bg-[#0A0A0A] border border-white/[0.04]"
          >
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
                className="h-10 px-3 rounded-lg bg-white/[0.03] border border-white/[0.04] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
                className="h-10 px-3 rounded-lg bg-white/[0.03] border border-white/[0.04] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="h-10 px-3 rounded-lg bg-white/[0.03] border border-white/[0.04] text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 min-w-[130px]"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); setStatusFilter(''); setSearch(''); setSearchInput(''); setPage(1); }}
                className="h-10 px-4 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 border border-white/[0.04] hover:bg-white/[0.03] transition-all duration-300"
              >
                Clear All
              </button>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6"
        >
          <AlertCircle size={16} />
          {error}
        </motion.div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : consultations.length === 0 ? (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-[#0A0A0A] rounded-2xl p-12 border border-white/[0.04] text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
            <Inbox size={28} className="text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No consultations found</h3>
          <p className="text-sm text-zinc-500">
            {hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : 'No consultation requests have been submitted yet.'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-[#0A0A0A] rounded-2xl border border-white/[0.04] overflow-hidden"
        >
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-4">Name</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-4">Email</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-4 hidden lg:table-cell">Phone</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-4 hidden xl:table-cell">Budget</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-4 hidden xl:table-cell">Meeting</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-4">Date</th>
                  <th className="text-center text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-4">Status</th>
                  <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {consultations.map((c) => (
                  <tr
                    key={c._id}
                    className="hover:bg-white/[0.015] transition-colors duration-200"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 flex items-center justify-center text-xs font-bold">
                          {(c.fullName?.charAt(0) || '?').toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium">{c.fullName}</p>
                          {c.company && (
                            <p className="text-xs text-zinc-500 flex items-center gap-1">
                              <Building2 size={11} />
                              {c.company}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-zinc-400">{c.email}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm text-zinc-500 flex items-center gap-1.5">
                        <Phone size={12} />
                        {c.phone}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <span className="text-sm text-zinc-400 flex items-center gap-1.5">
                        <DollarSign size={12} />
                        {c.investmentBudget}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <span className="text-sm text-zinc-500">
                        {c.meetingDate} at {c.meetingTime}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Clock size={14} />
                        <span>{formatDate(c.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <StatusSelect
                        current={c.status}
                        onChange={(newStatus) => handleStatusChange(c._id, newStatus)}
                      />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setDeleteTarget(c._id)}
                        className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-white/[0.03]">
            {consultations.map((c) => (
              <div key={c._id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 flex items-center justify-center text-xs font-bold">
                      {(c.fullName?.charAt(0) || '?').toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{c.fullName}</p>
                      <p className="text-xs text-zinc-500">{c.email}</p>
                    </div>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="space-y-1 mb-3 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Phone size={12} />
                    {c.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={12} />
                    {c.investmentBudget}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    {c.meetingDate} at {c.meetingTime}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} />
                    {formatDate(c.createdAt)}
                  </div>
                  {c.company && (
                    <div className="flex items-center gap-2">
                      <Building2 size={12} />
                      {c.company}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-2 border-t border-white/[0.04]">
                  <div className="flex-1">
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c._id, e.target.value)}
                      className="w-full h-9 rounded-lg text-xs font-medium bg-white/[0.03] border border-white/[0.06] text-zinc-300 focus:outline-none focus:ring-2 focus:ring-green-500/50 px-2"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => setDeleteTarget(c._id)}
                    className="h-9 px-3 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/15 transition-all duration-300 flex items-center justify-center gap-1.5"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 mt-6"
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>

          {Array.from({ length: pagination.pages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
            .map((p, idx, arr) => (
              <React.Fragment key={p}>
                {idx > 0 && arr[idx - 1] !== p - 1 && (
                  <span className="text-zinc-600 text-sm px-1">...</span>
                )}
                <button
                  onClick={() => setPage(p)}
                  className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all duration-300 ${
                    page === p
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            ))}

          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page >= pagination.pages}
            className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </motion.div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </AdminLayout>
  );
};

export default AdminConsultations;
