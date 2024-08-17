import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';

const Preview = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setShowPreview(false); // Reset preview visibility when a new file is selected
    }
  };

  const handlePreviewClick = () => {
    if (!selectedFile) {
      alert('No file selected.');
      return;
    }
    setShowPreview(true); // Show the preview
  };

  const handleCancelClick = () => {
    setShowPreview(false); // Hide the preview
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-start' }}>
        <Button
          variant="contained"
          component="label"
        >
          Upload File
          <input
            type="file"
            hidden
            onChange={handleFileChange}
          />
        </Button>
        {selectedFile && (
          <Typography variant="body2" sx={{ mt: 1, wordBreak: 'break-all' }}>
            Selected File: {selectedFile.name}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePreviewClick}
          disabled={!selectedFile}
        >
          Preview
        </Button>
      </Box>
      {showPreview && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Box
            sx={{
              border: '1px solid #ccc',
              padding: 2,
              width: '50%',       // Decrease width
              height: '70vh',      // Increase height
              maxHeight: '70vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {previewUrl ? (
              <iframe
                src={previewUrl}
                title="File Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  border: 'none',
                }}
              />
            ) : (
              <Typography>No file selected for preview.</Typography>
            )}
          </Box>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancelClick}
            sx={{ alignSelf: 'flex-end' }}
          >
            Cancel Preview
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Preview;
