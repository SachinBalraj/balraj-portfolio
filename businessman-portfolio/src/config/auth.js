const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const loginAdmin = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Login failed');
  return result;
};

export const getMe = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Unauthorized');
  return result;
};
