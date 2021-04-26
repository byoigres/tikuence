import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';

const FavoriteButton = ({ isFavorited = false, text, disabled, onClick }) => (
  <>
    {text ? (
      <Button
        disabled={disabled}
        color="primary"
        startIcon={isFavorited ? <StarIcon /> : <StarBorderIcon />}
        onClick={() => onClick(isFavorited)}
      >
        {isFavorited ? 'Favorited' : 'Favorite'}
      </Button>
    ) : (
      <Tooltip title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}>
        <IconButton
          disabled={disabled}
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => onClick(isFavorited)}
        >
          {isFavorited ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>
      </Tooltip>
    )}
  </>
);

export default FavoriteButton;
