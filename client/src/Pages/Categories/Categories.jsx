import React from 'react';
import { InertiaLink, usePage } from '@inertiajs/inertia-react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Layout from '../../components/Layout';

const usePaperStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    // minHeight: calc(vieport height - (paper padding * 2) - (main padding))
    minHeight: `calc(100vh - ${theme.spacing(2 * 2)}px - ${theme.spacing(3)}px)`,
  },
}));

const CategoriesPage = () => {
  const paperClasses = usePaperStyles();
  const {
    props: { categories },
  } = usePage();
  const theme = useTheme();

  return (
    <Paper elevation={1} classes={{ ...paperClasses }}>
      <Grid
        container
        justify="center"
        alignContent="center"
        alignItems="center"
        spacing={1}
        style={{ width: '100%' }}
      >
        {categories.map((category) => (
          <Grid
            key={category.id}
            item
            xs={6}
            sm={6}
            md={4}
            lg={12}
            xl={12}
            style={{
              minHeight: theme.spacing(12),
            }}
          >
            <Chip
              component={InertiaLink}
              style={{ display: 'flex' }}
              href={`/categories/${category.identifier}`}
              label={category.description}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

CategoriesPage.layout = (page) => <Layout children={page} />;

export default CategoriesPage;
