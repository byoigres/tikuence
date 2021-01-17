import React, { useState } from 'react';
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

const AddPage = ({ errors }) => {
  const classes = useStyles();
  const {
    props: { isMobile },
  } = usePage();
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');

  function getReturnURL() {
    const query = window.location.search.slice(1);
    const parts = query.split('&');

    const values = parts
      .map((part) => part.split('='))
      .reduce((previous, current) => {
        const item = previous;
        if (current.length > 1) {
          item[current[0]] = decodeURIComponent(current[1]);
        }

        return item;
      }, {});

    return values.returnUrl ? values.returnUrl : '/';
  }

  function onCreate() {
    Inertia.post(
      '/list',
      { title },
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
  }

  function handleChange(e) {
    const { value } = e.target;

    setTitle(value);
  }

  const handleClose = () => {
    Inertia.get(getReturnURL());
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
    <Dialog fullScreen={isMobile} open onClose={handleClose} TransitionComponent={Transition}>
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
      <DialogContent
        data-name="DialogContent"
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            flex: '1 0 auto',
            display: 'block',
          }}
        >
          <TextField
            placeholder="Enter the name of the list"
            label="List name"
            autoFocus
            fullWidth
            margin="dense"
            inputProps={{
              maxLength: 150,
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

AddPage.layout = (page) => <Layout children={page} cleanLayout />;

export default AddPage;
