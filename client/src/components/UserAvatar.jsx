import React from 'react';
import Avatar from '@material-ui/core/Avatar';

const UserAvatar = ({ letter }) => <Avatar>{letter.toUpperCase()}</Avatar>;

export default UserAvatar;
