import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  container: ({ isFullWidthMatch }) => ({
    position: 'fixed',
    bottom: 0,
    width: isFullWidthMatch ? theme.breakpoints.values.md : '100%',
    left: isFullWidthMatch ? 'initial' : 0,
  }),
  fab: ({ isFullWidthMatch }) => ({
    right: isFullWidthMatch ? 0 : theme.spacing(1),
    bottom: theme.spacing(1),
    position: 'absolute',
  }),
}));

const FabFloatingLink = ({ onClick }) => {
  const theme = useTheme();
  const isFullWidthMatch = useMediaQuery(`(min-width:${theme.breakpoints.values.md + 50}px)`);
  const classes = useStyles({ isFullWidthMatch });

  return (
    <div className={classes.container}>
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={onClick}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default FabFloatingLink;
