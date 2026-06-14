const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const logPrefix = '[Auth]';

console.log(`${logPrefix} Using API_BASE_URL:`, API_BASE_URL || '(same origin — relative URLs)');

const parseJSON = async (response) => {
  try {
    return await response.json();
  } catch (parseErr) {
    const text = await response.text().catch(() => '');
    console.error(`${logPrefix} JSON parse failed. Status: ${response.status}, Body preview:`, text.substring(0, 500));
    throw new Error(
      `Server returned unexpected response (HTTP ${response.status}). ` +
      `If running on Vercel, ensure VITE_API_URL points to your deployed backend URL. ` +
      `If running locally, ensure the backend server is running.`
    );
  }
};

export const loginAdmin = async (email, password) => {
  const url = `${API_BASE_URL}/api/admin/login`;
  console.log(`${logPrefix} loginAdmin: POST`, url);

  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch (fetchErr) {
    console.error(`${logPrefix} loginAdmin: fetch failed —`, fetchErr);
    throw new Error(
      `Network error: unable to reach the server. ` +
      `Check that the backend is running and VITE_API_URL is correctly set in your Vercel project environment variables. ` +
      `(Details: ${fetchErr.message})`
    );
  }

  console.log(`${logPrefix} loginAdmin: response status`, response.status);

  const result = await parseJSON(response);

  if (!response.ok) {
    console.error(`${logPrefix} loginAdmin: API error —`, result);
    throw new Error(result.message || `Login failed (HTTP ${response.status})`);
  }

  console.log(`${logPrefix} loginAdmin: success`, result);
  return result;
};

export const getMe = async (token) => {
  const url = `${API_BASE_URL}/api/admin/me`;
  console.log(`${logPrefix} getMe: GET`, url);

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (fetchErr) {
    console.error(`${logPrefix} getMe: fetch failed —`, fetchErr);
    throw fetchErr;
  }

  console.log(`${logPrefix} getMe: response status`, response.status);

  const result = await parseJSON(response);

  if (!response.ok) {
    console.error(`${logPrefix} getMe: API error —`, result);
    throw new Error(result.message || 'Unauthorized');
  }

  console.log(`${logPrefix} getMe: success`, result);
  return result;
};
