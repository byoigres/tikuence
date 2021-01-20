import React, { Fragment, useState } from 'react';

import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Slide from '@material-ui/core/Slide';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import EditIcon from '@material-ui/icons/Edit';
import SortIcon from '@material-ui/icons/Sort';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
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
  title: (p) => ({
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

const Edit = ({ list }) => {
  const {
    props: { isMobile },
  } = usePage();
  const classes = useStyles({ isMobile });
  const [isLoading, setIsLoading] = useState(false);
  const [isTitleInEditMode, setIsTitleInEditMode] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [isRemoveVideoDialogOpen, setIsRemoveVideoDialogOpen] = useState(false);
  const [currentVideoToDelete, setCurrentVideoToDelete] = useState(null);

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
    Inertia.get('/profile/lists', { an: 0 });
  };

  const animationProp = {};

  if (!window.location.search.includes('an=0')) {
    animationProp.TransitionComponent = Transition;
  }

  return (
    <>
      <Dialog fullScreen={isMobile} open onClose={handleEditDialogClose} {...animationProp}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleEditDialogClose}
              aria-label="close"
              disabled={isLoading}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {list.title}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent className={classes.dialogContent}>
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
                disabled={isLoading}
              />
              <Button
                className={classes.titleButtons}
                variant="outlined"
                onClick={handleTitleClick}
              >
                Cancel
              </Button>
              <Button
                className={classes.titleButtons}
                variant="outlined"
                color="primary"
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
              className={classes.title}
              onClick={handleTitleClick}
            >
              {list.title}
              <EditIcon className={classes.editIcon} />
            </Typography>
          )}
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
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={handleAddVideo}
            type="button"
            className={classes.addVideoButton}
          >
            Add videos
          </Button>
          {list.videos.length > 0 && (
            <List dense className={classes.list}>
              {list.videos.map((video, index) => (
                <Fragment key={video.id}>
                  <ListItem key={video.id} button disabled={isLoading}>
                    <ListItemAvatar className={classes.listItemAvatar}>
                      <Avatar
                        alt={video.title}
                        className={classes.avatar}
                        variant="square"
                        src={`/images/${video.thumbnail_name}`}
                      />
                    </ListItemAvatar>
                    <ListItemText id={video.id} primary={video.title} />
                    <ListItemSecondaryAction className={classes.actionButtons}>
                      <Tooltip title="Remove">
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
                      </Tooltip>
                      <Tooltip title="Sort">
                        <IconButton edge="end" aria-label="sort" disabled={isLoading}>
                          <SortIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index !== list.videos.length - 1 && (
                    <Divider variant="fullWidth" component="li" />
                  )}
                </Fragment>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog
        isOpen={isRemoveVideoDialogOpen}
        onDialogClose={onRemoveVideoDialogClose}
        actionHandler={onRemove}
        title="Confirm"
        description="Are you sure to remove this video from the list?"
        actionText="Remove"
        cancelText="Cancel"
      />
    </>
  );
};

/*
const Edit = ({ list }) => {
  const { error } = usePage();
  const [title, setTitle] = useState(list.title);
  const [newVideoURL, setNewVideoURL] = useState("");
  const [isTitleInEditMode, setIsTitleInEditMode] = useState(false);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);

  function toggleAddVideoModalOpen(e) {
    setIsAddVideoModalOpen(!isAddVideoModalOpen);
  }

  function handleTitleChange(e) {
    e.preventDefault();
    setTitle(e.target.value);
  }

  function handleTitleClick(e) {
    e.preventDefault();
    console.log(isTitleInEditMode);
    setIsTitleInEditMode(!isTitleInEditMode);
  }

  function handleNewVideoURLChange(e) {
    e.preventDefault();
    setNewVideoURL(e.target.value);
  }

  function handleNewVideo(e) {
    e.preventDefault();
    Inertia.post(`/list/${list.id}/video`, {
      url: newVideoURL,
    });
  }

  return (
    <Layout>
      <Window title="Edit list">
        {isTitleInEditMode && (
          <Fragment>
            <input
              id="title"
              name="title"
              value={title}
              autoFocus
              onChange={handleTitleChange}
              autoComplete="off"
              required
              // disabled={isLoading}
            />
            <Button onClick={handleTitleClick}>Cancel</Button>
            <Button>Save</Button>
          </Fragment>
        )}
        {!isTitleInEditMode && (
          <h1 className={""} onClick={handleTitleClick}>
            {list.title}
          </h1>
        )}
        <AddVideoContainer>
          <VideosCount>
            {`There are ${list.videos.length} videos in this list`}
          </VideosCount>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setIsAddVideoModalOpen(true);
            }}
          >
            Add video...
          </Button>
        </AddVideoContainer>
        {list.videos.map((video) => (
          <VideoListItemContainer key={video.id}>
            <VideoListItemContent>
              <VideoListItemImage src={`/images/${video.thumbnail_name}`} />
              <VideoListItemDescriptions>
                <ItemSubtitle>{video.title}</ItemSubtitle>
                <ItemAuthor>List by {video.author.username}</ItemAuthor>
              </VideoListItemDescriptions>
            </VideoListItemContent>
            <VideoListItemActions>
              <i className="fas fa-trash-alt"></i>
              <i className="fas fa-arrow-up"></i>
              <i className="fas fa-arrow-down"></i>
            </VideoListItemActions>
          </VideoListItemContainer>
        ))}
        <Modal
          isOpen={isAddVideoModalOpen}
          onBackgroundClick={toggleAddVideoModalOpen}
          onEscapeKeydown={toggleAddVideoModalOpen}
          opacity={1}
          backgroundProps={{ opacity: 1 }}
        >
          <ModalHeader
            title="Add video..."
            closeCallback={toggleAddVideoModalOpen}
          />
          <ModalContent>
            <input
              id="new-video"
              name="new-video"
              value={newVideoURL}
              onChange={handleNewVideoURLChange}
              placeholder="Video URL"
              type="url"
              autoFocus
              autoComplete="off"
              required
              // disabled={isLoading}
            />
          </ModalContent>
          <ModalActions>
            <Button
              type="button"
              onClick={handleNewVideo}
              // disabled={isLoading}
              // loading={isLoading}
            >
              Add video
            </Button>
          </ModalActions>
        </Modal>
      </Window>
    </Layout>
  );
};
*/
Edit.layout = (page) => <Layout children={page} cleanLayout />;

export default Edit;
