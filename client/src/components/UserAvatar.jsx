import React from 'react';
import Avatar from '@material-ui/core/Avatar';

const UserAvatar = ({ image = null, letter }) => (
  <Avatar src={image}>{letter.toUpperCase()}</Avatar>
);

export default UserAvatar;
