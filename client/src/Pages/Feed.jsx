import React, { Fragment, useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { Waypoint } from 'react-waypoint';
import Typography from '@material-ui/core/Typography';
import MaterialList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import RestoreIcon from '@material-ui/icons/Restore';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import { makeStyles } from '@material-ui/core/styles';
import SEO from '../components/SEO';
import Layout from '../components/Layout';
import FabFloatingLink from '../components/FabFloatingLink';
import AddNewList from './Lists/Add';
import Profile from './Profile/Profile';
import List from './Lists/List';
import Login from './Auth/Login';
import EndOfList from '../components/EndOfList';

const useStyles = makeStyles((theme) => ({
  list: {
    backgroundColor: '#fff',
  },
  listItemAvatar: {
    minWidth: 72,
  },
  avatar: {
    width: theme.spacing(7),
    height: '100%',
  },
  loader: {
    textAlign: 'center',
  },
  endOfTheList: {
    textAlign: 'center',
    fontWeight: 'bold',
    margin: '1rem',
    fontStyle: 'italic',
  },
}));

const categories = [
  {
    id: 'recent',
    label: 'Recent',
    pageTitle: 'Recent lists',
    icon: <RestoreIcon />,
  },
  {
    id: 'new',
    label: 'New',
    pageTitle: 'New lists',
    icon: <WbSunnyIcon />,
  },
];

const PageFeed = () => {
  const {
    props: {
      auth: { isAuthenticated },
      isMobile,
      category = 'recent',
      lists: initialLists = [],
      modal = false,
      user,
    },
  } = usePage();
  const classes = useStyles({ isMobile });
  const [lists, setLists] = useState(initialLists);
  const [categoryIndex] = useState(categories.findIndex((x) => x.id === category));
  const [currentPage, setCurrentPage] = useState(1);
  const [isTheEnd, setIsTheEnd] = useState(false);

  useEffect(() => {
    if (currentPage > 1) {
      Inertia.visit('/', {
        only: ['auth', 'flash', 'errors', 'lists'],
        preserveScroll: true,
        preserveState: true,
        headers: {
          'X-Feed-Category': category,
          'X-Feed-Page': currentPage,
        },
        onSuccess: ({ props: { lists: newLists } }) => {
          if (newLists.length > 0) {
            setLists([...lists, ...newLists]);
          } else {
            setIsTheEnd(true);
          }
        },
      });
    }
  }, [currentPage]);

  return (
    <>
      <SEO title={categories[categoryIndex].pageTitle} />
      <Grid
        container
        style={{ paddingLeft: '1rem', paddingRight: '1rem', backgroundColor: 'white' }}
      >
        <Grid item xs={12} md={12}>
          <BottomNavigation
            value={categoryIndex}
            onChange={(_, selectedCategoryIndex) => {
              if (selectedCategoryIndex !== categoryIndex) {
                Inertia.visit('/', {
                  headers: {
                    'X-Feed-Category': categories[selectedCategoryIndex].id,
                  },
                });
              }
            }}
            showLabels
            className={classes.root}
          >
            {categories.map((item) => (
              <BottomNavigationAction key={item.label} label={item.label} icon={item.icon} />
            ))}
          </BottomNavigation>
          <MaterialList dense={false} className={classes.list}>
            {lists &&
              lists.map((item) => (
                <Fragment key={`list-item-${item.id}`}>
                  <ListItem
                    key={item.id}
                    component={InertiaLink}
                    button
                    href={`/list/${item.id}`}
                    preserveScroll
                    preserveState
                    headers={{ 'X-Page-Referer': 'feed' }}
                    only={['auth', 'flash', 'errors', 'modal', 'list', 'videos', 'referer']}
                  >
                    <ListItemAvatar className={classes.listItemAvatar}>
                      <Avatar
                        alt={item.title}
                        className={classes.avatar}
                        variant="square"
                        src={item.thumbnail}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      id={item.id}
                      primary={
                        <Typography component="strong" variant="h6" color="textPrimary">
                          {item.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="strong"
                            variant="subtitle2"
                            color="textPrimary"
                            style={{ display: 'block' }}
                          >
                            {`${item.total_videos} videos`}
                          </Typography>
                          <Typography component="span" variant="subtitle1" color="textPrimary">
                            {`@${item.username}`}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </Fragment>
              ))}
            {isTheEnd && <EndOfList text="You reached the end of the lists" />}
            {!isTheEnd && (
              <>
                {!modal && (
                  <div className={classes.loader}>
                    <CircularProgress />
                  </div>
                )}
                <Waypoint
                  onEnter={() => {
                    if (lists.length > 0) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                />
              </>
            )}
          </MaterialList>
        </Grid>
      </Grid>
      {isAuthenticated && (
        <FabFloatingLink
          component={InertiaLink}
          href="/list/add"
          onClick={() => {
            Inertia.visit('/list/add', {
              preserveScroll: true,
              preserveState: true,
              headers: {
                'X-Page-Referer': 'feed',
              },
              only: ['auth', 'flash', 'errors', 'referer', 'modal'],
            });
          }}
        />
      )}
      {modal && modal.modalName === 'list' && <List pageReferer="feed" />}
      {modal && modal.modalName === 'add-list' && <AddNewList pageReferer="feed" />}
      {modal && modal.modalName === 'profile' && <Profile user={user} />}
      {modal && modal.modalName === 'login' && <Login />}
    </>
  );
};

PageFeed.layout = (page) => <Layout children={page} title="Tikuence" />;

export default PageFeed;
