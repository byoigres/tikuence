import React, { useState } from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import ListIcon from '@material-ui/icons/List';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Inertia } from '@inertiajs/inertia';

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


xs: 320   Mobile devices
sm: 480   iPads, Tablets
md: 768   Small screens, laptops
lg: 1024  Desktops, large screens
xl: 1200  Extra large screens, TV

*/
const useTitleBarStyles = makeStyles((theme) => ({
  [theme.breakpoints.down('xs')]: {
    root: ({ displayInfo }) => ({
      height: displayInfo ? '100%' : 'auto',
      display: 'flex',
      flexDirection: 'column',
    }),
    titleWrap: ({ displayInfo }) => ({
      display: displayInfo ? 'initial' : 'none',
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(0),
      overflowY: 'scroll',
      '&::-webkit-scrollbar': {
        width: theme.spacing(0.5),
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: theme.palette.grey[500],
        borderRadius: theme.spacing(1),
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: theme.palette.grey[700],
      },
    }),
    title: {
      whiteSpace: 'normal',
      lineHeight: theme.spacing(0.1625), // 1.3
    },
    actionIcon: {
      marginBottom: theme.spacing(0.5),
    },
  },
  [theme.breakpoints.up('sm')]: {
    rootSubtitle: {
      height: 120,
    },
    title: {
      lineHeight: 1.3,
      whiteSpace: 'normal',
      display: '-webkit-box',
      '-webkit-box-orient': 'vertical',
      '-webkit-line-clamp': 3,
    },
  },
  titleWrap: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    height: '100%',
  },
  title: {
    '& a': {
      color: theme.palette.common.white,
    },
  },
  subtitle: {
    color: theme.palette.common.white,
    lineHeight: theme.spacing(0.2), // 1.6
    '& a': {
      color: theme.palette.common.white,
    },
  },
}));

const useIconButtonStyles = makeStyles((theme) => ({
  [theme.breakpoints.up('sm')]: {
    root: ({ isInfoButton }) => ({
      display: isInfoButton ? 'none' : 'inline-flex',
    }),
  },
  root: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
}));

const ThumbnailGridList = ({ children, isMobile = false }) => {
  const theme = useTheme();
  const isMediumAndUpMatch = useMediaQuery(`(min-width:${theme.breakpoints.values.md}px)`);

  return (
    <>
      <GridList cellHeight="auto" cols={isMediumAndUpMatch ? 4 : 3}>
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
  const infoIconButtonStyles = useIconButtonStyles({ isInfoButton: true });
  const listIconButtonStyles = useIconButtonStyles({ isInfoButton: false });

  const onButtonInfoClick = (e) => {
    e.preventDefault();
    setDisplayInfo(!displayInfo);
  };

  const onListClick = (e) => {
    e.preventDefault();
    Inertia.visit(`/list/${id}`, {
      preserveScroll: true,
      preserveState: true,
      headers: { 'X-Page-Referer': 'feed' },
      only: ['auth', 'flash', 'errors', 'modal', 'list', 'videos', 'referer'],
    });
  };

  return (
    <GridListTile
      cols={1}
      classes={{ ...gridListTileStylesClasses }}
      style={style}
      data-name="GridListTile"
    >
      <a href={`/list/${id}`} onClick={onListClick}>
        <img src={thumbnail} alt={title} style={{ width: '100%' }} />
      </a>
      <GridListTileBar
        title={
          <a href={`/list/${id}`} title={title} onClick={onListClick}>
            {title}
          </a>
        }
        subtitle={
          <>
            <Divider variant="fullWidth" />
            <InertiaLink href={`/users/${username}`}>@{username}</InertiaLink>
            <div>{videos} videos</div>
          </>
        }
        actionIcon={
          <>
            <Tooltip title="View list info">
              <IconButton
                aria-label={`info about ${title}`}
                classes={{ ...infoIconButtonStyles }}
                size={isMediumAndUpMatch ? 'medium' : 'small'}
                onClick={onButtonInfoClick}
              >
                <InfoIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View list details">
              <IconButton
                aria-label={`info about ${title}`}
                classes={{ ...listIconButtonStyles }}
                size={isMediumAndUpMatch ? 'medium' : 'small'}
                onClick={(e) => {
                  e.preventDefault();
                  Inertia.visit(`/list/${id}/details`);
                }}
                href={`/list/${id}/details`}
              >
                <ListIcon />
              </IconButton>
            </Tooltip>
          </>
        }
        classes={{ ...titleBarClasses }}
      />
    </GridListTile>
  );
};

export default ThumbnailGridList;
