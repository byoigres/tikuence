import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Tooltip from '@material-ui/core/Tooltip';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import EditIcon from '@material-ui/icons/Edit';
import { Waypoint } from 'react-waypoint';
import SEO from '../../components/SEO';
import TikTokVideo from '../../components/TikTokVideo';

const useStyles = makeStyles(() => ({
  title: {
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  name: {
    padding: '8px 24px',
  },
  dialog: {},
  content: {
    padding: 0,
    height: '100vh',
  },
  section: {
    textAlign: 'center',
  },
  videoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1rem',
    maxWidth: 1024,
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
  const {
    props: { isMobile, referer, auth },
  } = usePage();
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(true);
  const [videoIndex, setVideoIndex] = useState(0);
  const [videos, setVideos] = useState([]);

  function handleClose() {
    Inertia.visit(referer || '/', { preserveScroll: true, preserveState: true });
  }

  useEffect(() => {
    // TODO: no need to sort, already sorted SS
    /* eslint no-param-reassign: 0 */
    list.videos = list.videos.sort((a, b) => a.order_id - b.order_id);
  }, []);

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
  }, [videoIndex]);

  return (
    <>
      <SEO title={list.title} />
      <Dialog
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
        open
        onClose={handleClose}
        TransitionComponent={Transition}
        closeAfterTransition
        className={classes.dialog}
      >
        <AppBar position="relative">
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              View list
            </Typography>
            {auth.isAuthenticated && auth.credentials.id === list.user_id && (
              <Tooltip title="Edit">
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={(e) => {
                    e.preventDefault();
                    Inertia.visit(`/list/${list.id}/edit`);
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>
        <DialogContent className={classes.content}>
          <Typography component="h4" variant="h4" className={classes.name}>
            {list.title}
          </Typography>
          <section className={classes.section}>
            {videos.map((item) => (
              <Paper
                key={`list-item-details-${item.id}`}
                elevation={5}
                className={classes.videoContainer}
              >
                <TikTokVideo
                  tiktokId={item.video.tiktok_id}
                  html={item.video.html}
                  isReadyCallback={(id) => {
                    const idx = videos.findIndex((x) => x.video.tiktok_id === id);

                    if (idx >= 0) {
                      const newVideos = [...videos];
                      newVideos[idx].isReady = true;
                      setVideos([...newVideos]);
                    }
                    setIsLoading(false);
                  }}
                />
              </Paper>
            ))}
            {isLoading && <CircularProgress />}
            {!isLoading && (
              <Waypoint
                data-name="waypoint"
                onEnter={() => {
                  const previous = videos[videoIndex];
                  if (previous.isReady && videoIndex < list.videos.length - 1) {
                    setIsLoading(true);
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
            <div style={{ height: 10 }} />
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Details;
