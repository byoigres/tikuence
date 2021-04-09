import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    bottom: theme.spacing(2),
    textAlign: 'right',
    [theme.breakpoints.up('sm')]: {
      width: theme.breakpoints.values.md,
    },
    [theme.breakpoints.between('xs', 'sm')]: {
      width: '100%',
    },
  },
  fab: ({ isMdPlus200Match }) => ({
    right: isMdPlus200Match ? 0 : theme.spacing(2),
    position: 'absolute',
    bottom: 0,
  }),
}));

const FabFloatingLink = ({ onClick }) => {
  const theme = useTheme();;
  const isMdPlus200Match = useMediaQuery(`(min-width:${theme.breakpoints.values.md + 200}px)`);
  const classes = useStyles({ isMdPlus200Match });

  return (
    <div className={classes.container}>
      <Fab color="primary" aria-label="add" className={classes.fab} onClick={onClick}>
        <AddIcon />
      </Fab>
    </div>
  );
};

export default FabFloatingLink;
