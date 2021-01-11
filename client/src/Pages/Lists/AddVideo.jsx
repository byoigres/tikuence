import React, { useState } from 'react';
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
import { useSnackbar } from 'notistack';
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

function getReturnURL() {
  const query = location.search.slice(1);
  const parts = query.split('&');

  const values = parts.map(part => part.split('='))
    .reduce((previous, current) => {
      if (current.length > 1) {
        previous[current[0]] = decodeURIComponent(current[1]);
      }

      return previous;
    }, {});

  return values['returnUrl'] ? values['returnUrl'] : '/';
}

const AddVideoPage = ({ listId, errors }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [returnUrl] = useState(getReturnURL());

  function handleChange(e) {
    const { value } = e.target;

    setVideoUrl(value);
  }

  const handleClose = () => {
    Inertia.get(getReturnURL());
  };

  const handleCreate = (e) => {
    e.preventDefault();
    e.stopPropagation();

    Inertia.post(
      `/list/${listId}/video${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`,
      { videoUrl },
      {
        onStart() {
          setIsLoading(true);
        },
        onSuccess(page) {
          if (page.props.flash && page.props.flash.error) {
            enqueueSnackbar(page.props.flash.error, { variant: 'error' });
          }
          // handleClose();
        },
        onFinish() {
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <Dialog fullScreen open onClose={handleClose} TransitionComponent={Transition}>
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
            required: true
          }}
          required
          disabled={isLoading}
          value={videoUrl}
          onChange={handleChange}
          error={errors.videoUrl !== undefined}
          helperText={errors.videoUrl}
        />
        <DialogContentText>
          After creating the list you would be able to add videos to it.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

AddVideoPage.layout = (page) => <Layout children={page} cleanLayout flash={page.props.flash} />;

export default AddVideoPage;
