import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BarChartIcon from '@material-ui/icons/BarChart';
import ExploreIcon from '@material-ui/icons/Explore';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import MoreHorizOutlinedIcon from '@material-ui/icons/MoreHorizOutlined';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { InertiaLink } from '@inertiajs/inertia-react';
import UserCard from './UserCard';

const drawerWidth = 240;

const useGeneralClasses = makeStyles((theme) => ({
  singInButton: {
    marginBottom: theme.spacing(1),
  },
}));

const useNavClasses = makeStyles((theme) => ({
  [theme.breakpoints.up('md')]: {
    nav: { width: drawerWidth, flexShrink: 0 },
  },
}));

const useDrawerClasses = makeStyles({
  paper: {
    width: drawerWidth,
  },
});

const DrawerMenu = ({ isAuthenticated, credentials }) => {
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.up('md'));
  const [isDrawerOpen, setisDrawerOpen] = useState(true);
  const [isMoreItemOpen, setIsMoreItemOpen] = React.useState(false);
  const generalClasses = useGeneralClasses();
  const navClasses = useNavClasses();
  const drawerClasses = useDrawerClasses();

  const handleDrawerToggle = () => {
    setisDrawerOpen(!isDrawerOpen);
  };

  const onLegalItemClick = () => {
    setIsMoreItemOpen(!isMoreItemOpen);
  };

  useEffect(() => {
    setisDrawerOpen(match);
  }, [match]);

  return (
    <nav className={navClasses.nav} aria-label="mailbox folders">
      <Drawer
        // container={container}
        variant={isDrawerOpen ? 'permanent' : 'temporary'}
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={isDrawerOpen}
        onClose={handleDrawerToggle}
        classes={drawerClasses}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
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
        <List component="div" style={{ display: 'initial-flex', flexGrow: 1 }}>
          <ListItem button component={InertiaLink} href="/" selected>
            <ListItemIcon>
              <HomeIcon style={{ color: theme.palette.primary.main }} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button key="search" component={InertiaLink} href="/search">
            <ListItemIcon>
              <SearchIcon style={{ color: theme.palette.secondary.main }} />
            </ListItemIcon>
            <ListItemText primary="Search" />
          </ListItem>
          <ListItem button component={InertiaLink} href="/explore">
            <ListItemIcon>
              <ExploreIcon style={{ color: theme.palette.error.light }} />
            </ListItemIcon>
            <ListItemText primary="Explore" />
          </ListItem>
          <ListItem button component={InertiaLink} href="/trending">
            <ListItemIcon>
              <BarChartIcon style={{ color: theme.palette.info.main }} />
            </ListItemIcon>
            <ListItemText primary="Trending" />
          </ListItem>
        </List>
        <Divider />
        {!isAuthenticated && (
          <div
            style={{
              padding: theme.spacing(2),
            }}
          >
            <Button
              color="secondary"
              variant="outlined"
              fullWidth
              href="/auth/login"
              onClick={(e) => {
                e.preventDefault();
                Inertia.visit('/auth/login');
              }}
              className={generalClasses.singInButton}
            >
              Sign in
            </Button>
            <Button
              color="secondary"
              variant="contained"
              fullWidth
              href="/auth/register"
              onClick={(e) => {
                e.preventDefault();
                Inertia.visit('/auth/register');
              }}
            >
              Create account
            </Button>
          </div>
        )}
        {isAuthenticated && (
          <UserCard
            name={credentials.name}
            username={credentials.username}
            picture={credentials.picture}
          />
        )}
        <ListItem button onClick={onLegalItemClick}>
          <ListItemIcon>
            <MoreHorizOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="More..." />
          {isMoreItemOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={isMoreItemOpen} timeout="auto" unmountOnExit>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-evenly',
              flexWrap: 'wrap',
            }}
          >
            <InertiaLink href="/about">About</InertiaLink>
            <InertiaLink href="/contact">Contact</InertiaLink>
            <InertiaLink href="/terms">Terms</InertiaLink>
            <InertiaLink href="/privacy">Privacy</InertiaLink>
            <InertiaLink href="/cookies">Cookies policy</InertiaLink>
          </div>
        </Collapse>
      </Drawer>
    </nav>
  );
};

export default DrawerMenu;
