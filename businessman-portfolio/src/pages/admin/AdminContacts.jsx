import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  CheckCheck,
  Trash2,
  Clock,
  Phone,
  Inbox,
  Calendar,
  Filter,
} from 'lucide-react';
import AdminLayout, { fadeInUp, Skeleton } from '@/components/admin/AdminLayout';
import { getContacts, markContactRead, deleteContact } from '@/config/admin';

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
        <h3 className="text-lg font-semibold text-white text-center mb-2">Delete Contact</h3>
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

const AdminContacts = () => {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const token = localStorage.getItem('balraj_admin_token');

  const fetchContacts = useCallback(async () => {
    if (!token) {
      navigate('/admin-login', { replace: true });
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await getContacts(token, {
        search,
        startDate,
        endDate,
        page,
        limit: 10,
      });
      setContacts(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, search, startDate, endDate, page, navigate]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

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

  const handleMarkRead = async (id) => {
    try {
      await markContactRead(token, id);
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isRead: true } : c))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteContact(token, deleteTarget);
      setContacts((prev) => prev.filter((c) => c._id !== deleteTarget));
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

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AdminLayout>
      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
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
              showFilters || startDate || endDate
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
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); setPage(1); }}
                className="h-10 px-4 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 border border-white/[0.04] hover:bg-white/[0.03] transition-all duration-300"
              >
                Clear
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
          <MessageSquare size={16} />
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
      ) : contacts.length === 0 ? (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="bg-[#0A0A0A] rounded-2xl p-12 border border-white/[0.04] text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-4">
            <Inbox size={28} className="text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">No messages found</h3>
          <p className="text-sm text-zinc-500">
            {search || startDate || endDate
              ? 'Try adjusting your search or filters.'
              : 'No contact messages have been submitted yet.'}
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
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-4 hidden xl:table-cell">Subject</th>
                  <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-4">Date</th>
                  <th className="text-center text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-4">Status</th>
                  <th className="text-right text-xs font-medium text-zinc-500 uppercase tracking-wider px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {contacts.map((contact) => (
                  <tr
                    key={contact._id}
                    className={`hover:bg-white/[0.015] transition-colors duration-200 ${!contact.isRead ? 'bg-green-500/[0.02]' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          contact.isRead
                            ? 'bg-zinc-800/50 text-zinc-500'
                            : 'bg-green-500/10 text-green-400 border border-green-500/20'
                        }`}>
                          {(contact.name?.charAt(0) || '?').toUpperCase()}
                        </div>
                        <div>
                          <p className={`text-sm ${contact.isRead ? 'text-zinc-300' : 'text-white font-medium'}`}>
                            {contact.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-zinc-400">{contact.email}</span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm text-zinc-500">{contact.phone}</span>
                    </td>
                    <td className="px-5 py-4 hidden xl:table-cell">
                      <span className="text-sm text-zinc-400 truncate block max-w-[180px]">
                        {contact.subject}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <Clock size={14} />
                        <span>{formatDate(contact.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        contact.isRead
                          ? 'bg-zinc-800/50 text-zinc-500'
                          : 'bg-green-500/10 text-green-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${contact.isRead ? 'bg-zinc-500' : 'bg-green-400'}`} />
                        {contact.isRead ? 'Read' : 'New'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!contact.isRead && (
                          <button
                            onClick={() => handleMarkRead(contact._id)}
                            className="p-2 rounded-lg text-zinc-500 hover:text-green-400 hover:bg-green-500/10 transition-all duration-300"
                            title="Mark as read"
                          >
                            <CheckCheck size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(contact._id)}
                          className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-white/[0.03]">
            {contacts.map((contact) => (
              <div key={contact._id} className={`p-4 ${!contact.isRead ? 'bg-green-500/[0.02]' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      contact.isRead
                        ? 'bg-zinc-800/50 text-zinc-500'
                        : 'bg-green-500/10 text-green-400 border border-green-500/20'
                    }`}>
                      {(contact.name?.charAt(0) || '?').toUpperCase()}
                    </div>
                    <div>
                      <p className={`text-sm ${contact.isRead ? 'text-zinc-300' : 'text-white font-medium'}`}>
                        {contact.name}
                      </p>
                      <p className="text-xs text-zinc-500">{contact.email}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    contact.isRead
                      ? 'bg-zinc-800/50 text-zinc-500'
                      : 'bg-green-500/10 text-green-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${contact.isRead ? 'bg-zinc-500' : 'bg-green-400'}`} />
                    {contact.isRead ? 'Read' : 'New'}
                  </span>
                </div>
                <div className="space-y-1 mb-3 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Phone size={12} />
                    {contact.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={12} />
                    {contact.subject}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    {formatDate(contact.createdAt)} at {formatTime(contact.createdAt)}
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-white/[0.04]">
                  {!contact.isRead && (
                    <button
                      onClick={() => handleMarkRead(contact._id)}
                      className="flex-1 h-9 rounded-lg text-xs font-medium text-green-400 bg-green-500/10 hover:bg-green-500/15 transition-all duration-300 flex items-center justify-center gap-1.5"
                    >
                      <CheckCheck size={14} />
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteTarget(contact._id)}
                    className="flex-1 h-9 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/15 transition-all duration-300 flex items-center justify-center gap-1.5"
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

export default AdminContacts;
