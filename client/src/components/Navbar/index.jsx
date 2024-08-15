import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NavBar = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    return (
        <AppBar position="fixed">
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                >
                    <MenuIcon />
                </IconButton>
                <Tooltip title={'Login'}>
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        aria-haspopup="true"
                    >
                        <AccountCircleIcon />
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                >
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;
