import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
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
import FavoriteButton from '../../components/FavoriteButton';

const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
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
  mainGrid: {
    backgroundColor: 'white',
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

/* eslint react/jsx-props-no-spreading: 0 */
const Transition = React.forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

const Details = ({ pageReferer }) => {
  const {
    props: {
      auth,
      modal: { list, videos: initialVideos, from = '' },
      isMobile,
      referer,
    },
  } = usePage();
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [videos, setVideos] = useState(initialVideos);
  const [items, setItems] = useState([]);
  const [initialVideoOrderId] = useState(initialVideos.length > 0 ? initialVideos[0].order_id : 0);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingCount, setLoadingCount] = useState(initialVideos.length);
  const transtitionProps = {};

  async function handleClose() {
    setIsModalOpen(false);
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
      Inertia.visit(`/list/${list.id}`, {
        only: ['auth', 'flash', 'errors', 'from', 'modal'],
        preserveScroll: true,
        preserveState: true,
        headers: {
          'X-List-From': from,
          'X-List-Page': currentPage,
          'X-Page-Referer': pageReferer,
        },
        onStart() {
          setLoadingCount(100);
        },
        onSuccess({ props }) {
          setLoadingCount(props.modal.videos.length);
          setVideos(props.modal.videos);
        },
      });
    }
  }, [currentPage]);

  if (referer) {
    transtitionProps.TransitionComponent = Transition;
    transtitionProps.closeAfterTransition = true;
  }

  return (
    <>
      <SEO title={list.title} />
      <Dialog
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
        open={isModalOpen}
        onClose={handleClose}
        onExited={() => {
          Inertia.visit(
            referer || '/',
            referer
              ? {
                  preserveScroll: true,
                  preserveState: !referer.includes('?tab=favorited'),
                  only: ['auth', 'flash', 'errors', 'modal', 'isFavorited', 'lists'],
                }
              : {}
          );
        }}
        {...transtitionProps}
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
            {auth.isAuthenticated && list.user_id !== auth.credentials.id && (
              <FavoriteButton
                isFavorited={list.is_favorited}
                onClick={() => {
                  Inertia.post(
                    `/list/${list.id}/favorite`,
                    {},
                    {
                      headers: { 'X-Page-Referer': pageReferer },
                      preserveScroll: true,
                      preserveState: true,
                      only: ['auth', 'flash', 'errors', 'isFavorited', 'modal'],
                    }
                  );
                }}
              />
            )}
            {pageReferer !== 'details' && (
              <Tooltip title="View list details">
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  component={InertiaLink}
                  href={`/list/${list.id}/details`}
                  onClick={(e) => {
                    e.preventDefault();
                    Inertia.visit(`/list/${list.id}/details`);
                  }}
                >
                  <ListIcon />
                </IconButton>
              </Tooltip>
            )}
          </Toolbar>
        </AppBar>
        <DialogContent className={classes.content}>
          <Grid container className={classes.mainGrid}>
            <Grid item md={12}>
              <Grid container direction="row" wrap="nowrap" alignItems="center">
                <Typography
                  component="h6"
                  variant="h6"
                  className={classes.inlineTitle}
                  style={{ flexGrow: 1 }}
                >
                  {list.title}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {initialVideoOrderId > 1 && (
            <InertiaLink
              href={`/list/${list.id}`}
              only={['auth', 'flash', 'errors', 'from', 'videos']}
              preserveScroll
              headers={{
                'X-Page-Referer': pageReferer,
              }}
            >
              <MuiAlert severity="info">
                Viewing list from video #{initialVideoOrderId}.&nbsp; Click here to view from
                beginning or return to the lists to select a specific video.
              </MuiAlert>
            </InertiaLink>
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
