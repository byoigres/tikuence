import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Slide from '@material-ui/core/Slide';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'relative',
  },
}));

/* eslint react/jsx-props-no-spreading: 0 */
const Transition = React.forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

const Session = () => {
  const classes = useStyles();
  const {
    props: { isMobile, referer },
  } = usePage();

  function handleClose() {
    Inertia.visit(referer || '/', { preserveScroll: true, preserveState: true });
  }

  return (
    <Dialog
      fullScreen={isMobile}
      maxWidth="sm"
      open
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Login</Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
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
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default Session;
