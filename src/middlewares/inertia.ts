import { Request, Response, NextFunction } from 'express'
import inertia, { ViewData } from 'inertia-node'

const ASSET_VERSION = '1'

const template = (page: object, viewData: ViewData) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    
    <!-- Custom data -->
    <title>${viewData.title}</title>
    <!-- <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" /> -->
    <style>
        html, body {
            font-family: Roboto;
        }
    </style>
    <!-- Your React, Vue or Svelte SPA -->
    <link rel="stylesheet" async href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
    <link rel="stylesheet" async href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css" />
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;700&display=swap" rel="stylesheet">
    <style>
        html, body {
            font-family: 'Source Sans Pro', sans-serif;
        }
    </style>
  </head>

  <!-- The Inertia page object -->
  <body>
    <div id="app"></div>
    <script>
        var __page__ = "${escape(JSON.stringify(page))}";
    </script>
    <script defer type="module" src="/assets/app.js"></script>
  </body>
</html>
`

export function populateAuth(req: Request, _res: Response, next: NextFunction) {
  req.auth = {
    isAuthenticated: req.cookies.ssid !== undefined,
    credentials: req.cookies.ssid ?? null
  }

  req.Inertia.shareProps({
    auth: req.auth.credentials,
    flash: () => {
      const messages = {
        success: req.flash('success'),
        error: req.flash('error')
      }

      return {
        success: messages.success.length > 0 ? messages.success[0] : null,
        error: messages.error.length > 0 ? messages.error[0] : null
      }
    }
  })

  next()
}

export default inertia(template, ASSET_VERSION)
