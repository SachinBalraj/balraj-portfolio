const API_BASE_URL = import.meta.env.VITE_API_URL || '';

if (typeof window !== 'undefined' && !import.meta.env.VITE_API_URL) {
  console.warn(
    '%c[API] VITE_API_URL is not set.%c API calls will use relative URLs (same origin). ' +
    'Set VITE_API_URL in your Vercel project environment variables for production.',
    'color: #f59e0b; font-weight: bold',
    'color: inherit'
  );
}

export { API_BASE_URL };

export const submitContact = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Something went wrong');
  return result;
};

export const submitConsultation = async (data) => {
  const response = await fetch(`${API_BASE_URL}/api/consultation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Something went wrong');
  return result;
};

export const getAvailability = async (date) => {
  const response = await fetch(`${API_BASE_URL}/api/availability/${date}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load availability');
  return result;
};

export const getFounder = async () => {
  const response = await fetch(`${API_BASE_URL}/api/founder`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load founder');
  return result;
};

export const getMonthAvailability = async (year, month) => {
  const response = await fetch(`${API_BASE_URL}/api/availability/month/${year}/${month}`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load month availability');
  return result;
};
