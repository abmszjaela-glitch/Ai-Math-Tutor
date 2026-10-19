import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Loading from './component/Loading';

// Load the page and the minimum display timer together.
const lazyWithMinimumDelay = (loadPage) => lazy(() => Promise.all([
  loadPage(),
  new Promise((resolve) => setTimeout(resolve, 3000)),
]).then(([page]) => page));



const Login = lazyWithMinimumDelay(() => import('./component/Login'));
const Register = lazyWithMinimumDelay(() => import('./component/Register'));

const Algebra = lazyWithMinimumDelay(() => import('./component/Learning/Algebra'));
const Measurement = lazyWithMinimumDelay(() => import('./component/Learning/Measurement'));
const ProblemSolving = lazyWithMinimumDelay(() => import('./component/Learning/ProblemSolving'));
const Statistics = lazyWithMinimumDelay(() => import('./component/Learning/Statistics'));

const SelectFriend = lazyWithMinimumDelay(() => import('./component/SelectFriend'));
const TutorSession = lazyWithMinimumDelay(() => import('./component/TutorSession'));


import MainLayout from "./component/MainLayout";
const StartLearning = lazyWithMinimumDelay(() => import('./component/StartLearning'));

const Stdashboard = lazyWithMinimumDelay(() => import('./component/admin/StudentDashboard'));
const PracticeProblems = lazyWithMinimumDelay(() => import('./component/Practice/PracticeProblems'));
const MockTests = lazyWithMinimumDelay(() => import('./component/Practice/MockTests'));
const Home = lazyWithMinimumDelay(() => import('./component/Home'));


const App = () => {

  return (

    <BrowserRouter>

      <Suspense fallback={<Loading />}><Routes>

  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route
      path="/start-learning"
      element={<StartLearning />}
    />
  </Route>

  <Route
    path="/login"
    element={<Login />}
  />

  <Route
    path="/register"
    element={<Register />}
  />
  <Route
    path="/dashboard"
    element={<Stdashboard />}
  />

  <Route
    path="/Algebra"
    element={<Algebra />}
  />

  <Route
    path="/Statistics"
    element={<Statistics />}
  />

  <Route
    path="/ProblemSolving"
    element={<ProblemSolving />}
  />

  <Route
    path="/Measurement"
    element={<Measurement />}
  />

  <Route
    path="/SelectFriend"
    element={<SelectFriend />}
  />

  <Route
    path="/tutor-session"
    element={<TutorSession />}
  />

<Route path="/practice" element={<PracticeProblems />} />
<Route path="/practice/tests" element={<MockTests />} />
<Route path="/practice/progress" element={<Navigate to="/dashboard" replace />} />
<Route path="*" element={<Navigate to="/" replace />} />
</Routes></Suspense>


    </BrowserRouter>

  );

};


export default App;