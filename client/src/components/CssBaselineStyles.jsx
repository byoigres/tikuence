import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

const useCssBaselineStyles = makeStyles((theme) => ({
  '@global': {
    html: {
      WebkitFontSmoothing: 'auto',
      fontFamily: "'Roboto', sans-serif",
      scrollBehavior: 'smooth',
    },
    a: {
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
  },
}));

const CssBaselineStyles = () => {
  const cssBaselineStyles = useCssBaselineStyles();
  return <CssBaseline classes={cssBaselineStyles} />;
}

export default CssBaselineStyles;
