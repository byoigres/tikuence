import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List';
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
import Layout from '../../components/Layout';
import ConfirmDialog from '../../components/ConfirmDialog';
import TitleForUpdate from '../../components/TitleForUpdate';
import UserAvatar from '../../components/UserAvatar';

const useStyles = makeStyles((theme) => ({
  list: {
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: '1rem',
  },
  actionArea: {
    // display: "flex",
    // justifyContent: "flex-start"
  },
  cover: {
    // width: 100
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  listItemAvatar: {
    minWidth: 72,
  },
  avatar: {
    width: theme.spacing(7),
    minHeight: '100px',
    height: '100%',
  },
  messageNumberOfVideos: {
    margin: '1rem 0',
  },
  messageNoVideos: {
    margin: '1rem 0',
  },
  titleContainer: {
    display: 'flex',
    width: '100%',
  },
  title: {
    flex: 1,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  inlineTitle: (p) => ({
    '&:hover': {
      cursor: p.isMobile ? 'default' : 'pointer',
      color: theme.palette.text.secondary,
    },
  }),
  titleButtons: (p) => ({
    marginLeft: p.isMobile ? '0.5rem' : '1rem',
  }),
  addVideoButton: {
    marginBottom: '1rem',
  },
  editIcon: {
    marginLeft: '0.5rem',
  },
  actionButtons: () => ({
    display: 'flex',
    flexDirection: 'column',
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
}));

const Edit = ({ list, isMobile, auth: { credentials } }) => {
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
    Inertia.get(`/list/${list.id}/video/add`);
    // Inertia.visit('/list/add', {
    //   preserveScroll: true,
    //   preserveState: true,
    //   only: ['referer', 'showModal'],
    // });
  }

  function onRemove() {
    Inertia.delete(`/list/${list.id}/video/${currentVideoToDelete}`, {
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
    Inertia.visit(`/list/${list.id}`, { method: 'delete' });
    // Inertia.delete(`/list/${list.id}`, {
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

  const onItemClick = (videoId) => {
    Inertia.visit(`/list/${list.id}/video/${videoId}`);
  };

  const onVideoDrop = ({ removedIndex, addedIndex }) => {
    if (removedIndex !== addedIndex) {
      Inertia.post(
        `/list/${list.id}/video/${list.videos[removedIndex].id}`,
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

  // const handleUserMenuClick = (id) => (event) => {
  //   const newArray = [...anchorEl];
  //   newArray[id] = event.currentTarget;
  //   setAnchorEl(newArray);
  // };

  const handleUserMenuClose = (id) => () => {
    const newArray = [...anchorEl];
    newArray[id] = null;
    setAnchorEl(newArray);
  };

  return (
    <>
      <Grid
        container
        spacing={2}
        style={{
          paddingTop: '1rem',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          backgroundColor: 'white',
        }}
      >
        <Grid item md={4}>
          <TitleForUpdate title={list.title} id={list.id} />
          {list.videos.length === 0 && (
            <Typography
              component="h6"
              variant="h6"
              color="secondary"
              className={classes.messageNoVideos}
            >
              Your list is not visible to others because doesn&apos;t have any videos.
            </Typography>
          )}
          {list.videos.length > 0 && (
            <Typography
              component="span"
              variant="caption"
              className={classes.messageNumberOfVideos}
            >
              {`There are ${list.videos.length} videos in this list`}
            </Typography>
          )}
          <Divider variant="fullWidth" />
          <Grid container wrap="nowrap" alignItems="center" justify="space-evenly">
            <IconButton onClick={onDeleteButtonClick}>
              <DeleteIcon />
            </IconButton>
            <FormControlLabel
              control={<Switch checked={isSorting} onChange={onSortigChange} name="sorting" />}
              label="Sort videos"
            />
          </Grid>
          <Divider variant="fullWidth" />
          <Grid
            container
            alignItems="center"
            style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}
          >
            <UserAvatar letter={credentials.username[0]} />
            <Typography>&nbsp;@{credentials.username}</Typography>
          </Grid>
        </Grid>
        <Grid item md={8}>
          {list.videos.length > 0 && (
            <List dense className={classes.list}>
              <ContainerDraggable
                dragHandleSelector=".drag-handle"
                lockAxis="y"
                onDrop={onVideoDrop}
              >
                {list.videos.map((video, index) => (
                  <Draggable key={video.id}>
                    <ListItem
                      key={video.id}
                      button
                      disabled={isLoading}
                      onClick={(e) => {
                        e.preventDefault();
                        onItemClick(video.id);
                      }}
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
                    </ListItem>
                    {index !== list.videos.length - 1 && (
                      <Divider variant="fullWidth" component="li" />
                    )}
                  </Draggable>
                ))}
              </ContainerDraggable>
            </List>
          )}
        </Grid>
      </Grid>
      <div data-name="add-list" className={classes.addVideoContainer}>
        <Fab
          color="primary"
          aria-label="add"
          className={classes.createVideoButton}
          href={`/list/${list.id}/video/add`}
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
  );
};

Edit.layout = (page) => <Layout children={page} />;

export default Edit;
