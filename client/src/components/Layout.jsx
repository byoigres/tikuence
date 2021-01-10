import React, { useEffect } from 'react';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import blueGrey from '@material-ui/core/colors/blueGrey';
import blue from '@material-ui/core/colors/blue';
import NavBar from './NavBar';

const useStyles = makeStyles({
  container: (p) => ({
    marginTop: '4rem',
    marginLeft: p.cleanLayout ? 0 : '1rem',
    marginRight: p.cleanLayout ? 0 : '1rem',
  }),
});

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: blueGrey,
  },
  typography: {
    // fontFamily: `"Source Sans Pro", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
  },
});

const Layout = ({ children, title = 'Tikuence', cleanLayout = false, flash }) => {
  const classes = useStyles({ cleanLayout });
  const notistackRef = React.createRef();

  useEffect(() => {
    const message = flash && (flash.success || flash.error);

    if (message) {
      notistackRef.current.enqueueSnackbar(message, {
        variant: 'success',
      });
    }
  }, [flash]);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        ref={notistackRef}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        action={(key) => (
          <Button onClick={() => notistackRef.current.closeSnackbar(key)}>Dismiss</Button>
        )}
      >
        {!cleanLayout && (
          <AppBar position="fixed">
            <Toolbar>
              <Typography variant="h6">{title}</Typography>
            </Toolbar>
          </AppBar>
        )}
        <div className={classes.container}>{children}</div>
        {!cleanLayout && <NavBar />}
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default Layout;