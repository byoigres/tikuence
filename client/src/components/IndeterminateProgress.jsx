import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    overflow: 'auto',
  },
}));

const IndeterminateProgress = () => {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <CircularProgress variant="indeterminate" />
    </div>
  );
};

export default IndeterminateProgress;
