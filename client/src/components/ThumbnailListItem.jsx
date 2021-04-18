import React, { useState, useEffect, useRef } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink } from '@inertiajs/inertia-react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  item: {
    position: 'relative',
    padding: 1,
  },
  details: ({ isMobile }) => ({
    opacity: 1,
    position: 'absolute',
    zIndex: 999,
    top: 1,
    bottom: 1,
    right: 1,
    left: 1,
    paddingBottom: isMobile ? 10 : 10,
    [theme.breakpoints.up('sm')]: {
      minHeight: 78,
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  }),
  info: ({ isMobile }) => ({
    backgroundColor: 'rgb(255 255 255 / 90%)',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    borderRadius: isMobile ? 0 : theme.spacing(1),
    margin: isMobile ? 0 : theme.spacing(1),
    marginBottom: theme.spacing(5),
    padding: 10,
    [theme.breakpoints.down('xs')]: {
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        width: 0 /* Remove scrollbar space */,
        background: 'transparent' /* Optional: just make scrollbar invisible */,
      },
      /* Optional: show position indicator in red */
      // ::-webkit-scrollbar-thumb {
      //     background: #FF0000;
      // }
    },
  }),
  infoContainer: {
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2),
    },
    height: '100%',
  },
  title: {
    // display: '-webkit-box',
    // overflow: 'hidden',
    // textOverflow: 'ellipsis',
    // '-webkit-box-orient': 'vertical',
    // '-webkit-line-clamp': 5,
    // maxHeight: 248,
    // maxHeight: 150,
    whiteSpace: 'normal',
    lineHeight: 1.3,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: theme.spacing(1.8),
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: theme.spacing(2.5),
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: theme.spacing(2.5),
    },
  },
  thumbnail: {
    width: '100%',
  },
  iconButton: {
    display: 'flex',
  },
  actions: {
    position: 'absolute',
    bottom: theme.spacing(1),
    right: 0,
    left: 0,
    display: 'flex',
  },
  actionContainer: ({ isMobile }) => ({
    display: 'flex',
    flexGrow: 1,
    // justifyContent: 'space-evenly',
    justifyContent: isMobile ? 'space-evenly' : 'flex-end',
  }),
  action: ({ isMobile }) => ({
    marginRight: theme.spacing(isMobile ? 0 : 1),
    borderRadius: '50%',
    backgroundColor: 'rgb(255 255 255 / 90%)',
  }),
}));

const ThumbnailItem = ({ id, title, thumbnail, videos, username, isMobile }) => {
  const [displayContainer, setDisplayContainer] = useState(isMobile);
  const [displayInfo, setDisplayInfo] = useState(!isMobile);
  const classes = useStyles({ displayContainer, isMobile });
  const thumbnailRef = useRef();
  const [iconButtonSize, setIconButtonSize] = useState('medium');
  const theme = useTheme();
  const isGreaterThanMedium = useMediaQuery(`(min-width:${theme.breakpoints.values.md}px)`);

  function onThumbnailEnter() {
    setDisplayContainer(true);
  }

  function onThumbnailLeave() {
    setDisplayContainer(false);
  }

  useEffect(() => {
    setIconButtonSize(isGreaterThanMedium ? 'medium' : 'small');
  }, [isGreaterThanMedium]);

  useEffect(() => {
    if (!isMobile) {
      thumbnailRef.current.addEventListener('mouseenter', onThumbnailEnter, false);
      thumbnailRef.current.addEventListener('mouseleave', onThumbnailLeave, false);

      return () => {
        if (thumbnailRef && thumbnailRef.current) {
          thumbnailRef.current.removeEventListener('mouseenter', onThumbnailEnter, false);
          thumbnailRef.current.removeEventListener('mouseleave', onThumbnailLeave, false);
        }
      };
    }

    return () => {};
  }, []);

  function onThumbnailItemInfoClick(e) {
    e.preventDefault();
    setDisplayInfo(!displayInfo);
  }

  return (
    <Grid item xs={4} sm={4} className={classes.item} data-name="Grid-Item" ref={thumbnailRef}>
      <InertiaLink
        href={`/list/${id}`}
        preserveScroll
        preserveState
        headers={{ 'X-Page-Referer': 'feed' }}
        only={['auth', 'flash', 'errors', 'modal', 'list', 'videos', 'referer']}
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: '#000',
        }}
      >
        <img src={thumbnail} alt={title} className={classes.thumbnail} />
        <Fade in={displayContainer}>
          <div className={classes.details} data-name="details">
            <Fade in={displayInfo} data-name="fade?" className={classes.info}>
              <div className={classes.infoContainer}>
                <Typography variant="h5" className={classes.title}>
                  {title}
                </Typography>
                <Divider variant="fullWidth" />
                <Typography variant="subtitle2" className={classes.text}>{`${videos} video${
                  videos > 0 ? 's' : ''
                }`}</Typography>
                <Typography
                  variant="subtitle2"
                  className={classes.text}
                  onClick={(e) => {
                    e.preventDefault();
                    Inertia.visit(`/users/${username}`);
                  }}
                >
                  @{username}
                </Typography>
              </div>
            </Fade>
            <div className={classes.actions}>
              <div className={classes.actionContainer}>
                {isMobile && (
                  <Tooltip title="List info">
                    <div className={classes.action}>
                      <IconButton
                        color="primary"
                        aria-label="list info"
                        size={iconButtonSize}
                        className={classes.iconButton}
                        onClick={onThumbnailItemInfoClick}
                      >
                        <InfoOutlinedIcon />
                      </IconButton>
                    </div>
                  </Tooltip>
                )}
                <Tooltip title="View details">
                  <div className={classes.action}>
                    <IconButton
                      color="primary"
                      aria-label="view details"
                      size={iconButtonSize}
                      className={classes.iconButton}
                      onClick={(e) => {
                        e.preventDefault();
                        Inertia.visit(`/list/${id}/details`);
                      }}
                    >
                      <ListAltOutlinedIcon />
                    </IconButton>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </Fade>
      </InertiaLink>
    </Grid>
  );
};

export default ThumbnailItem;
