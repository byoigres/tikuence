import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pre: {
    whiteSpace: 'pre-line',
  },
}));

const Page500 = ({ message, stack }) => {
  const classes = useStyles({});
  return (
    <Container className={classes.container}>
      <Grid container justify="center">
        <Grid item>
          <Typography variant="h1" color="error">
            500
          </Typography>
          <Typography variant="h4" color="primary" gutterBottom>
            Something wrong happened, try again in a couple of minutes
          </Typography>
          <Typography variant="h6" color="textPrimary" gutterBottom>
            {message}
          </Typography>
          <Typography variant="caption" color="secondary" gutterBottom>
            <pre className={classes.pre}>
              <code>{stack}</code>
            </pre>
          </Typography>
          <Typography variant="body1">
            <InertiaLink href="/">Go to home, you are drunk</InertiaLink>
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Page500;
