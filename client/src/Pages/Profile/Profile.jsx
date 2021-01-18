import React, { Fragment } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';

const useStyles = makeStyles((theme) => ({
  email: {
    margin: '1rem',
    textAlign: 'center',
  },
  listItemAvatar: {
    minWidth: 72,
  },
  avatar: {
    width: theme.spacing(7),
    height: '100%',
  },
}));

const ProfilePage = ({ user, lists = [] }) => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h5" color="textPrimary" className={classes.email}>
        {user.email}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={() => {
          Inertia.visit('/profile/lists');
        }}
      >
        View my lists
      </Button>
      <List
        dense
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            My Lists
          </ListSubheader>
        }
        className={classes.list}
      >
        {lists.map((item) => (
          <Fragment key={item.id}>
            <ListItem
              key={item.id}
              button
              onClick={(e) => {
                e.preventDefault();
                Inertia.visit(`/list/${item.id}`, {
                  preserveScroll: false,
                });
              }}
            >
              <ListItemAvatar className={classes.listItemAvatar}>
                <Avatar
                  alt={item.title}
                  className={classes.avatar}
                  variant="square"
                  src={
                    item.videos.length > 0
                      ? `/images/${item.videos[0].thumbnail_name}`
                      : 'data:image/svg+xml;base64,PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgc3Ryb2tlPSJibHVlIiBmaWxsPSJwdXJwbGUiIGZpbGwtb3BhY2l0eT0iMC41IiBzdHJva2Utb3BhY2l0eT0iMC44Ii8+'
                  }
                />
              </ListItemAvatar>
              <ListItemText
                id={item.id}
                primary={
                  <Typography component="strong" variant="h6" color="textPrimary">
                    {item.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography
                      component="strong"
                      variant="subtitle2"
                      color="textPrimary"
                      style={{ display: 'block' }}
                    >
                      {`${item.videos.length} videos`}
                    </Typography>
                    <Typography component="span" variant="subtitle1" color="textPrimary">
                      {`List by ${item.user.email}`}
                    </Typography>
                  </>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="Remove">
                  <IconButton edge="end" aria-label="remove">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="fullWidth" component="li" />
          </Fragment>
        ))}
      </List>
    </>
  );
};

ProfilePage.layout = (page) => <Layout children={page} title="Profile" />;

export default ProfilePage;
