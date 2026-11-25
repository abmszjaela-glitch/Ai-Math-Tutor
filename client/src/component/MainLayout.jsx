import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Offcanvas from "./Offcanvas";
import SearchPopup from "./SearchPopup";
import BackToTop from "./BackToTop";

const MainLayout = () => {
  const [offcanvasOpen, setOffcanvasOpen] = useState(false);

  return (
    <>
      <Header onMenuClick={() => setOffcanvasOpen(true)} />

      <main>
        <Outlet />
      </main>

      <Footer />

      <Offcanvas
        isOpen={offcanvasOpen}
        onClose={() => setOffcanvasOpen(false)}
      />

      <SearchPopup />
      <BackToTop />
    </>
  );
};

export default MainLayout;