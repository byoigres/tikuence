import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { SnackbarProvider as NativeSnackbarProvider } from 'notistack';

const SnackBarProvider = ({ children, flash }) => {
  const notistackRef = React.createRef();

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
        <Button onClick={() => notistackRef.current.closeSnackbar(key)}>Dismiss</Button>
      )}
    >
      {children}
    </NativeSnackbarProvider>
  );
};

export default SnackBarProvider;
