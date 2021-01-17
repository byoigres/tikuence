import React from 'react';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TwitterIcon from '@material-ui/icons/Twitter';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import Layout from '../../components/Layout';

const Session = () => (
  <div>
    <Paper
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
      }}
    >
      <Typography variant="h6">Sign in with yout social account</Typography>
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
    </Paper>
  </div>
);

Session.layout = (page) => <Layout children={page} title="Login" />;

export default Session;