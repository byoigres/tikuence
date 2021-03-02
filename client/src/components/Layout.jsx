import React, { useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Container from '@material-ui/core/Container';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import UserAvatar from './UserAvatar';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: red,
  },
  typography: {
    fontFamily: `Roboto, "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600,
  },
});

const useStyles = makeStyles(() => ({
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
          // maxWidth: '600px',
          // width: '100%',
        },
  userMenu: {
    '& a': {
      color: 'initial',
      textDecoration: 'none',
    },
  },
  container: ({ isMobile }) => ({
    marginTop: isMobile ? '4rem' : '5rem',
  }),
  innerContainer: {
    position: 'relative',
    maxWidth: '600px',
    marginTop: '5rem',
    flex: '1 0 auto',
    backgroundColor: '#fff',
  },
  content: ({ cleanLayout, isMobile }) => ({
    marginTop: cleanLayout ? 0 : '1rem',
    marginLeft: cleanLayout || isMobile ? 0 : '1rem',
    marginRight: cleanLayout || isMobile ? 0 : '1rem',
    marginBottom: cleanLayout ? 0 : '1rem',
  }),
}));

const Layout = ({ children, title = 'Tikuence', cleanLayout = false }) => {
  const {
    props: {
      auth: { isAuthenticated, credentials },
      flash,
      isMobile,
    },
  } = usePage();
  const classes = useStyles({ cleanLayout, isMobile });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const notistackRef = React.createRef();

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

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
        <Container maxWidth="md" className={classes.container} disableGutters={isMobile}>
          {!cleanLayout && (
            <AppBar position="fixed" className={classes.appBar}>
              <Container maxWidth="md" disableGutters={isMobile}>
                <Toolbar className={classes.toolBar}>
                  <Typography variant="h6" className={classes.title}>
                    <InertiaLink href="/" className={classes.mainLink}>
                      {title}
                    </InertiaLink>
                  </Typography>
                  {isAuthenticated && (
                    <>
                      <Tooltip title={isAuthenticated ? credentials.name : 'Login'}>
                        <IconButton
                          edge="start"
                          className={classes.menuButton}
                          color="inherit"
                          aria-label="menu"
                          aria-haspopup="true"
                          onClick={handleUserMenuClick}
                        >
                          <UserAvatar letter={credentials.username[0]} />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleUserMenuClose}
                        className={classes.userMenu}
                      >
                        <MenuItem onClick={handleUserMenuClose}>
                          <InertiaLink href={`/users/${credentials.username}`}>Profile</InertiaLink>
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            Inertia.get('/auth/logout');
                          }}
                        >
                          Logout
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                  {!isAuthenticated && (
                    <>
                      {!isMobile && (
                        <Button
                          href="/auth/login"
                          onClick={(e) => {
                            e.preventDefault();
                            Inertia.visit('/auth/login');
                          }}
                        >
                          Sing In
                        </Button>
                      )}
                      <Button
                        color="primary"
                        variant="contained"
                        href="/auth/register"
                        onClick={(e) => {
                          e.preventDefault();
                          Inertia.visit('/auth/register');
                        }}
                      >
                        Create account
                      </Button>
                    </>
                  )}
                </Toolbar>
              </Container>
            </AppBar>
          )}
          <div className={classes.content} data-name="children">
            {children}
          </div>
        </Container>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default Layout;
