import React, { useState, useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { Waypoint } from 'react-waypoint';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import EndOfList from '../../components/EndOfList';
import TikTokIcon from '../../components/TikTokIcon';
import ThumbnailGridList, { ThumbnailGridListItem } from '../../components/ThumbnailGridList';

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
    // -- width: '100%',
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
  const classes = useStyles({ isMobile, isMe });
  const [lists, setLists] = useState(initialLists);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState(
    new URLSearchParams(window.location.search).get('tab') || 'lists'
  );
  const [isTheEnd, setIsTheEnd] = useState(false);

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
              // outline: '1px solid green',
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
              // style={{ outline: '1px solid blue', textAlign: 'center' }}
            >
              <Avatar src={user.picture} className={classes.avatar}>
                {user.username[0].toUpperCase()}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm={12} md={9} lg={9} xl={9}>
              <Typography variant="h3" component="h1" color="textPrimary" className={classes.name}>
                {user.name}
              </Typography>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
                className={classes.typography}
              >
                @{user.username}
                {isMe && (
                  <Button
                    variant="contained"
                    color="primary"
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
                )}
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
                /// setCategoryIndex(id);
                setCurrentTab(tab);
                Inertia.visit(`/users/${user.username}?tab=${tab}`, {
                  only: ['auth', 'flash', 'errors', 'lists', 'category'],
                  headers: {
                    'X-Profile-Category': id === 0 ? 'lists' : 'favorited',
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
        <ThumbnailGridList referer="profile">
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
        {/* <Grid item xs={12}>
          <Grid container wrap="wrap" spacing={2}>
            {lists.length !== 0 &&
              lists.map((list) => (
                <Grid key={`list-card-item-${list.id}`} item xs={12} sm={3}>
                  <Card className={classes.card}>
                    <CardActionArea
                      className={classes.actionArea}
                      href={`/list/${list.id}${list.total_videos > 0 ? '/' : '/details'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (list.total_videos > 0) {
                          Inertia.visit(`/list/${list.id}`, {
                            preserveScroll: true,
                            preserveState: true,
                            only: ['auth', 'flash', 'errors', 'modal', 'list', 'videos', 'referer'],
                            headers: {
                              'X-Page-Referer': 'profile',
                            },
                          });
                        } else {
                          Inertia.visit(`/list/${list.id}/details`);
                        }
                      }}
                    >
                      <CardMedia
                        className={classes.cover}
                        component="img"
                        alt={list.title}
                        height="150"
                        image={
                          list.total_videos > 0
                            ? list.thumbnail
                            : 'data:image/png;base64,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'
                        }
                        title={list.title}
                      />
                      <CardContent className={classes.cardContent}>
                        <Typography variant="body2" gutterBottom>
                          {list.title}
                        </Typography>
                        <Typography variant="subtitle2">{list.total_videos} videos</Typography>
                      </CardContent>
                    </CardActionArea>
                    {isMe && false && (
                      <CardActions className={classes.cardActions}>
                        <Tooltip title="Edit">
                          <IconButton
                            aria-label="edit"
                            onClick={(e) => {
                              e.preventDefault();
                              Inertia.visit(`/list/${list.id}/details`);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    )}
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Grid> */}
        {lists.length === 0 && (
          <>
            {currentTab === 'lists' && (
              <EndOfList text={`@${user.username} hasn't created any lists yet`} />
            )}
            {currentTab === 'favorited' && (
              <EndOfList text={`@${user.username} hasn't liked any lists yet`} />
            )}
          </>
        )}
        {isTheEnd && currentPage > 2 && (
          <>
            {currentTab === 'lists' && (
              <EndOfList text={`You reached the end of @${user.username}'s lists`} />
            )}
            {currentTab === 'favorited' && (
              <EndOfList text={`You reached the end of @${user.username}'s favorite lists`} />
            )}
          </>
        )}
        {!isTheEnd && lists.length > 0 && (
          <>
            <div className={classes.loader}>
              <CircularProgress />
            </div>
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
      <InertiaModals modal={modal} />
    </>
  );
};

ProfilePage.layout = (page) => <Layout children={page} />;

export default ProfilePage;
