import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';

const useStyles = makeStyles(() => ({
  email: {
    margin: '1rem',
    textAlign: 'center',
  },
}));

const ProfilePage = ({ user }) => {
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
    </>
  );
};

ProfilePage.layout = (page) => <Layout children={page} title="Profile" flash={page.props.flash} />;

export default ProfilePage;
