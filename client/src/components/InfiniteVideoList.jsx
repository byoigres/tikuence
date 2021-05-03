import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Waypoint } from 'react-waypoint';
import { Inertia } from '@inertiajs/inertia';
import EndOfList from './EndOfList';
import TikTokVideoV1 from './TikTokVideoV1';

const InfiniteVideoList = ({ listId, initialVideos, pageReferer, from }) => {
  const [items, setItems] = useState([]);
  const [videos, setVideos] = useState(initialVideos);
  const [loadingCount, setLoadingCount] = useState(initialVideos.length);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const classes = { section: '' };

  useEffect(() => {
    if (videos.length > 0) {
      const newVideos = videos.map((video) => (
        <TikTokVideoV1
          key={`list-item-details-${video.id}`}
          tiktokId={video.tiktok_id}
          title={video.title}
          loaderComponent={<CircularProgress />}
          isReadyCallback={() => {
            setLoadingCount((val) => val - 1);
          }}
        />
      ));
      setItems([...items, ...newVideos]);
    } else {
      setHasMore(false);
    }
  }, [videos]);

  useEffect(() => {
    if (currentPage > 1) {
      Inertia.visit(`/list/${listId}`, {
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

  return (
    <section className={classes.section}>
      <Grid
        container
        direction="column"
        alignItems="center"
        data-name="container"
        style={{ overflow: 'hidden' }}
      >
        {items}
      </Grid>
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
  );
};

export default InfiniteVideoList;
