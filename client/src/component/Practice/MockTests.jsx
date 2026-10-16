import { useState } from 'react';
import { ArrowRight, Check, Clock3, Flag, ShieldCheck, Timer } from 'lucide-react';
import PracticeShell from './PracticeShell';
import usePracticeCatalog from './usePracticeCatalog';
import QuizRunner from './QuizRunner';
export default function MockTests() {
  const catalog = usePracticeCatalog();
  const [count, setCount] = useState(null);
  const [resume, setResume] = useState(false);
  const [version, setVersion] = useState(0);
  const storageKey = catalog.student ? `numora:mock:${catalog.student.id}` : null;
  let saved = false;
  try { saved = Boolean(storageKey && sessionStorage.getItem(storageKey)); } catch { /* Storage is optional. */ }
  return <PracticeShell student={catalog.student}>
    <div className="practice-heading"><div><span className="practice-eyebrow"><Timer size={14} /> A LITTLE CHALLENGE. A BIG STEP FORWARD.</span><h1>Your next<br /><em>“I did it!” moment.</em></h1><p>A fresh mix of mathematics. A little time on the clock. Everything you need to see how far you’ve come.</p></div><div className="practice-orbit mock-orbit" aria-hidden="true"><Clock3 size={65} /><strong>You’ve<br />got this.</strong></div></div>
    {catalog.loading ? <p role="status">Loading your tests…</p> : catalog.error ? <div role="alert" className="practice-alert">{catalog.error}<button onClick={catalog.refresh}>Try again</button></div> : (count || resume) ? <QuizRunner key={version} mode="mock" count={count} storageKey={storageKey} resume={resume} onExit={() => { setCount(null); setResume(false); catalog.refresh(); }} /> : <>
      {saved && <div className="practice-resume"><strong>You have a mock test in progress. Its timer keeps running.</strong><button className="practice-btn" onClick={() => { setResume(true); setVersion((v) => v + 1); }}>Resume test <ArrowRight size={16} /></button></div>}
      <div className="practice-section-title"><div><h2>Choose your challenge</h2><p>Both tests are tailored to Grade {catalog.student?.grade} and cover all four subjects.</p></div><span>70% mastery goal</span></div>
      <div className="practice-test-grid">{[{ count: 12, title: 'Quick confidence check', tag: 'A GREAT PLACE TO START', description: 'A focused check-in to find your strengths and what to practise next.' }, { count: 20, title: 'The full challenge', tag: 'STRETCH YOUR THINKING', description: 'A deeper mix of questions to build focus and test-day confidence.' }].map((test) => <article className="practice-test-card" key={test.count}><span className="practice-eyebrow">{test.tag}</span><div className="practice-test-icon"><Timer size={34} /></div><h2>{test.title}</h2><p>{test.description}</p><div className="practice-test-details"><span><BookCount count={test.count} /> questions</span><span><Clock3 size={17} /> {test.count} minutes</span></div><ul>{['All four mathematics topics', 'Multiple choice + number answers', 'Full explanations after submission', 'Best lesson scores saved to My Progress'].map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul><button className="practice-btn" onClick={() => { setCount(test.count); setResume(false); setVersion((v) => v + 1); }}>Start mock test <ArrowRight size={17} /></button></article>)}</div>
      <div className="practice-test-rules"><h3>Before you begin</h3><div><p><Clock3 size={20} /><span><strong>The clock keeps going.</strong> Refreshing or switching tabs won’t reset your time. Submit while the server is reachable.</span></p><p><Flag size={20} /><span><strong>Review before you finish.</strong> Flag a tricky question and return to it. Unanswered questions receive no marks.</span></p><p><ShieldCheck size={20} /><span><strong>Make it your own effort.</strong> Use paper for working. Explanations and correct answers appear only after you finish.</span></p></div></div>
    </>}
  </PracticeShell>;
}
function BookCount({ count }) { return <strong>{count}</strong>; }
