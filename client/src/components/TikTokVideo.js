import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Helmet } from 'react-helmet';

const TikTokVideo = ({ tiktokId, html, isReadyCallback = null, loaderComponent = null }) => {
  const [isReady, setIsReady] = useState(false);
  const [scriptSrc, setScriptSrc] = useState(undefined);
  const [content, setContent] = useState('');

  const ref = useRef(null);

  useEffect(() => {
    const htmlString = html.replaceAll('\\"', '"');

    const tempElement = document.createElement('div');
    tempElement.innerHTML = htmlString;

    const scriptTag = tempElement.getElementsByTagName('script')[0];

    setScriptSrc(scriptTag && scriptTag.src);
    setContent(htmlString.substr(0, htmlString.indexOf('<script')));
  }, []);

  /**
   * Trigger loaded state when the iframe has loaded
   */
  useEffect(() => {
    const ttembed = document.querySelector(`#ttembed`);
    if (ttembed) {
      ttembed.remove();
    }
    /**
     * MutationObserver:
     * https://stackoverflow.com/questions/3219758/detect-changes-in-the-dom
     */
    if (!('MutationObserver' in window)) return setIsReady(true);

    /**
     * TODO: Check bugs for MutationObserver
     * https://caniuse.com/#feat=mutationobserver
     */
    const elem = ref.current;

    const observer = new MutationObserver((mutationList) => {
      // Get the iframe from the mutation that has added it
      const iframeAdded = mutationList.reduce((acc, curr) => {
        const iframe = Array.from(curr.addedNodes).find((node) => node.nodeName === 'IFRAME');
        // if (iframe) {
        //   acc = iframe;
        // }
        return iframe || acc;
      }, undefined);

      if (iframeAdded) {
        iframeAdded.addEventListener('load', () => {
          setIsReady(true);

          if (isReadyCallback) {
            isReadyCallback(tiktokId);
          }
        });
      }
    });

    if (elem) {
      observer.observe(elem, {
        childList: true,
        attributes: true,
        subtree: true,
      });
    }

    return () => {
      observer.disconnect();
    };
  }, [content]);

  return (
    <>
      <Helmet>
        <script id="ttembed" async src={scriptSrc} />
      </Helmet>
      <div
        ref={ref}
        data-name="TikTokVideo"
        /* eslint react/no-danger: 0 */
        dangerouslySetInnerHTML={{ __html: content }}
        style={{ display: isReady ? 'block' : 'none', width: '100%' }}
      />
      {!isReady && loaderComponent}
    </>
  );
};

export default TikTokVideo;
