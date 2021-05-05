import helmet from 'helmet'

export default [
  helmet.dnsPrefetchControl(),
  helmet.expectCt(),
  helmet.frameguard(),
  helmet.hidePoweredBy(),
  // TODO: investigate what directives should be configured and with what values
  // helmet.hsts(),
  helmet.ieNoOpen(),
  helmet.noSniff(),
  helmet.permittedCrossDomainPolicies(),
  helmet.referrerPolicy(),
  helmet.xssFilter()
]
