import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Helmet } from 'react-helmet';

const NavBar = ({ html }) => {
  const [loaded, setLoaded] = useState(true);
  const [error, setError] = useState(undefined);
  const [scriptSrc, setScriptSrc] = useState(undefined);
  const [content, setContent] = useState(undefined);

  const ref = useRef(null);

  useEffect(() => {
    const htmlString = html.replaceAll('\\"', '"');

    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;

    const scriptTag = tempElement.getElementsByTagName('script')[0];

    setScriptSrc(scriptTag && scriptTag.src);
    setContent(htmlString.substr(0, htmlString.indexOf('<script')));
  });

  return (
    <>
      <>
        <Helmet>
          <script id="ttEmbedder" async src={scriptSrc} />
        </Helmet>
        <div
          ref={ref}
          style={{ display: loaded && html ? 'flex' : 'none' }}
          dangerouslySetInnerHTML={{ __html: content || '' }}
        />
      </>
    </>
  );
};

export default NavBar;
