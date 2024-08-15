import "./App.css";

import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound";
import TemplateCrud from "./pages/Template/TemplateCrud";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/header/Header";
function App() {
  return (
    <div>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/template/crud" element={<TemplateCrud />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
