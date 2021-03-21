import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';

const FavoriteButton = ({ isFavorited = false, onClick }) => (
  <Tooltip title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}>
    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => onClick(isFavorited)}>
      {isFavorited ? <StarIcon /> : <StarBorderIcon />}
    </IconButton>
  </Tooltip>
);

export default FavoriteButton;
