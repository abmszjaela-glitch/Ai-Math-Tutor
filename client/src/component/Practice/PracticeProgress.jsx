import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Trophy } from 'lucide-react';
import usePracticeCatalog from './usePracticeCatalog';
import './practice.css';
export default function PracticeProgress({ onSummary }) {
  const catalog = usePracticeCatalog();
  useEffect(() => {
    if (catalog.loading || catalog.error || !onSummary) return;
    const scores = catalog.lessons.filter((lesson) => lesson.progress);
    onSummary({ total: catalog.lessons.length, completed: scores.filter((lesson) => lesson.progress.completed).length, attempted: scores.length, average: scores.length ? Math.round(scores.reduce((sum, lesson) => sum + lesson.progress.score, 0) / scores.length) : 0, attempts: scores.reduce((sum, lesson) => sum + lesson.progress.attempts, 0) });
  }, [catalog.lessons, catalog.loading, catalog.error, onSummary]);
  const attempted = catalog.lessons.filter((lesson) => lesson.progress);
  const completed = attempted.filter((lesson) => lesson.progress.completed).length;
  const average = attempted.length ? Math.round(attempted.reduce((sum, lesson) => sum + lesson.progress.score, 0) / attempted.length) : 0;
  return <section className="practice-app practice-dashboard-panel"><div className="practice-section-title"><div><span className="practice-eyebrow">YOUR SAVED PRACTICE RESULTS</span><h2>Practice & mock test progress</h2></div><Link className="practice-btn" to="/practice">Practise now <ArrowRight size={15} /></Link></div>
    {catalog.loading ? <p role="status">Loading saved scores…</p> : catalog.error ? <p role="alert">{catalog.error} <button onClick={catalog.refresh}>Retry</button></p> : <><div className="practice-progress-summary"><span><CheckCircle2 size={19} /><strong>{completed} / {catalog.lessons.length}</strong> lessons mastered</span><span><Trophy size={19} /><strong>{average}%</strong> average best score</span><Link to="/practice/tests">Take a mock test →</Link></div>{attempted.length ? <div className="practice-progress-list">{attempted.map((lesson) => <div key={lesson.id}><span>{lesson.title}<small>{lesson.subject} · {lesson.progress.attempts} attempts</small></span><strong>{lesson.progress.score}%</strong><span className="practice-pill">{lesson.progress.completed ? 'Mastered' : 'In progress'}</span></div>)}</div> : <p>Your first completed quiz will appear here. Start with a lesson and build from there.</p>}</>}
  </section>;
}
