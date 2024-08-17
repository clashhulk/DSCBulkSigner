import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Home from './pages/Home/Home';
import NotFound from './pages/NotFound';
import TemplateCrud from './pages/Template/TemplateCrud';

// import Home from './pages/Home/HomeV1';
function App() {
  return (
    <div>
      <ToastContainer />
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/template/crud" element={<TemplateCrud />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
