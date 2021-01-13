import { Request } from 'express'

function response (req: Request) {
  const params = req.params

  req.Inertia.setViewData({ title: 'Add new video' }).render({
    component: 'Lists/AddVideo',
    props: {
      listId: params.listId
    }
  })
}

export default [response]
