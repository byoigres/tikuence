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
  const [videos, setVideos] = useState(list.videos);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingCount, setLoadingCount] = useState(list.videos.length);

  function handleClose() {
    Inertia.visit(referer || '/', { preserveScroll: true, preserveState: true });
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
      Inertia.visit(`/list/${list.id}?page=${currentPage}`, {
        preserveScroll: true,
        preserveState: true,
        onStart() {
          setLoadingCount(100);
        },
        onSuccess({ props }) {
          setLoadingCount(props.list.videos.length);
          setVideos(props.list.videos);
        },
      });
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
            {!hasMore && (
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
