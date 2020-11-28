import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { getPhotoById } from '../../businessLogic/photos'
import { getPresignedUrl } from '../../businessLogic/attachmentUrl'


const logger = createLogger('generateUploadUrl')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const photoId = event.pathParameters.photoId
  const userId = getUserId(event)

  const result = await getPhotoById(userId, photoId)

  if (result.length === 0) {
    logger.warn(`user ${userId} requesting Presigned URL for non exists record: ${photoId}`)

    return {
      statusCode: 400,
      body: JSON.stringify(`Photo does not exist.`)
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl: getPresignedUrl(photoId)
    })
  }
})


handler.use(
  cors({
    credentials: true
  })
)
