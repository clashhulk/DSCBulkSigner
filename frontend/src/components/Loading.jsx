import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = ({ loadingMessage = 'DSC Sign Master' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
        }}
      >
        <img
          src="/dsc-master.jpg"
          alt="Loading"
          style={{ width: '300px', height: '300px', marginBottom: '20px' }} // Adjust size as needed
        />
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ marginTop: '20px' }}>
          {loadingMessage}
        </Typography>
      </Box>
    </Box>
  );
};

export default LoadingScreen;
