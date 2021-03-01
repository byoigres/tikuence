import React, { useState } from 'react';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import EditIcon from '@material-ui/icons/Edit';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import { Inertia } from '@inertiajs/inertia';
import { Container as ContainerDraggable, Draggable } from 'react-smooth-dnd';
import Layout from '../../components/Layout';
import ConfirmDialog from '../../components/ConfirmDialog';

// NOOP
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
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
}));

/* eslint react/jsx-props-no-spreading: 0 */
const Transition = React.forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

const Edit = ({ list, errors, referer, isMobile }) => {
  const classes = useStyles({ isMobile });
  const [isLoading, setIsLoading] = useState(false);
  const [isTitleInEditMode, setIsTitleInEditMode] = useState(false);
  const [title, setTitle] = useState(list.title);
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
  function handleAddVideo(e) {
    e.preventDefault();
    Inertia.get(`/list/${list.id}/video/add`);
  }

  function handleTitleClick(e) {
    e.preventDefault();
    setTitle(list.title);
    setIsTitleInEditMode(!isTitleInEditMode);
  }

  function handleTitleChange(e) {
    e.preventDefault();
    setTitle(e.target.value);
  }

  function onTitleUpdate() {
    Inertia.put(
      `/list/${list.id}`,
      { title },
      {
        onStart() {
          setIsLoading(true);
        },
        onSuccess() {
          setIsTitleInEditMode(false);
        },
        onFinish() {
          setIsLoading(false);
          // if (listNameRef.current) {
          //   listNameRef.current.focus();
          // }
        },
      }
    );
  }

  function handleOnKeyPress(ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      onTitleUpdate();
    }
  }

  function hadleTitleUpdate(e) {
    e.preventDefault();
    onTitleUpdate();
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

  const handleEditDialogClose = () => {
    Inertia.get(referer, { an: 0 });
  };

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

  const handleUserMenuClick = (id) => (event) => {
    // console.log('target', event.currentTarget);
    const newArray = [...anchorEl];
    newArray[id] = event.currentTarget;
    setAnchorEl(newArray);
  };

  const handleUserMenuClose = (id) => () => {
    const newArray = [...anchorEl];
    newArray[id] = null;
    setAnchorEl(newArray);
  };

  const animationProp = {};

  if (!window.location.search.includes('an=0')) {
    animationProp.TransitionComponent = Transition;
  }

  return (
    <Container maxWidth="md" style={{ backgroundColor: 'white' }}>
      <Grid container>
        <Grid item md={12}>
          {isTitleInEditMode && (
            <div className={classes.titleContainer}>
              <TextField
                id="title"
                name="title"
                value={title}
                autoFocus
                onChange={handleTitleChange}
                onKeyPress={handleOnKeyPress}
                fullWidth
                autoComplete="off"
                required
                error={errors.title !== undefined}
                helperText={errors.title}
                disabled={isLoading}
              />
              <Button
                className={classes.titleButtons}
                variant="outlined"
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  setIsTitleInEditMode(!isTitleInEditMode);
                  Inertia.reload({
                    replace: true,
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                className={classes.titleButtons}
                variant="outlined"
                color="primary"
                disabled={isLoading}
                onClick={hadleTitleUpdate}
              >
                Update
              </Button>
            </div>
          )}
          {!isTitleInEditMode && (
            <Typography
              component="h4"
              variant="h4"
              className={classes.inlineTitle}
              onClick={handleTitleClick}
            >
              {list.title}
              <EditIcon className={classes.editIcon} />
            </Typography>
          )}
        </Grid>
        <Grid item md={6}>
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
              variant="subtitle1"
              className={classes.messageNumberOfVideos}
            >
              {`There are ${list.videos.length} videos in this list`}
            </Typography>
          )}
        </Grid>
        <Grid item md={6}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleAddVideo}
            type="button"
            className={classes.addVideoButton}
            disabled={isLoading}
          >
            Add videos
          </Button>
        </Grid>
        <Grid container justify="flex-end" item md={12}>
          <FormControlLabel
            control={<Switch checked={isSorting} onChange={onSortigChange} name="sorting" />}
            label="Sort videos"
          />
        </Grid>
        <Grid item md={12}>
          {list.videos.length > 0 && (
            <List dense className={classes.list}>
              <ContainerDraggable
                dragHandleSelector=".drag-handle"
                lockAxis="y"
                onDrop={onVideoDrop}
              >
                {list.videos
                  // TODO: Ensure this is always order the way should be
                  // .sort((a, b) => a.order_id - b.order_id)
                  .map((video, index) => (
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
      <ConfirmDialog
        isOpen={isRemoveVideoDialogOpen}
        onDialogClose={onRemoveVideoDialogClose}
        actionHandler={onRemove}
        title="Confirm"
        description="Are you sure to remove this video from the list?"
        actionText="Remove"
        cancelText="Cancel"
      />
    </Container>
  );
};

Edit.layout = (page) => <Layout children={page} />;

export default Edit;
