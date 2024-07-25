import React from 'react';
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { InertiaProgress } from '@inertiajs/progress/src';

const el = document.getElementById('app');

InertiaProgress.init({
  delay: 250,
  color: 'rgb(33, 150, 243)',
  includeCSS: true,
  showSpinner: true,
});

createInertiaApp({
  resolve: name => require(`./Pages/${name}`),
  page: window.__inertia_page__,
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />)
  },
});
