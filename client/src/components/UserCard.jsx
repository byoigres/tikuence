import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { InertiaLink } from '@inertiajs/inertia-react';
import Typography from '@material-ui/core/Typography';
import UserAvatar from './UserAvatar';

const useStyles = makeStyles((theme) => ({
  container: ({ isTransparent }) => ({
    display: 'flex',
    justifyContent: isTransparent ? 'flex-start' : 'center',
    alignItems: 'center',
    flexDirection: 'row',
  }),
  pictureWrapper: {},
  detailsWrapper: {
    marginLeft: theme.spacing(1),
  },
  nameWrapper: ({ isTransparent }) => ({
    '&:hover': {
      textDecoration: isTransparent ? 'underline' : 'none',
    },
  }),
  usernameWrapper: ({ isTransparent }) => ({
    '&:hover': {
      textDecoration: isTransparent ? 'underline' : 'none',
    },
  }),
  linkWrapper: ({ isTransparent, round }) => ({
    display: isTransparent ? 'inline' : 'flex',
    justifyContent: isTransparent ? 'flex-start' : 'center',
    '&:hover': {
      backgroundColor: isTransparent ? 'transparent' : theme.palette.grey[100],
      textDecoration: isTransparent ? 'underline' : 'none',
    },
    padding: theme.spacing(1),
    color: theme.palette.text.primary,
    borderRadius: round ? theme.spacing(1.2) : 0,
  }),
  name: {
    fontWeight: 600,
  },
}));

const UserCard = ({
  variant = 'transparent',
  round = false,
  nameText,
  usernameText,
  pictureUrl,
  onClick = null,
}) => {
  const isTransparent = variant === 'transparent';
  const classes = useStyles({
    isTransparent,
    round,
  });

  const CardLink = ({ children, className }) => (
    <InertiaLink href={`/users/${usernameText}`} className={className} onClick={onClick}>
      {children}
    </InertiaLink>
  );

  let picture = <UserAvatar image={pictureUrl} letter={usernameText[0]} />;

  if (isTransparent) {
    picture = (
      <CardLink>
        <UserAvatar image={pictureUrl} letter={usernameText[0]} />
      </CardLink>
    );
  }

  let name = <Typography className={classes.name}>{nameText}</Typography>;

  if (isTransparent) {
    name = (
      <Typography className={classes.name}>
        <CardLink>{nameText}</CardLink>
      </Typography>
    );
  }

  let username = <Typography>@{usernameText}</Typography>;

  if (isTransparent) {
    username = (
      <Typography>
        <CardLink>@{usernameText}</CardLink>
      </Typography>
    );
  }

  const content = (
    <div className={classes.container} data-name="container">
      <div className={classes.pictureWrapper} data-name="avatar">
        {picture}
      </div>
      <div className={classes.detailsWrapper} data-name="user-container">
        <div className={classes.nameWrapper}>{name}</div>
        <div className={classes.usernameWrapper}>{username}</div>
      </div>
    </div>
  );

  if (isTransparent) {
    return content;
  }

  return <CardLink className={classes.linkWrapper}>{content}</CardLink>;
};

export default UserCard;
