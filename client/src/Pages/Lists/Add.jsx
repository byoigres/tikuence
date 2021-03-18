import React, { useState, useRef } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
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
import Slide from '@material-ui/core/Slide';

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

const AddPage = () => {
  const classes = useStyles();
  const {
    props: { isMobile, referer, errors },
  } = usePage();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  const listNameRef = useRef(null);

  function onCreate() {
    Inertia.post(
      '/list',
      { title },
      {
        preserveScroll: true,
        only: ['auth', 'errors', 'flash', 'isMobile', 'referer', 'displayAddNewList'],
        onStart() {
          setIsLoading(true);
        },
        onSuccess() {},
        onFinish() {
          setIsLoading(false);
          if (listNameRef.current) {
            listNameRef.current.focus();
          }
        },
      }
    );
  }

  function handleChange(e) {
    const { value } = e.target;

    setTitle(value);
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  function handleOnKeyPress(ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      onCreate();
    }
  }

  const handleCreate = (e) => {
    e.preventDefault();
    e.stopPropagation();

    onCreate();
  };

  return (
    <Dialog
      fullScreen={isMobile}
      fullWidth
      maxWidth="sm"
      open={isOpen}
      onClose={handleClose}
      onExited={() => {
        Inertia.visit(referer || '/', { preserveScroll: true, preserveState: referer !== null });
      }}
      TransitionComponent={Transition}
      closeAfterTransition
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
            New list
          </Typography>
          <Button autoFocus color="inherit" onClick={handleCreate} disabled={isLoading}>
            Create
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <TextField
          placeholder="Enter the name of the list"
          label="List name"
          autoFocus
          fullWidth
          margin="dense"
          inputProps={{
            maxLength: 150,
            ref: listNameRef,
          }}
          disabled={isLoading}
          value={title}
          onChange={handleChange}
          onKeyPress={handleOnKeyPress}
          error={errors.title !== undefined}
          helperText={errors.title}
        />
        <DialogContentText>
          After creating the list you would be able to add videos to it.
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default AddPage;
