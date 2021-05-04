import React, { useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

function BackDrop({ onLoadingChange }) {
  const [isBackdropOpen, setIsBackdropOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  let backdropTimer = null;

  useEffect(() => {
    onLoadingChange(isLoading);
  }, [isLoading]);

  useEffect(() => {
    const onInertiaStart = Inertia.on('start', () => {
      setIsLoading(true);
      backdropTimer = setTimeout(() => {
        setIsBackdropOpen(() => true);
      }, 2000);
    });

    const onInertiaFinish = Inertia.on('finish', () => {
      setIsBackdropOpen(false);
      setIsLoading(false);

      if (backdropTimer) {
        clearTimeout(backdropTimer);
      }
    });

    return () => {
      onInertiaStart();
      onInertiaFinish();
    };
  }, []);

  return (
    <Backdrop open={isBackdropOpen} style={{ zIndex: 1500 }}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
}

export default BackDrop;
