import moment from "moment";
import React, { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Home = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [signatureText, setSignatureText] = useState("Signature valid");
  const [signaturePosition, setSignaturePosition] = useState({ x: 50, y: 50 });
  const [fontSize, setFontSize] = useState(12);
  const [showDateTime, setShowDateTime] = useState(false);
  const [dateTimeFormat, setDateTimeFormat] = useState("DD-MMM-YYYY HH:mm Z");
  const [showCertificateSubject, setShowCertificateSubject] = useState(false);
  const [certificateSubject, setCertificateSubject] = useState("");
  const [signingReason, setSigningReason] = useState("");
  const [showSigningReason, setShowSigningReason] = useState(false);
  const [signingLocation, setSigningLocation] = useState("");
  const [showSigningLocation, setShowSigningLocation] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [imageMode, setImageMode] = useState("imageAndText");
  const [boxDimensions, setBoxDimensions] = useState({
    width: 15,
    height: 8,
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
    let dscName = (
      <span style={{ textTransform: "uppercase", position: "absolute" }}>
        Akshata Chandrashekhar Bhimnale
      </span>
    );
    let dscTitle = (
      <span style={{ fontWeight: "500", fontSize: "24px" }}>
        Signature valid
      </span>
    ); // Larger and bold font for dscTitle
    let fullSignature = (
      <span>
        {dscTitle}
        {"\n"}Digitally signed by {dscName}
      </span>
    );

    if (showCertificateSubject && certificateSubject) {
      fullSignature = (
        <span>
          {fullSignature}
          {"\n"}Certificate Subject: {certificateSubject}
        </span>
      );
    }
    if (showDateTime) {
      const dateTime = moment().format(dateTimeFormat);
      fullSignature = (
        <span>
          {fullSignature}
          {"\n"}
          {dateTime}
        </span>
      );
    }
    if (showSigningReason && signingReason) {
      fullSignature = (
        <span>
          {fullSignature}
          {"\n"}Reason: {signingReason}
        </span>
      );
    }
    if (showSigningLocation && signingLocation) {
      fullSignature = (
        <span>
          {fullSignature}
          {"\n"}Location: {signingLocation}
        </span>
      );
    }

    return fullSignature;
  };

  const runPythonScript = async () => {
    try {
      const result = await window.api.runPythonScript();
      console.log(result);
    } catch (error) {
      console.error("Error running Python script:", error);
    }
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
        <button onClick={runPythonScript}>Run Python Script</button>
        <h3>Signature Settings</h3>

        {/* Signature Text Input */}

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
        {showCertificateSubject && (
          <input
            type="text"
            placeholder="Enter signing subject"
            value={certificateSubject}
            onChange={(e) => setCertificateSubject(e.target.value)}
            style={{ marginBottom: "10px", width: "100%" }}
          />
        )}

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
              <option value="DD-MMM-YYYY HH:mm Z">DD-MMM-YYYY HH:mm Z</option>
              <option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</option>
              <option value="MM/DD/YYYY h:mm A">MM/DD/YYYY h:mm A</option>
              <option value="dddd, MMMM Do YYYY">dddd, MMMM Do YYYY</option>
              <option value="DD-MM-YYYY HH:mm">DD-MM-YYYY HH:mm</option>
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
                  color: "black",
                  cursor: "move",
                  fontSize: `${fontSize}px`,
                  whiteSpace: "pre",
                  width: `${boxDimensions.width}%`,
                  height: `${boxDimensions.height}%`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundImage:
                    showImage &&
                    imageFile &&
                    (imageMode === "imageAsBackground" ||
                      imageMode === "imageWithoutText")
                      ? `url(${imageFile})`
                      : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
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
