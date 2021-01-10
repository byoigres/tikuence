import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
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

const AddPage = ({ flash }) => {
  const classes = useStyles();

  // const { error } = usePage();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  function handleChange(e) {
    const { value } = e.target;

    setTitle(value);
  }

  const handleClose = () => {
    Inertia.get('/');
  };

  const handleCreate = (e) => {
    e.preventDefault();
    e.stopPropagation();

    Inertia.post(
      '/list',
      { title },
      {
        onStart() {
          setIsLoading(true);
        },
        onSuccess() {
          handleClose();
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
          disabled={isLoading}
          value={title}
          onChange={handleChange}
        />
      </DialogContent>
    </Dialog>
  );
};

/*
const Add = ({ isOpen, closeCallback }) => {
  const { error } = usePage();
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    title: '',
    initialVideo: '',
  });

  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setValues((values) => ({
      ...values,
      [key]: value,
    }));
  }

  function handleNewList(e) {
    e.preventDefault();
    e.stopPropagation();

    Inertia.post('/list', values, {
      onStart() {
        setIsLoading(true);
      },
      onSuccess() {
        closeCallback();
      },
      onFinish() {
        setIsLoading(false);
      },
    });
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onBackgroundClick={closeCallback}
        onEscapeKeydown={closeCallback}
        opacity={1}
        backgroundProps={{ opacity: 1 }}
      >
        <ModalHeader title="New list" closeCallback={closeCallback} />
        <ModalContent>
          {isLoading && <strong>Enviando...</strong>}
          {error && (
            <div>
              <strong>{error}</strong>
            </div>
          )}
          <Input
            id="title"
            name="title"
            placehoder="List name"
            autoFocus
            value={values.title}
            onChange={handleChange}
            autoComplete="off"
            required
            disabled={isLoading}
          />
        </ModalContent>
        <ModalActions>
          <Button type="button" onClick={handleNewList}>
            Create List
          </Button>
        </ModalActions>
      </Modal>
    </>
  );
};
*/

AddPage.layout = (page) => <Layout children={page} cleanLayout />;

export default AddPage;
