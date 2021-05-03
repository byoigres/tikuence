import React from 'react';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    justifyContent: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
}));

const EndOfList = ({ text }) => {
  const classes = useStyles();

  return (
    <Alert elevation={0} variant="standard" severity="info" classes={{ ...classes }}>
      {text}
    </Alert>
  );
};

export default EndOfList;
