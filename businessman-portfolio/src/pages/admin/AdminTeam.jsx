import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Minus,
  Save,
  Users,
  Trash2,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react';
import AdminLayout, { fadeInUp, Skeleton, Toast } from '@/components/admin/AdminLayout';
import {
  getAdminTeamCategories,
  createTeamCategory,
  updateTeamCategory,
  deleteTeamCategory,
  reorderTeamCategories,
} from '@/config/admin';

const AdminTeam = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [categories, setCategories] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const showToast = (message, type = 'success') => setToast({ message, type });
  const clearToast = () => setToast(null);

  const fetchData = () => {
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) {
      navigate('/admin-login', { replace: true });
      return;
    }

    setLoading(true);
    getAdminTeamCategories(token)
      .then((res) => setCategories(res.data))
      .catch((err) => showToast(err.message, 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    setSaving(true);
    try {
      await createTeamCategory(token, { categoryName: newCategoryName.trim() });
      setNewCategoryName('');
      showToast('Category created');
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMember = async (catIndex) => {
    const cat = categories[catIndex];
    if (cat.members.length >= 5) {
      showToast('Maximum 5 members per category', 'error');
      return;
    }

    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    const updatedMembers = [...cat.members, { name: '' }];
    setSaving(true);
    try {
      const res = await updateTeamCategory(token, cat._id, { members: updatedMembers });
      const updated = [...categories];
      updated[catIndex] = res.data;
      setCategories(updated);
      showToast('Member added');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (catIndex, memberIndex) => {
    const cat = categories[catIndex];
    const updatedMembers = cat.members.filter((_, i) => i !== memberIndex);

    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    setSaving(true);
    try {
      const res = await updateTeamCategory(token, cat._id, { members: updatedMembers });
      const updated = [...categories];
      updated[catIndex] = res.data;
      setCategories(updated);
      showToast('Member removed');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleMemberChange = async (catIndex, memberIndex, value) => {
    const updated = [...categories];
    updated[catIndex].members[memberIndex].name = value;
    setCategories(updated);
  };

  const handleSaveMembers = async (catIndex) => {
    const cat = categories[catIndex];
    const sanitized = cat.members.map((m) => ({ name: m.name || 'Unnamed' }));

    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    setSaving(true);
    try {
      const res = await updateTeamCategory(token, cat._id, { members: sanitized });
      const updated = [...categories];
      updated[catIndex] = res.data;
      setCategories(updated);
      showToast('Members saved');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryNameChange = (catIndex, value) => {
    const updated = [...categories];
    updated[catIndex].categoryName = value;
    setCategories(updated);
  };

  const handleSaveCategoryName = async (catIndex) => {
    const cat = categories[catIndex];
    if (!cat.categoryName.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    setSaving(true);
    try {
      const res = await updateTeamCategory(token, cat._id, {
        categoryName: cat.categoryName.trim(),
      });
      const updated = [...categories];
      updated[catIndex] = res.data;
      setCategories(updated);
      showToast('Category name saved');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (catIndex) => {
    const cat = categories[catIndex];
    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    setSaving(true);
    try {
      await deleteTeamCategory(token, cat._id);
      showToast(`"${cat.categoryName}" deleted`);
      fetchData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveUp = async (catIndex) => {
    if (catIndex === 0) return;
    const updated = [...categories];
    [updated[catIndex - 1], updated[catIndex]] = [updated[catIndex], updated[catIndex - 1]];
    setCategories(updated);

    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    try {
      const items = updated.map((cat, i) => ({ id: cat._id, order: i }));
      await reorderTeamCategories(token, items);
    } catch (err) {
      showToast(err.message, 'error');
      fetchData();
    }
  };

  const handleMoveDown = async (catIndex) => {
    if (catIndex === categories.length - 1) return;
    const updated = [...categories];
    [updated[catIndex], updated[catIndex + 1]] = [updated[catIndex + 1], updated[catIndex]];
    setCategories(updated);

    const token = localStorage.getItem('balraj_admin_token');
    if (!token) return;

    try {
      const items = updated.map((cat, i) => ({ id: cat._id, order: i }));
      await reorderTeamCategories(token, items);
    } catch (err) {
      showToast(err.message, 'error');
      fetchData();
    }
  };

  return (
    <AdminLayout title="Team Management" subtitle="Manage team categories and members." titleIcon={Users}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      {/* Add New Category */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Plus size={18} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Add New Category</h2>
          </div>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            placeholder="Category name"
            className="flex-1 bg-[#050505] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all duration-300"
          />
          <button
            onClick={handleAddCategory}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-green-500 hover:bg-green-400 text-background transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </motion.div>

      {/* Categories List */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/[0.04]"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Users size={18} className="text-green-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Categories</h2>
            <p className="text-xs text-zinc-500">{categories.length} total</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12 text-zinc-600 text-sm">
            No categories yet. Create one above.
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat, catIndex) => {
              const isOpen = expandedIndex === catIndex;
              const members = cat.members || [];
              return (
                <motion.div
                  key={cat._id}
                  layout
                  className={`rounded-2xl border transition-all duration-500 ${
                    isOpen
                      ? 'border-green-500/30 bg-[#0C0C0C]'
                      : 'border-white/[0.04] bg-[#0A0A0A] hover:border-white/[0.08]'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 p-4">
                    <div className="flex flex-col gap-0.5 opacity-40">
                      <button
                        onClick={() => handleMoveUp(catIndex)}
                        disabled={catIndex === 0 || saving}
                        className="hover:text-green-400 disabled:opacity-30 transition-colors"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => handleMoveDown(catIndex)}
                        disabled={catIndex === categories.length - 1 || saving}
                        className="hover:text-green-400 disabled:opacity-30 transition-colors"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>

                    <button
                      onClick={() => setExpandedIndex(isOpen ? null : catIndex)}
                      className="flex-1 flex items-center justify-between min-w-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                          isOpen
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-white/[0.04] text-zinc-500'
                        }`}>
                          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                        </div>
                        <h3 className={`text-sm font-bold truncate transition-colors duration-300 ${
                          isOpen ? 'text-green-400' : 'text-white'
                        }`}>
                          {cat.categoryName}
                        </h3>
                        <span className="text-xs text-zinc-600 shrink-0">
                          {members.length}/5
                        </span>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="text"
                        value={cat.categoryName}
                        onChange={(e) => handleCategoryNameChange(catIndex, e.target.value)}
                        onBlur={() => handleSaveCategoryName(catIndex)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSaveCategoryName(catIndex)}
                        className="w-28 bg-[#050505] border border-white/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 transition-all duration-300"
                        placeholder="Edit name"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCategory(catIndex);
                        }}
                        disabled={saving}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Members */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0">
                          <div className="w-full h-px bg-gradient-to-r from-green-500/20 via-green-500/10 to-transparent mb-4" />

                          <div className="space-y-2">
                            {members.map((member, memIndex) => (
                              <div key={member._id || memIndex} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400/60 shrink-0" />
                                <input
                                  type="text"
                                  value={member.name}
                                  onChange={(e) => handleMemberChange(catIndex, memIndex, e.target.value)}
                                  placeholder="Member name"
                                  className="flex-1 bg-[#050505] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-green-500/40 focus:ring-1 focus:ring-green-500/20 transition-all duration-300"
                                />
                                <button
                                  onClick={() => handleRemoveMember(catIndex, memIndex)}
                                  disabled={saving}
                                  className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center gap-3 mt-4">
                            {members.length < 5 && (
                              <button
                                onClick={() => handleAddMember(catIndex)}
                                disabled={saving}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-green-400 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition-all duration-300 disabled:opacity-50"
                              >
                                <Plus size={14} />
                                Add Member
                              </button>
                            )}
                            <button
                              onClick={() => handleSaveMembers(catIndex)}
                              disabled={saving}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500 hover:bg-green-400 text-background transition-all duration-300 disabled:opacity-50"
                            >
                              <Save size={14} />
                              Save Members
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminTeam;
