import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ListIcon from '@material-ui/icons/List';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';
import InertiaModals from '../../components/InertiaModals';
import SEO from '../../components/SEO';
import TikTokIcon from '../../components/TikTokIcon';
import ThumbnailInfiniteList from '../../components/ThumbnailInfiniteList';

const usePaperStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  listItemAvatar: {
    minWidth: 72,
  },
  avatar: {
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(10),
      height: theme.spacing(10),
      fontSize: '3rem',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: theme.spacing(12),
      height: theme.spacing(12),
      fontSize: '4rem',
    },
    [theme.breakpoints.up('md')]: {
      width: theme.spacing(16),
      height: theme.spacing(16),
      fontSize: '5rem',
    },
  },
  name: {
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
      fontSize: theme.typography.h5.fontSize,
    },
    [theme.breakpoints.between('sm', 'md')]: {
      justifyContent: 'center',
      fontSize: theme.typography.h4.fontSize,
    },
    [theme.breakpoints.up('md')]: {
      justifyContent: 'flex-start',
      fontSize: theme.typography.h3.fontSize,
    },
  },
  typography: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'flex-start',
    },
    [theme.breakpoints.between('xs', 'sm')]: {
      justifyContent: 'center',
    },
  },
  buttons: {
    marginLeft: '1rem',
  },
  dialog: {
    padding: 0,
    top: 0,
    left: 0,
    height: '100%',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  cardContent: {
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
    paddingTop: '1rem',
    paddingBottom: 0,
  },
  actionArea: ({ isMe }) => ({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingBottom: isMe ? '0' : '1rem',
  }),
}));

const ProfilePage = () => {
  const {
    props: { user, lists: initialLists = [], isMe = false, isMobile, modal = false },
  } = usePage();
  const paperClasses = usePaperStyles({ isMobile });
  const classes = useStyles({ isMobile, isMe });
  const [lists, setLists] = useState(initialLists);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState(
    new URLSearchParams(window.location.search).get('tab') || 'lists'
  );
  const [isTheEnd, setIsTheEnd] = useState(false);
  const [isSwitchingTab, setIsSwitchingTab] = useState(false);

  useEffect(() => {
    if (currentPage > 1) {
      Inertia.visit(`/users/${user.username}?tab=${currentTab}`, {
        only: ['auth', 'flash', 'errors', 'lists', 'category'],
        preserveScroll: true,
        preserveState: true,
        headers: {
          'X-Profile-Page': currentPage,
          'X-Profile-Category': currentTab,
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
      <SEO title={`@${user.username} profile`} />
      <Paper classes={{ ...paperClasses }} square elevation={1}>
        <Grid
          container
          style={{
            paddingLeft: '1rem',
            paddingRight: '1rem',
            paddingBottom: '1rem',
            backgroundColor: 'white',
          }}
        >
          <Grid item xs={12} md={12}>
            <Grid
              container
              alignContent="center"
              alignItems="center"
              style={{
                paddingTop: '1rem',
                paddingBottom: '1rem',
              }}
            >
              <Grid
                container
                alignContent="center"
                direction="column"
                item
                xs={12}
                sm={12}
                md={3}
                lg={3}
                xl={3}
              >
                <Avatar src={user.picture} className={classes.avatar}>
                  {user.username[0].toUpperCase()}
                </Avatar>
              </Grid>
              <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
                <Typography
                  variant="h3"
                  component="h1"
                  color="textPrimary"
                  className={classes.name}
                >
                  {user.name}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                  className={classes.typography}
                >
                  @{user.username}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  gutterBottom
                  className={classes.typography}
                >
                  {user.email}
                </Typography>
                <Typography variant="body1" color="initial" className={classes.typography}>
                  {user.biography ? user.biography : 'No bio yet'}
                </Typography>
                {user.tiktok_username && (
                  <div className={classes.typography}>
                    <Button
                      className={classes.button}
                      startIcon={<TikTokIcon />}
                      href={user.tiktok_url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      {user.tiktok_username}
                    </Button>
                  </div>
                )}
                {isMe && (
                  <div className={classes.typography}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth={isMobile}
                      size="small"
                      href={`/users/${user.username}/edit`}
                      onClick={(e) => {
                        e.preventDefault();
                        Inertia.visit(`/users/${user.username}/edit`, {
                          only: ['auth', 'flash', 'errors', 'isMobile', 'modal', 'user', 'isMe'],
                        });
                      }}
                    >
                      Edit profile
                    </Button>
                  </div>
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Paper square>
              <Tabs
                value={currentTab === 'lists' ? 0 : 1}
                indicatorColor="primary"
                variant="fullWidth"
                textColor="primary"
                onChange={(_e, id) => {
                  const tab = id === 0 ? 'lists' : 'favorited';
                  setCurrentTab(tab);
                  Inertia.visit(`/users/${user.username}?tab=${tab}`, {
                    only: ['auth', 'flash', 'errors', 'lists', 'category'],
                    headers: {
                      'X-Profile-Category': id === 0 ? 'lists' : 'favorited',
                    },
                    onStart() {
                      setLists([]);
                      setIsSwitchingTab(true);
                    },
                  });
                }}
                aria-label="disabled tabs example"
                style={{ marginBottom: '1rem' }}
              >
                <Tab icon={<ListIcon />} label="LISTS" />
                <Tab icon={<FavoriteIcon />} label="FAVORITED" />
              </Tabs>
            </Paper>
          </Grid>
        </Grid>
        <ThumbnailInfiniteList
          referer="profile"
          isLoading={isSwitchingTab}
          lists={lists}
          isTheEnd={isTheEnd}
          endOfListText={`You reached the end of @${user.username}'s ${
            currentTab === 'lists' ? '' : 'favorite'
          } lists`}
          noItemsText={`@${user.username} hasn't ${
            currentTab === 'lists' ? 'created' : 'liked'
          } any lists yet`}
          modal={modal}
          onEnter={() => {
            if (lists.length > 0) {
              setCurrentPage(currentPage + 1);
            }
          }}
        />
      </Paper>
      <InertiaModals modal={modal} />
    </>
  );
};

ProfilePage.layout = (page) => <Layout children={page} />;

export default ProfilePage;
