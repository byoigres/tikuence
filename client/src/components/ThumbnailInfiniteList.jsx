import React from 'react';
import { Waypoint } from 'react-waypoint';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ThumbnailGridList, { ThumbnailGridListItem } from './ThumbnailGridList';
import EndOfList from './EndOfList';
import IndeterminateProgress from './IndeterminateProgress';

function useWidth() {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys].reverse();
  return (
    keys.reduce((output, key) => {
      const matches = useMediaQuery(theme.breakpoints.up(key));
      return !output && matches ? key : output;
    }, null) || 'xs'
  );
}

const useSkelletonStyles = makeStyles({
  container: {
    width: '100%',
    paddingTop: '178%',
    position: 'relative',
  },
  element: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export const ThumbnailSkeleton = ({ singleRow = false }) => {
  const sizes = {
    xl: {
      cols: 4,
      rows: 2,
    },
    lg: {
      cols: 4,
      rows: 2,
    },
    md: {
      cols: 4,
      rows: 3,
    },
    sm: {
      cols: 3,
      rows: 3,
    },
    xs: {
      cols: 3,
      rows: 4,
    },
  };
  const skelletonStyles = useSkelletonStyles();
  const width = useWidth();
  const { cols, rows } = sizes[width];
  const size = 12 / cols;
  const total = singleRow ? cols : rows * cols;

  return (
    <Grid container spacing={1}>
      {[...Array(total).keys()].map((key) => (
        <Grid key={key} item xs={size}>
          <div className={skelletonStyles.container}>
            <Skeleton
              variant="rect"
              animation="wave"
              className={skelletonStyles.element}
              data-name="skeleton"
            />
          </div>
        </Grid>
      ))}
    </Grid>
  );
};

const ThumbnailInfiniteList = ({
  lists,
  isTheEnd,
  modal,
  onEnter,
  referer,
  isLoading = false,
  endOfListText = 'End of list',
  noItemsText = 'No items',
}) => {
  if (isLoading) {
    return <ThumbnailSkeleton />;
  }

  return (
    <>
      {!isLoading && lists.length > 0 && (
        <ThumbnailGridList referer={referer}>
          {lists.length !== 0 &&
            lists.map((list) => (
              <ThumbnailGridListItem
                key={`thumbnail-item-${list.id}`}
                id={list.id}
                thumbnails={list.thumbnails}
                title={list.title}
                videos={list.total_videos}
                username={list.username}
              />
            ))}
        </ThumbnailGridList>
      )}
      {!isLoading && !modal && lists.length === 0 && <EndOfList text={noItemsText} />}
      {!isLoading && isTheEnd && <EndOfList text={endOfListText} />}
      {!isTheEnd && !modal && lists.length > 0 && <IndeterminateProgress />}
      {!isTheEnd && <Waypoint onEnter={onEnter} bottomOffset={-100} />}
    </>
  );
};

export default ThumbnailInfiniteList;
