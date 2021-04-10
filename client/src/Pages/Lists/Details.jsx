import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { Inertia } from '@inertiajs/inertia';
import { Container as ContainerDraggable, Draggable } from 'react-smooth-dnd';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import Layout from '../../components/Layout';
import AddVideo from './AddVideo';
import SEO from '../../components/SEO';
import List from './List';
import ConfirmDialog from '../../components/ConfirmDialog';
import TitleForUpdate from '../../components/TitleForUpdate';
import UserAvatar from '../../components/UserAvatar';
import FavoriteButton from '../../components/FavoriteButton';
import FabFloatingLink from '../../components/FabFloatingLink';

const useStyles = makeStyles((theme) => ({
  list: {
    // backgroundColor: '#fff',
  },
  listItemAvatar: {
    minWidth: 72,
  },
  avatar: {
    width: theme.spacing(7),
    minHeight: '100px',
    height: '100%',
  },
  actionButtons: () => ({
    // display: 'flex',
    // flexDirection: 'column',
  }),
  createVideoButton: ({ isMobile }) => ({
    position: 'absolute',
    right: isMobile ? '10px' : '52px',
    bottom: '0',
  }),
  mainGrid: {
    backgroundColor: 'white',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const Details = () => {
  const {
    props: { auth, id, title, isFavorited, user, videos, isMobile, isMe, modal = false },
  } = usePage();
  const classes = useStyles({ isMobile });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSorting, setIsSorting] = useState(false);
  const [isRemoveVideoDialogOpen, setIsRemoveVideoDialogOpen] = useState(false);
  const [currentVideoToDelete, setCurrentVideoToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState([]);

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
      onStart() {
        setIsLoading(true);
      },
      onSuccess() {},
      onFinish() {
        setIsLoading(false);
        setIsRemoveVideoDialogOpen(false);
        setCurrentVideoToDelete(null);
      },
    });
  }

  function onDeleteDialogClose() {
    setIsDeleteDialogOpen(false);
  }

  function onDeleteButtonClick() {
    setIsDeleteDialogOpen(true);
  }

  function onDelete() {
    Inertia.visit(`/list/${id}`, { method: 'delete' });
    // Inertia.delete(`/list/${id}`, {
    //   onStart() {
    //     setIsLoading(true);
    //   },
    //   onSuccess({ props: { lists: newLists } }) {
    //     setLists(newLists);
    //   },
    //   onFinish() {
    //     setIsLoading(false);
    //     setIsDeleteDialogOpen(false);
    //     setCurrentItemToDelete(null);
    //   },
    // });
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
          onStart() {
            setIsLoading(true);
          },
          onSuccess() {},
          onFinish() {
            setIsLoading(false);
          },
        }
      );
    }
  };

  const onSortigChange = () => {
    setIsSorting(!isSorting);
  };

  const handleUserMenuClose = (identifier) => () => {
    const newArray = [...anchorEl];
    newArray[identifier] = null;
    setAnchorEl(newArray);
  };

  return (
    <>
      <SEO title={title} />
      {id && (
        <Grid container className={classes.mainGrid}>
          <Grid item sm={12} md={4}>
            <TitleForUpdate title={title} id={id} canEdit={isMe} />
            {videos && videos.length > 0 && (
              <Typography component="span" variant="caption">
                {`There ${videos.length > 1 ? 'are' : 'is'} ${videos.length} video${
                  videos.length > 1 ? 's' : ''
                } in this list`}
              </Typography>
            )}
            <Divider variant="fullWidth" style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }} />
            <Grid container wrap="nowrap" alignItems="flex-start">
              {auth.isAuthenticated && !isMe && (
                <FavoriteButton
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
                <IconButton onClick={onDeleteButtonClick}>
                  <DeleteIcon />
                </IconButton>
              )}
              {isMe && videos && videos.length > 1 && (
                <FormControlLabel
                  control={<Switch checked={isSorting} onChange={onSortigChange} name="sorting" />}
                  label="Sort videos"
                />
              )}
            </Grid>
            <InertiaLink href={`/users/${user.username}`}>
              <Grid
                container
                alignItems="center"
                style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
              >
                <UserAvatar image={user.picture} letter={user.username[0]} />
                <Typography>&nbsp;@{user.username}</Typography>
              </Grid>
            </InertiaLink>
            <Divider variant="fullWidth" />
          </Grid>
          <Grid item md={8}>
            {videos.length === 0 && (
              <Typography component="h6" variant="h6" color="secondary">
                {isMe && `Your list is not visible to others because doesn't have any videos.`}
                {!isMe && `This is an empty list, the creator hasn't added any videos yet.`}
              </Typography>
            )}
            {videos.length > 0 && (
              <MuiList dense className={classes.list}>
                <ContainerDraggable
                  dragHandleSelector=".drag-handle"
                  lockAxis="y"
                  onDrop={onVideoDrop}
                >
                  {videos.map((video, index) => (
                    <Draggable key={video.id}>
                      <ListItem
                        key={video.id}
                        component={InertiaLink}
                        button
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
                        <ListItemAvatar className={classes.listItemAvatar}>
                          <Avatar
                            alt={video.title}
                            className={classes.avatar}
                            variant="square"
                            src={`/images/sm-${video.thumbnail_name}`}
                          />
                        </ListItemAvatar>
                        <ListItemText id={video.id} primary={video.title} />
                        {isMe && (
                          <ListItemSecondaryAction className={classes.actionButtons}>
                            {/* <IconButton
                                edge="start"
                                className={classes.menuButton2}
                                color="inherit"
                                aria-label="menu"
                                aria-haspopup="true"
                                onClick={handleUserMenuClick(video.id)}
                              >
                                <MoreVertIcon />
                              </IconButton> */}
                            {!isSorting && (
                              <IconButton
                                edge="end"
                                aria-label="remove"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onRemoveButtonClick(video.id);
                                }}
                                disabled={isLoading}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                            {isSorting && (
                              <IconButton
                                edge="end"
                                aria-label="sort"
                                disabled={isLoading}
                                className="drag-handle"
                              >
                                <DragHandleIcon />
                              </IconButton>
                            )}
                            <Menu
                              id="simple-menu"
                              anchorEl={anchorEl[video.id]}
                              keepMounted
                              open={Boolean(anchorEl[video.id])}
                              onClose={handleUserMenuClose(video.id)}
                              className={classes.userMenu}
                            >
                              <MenuItem onClick={handleUserMenuClose}>
                                <IconButton
                                  edge="end"
                                  aria-label="remove"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onRemoveButtonClick(video.id);
                                  }}
                                  disabled={isLoading}
                                >
                                  <DeleteIcon />
                                </IconButton>
                                Delete
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  Inertia.get('/auth/logout');
                                }}
                              >
                                Logout
                              </MenuItem>
                            </Menu>
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
            )}
          </Grid>
        </Grid>
      )}
      {isMe && (
        <>
          <ConfirmDialog
            isOpen={isRemoveVideoDialogOpen}
            onDialogClose={onRemoveVideoDialogClose}
            actionHandler={onRemove}
            title="Confirm"
            description="Are you sure to remove this video from the list?"
            actionText="Remove"
            cancelText="Cancel"
          />
          <ConfirmDialog
            isOpen={isDeleteDialogOpen}
            onDialogClose={onDeleteDialogClose}
            actionHandler={onDelete}
            title="Confirm"
            description="Are you sure to delete this list?"
            actionText="Delete"
            cancelText="Cancel"
          />
          <FabFloatingLink onClick={onAddVideoClick} />
        </>
      )}
      {modal && modal.modalName === 'list' && <List pageReferer="details" />}
      {modal && modal.modalName === 'add-video' && <AddVideo />}
    </>
  );
};

Details.layout = (page) => <Layout children={page} />;

export default Details;
