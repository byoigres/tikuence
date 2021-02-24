import { Request, Response, NextFunction } from 'express'
import httpContext from 'express-http-context'
import fetch from 'node-fetch'
import url from 'url'
import { v4 as uuidv4 } from 'uuid'
import { checkSchema } from 'express-validator'
import Knex, { Tables } from '../../../utils/knex'
import { prepareValidationForErrorMessages } from '../../../middlewares/validations'
import { isAuthenticated } from '../../../middlewares/inertia'
import { fetchAndCreateVideoThumbnails } from '../../../utils/storage'

interface iPayload {
  videoUrl: string
  listId: number
}

interface iTikTokOembed {
  version: string
  type: string
  title: string
  // eslint-disable-next-line camelcase
  author_url: string
  // eslint-disable-next-line camelcase
  author_name: string
  width: string
  height: string
  html: string
  // eslint-disable-next-line camelcase
  thumbnail_width: number
  // eslint-disable-next-line camelcase
  thumbnail_height: number
  // eslint-disable-next-line camelcase
  thumbnail_url: string
  // eslint-disable-next-line camelcase
  provider_url: string
  // eslint-disable-next-line camelcase
  provider_name: string
}

const regExpPathForWeb = /^\/@[A-Za-z0-9_.]+\/video\/([0-9]+)/
const regExpPathForMobile = /^\/v\/([0-9]+).html/

const validations = checkSchema({
  listId: {
    in: 'params',
    isNumeric: {
      errorMessage: 'The provided id of the list is not valid',
      bail: true
    },
    toInt: true,
    custom: {
      // errorMessage: 'The id does not exists 1',
      options: async (value) => {
        const knex = Knex()
        try {
          const list = await knex(Tables.Lists).where('id', value).first()

          if (!list) {
            /* eslint prefer-promise-reject-errors: 0 */
            return Promise.reject('The list does not exists')
          }
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
  },
  videoUrl: {
    in: 'body',
    isLength: {
      errorMessage: 'You must provide a title for the list',
      options: {
        min: 1
        // TODO: check what is the max lenght of a complete URL
      },
      bail: true
    },
    isURL: {
      errorMessage: 'The URL is not valid',
      options: {
        require_protocol: true
      }
    }
  }
})

async function verifyIfListBelongsToCurrentUser(req: Request, _res: Response, next: NextFunction) {
  const { listId } = req.params

  const knex = Knex()

  const list = await knex(Tables.Lists)
    .where({
      id: listId,
      user_id: req.user?.id ?? 0
    })
    .first()

  if (!list) {
    req.flash('warning', 'The list does not belong to the current user')

    return req.Inertia.redirect(`/list/${listId}/video/add`)
  }

  next()
}

async function validateUrl(req: Request, _res: Response, next: NextFunction) {
  const payload = <iPayload>req.body
  const { listId } = req.params

  let parsedUrl: url.URL

  try {
    parsedUrl = new url.URL(payload.videoUrl)
  } catch (err) {
    req.flash('error', `That doesn't seems to be a valid url.`) /* eslint quotes: 0 */
    return req.Inertia.redirect(`/list/${listId}/video/add`)
  }

  // If the url.URL is a shorturl, get the "real" url by following the redirection
  if (parsedUrl.hostname === 'vm.tiktok.com') {
    const response = await fetch(payload.videoUrl)

    if (response.redirected) {
      parsedUrl = new url.URL(response.url)
    }
  }

  if (parsedUrl.hostname === 'www.tiktok.com' || parsedUrl.hostname === 'm.tiktok.com') {
    const parsedPath = parsedUrl.pathname.match(
      parsedUrl.hostname === 'www.tiktok.com' ? regExpPathForWeb : regExpPathForMobile
    )

    if (!parsedPath) {
      req.flash('error', `That doesn't seems to be a TikTok video url.URL`) /* eslint quotes: 0 */
      return req.Inertia.redirect(`/list/${listId}/video/add`)
    }

    const [, tiktokId] = parsedPath
    httpContext.set('tiktokId', tiktokId)
    httpContext.set('tiktokUrl', url.format(parsedUrl))

    return next()
  }

  req.flash(
    'errors',
    JSON.stringify({
      videoUrl: `That doesn't seems to be a valid TikTok video url.`
    })
  )

  return req.Inertia.redirect(`/list/${listId}/video/add`)
}

async function fetchVideoInfo(req: Request, _res: Response, next: NextFunction) {
  const videoUrl = httpContext.get('tiktokUrl')

  const response = await fetch(`https://www.tiktok.com/oembed?url=${videoUrl}`)

  const json: iTikTokOembed = await response.json()

  httpContext.set('videoInfo', json)

  next()
}

async function extractAuthorFromUrl(req: Request, _res: Response, next: NextFunction) {
  const videoInfo: iTikTokOembed = httpContext.get('videoInfo')
  const parsedUrl = new url.URL(videoInfo.author_url)

  const authorUsername = parsedUrl.pathname.slice(2)

  httpContext.set('authorUsername', authorUsername)
  next()
}

async function verifyIfVideoExistinList(req: Request, _res: Response, next: NextFunction) {
  const { listId } = req.params
  const authorUsername: string = httpContext.get('authorUsername')
  const tiktokId = httpContext.get('tiktokId')
  const knex = Knex()
  // This is duplicate as line #216
  const author = await knex(Tables.Authors).select('id').where('username', authorUsername).first()

  // If the author don't exists nether the video, skip validation
  if (!author) {
    return next()
  }

  // Verify if the video is in the lists
  const video = await knex(`${Tables.ListsVideos} AS LV`)
    .select('V.id')
    .join(`${Tables.Videos} AS V`, 'LV.video_id', 'V.id')
    .where({
      'LV.list_id': listId,
      'V.tiktok_id': tiktokId,
      'V.author_id': author.id
    })
    .first()

  if (video) {
    req.flash('info', 'The video you are trying to add is already on the list')
    return req.Inertia.redirect(`/list/${listId}/edit`)
  }

  next()
}

async function createAuthor(req: Request, _res: Response, next: NextFunction) {
  const videoInfo: iTikTokOembed = httpContext.get('videoInfo')
  const authorUsername: string = httpContext.get('authorUsername')
  let authorId: number
  const knex = Knex()
  // This is duplicate as line #185
  const author = await knex(Tables.Authors).select('id').where('username', authorUsername).first()

  if (!author) {
    authorId = await knex<{ username: string; name: string; created_at: Date; updated_at: Date }>(Tables.Authors)
      .insert({
        username: authorUsername,
        name: videoInfo.author_name,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning<number>('id')
  } else {
    authorId = author.id
  }

  httpContext.set('authorId', authorId)

  next()
}

async function createVideo(req: Request, _res: Response, next: NextFunction) {
  const { listId } = req.params
  const tiktokId: string = httpContext.get('tiktokId')
  const authorId = httpContext.get('authorId')
  const videoInfo: iTikTokOembed = httpContext.get('videoInfo')
  const knex = Knex()
  const transaction = await knex.transaction()

  try {
    let videoId: number

    // Verify if the video exists
    const videoExists = await knex<{ tiktok_id: string; author_id: number }>(Tables.Videos)
      .select('id')
      .where({
        tiktok_id: tiktokId,
        author_id: authorId
      })
      .first<{ id: number }>()

    if (!videoExists) {
      const imageHash = uuidv4()

      const [videoIdResult] = await knex<{
        tiktok_id: string
        title: string
        html: string
        thumbnail_width: number
        thumbnail_height: number
        thumbnail_name: string
        author_id: number
        created_at: Date
        updated_at: Date
      }>(Tables.Videos)
        .transacting(transaction)
        .insert({
          tiktok_id: tiktokId,
          title: videoInfo.title,
          html: videoInfo.html,
          thumbnail_width: videoInfo.thumbnail_width,
          thumbnail_height: videoInfo.thumbnail_height,
          thumbnail_name: imageHash,
          author_id: authorId,
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning<[number]>('id')

      videoId = videoIdResult
      // TODO: get all sizes images names to check if they exist
      // and if they will, delete them
      await fetchAndCreateVideoThumbnails(videoInfo.thumbnail_url, imageHash)
    } else {
      videoId = videoExists.id
    }

    const count = await knex<number>(Tables.ListsVideos)
      .transacting(transaction)
      .count('video_id', { as: 'total' })
      .where('list_id', listId)
      .first<{ total: number }>()

    await knex<{
      list_id: number
      video_id: number
      order_id: number
      created_at: Date
      updated_at: Date
    }>(Tables.ListsVideos)
      .transacting(transaction)
      .insert({
        list_id: parseInt(listId, 10),
        video_id: videoId,
        order_id: count.total + 1,
        created_at: new Date(),
        updated_at: new Date()
      })

    await transaction.commit()
  } catch (err) {
    console.log(err)
    await transaction.rollback()

    return req.Inertia.setStatusCode(500).setViewData({ title: 'Something goes wrong' }).render({
      component: 'Errors/500'
    })
  }

  next()
}

function response(req: Request) {
  const { listId } = req.params

  req.flash('success', 'Video added successfully')

  req.Inertia.redirect(`/list/${listId}/edit`)
}

export default [
  isAuthenticated,
  ...validations,
  prepareValidationForErrorMessages((req: Request) => `/list/${req.params.listId}/video/add`),
  verifyIfListBelongsToCurrentUser,
  validateUrl,
  fetchVideoInfo,
  extractAuthorFromUrl,
  verifyIfVideoExistinList,
  createAuthor,
  createVideo,
  response
]
