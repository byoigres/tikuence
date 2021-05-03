import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  logo: ({ size, disableGutters }) => ({
    fontFamily: 'Passion One',
    fontSize: theme.spacing(size === 'small' ? 4 : 6),
    textAlign: 'center',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(0),
    margin: theme.spacing(disableGutters ? 0 : 1),
  }),
  link: {
    color: theme.palette.common.white,
  },
}));

const Logo = ({ size = 'default', disableGutters = false, style = {} }) => {
  const classes = useStyles({ size, disableGutters });

  return (
    <Typography className={classes.logo} style={style}>
      <InertiaLink href="/" className={classes.link}>
        TiKUENCE
      </InertiaLink>
    </Typography>
  );
};

export default Logo;
