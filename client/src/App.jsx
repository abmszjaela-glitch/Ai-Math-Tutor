import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Loading from './component/Loading';



const Login = lazy(() => import('./component/Login'));
const Register = lazy(() => import('./component/Register'));

const Algebra = lazy(() => import('./component/Learning/Algebra'));
const Measurement = lazy(() => import('./component/Learning/Measurement'));
const ProblemSolving = lazy(() => import('./component/Learning/ProblemSolving'));
const Statistics = lazy(() => import('./component/Learning/Statistics'));

const SelectFriend = lazy(() => import('./component/SelectFriend'));
const TutorSession = lazy(() => import('./component/TutorSession'));


import MainLayout from "./component/MainLayout";
const StartLearning = lazy(() => import('./component/StartLearning'));

const Stdashboard = lazy(() => import('./component/admin/StudentDashboard'));
const Home = lazy(() => import('./component/Home'));


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

<Route path="*" element={<Navigate to="/" replace />} />
</Routes></Suspense>


    </BrowserRouter>

  );

};


export default App;