import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import { InertiaLink } from '@inertiajs/inertia-react';
import Layout from '../../components/Layout';
import SEO from '../../components/SEO';

const useStyles = makeStyles(() => ({
  container: ({ isMobile }) => ({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: '2rem',
    paddingBottom: '2rem',
    paddingLeft: isMobile ? '1rem' : '3rem',
    paddingRight: isMobile ? '1rem' : '3rem',
  }),
  buttons: {
    width: '100%',
    marginTop: '1rem',
    marginBottom: '1rem',
  },
}));

const Login = ({ isLogin, isMobile }) => {
  const classes = useStyles({ isMobile });

  return (
    <>
      <SEO title={isLogin ? 'Login' : 'Sign Up'} />
      <Container maxWidth="sm" disableGutters={isMobile}>
        <Paper elevation={0} className={classes.container}>
          <Typography variant="h4" color="primary" gutterBottom>
            {`${isLogin ? 'Welcome back 😄' : 'Hello user 👋'}`}
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
            {isLogin
              ? 'Log in to continue using all the features of your account.'
              : `You can create an account using one of the following social providers.`}
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              startIcon={<GTranslateIcon />}
              style={{ backgroundColor: '#E04A32', color: 'white' }}
              href="/auth/google"
            >
              {isLogin ? 'Continue' : 'Sign up'} with Google
            </Button>
          </div>
          {!isLogin && (
            <Typography variant="body2">
              {`By singing up you accept the `}
              <Link href="/legal/terms" target="_blank">
                terms of service
              </Link>
              {` and `}
              <Link href="/legal/privacy" target="_blank">
                privacy policy
              </Link>
              .
            </Typography>
          )}
          <Divider flexItem style={{ height: 1, marginTop: '1rem', marginBottom: '1rem' }} />
          <Typography>
            {`${isLogin ? `Don't` : 'Already'} have an account? `}
            <InertiaLink href={`/auth/${isLogin ? 'register' : 'login'}`}>
              {isLogin ? 'Sing Up' : 'Login'}
            </InertiaLink>
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

Login.layout = (page) => <Layout children={page} title="Tikuence" />;

export default Login;
