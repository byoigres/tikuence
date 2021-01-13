import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Layout from '../../components/Layout';
import ConfirmDialog from '../../components/ConfirmDialog';

const useStyles = makeStyles(() => ({
  card: {
    marginBottom: '1rem',
  },
  actionArea: {},
  cover: {},
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
}));

/* eslint react/jsx-props-no-spreading: 0 */
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const List = ({ lists }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentItemToDelete, setCurrentItemToDelete] = useState(null);

  function onDeleteDialogClose() {
    setIsDeleteDialogOpen(false);
  }

  function onDeleteButtonClick(id) {
    setIsDeleteDialogOpen(true);
    setCurrentItemToDelete(id);
  }

  function onDelete() {
    Inertia.delete(`/list/${currentItemToDelete}`, {
      onStart() {
        setIsLoading(true);
      },
      onSuccess() {},
      onFinish() {
        setIsLoading(false);
        setIsDeleteDialogOpen(false);
        setCurrentItemToDelete(null);
      },
    });
  }

  const handleListDialogClose = () => {
    Inertia.visit('/profile');
  };

  const animationProp = {};

  if (!window.location.search.includes('an=0')) {
    animationProp.TransitionComponent = Transition;
  }

  return (
    <Dialog fullScreen open onClose={handleListDialogClose} {...animationProp}>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleListDialogClose}
            aria-label="close"
            disabled={isLoading}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            My lists
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <DialogContentText>
          After creating the list you would be able to add videos to it.
        </DialogContentText>
        {lists.length === 0 && (
          <Typography variant="h5" color="textPrimary">
            You don&apos;t have any list yet
          </Typography>
        )}
        {lists.map((list) => (
          <Card className={classes.card} key={list.id}>
            <CardActionArea className={classes.actionArea}>
              <CardMedia
                className={classes.cover}
                component="img"
                alt={list.title}
                height="150"
                image={
                  list.videos.length > 0
                    ? `/images/${list.videos[0].thumbnail_name}`
                    : 'https://p16-sign-sg.tiktokcdn.com/obj/tos-maliva-p-0068/cf1952143b1d41038bf8c71d50fd6f14?x-expires=1610067600&x-signature=HpeDgZ%2FwQUr9TfxSagf7AxWB7RA%3D'
                }
                title={list.title}
              />
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography component="h5" variant="h5">
                    {list.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textPrimary">
                    {list.videos.length} videos
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    List by {list.user.email}
                  </Typography>
                </CardContent>
              </div>
            </CardActionArea>
            <CardActions>
              <Tooltip title="Delete">
                <IconButton
                  aria-label="delete"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    onDeleteButtonClick(list.id);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  aria-label="edit"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.preventDefault();
                    Inertia.visit(`/list/${list.id}/edit`);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </CardActions>
          </Card>
        ))}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onDialogClose={onDeleteDialogClose}
          actionHandler={onDelete}
          title="Confirm"
          description="Are you sure to delete this?"
          actionText="Delete"
          cancelText="Cancel"
        />
      </DialogContent>
    </Dialog>
  );
};

List.layout = (page) => <Layout children={page} cleanLayout flash={page.props.flash} />;

export default List;
