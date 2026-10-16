import { API_URL } from '../../config/api';
export async function practiceRequest(path, options = {}) {
  const response = await fetch(`${API_URL}/practice${path}`, {
    credentials: 'include', ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  let data;
  try { data = await response.json(); } catch { throw new Error('The server could not be reached. Please try again.'); }
  if (!response.ok || !data.success) {
    const error = new Error(data.message || 'Unable to complete this request');
    error.status = response.status;
    throw error;
  }
  return data;
}
