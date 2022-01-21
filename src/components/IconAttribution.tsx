import React from 'react';
import Typography from '@material-ui/core/Typography';

export default function IconAttribution() {
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
      style={{ marginTop: '15px' }}
    >
      Icons made by{' '}
      <a href="https://www.freepik.com" title="Freepik">
        Freepik
      </a>{' '}
      from{' '}
      <a href="https://www.flaticon.com/" title="Flaticon">
        www.flaticon.com
      </a>
    </Typography>
  );
}
