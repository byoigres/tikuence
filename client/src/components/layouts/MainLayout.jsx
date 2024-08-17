import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { usePage } from "@inertiajs/react";
import Navbar from "../Navbar";
import Navigation from "../Navbar/Navigation";

const MainLayout = ({ children }) => {
  const {
    props: {
      auth: { isAuthenticated, profile },
    },
  } = usePage();
  return (
    <>
      <CssBaseline />
      <Navigation>
        <Navbar isAuthenticated={isAuthenticated} profile={profile} />
      </Navigation>
      <h1>Hello from MainLayout component!</h1>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        return React.cloneElement(child);
      })}
    </>
  );
};

export default MainLayout;
