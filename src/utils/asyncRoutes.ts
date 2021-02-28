const AsyncFunction = (async () => {}).constructor
const isAsyncFunction = (value: Function) => value instanceof AsyncFunction

const wrap = (fn: Function) => {
  return (...args: any[]) => {
    if (isAsyncFunction(fn)) {
      return fn(...args).catch((err: Error) => {
        args[2](err)
      })
    } else {
      return fn(...args)
    }
  }
}

const asyncRoutes = (route: Array<Function> | Function) => {
  const routes: Array<Function> = Array.isArray(route) ? route : [route]

  return routes.map(wrap)
}

export default asyncRoutes
