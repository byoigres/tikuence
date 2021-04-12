import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import { checkSchema } from 'express-validator'
import { prepareValidationForErrorMessages } from '../../middlewares/validations'
import { isAuthenticated } from '../../middlewares/inertia'
import Knex, { Tables } from '../../utils/knex'
import UrlHash, { LIST_MODIFIER } from '../../utils/urlHash'

interface iPayload {
  title: string
}

const validations = checkSchema({
  title: {
    in: 'body',
    errorMessage: 'You must provide a title for the list',
    isLength: {
      options: {
        min: 1,
        max: 150
      }
    }
  }
})

async function createList(req: Request, res: Response, next: NextFunction) {
  const payload = <iPayload>req.body

  const knex = Knex()

  const transaction = await knex.transaction()

  try {
    const [listId] = await knex(Tables.Lists)
      .transacting(transaction)
      .insert({
        title: payload.title,
        user_id: req.user ? req.user.id : null
      })
      .returning<[number]>('id')

    const urlHash = UrlHash.encode(listId, LIST_MODIFIER)

    await knex(Tables.Lists).transacting(transaction).update({
      url_hash: urlHash
    }).where({
      id: listId
    })

    await transaction.commit()

    httpContext.set('urlHash', urlHash)
  } catch (err) {
    console.log(err)
    await transaction.rollback()
    req.flash('error', err)
    return req.Inertia.redirect(`/auth/register/${req.body.token}`)
  }

  next()
}

function response(req: Request) {
  const urlHash: string = httpContext.get('urlHash')

  req.flash('success', 'List created successfully')

  req.Inertia.redirect(`/list/${urlHash}/details`)
}

export default [isAuthenticated, ...validations, prepareValidationForErrorMessages('/list/add'), createList, response]
