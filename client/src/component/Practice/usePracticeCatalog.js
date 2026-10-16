import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { practiceRequest } from './practiceApi';
export default function usePracticeCatalog() {
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, error: '', student: null, lessons: [] });
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    practiceRequest('/catalog', { signal: controller.signal })
      .then((data) => setState({ ...data, loading: false, error: '' }))
      .catch((error) => {
        if (error.name === 'AbortError') return;
        if (error.status === 401) navigate('/login', { replace: true });
        setState((old) => ({ ...old, loading: false, error: error.message }));
      });
    return () => controller.abort();
  }, [navigate, revision]);
  return { ...state, refresh: () => setRevision((v) => v + 1) };
}
