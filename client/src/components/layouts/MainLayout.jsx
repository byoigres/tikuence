import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { usePage } from '@inertiajs/react';
import Navbar from "@tikuence/components/Navbar";

const MainLayout = ({ children }) => {
  const {
    props: {
      auth: { isAuthenticated, profile },
    },
  } = usePage();
  return (
    <>
      <CssBaseline />
      <Navbar
        isAuthenticated={isAuthenticated}
        profile={profile}
      />
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
