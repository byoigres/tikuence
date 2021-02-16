import React from 'react';
import { Helmet } from 'react-helmet';

function SEO({ description, lang = 'en', title, image }) {
  const metaDescription = description || 'List of TikTok videos';
  const metaTitle = `Tikuence | ${title}`;
  const metaUrl = 'https://tikuence.herokuapp.com';
  const metaImage = image || `${metaUrl}/images/logo200.png`;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={metaTitle}
      titleTemplate={`%s | ${title}`}
      meta={[
        {
          name: `title`,
          content: metaTitle,
        },
        {
          name: `description`,
          content: metaDescription,
        },
        // Open Graph / Facebook
        {
          property: `og:type`,
          content: 'website',
        },
        {
          property: `og:url`,
          content: metaUrl,
        },
        {
          property: `og:title`,
          content: metaTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: metaImage,
        },
        // Twitter
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:url`,
          content: metaUrl,
        },
        {
          name: `twitter:title`,
          content: metaTitle,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:image`,
          content: metaImage,
        },
      ].concat([])}
    />
  );
}

export default SEO;
