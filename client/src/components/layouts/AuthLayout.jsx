import React from "react";
import CssBaseline from "@mui/material/CssBaseline";

const AuthLayout = ({ children }) => (
  <>
    <CssBaseline />
    <h1>Hello from AuthLayout component!</h1>
    {React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) {
        return null;
      }

      return React.cloneElement(child);
    })}
  </>
);

export default AuthLayout;
