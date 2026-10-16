import { Link, NavLink } from 'react-router-dom';
import { ArrowLeft, BookOpen, Brain, ChartNoAxesCombined, Timer } from 'lucide-react';
import './practice.css';
export default function PracticeShell({ children, student }) {
  return <div className="practice-app">
    <header className="practice-nav">
      <Link className="practice-brand" to="/"><span><Brain size={24} /></span>numora<span className="practice-brand-dot">.</span></Link>
      <nav aria-label="Practice navigation">
        <NavLink to="/practice" end><BookOpen size={17} /> Practice</NavLink>
        <NavLink to="/practice/tests"><Timer size={17} /> Mock tests</NavLink>
        <NavLink to="/dashboard"><ChartNoAxesCombined size={17} /> My Progress</NavLink>
      </nav>
      <div className="practice-user">{student ? <><span>{student.name.charAt(0).toUpperCase()}</span><div>{student.name}<small>Grade {student.grade} learner</small></div></> : <Link to="/login">Sign in</Link>}</div>
    </header>
    <main className="practice-main"><Link className="practice-back" to="/"><ArrowLeft size={15} /> Back to learning</Link>{children}</main>
    <footer className="practice-footer">A little practice. A lot of possibility. <Link to="/tutor-session">Ask your AI tutor →</Link></footer>
  </div>;
}
