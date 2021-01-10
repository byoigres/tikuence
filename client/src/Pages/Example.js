import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';

const Example = ({ username }) => (
  <>
    <h1>{`Hello from ${username}`}</h1>
    <InertiaLink href="/inertia/test">Go to Test page</InertiaLink>
  </>
);

export default Example;
