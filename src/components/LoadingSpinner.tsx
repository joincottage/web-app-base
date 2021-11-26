import { CircularProgress } from '@material-ui/core';
import React from 'react';

const LoadingSpinner = () => (
  <div>
    <CircularProgress color="info" style={{ width: '30px', height: '30px' }} />
  </div>
);

export default LoadingSpinner;
