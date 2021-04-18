import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({}));

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

export default ThumbnailList;
