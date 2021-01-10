import { Request } from 'express'

function response (req: Request) {
  req.Inertia.setViewData({ title: 'Add new list' }).render({
    component: 'Lists/Add',
    props: {}
  })
}

export default [response]
