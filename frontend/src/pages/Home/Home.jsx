import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Home = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 50 });
  const [certificates, setCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const dscList = await window.electronAPI.getDSCList();
      setCertificates(Array.isArray(dscList) ? dscList : []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const onFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleCertificateSelect = (event) => {
    const selectedIndex = event.target.value;
    setSelectedCertificate(certificates[selectedIndex]);
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
  const signPDFWithDSC = async () => {
    if (!selectedCertificate || !pdfFile) {
      alert("Please select a certificate and upload a PDF file.");
      return;
    }

    console.log("Signing PDF with details:", {
      pdfPath: pdfFile.path, // Make sure pdfFile.path is a string
      certificate: selectedCertificate,
      position: signaturePosition,
      pageNumber,
    });

    try {
      const signatureResult = await window.electronAPI.signPDF({
        pdfPath: pdfFile.path, // Ensure this is the correct path
        certificate: selectedCertificate,
        position: signaturePosition,
        pageNumber,
      });

      if (signatureResult.success) {
        alert("PDF signed successfully!");
      } else {
        alert("Failed to sign PDF: " + signatureResult.message);
      }
    } catch (error) {
      console.error("Error signing PDF:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <input type="file" accept="application/pdf" onChange={onFileChange} />
        <h3>Digital Signature Certificates</h3>
        <select onChange={handleCertificateSelect}>
          <option value="">Select a Digital Signature Certificate</option>
          {certificates.map((cert, index) => (
            <option key={index} value={index}>
              {cert.issuer} (Valid until {cert.validTo})
            </option>
          ))}
        </select>
        <button onClick={signPDFWithDSC}>Sign PDF with DSC</button>
      </div>
      <div style={{ width: "50%" }}>
        {pdfFile && (
          <div
            style={{
              position: "relative",
              border: "1px solid #ccc",
              overflow: "auto",
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
              {/* {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={800}
                />
              ))} */}
              <Page pageNumber={pageNumber} />
            </Document>
            <div
              style={{
                position: "absolute",
                left: `${signaturePosition.x}px`,
                top: `${signaturePosition.y}px`,
                cursor: "move",
                fontSize: "20px",
                fontWeight: "bold",
              }}
              draggable
              onDragStart={onDragStart}
            >
              {selectedCertificate
                ? selectedCertificate.issuer
                : "No certificate selected"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
