import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult, } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getPhotoById } from '../../businessLogic/photos'
import { getUserId } from '../utils'

const logger = createLogger('deletePhoto')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const photoId = event.pathParameters.photoId
  const userId = getUserId(event)

  const result = await getPhotoById(userId, photoId)

  if (result.length === 0) {
    logger.warn(`user ${userId} requesting non exists PHOTO: ${photoId}`)
    return {
      statusCode: 400,
      body: JSON.stringify(`Photo not exists.`)
    }
  }

  logger.info(`user ${userId} is REQUESTING ${photoId}`)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: result
    })
  }
})


handler.use(
  cors({
    credentials: true
  })
)

