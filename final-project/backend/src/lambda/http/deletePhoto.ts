import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult, } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { deletePhoto, getPhotoById } from '../../businessLogic/photos'
import { getUserId } from '../utils'

const logger = createLogger('deletePhoto')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const photoId = event.pathParameters.photoId
  const userId = getUserId(event)

  const result = await getPhotoById(userId, photoId)

  if (result.length === 0) {
    logger.warn(`user ${userId} requesting DELETE for non exists photo: ${photoId}`)
    return {
      statusCode: 400,
      body: JSON.stringify(`Photo not exists.`)
    }
  }

  logger.info(`user ${userId} is DELETING ${photoId}`)
  await deletePhoto(userId, photoId)

  return {
    statusCode: 200,
    body: null
  }
})


handler.use(
  cors({
    credentials: true
  })
)

