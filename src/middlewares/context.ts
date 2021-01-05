import { Request, Response, NextFunction } from 'express'

class Context {
  static _bindings = new WeakMap<Request, Context>()

  public foo = 'bar'
  public pre: object = {}

  static bind(req: Request): void {
    const ctx = new Context()
    Context._bindings.set(req, ctx)
  }

  static get(req: Request): Context | null {
    return Context._bindings.get(req) || null
  }
}

function context(req: Request, _res: Response, next: NextFunction) {
  Context.bind(req)
  next()
}

export { context as default, Context }
