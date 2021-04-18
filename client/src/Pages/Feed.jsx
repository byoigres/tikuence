import React, { Fragment, useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { Waypoint } from 'react-waypoint';
import CircularProgress from '@material-ui/core/CircularProgress';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Grid from '@material-ui/core/Grid';
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
import ThumbailList from '../components/ThumbailList';
import ThumbnailListItem from '../components/ThumbnailListItem';

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
  list_card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  list_cardContent: {
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    paddingTop: '1rem',
    paddingBottom: 0,
  },
  list_actionArea: ({ isMe }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingBottom: isMe ? '0' : '1rem',
  }),
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
        style={{
          backgroundColor: 'white',
        }}
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
          <ThumbailList isMobile={isMobile}>
            {lists.length !== 0 &&
              lists.map((list) => (
                <ThumbnailListItem
                  key={`thumbnail-item-${list.id}`}
                  id={list.id}
                  thumbnail={list.thumbnail}
                  title={list.title}
                  videos={list.total_videos}
                  username={list.username}
                />
              ))}
          </ThumbailList>
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
        </Grid>
      </Grid>
      {isAuthenticated && (
        <FabFloatingLink
          component={InertiaLink}
          href="/list/add"
          onClick={(e) => {
            e.preventDefault();
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
