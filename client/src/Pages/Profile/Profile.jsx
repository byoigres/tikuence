import React, { Fragment } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Button from '@material-ui/core/Button';
// import Divider from '@material-ui/core/Divider';
// import Avatar from '@material-ui/core/Avatar';
// import List from '@material-ui/core/List';
// import ListSubheader from '@material-ui/core/ListSubheader';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemText from '@material-ui/core/ListItemText';
// import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
// import Tooltip from '@material-ui/core/Tooltip';
// import IconButton from '@material-ui/core/IconButton';
// import DeleteIcon from '@material-ui/icons/Delete';
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
  buttons: {
    marginLeft: '1rem',
  },
}));

const ProfilePage = ({ user /* , lists = [] */ }) => {
  const classes = useStyles();
  return (
    <>
      <Typography variant="h5" color="textPrimary" className={classes.email}>
        {user.email}
      </Typography>
      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            Inertia.visit('/profile/lists');
          }}
        >
          View my lists
        </Button>
        <Button
          className={classes.buttons}
          variant="contained"
          color="primary"
          onClick={() => {
            Inertia.get('/logout');
          }}
        >
          Logout
        </Button>
      </div>
    </>
  );
};

ProfilePage.layout = (page) => <Layout children={page} title="Profile" />;

export default ProfilePage;
