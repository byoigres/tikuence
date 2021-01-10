import React, { Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';

// NOOP
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
    height: '100%',
  },
}));

const Edit = ({ list }) => {
  const classes = useStyles();
  return (
    <>
      <Typography component="h4" variant="h4">
        {list.title}
      </Typography>
      {list.videos.length === 0 && (
        <Typography component="h6" variant="h6">
          Your list is not visible to others because doesn't have any videos.
        </Typography>
      )}
      <Button variant="outlined" color="primary" fullWidth>Add videos</Button>
      {list.videos.length > 0 && `There are ${list.videos.length} videos in this list`}
      <List dense className={classes.list} style={{ display: list.videos.length > 0 ? 'block' : 'none' }}>
        {list.videos.map((video) => (
          <Fragment key={video.id}>
            <ListItem key={video.id} button>
              <ListItemAvatar className={classes.listItemAvatar}>
                <Avatar
                  alt={video.title}
                  className={classes.avatar}
                  variant="square"
                  src={`/images/${video.thumbnail_name}`}
                />
              </ListItemAvatar>
              <ListItemText id={video.id} primary={video.title} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="fullWidth" component="li" />
          </Fragment>
        ))}
      </List>
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
Edit.layout = (page) => <Layout children={page} title="Edit list" />;

export default Edit;
