import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdatePhotoRequest } from '../../requests/UpdatePhotoRequest'
import { updatePhoto, getPhotoById } from '../../businessLogic/photos'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('updatePhoto')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const photoId = event.pathParameters.photoId
  const updatedPhoto: UpdatePhotoRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  const result = await getPhotoById(userId, photoId)

  if (result.length === 0) {
    logger.warn(`user ${userId} updating non existing records: ${photoId}`)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(`Photo not exists.`)
    }
  }

  logger.info(`User ${userId} updating photo: ${photoId} with data ${updatedPhoto}`)
  await updatePhoto(userId, photoId, updatedPhoto)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: null
  }
})


handler.use(
  cors({
    credentials: true
  })
)
