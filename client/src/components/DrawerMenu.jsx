import React, { useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import UserCard from './UserCard';
import Logo from './Logo';

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

const DrawerMenu = ({ open, onClose, isAuthenticated, credentials }) => {
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.up('md'));
  const [isMoreItemOpen, setIsMoreItemOpen] = React.useState(false);
  const generalClasses = useGeneralClasses();
  const navClasses = useNavClasses();
  const drawerClasses = useDrawerClasses();
  const page = usePage();

  let pageReferer = 'feed';

  switch (page.component) {
    case 'Lists/Details':
      pageReferer = 'details';
      break;
    case 'Profile/Profile':
      pageReferer = 'profile';
      break;
    default:
      pageReferer = 'feed';
  }

  useEffect(() => {}, [open]);

  const userCard = credentials ? (
    <UserCard
      variant="contained"
      nameText={credentials.name}
      usernameText={`${credentials.username}`}
      pictureUrl={credentials.picture}
      onClick={() => {
        onClose();
      }}
    />
  ) : null;

  const onLegalItemClick = () => {
    setIsMoreItemOpen(!isMoreItemOpen);
  };

  return (
    <nav className={navClasses.nav} aria-label="mailbox folders">
      <Drawer
        variant={match ? 'permanent' : 'temporary'}
        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
        open={open}
        onClose={() => {
          setIsMoreItemOpen(false);
          onClose();
        }}
        classes={drawerClasses}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {isAuthenticated && !match && userCard}
        {match && <Logo />}

        <Divider />
        {isAuthenticated && (
          <div
            style={{
              padding: theme.spacing(2),
            }}
          >
            <Button
              startIcon={<AddIcon />}
              color="primary"
              variant="contained"
              fullWidth
              size="large"
              href="/list/add"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                Inertia.visit('/list/add', {
                  preserveScroll: true,
                  preserveState: true,
                  headers: {
                    'X-Page-Referer': pageReferer,
                  },
                  only: ['auth', 'flash', 'errors', 'referer', 'modal'],
                });
              }}
              className={generalClasses.singInButton}
            >
              Create new list
            </Button>
          </div>
        )}

        <Divider />
        <List component="div" style={{ display: 'initial-flex', flexGrow: 1 }}>
          <ListItem
            button
            component={InertiaLink}
            href="/"
            onClick={() => {
              onClose();
            }}
          >
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
                onClose();
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
                onClose();
                Inertia.visit('/auth/register');
              }}
            >
              Create new account
            </Button>
          </div>
        )}
        {isAuthenticated && match && userCard}
        {isAuthenticated && match && (
          <ListItem button component={InertiaLink} href="/auth/logout">
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
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
              marginBottom: theme.spacing(1),
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
