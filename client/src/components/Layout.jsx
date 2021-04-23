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
import Container from '@material-ui/core/Container';
import MenuIcon from '@material-ui/icons/Menu';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import UserAvatar from './UserAvatar';
import DrawerMenu from './DrawerMenu';

/*
  xs: 320   Mobile devices
  sm: 480   iPads, Tablets
  md: 768   Small screens, laptops
  lg: 1024  Desktops, large screens
  xl: 1280  Extra large screens, TV
*/

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

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('lg')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
      // width: `calc(100% - ${drawerWidth}px)`,
      zIndex: 1201,
      // marginLeft: drawerWidth
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(9),
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

const Layout = ({ children, title = 'TiKUENCE' }) => {
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
  const notistackRef = React.createRef();

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    setAnchorEl(null);
    Inertia.visit(`/users/${credentials.username}`);
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
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap color="primary" className={classes.title}>
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
                      <UserAvatar image={credentials.picture} letter={credentials.username[0]} />
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
                    <MenuItem
                      onClick={handleProfileClick}
                      component={InertiaLink}
                      href={`/users/${credentials.username}`}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        Inertia.get('/auth/logout');
                      }}
                    >
                      <Typography color="secondary">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              )}
              {!isAuthenticated && (
                <Button
                  color="secondary"
                  variant="contained"
                  href="/auth/register"
                  onClick={(e) => {
                    e.preventDefault();
                    Inertia.visit('/auth/register');
                  }}
                >
                  Create account
                </Button>
              )}
            </Toolbar>
          </AppBar>
          {/* TODO: DRAWER HERE */}
          <DrawerMenu
            isAuthenticated={isAuthenticated}
            credentials={credentials}
            open={mobileOpen}
            onCloseCallback={() => setMobileOpen(false)}
          />
          <Container maxWidth="lg" disableGutters component="main" className={classes.content}>
            {/* <div className={classes.toolbar} /> */}
            {children}
          </Container>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default Layout;
