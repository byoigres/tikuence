import { Request, Response, NextFunction } from 'express'
import inertia, { ViewData } from 'inertia-node'
import isMobile from 'is-mobile'
import { encode as htmlEntitiesEncode } from 'html-entities'
import Url from 'url'
import config from '../config'

const ASSET_VERSION = config.get('/inertia/version')

const getDescription = () => 'Watch the popular list of TikTok videos'
const getTitle = (title: string) => `${htmlEntitiesEncode(title || getDescription())} • TiKUENCE`
const getShareImage = (thumbnail?: string) => {
  if (thumbnail) {
    return thumbnail
  }

  return `${config.get('/url/base')}images/logo-share.png`
}

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

    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <meta property="og:type" content="website">
    <meta property="og:url" content="${config.get('/url/base')}">
    <meta property="og:title" content="${getTitle(viewData.title)}">
    <meta property="og:description" content="${getDescription()}">
    <meta property="og:image" content="${getShareImage(viewData.thumbnail)}">

    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="${config.get('/url/base')}">
    <meta property="twitter:title" content="${getTitle(viewData.title)}">
    <meta property="twitter:description" content="${getDescription()}">
    <meta property="twitter:image" content="${getShareImage(viewData.thumbnail)}">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Roboto&family=Passion+One&display=swap" rel="stylesheet">
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-98315944-4"></script>
    <script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'UA-98315944-4');</script>

  </head>

  <body>
    <div id="app"></div>
    <script>
        var __page__ = "${escape(JSON.stringify(page))}";
    </script>
    <script rel="preload" defer type="module" src="/assets/app.js"></script>
    ${
      process.env.NODE_ENV === 'production'
        ? '<script rel="preload" defer type="module" src="/assets/vendors.js"></script>'
        : ''
    }
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

export function getReferer(req: Request) {
  const { referer } = req.headers

  if (referer && req.method === 'GET') {
    const refererUrl = new Url.URL(referer)

    if (refererUrl.hostname === req.headers.host && refererUrl.pathname !== req.url) {
      const url = refererUrl.pathname
      if (refererUrl.search) {
        return url + refererUrl.search
      }

      return url
    }
  }

  return null
}

export function populateSharedProps(req: Request, _res: Response, next: NextFunction) {
  const referer = getReferer(req)

  req.Inertia.shareProps({
    auth: {
      isAuthenticated: req.isAuthenticated(),
      credentials: req.user
        ? {
            username: req.user.username,
            name: req.user.name,
            picture: req.user.picture
          }
        : null
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
        warning: messages.warning.length > 0 ? messages.warning[0] : null,
        timestamp: Date.now().toString()
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
