import "react-toastify/dist/ReactToastify.css";

import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { toast, ToastContainer } from "react-toastify";

import DSCInfo from "../../components/DSCInfo/DSCInfo";

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
  const [password, setPassword] = useState("");
  const [isPasswordPromptVisible, setIsPasswordPromptVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [selecteDSC, setSelecteDSC] = useState(null);

  const [dscInfo, setDscInfo] = useState();

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

  const checkForConnectedDsc = async () => {
    setLoadingMessage("Checking for connected DSCs...");
    setLoading(true);

    try {
      const result = await window.api.listConnectedDsc();
      const data = result;

      if (data.status === "success" && data.data.length > 0) {
        const firstDsc = data.data[0];
        console.log("Selected DSC:", firstDsc[0]);
        setSelecteDSC(data.data[0][0]);
        toast.success("DSC connected successfully. Please enter the password.");
        setIsPasswordPromptVisible(true);
      } else {
        toast.error("No DSC is connected. Please connect a DSC and try again.");
      }
    } catch (error) {
      console.error("Error checking for connected DSCs:", error);
      toast.error("Failed to retrieve DSCs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordSubmit = async () => {
    if (password.trim() && selecteDSC !== null) {
      setLoadingMessage("Verifying DSC and retrieving information...");
      setLoading(true);
      try {
        const result = await window.api.verifyAndGetDscInfo(
          selecteDSC,
          password
        );
        const data = result;

        if (data.status === "success") {
          toast.success("DSC verified successfully!");
          console.log("DSC Information:", data.data);
          setDscInfo(data.data[0]);
        } else {
          toast.error(data.message || "Failed to verify DSC.");
        }
      } catch (error) {
        console.error("Error verifying DSC:", error);
        toast.error("An error occurred while verifying DSC. Please try again.");
      } finally {
        setLoading(false);
        // setIsPasswordPromptVisible(false);
      }
    } else {
      toast.warn("Please enter a valid password.");
    }
  };

  useEffect(() => {
    checkForConnectedDsc();
  }, []);
  const onDrop = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const rect = e.target.getBoundingClientRect();
    setSignaturePosition({
      x: e.clientX - rect.left - data.x,
      y: e.clientY - rect.top - data.y,
    });
    {
      showImage && (
        <Box sx={{ marginBottom: "10px" }}>
          {/* File input for image upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: "10px" }}
          />

          {/* Image Mode Radio Buttons */}
          <FormControl component="fieldset" sx={{ marginBottom: "16px" }}>
            <FormLabel component="legend" sx={{ marginBottom: "8px" }}>
              Image Mode
            </FormLabel>
            <RadioGroup
              row
              name="imageMode"
              value={imageMode}
              onChange={(e) => setImageMode(e.target.value)}
            >
              <FormControlLabel
                value="imageAndText"
                control={<Radio />}
                label="Image and Text"
                sx={{ marginRight: "16px" }}
              />
              <FormControlLabel
                value="imageAsBackground"
                control={<Radio />}
                label="Image as Background"
                sx={{ marginRight: "16px" }}
              />
              <FormControlLabel
                value="imageWithoutText"
                control={<Radio />}
                label="Image without Text"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      );
    }
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
        {dscInfo && dscInfo.label ? dscInfo.label : "No label available"}
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
        style={{
          width: "30%",
          height: "100vh",
          padding: "20px",
          borderRight: "1px solid #ccc",
        }}
      >
        <div>
          <ToastContainer />
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
            <Typography variant="h6" sx={{ ml: 2 }}>
              {loadingMessage}
            </Typography>
          </Backdrop>

          {/* Display password prompt if a DSC token is connected */}
          {isPasswordPromptVisible && (
            <Box sx={{ marginBottom: "10px" }}>
              <TextField
                type="password"
                label="DSC Password"
                value={password}
                onChange={handlePasswordChange}
                fullWidth
                sx={{ marginBottom: "10px" }}
              />
              <Button variant="contained" onClick={handlePasswordSubmit}>
                Submit Password
              </Button>
            </Box>
          )}

          {/* Manual Check DSC Button */}
          <Button
            variant="contained"
            color="primary"
            onClick={checkForConnectedDsc}
            sx={{ marginBottom: "10px" }}
          >
            Check Connected DSC
          </Button>

          {/* Rest of your UI components here */}
        </div>
        <DSCInfo dscInfo={dscInfo} loading={loading} />
        <Button
          variant="contained"
          component="label"
          sx={{ marginBottom: "10px" }}
        >
          Choose PDF File
          <input
            type="file"
            accept="application/pdf"
            onChange={onFileChange}
            hidden
          />
        </Button>
        {/* Signature Text Input */}
        <h2 style={{ color: "#333", textAlign: "center" }}>
          Signature Settings
        </h2>

        {/* Font Size Selector */}
        <FormControl
          variant="outlined"
          size="small"
          fullWidth
          style={{ marginBottom: "20px" }}
        >
          <InputLabel>Font Size</InputLabel>
          <Select
            value={fontSize}
            onChange={handleFontSizeChange}
            label="Font Size"
          >
            <MenuItem value={20}>Default Size</MenuItem>
            {[...Array(21).keys()]
              .map((i) => i * 2 + 2)
              .map((size) => (
                <MenuItem key={size} value={size}>
                  {size}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Show Certificate Subject Checkbox */}
        <Box sx={{ marginBottom: "10px" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showCertificateSubject}
                onChange={(e) => setShowCertificateSubject(e.target.checked)}
              />
            }
            label="Show Certificate Subject"
          />
          {showCertificateSubject && (
            <TextField
              fullWidth
              placeholder="Enter signing subject"
              value={certificateSubject}
              onChange={(e) => setCertificateSubject(e.target.value)}
              sx={{ marginBottom: "10px" }}
            />
          )}
        </Box>

        {/* Signing Reason Checkbox and Input */}
        <Box sx={{ marginBottom: "10px" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showSigningReason}
                onChange={(e) => setShowSigningReason(e.target.checked)}
              />
            }
            label="Signing Reason Required"
          />
          {showSigningReason && (
            <TextField
              fullWidth
              placeholder="Enter signing reason"
              value={signingReason}
              onChange={(e) => setSigningReason(e.target.value)}
              sx={{ marginBottom: "10px" }}
            />
          )}
        </Box>

        {/* Signing Location Checkbox and Input */}
        <Box sx={{ marginBottom: "10px" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showSigningLocation}
                onChange={(e) => setShowSigningLocation(e.target.checked)}
              />
            }
            label="Signing Location Required"
          />
          {showSigningLocation && (
            <TextField
              fullWidth
              placeholder="Enter signing location"
              value={signingLocation}
              onChange={(e) => setSigningLocation(e.target.value)}
              sx={{ marginBottom: "10px" }}
            />
          )}
        </Box>

        {/* Place an Image in Signing Box Checkbox */}
        <Box sx={{ marginBottom: "10px" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={showImage}
                onChange={(e) => setShowImage(e.target.checked)}
              />
            }
            label="Place an Image in Signing Box"
          />
        </Box>
        {showImage && (
          <Box sx={{ marginBottom: "10px" }}>
            {/* File input for image upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: "10px" }}
            />

            {/* Image Mode Radio Buttons */}
            <FormControl component="fieldset" sx={{ marginBottom: "10px" }}>
              <FormLabel component="legend">Image Mode</FormLabel>
              <RadioGroup
                row
                name="imageMode"
                value={imageMode}
                onChange={(e) => setImageMode(e.target.value)}
              >
                <FormControlLabel
                  value="imageAndText"
                  control={<Radio />}
                  label="Image and Text"
                />
                <FormControlLabel
                  value="imageAsBackground"
                  control={<Radio />}
                  label="Image as Background"
                  sx={{ marginLeft: "10px" }}
                />
                <FormControlLabel
                  value="imageWithoutText"
                  control={<Radio />}
                  label="Image without Text"
                  sx={{ marginLeft: "10px" }}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        )}
        {/* Signing Box Dimensions Checkbox */}
        <Box sx={{ marginBottom: "10px" }}>
          {/* Checkbox for showing/hiding box dimensions */}
          <FormControlLabel
            control={
              <Checkbox
                checked={showBoxDimensions}
                onChange={(e) => setShowBoxDimensions(e.target.checked)}
              />
            }
            label="Customize Signing Box Height and Width"
          />

          {showBoxDimensions && (
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
              {/* Width Dropdown */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="width-label">Width</InputLabel>
                  <Select
                    labelId="width-label"
                    id="width-select"
                    name="width"
                    value={boxDimensions.width}
                    onChange={handleBoxDimensionsChange}
                    label="Width"
                  >
                    {[...Array(100).keys()].map((i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}%
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Height Dropdown */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="height-label">Height</InputLabel>
                  <Select
                    labelId="height-label"
                    id="height-select"
                    name="height"
                    value={boxDimensions.height}
                    onChange={handleBoxDimensionsChange}
                    label="Height"
                  >
                    {[...Array(100).keys()].map((i) => (
                      <MenuItem key={i + 1} value={i + 1}>
                        {i + 1}%
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </Box>
        {/* Show Date/Time Checkbox */}
        <Box sx={{ marginBottom: "10px" }}>
          {/* Checkbox for showing/hiding date/time format selector */}
          <FormControlLabel
            control={
              <Checkbox
                checked={showDateTime}
                onChange={handleDateTimeCheckboxChange}
              />
            }
            label="Show Sign Date/Time"
          />

          {/* Date/Time Format Selector (only shows if checkbox is checked) */}
          {showDateTime && (
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>Date/Time Format</InputLabel>
              <Select
                value={dateTimeFormat}
                onChange={handleDateTimeFormatChange}
                label="Date/Time Format"
              >
                <MenuItem value="DD-MMM-YYYY HH:mm Z">
                  DD-MMM-YYYY HH:mm Z
                </MenuItem>
                <MenuItem value="YYYY-MM-DD HH:mm:ss">
                  YYYY-MM-DD HH:mm:ss
                </MenuItem>
                <MenuItem value="MM/DD/YYYY h:mm A">MM/DD/YYYY h:mm A</MenuItem>
                <MenuItem value="dddd, MMMM Do YYYY">
                  dddd, MMMM Do YYYY
                </MenuItem>
                <MenuItem value="DD-MM-YYYY HH:mm">DD-MM-YYYY HH:mm</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
        {/* PDF File Upload */}
        <Box sx={{ marginBottom: "10px" }}></Box>
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
