import React, { useState } from 'react';
// import Typography from '@material-ui/core/Typography';
import MuiAlert from '@material-ui/lab/Alert';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  container: ({ isReady }) => ({
    width: '100%',
    height: !isReady ? '100vh' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  }),
  caption: () => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'none',
  }),
  iframe: ({ isReady, isSmall }) => ({
    width: isSmall ? '100%' : 'calc((100vh - 2px) * 0.485714)',
    height: '100vh',
    border: 0,
    // border: '1px solid red',
    display: isReady ? 'block' : 'none',
  }),
  divider: ({ isReady }) => ({
    display: isReady ? 'flex' : 'none',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    height: 2,
  }),
}));

const TikTokVideo = ({ tiktokId, title, isReadyCallback = null, loaderComponent = null }) => {
  const [isReady, setIsReady] = useState(false);
  const isSmall = useMediaQuery('(max-width: calc(100vh * 0.485714))');
  const classes = useStyles({ isReady, isSmall });

  return (
    <div className={classes.container} data-name="TikTokVideoV1">
      {title && (
        <MuiAlert severity="info" className={classes.caption}>
          {title}
        </MuiAlert>
      )}
      <iframe
        title={tiktokId}
        src={`https://www.tiktok.com/embed/${tiktokId}`}
        onLoad={() => {
          setIsReady(true);

          if (isReadyCallback) {
            isReadyCallback(tiktokId);
          }
        }}
        className={classes.iframe}
      />
      <Divider variant="fullWidth" flexItem className={classes.divider} />
      {!isReady && loaderComponent}
    </div>
  );
};

export default TikTokVideo;
