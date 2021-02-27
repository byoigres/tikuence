import React from 'react';
import { Inertia } from '@inertiajs/inertia';
import { usePage } from '@inertiajs/inertia-react';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  listItemAvatar: {
    minWidth: 72,
  },
  avatar: {
    width: theme.spacing(16),
    height: theme.spacing(16),
    fontSize: '5rem',
  },
  buttons: {
    marginLeft: '1rem',
  },
  dialog: {
    padding: 0,
    top: 0,
    left: 0,
    height: '100%',
    // -- width: '100%',
  },
  content: {
    height: '100vh',
  },
}));

const ProfilePage = ({ user /* , lists = [] */ }) => {
  const {
    props: { isMobile },
  } = usePage();
  const classes = useStyles();

  return (
    <Container maxWidth="md" disableGutters={isMobile}>
      <Paper elevation={1}>
        <Grid
          container
          alignContent="center"
          alignItems="center"
          // style={{ outline: '1px solid green' }}
        >
          <Grid
            container
            alignContent="center"
            direction="column"
            item
            xs={12}
            sm={12}
            md={3}
            lg={3}
            xl={3}
            // style={{ outline: '1px solid blue', textAlign: 'center' }}
          >
            <Avatar className={classes.avatar}>B</Avatar>
          </Grid>
          <Grid
            // container
            // alignContent="flex-start"
            // justify="center"
            // alignItems="center"
            // direction="column"
            item
            xs={12}
            sm={12}
            md={9}
            lg={9}
            xl={9}
            // style={{ outline: '1px solid red' }}
          >
            <Typography variant="h4" color="textPrimary" className={classes.email}>
              {user.name}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              @{user.username}
            </Typography>
            <Typography variant="body1" color="initial">
              Coder, cofee drinker, pet lover, #zelda FTW Smiling face
            </Typography>
          </Grid>
        </Grid>
        <div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              Inertia.visit(`/users/${user.username}/lists`);
            }}
          >
            View my lists
          </Button>
        </div>
      </Paper>
    </Container>
  );
};

ProfilePage.layout = (page) => <Layout children={page} />;

export default ProfilePage;
