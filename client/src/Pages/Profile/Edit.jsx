import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tooltip from '@material-ui/core/Tooltip';
import Slide from '@material-ui/core/Slide';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import HelpIcon from '@material-ui/icons/Help';

const useStyles = makeStyles((theme) => ({
  dialogtitle: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  form: {
    '& .MuiFormControl-root, & .MuiButton-root': {
      marginTop: '1rem',
    },
    marginBottom: '1rem',
  },
}));

const HelpAdornment = ({ title = '', position = 'end' }) => (
  <InputAdornment position={position}>
    <Tooltip title={title} enterTouchDelay={50} leaveTouchDelay={4000}>
      <HelpIcon />
    </Tooltip>
  </InputAdornment>
);

/* eslint react/jsx-props-no-spreading: 0 */
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const EditProfile = () => {
  const {
    props: { isMobile, user, errors },
  } = usePage();
  const classes = useStyles();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const nameRef = useRef(null);
  const usernameRef = useRef(null);
  const bioRef = useRef(null);
  const tiktokUsernameRef = useRef(null);
  const [isLoading] = useState(false);
  const [values, setValues] = useState({
    name: user.name,
    bio: user.biography,
    tiktokUsername: user.tiktok_username,
  });

  async function handleClose() {
    setIsModalOpen(false);
  }

  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setValues((v) => ({
      ...v,
      [key]: value,
    }));
  }

  function onSave(e) {
    e.preventDefault();

    Inertia.post(`/users/${user.username}/edit`, values, {
      only: ['auth', 'flash', 'errors', 'referer', 'modal', 'user'],
      onStart() {
        // setIsLoading(true);
      },
      onSuccess() {
        // setIsEditMode(false);
      },
      onFinish() {
        // setIsLoading(false);
      },
    });
  }

  return (
    <Dialog
      fullScreen={isMobile}
      fullWidth
      maxWidth="sm"
      open={isModalOpen}
      onClose={handleClose}
      onExited={() => {
        Inertia.visit(`/users/${user.username}`, {
          preserveScroll: true,
          preserveState: true,
          only: ['auth', 'flash', 'errors', 'modal'],
        });
      }}
      TransitionComponent={Transition}
      className={classes.dialog}
    >
      <AppBar position="relative">
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" className={classes.dialogtitle}>
            Edit profile
          </Typography>
          <Button color="inherit" onClick={onSave}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent className={classes.content}>
        <form className={classes.form} autoComplete="off" autoCorrect="off">
          <TextField
            name="email"
            label="Email"
            value={user.email}
            fullWidth
            disabled
            variant="outlined"
          />
          <TextField
            name="username"
            label="Username"
            value={user.username}
            helperText={errors.username}
            disabled
            InputProps={{
              maxLength: 24,
              autoComplete: 'off',
              ref: usernameRef,
              endAdornment: (
                <HelpAdornment title="This is a unique identifier for your account, this will be part of your profile URL. This field cannot be changed" />
              ),
            }}
            fullWidth
            variant="outlined"
          />
          <TextField
            name="name"
            label="Name"
            value={values.name}
            error={errors.name !== undefined}
            helperText={errors.name}
            autoComplete="off"
            disabled={isLoading}
            onChange={handleChange}
            InputProps={{
              maxLength: 50,
              autoComplete: 'off',
              ref: nameRef,
              endAdornment: (
                <HelpAdornment title="This is the name that will appears in your profile." />
              ),
            }}
            fullWidth
            autoFocus
            variant="outlined"
          />
          <TextField
            name="bio"
            label="Bio"
            placeholder="Write a little bit of yourself (optional)"
            value={values.bio}
            error={errors.bio !== undefined}
            helperText={errors.bio}
            autoComplete="off"
            multiline
            rows={4}
            disabled={isLoading}
            onChange={handleChange}
            inputProps={{
              'data-gramm_editor': 'false',
              maxLength: 160,
              autoComplete: 'off',
              ref: bioRef,
            }}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            InputProps={{
              endAdornment: (
                <HelpAdornment title="This description will appears in your profile, be creative." />
              ),
            }}
            fullWidth
            variant="outlined"
          />
          <TextField
            name="tiktokUsername"
            label="TikTok username"
            placeholder="(Optional)"
            value={values.tiktokUsername}
            error={errors.tiktokUsername !== undefined}
            helperText={errors.tiktokUsername}
            autoComplete="off"
            disabled={isLoading}
            onChange={handleChange}
            onKeyPress={(e) => {
              if (!/^([A-Za-z0-9_.])$/.test(e.key)) {
                e.preventDefault();
              }
            }}
            inputProps={{
              maxLength: 24,
              autoComplete: 'off',
              ref: tiktokUsernameRef,
            }}
            // eslint-disable-next-line react/jsx-no-duplicate-props
            InputProps={{
              startAdornment: <InputAdornment position="start">@</InputAdornment>,
              endAdornment: (
                <HelpAdornment title="This will create a link in your profile to your TikTok account." />
              ),
            }}
            fullWidth
            variant="outlined"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
