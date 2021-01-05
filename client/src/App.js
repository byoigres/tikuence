import React from 'react';
import { render } from "react-dom";
import { App } from "@inertiajs/inertia-react";
// import { InertiaProgress } from "@inertiajs/progress";
import { InertiaProgress } from "@inertiajs/progress/src";

const el = document.getElementById("app");

InertiaProgress.init();

render(
  <App
    initialPage={JSON.parse(decodeURIComponent(unescape(window.__page__)))}
    resolveComponent={(name) =>
      import(
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        `./Pages/${name}`
      ).then((module) => module.default)
    }
  />,
  el
);