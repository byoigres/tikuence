import { Request, Response, NextFunction } from 'express'
import inertia, { ViewData } from 'inertia-node'
import isMobile from 'is-mobile'
import Url from 'url'

const ASSET_VERSION = '1'

const getDescription = () => 'Watch the popular list of TikTok videos'
const getTitle = (title: string) => `Tikuence | ${title || getDescription()}`
const getImage = () => 'https://tikuence.herokuapp.com/images/logo200.png'

const template = (page: object, viewData: ViewData) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link rel="icon" href="/favicon.ico">
    <title>${getTitle(viewData.title)}</title>

    <meta name="title" content="${getTitle(viewData.title)}">
    <meta name="description" content="${getDescription()}">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://tikuence.herokuapp.com/">
    <meta property="og:title" content="${getTitle(viewData.title)}">
    <meta property="og:description" content="${getDescription()}">
    <meta property="og:image" content="${getImage()}">

    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://tikuence.herokuapp.com/">
    <meta property="twitter:title" content="${getTitle(viewData.title)}">
    <meta property="twitter:description" content="${getDescription()}">
    <meta property="twitter:image" content="${getImage()}">
    <link rel="stylesheet" async href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
    <link rel="stylesheet" async href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap" rel="stylesheet">
    <style>
        html, body {
            font-family: "Source Sans Pro", 'Roboto', sans-serif;
            background-color: #f5f5f5;
            scroll-behavior: smooth;
        }
        a {
          text-decoration: none;
          color: #1e1e1e;
        }
    </style>
  </head>

  <body>
    <div id="app"></div>
    <script>
        var __page__ = "${escape(JSON.stringify(page))}";
    </script>
    <script defer type="module" src="/assets/app.js"></script>
    ${process.env.NODE_ENV === 'production' ? '<script defer type="module" src="/assets/vendors.js"></script>' : ''}
  </body>
</html>
`

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next()
  }

  req.flash('warning', 'You need to login first to acces this page')

  req.Inertia.redirect('/auth/login')
}

function getReferer(req: Request) {
  const { referer } = req.headers

  if (referer && req.method === 'GET') {
    const refererUrl = new Url.URL(referer)

    if (refererUrl.host === req.headers.host && refererUrl.pathname !== req.url) {
      return refererUrl.pathname
    }
  }

  return null
}

export function populateSharedProps(req: Request, _res: Response, next: NextFunction) {
  const referer = getReferer(req)

  req.Inertia.shareProps({
    auth: {
      isAuthenticated: req.isAuthenticated(),
      credentials: req.user || null
    },
    isMobile: () =>
      isMobile({
        ua: req
      }),
    referer,
    flash: () => {
      const messages = {
        success: req.flash('success'),
        error: req.flash('error'),
        info: req.flash('info'),
        warning: req.flash('warning')
      }

      return {
        success: messages.success.length > 0 ? messages.success[0] : null,
        error: messages.error.length > 0 ? messages.error[0] : null,
        info: messages.info.length > 0 ? messages.info[0] : null,
        warning: messages.warning.length > 0 ? messages.warning[0] : null
      }
    },
    errors: () => {
      const errors = req.flash('errors')

      if (errors && errors.length > 0) {
        return JSON.parse(errors[0])
      }

      return {}
    }
  })

  next()
}

export default inertia(template, ASSET_VERSION)
