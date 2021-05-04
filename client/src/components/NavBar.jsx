import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import UserAvatar from './UserAvatar';
import Logo from './Logo';

const useStyles = makeStyles((theme) => ({
  appBar: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
      zIndex: 1201,
    },
  },
}));

const NavBar = ({ isAuthenticated, credentials, handleDrawerToggle }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = () => {
    setAnchorEl(null);
  };

  return (
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
  );
};

export default NavBar;
