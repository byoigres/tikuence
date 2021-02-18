import React, { Fragment, useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Waypoint } from 'react-waypoint';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import SEO from '../../components/SEO';
import Layout from '../../components/Layout';
import AddNewList from './Add';
import Profile from '../Profile/Profile';
import Details from './Details';
import Session from '../Auth/Session';

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

const PageList = ({ lists: initialLists = [], list, showModal = false, user }) => {
  const classes = useStyles();
  const [lists, setLists] = useState(initialLists);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTheEnd, setIsTheEnd] = useState(false);

  useEffect(() => {
    if (currentPage > 1) {
      Inertia.get(
        '/',
        { page: currentPage },
        {
          only: ['lists'],
          preserveScroll: true,
          preserveState: true,
          onSuccess: ({ props: { lists: newLists } }) => {
            if (newLists.length > 0) {
              setLists([...lists, ...newLists]);
            } else {
              setIsTheEnd(true);
            }
          },
        }
      );
    }
  }, [currentPage]);

  return (
    <>
      <SEO description="List of TikTok videos" title="Tikuence" />
      <List dense={false} className={classes.list}>
        {lists &&
          lists.map((item) => (
            <Fragment key={`list-item-${item.id}`}>
              <ListItem
                key={item.id}
                button
                onClick={(e) => {
                  e.preventDefault();
                  Inertia.visit(`/list/${item.id}`, {
                    preserveScroll: true,
                    preserveState: true,
                    only: ['showModal', 'list', 'referer'],
                  });
                }}
              >
                <ListItemAvatar className={classes.listItemAvatar}>
                  <Avatar
                    alt={item.title}
                    className={classes.avatar}
                    variant="square"
                    src={`/images/sm-${item.videos[0].thumbnail_name}`}
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
                        {`${item.videos.length} videos`}
                      </Typography>
                      <Typography component="span" variant="subtitle1" color="textPrimary">
                        {`List by ${item.user.email}`}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider variant="fullWidth" component="li" />
            </Fragment>
          ))}
        {isTheEnd && (
          <Typography variant="subtitle2" className={classes.endOfTheList}>
            You reached the end of the lists
          </Typography>
        )}
        {!isTheEnd && (
          <>
            {!showModal && (
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
      </List>
      {showModal === 'details' && list && <Details list={list} />}
      {showModal === 'add-list' && <AddNewList />}
      {showModal === 'profile' && <Profile user={user} />}
      {showModal === 'login' && <Session />}
    </>
  );
};

PageList.layout = (page) => <Layout children={page} title="Tikuence" />;

export default PageList;
