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
      {/* <List
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
                      : 'data:image/png;base64,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'
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
      </List> */}
    </>
  );
};

ProfilePage.layout = (page) => <Layout children={page} title="Profile" />;

export default ProfilePage;
