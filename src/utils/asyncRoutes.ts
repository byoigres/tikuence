const wrap = (fn: Function) =>
  function asyncUtilWrap(...args: any[]) {
    const fnReturn = fn(...args)
    const next = args[args.length - 1]
    return Promise.resolve(fnReturn).catch(next)
  }

const asyncRoutes = (route: Array<Function> | Function) => {
  const routes: Array<Function> = Array.isArray(route) ? route : [route]

  return routes.map(wrap)
}

export default asyncRoutes
