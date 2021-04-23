import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import BarChartIcon from '@material-ui/icons/BarChart';
import FaceIcon from '@material-ui/icons/Face';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
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
  const generalClasses = useGeneralClasses();
  const navClasses = useNavClasses();
  const drawerClasses = useDrawerClasses();

  // console.log({ match, isDrawerOpen });
  // console.log({ credentials });

  const handleDrawerToggle = () => {
    setisDrawerOpen(!isDrawerOpen);
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
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button key="search" component={InertiaLink} href="/search">
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Search" />
          </ListItem>
          <ListItem button component={InertiaLink} href="/creators">
            <ListItemIcon>
              <FaceIcon />
            </ListItemIcon>
            <ListItemText primary="Creators" />
          </ListItem>
          <ListItem button component={InertiaLink} href="/trending">
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Trending" />
          </ListItem>
        </List>
        <Divider />
        <List component="div" style={{ display: 'initial-flex' }}>
          <ListItem button component={InertiaLink} href="/legal/terms">
            <ListItemText primary="Terms of service" />
          </ListItem>
          <ListItem button component={InertiaLink} href="/legal/privacy">
            <ListItemText primary="Privacy policy" />
          </ListItem>
          <ListItem button component={InertiaLink} href="/legal/cookies">
            <ListItemText primary="Cookies policy" />
          </ListItem>
          <Divider />
        </List>
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
      </Drawer>
    </nav>
  );
};

export default DrawerMenu;
