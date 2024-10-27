import "./DSCInfo.css";

import React from "react";

const DSCInfo = ({ dscInfo, loading, error }) => {
  return (
    <div className="dsc-info">
      {/* <p className="title">DSC Certificate Information</p> */}
      {dscInfo && (
        <p className="info-item">
          <strong>Certificate Name:</strong> {dscInfo.label}
        </p>
      )}
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* {dscInfo && (
        <div className="card">
          <p className="info-item">
            <strong>Label:</strong> {dscInfo.label}
          </p>
          <p className="info-item">
            <strong>Serial Number:</strong> {dscInfo.serial_number}
          </p>
          <p className="info-item">
            <strong>Subject:</strong> {dscInfo.subject}
          </p>
          <p className="info-item">
            <strong>Issuer:</strong> <br />
            {dscInfo.issuer}
          </p>
          <p className="info-item">
            <strong>Validity Period:</strong>
            <br />
            From: {dscInfo.validity.not_before}
            <br />
            To: {dscInfo.validity.not_after}
          </p>
        </div>
      )} */}
    </div>
  );
};

export default DSCInfo;
