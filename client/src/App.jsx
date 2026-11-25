import { lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import RouteLoading from './component/RouteLoading';
import FloatingTutorButton from './component/FloatingTutorButton';

const Login = lazy(() => import('./component/Login'));
const Register = lazy(() => import('./component/Register'));
const Profile = lazy(() => import('./component/Profile'));
const LearningHub = lazy(() => import('./component/Learning/LearningHub'));

const Algebra = lazy(() => import('./component/Learning/Algebra'));
const Measurement = lazy(() => import('./component/Learning/Measurement'));
const ProblemSolving = lazy(() => import('./component/Learning/ProblemSolving'));
const Statistics = lazy(() => import('./component/Learning/Statistics'));

const SelectFriend = lazy(() => import('./component/SelectFriend'));
const TutorSession = lazy(() => import('./component/TutorSession'));
const Map = lazy(() => import('./component/map'));


import MainLayout from "./component/MainLayout";

const Stdashboard = lazy(() => import('./component/admin/StudentDashboard'));
const PracticeProblems = lazy(() => import('./component/Practice/PracticeProblems'));
const MockTests = lazy(() => import('./component/Practice/MockTests'));
const Home = lazy(() => import('./component/Home'));


const App = () => {

  return (

    <BrowserRouter>

      <FloatingTutorButton />

      <RouteLoading><Routes>

  <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    
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
    path="/profile"
    element={<Profile />}
  />
  <Route
    path="/start-learning"
    element={<LearningHub />}
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

<Route path="/map" element={<Map />} />

<Route path="/practice" element={<PracticeProblems />} />
<Route path="/practice/tests" element={<MockTests />} />
<Route path="/practice/progress" element={<Navigate to="/dashboard" replace />} />
<Route path="*" element={<Navigate to="/" replace />} />
</Routes></RouteLoading>


    </BrowserRouter>

  );

};


export default App;