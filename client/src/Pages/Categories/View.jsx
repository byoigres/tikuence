import React from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Layout from '../../components/Layout';
import ThumbnailInfiniteList from '../../components/ThumbnailInfiniteList';

const usePaperStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    // minHeight: calc(vieport height - (paper padding * 2) - (main padding))
    minHeight: `calc(100vh - ${theme.spacing(2 * 2)}px - ${theme.spacing(3)}px)`,
  },
}));

const ViewCategoriesPage = () => {
  const paperClasses = usePaperStyles();
  const {
    props: { lists },
  } = usePage();

  return (
    <Paper elevation={1} classes={{ ...paperClasses }}>
      <Grid item xs={12} md={12}>
        <ThumbnailInfiniteList
          referer="profile"
          isLoading={false}
          lists={lists}
          isTheEnd={false}
          endOfListText="You reached the end"
          noItemsText="No lists"
          modal={{}}
        />
      </Grid>
    </Paper>
  );
};

ViewCategoriesPage.layout = (page) => <Layout children={page} />;

export default ViewCategoriesPage;
