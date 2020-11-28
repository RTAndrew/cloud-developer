import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdatePhotoRequest } from '../../requests/UpdatePhotoRequest'
import { updatePhoto, getPhotoById } from '../../businessLogic/photos'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('updateTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const photoId = event.pathParameters.photoId
  const updatedTodo: UpdatePhotoRequest = JSON.parse(event.body)
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
      body: JSON.stringify(`Todo not exists.`)
    }
  }

  logger.info(`User ${userId} updating todo: ${photoId} with data ${updatedTodo}`)
  await updatePhoto(userId, photoId, updatedTodo)

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
