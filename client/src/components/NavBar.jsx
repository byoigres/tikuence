import React, { useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ListIcon from '@material-ui/icons/List';
import AddBoxIcon from '@material-ui/icons/AddBox';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles({
  bottomNavigation: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 99,
  },
});

const NavBar = ({ isAuthenticated }) => {
  const classes = useStyles();
  const [selectedAction, setSelectedAction] = React.useState(0);

  useEffect(() => {
    switch (window.location.pathname) {
      case '/':
        setSelectedAction(0);
        break;
      case '/list/add':
        setSelectedAction(1);
        break;
      case '/profile':
      case '/login':
        setSelectedAction(2);
        break;
      default:
    }
  });

  const items = [
    {
      id: 'lists',
      component: <BottomNavigationAction key="lists" label="Lists" icon={<ListIcon />} />,
    },
    isAuthenticated && {
      id: 'add-list',
      component: <BottomNavigationAction key="add-list" label="Add" icon={<AddBoxIcon />} />,
    },
    {
      id: 'profile',
      component: (
        <BottomNavigationAction
          key="profile"
          label={isAuthenticated ? 'Profile' : 'Login'}
          icon={<AccountCircleIcon />}
        />
      ),
    },
  ];

  return (
    <BottomNavigation
      value={selectedAction}
      onChange={(_, action) => {
        switch (items[action].id) {
          case 'lists':
            Inertia.visit('/');
            break;
          case 'add-list':
            Inertia.visit('/list/add', {
              preserveScroll: true,
              only: ['displayAddNewList'],
              // only: ['auth', 'errors', 'flash', 'isMobile', 'referer', 'displayAddNewList'],
            });
            break;
          case 'profile':
            Inertia.visit(isAuthenticated ? '/profile' : '/login');
            break;
          default:
            Inertia.get('/');
            break;
        }
        setSelectedAction(action);
      }}
      showLabels
      className={classes.bottomNavigation}
    >
      {items.map((x) => x.component)}
    </BottomNavigation>
  );
};

export default NavBar;
