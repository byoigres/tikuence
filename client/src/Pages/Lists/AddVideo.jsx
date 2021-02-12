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

const AddVideoPage = ({ listId, errors }) => {
  const classes = useStyles();
  const {
    props: { isMobile },
  } = usePage();
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const titleRef = useRef(null);

  function handleChange(e) {
    const { value } = e.target;

    setVideoUrl(value);
  }

  const handleClose = () => {
    Inertia.visit(`/list/${listId}/edit?an=0`);
  };

  function onCreate() {
    Inertia.post(
      `/list/${listId}/video`,
      { videoUrl },
      {
        onStart() {
          setIsLoading(true);
        },
        onSuccess() {},
        onFinish() {
          setIsLoading(false);
          titleRef.current.focus();
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
    <Dialog
      fullScreen={isMobile}
      fullWidth
      maxWidth="sm"
      open
      onClose={handleClose}
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
          <Typography variant="h6" className={classes.title}>
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
        <DialogContentText>
          <p>Paste a TikTok video URL</p>
          <p>
            <i>Example:</i>
          </p>
          <ul>
            <li>https://www.tiktok.com/@bellapoarch/video/6862153058223197445</li>
          </ul>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

AddVideoPage.layout = (page) => <Layout children={page} cleanLayout />;

export default AddVideoPage;
