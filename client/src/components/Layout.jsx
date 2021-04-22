import React, { useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme, makeStyles, ThemeProvider, useTheme } from '@material-ui/core/styles';
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
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import blue from '@material-ui/core/colors/blue';
import red from '@material-ui/core/colors/red';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import HomeIcon from '@material-ui/icons/Home';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import MailIcon from '@material-ui/icons/Mail';
import UserAvatar from './UserAvatar';

/*
  xs: 320   Mobile devices
  sm: 480   iPads, Tablets
  md: 768   Small screens, laptops
  lg: 1024  Desktops, large screens
  xl: 1280  Extra large screens, TV
*/

const mainTheme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
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
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(3),
      // backgroundColor: 'red',
    },
    // backgroundColor: 'blue',
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

const Layout = ({ window, children, title = 'TiKUENCE' }) => {
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
  const theme = useTheme();
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

  const drawer = (
    <div
      style={{
        // marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* <div className={classes.toolbar} /> */}
      <Typography
        style={{
          fontFamily: 'Passion One',
          fontSize: 48, // theme.spacing(8)
          textAlign: 'center',
          color: 'white', // theme.palette.common.white
          backgroundColor: '#2196f3', // theme.palette.primary.main
          padding: 0,
          margin: 8, // theme.spacing(1)
        }}
      >
        TiKUENCE
      </Typography>
      <Divider />
      <List component="div">
        <ListItem button>
          <ListItemIcon>
            <HomeIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </List>
      <Divider />
      <List component="div" style={{ flexGrow: 1 }}>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
        <Divider />
      </List>
      <List component="div">
        <ListItem button>
          <ListItemText primary="Terms of service" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Privacy policy" />
        </ListItem>
        <ListItem button>
          <ListItemText primary="Cookies policy" />
        </ListItem>
      </List>
    </div>
  );

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

  const container = window !== undefined ? () => window().document.body : undefined;

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
          <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden lgUp implementation="css">
              <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden lgDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
          <Container maxWidth="lg" disableGutters component="main" className={classes.content}>
            {/* <div className={classes.toolbar} /> */}
            {/* <Typography paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt
            </Typography> */}
            {children}
          </Container>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default Layout;
