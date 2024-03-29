import React, { useState, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { usePage } from '@inertiajs/inertia-react';
import Slide from '@material-ui/core/Slide';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

/* eslint react/jsx-props-no-spreading: 0 */
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const AddVideoPage = () => {
  const classes = useStyles();
  const {
    props: {
      modal: { listId },
      errors,
      referer,
      isMobile,
    },
  } = usePage();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const titleRef = useRef(null);

  function handleChange(e) {
    const { value } = e.target;

    setVideoUrl(value);
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  function onCreate() {
    Inertia.post(
      `/list/${listId}/video`,
      { videoUrl },
      {
        // TODO: pull all list info in a list variable
        only: [
          'auth',
          'flash',
          'errors',
          'listId',
          'modal',
          'referer',
          'videos',
          'title',
          'coverId',
        ],
        preserveScroll: true,
        preserveState: true,
        onStart() {
          setIsLoading(true);
        },
        onSuccess() {},
        onFinish() {
          setIsLoading(false);
          if (titleRef.current) {
            titleRef.current.focus();
          }
        },
      }
    );
  }

  const handleCreate = (e) => {
    e.preventDefault();
    e.stopPropagation();

    onCreate();
  };

  function handleOnKeyPress(ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      onCreate();
    }
  }

  return (
    <>
      <SEO title="Add new video" />
      <Dialog
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
        open={isOpen}
        onClose={handleClose}
        onExited={() => {
          const visitOptions = {
            preserveScroll: true,
          };

          if (referer) {
            visitOptions.only = ['auth', 'flash', 'errors', 'modal'];
          }

          Inertia.visit(`/list/${listId}/details`, visitOptions);
        }}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
              disabled={isLoading}
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="h1" className={classes.title}>
              Add video to list
            </Typography>
            <Button autoFocus color="inherit" onClick={handleCreate} disabled={isLoading}>
              Add
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <TextField
            placeholder="Enter the URL of the video"
            label="Video URL"
            autoFocus
            fullWidth
            margin="dense"
            inputProps={{
              maxLength: 150,
              required: true,
              ref: titleRef,
            }}
            required
            type="url"
            disabled={isLoading}
            value={videoUrl}
            onChange={handleChange}
            onKeyPress={handleOnKeyPress}
            error={errors.videoUrl !== undefined}
            helperText={errors.videoUrl}
          />
          <Typography variant="subtitle2">Paste a TikTok video URL</Typography>
          <br />
          <i>Examples:</i>
          <Typography
            variant="subtitle2"
            component="ul"
            style={{
              paddingLeft: 16,
            }}
          >
            <li>https://www.tiktok.com/[user]/video/[video-id]</li>
            <li>https://m.tiktok.com/v/[video-id].html</li>
            <li>https://vm.tiktok.com/[video-id]</li>
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

AddVideoPage.layout = (page) => <Layout children={page} cleanLayout />;

export default AddVideoPage;
