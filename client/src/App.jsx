import React from 'react';
import { render } from 'react-dom';
import { App } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress/src';

const el = document.getElementById('app');

InertiaProgress.init();

render(
  <App
    /* eslint no-underscore-dangle: 0 */
    initialPage={JSON.parse(decodeURIComponent(unescape(window.__page__)))}
    resolveComponent={(name) =>
      import(
        /* webpackMode: "lazy" */
        /* webpackPrefetch: true */
        /* webpackPreload: true */
        `./Pages/${name}.jsx`
      ).then((module) => module.default)
    }
  />,
  el
);
