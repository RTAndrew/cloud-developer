import 'source-map-support/register'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')

export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)
  const userId = getUserId(event)

  if (!newTodo.name)
    throw new Error("You have to insert the todo's name");

  logger.info(`user ${userId} is CREATING new todo ${newTodo}`)
  const newTodoItem = await createTodo(userId, newTodo)

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: newTodoItem
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
