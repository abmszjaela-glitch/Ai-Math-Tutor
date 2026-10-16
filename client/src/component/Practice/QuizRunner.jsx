import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, CircleHelp, Clock3, Flag, Lightbulb, RotateCcw, Trophy, XCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { practiceRequest } from './practiceApi';
import { readQuizSnapshot, validAttempt, validResult, validAnswer, remainingSeconds } from './quizState';
import PracticeDialog from './PracticeDialog';
import '../../assets/css/QuizRunner.css';


export default function QuizRunner({ mode, lesson, count, storageKey, resume, onExit }) {
  const navigate = useNavigate();
  const [saved] = useState(() => resume ? readQuizSnapshot(storageKey, mode) : null);
  const [attempt, setAttempt] = useState(saved?.attempt || null);
  const [answers, setAnswers] = useState(saved?.answers || {});
  const [flags, setFlags] = useState(saved?.flags || []);
  const [index, setIndex] = useState(saved?.index >= 0 && saved.index < saved.attempt.questions.length ? saved.index : 0);
  const [now, setNow] = useState(Date.now);
  const [error, setError] = useState(saved?.submitted && !saved.result ? 'Your submission was not confirmed. Retry to recover your result.' : '');
  const [submitted, setSubmitted] = useState(saved?.submitted || false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(saved?.result || null);
  const [confirm, setConfirm] = useState(null);
  const closeConfirm = useCallback(() => setConfirm(null), []);
  const [hint, setHint] = useState(false);
  const requestPending = useRef(false);
  const autoSubmitted = useRef(false);
  const questionHeading = useRef(null);
  const answerInput = useRef(null);
  const mounted = useRef(false);
  const answersRef = useRef(answers);
  const draftSaved = useRef(false);
  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

  useEffect(() => {
    if (saved) return;
    const controller = new AbortController();
    if (resume) {
      // An expired session has no usable start configuration; offer a fresh start.
      return;
    }
    practiceRequest('/attempts', { method: 'POST', signal: controller.signal, body: JSON.stringify(mode === 'practice' ? { mode, lessonId: lesson.id } : { mode, count }) })
      .then((data) => {
        if (controller.signal.aborted) return;
        if (!validAttempt(data.attempt, mode)) throw new Error('The server returned an invalid quiz. Please start again.');
        setAttempt({ ...data.attempt, clockOffsetMs: Number.isFinite(data.attempt.serverNow) ? data.attempt.serverNow - Date.now() : 0 });
      })
      .catch((error) => { if (controller.signal.aborted) return; if (error.status === 401) navigate('/login', { replace: true }); setError(error.message); });
    return () => controller.abort();
  }, [mode, lesson, count, saved, resume, navigate]);

  useEffect(() => {
    if (!attempt || !storageKey) return;
    try { sessionStorage.setItem(storageKey, JSON.stringify({ attempt, answers, flags, index, result, submitted })); draftSaved.current = true; } catch { draftSaved.current = false; }
  }, [attempt, answers, flags, index, storageKey, result, submitted]);

  useEffect(() => {
    if (!attempt?.deadline || result) return;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [attempt, result]);

  useEffect(() => {
    if (!attempt || result) return;
    const beforeUnload = (event) => { if (!draftSaved.current) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [attempt, result]);

  const submit = useCallback(async (automatic = false) => {
    if (!attempt || requestPending.current || result) return;
    const currentAnswers = answersRef.current;
    const invalidIndex = attempt.questions.findIndex((q) => currentAnswers[q.id]?.trim() && !validAnswer(q, currentAnswers[q.id]));
    if (!automatic && invalidIndex !== -1) {
      setConfirm(null); setIndex(invalidIndex);
      setError('Please enter a valid number for the highlighted question, or leave it blank.');
      requestAnimationFrame(() => answerInput.current?.focus());
      return;
    }
    requestPending.current = true;
    setConfirm(null); setBusy(true); setSubmitted(true); setError('');
    try {
      const data = await practiceRequest('/submit', { method: 'POST', body: JSON.stringify({ token: attempt.token, answers: currentAnswers }) });
      if (!validResult(data.result, attempt)) throw new Error('The server returned an invalid result. Please retry submission.');
      if (mounted.current) setResult(data.result);
    } catch (error) { if (mounted.current) { if (error.status === 401 && error.code !== 'ATTEMPT_EXPIRED') navigate('/login', { replace: true }); setError(error.message); } }
    finally { requestPending.current = false; if (mounted.current) setBusy(false); }
  }, [attempt, result, navigate]);

  useEffect(() => {
    if (!attempt?.deadline || remainingSeconds(attempt, now) > 0 || result || autoSubmitted.current) return;
    autoSubmitted.current = true;
    // Use a microtask so submission state changes happen in the asynchronous callback.
    Promise.resolve().then(() => { if (mounted.current) return submit(true); });
  }, [attempt, now, result, submit]);

  const leave = () => { try { sessionStorage.removeItem(storageKey); } catch { /* Storage is optional. */ } onExit(); };

  if (result) return <QuizResults result={result} onExit={onExit} />;
  if (!attempt) return <section className="practice-quiz-loading"><CircleHelp size={30} /><h2>{error || (resume ? 'This saved session has expired.' : 'Putting your questions together…')}</h2>{(error || resume) && <button className="practice-btn" onClick={leave}>Back to lessons</button>}</section>;

  const current = attempt.questions[index];
  const answered = attempt.questions.filter((q) => validAnswer(q, answers[q.id])).length;
  const remaining = remainingSeconds(attempt, now);
  const locked = busy || submitted || remaining === 0;
  const jump = (value) => { if (requestPending.current) return; setIndex(Math.max(0, Math.min(value, attempt.questions.length - 1))); setHint(false); requestAnimationFrame(() => questionHeading.current?.focus()); };
  const updateAnswer = (value) => { if (requestPending.current || submitted || remainingSeconds(attempt) === 0) return; setError(''); setAnswers((old) => { const next = { ...old, [current.id]: value }; answersRef.current = next; return next; }); };
  const invalidAnswer = Boolean(answers[current.id]?.trim() && !validAnswer(current, answers[current.id]));
  const toggleFlag = () => setFlags((items) => items.includes(current.id) ? items.filter((id) => id !== current.id) : [...items, current.id]);

  return <section className="practice-quiz">
    <div className="practice-quiz-top">
      <div>
        <span className="practice-eyebrow">{mode === 'mock' ? 'MOCK TEST' : 'GUIDED PRACTICE'}</span>
        <h2>{attempt.title}</h2>
      </div>
      <div className="practice-quiz-status">
        {remaining !== null && <span className={`practice-timer ${remaining < 60 ? 'urgent' : ''}`} role="timer" aria-label={`${Math.floor(remaining / 60)} minutes ${remaining % 60} seconds remaining`}><Clock3 size={18} />{String(Math.floor(remaining / 60)).padStart(2, '0')}:{String(remaining % 60).padStart(2, '0')}</span>}
        <button className="practice-text-btn" disabled={busy} onClick={() => setConfirm('leave')}>Exit</button>
      </div>
    </div>

    <div className="practice-meter" role="progressbar" aria-valuemin={0} aria-valuemax={attempt.questions.length} aria-valuenow={answered} aria-label={`${answered} of ${attempt.questions.length} answered`}><span style={{ width: `${answered / attempt.questions.length * 100}%` }} /></div>

    {error && <div role="alert" className="practice-alert">{error}{submitted && <button disabled={busy} onClick={() => submit()}>Retry submission</button>}<button onClick={leave}>Start over</button></div>}

    <div className="practice-quiz-layout">
      {/* key={current.id} re-triggers the fade-in animation on every new question */}
      <div className="practice-question" key={current.id}>
        <div className="practice-question-meta"><span>QUESTION {index + 1} OF {attempt.questions.length}</span><span className="practice-pill">{current.subject} · {current.difficulty}</span></div>
        <h3 ref={questionHeading} tabIndex={-1}>{current.prompt}</h3>

        {current.options
          ? <fieldset className="practice-options" disabled={locked}>
              <legend className="practice-sr-only">Choose your answer</legend>
              {current.options.map((option, i) => <label key={option} className={answers[current.id] === option ? 'chosen' : ''}>
                <input type="radio" name={current.id} value={option} checked={answers[current.id] === option} onChange={() => updateAnswer(option)} />
                <span className="practice-option-letter">{String.fromCharCode(65 + i)}</span>
                <strong>{option}{current.unit ? ` ${current.unit}` : ''}</strong>
                {answers[current.id] === option && <Check size={19} />}
              </label>)}
            </fieldset>
          : <label className="practice-number-answer">
              <span>Your answer{current.unit ? ` (${current.unit})` : ''}</span>
              <input type="text" inputMode="decimal" maxLength={40} value={answers[current.id] || ''} placeholder="Type a number" disabled={locked} onChange={(e) => updateAnswer(e.target.value)} ref={answerInput} aria-invalid={invalidAnswer} aria-describedby={invalidAnswer ? 'quiz-answer-error' : undefined} />
              <small>Enter a number only. Use a full stop for decimals.</small>
            </label>}

        {invalidAnswer && <p id="quiz-answer-error" role="alert" style={{ color: '#b42318', marginTop: 10 }}>Enter a valid number, such as 12 or 3.5, without units.</p>}
        <div className="practice-question-tools">
          <button className={`practice-text-btn ${flags.includes(current.id) ? 'flagged' : ''}`} onClick={toggleFlag} disabled={locked}><Flag size={16} />{flags.includes(current.id) ? 'Marked for review' : 'Review later'}</button>
          {mode === 'practice' && <button className="practice-text-btn" disabled={busy} onClick={() => setHint((v) => !v)}><Lightbulb size={16} />{hint ? 'Hide hint' : 'Need a hint?'}</button>}
        </div>

        {/* The "💡 Hint:" label is added by CSS (::before) */}
        {hint && <div className="practice-hint">{lesson?.steps?.[0] || 'Identify what the question asks for. Write down the numbers, choose an operation, and check the units.'} Work through one step at a time.</div>}

        <div className="practice-question-navigation">
          <button className="practice-btn practice-btn-outline" disabled={index === 0 || busy} onClick={() => jump(index - 1)}><ArrowLeft size={16} />Previous</button>
          {index < attempt.questions.length - 1
            ? <button className="practice-btn" disabled={busy} onClick={() => jump(index + 1)}>Next question <ArrowRight size={16} /></button>
            : <button className="practice-btn" disabled={busy} onClick={() => setConfirm('submit')}>{busy ? 'Saving…' : 'Finish & see results'}<CheckCircle2 size={16} /></button>}
        </div>
      </div>

      <aside className="practice-question-map">
        <h3>Your question map</h3>
        <p>{answered} answered · {attempt.questions.length - answered} to go</p>
        <div>{attempt.questions.map((q, i) => <button key={q.id} disabled={busy} aria-label={`Question ${i + 1}${validAnswer(q, answers[q.id]) ? ', answered' : ', unanswered'}${flags.includes(q.id) ? ', flagged' : ''}`} aria-current={i === index ? 'step' : undefined} className={`${i === index ? 'current' : ''} ${validAnswer(q, answers[q.id]) ? 'answered' : ''} ${flags.includes(q.id) ? 'marked' : ''}`} onClick={() => jump(i)}>{i + 1}{flags.includes(q.id) && <Flag size={9} />}</button>)}</div>
        <small>● Green: answered<br />⚑ Orange: review later</small>
        <button className="practice-btn practice-btn-outline" disabled={busy} onClick={() => setConfirm('submit')}>Submit {mode === 'mock' ? 'test' : 'practice'}</button>
      </aside>
    </div>

    {confirm && <PracticeDialog labelledBy="confirm-title" className="practice-confirm" onClose={closeConfirm}>
      <h2 id="confirm-title">{confirm === 'leave' ? 'Leave this attempt?' : 'Ready to finish?'}</h2>
      <p>{confirm === 'leave' ? 'This attempt and its answers will be discarded. Your previously saved progress stays safe.' : `${attempt.questions.length - answered} unanswered questions will receive no marks. You can review every explanation after submitting.`}</p>
      <div className="practice-card-actions">
        <button autoFocus className="practice-btn practice-btn-outline" onClick={() => setConfirm(null)}>Keep working</button>
        <button className="practice-btn" disabled={busy} onClick={confirm === 'leave' ? leave : () => submit()}>{confirm === 'leave' ? 'Discard & leave' : 'Submit answers'}</button>
      </div>
    </PracticeDialog>}
  </section>;
}

function QuizResults({ result, onExit }) {
  const [onlyMissed, setOnlyMissed] = useState(false);
  const subjects = [...new Set(result.reviews.map((q) => q.subject))];
  const reviews = result.reviews.filter((q) => !onlyMissed || !q.correct);

  return <section className="practice-results">
    <div className="practice-result-hero">
      <div className="practice-result-trophy"><Trophy size={38} /></div>
      <span className="practice-eyebrow">{result.timedOut ? 'TIME’S UP — HERE’S HOW YOU DID' : 'EVERY ATTEMPT IS A STEP FORWARD'}</span>
      <h2>{result.score >= 70 ? 'Look at you grow!' : 'You’re learning. Keep going.'}</h2>
      <div className="practice-result-score">{result.score}<span>%</span></div>
      <p>{result.correct} correct · {result.total - result.answered} unanswered · {result.total} questions · {Math.floor(result.elapsedSeconds / 60)}m {result.elapsedSeconds % 60}s</p>
      <div className="practice-result-actions">
        <button className="practice-btn" onClick={onExit}><RotateCcw size={16} />Keep practising</button>
        <Link className="practice-btn practice-btn-outline" to="/dashboard">My Progress <ArrowRight size={16} /></Link>
      </div>
      <small>Your best scores are saved. Complete a full lesson practice at 70% or more to master it.</small>
    </div>

    <div className="practice-topic-results">{subjects.map((subject) => {
      const items = result.reviews.filter((q) => q.subject === subject);
      const score = Math.round(items.filter((q) => q.correct).length / items.length * 100);
      return <div key={subject}><strong>{subject}<span>{score}%</span></strong><div className="practice-meter"><span style={{ width: `${score}%` }} /></div></div>;
    })}</div>

    <div className="practice-section-title">
      <div><h2>Let’s learn from every answer</h2><p>The “why” matters just as much as the score.</p></div>
      <button className="practice-text-btn" aria-pressed={onlyMissed} onClick={() => setOnlyMissed((v) => !v)}>{onlyMissed ? 'Show all answers' : 'Review mistakes only'}</button>
    </div>

    <div className="practice-answer-review">{reviews.map((q) => <article key={q.id} className={q.correct ? 'is-correct' : 'is-incorrect'}>
      <div>{q.correct ? <CheckCircle2 size={22} /> : <XCircle size={22} />}<span>{q.subject} · {q.correct ? 'Correct' : q.submitted ? 'Let’s revisit this' : 'Not answered'}</span></div>
      <h3>{q.prompt}</h3>
      <p>Your answer: <strong>{q.submitted || '—'}</strong><span>Correct answer: <strong>{q.answer}{q.unit ? ` ${q.unit}` : ''}</strong></span></p>
      <div className="practice-review-explanation"><Lightbulb size={17} />{q.explanation}</div>
    </article>)}</div>

    {!reviews.length && <div className="practice-empty"><Trophy /><h3>All correct. Beautiful work!</h3></div>}
  </section>;
}