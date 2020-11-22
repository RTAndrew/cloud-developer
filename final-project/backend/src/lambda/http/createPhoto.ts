import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreatePhotoRequest } from '../../requests/CreatePhotoRequest'
import { createPhoto } from '../../businessLogic/photos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createPhoto')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newPhoto: CreatePhotoRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  if (!newPhoto.name)
    throw new Error("You have to insert the photo's name");

  logger.info(`user ${userId} is CREATING new photo ${newPhoto}`)
  const newPhotoItem = await createPhoto(userId, newPhoto)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newPhotoItem
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
