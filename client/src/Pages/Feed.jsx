import React from 'react';
import { usePage } from '@inertiajs/react';

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
    </>
  );
};

// PageFeed.layout = (page) => <Layout children={page} />;

export default PageFeed;
