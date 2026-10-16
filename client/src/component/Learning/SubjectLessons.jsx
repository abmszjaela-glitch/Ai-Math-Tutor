import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';

const focusRing = 'app-focus-ring';

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

  return (
    <main className="container section-padding mx-auto max-w-5xl px-4 py-8 app-text sm:px-6 ">
      <Link
        to="/dashboard"
        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold app-muted transition app-hover-soft app-hover-link ${focusRing}`}
      >
        ← Dashboard
      </Link>

      {/* ---------- Header ---------- */}
      <div className="app-hero mb-8 mt-4 rounded-3xl p-6 app-on-primary shadow-2xl animate-shimmer sm:p-8">
        <span className="inline-block rounded-full app-badge px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em]">
          Your lessons
        </span>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{subject}</h1>
        {!loading && !error && lessons.length > 0 && (
          <p className="mt-1 app-on-primary">{lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'} ready for you</p>
        )}
      </div>

      {/* ---------- Loading skeleton ---------- */}
      {loading && (
        <div role="status" aria-live="polite" className="grid gap-4 sm:grid-cols-2">
          <span className="sr-only">Loading your lessons…</span>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-3xl border app-border app-surface p-6  ">
              <div className="mb-4 size-11 rounded-2xl app-primary-soft " />
              <div className="mb-3 h-5 w-3/4 rounded-full app-primary-soft " />
              <div className="mb-2 h-3 w-full rounded-full app-primary-soft " />
              <div className="h-3 w-2/3 rounded-full app-primary-soft " />
            </div>
          ))}
        </div>
      )}

      {/* ---------- Error ---------- */}
      {error && (
        <p role="alert" className="rounded-2xl border-l-4 app-error-border app-error-soft px-4 py-3.5 font-semibold app-error-text  ">
          {error}
        </p>
      )}

      {/* ---------- Empty ---------- */}
      {!loading && !error && !lessons.length && (
        <div className="grid justify-items-center gap-2 rounded-3xl border-2 border-dashed app-border app-soft px-6 py-12 text-center app-link   ">
          <span className="text-4xl" aria-hidden="true">📚</span>
          <p className="font-semibold">No lessons are available for your grade yet.</p>
        </div>
      )}

      {/* ---------- Lessons ---------- */}
      <ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2">
        {lessons.map((lesson, i) => (
          <li
            key={lesson.id}
            style={{ animationDelay: `${i * 70}ms` }}
            className="group flex animate-fade-up flex-col rounded-3xl border app-border app-surface p-6 shadow-xl  transition hover:-translate-y-1 app-hover-border hover:shadow-2xl   "
          >
            <span className="mb-4 grid size-11 place-items-center rounded-2xl app-primary-soft text-lg font-extrabold app-link transition app-group-selected app-group-on-primary  ">
              {i + 1}
            </span>
            <h2 className="mb-2 text-xl font-bold leading-snug">{lesson.title}</h2>
            <p className="mb-5 flex-1 app-muted ">{lesson.description}</p>
            <Link
              to={`/tutor-session?lesson=${encodeURIComponent(lesson.id)}`}
              className={`app-primary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold app-on-primary shadow-lg  transition  active:scale-95 ${focusRing}`}
            >
              Learn with your tutor <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}