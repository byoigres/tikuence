import React from 'react';
import { Link as InertiaLink } from '@inertiajs/react';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';

const StyledTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'size' && prop !== 'disableGutters',
})(({ theme, size, disableGutters }) => ({
  fontFamily: 'Passion One',
  fontSize: theme.spacing(size === 'small' ? 4 : 6),
  textAlign: 'center',
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(0),
  margin: theme.spacing(disableGutters ? 0 : 1),
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.common.white,
}));

const Logo = ({ size = 'default', disableGutters = false, sx={} }) => {
  return (
    <StyledTypography size={size} disableGutters={disableGutters} sx={sx}>
      <StyledLink href="/" component={InertiaLink}>
        TiKUENCE
      </StyledLink>
    </StyledTypography>
  );
};

export default Logo;
