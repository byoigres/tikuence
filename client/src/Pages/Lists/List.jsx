import React, { Fragment } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';

const useStyles = makeStyles((theme) => ({
  list: {
    backgroundColor: '#fff',
  },
  card: {
    marginBottom: '1rem',
  },
  actionArea: {
    // display: "flex",
    // justifyContent: "flex-start"
  },
  cover: {
    // width: 100
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  listItemAvatar: {
    minWidth: 72,
  },
  avatar: {
    width: theme.spacing(7),
    height: '100%',
  },
}));

const PageList = (props) => {
  const { lists } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  return (
    <>
      <List
        dense={false}
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Lists
          </ListSubheader>
        }
        className={classes.list}
      >
        {lists.map((item) => (
          <Fragment key={item.id}>
            <ListItem
              key={item.id}
              button
              onClick={(e) => {
                e.preventDefault();
                Inertia.visit(`/list/${item.id}`);
              }}
            >
              <ListItemAvatar className={classes.listItemAvatar}>
                <Avatar
                  alt={item.title}
                  className={classes.avatar}
                  variant="square"
                  src={`/images/${item.videos[0].thumbnail_name}`}
                />
              </ListItemAvatar>
              <ListItemText
                id={item.id}
                primary={item.title}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      className={classes.inline}
                      color="textPrimary"
                    >
                      4 videos
                    </Typography>
                    {`List by ${item.user.email}`}
                  </>
                }
              />
            </ListItem>
            <Divider variant="fullWidth" component="li" />
          </Fragment>
        ))}
        <button
          onClick={() => {
            enqueueSnackbar('Messsssagggee', {
              variant: 'info',
            });
          }}
          type="button"
        >
          Noty
        </button>
      </List>
    </>
  );
};

PageList.layout = (page) => <Layout children={page} title="Lists" flash={page.props.flash} />;

export default PageList;
