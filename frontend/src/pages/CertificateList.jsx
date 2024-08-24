import React, { useEffect, useState } from 'react';

function CertificateList() {
  const [certificates, setCertificates] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    window.electronAPI
      .receiveCertificate()
      .then(setCertificates)
      .catch((err) => {
        console.error("Failed to fetch certificates:", err);
        setError(
          "Failed to fetch certificates. Check the console for more details."
        );
      });
  }, []);

  return (
    <div>
      <h1>Digital Signatures</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {certificates.map((cert, index) => (
          <li key={index}>{cert}</li>
        ))}
      </ul>
    </div>
  );
}

export default CertificateList;
