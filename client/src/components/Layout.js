import React, { Fragment } from 'react'
import styled from 'styled-components'
import { ModalProvider } from 'styled-react-modal'
import NavBar from './NavBar'
import {
  createMuiTheme,
  makeStyles,
  ThemeProvider
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import blueGrey from '@material-ui/core/colors/blueGrey';
import blue from '@material-ui/core/colors/blue';

const useStyles = makeStyles({
  container: p => ({
      marginTop: "4rem",
      marginLeft: p.fullLayout ? 0 : "1rem",
      marginRight: p.fullLayout ? 0 : "1rem",
    }),
})

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: blueGrey,
  },
  typography: {
    // fontFamily: `"Source Sans Pro", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 600
  }
});

const Layout = ({ children, title = "Tikuence", fullLayout = false }) => {
  const classes = useStyles({ fullLayout });
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.container}>
        {children}
      </div>
      <NavBar />
    </ThemeProvider>
  );
}

export default Layout
