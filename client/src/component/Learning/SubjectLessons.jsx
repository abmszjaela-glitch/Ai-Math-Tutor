import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';

export default function SubjectLessons({ subject }) {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    async function get(path) {
      const response = await fetch(`${API_URL}${path}`, { credentials: 'include', signal: controller.signal });
      if (response.status === 401) { navigate('/login', { replace: true }); throw new Error('Please log in'); }
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Unable to load lessons');
      return data;
    }
    async function load() {
      try {
        const { student } = await get('/students/me');
        const { topics } = await get(`/curriculum/grades/${encodeURIComponent(student.grade.id)}/topics`);
        const topic = topics.find((item) => item.name === subject);
        if (!topic) { setLessons([]); return; }
        const data = await get(`/curriculum/topics/${encodeURIComponent(topic.id)}/lessons`);
        setLessons(data.lessons);
      } catch (error) { if (error.name !== 'AbortError') setError(error.message); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    }
    load();
    return () => controller.abort();
  }, [subject, navigate]);
  return <main className="container section-padding">
    <Link to="/dashboard">← Dashboard</Link>
    <h1>{subject}</h1>
    <p><Link to="/practice">Explore guided lessons & quizzes →</Link> · <Link to="/practice/tests">Take a mock test →</Link></p>
    {loading && <p role="status">Loading your lessons…</p>}
    {error && <p role="alert">{error}</p>}
    {!loading && !error && !lessons.length && <p>No lessons are available for your grade yet.</p>}
    <ul>{lessons.map((lesson) => <li key={lesson.id} style={{ marginBottom: 20 }}>
      <h2>{lesson.title}</h2><p>{lesson.description}</p>
      <Link to={`/tutor-session?lesson=${encodeURIComponent(lesson.id)}`}>Learn with your tutor →</Link>
    </li>)}</ul>
  </main>;
}
