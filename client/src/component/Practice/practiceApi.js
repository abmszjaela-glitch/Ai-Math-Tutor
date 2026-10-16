import { API_URL } from '../../config/api';
export async function practiceRequest(path, options = {}) {
  const controller = new AbortController();
  const cancel = () => controller.abort(options.signal?.reason);
  if (options.signal?.aborted) cancel();
  else options.signal?.addEventListener('abort', cancel, { once: true });
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 20000);
  try {
    const response = await fetch(`${API_URL}/practice${path}`, {
      credentials: 'include', ...options, signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    let data;
    try { data = await response.json(); } catch { throw new Error('The server returned an unreadable response. Please try again.'); }
    if (!response.ok || !data?.success) {
      const error = new Error(data?.message || 'Unable to complete this request');
      error.status = response.status; error.code = data?.code;
      throw error;
    }
    return data;
  } catch (error) {
    if (timedOut) throw new Error('The request timed out. Your answers are kept; please try again.', { cause: error });
    throw error;
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', cancel);
  }
}
