import React, { useEffect, useState } from 'react';
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

const Details = ({ list }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videos, setVideos] = useState([]);

  function handleClose() {
    Inertia.visit('/');
  }

  useEffect(() => {
    const newVideo = [
      {
        id: list.videos[videoIndex].id,
        isVisible: true,
        isReady: false,
        video: list.videos[videoIndex],
      },
    ];
    setVideos([...videos, ...newVideo]);
    // }
  }, [videoIndex]);

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
            {list.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.dialog}>
        <section
          id="ancestor"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
            width: '100%',
          }}
        >
          {videos.map((item) => (
            <Paper key={item.id} elevation={5} className={classes.videoContainer}>
              <TikTokVideo
                tiktokId={item.video.tiktok_id}
                html={item.video.html}
                isReadyCallback={(id) => {
                  const idx = videos.findIndex((x) => x.video.tiktok_id === id);

                  if (idx >= 0) {
                    const newVideos = [...videos];
                    newVideos[idx].isReady = true;
                    setVideos([...newVideos]);
                    // setVideoIndex(videoIndex + 1);
                    setIsLoading(false);
                  }
                }}
              />
            </Paper>
          ))}
          {!isLoading && (
            <Waypoint
              data-name="waypoint"
              onEnter={() => {
                setIsLoading(true);
                const previous = videos[videoIndex];
                if (previous.isReady && videoIndex < list.videos.length - 1) {
                  setVideoIndex(videoIndex + 1);
                }
              }}
            />
          )}
          {videos.length === list.videos.length && videos[videos.length - 1].isReady && (
            <Typography variant="subtitle2" className={classes.endOfTheList}>
              This is the end of the list
            </Typography>
          )}
        </section>
      </DialogContent>
    </Dialog>
  );
};

Details.layout = (page) => <Layout children={page} title={page.props.list.title} cleanLayout />;

export default Details;
