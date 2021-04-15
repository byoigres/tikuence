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
  appBar: {
    [theme.breakpoints.down('md')]: {
      alignItems: 'normal',
    },
    [theme.breakpoints.up('md')]: {
      alignItems: 'center',
    },
  },
  loginLink: {
    color: 'white',
    marginRight: '0.5rem',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  title: {
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  mainLink: {
    fontFamily: 'Changa One',
    // fontFamily: 'Faster One',
    fontSize: '2rem',
    color: 'white',
    textDecoration: 'none',
    '&:hover': {
      color: theme.palette.text.secondary,
    },
  },
  userMenu: {
    '& a': {
      color: 'initial',
      textDecoration: 'none',
    },
  },
  container: {
    [theme.breakpoints.down('md')]: {
      marginTop: '4rem',
    },
    [theme.breakpoints.up('md')]: {
      marginTop: '5rem',
    },
  },
  toolBar: {
    minHeight: 48,
  },
  content: {
    [theme.breakpoints.down('md')]: {
      marginTop: 0,
      marginLeft: 0,
      marginRight: 0,
      marginBottom: 0,
    },
    [theme.breakpoints.up('md')]: {
      marginTop: '1rem',
      marginLeft: '1rem',
      marginRight: '1rem',
      marginBottom: '1rem',
    },
  },
}));

const Layout = ({ children, title = 'TiKUENCE', cleanLayout = false }) => {
  const {
    props: {
      auth: { isAuthenticated, credentials },
      flash,
    },
  } = usePage();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
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
        <Container maxWidth="md" className={classes.container} disableGutters>
          {!cleanLayout && (
            <AppBar position="fixed" className={classes.appBar}>
              <Container maxWidth="md" disableGutters data-name="container">
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
                          <UserAvatar
                            image={credentials.picture}
                            letter={credentials.username[0]}
                          />
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
                    <>
                      {/* Hide in small screens */}
                      <Button
                        className={classes.loginLink}
                        href="/auth/login"
                        onClick={(e) => {
                          e.preventDefault();
                          Inertia.visit('/auth/login');
                        }}
                      >
                        Sing In
                      </Button>
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
