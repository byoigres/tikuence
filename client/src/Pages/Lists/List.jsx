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
import { makeStyles } from '@material-ui/core/styles';
import SEO from '../../components/SEO';
import Layout from '../../components/Layout';
import Details from './Details';

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

const PageList = ({ lists = [], list }) => {
  const classes = useStyles();

  return (
    <>
      <SEO description="List of TikTok videos" title="Tikuence" />
      <List
        dense={false}
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Lists
          </ListSubheader>
        }
        className={classes.list}
      >
        {lists &&
          lists.map((item) => (
            <Fragment key={item.id}>
              <ListItem
                key={item.id}
                button
                onClick={(e) => {
                  e.preventDefault();
                  Inertia.visit(`/list/${item.id}`, {
                    preserveScroll: true,
                    only: ['list'],
                  });
                }}
              >
                <ListItemAvatar className={classes.listItemAvatar}>
                  <Avatar
                    alt={item.title}
                    className={classes.avatar}
                    variant="square"
                    src={`/images/sm-${item.videos[0].thumbnail_name}`}
                  />
                </ListItemAvatar>
                <ListItemText
                  id={item.id}
                  primary={
                    <Typography component="strong" variant="h6" color="textPrimary">
                      {item.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        component="strong"
                        variant="subtitle2"
                        color="textPrimary"
                        style={{ display: 'block' }}
                      >
                        {`${item.videos.length} videos`}
                      </Typography>
                      <Typography component="span" variant="subtitle1" color="textPrimary">
                        {`List by ${item.user.email}`}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider variant="fullWidth" component="li" />
            </Fragment>
          ))}
      </List>
      {list && <Details list={list} />}
    </>
  );
};

PageList.layout = (page) => <Layout children={page} title="Tikuence" />;

export default PageList;
