import React from 'react';
import Button from '@material-ui/core/Button';
import { SnackbarProvider, useSnackbar } from 'notistack';
/*
function MyApp() {
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    enqueueSnackbar('I love snacks.');
  };

  const handleClickVariant = (variant) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar('This is a success message!', { variant });
  };

  return (
    <>
      <Button onClick={handleClick}>Show snackbar</Button>
      <Button onClick={handleClickVariant('success')}>Show success snackbar</Button>
    </>
  );
}
*/
const defaultMaxSnack = 3;

function NotistackProvider({ children, maxSnack = defaultMaxSnack }) {
  const { enqueueSnackbar } = useSnackbar();

  function notify(message, variant = 'default') {
    enqueueSnackbar(message, { variant });
  }

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { notify });
    }

    return child;
  });

  return <SnackbarProvider maxSnack={maxSnack}>{childrenWithProps}</SnackbarProvider>;
}

export default NotistackProvider;
