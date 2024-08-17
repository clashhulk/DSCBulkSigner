import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
const Home = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [signatureText, setSignatureText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 50 });
  const signatureRef = useRef(null);

  const onFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleSignatureChange = (event) => {
    setSignatureText(event.target.value);
  };

  const onDragStart = (e) => {
    const boundingRect = e.target.getBoundingClientRect();
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({
        x: e.clientX - boundingRect.left,
        y: e.clientY - boundingRect.top,
      })
    );
  };

  const onDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const rect = e.target.getBoundingClientRect();
    setSignaturePosition({
      x: e.clientX - rect.left - data.x,
      y: e.clientY - rect.top - data.y,
    });
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI
        .getDSCList()
        .then((data) => {
          if (Array.isArray(data)) {
            setCertificates(data);
          } else {
            console.error("Expected an array but received:", data);
          }
        })
        .catch(console.error);
    } else {
      console.error("window.electronAPI is undefined");
    }
  }, []);
  return (
    <div>
      <div>
        <h3>Digital Signature Certificates</h3>
        <ul>
          {certificates.map((cert, index) => (
            <li key={index}>
              <strong>Serial Number:</strong> {cert.serialNumber} <br />
              <strong>Issuer:</strong> {cert.issuer} <br />
              <strong>Valid From:</strong> {cert.validFrom} <br />
              <strong>Valid To:</strong> {cert.validTo}
            </li>
          ))}
        </ul>
      </div>
      <h1>Home Component</h1>

      <input
        type="text"
        placeholder="Enter signature text"
        value={signatureText}
        onChange={handleSignatureChange}
      />

      <input type="file" accept="application/pdf" onChange={onFileChange} />

      {pdfFile && (
        <div
          style={{
            position: "relative",
            border: "1px solid #ccc",
            overflow: "hidden",
            maxWidth: "800px",
            margin: "auto",
          }}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            renderMode="canvas"
            loading={<div>Loading PDF...</div>}
            error={<div>Error loading PDF</div>}
          >
            <Page
              pageNumber={pageNumber}
              width={800}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>

          {/* Draggable signature */}
          {signatureText && (
            <div
              ref={signatureRef}
              style={{
                position: "absolute",
                left: `${signaturePosition.x}px`,
                top: `${signaturePosition.y}px`,
                color: "red",
                cursor: "move",
                fontSize: "20px",
                fontWeight: "bold",
              }}
              draggable
              onDragStart={onDragStart}
            >
              {signatureText}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
