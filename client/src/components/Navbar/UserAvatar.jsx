import React from 'react';
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";

const StyledAvatar = styled(Avatar)(({ theme, size }) => ({
  width: theme.spacing(size === 'default' ? 5 : 3),
  height: theme.spacing(size === 'default' ? 5 : 3),
}));


const UserAvatar = ({ name, size = 'default' }) => {
  return(
    <StyledAvatar
      alt={name}
      size={size}
    >
      {name[0].toUpperCase()}
    </StyledAvatar>
  );
};

export default UserAvatar;
