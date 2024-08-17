import React from "react";
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { InertiaProgress } from "@inertiajs/progress/src";

// Fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

InertiaProgress.init({
  delay: 250,
  color: "rgb(33, 150, 243)",
  includeCSS: true,
  showSpinner: true,
});

createInertiaApp({
  resolve: (name) => require(`./Pages/${name}`),
  page: window.__inertia_page__,
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
