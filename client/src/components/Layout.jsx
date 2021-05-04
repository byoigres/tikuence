import React from 'react';
import { usePage } from '@inertiajs/inertia-react';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import DrawerMenu from './DrawerMenu';
import NavBar from './NavBar';
import BackDrop from './BackDrop';
import SnackbarProvider from './SnackbarProvider';
import themeConfig from '../theme';

const mainTheme = createMuiTheme(themeConfig);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(7),
      paddingBottom: theme.spacing(0),
      paddingLeft: theme.spacing(0),
      paddingRight: theme.spacing(0),
    },
    padding: theme.spacing(3),
  },
}));

const useCssBaselineStyles = makeStyles((theme) => ({
  '@global': {
    html: {
      WebkitFontSmoothing: 'auto',
      fontFamily: "'Roboto', sans-serif",
      scrollBehavior: 'smooth',
    },
    a: {
      color: theme.palette.text.primary,
      textDecoration: 'none',
    },
  },
}));

const Layout = ({ children }) => {
  const {
    props: {
      auth: { isAuthenticated, credentials },
      flash,
    },
  } = usePage();
  const classes = useStyles();
  const cssBaselineStyles = useCssBaselineStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={mainTheme}>
      <CssBaseline classes={cssBaselineStyles} />
      <SnackbarProvider flash={flash}>
        <div className={classes.root}>
          <NavBar
            isAuthenticated={isAuthenticated}
            credentials={credentials}
            handleDrawerToggle={handleDrawerToggle}
          />
          <DrawerMenu
            isAuthenticated={isAuthenticated}
            credentials={credentials}
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
          />
          <Container maxWidth="lg" disableGutters component="main" className={classes.content}>
            {React.Children.map(children, (child) => {
              if (!React.isValidElement(child)) {
                return null;
              }

              return React.cloneElement(child, {
                isLoading,
              });
            })}
          </Container>
        </div>
      </SnackbarProvider>
      <BackDrop
        onLoadingChange={(loading) => {
          setIsLoading(loading);
        }}
      />
    </ThemeProvider>
  );
};

export default Layout;
