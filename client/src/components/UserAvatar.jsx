import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';


const useStyles = makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const UserAvatar = ({ image = null, letter }) => {
  const classes = useStyles();
  return (
    <Avatar className={classes.avatar} src={image}>{letter.toUpperCase()}</Avatar>
  );
};

export default UserAvatar;
