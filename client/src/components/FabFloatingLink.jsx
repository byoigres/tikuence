import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    bottom: theme.spacing(1),
    textAlign: 'right',
    [theme.breakpoints.up('sm')]: {
      width: theme.breakpoints.values.md,
    },
    [theme.breakpoints.between('xs', 'sm')]: {
      width: '100%',
    }
  },
  fab: {
    position: 'absolute',
    [theme.breakpoints.up('sm')]: {
      right: 0,
    },
    [theme.breakpoints.between('xs', 'sm')]: {
      right: theme.spacing(1),
    },
    bottom: '0',
  },  
}));

const FabFloatingLink = ({ onClick }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={onClick}
      >
        <AddIcon />
      </Fab>
    </div>
  );
};

export default FabFloatingLink;
