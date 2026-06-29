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

export const getFounder = async () => {
  const response = await fetch(`${API_BASE_URL}/api/founder`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load founder');
  return result;
};

export const getPresentations = async () => {
  const response = await fetch(`${API_BASE_URL}/api/presentations`);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to load presentations');
  return result;
};
