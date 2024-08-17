import React, { useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';

const Operations = () => {
  const [sourcePath, setSourcePath] = useState('');
  const [destinationPath, setDestinationPath] = useState('');
  const [status, setStatus] = useState('');

  const handleSourceSelect = async () => {
    const selectedPath = await window.electron.selectFolder();
    if (selectedPath) {
      setSourcePath(selectedPath);
    }
  };

  const handleDestinationSelect = async () => {
    const selectedPath = await window.electron.selectFolder();
    if (selectedPath) {
      setDestinationPath(selectedPath);
    }
  };

  const handleCopyFiles = async () => {
    if (sourcePath && destinationPath) {
      const result = await window.electron.copyFiles(sourcePath, destinationPath);
      setStatus(result);
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" onClick={handleSourceSelect}>
            Choose Source Folder
          </Button>
          {sourcePath && (
            <Typography variant="body1" style={{ marginTop: '10px' }}>
              Source: {sourcePath}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button variant="contained" onClick={handleDestinationSelect}>
            Choose Destination Folder
          </Button>
          {destinationPath && (
            <Typography variant="body1" style={{ marginTop: '10px' }}>
              Destination: {destinationPath}
            </Typography>
          )}
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '20px' }}
        onClick={handleCopyFiles}
        disabled={!sourcePath || !destinationPath}
      >
        Copy Files
      </Button>
      {status && (
        <Typography variant="body2" color="textSecondary" style={{ marginTop: '20px' }}>
          {status}
        </Typography>
      )}
    </div>
  );
};

export default Operations;
