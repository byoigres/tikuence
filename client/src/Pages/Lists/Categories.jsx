import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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

const EditCategoriesPage = () => {
  const classes = useStyles();
  const {
    props: {
      referer,
      isMobile,
      errors,
      modal: { listId, categories, selected },
    },
  } = usePage();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(selected);

  function onCreate() {
    Inertia.post(
      `/list/${listId}/categories`,
      {
        categories: selectedCategories,
      },
      {
        preserveScroll: true,
        only: ['auth', 'flash', 'errors', 'isMobile', 'referer', 'modal', 'categories'],
        onStart() {
          setIsLoading(true);
        },
        onFinish() {
          setIsLoading(false);
        },
      }
    );
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    e.stopPropagation();

    onCreate();
  };

  return (
    <>
      <SEO title="Change categories" />
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
              Change categories
            </Typography>
            <Button autoFocus color="inherit" onClick={handleCreate} disabled={isLoading}>
              Update
            </Button>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <MultiSelect
            label="Categories"
            placeholder="Type a category name"
            error={errors.categories !== undefined}
            helperText={errors.categories}
            maxSelected={3}
            options={categories}
            defaultValue={selected}
            keyPropertyName="identifier"
            labelPropertyName="description"
            onValueChage={(values) => {
              setSelectedCategories(values.map((x) => x.identifier));
            }}
          />
          <DialogContentText>
            <Typography component="span" variant="body2">
              Choose a list of categories for the list
            </Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditCategoriesPage;
