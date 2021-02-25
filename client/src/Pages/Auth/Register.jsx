import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import { usePage } from '@inertiajs/inertia-react';
import Layout from '../../components/Layout';

const useStyles = makeStyles(() => ({
  appBar: {
    position: 'relative',
  },
  content: {
    height: '100vh',
  },
}));

/* eslint react/jsx-props-no-spreading: 0 */
const Transition = React.forwardRef((props, ref) => (
  <Slide direction="left" ref={ref} {...props} />
));

const Register = () => {
  const classes = useStyles();
  const {
    props: { email, isExpired = false, isInvalid = false, isMobile, auth },
  } = usePage();
  const [areTermsAccepted, setAreTermsAccepted] = useState(false);

  return (
    <>
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
        <Dialog
          fullScreen={isMobile}
          maxWidth="sm"
          fullWidth
          open
          disableBackdropClick
          hideBackdrop
          TransitionComponent={Transition}
        >
          <DialogContent className={classes.content}>
            <Paper
              elevation={0}
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Typography variant="h4">Complete the registration</Typography>
              <TextField fullWidth label="Email" disabled value={email} />
              <TextField fullWidth label="Name" inputProps={{ maxLength: 50 }} autoFocus />
              <TextField fullWidth label="Username" inputProps={{ maxLength: 24 }} />
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={areTermsAccepted}
                      onChange={() => {
                        setAreTermsAccepted(!areTermsAccepted);
                      }}
                      name="checkedB"
                      color="primary"
                    />
                  }
                  label="Accept the terms of services and privacy policy"
                />
              </FormGroup>
              <Button variant="contained" color="primary" disabled={!areTermsAccepted}>
                Create account
              </Button>
              <Link href="/">Back to the main page</Link>
            </Paper>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

Register.layout = (page) => <Layout children={page} cleanLayout />;

export default Register;
