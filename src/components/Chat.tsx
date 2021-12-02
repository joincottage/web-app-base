import { App } from 'sendbird-uikit';
import { Fade } from '@material-ui/core';

// https://sendbird.com/docs/uikit/v1/react/guides/themes
const cottageColorSet = {
  '--sendbird-light-primary-500': 'rgba(31,87,184, 1)',
  '--sendbird-light-primary-400': 'rgba(31,87,184, .9)',
  '--sendbird-light-primary-300': 'rgba(31,87,184, 1)',
  '--sendbird-light-primary-200': 'rgba(31,87,184, .3)',
  '--sendbird-light-primary-100': 'rgba(31,87,184, .1)',
};

export default () => (
  <Fade in={true} timeout={500}>
    <div style={{ height: '95vh' }}>
      <App
        appId={'2A5E06C4-BADB-4F01-96A3-12045939B3CE'}
        userId={'hunterhod'}
        colorSet={cottageColorSet}
      />
    </div>
  </Fade>
);
