import React, { useState, useEffect, Suspense, lazy as ReactLazy } from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Inertia } from '@inertiajs/inertia';
import { Container as ContainerDraggable, Draggable } from 'react-smooth-dnd';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';
import TitleForUpdate from '../../components/TitleForUpdate';
import UserCard from '../../components/UserCard';
import FavoriteButton from '../../components/FavoriteButton';
import InertiaModals from '../../components/InertiaModals';
import ItemsList from '../../components/ItemsList';

const ConfirmDialog = ReactLazy(() => import('../../components/ConfirmDialog'));

const useStyles = makeStyles((theme) => ({
  userCard: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  listItemAvatar: {
    minWidth: 72,
  },
  avatar: {
    width: theme.spacing(7),
    minHeight: '100px',
    height: '100%',
  },
  infoColumn: ({ isFullWidthMatch }) => ({
    position: isFullWidthMatch ? 'fixed' : 'initial',
    maxWidth: isFullWidthMatch ? `${(theme.breakpoints.values.md / 12) * 3}px` : 'initial',
    width: isFullWidthMatch ? `100%` : 'initial',
    backgroundColor: 'white',
    overflowY: 'auto',
    // maxHeight: calc(vieport height - (paper padding * 2) - (main padding))
    maxHeight: `calc(100vh - ${theme.spacing(2 * 2)}px - ${theme.spacing(3)}px)`,
  }),
  contentColumn: ({ isFullWidthMatch }) => ({
    marginLeft: isFullWidthMatch ? `${(theme.breakpoints.values.md / 12) * 3}px` : 'initial',
    minHeight: 300,
    width: '100%',
  }),
}));

const useMenuListItemIconStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.spacing(4),
  },
}));

const useActionStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const usePaperStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    // minHeight: calc(vieport height - (paper padding * 2) - (main padding))
    minHeight: `calc(100vh - ${theme.spacing(2 * 2)}px - ${theme.spacing(3)}px)`,
  },
}));

const Details = ({ isLoading }) => {
  const {
    props: {
      auth,
      id,
      title,
      isFavorited,
      user,
      videos,
      isMobile,
      isMe,
      modal = false,
      coverId,
      authors,
      categories,
      languages,
    },
  } = usePage();
  const theme = useTheme();
  const isFullWidthMatch = useMediaQuery(`(min-width:${theme.breakpoints.values.md}px)`);
  const paperClasses = usePaperStyles({ isMobile });
  const classes = useStyles({ isMobile, isFullWidthMatch });
  const menuListItemIconStyles = useMenuListItemIconStyles();
  const actionClasses = useActionStyles({ isMobile, isFullWidthMatch });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRemoveVideoDialogOpen, setIsRemoveVideoDialogOpen] = useState(false);
  const [currentVideoToDelete, setCurrentVideoToDelete] = useState(null);
  const [itemMenuState, setItemMenuState] = useState();

  function onRemoveVideoDialogClose() {
    setIsRemoveVideoDialogOpen(false);
  }

  function onRemoveButtonClick(identifier) {
    setIsRemoveVideoDialogOpen(true);
    setCurrentVideoToDelete(identifier);
  }

  // HTTP handlers
  function onAddVideoClick(e) {
    e.preventDefault();
    Inertia.visit(`/list/${id}/video/add`, {
      only: ['auth', 'flash', 'errors', 'listId', 'modal', 'referer'],
      preserveScroll: true,
      preserveState: true,
    });
  }

  function onRemove() {
    Inertia.delete(`/list/${id}/video/${currentVideoToDelete}`, {
      onFinish() {
        setIsRemoveVideoDialogOpen(false);
        setCurrentVideoToDelete(null);
      },
    });
  }

  function onUpdateListCover(videoId) {
    Inertia.post(
      `/list/${id}/cover`,
      {
        videoId,
      },
      {
        preserveScroll: true,
      }
    );
  }

  function onDeleteDialogClose() {
    setIsDeleteDialogOpen(false);
  }

  function onDeleteButtonClick() {
    setIsDeleteDialogOpen(true);
  }

  function onDelete() {
    Inertia.visit(`/list/${id}`, { method: 'delete' });
  }

  const onVideoDrop = ({ removedIndex, addedIndex }) => {
    if (removedIndex !== addedIndex) {
      Inertia.post(
        `/list/${id}/video/${videos[removedIndex].id}`,
        {
          oldOrderIndex: removedIndex + 1,
          newOrderIndex: addedIndex + 1,
        },
        {
          preserveScroll: true,
        }
      );
    }
  };

  /**
   * There is a bug with react-smooth-dnd that block scroll of the page after a
   * touchend event.
   *
   * This is a workaround because the development seems to be frozen
   *
   * @see https://github.com/kutlugsahin/react-smooth-dnd/issues/75
   */
  useEffect(() => {
    const cleanClasses = () => {
      document.body.className = '';
    };

    document.addEventListener('touchend', cleanClasses, false);

    return () => {
      document.removeEventListener('touchend', cleanClasses, false);
    };
  }, []);

  const handleUserMenuClose = () => {
    setItemMenuState({ ...itemMenuState, isOpen: false });
  };

  const handleUserMenuClick = (videoId) => (event) => {
    setItemMenuState({ videoId, anchor: event.currentTarget, isOpen: true });
  };

  return (
    <>
      <SEO title={title} />
      {id && (
        <Paper elevation={1} classes={{ ...paperClasses }}>
          <Grid container>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} className={classes.infoColumn}>
              <TitleForUpdate title={title} id={id} canEdit={isMe} />
              {videos && videos.length > 0 && (
                <Typography component="span" variant="caption">
                  {`There ${videos.length > 1 ? 'are' : 'is'} ${videos.length} video${
                    videos.length > 1 ? 's' : ''
                  } in this list`}
                </Typography>
              )}
              <Divider
                variant="fullWidth"
                style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
              />
              <Grid
                container
                direction={isFullWidthMatch ? 'column' : 'row'}
                alignContent="flex-start"
                alignItems="flex-start"
                justify="space-evenly"
                classes={{ ...actionClasses }}
              >
                {auth.isAuthenticated && !isMe && (
                  <FavoriteButton
                    disabled={isLoading}
                    isFavorited={isFavorited}
                    text="a"
                    onClick={() => {
                      Inertia.post(
                        `/list/${id}/favorite`,
                        {},
                        {
                          headers: { 'X-Page-Referer': 'details-page' },
                          preserveScroll: true,
                          preserveState: true,
                          only: ['auth', 'flash', 'errors', 'details', 'isFavorited'],
                        }
                      );
                    }}
                  />
                )}
                {isMe && (
                  <>
                    <IconButton onClick={onDeleteButtonClick} style={{ display: 'none' }}>
                      <DeleteIcon />
                    </IconButton>
                    <Button
                      startIcon={<DeleteIcon />}
                      disabled={isLoading}
                      color="secondary"
                      variant="text"
                      size="medium"
                      onClick={onDeleteButtonClick}
                    >
                      Delete this list
                    </Button>
                    <Button
                      startIcon={<AddCircleIcon />}
                      disabled={isLoading}
                      color="primary"
                      variant="text"
                      size="medium"
                      href={`/list/${id}/video/add`}
                      onClick={onAddVideoClick}
                    >
                      Add video to list
                    </Button>
                  </>
                )}
              </Grid>
              <Divider variant="fullWidth" />
              <UserCard
                className={classes.userCard}
                nameText={user.name}
                usernameText={user.username}
                pictureUrl={user.picture}
              />
              <Divider variant="fullWidth" />
              <Divider variant="fullWidth" />
              <ItemsList
                title="Creators"
                items={authors}
                keyProperty="username"
                labelProperty="name"
                minimal={3}
              />
              <ItemsList
                title="Categories"
                items={categories}
                keyProperty="identifier"
                labelProperty="description"
              />
              <ItemsList
                title="Languages"
                items={languages}
                keyProperty="code"
                labelProperty="name"
              />
              <Divider variant="fullWidth" />
            </Grid>
            <div className={classes.contentColumn}>
              {videos.length === 0 && (
                <Typography component="h6" variant="h6" color="secondary">
                  {isMe && `Your list is not visible to others because doesn't have any videos.`}
                  {!isMe && `This is an empty list, the creator hasn't added any videos yet.`}
                </Typography>
              )}
              {videos.length > 0 && (
                <>
                  <MuiList dense component="div" data-name="MuiList">
                    <ContainerDraggable
                      dragHandleSelector=".drag-handle"
                      lockAxis="y"
                      orientation="vertical"
                      onDrop={onVideoDrop}
                    >
                      {videos.map((video, index) => (
                        <Draggable key={video.id}>
                          <ListItem
                            key={video.id}
                            component={InertiaLink}
                            button
                            divider
                            dense
                            disabled={isLoading}
                            href={`/list/${id}`}
                            preserveScroll
                            preserveState
                            headers={{ 'X-List-From': video.id, 'X-Page-Referer': 'details' }}
                            only={[
                              'auth',
                              'flash',
                              'errors',
                              'modal',
                              'list',
                              'videos',
                              'referer',
                              'from',
                            ]}
                          >
                            {isMe && videos.length > 1 && (
                              <ListItemIcon style={{ minWidth: theme.spacing(5) }}>
                                <IconButton
                                  size="small"
                                  aria-label="sort"
                                  className="drag-handle"
                                  style={{ cursor: 'grab' }}
                                >
                                  <DragHandleIcon />
                                </IconButton>
                              </ListItemIcon>
                            )}
                            <ListItemAvatar className={classes.listItemAvatar}>
                              <>
                                {video.id === coverId && (
                                  <Tooltip title="This video is the current cover of the list">
                                    <Badge color="secondary" badgeContent=" " variant="dot">
                                      {/* TODO: find a way to not repeat the same Avatar component */}
                                      <Avatar
                                        alt={video.title}
                                        className={classes.avatar}
                                        variant="square"
                                        src={video.thumbnail}
                                      />
                                    </Badge>
                                  </Tooltip>
                                )}
                                {video.id !== coverId && (
                                  <Avatar
                                    alt={video.title}
                                    className={classes.avatar}
                                    variant="square"
                                    src={video.thumbnail}
                                  />
                                )}
                              </>
                            </ListItemAvatar>
                            <ListItemText
                              id={video.id}
                              primary={video.title}
                              style={{ wordBreak: 'break-word' }}
                            />
                            {isMe && (
                              <ListItemSecondaryAction>
                                <IconButton
                                  aria-haspopup="true"
                                  onClick={handleUserMenuClick(video.id)}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                              </ListItemSecondaryAction>
                            )}
                          </ListItem>
                          {index !== videos.length - 1 && (
                            <Divider variant="fullWidth" component="li" />
                          )}
                        </Draggable>
                      ))}
                    </ContainerDraggable>
                  </MuiList>
                  {itemMenuState && (
                    <Menu
                      id="simple-menu"
                      anchorEl={itemMenuState.anchor}
                      open={itemMenuState.isOpen}
                      onClose={handleUserMenuClose}
                      onExited={() => {
                        setItemMenuState(null);
                      }}
                      className={classes.userMenu}
                    >
                      {coverId !== itemMenuState.videoId && (
                        <MenuItem
                          onClick={() => {
                            onUpdateListCover(itemMenuState.videoId);
                            handleUserMenuClose();
                          }}
                        >
                          <ListItemIcon classes={{ ...menuListItemIconStyles }}>
                            <CheckCircleIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary="Make list cover" />
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={() => {
                          onRemoveButtonClick(itemMenuState.videoId);
                          handleUserMenuClose();
                        }}
                      >
                        <ListItemIcon classes={{ ...menuListItemIconStyles }}>
                          <DeleteIcon color="secondary" />
                        </ListItemIcon>
                        <ListItemText primary="Remove video" />
                      </MenuItem>
                    </Menu>
                  )}
                </>
              )}
            </div>
          </Grid>
        </Paper>
      )}
      {isMe && (
        <Suspense fallback={<div>Loading...</div>}>
          {isRemoveVideoDialogOpen && (
            <ConfirmDialog
              isOpen={isRemoveVideoDialogOpen}
              onDialogClose={onRemoveVideoDialogClose}
              actionHandler={onRemove}
              title="Confirm"
              description="Are you sure to remove this video from the list?"
              actionText="Remove"
              cancelText="Cancel"
            />
          )}
          {isDeleteDialogOpen && (
            <ConfirmDialog
              isOpen={isDeleteDialogOpen}
              onDialogClose={onDeleteDialogClose}
              actionHandler={onDelete}
              title="Confirm"
              description="Are you sure to delete this list?"
              actionText="Delete"
              cancelText="Cancel"
            />
          )}
        </Suspense>
      )}
      <InertiaModals modal={modal} />
    </>
  );
};

Details.layout = (page) => <Layout children={page} />;

export default Details;
