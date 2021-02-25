import React, { useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import blueGrey from '@material-ui/core/colors/blueGrey';
import blue from '@material-ui/core/colors/blue';

const useStyles = makeStyles((theme) => ({
  appBar: ({ isMobile }) => ({
    alignItems: isMobile ? 'normal' : 'center',
  }),
  title: {
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  mainLink: {
    color: 'white',
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.text.secondary,
    },
  },
  toolBar: ({ isMobile }) =>
    isMobile
      ? {}
      : {
          maxWidth: '600px',
          width: '100%',
        },
  container: ({ isMobile }) => ({
    display: isMobile ? 'block' : 'flex',
    justifyContent: isMobile ? 'unset' : 'center',
  }),
  innerContainer: {
    position: 'relative',
    maxWidth: '600px',
    flex: '1 0 auto',
    backgroundColor: '#fff',
  },
  content: ({ cleanLayout }) => ({
    marginTop: cleanLayout ? 0 : '4rem',
  }),
  createListContainer: ({ isMobile }) => ({
    position: 'fixed',
    bottom: '25px',
    width: isMobile ? '100%' : '600px',
    textAlign: 'right',
  }),
  createList: ({ isMobile }) => ({
    position: 'absolute',
    right: isMobile ? '25px' : '-30px',
    bottom: '0',
  }),
}));

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: blueGrey,
  },
  typography: {
    fontFamily: `Roboto, "Helvetica", "Arial", sans-serif`,
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
          <div className={classes.innerContainer}>
            {!cleanLayout && (
              <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolBar}>
                  <Typography variant="h6" className={classes.title}>
                    <InertiaLink href="/" className={classes.mainLink}>
                      {title}
                    </InertiaLink>
                  </Typography>
                  <Tooltip title={isAuthenticated ? 'Profile' : 'Login'}>
                    <IconButton
                      edge="start"
                      className={classes.menuButton}
                      color="inherit"
                      aria-label="menu"
                      onClick={() => {
                        Inertia.visit(isAuthenticated ? '/profile' : '/login', {
                          preserveScroll: true,
                          preserveState: true,
                          only: ['referer', 'showModal', ...[isAuthenticated ? 'user' : null]],
                        });
                      }}
                    >
                      <AccountCircleIcon />
                    </IconButton>
                  </Tooltip>
                </Toolbar>
              </AppBar>
            )}
            <div className={classes.content}>{children}</div>
            {!cleanLayout && isAuthenticated && (
              <div className={classes.createListContainer}>
                <Fab
                  color="primary"
                  aria-label="add"
                  className={classes.createList}
                  onClick={() => {
                    Inertia.visit('/list/add', {
                      preserveScroll: true,
                      preserveState: true,
                      only: ['referer', 'showModal'],
                    });
                  }}
                >
                  <AddIcon />
                </Fab>
              </div>
            )}
          </div>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default Layout;
