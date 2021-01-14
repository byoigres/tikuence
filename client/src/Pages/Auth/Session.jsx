import React from 'react';
import Button from '@material-ui/core/Button';
import TwitterIcon from '@material-ui/icons/Twitter';
import GTranslateIcon from '@material-ui/icons/GTranslate';

const Session = () => (
  <>
    <h1>Login</h1>
    <Button
      variant="contained"
      color="secondary"
      startIcon={<GTranslateIcon />}
      style={{ backgroundColor: '#E04A32' }}
      fullWidth
      href="/auth/google"
    >
      Google
    </Button>
    <Button
      variant="contained"
      color="secondary"
      startIcon={<TwitterIcon />}
      style={{ backgroundColor: '#64CCF1' }}
      fullWidth
      href="/auth/twitter"
    >
      Twitter
    </Button>
  </>
);

export default Session;
