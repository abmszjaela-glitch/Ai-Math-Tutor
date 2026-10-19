import { readQuizSnapshot } from './quizState';
import { useCallback, useState } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Lightbulb, Search, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import PracticeDialog from './PracticeDialog';
import PracticeShell from './PracticeShell';
import QuizRunner from './QuizRunner';
import usePracticeCatalog from './usePracticeCatalog';
const subjects = ['All topics', 'Algebra', 'Measurement', 'Problem Solving', 'Statistics'];
const symbols = { Algebra: 'x', Measurement: '↔', 'Problem Solving': '✦', Statistics: '▥' };
export default function PracticeProblems() {
  const catalog = usePracticeCatalog();
  const [subject, setSubject] = useState('All topics');
  const [query, setQuery] = useState('');
  const [lesson, setLesson] = useState(null);
  const closeLesson = useCallback(() => setLesson(null), []);
  const [quizLesson, setQuizLesson] = useState(null);
  const [resuming, setResuming] = useState(false);
  const [pendingLesson, setPendingLesson] = useState(null);
  const closeReplacement = useCallback(() => setPendingLesson(null), []);
  const [runnerVersion, setRunnerVersion] = useState(0);
  const storageKey = catalog.student ? `numora:practice:${catalog.student.id}` : null;
  const cached = readQuizSnapshot(storageKey, 'practice');
  const canResume = Boolean(cached);
  const completed = catalog.lessons.filter((item) => item.progress?.completed).length;
  const visible = catalog.lessons.filter((item) => (subject === 'All topics' || item.subject === subject) && `${item.title} ${item.summary}`.toLowerCase().includes(query.toLowerCase()));
  const startQuiz = (item) => { setPendingLesson(null); setQuizLesson(item); setResuming(false); setLesson(null); setRunnerVersion((v) => v + 1); };
  const openQuiz = (item) => { if (cached && !cached.result) { setLesson(null); setPendingLesson(item); } else startQuiz(item); };
  return <PracticeShell student={catalog.student}>
    <div className="practice-heading"><div><span className="practice-eyebrow"><Sparkles size={14} /> YOUR DAILY DOSE OF DISCOVERY</span><h1>Small steps.<br /><em>Brilliant breakthroughs.</em></h1><p>Explore a lesson, try it yourself, and turn “I’m not sure” into “I’ve got this.”</p></div><div className="practice-orbit" aria-hidden="true"><span>÷</span><strong>Every try<br />counts.</strong><span>+</span><span>×</span></div></div>
    {catalog.loading ? <p role="status">Getting your grade’s lessons ready…</p> : catalog.error ? <div className="practice-alert" role="alert">{catalog.error}<button onClick={catalog.refresh}>Try again</button></div> : <>
      {(quizLesson || resuming) ? <QuizRunner key={runnerVersion} mode="practice" lesson={quizLesson} storageKey={storageKey} resume={resuming} onExit={() => { setQuizLesson(null); setResuming(false); catalog.refresh(); }} /> : <>
        <div className="practice-stats"><div><span>YOUR LEARNING PATH</span><strong>Grade {catalog.student?.grade} mathematics</strong></div><div><strong>{catalog.lessons.length}</strong><span>guided lessons</span></div><div><strong>{completed}<small> / {catalog.lessons.length}</small></strong><span>lessons mastered</span></div><div><strong>{catalog.lessons.reduce((n, item) => n + item.questionCount, 0)}</strong><span>questions to explore</span></div></div>
        {canResume && <div className="practice-resume"><div><strong>Keep your momentum.</strong> {cached?.result ? 'Your last result is saved in this tab.' : 'Your unfinished practice is saved in this tab.'}</div><button className="practice-btn" onClick={() => { setResuming(true); setRunnerVersion((v) => v + 1); }}>{cached?.result ? 'View last result' : 'Resume practice'} <ArrowRight size={16} /></button></div>}
        <div className="practice-toolbar"><div className="practice-tabs" role="group" aria-label="Filter by subject">{subjects.map((item) => <button key={item} aria-pressed={subject === item} className={subject === item ? 'selected' : ''} onClick={() => setSubject(item)}>{item}</button>)}</div><label className="practice-search"><Search size={17} /><input aria-label="Search lessons" placeholder="Find a lesson…" value={query} onChange={(e) => setQuery(e.target.value)} /></label></div>
        <div className="practice-section-title"><div><h2>A little curiosity goes a long way</h2><p>Built for your grade. Designed for your pace.</p></div><span>{visible.length} lessons</span></div>
        <div className="practice-grid">{visible.map((item, index) => <article key={item.id} className={`practice-card subject-${item.subject.toLowerCase().replaceAll(' ', '-')}`}><div className="practice-card-top"><span className="practice-subject-icon">{symbols[item.subject]}</span><span className="practice-pill">{item.subject}</span></div><span className="practice-card-number">LESSON {String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.summary}</p><div className="practice-card-meta"><span><BookOpen size={14} /> 3 learning steps</span><span>6 questions</span></div>{item.progress && <div className="practice-card-progress"><CheckCircle2 size={14} /> {item.progress.completed ? 'Mastered' : 'Keep practising'} · Best {item.progress.score}% · {item.progress.attempts} attempts</div>}<div className="practice-card-actions"><button className="practice-text-btn" onClick={() => setLesson(item)}>Read lesson <ChevronRight size={15} /></button><button className="practice-btn" onClick={() => openQuiz(item)}>Practise <ArrowRight size={15} /></button></div></article>)}</div>
        {!visible.length && <div className="practice-empty"><Search size={28} /><h3>No lessons found</h3><p>Try another topic or a shorter search.</p></div>}
        <aside className="practice-callout"><div className="practice-callout-icon"><Lightbulb size={30} /></div><div><h3>Ready to put it all together?</h3><p>Try a timed mock test with a fresh mix of all four topics.</p></div><Link className="practice-btn practice-btn-light" to="/practice/tests">Explore mock tests <ArrowRight size={17} /></Link></aside>
      </>}
    </>}
    {pendingLesson && <PracticeDialog labelledBy="replace-practice-title" onClose={closeReplacement}><h2 id="replace-practice-title">Replace unfinished practice?</h2><p>Starting another lesson will replace the saved answers for your current practice.</p><div className="practice-card-actions"><button className="practice-btn practice-btn-outline" onClick={closeReplacement}>Keep existing attempt</button><button className="practice-btn" onClick={() => startQuiz(pendingLesson)}>Start new practice</button></div></PracticeDialog>}
    {lesson && <PracticeDialog labelledBy="lesson-title" onClose={closeLesson}><button autoFocus className="practice-icon-btn practice-close" aria-label="Close lesson" onClick={() => setLesson(null)}><X /></button><span className="practice-eyebrow">GRADE {catalog.student?.grade} · {lesson.subject}</span><h2 id="lesson-title">{lesson.title}</h2><p>{lesson.summary}</p><ol className="practice-lesson-steps">{lesson.steps.map((step) => <li key={step}>{step}</li>)}</ol><div className="practice-example"><Lightbulb size={20} /><div><strong>Let’s try an example</strong><p>{lesson.example}</p></div></div><button className="practice-btn" onClick={() => openQuiz(lesson)}>I’m ready to practise <ArrowRight size={17} /></button></PracticeDialog>}
  </PracticeShell>;
}
