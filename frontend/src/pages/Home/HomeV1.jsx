import './styles.css';

import React, { useEffect, useState } from 'react';

import Operations from '../../components/Operations/Operations';

const Home = () => {
  return (
    <>
      <div className="home-container">
        <div className="operations-grid">
          <form className="operations-form">
            <Operations />
          </form>
        </div>
        <div className="template-grid"></div>
      </div>
    </>
  );
};

export default Home;
