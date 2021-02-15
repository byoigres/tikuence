import React from 'react';
import { InertiaLink } from '@inertiajs/inertia-react';

const Page404 = () => (
  <>
    <h1>The page you are looking for don&apos;t exists</h1>
    <InertiaLink href="/">Go to home, you are drunk</InertiaLink>
  </>
);

export default Page404;
