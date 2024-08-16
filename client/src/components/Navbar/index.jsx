import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import { Link as InertiaLink } from "@inertiajs/react";

const MyAppBar = styled(AppBar)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "none",
    zIndex: 1201,
  },
}));

const NavBar = ({ isAuthenticated, profile }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <MyAppBar position="fixed">
      <Toolbar>
        <IconButton color="inherit" aria-label="open drawer" edge="start">
          <MenuIcon />
        </IconButton>
        <Tooltip title={isAuthenticated ? profile.displayName : "Login"}>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            aria-haspopup="true"
            onClick={handleUserMenuClick}
          >
            <AccountCircleIcon />
          </IconButton>
        </Tooltip>
        <Menu
          // anchorEl={anchorEl}
          keepMounted
          open
        >
          <MenuItem
            key="menu-item-auth-login"
            component={InertiaLink}
            href="/auth/login"
          >
            Sing in
          </MenuItem>
          <MenuItem
            key="menu-item-auth-register"
            component={InertiaLink}
            href="/auth/register"
          >
            <Typography color="secondary">Create account</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </MyAppBar>
  );
};

export default NavBar;
