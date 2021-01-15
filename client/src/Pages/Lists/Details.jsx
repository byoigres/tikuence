import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Waypoint } from 'react-waypoint';
import Layout from '../../components/Layout';
import TikTokVideo from '../../components/TikTokVideo';
// import TTLoader from '../../components/TTLoader';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  dialog: {
    padding: 0,
  },
  videoContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1rem',
  },
}));

/* eslint react/jsx-props-no-spreading: 0 */
const Transition = React.forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

const Details = ({ list }) => {
  const classes = useStyles();
  const [videos, setVideos] = useState(
    list.videos.map((x) => ({ id: x.id, isVisible: false, video: x }))
  );
  const [isLoading] = useState(false);

  function handleClose() {
    Inertia.visit('/');
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
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            disabled={isLoading}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {list.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.dialog}>
        <section>
          {videos.map((item, index) => (
            <Waypoint
              key={item.id}
              onEnter={() => {
                videos[index].isVisible = true;
                const newVideos = [...videos];
                setVideos(newVideos);
              }}
            >
              <Paper elevation={5} className={classes.videoContainer}>
                {item.isVisible && <TikTokVideo html={item.video.html} />}
                {!item.isVisible && <h1>Loading...</h1>}
              </Paper>
            </Waypoint>
          ))}
        </section>
      </DialogContent>
    </Dialog>
  );
};

Details.layout = (page) => <Layout children={page} title={page.props.list.title} cleanLayout />;

export default Details;
