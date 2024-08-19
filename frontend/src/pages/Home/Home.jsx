import moment from 'moment';
import React, { useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Home = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [signatureText, setSignatureText] = useState("John Doe");
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 50 });
  const [fontSize, setFontSize] = useState(20);
  const [showDateTime, setShowDateTime] = useState(false);
  const [dateTimeFormat, setDateTimeFormat] = useState(
    "MMMM Do YYYY, h:mm:ss a"
  );
  const [showCertificateSubject, setShowCertificateSubject] = useState(false);
  const [signingReason, setSigningReason] = useState("");
  const [showSigningReason, setShowSigningReason] = useState(false);
  const [signingLocation, setSigningLocation] = useState("");
  const [showSigningLocation, setShowSigningLocation] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [imageMode, setImageMode] = useState("imageAndText");
  const [boxDimensions, setBoxDimensions] = useState({
    width: 100,
    height: 100,
  });
  const [showBoxDimensions, setShowBoxDimensions] = useState(false);

  const signatureRef = useRef(null);

  const onFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleImageChange = (event) => {
    setImageFile(URL.createObjectURL(event.target.files[0]));
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

  const handleFontSizeChange = (event) => {
    setFontSize(Number(event.target.value));
  };

  const handleDateTimeCheckboxChange = (event) => {
    setShowDateTime(event.target.checked);
  };

  const handleDateTimeFormatChange = (event) => {
    setDateTimeFormat(event.target.value);
  };

  const handleBoxDimensionsChange = (e) => {
    const { name, value } = e.target;
    setBoxDimensions((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const renderSignature = () => {
    let fullSignature = signatureText;

    if (showCertificateSubject) {
      fullSignature += "Certificate Subject";
    }
    if (showDateTime) {
      const dateTime = moment().format(dateTimeFormat);
      fullSignature += dateTime;
    }
    if (showSigningReason && signingReason) {
      fullSignature += "Reason: " + signingReason;
    }
    if (showSigningLocation && signingLocation) {
      fullSignature += "Location:" + signingLocation;
    }

    return fullSignature;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
      }}
    >
      {/* Left side: Controls */}
      <div
        style={{ width: "30%", padding: "20px", borderRight: "1px solid #ccc" }}
      >
        <h3>Signature Settings</h3>

        {/* Signature Text Input */}
        <input
          type="text"
          placeholder="Enter signature text"
          value={signatureText}
          onChange={(e) => setSignatureText(e.target.value)}
          style={{ marginBottom: "10px", width: "100%" }}
        />

        {/* Font Size Selector */}
        <div style={{ marginBottom: "10px" }}>
          <label>Font Size:</label>
          <select
            value={fontSize}
            onChange={handleFontSizeChange}
            style={{ marginLeft: "10px" }}
          >
            <option value="20">Default Size</option>
            {[...Array(21).keys()]
              .map((i) => i * 2 + 2)
              .map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
          </select>
        </div>

        {/* Show Date/Time Checkbox */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={showDateTime}
              onChange={handleDateTimeCheckboxChange}
            />
            Show Sign Date/Time
          </label>
        </div>

        {/* Date/Time Format Selector (only shows if checkbox is checked) */}
        {showDateTime && (
          <div style={{ marginBottom: "10px" }}>
            <label>Date/Time Format:</label>
            <select
              value={dateTimeFormat}
              onChange={handleDateTimeFormatChange}
              style={{ marginLeft: "10px", width: "100%" }}
            >
              <option value="MMMM Do YYYY, h:mm:ss a">
                MMMM Do YYYY, h:mm:ss a
              </option>
              <option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</option>
              <option value="MM/DD/YYYY h:mm A">MM/DD/YYYY h:mm A</option>
              <option value="dddd, MMMM Do YYYY">dddd, MMMM Do YYYY</option>
              <option value="DD-MM-YYYY HH:mm">DD-MM-YYYY HH:mm</option>
            </select>
          </div>
        )}

        {/* Show Certificate Subject Checkbox */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={showCertificateSubject}
              onChange={(e) => setShowCertificateSubject(e.target.checked)}
            />
            Show Certificate Subject
          </label>
        </div>

        {/* Signing Reason Checkbox and Input */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={showSigningReason}
              onChange={(e) => setShowSigningReason(e.target.checked)}
            />
            Signing Reason Required
          </label>
        </div>
        {showSigningReason && (
          <input
            type="text"
            placeholder="Enter signing reason"
            value={signingReason}
            onChange={(e) => setSigningReason(e.target.value)}
            style={{ marginBottom: "10px", width: "100%" }}
          />
        )}

        {/* Signing Location Checkbox and Input */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={showSigningLocation}
              onChange={(e) => setShowSigningLocation(e.target.checked)}
            />
            Signing Location Required
          </label>
        </div>
        {showSigningLocation && (
          <input
            type="text"
            placeholder="Enter signing location"
            value={signingLocation}
            onChange={(e) => setSigningLocation(e.target.value)}
            style={{ marginBottom: "10px", width: "100%" }}
          />
        )}

        {/* Place an Image in Signing Box Checkbox */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={showImage}
              onChange={(e) => setShowImage(e.target.checked)}
            />
            Place an Image in Signing Box
          </label>
        </div>
        {showImage && (
          <div style={{ marginBottom: "10px" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: "10px" }}
            />

            {/* Image Mode Radio Buttons */}
            <div style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="radio"
                  name="imageMode"
                  value="imageAndText"
                  checked={imageMode === "imageAndText"}
                  onChange={(e) => setImageMode(e.target.value)}
                />
                Image and Text
              </label>
              <label style={{ marginLeft: "10px" }}>
                <input
                  type="radio"
                  name="imageMode"
                  value="imageAsBackground"
                  checked={imageMode === "imageAsBackground"}
                  onChange={(e) => setImageMode(e.target.value)}
                />
                Image as Background
              </label>
              <label style={{ marginLeft: "10px" }}>
                <input
                  type="radio"
                  name="imageMode"
                  value="imageWithoutText"
                  checked={imageMode === "imageWithoutText"}
                  onChange={(e) => setImageMode(e.target.value)}
                />
                Image without Text
              </label>
            </div>
          </div>
        )}

        {/* Signing Box Dimensions Checkbox */}
        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={showBoxDimensions}
              onChange={(e) => setShowBoxDimensions(e.target.checked)}
            />
            Customize Signing Box Height and Width
          </label>
        </div>
        {showBoxDimensions && (
          <div style={{ marginBottom: "10px" }}>
            <label>Width:</label>
            <select
              name="width"
              value={boxDimensions.width}
              onChange={handleBoxDimensionsChange}
              style={{ marginLeft: "10px" }}
            >
              {[...Array(100).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}%
                </option>
              ))}
            </select>

            <label style={{ marginLeft: "20px" }}>Height:</label>
            <select
              name="height"
              value={boxDimensions.height}
              onChange={handleBoxDimensionsChange}
              style={{ marginLeft: "10px" }}
            >
              {[...Array(100).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}%
                </option>
              ))}
            </select>
          </div>
        )}

        {/* PDF File Upload */}
        <input
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          style={{ marginBottom: "10px" }}
        />
      </div>

      {/* Right side: PDF Preview with Signature */}
      <div style={{ width: "65%", padding: "20px" }}>
        {pdfFile && (
          <div
            style={{
              position: "relative",
              border: "1px solid #ccc",
              overflow: "hidden",
              maxWidth: "100%",
              margin: "auto",
            }}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <Document
              file={pdfFile}
              onLoadSuccess={({ numPages }) => setPageNumber(1)}
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

            {/* Draggable Signature Preview */}
            {signatureText && (
              <div
                ref={signatureRef}
                style={{
                  position: "absolute",
                  left: `${signaturePosition.x}px`,
                  top: `${signaturePosition.y}px`,
                  color: "red",
                  cursor: "move",
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                  whiteSpace: "pre",
                  width: `${boxDimensions.width}%`,
                  height: `${boxDimensions.height}%`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  backgroundImage:
                    showImage &&
                    imageFile &&
                    (imageMode === "imageAsBackground" ||
                      imageMode === "imageWithoutText")
                      ? `url(${imageFile})`
                      : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: "2px dashed #007bff", // Border around the signature box
                  backgroundColor: "rgba(255, 255, 255, 0.5)", // Light background for better visibility
                }}
                draggable
                onDragStart={onDragStart}
              >
                {showImage && imageFile && imageMode === "imageAndText" && (
                  <img
                    src={imageFile}
                    alt="Signature"
                    style={{ maxWidth: "50%", marginRight: "10px" }}
                  />
                )}
                {imageMode !== "imageWithoutText" && renderSignature()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
