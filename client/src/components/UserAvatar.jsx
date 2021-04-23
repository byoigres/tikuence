import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  avatar: ({ size }) => ({
    width: theme.spacing(size === 'default' ? 5 : 3),
    height: theme.spacing(size === 'default' ? 5 : 3),
  }),
}));

const UserAvatar = ({ size = 'default', image = null, letter }) => {
  const classes = useStyles({ size });
  return (
    <Avatar src={image} className={classes.avatar}>
      {letter.toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar;
