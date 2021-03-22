import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import MuiList from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { Inertia } from '@inertiajs/inertia';
import { Container as ContainerDraggable, Draggable } from 'react-smooth-dnd';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import Layout from '../../components/Layout';
import AddVideo from './AddVideo';
import List from './List';
import ConfirmDialog from '../../components/ConfirmDialog';
import TitleForUpdate from '../../components/TitleForUpdate';
import UserAvatar from '../../components/UserAvatar';
import FavoriteButton from '../../components/FavoriteButton';

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
  addVideoContainer: ({ isMobile }) => ({
    position: 'fixed',
    bottom: '10px',
    width: isMobile ? '100%' : '960px',
    textAlign: 'right',
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

const Edit = () => {
  const {
    props: { auth, details, isMobile, isMe, showModal = false },
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

  function onRemoveButtonClick(id) {
    setIsRemoveVideoDialogOpen(true);
    setCurrentVideoToDelete(id);
  }

  // HTTP handlers
  function onAddVideoClick(e) {
    e.preventDefault();
    Inertia.visit(`/list/${details.id}/video/add`, {
      only: ['auth', 'flash', 'errors', 'listId', 'showModal', 'referer'],
      preserveScroll: true,
      preserveState: true,
    });
  }

  function onRemove() {
    Inertia.delete(`/list/${details.id}/video/${currentVideoToDelete}`, {
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
    Inertia.visit(`/list/${details.id}`, { method: 'delete' });
    // Inertia.delete(`/list/${details.id}`, {
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
        `/list/${details.id}/video/${details.videos[removedIndex].id}`,
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

  const handleUserMenuClose = (id) => () => {
    const newArray = [...anchorEl];
    newArray[id] = null;
    setAnchorEl(newArray);
  };

  return (
    <>
      {details && (
        <Grid container className={classes.mainGrid}>
          <Grid item md={4}>
            <TitleForUpdate title={details.title} id={details.id} canEdit={isMe} />
            {details && details.videos && details.videos.length > 0 && (
              <Typography component="span" variant="caption">
                {`There ${details.videos.length > 1 ? 'are' : 'is'} ${details.videos.length} video${
                  details.videos.length > 1 ? 's' : ''
                } in this list`}
              </Typography>
            )}
            <Divider
              variant="fullWidth"
              style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
              data-name="abc"
            />
            <Grid container wrap="nowrap" alignItems="center" justify="space-evenly">
              {auth.isAuthenticated && !isMe && (
                <FavoriteButton
                  isFavorited={details.is_favorited}
                  text="a"
                  onClick={() => {
                    Inertia.post(
                      `/list/${details.id}/favorite`,
                      {},
                      {
                        headers: { 'X-Page-Referer': 'details' },
                        preserveScroll: true,
                        preserveState: true,
                        only: ['auth', 'flash', 'errors', 'details'],
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
              {isMe && details && details.videos && details.videos.length > 1 && (
                <FormControlLabel
                  control={<Switch checked={isSorting} onChange={onSortigChange} name="sorting" />}
                  label="Sort videos"
                />
              )}
            </Grid>
            <InertiaLink href={`/users/${details.user.username}`}>
              <Grid
                container
                alignItems="center"
                style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
              >
                <UserAvatar letter={details.user.username[0]} />
                <Typography>&nbsp;@{details.user.username}</Typography>
              </Grid>
            </InertiaLink>
            <Divider variant="fullWidth" />
          </Grid>
          <Grid item md={8}>
            {details.videos.length === 0 && (
              <Typography component="h6" variant="h6" color="secondary">
                {isMe && `Your list is not visible to others because doesn't have any videos.`}
                {!isMe && `This is an empty list, the creator hasn't added any videos yet.`}
              </Typography>
            )}
            {details.videos.length > 0 && (
              <MuiList dense className={classes.list}>
                <ContainerDraggable
                  dragHandleSelector=".drag-handle"
                  lockAxis="y"
                  onDrop={onVideoDrop}
                >
                  {details.videos.map((video, index) => (
                    <Draggable key={video.id}>
                      <ListItem
                        key={video.id}
                        component={InertiaLink}
                        button
                        disabled={isLoading}
                        href={`/list/${details.id}`}
                        preserveScroll
                        preserveState
                        headers={{ 'X-List-From': video.id, 'X-Page-Referer': 'details' }}
                        only={[
                          'auth',
                          'flash',
                          'errors',
                          'showModal',
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
                      {index !== details.videos.length - 1 && (
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
          <div className={classes.addVideoContainer}>
            <Fab
              color="primary"
              aria-label="add"
              className={classes.createVideoButton}
              href={`/list/${details.id}/video/add`}
              onClick={onAddVideoClick}
            >
              <AddIcon />
            </Fab>
          </div>
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
        </>
      )}
      {showModal === 'list' && <List pageReferer="details" />}
      {showModal === 'add-video' && <AddVideo />}
    </>
  );
};

Edit.layout = (page) => <Layout children={page} />;

export default Edit;
