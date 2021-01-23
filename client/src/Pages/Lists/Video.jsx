import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Layout from '../../components/Layout';
import TikTokVideo from '../../components/TikTokVideo';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  dialog: {
    padding: 0,
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  videoContainer: {
    // minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1rem',
    maxWidth: 1024,
    width: '100%',
  },
  endOfTheList: {
    textAlign: 'center',
    fontWeight: 'bold',
    margin: '1rem',
    fontStyle: 'italic',
  },
}));

/* eslint react/jsx-props-no-spreading: 0 */
const Transition = React.forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

const Details = ({ video, referer }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);

  function handleClose() {
    Inertia.visit(referer || `/`);
  }

  return (
    <Dialog
      fullScreen
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
            {video.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.dialog}>
        <Paper key={video.id} elevation={5} className={classes.videoContainer}>
          {isLoading && <CircularProgress />}
          <TikTokVideo
            tiktokId={video.tiktok_id}
            html={video.html}
            isReadyCallback={() => {
              setIsLoading(false);
            }}
          />
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

Details.layout = (page) => <Layout children={page} title={page.props.video.title} cleanLayout />;

export default Details;
