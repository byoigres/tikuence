import React, { Fragment, useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { Waypoint } from 'react-waypoint';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
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
import PillsNavigation, { PillAction } from '../components/PillsNavigation';
import ThumbnailGridList, { ThumbnailGridListItem } from '../components/ThumbnailGridList';

const useStyles = makeStyles((theme) => ({
  gridListTile: {
    // position: 'relative',
    // float: 'left',
    // width: '100%',
    // minHeight: '400px',
    // minWidth: '664px',
    // overflow: 'hidden',
    height: '100% !important',
  },
  root: {
    paddingTop: theme.spacing(1),
    [theme.breakpoints.up('md')]: {},
  },
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
  sidebar: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    display: 'flex',
    flexGrow: 1,
    // outline: '1px solid pink',
    [theme.breakpoints.up('md')]: {
      maxWidth: (theme.breakpoints.values.md / 12) * 4 - 50,
    },
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
      <Paper className={classes.root}>
        <PillsNavigation
          value={category}
          onChange={(_, selectedCategory) => {
            if (selectedCategory !== category) {
              Inertia.visit('/', {
                headers: {
                  'X-Feed-Category': selectedCategory,
                },
              });
            }
          }}
        >
          <PillAction value="recent" label="Recent" icon={<RestoreIcon />} />
          <PillAction value="new" label="New" icon={<WbSunnyIcon />} />
        </PillsNavigation>
        <ThumbnailGridList>
          {lists.length !== 0 &&
            lists.map((list) => (
              <ThumbnailGridListItem
                key={`thumbnail-item-${list.id}`}
                id={list.id}
                thumbnail={list.thumbnail}
                title={list.title}
                videos={list.total_videos}
                username={list.username}
              />
            ))}
        </ThumbnailGridList>
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
      </Paper>
      {modal && modal.modalName === 'list' && <List pageReferer="feed" />}
      {modal && modal.modalName === 'add-list' && <AddNewList pageReferer="feed" />}
      {modal && modal.modalName === 'profile' && <Profile user={user} />}
      {modal && modal.modalName === 'login' && <Login />}
    </>
  );
};

PageFeed.layout = (page) => <Layout children={page} />;

export default PageFeed;
