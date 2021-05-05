import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import cookies from 'js-cookie';

const useButtonStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.common.white,
  },
}));

export const useCookieConcent = ({ ref }) => {
  const cookieName = '_tkcacceptance';
  const [acceptance, setAcceptance] = useState(cookies.get(cookieName));
  const buttonStyles = useButtonStyles();

  useEffect(() => {
    if (!acceptance) {
      const onAcceptance = (closeCallback) => {
        cookies.set(cookieName, 'accepted', {
          expires: 365,
          sameSite: 'strict',
          secure: window.location ? window.location.protocol === 'https:' : true,
        });
        setAcceptance(true);
        closeCallback();
      };

      ref.current.enqueueSnackbar(
        <span>
          This website uses cookies to provide you
          <br />
          the best user experience.{' '}
          <a href="/policies/cookies" target="_blank" style={{ color: 'white' }}>
            Know more...
          </a>
        </span>,
        {
          variant: 'info',
          persist: true,
          key: 'cookies',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
          action: (key) => (
            <Button
              classes={{ ...buttonStyles }}
              onClick={() => onAcceptance(() => ref.current.closeSnackbar(key))}
            >
              Accept all
            </Button>
          ),
        }
      );
    }
  }, []);

  return acceptance;
};

export default {};
