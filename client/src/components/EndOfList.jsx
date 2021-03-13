import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  typography: {
    textAlign: 'center',
    fontWeight: 'bold',
    margin: '1rem',
    fontStyle: 'italic',
  },
}));

const EndOfList = ({ text = 'You reached the end of the lists' }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Typography variant="subtitle2" className={classes.typography}>
        {text}
      </Typography>
    </Grid>
  );
};

export default EndOfList;
