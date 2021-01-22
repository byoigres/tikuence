import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/inertia-react';
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
  container: ({ isMobile }) => ({
    display: isMobile ? 'block' : 'flex',
    justifyContent: isMobile ? 'unset' : 'center',
  }),
  content: ({ cleanLayout }) => ({
    marginTop: '4rem',
    marginLeft: cleanLayout ? 0 : '1rem',
    marginRight: cleanLayout ? 0 : '1rem',
    // paddingBottom: '4rem',
    // maxWidth: 600,
    // marginTop: '4rem',
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

const Layout = ({ children, title = 'Tikuence', cleanLayout = false }) => {
  const {
    props: {
      auth: { isAuthenticated },
      flash,
      isMobile,
    },
  } = usePage();
  const classes = useStyles({ cleanLayout, isMobile });
  const notistackRef = React.createRef();

  useEffect(() => {
    if (flash) {
      let message = null;
      let variant = null;

      if (flash.success) {
        message = flash.success;
        variant = 'success';
      } else if (flash.info) {
        message = flash.info;
        variant = 'info';
      } else if (flash.warning) {
        message = flash.warning;
        variant = 'warning';
      } else if (flash.error) {
        message = flash.error;
        variant = 'error';
      }

      if (message) {
        notistackRef.current.enqueueSnackbar(message, {
          variant,
        });
      }
    }
  }, [flash]);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        ref={notistackRef}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        action={(key) => (
          <Button onClick={() => notistackRef.current.closeSnackbar(key)}>Dismiss</Button>
        )}
      >
        <div className={classes.container}>
          <div
            style={{
              position: 'relative',
              maxWidth: '600px',
              flex: '1 0 auto',
              height: '100vh',
              backgroundColor: '#fff',
            }}
          >
            {!cleanLayout && (
              <AppBar position="fixed">
                <Toolbar>
                  <Typography variant="h6">{title}</Typography>
                </Toolbar>
              </AppBar>
            )}
            <div className={classes.content}>{children}</div>
            {!cleanLayout && <NavBar isAuthenticated={isAuthenticated} />}
          </div>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default Layout;
