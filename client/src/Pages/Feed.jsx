import React from 'react';
import { usePage, Link } from '@inertiajs/react';

const PageFeed = () => {
  const {
    props,
  } = usePage();

  return (
    <>
      <h1>Hello from Feed component!</h1>
      <pre>
        <code>{JSON.stringify(props, null, 2)}</code>
      </pre>
      <Link href='/auth/register'>Register</Link>
    </>
  );
};

export default PageFeed;
