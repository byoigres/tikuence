import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import AuthLayout from '../../components/layouts/AuthLayout';

const LoginPage = () => {
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

LoginPage.layout = (page) => <AuthLayout children={page} />;

export default LoginPage;
