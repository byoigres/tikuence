import { Request } from 'express'

async function view (req: Request) {
  req.Inertia.setViewData({ title: 'Add new list' }).render({
    component: 'Lists/Add',
    props: {}
  })
}

export default [view]
