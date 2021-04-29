import React, { useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import UserAvatar from './UserAvatar';
import DrawerMenu from './DrawerMenu';
import Logo from './Logo';

const mainTheme = createMuiTheme({
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

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
      zIndex: 1201,
    },
  },
  content: {
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(7),
      paddingBottom: theme.spacing(0),
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(0),
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
    },
    padding: theme.spacing(3),
  },
}));

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

const Layout = ({ children }) => {
  const {
    props: {
      auth: { isAuthenticated, credentials },
      flash,
    },
  } = usePage();
  const classes = useStyles();
  const cssBaselineStyles = useCssBaselineStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isBackdropOpen, setIsBackdropOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const notistackRef = React.createRef();
  let backdropLoadingTimer = null;

  useEffect(() => {
    const inertiaStartEventListener = Inertia.on('start', () => {
      setIsLoading(true);
      backdropLoadingTimer = setTimeout(() => {
        setIsBackdropOpen(() => true);
      }, 2000);
    });

    const inertiaFinishEventListener = Inertia.on('finish', () => {
      setIsBackdropOpen(false);
      setIsLoading(false);

      if (backdropLoadingTimer) {
        clearTimeout(backdropLoadingTimer);
      }
    });

    return () => {
      inertiaStartEventListener();
      inertiaFinishEventListener();
    };
  }, []);

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
    <ThemeProvider theme={mainTheme}>
      <CssBaseline classes={cssBaselineStyles} />
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
        <div className={classes.root}>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar className={classes.toolBar}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Logo size="small" disableGutters style={{ flexGrow: 1 }} />
              <Tooltip title={isAuthenticated ? credentials.name : 'Login'}>
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  aria-haspopup="true"
                  onClick={handleUserMenuClick}
                >
                  {isAuthenticated ? (
                    <UserAvatar
                      size="small"
                      image={credentials.picture}
                      letter={credentials.username[0]}
                    />
                  ) : (
                    <AccountCircleIcon />
                  )}
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                className={classes.userMenu}
              >
                {isAuthenticated && [
                  <MenuItem
                    key="menu-item-user-profile"
                    onClick={handleMenuItemClick}
                    component={InertiaLink}
                    href={`/users/${credentials.username}`}
                  >
                    Profile
                  </MenuItem>,
                  <MenuItem key="menu-item-logout" component="a" href="/auth/logout">
                    <Typography color="secondary">Logout</Typography>
                  </MenuItem>,
                ]}
                {!isAuthenticated && [
                  <MenuItem
                    key="menu-item-auth-login"
                    component={InertiaLink}
                    href="/auth/login"
                    onClick={handleMenuItemClick}
                  >
                    Sing in
                  </MenuItem>,
                  <MenuItem
                    key="menu-item-auth-register"
                    component={InertiaLink}
                    href="/auth/register"
                    onClick={handleMenuItemClick}
                  >
                    <Typography color="secondary">Create account</Typography>
                  </MenuItem>,
                ]}
              </Menu>
            </Toolbar>
          </AppBar>
          <DrawerMenu
            isAuthenticated={isAuthenticated}
            credentials={credentials}
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />
          <Container maxWidth="lg" disableGutters component="main" className={classes.content}>
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) {
                return null;
              }

              return React.cloneElement(child, {
                isLoading,
              });
            })}
          </Container>
        </div>
      </SnackbarProvider>
      <Backdrop open={isBackdropOpen} style={{ zIndex: 1500 }}>
        <CircularProgress color="primary" />
      </Backdrop>
    </ThemeProvider>
  );
};

export default Layout;
