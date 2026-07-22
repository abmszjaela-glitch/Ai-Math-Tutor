import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './component/Header';
import Loading from './component/Loading';
import Hero from './component/Hero';
import About from './component/About';
import Program from './component/Program';
import Classes from './component/Classes';
import ChooseUs from './component/ChooseUs';
import Counter from './component/Counter';
import Session from './component/Session';
import Testimonial from './component/Testimonial';
import Brand from './component/Brand';
import Contact from './component/Contact';
import Newsletter from './component/Newsletter';

import Team from './component/Team';
import BackToTop from './component/BackToTop';
import MouseCursor from './component/MouseCursor';
import Offcanvas from './component/Offcanvas';
import SearchPopup from './component/SearchPopup';
import Footer from './component/Footer';

import Login from './component/Login';
import Register from './component/Register';


const Home = () => {
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);

  return (
    <>
      <Header
        onMenuClick={() => setOffcanvasOpen(true)}
      />

      <main>

        <Hero />

        <About />

        <Program />

        <Classes />

        <ChooseUs />

        <Team />

        <Counter />

        <Session />

        <Testimonial />

        <Brand />

        <Contact />

        <Newsletter />

        <Footer />

      </main>


      <Offcanvas
        isOpen={offcanvasOpen}
        onClose={() => setOffcanvasOpen(false)}
      />

      <SearchPopup />

      <MouseCursor />

      <BackToTop />

    </>
  );
};


const App = () => {

  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 6000);


    return () => clearTimeout(timer);

  }, []);


  if (isLoading) {

    return (
      <div
        id="preloader"
        className="preloader"
      >
        <Loading />
      </div>
    );

  }


  return (

    <BrowserRouter>

      <Routes>

        {/* Home Page */}
        <Route
          path="/"
          element={<Home />}
        />


        {/* Login Page */}
        <Route
          path="/login"
          element={<Login />}
        />


        {/* Register Page */}
        <Route
          path="/register"
          element={<Register />}
        />

      </Routes>

    </BrowserRouter>

  );

};


export default App;