import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Loading from "./components/Loading";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound";
import TemplateCrud from "./pages/Template/TemplateCrud";

// import Home from './pages/Home/HomeV1';
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Clean up the timer in case the component unmounts before the timeout
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <ToastContainer />
      {/* <Header /> */}
      <Routes>
        {/* <Route path="/" element={<CertificateList />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/template/crud" element={<TemplateCrud />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
