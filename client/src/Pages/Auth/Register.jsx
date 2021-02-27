import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import { usePage } from '@inertiajs/inertia-react';
import { Inertia } from '@inertiajs/inertia';
import Layout from '../../components/Layout';

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
  form: {
    '& .MuiFormControl-root, & .MuiButton-root': {
      marginTop: '1rem',
    },
    marginBottom: '1rem',
  },
}));

const Register = () => {
  const {
    props: { email, name, token, isExpired = false, isInvalid = false, isMobile, auth, errors },
  } = usePage();
  const classes = useStyles({ isMobile });
  const nameRef = useRef(null);
  const usernameRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState({
    name,
    username: '',
    terms: false,
    token,
  });

  function handleChange(e) {
    const key = e.target.name;
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

    setValues((v) => ({
      ...v,
      [key]: value,
    }));
  }

  const register = () => {
    Inertia.post('/auth/register', values, {
      onStart() {
        setIsLoading(true);
      },
      onError(err) {
        if (err.name && nameRef.current) {
          nameRef.current.focus();
        } else if (err.username && usernameRef.current) {
          usernameRef.current.focus();
        }
      },
      onFinish() {
        setIsLoading(false);
      },
    });
  };

  return (
    <Container maxWidth="sm" disableGutters={isMobile}>
      <Paper elevation={0} className={classes.container}>
        {!auth.isAuthenticated && isExpired && (
          <Typography variant="h4">This link has expired</Typography>
        )}
        {!auth.isAuthenticated && isInvalid && (
          <Typography variant="h4">This link is invalid</Typography>
        )}
        {auth.isAuthenticated && (
          <Typography variant="h6">{`You are currently login as ${auth.credentials.email}`}</Typography>
        )}
        {!auth.isAuthenticated && !isExpired && !isInvalid && (
          <>
            <Typography variant="h4" color="primary" gutterBottom>
              Complete your profile
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              You are setting your account using your Google account.
            </Typography>
            <form className={classes.form} autoComplete="off" autoCorrect="off">
              <TextField
                name="email"
                label="Email"
                value={email}
                fullWidth
                disabled
                variant="outlined"
              />
              <TextField
                name="name"
                label="Name"
                value={values.name}
                error={errors.name !== undefined}
                helperText={errors.name}
                autoComplete="off"
                disabled={isLoading}
                onChange={handleChange}
                inputProps={{ maxLength: 50, autoComplete: 'off', ref: nameRef }}
                fullWidth
                autoFocus
                variant="outlined"
              />
              <TextField
                name="username"
                label="Username"
                value={values.username}
                error={errors.username !== undefined}
                helperText={errors.username}
                autoComplete="off"
                disabled={isLoading}
                onChange={handleChange}
                inputProps={{ maxLength: 24, autoComplete: 'off', ref: usernameRef }}
                fullWidth
                variant="outlined"
              />
              <FormControl required error component="fieldset" className={classes.formControl}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="terms"
                        checked={values.terms}
                        value={values.terms}
                        disabled={isLoading}
                        onChange={handleChange}
                        color="primary"
                      />
                    }
                    label={
                      <>
                        {`Accept the `}
                        <Link href="/legal/terms" target="_blank">
                          terms of service
                        </Link>
                        {` and `}
                        <Link href="/legal/privacy" target="_blank">
                          privacy policy
                        </Link>
                        .
                      </>
                    }
                  />
                </FormGroup>
                {errors.terms && <FormHelperText>{errors.terms}</FormHelperText>}
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                disabled={!values.terms || isLoading}
                onClick={register}
                fullWidth
              >
                Complete profile
              </Button>
            </form>
            <Link href="/">Back to the main page</Link>
          </>
        )}
      </Paper>
    </Container>
  );
};

Register.layout = (page) => <Layout children={page} />;

export default Register;
