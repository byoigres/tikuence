import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { InertiaLink } from '@inertiajs/inertia-react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import UserAvatar from './UserAvatar';

const useStyles = makeStyles((theme) => ({
  link: {
    backgroundColor: theme.palette.grey[100],
    '&:hover': {
      backgroundColor: theme.palette.grey[300],
    },
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    color: theme.palette.text.primary,
    borderRadius: theme.spacing(1.2),
  },
  name: {
    fontWeight: 600,
  },
}));

const UserCard = ({ name, username, picture }) => {
  const classes = useStyles();

  return (
    <InertiaLink href={`/users/${username}`} className={classes.link}>
      <Grid container direction="row" alignItems="center" data-name="container">
        <Grid container justify="center" item data-name="avatar" xs={4}>
          <UserAvatar image={picture} letter={username[0]} />
        </Grid>
        <Grid item container direction="row" alignItems="center" data-name="user-container" xs={8}>
          <Grid item data-name="name" xs={12}>
            <Typography className={classes.name}>{name}</Typography>
          </Grid>
          <Grid item data-name="username" xs={12}>
            <Typography>&nbsp;@{username}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </InertiaLink>
  );
};

export default UserCard;
