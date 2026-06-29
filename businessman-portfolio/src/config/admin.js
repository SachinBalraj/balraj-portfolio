const API_BASE_URL = import.meta.env.VITE_API_URL || '';

if (typeof window !== 'undefined' && !import.meta.env.VITE_API_URL) {
  console.warn(
    '%c[Admin] VITE_API_URL is not set.%c API calls will use relative URLs. ' +
    'Set VITE_API_URL in your Vercel project environment variables for production.',
    'color: #f59e0b; font-weight: bold',
    'color: inherit'
  );
}

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const getDashboardData = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load dashboard');
  return result;
};

export const getContacts = async (token, params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);
  if (params.isRead !== undefined) query.set('isRead', params.isRead);
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);

  const response = await fetch(`${API_BASE_URL}/api/admin/contacts?${query}`, {
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load contacts');
  return result;
};

export const markContactRead = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/contacts/${id}/read`, {
    method: 'PATCH',
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to mark as read');
  return result;
};

export const deleteContact = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/contacts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to delete contact');
  return result;
};

export const getConsultations = async (token, params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.startDate) query.set('startDate', params.startDate);
  if (params.endDate) query.set('endDate', params.endDate);
  if (params.status) query.set('status', params.status);
  if (params.page) query.set('page', params.page);
  if (params.limit) query.set('limit', params.limit);

  const response = await fetch(`${API_BASE_URL}/api/admin/consultations?${query}`, {
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load consultations');
  return result;
};

export const updateConsultationStatus = async (token, id, status) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/consultations/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update status');
  return result;
};

export const deleteConsultation = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/consultations/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to delete consultation');
  return result;
};

export const getHomepageStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/homepage-stats`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load stats');
  return result;
};

export const getAdminHomepageStats = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/homepage-stats`, {
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load stats');
  return result;
};

export const updateHomepageStats = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/homepage-stats`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update stats');
  return result;
};

export const getAnalytics = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/analytics`, {
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load analytics');
  return result;
};

export const getAdminProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/settings/profile`, {
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load profile');
  return result;
};

export const updateAdminProfile = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/settings/profile`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update profile');
  return result;
};

export const changeAdminPassword = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/settings/password`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to change password');
  return result;
};

export const getTeamCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/api/team`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load team');
  return result;
};

export const getAdminTeamCategories = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/team`, {
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load team');
  return result;
};

export const createTeamCategory = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/team`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create category');
  return result;
};

export const updateTeamCategory = async (token, id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/team/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update category');
  return result;
};

export const deleteTeamCategory = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/team/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to delete category');
  return result;
};

export const reorderTeamCategories = async (token, items) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/team/reorder`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ items }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to reorder categories');
  return result;
};

export const getMarketDashboard = async () => {
  const response = await fetch(`${API_BASE_URL}/api/market-dashboard`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load market dashboard');
  return result;
};

export const getAdminMarketDashboard = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/market-dashboard`, {
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load market dashboard');
  return result;
};

export const updateMarketDashboard = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/market-dashboard`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update market dashboard');
  return result;
};

export const getAchievements = async () => {
  const response = await fetch(`${API_BASE_URL}/api/achievements`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load achievements');
  return result;
};

export const getAdminAchievements = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/achievements`, {
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load achievements');
  return result;
};

export const createAchievement = async (token, formData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/achievements`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create achievement');
  return result;
};

export const updateAchievement = async (token, id, formData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/achievements/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update achievement');
  return result;
};

export const deleteAchievement = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/achievements/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to delete achievement');
  return result;
};

export const reorderAchievements = async (token, items) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/achievements/reorder`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ items }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to reorder achievements');
  return result;
};

export const getAdminAvailability = async (token, date) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/availability/${date}`, {
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load availability');
  return result;
};

export const updateDateAvailability = async (token, date, slots) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/availability/${date}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ slots }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update availability');
  return result;
};

export const getFounder = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/founder`, {
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load founder');
  return result;
};

export const updateFounder = async (token, formData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/founder`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update founder');
  return result;
};

export const getPlans = async () => {
  const response = await fetch(`${API_BASE_URL}/api/plans`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load plans');
  return result;
};

export const getAdminPlans = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/plans`, {
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load plans');
  return result;
};

export const createPlan = async (token, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/plans`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create plan');
  return result;
};

export const updatePlan = async (token, id, data) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/plans/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update plan');
  return result;
};

export const deletePlan = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/plans/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to delete plan');
  return result;
};

export const reorderPlans = async (token, items) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/plans/reorder`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ items }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to reorder plans');
  return result;
};

export const uploadPlanFile = async (token, id, file) => {
  const formData = new FormData();
  formData.append('planFile', file);
  const response = await fetch(`${API_BASE_URL}/api/admin/plans/${id}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to upload file');
  return result;
};

export const getAdminPresentations = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/presentations`, {
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load presentations');
  return result;
};

export const createPresentation = async (token, formData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/presentations`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to create presentation');
  return result;
};

export const updatePresentation = async (token, id, formData) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/presentations/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update presentation');
  return result;
};

export const deletePresentation = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/presentations/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to delete presentation');
  return result;
};

export const reorderPresentations = async (token, items) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/presentations/reorder`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ items }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to reorder presentations');
  return result;
};

export const deletePlanFile = async (token, id) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/plans/${id}/file`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to delete file');
  return result;
};

export const bulkSetAvailability = async (token, date, status) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/availability/${date}/bulk`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to bulk update availability');
  return result;
};
