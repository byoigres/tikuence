import React from 'react';
import { usePage, Link } from '@inertiajs/react';

const AuthRegisterPage = () => {
  const {
    props,
  } = usePage();

  return (
    <>
      <h1>Login</h1>
      <pre>
        <code>{JSON.stringify(props, null, 2)}</code>
      </pre>
      <ul>
        <li>
          <Link href='/'>Home</Link>
        </li>
        <li>
          <a href='/auth/google'>Login with Google</a>
        </li>
      </ul>
    </>
  );
};

export default AuthRegisterPage;
