import React, { useState } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import ListIcon from '@material-ui/icons/List';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useGridListTileStyles = makeStyles({
  tile: {
    backgroundColor: '#000',
  },
});
/*

xs: 0
sm: 600
md: 960
lg: 1280
xl: 1920

*/
const useTitleBarStyles = makeStyles((theme) => ({
  root: ({ displayInfo }) => ({
    // display: 'flex',
    // flexDirection: 'column',
    // height: displayInfo ? '100%' : 'auto',
    // -- backgroundColor: 'red',
    [theme.breakpoints.down('xs')]: {
      display: 'flex',
      flexDirection: 'column',
      height: displayInfo ? '100%' : 'auto',
      backgroundColor: 'red',
 qqqqq   },
  }),
  rootSubtitle: () => ({
    [theme.breakpoints.down('xs')]: {
      // height: '100%', // displayInfo ? '100%' : 30,
    },
    [theme.breakpoints.up('md')]: {
      height: 120,
    },
  }),
  titleWrap: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  title: {
    [theme.breakpoints.down('xs')]: {
      whiteSpace: 'normal',
      fontSize: theme.spacing(1.5),
      lineHeight: 1.5,
      // height: '100%',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      color: 'red',
      whiteSpace: 'normal',
      fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
      whiteSpace: 'normal',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': 3,
    },
  },
  subtitle: {
    [theme.breakpoints.down('xs')]: {
      // whiteSpace: 'normal',
      // fontSize: theme.spacing(1.5),
      lineHeight: 2,
      // height: '100%',
    },
  },
  actionIcon: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(1),
    },
  },
}));

const useIconButtonStyles = makeStyles({
  root: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

const ThumbnailGridList = ({ children, isMobile = false }) => {
  const theme = useTheme();
  const isMediumAndUpMatch = useMediaQuery(`(min-width:${theme.breakpoints.values.md}px)`);

  return (
    <>
      <GridList cellHeight="auto" cols={3}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) {
            return null;
          }

          return React.cloneElement(child, {
            isMobile,
            isMediumAndUpMatch,
          });
        })}
      </GridList>
    </>
  );
};

export const ThumbnailGridListItem = ({
  id,
  title,
  thumbnail,
  videos,
  username,
  isMobile,
  isMediumAndUpMatch,
  style,
}) => {
  const [displayInfo, setDisplayInfo] = useState(false);
  const gridListTileStylesClasses = useGridListTileStyles({ isMobile });
  const titleBarClasses = useTitleBarStyles({ isMobile, displayInfo });
  const iconButtonStyles = useIconButtonStyles();

  const onButtonInfoClick = (e) => {
    e.preventDefault();
    setDisplayInfo(!displayInfo);
  };

  return (
    <GridListTile
      cols={1}
      classes={{ ...gridListTileStylesClasses }}
      style={style}
      data-name="GridListTile"
    >
      <InertiaLink
        href={`/list/${id}`}
        preserveScroll
        preserveState
        headers={{ 'X-Page-Referer': 'feed' }}
        only={['auth', 'flash', 'errors', 'modal', 'list', 'videos', 'referer']}
      >
        <img src={thumbnail} alt={title} style={{ width: '100%' }} />
      </InertiaLink>
      <GridListTileBar
        title={displayInfo ? title : null}
        subtitle={
          displayInfo ? (
            <>
              <div>@{username}</div>
              <div>{videos} videos</div>
            </>
          ) : null
        }
        actionIcon={
          <>
            {!isMediumAndUpMatch && (
              <IconButton
                aria-label={`info about ${title}`}
                classes={{ ...iconButtonStyles }}
                size={isMediumAndUpMatch ? 'medium' : 'small'}
                onClick={onButtonInfoClick}
              >
                <InfoIcon />
              </IconButton>
            )}
            <IconButton
              aria-label={`info about ${title}`}
              classes={{ ...iconButtonStyles }}
              size={isMediumAndUpMatch ? 'medium' : 'small'}
              onClick={onButtonInfoClick}
            >
              <ListIcon />
            </IconButton>
          </>
        }
        classes={{ ...titleBarClasses }}
      />
    </GridListTile>
  );
};

export default ThumbnailGridList;
