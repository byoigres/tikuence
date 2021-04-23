import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
}));

const UserAvatar = ({ image = null, letter }) => {
  const classes = useStyles();
  return (
    <Avatar src={image} className={classes.avatar}>
      {letter.toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar;
