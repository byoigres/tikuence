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
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { usePage } from '@inertiajs/inertia-react';
import Layout from '../../components/Layout';
import ConfirmDialog from '../../components/ConfirmDialog';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
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
    paddingTop: 5,
    paddingBottom: '5px!important',
  },
  listItemAvatar: {
    minWidth: 72,
  },
  avatar: {
    width: theme.spacing(7),
    height: '100%',
  },
  cardActions: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

/* eslint react/jsx-props-no-spreading: 0 */
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const PageProfileList = ({ lists }) => {
  const classes = useStyles();
  const {
    props: { isMobile, referal },
  } = usePage();
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
    Inertia.visit(referal || '/profile');
  };

  const animationProp = {};

  if (!window.location.search.includes('an=0')) {
    animationProp.TransitionComponent = Transition;
  }

  return (
    <Dialog fullScreen={isMobile} open onClose={handleListDialogClose} {...animationProp}>
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
        {lists.length === 0 && (
          <Typography variant="h5" color="textPrimary">
            You don&apos;t have any list yet
          </Typography>
        )}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {lists.map((list) => (
            <Card
              className={classes.card}
              key={list.id}
              style={{ flex: '1 45%', margin: '0.3rem' }}
            >
              <CardActionArea
                className={classes.actionArea}
                onClick={() => {
                  Inertia.visit(`/list/${list.id}`, {
                    preserveScroll: false,
                  });
                }}
              >
                <CardMedia
                  className={classes.cover}
                  component="img"
                  alt={list.title}
                  height="150"
                  image={
                    list.videos.length > 0
                      ? `/images/${list.videos[0].thumbnail_name}`
                      : 'data:image/svg+xml;base64,PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgc3Ryb2tlPSJibHVlIiBmaWxsPSJwdXJwbGUiIGZpbGwtb3BhY2l0eT0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC44Ii8+'
                  }
                  title={list.title}
                />
                <div className={classes.details} data-name="div-details">
                  <CardContent className={classes.content}>
                    <Typography variant="subtitle1">{list.title}</Typography>
                    <Typography variant="subtitle2">{list.videos.length} videos</Typography>
                  </CardContent>
                </div>
              </CardActionArea>
              <CardActions className={classes.cardActions}>
                <Tooltip title="Delete">
                  <IconButton
                    aria-label="delete"
                    size="small"
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
        </div>
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

PageProfileList.layout = (page) => <Layout children={page} cleanLayout />;

export default PageProfileList;
