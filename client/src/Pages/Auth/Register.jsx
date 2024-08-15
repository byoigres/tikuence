import React from 'react';
import { usePage, Link } from '@inertiajs/react';

const AuthRegisterPage = () => {
  const {
    props,
  } = usePage();

  return (
    <>
      <h1>Register</h1>
      <pre>
        <code>{JSON.stringify(props, null, 2)}</code>
      </pre>
      <ul>
        <li>
          <Link href='/'>Home</Link>
        </li>
        <li>
          <Link href='/auth/login'>Login</Link>
        </li>
      </ul>
    </>
  );
};

export default AuthRegisterPage;
