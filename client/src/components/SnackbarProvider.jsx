import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { SnackbarProvider as NativeSnackbarProvider } from 'notistack';
import { useCookieConcent } from './useCookieConcent';

const useButtonStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.common.white,
  },
}));

const SnackBarProvider = ({ children, flash }) => {
  const notistackRef = React.createRef();
  const buttonStyles = useButtonStyles();
  useCookieConcent({ ref: notistackRef });

  useEffect(() => {
    if (flash) {
      let message = null;
      let variant = null;

      if (flash.success) {
        message = flash.success;
        variant = 'success';
      } else if (flash.info) {
        message = flash.info;
        variant = 'info';
      } else if (flash.warning) {
        message = flash.warning;
        variant = 'warning';
      } else if (flash.error) {
        message = flash.error;
        variant = 'error';
      }

      if (message) {
        notistackRef.current.enqueueSnackbar(message, {
          variant,
        });
      }
    }
  }, [flash]);

  return (
    <NativeSnackbarProvider
      ref={notistackRef}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      action={(key) => (
        <Button
          classes={{ ...buttonStyles }}
          onClick={() => notistackRef.current.closeSnackbar(key)}
        >
          Dismiss
        </Button>
      )}
    >
      {children}
    </NativeSnackbarProvider>
  );
};

export default SnackBarProvider;
