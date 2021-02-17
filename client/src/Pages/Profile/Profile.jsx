import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  email: {
    margin: '1rem',
    textAlign: 'center',
  },
  listItemAvatar: {
    minWidth: 72,
  },
  avatar: {
    width: theme.spacing(7),
    height: '100%',
  },
  buttons: {
    marginLeft: '1rem',
  },
  dialog: {
    padding: 0,
    top: 0,
    left: 0,
    height: '100%',
    // -- width: '100%',
  },
  content: {
    height: '100vh',
  },
}));

/* eslint react/jsx-props-no-spreading: 0 */
const Transition = React.forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

const ProfilePage = ({ user /* , lists = [] */ }) => {
  const {
    props: { isMobile },
  } = usePage();
  const classes = useStyles();

  function handleClose() {
    Inertia.visit('/', { preserveScroll: true });
  }

  return (
    <Dialog
      fullScreen={isMobile}
      fullWidth
      maxWidth="sm"
      open
      onClose={handleClose}
      TransitionComponent={Transition}
      closeAfterTransition
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            My profile
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.content}>
        <Typography variant="h5" color="textPrimary" className={classes.email}>
          {user.email}
        </Typography>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              Inertia.visit('/profile/lists');
            }}
          >
            View my lists
          </Button>
          <Button
            className={classes.buttons}
            variant="contained"
            color="primary"
            onClick={() => {
              Inertia.get('/logout');
            }}
          >
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

ProfilePage.layout = (page) => <Layout children={page} title="Profile" />;

export default ProfilePage;
