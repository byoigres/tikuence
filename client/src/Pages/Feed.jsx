import React from "react";
import { usePage, Link } from "@inertiajs/react";
import MainLayout from "../components/layouts/MainLayout";

const PageFeed = () => {
  const { props } = usePage();

  return (
    <>
      <h1>Hello from Feed component!</h1>
      <pre>
        <code>{JSON.stringify(props, null, 2)}</code>
      </pre>
      <Link href="/auth/register">Register</Link>
    </>
  );
};

PageFeed.layout = (page) => <MainLayout children={page} />;

export default PageFeed;
