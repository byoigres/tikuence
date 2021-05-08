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
import MultiSelect from '../../components/MultiSelect';
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

const AddPage = ({ pageReferer }) => {
  const classes = useStyles();
  const {
    props: {
      isMobile,
      referer: initialReferer,
      errors,
      modal: { categories, languages },
    },
  } = usePage();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [referer] = useState(initialReferer);
  const listNameRef = useRef(null);

  function onCreate() {
    Inertia.post(
      '/list',
      {
        title,
        categories: selectedCategories,
        languages: selectedLanguages,
      },
      {
        preserveScroll: true,
        only: ['auth', 'flash', 'errors', 'isMobile', 'referer', 'modal', 'title'],
        headers: {
          'X-Page-Referer': pageReferer,
        },
        onStart() {
          setIsLoading(true);
        },
        onSuccess() {
          Inertia.reload();
        },
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
    <>
      <SEO title="Add new list" />
      <Dialog
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
        open={isOpen}
        onClose={handleClose}
        onExited={() => {
          Inertia.visit(
            referer || '/',
            referer
              ? {
                  preserveScroll: true,
                  preserveState: referer !== null,
                  only: ['auth', 'flash', 'errors', 'modal'],
                }
              : {}
          );
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
            <Typography variant="h6" component="h1" className={classes.title}>
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
            <Typography variant="body2">Choose a useful name for the list</Typography>
          </DialogContentText>
          <MultiSelect
            label="Categories"
            placeholder="Type a category name"
            error={errors.categories !== undefined}
            helperText={errors.categories}
            maxSelected={3}
            options={categories}
            labelPropertyName="description"
            onValueChage={(values) => {
              setSelectedCategories(values.map((x) => x.identifier));
            }}
          />
          <DialogContentText>
            <Typography variant="body2">
              Categories help us to organize the content in the site
            </Typography>
          </DialogContentText>
          <MultiSelect
            label="Languages"
            placeholder="Type a language name"
            error={errors.languages !== undefined}
            helperText={errors.languages}
            maxSelected={2}
            options={languages}
            labelPropertyName="name"
            onValueChage={(values) => {
              setSelectedLanguages(values.map((x) => x.code));
            }}
          />
          <DialogContentText>
            <Typography variant="body2">
              If the videos have subtitles in a different language than the one spoken, help us by
              selecting both languages.
            </Typography>
          </DialogContentText>
          <DialogContentText>
            <Typography variant="subtitle2">
              After creating the list you would be able to add videos to it.
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddPage;
