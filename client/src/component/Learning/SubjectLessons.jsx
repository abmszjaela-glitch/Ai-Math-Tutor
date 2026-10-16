import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../../config/api';

const focusRing = 'focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-cyan-400';

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
    <main className="container section-padding mx-auto max-w-5xl px-4 py-8 text-slate-800 sm:px-6 dark:text-slate-100">
      <Link
        to="/dashboard"
        className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-500 transition hover:bg-violet-50 hover:text-violet-600 dark:text-slate-400 dark:hover:bg-violet-500/10 dark:hover:text-violet-300 ${focusRing}`}
      >
        ← Dashboard
      </Link>

      {/* ---------- Header ---------- */}
      <div className="mb-8 mt-4 rounded-3xl bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500 bg-[length:200%_auto] p-6 text-white shadow-2xl shadow-violet-500/30 animate-shimmer sm:p-8">
        <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.14em]">
          Your lessons
        </span>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{subject}</h1>
        {!loading && !error && lessons.length > 0 && (
          <p className="mt-1 text-white/90">{lessons.length} {lessons.length === 1 ? 'lesson' : 'lessons'} ready for you</p>
        )}
      </div>

      {/* ---------- Loading skeleton ---------- */}
      {loading && (
        <div role="status" aria-live="polite" className="grid gap-4 sm:grid-cols-2">
          <span className="sr-only">Loading your lessons…</span>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 size-11 rounded-2xl bg-slate-200 dark:bg-slate-700" />
              <div className="mb-3 h-5 w-3/4 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="mb-2 h-3 w-full rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-3 w-2/3 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>
          ))}
        </div>
      )}

      {/* ---------- Error ---------- */}
      {error && (
        <p role="alert" className="rounded-2xl border-l-4 border-red-500 bg-red-50 px-4 py-3.5 font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}

      {/* ---------- Empty ---------- */}
      {!loading && !error && !lessons.length && (
        <div className="grid justify-items-center gap-2 rounded-3xl border-2 border-dashed border-violet-300 bg-violet-50 px-6 py-12 text-center text-violet-600 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300">
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
            className="group flex animate-fade-up flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-violet-500/10 transition hover:-translate-y-1 hover:border-violet-400 hover:shadow-2xl hover:shadow-violet-500/20 dark:border-slate-700 dark:bg-slate-800"
          >
            <span className="mb-4 grid size-11 place-items-center rounded-2xl bg-violet-100 text-lg font-extrabold text-violet-600 transition group-hover:bg-violet-500 group-hover:text-white dark:bg-violet-500/20 dark:text-violet-300">
              {i + 1}
            </span>
            <h2 className="mb-2 text-xl font-bold leading-snug">{lesson.title}</h2>
            <p className="mb-5 flex-1 text-slate-500 dark:text-slate-400">{lesson.description}</p>
            <Link
              to={`/tutor-session?lesson=${encodeURIComponent(lesson.id)}`}
              className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition hover:brightness-105 active:scale-95 ${focusRing}`}
            >
              Learn with your tutor <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}