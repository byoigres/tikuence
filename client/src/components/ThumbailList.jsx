import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { InertiaLink } from '@inertiajs/inertia-react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import ListIcon from '@material-ui/icons/List';

const useStyles = makeStyles(() => ({}));

const useThumbnailItemStyles = makeStyles((theme) => ({
  item: {
    position: 'relative',
    padding: 1,
  },
  details: ({ isMobile, displayInfo }) => ({
    position: 'absolute',
    zIndex: 999,
    backgroundColor: 'rgb(0 0 0 / 54%)',
    top: displayInfo ? 1 : 'initial',
    bottom: 1,
    right: 1,
    left: 1,
    color: 'white',
    padding: isMobile ? 0 : 10,
    [theme.breakpoints.up('sm')]: {
      minHeight: 78,
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  }),
  info: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflowX: 'scroll',
  },
  title: () => ({
    [theme.breakpoints.down('xs')]: ({ displayInfo }) => ({
      display: displayInfo ? 'block' : 'none',
      fontWeight: 'bold',
    }),
    [theme.breakpoints.up('sm')]: {
      display: '-webkit-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': 2,
      maxHeight: 40,
      whiteSpace: 'normal',
      lineHeight: 1.3,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.9rem',
    },
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),
  }),
  videos: ({ displayInfo }) => ({
    display: displayInfo ? 'block' : 'none',
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),
  }),
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  iconButton: { display: 'flex', color: 'white' },
}));

const ThumbnailList = ({ children, isMobile = false }) => {
  const classes = useStyles({ isMobile });
  return (
    <Grid container wrap="wrap" spacing={0} className={classes.container}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        return React.cloneElement(child, {
          isMobile,
        });
      })}
    </Grid>
  );
};

export const ThumbnailItem = ({ id, title, thumbnail, videos }) => {
  const [displayInfo, setDisplayInfo] = useState(false);
  const classes = useThumbnailItemStyles({ displayInfo });
  function onThumbnailItemInfoClick() {
    setDisplayInfo(!displayInfo);
  }

  return (
    <Grid item xs={4} sm={3} className={classes.item} data-name="Grid-Item">
      <InertiaLink
        href={`/list/${id}`}
        preserveScroll
        preserveState
        headers={{ 'X-Page-Referer': 'feed' }}
        only={['auth', 'flash', 'errors', 'modal', 'list', 'videos', 'referer']}
      >
        <img src={thumbnail} alt={title} className={classes.thumbnail} />
      </InertiaLink>
      {false && (
        <Grid container justify="space-evenly" className={classes.details}>
          {title}
        </Grid>
      )}
      {true && (
        <div className={classes.details} data-name="details">
          <div className={classes.info}>
            <p className={classes.title}>{title}</p>
            <p className={classes.videos}>{`${videos} video${videos > 0 ? 's' : ''}`}</p>
          </div>
          <Grid container justify="space-evenly" className={classes.action}>
            <Tooltip title="List info">
              <IconButton
                color="primary"
                aria-label="list info"
                size="small"
                className={classes.iconButton}
                onClick={onThumbnailItemInfoClick}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View details">
              <InertiaLink href={`/list/${id}/details`}>
                <IconButton aria-label="view details" size="small" className={classes.iconButton}>
                  <ListIcon />
                </IconButton>
              </InertiaLink>
            </Tooltip>
          </Grid>
        </div>
      )}
    </Grid>
  );
};

export default ThumbnailList;
