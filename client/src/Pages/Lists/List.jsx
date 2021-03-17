import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
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
import MuiAlert from '@material-ui/lab/Alert';
import Slide from '@material-ui/core/Slide';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ListIcon from '@material-ui/icons/List';
import { Waypoint } from 'react-waypoint';
import SEO from '../../components/SEO';
import TikTokVideo from '../../components/TikTokVideo';
import EndOfList from '../../components/EndOfList';

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

const Details = () => {
  const {
    props: { list, videos: initialVideos, isMobile, referer, from = 0 },
  } = usePage();
  const classes = useStyles();
  const [videos, setVideos] = useState(initialVideos);
  const [items, setItems] = useState([]);
  const [initialVideoOrderId] = useState(initialVideos.length > 0 ? initialVideos[0].order_id : 0);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingCount, setLoadingCount] = useState(initialVideos.length);

  function handleClose() {
    Inertia.visit(referer || '/', referer ? { preserveScroll: true, preserveState: true } : {});
  }

  useEffect(() => {
    if (videos.length > 0) {
      const newVideos = videos.map((video) => (
        <Paper
          key={`list-item-details-${video.id}`}
          elevation={0}
          className={classes.videoContainer}
        >
          <TikTokVideo
            tiktokId={video.tiktok_id}
            html={video.html}
            isReadyCallback={() => {
              setLoadingCount((val) => val - 1);
            }}
          />
        </Paper>
      ));
      setItems([...items, ...newVideos]);
    } else {
      setHasMore(false);
    }
  }, [videos]);

  useEffect(() => {
    if (currentPage > 1) {
      Inertia.visit(
        `/list/${list.id}?from=${from}&page=${currentPage}&ref=${encodeURIComponent(referer)}`,
        {
          only: ['from', 'videos', 'errors'],
          preserveScroll: true,
          preserveState: true,
          onStart() {
            setLoadingCount(100);
          },
          onSuccess({ props }) {
            setLoadingCount(props.videos.length);
            setVideos(props.videos);
          },
        }
      );
    }
  }, [currentPage]);

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
            <Tooltip title="View list">
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={(e) => {
                  e.preventDefault();
                  Inertia.visit(`/list/${list.id}/details`);
                }}
              >
                <ListIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <DialogContent className={classes.content}>
          <Typography component="h4" variant="h4" className={classes.name}>
            {list.title}
          </Typography>
          {initialVideoOrderId > 1 && (
            <MuiAlert severity="info">
              Viewing list from video #{initialVideoOrderId}.&nbsp;
              <InertiaLink href={`/list/${list.id}`}>
                Click here to view from beginning
              </InertiaLink>{' '}
              or return to the lists to select a specific video.
            </MuiAlert>
          )}
          <section className={classes.section}>
            {items}
            {hasMore && <CircularProgress />}
            {loadingCount === 0 && hasMore && (
              <Waypoint
                data-name="waypoint"
                onEnter={() => {
                  setCurrentPage(currentPage + 1);
                }}
              />
            )}
            {!hasMore && <EndOfList text="This is the end of the list" />}
            <div style={{ height: 10 }} />
          </section>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Details;
