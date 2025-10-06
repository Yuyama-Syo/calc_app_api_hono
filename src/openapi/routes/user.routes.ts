// user.routes.ts - ユーザー関連のOpenAPIルート定義
import { createRoute } from '@hono/zod-openapi';
import { listUsersQuerySchema } from '../../schema/user.schema';
import { successResponseSchema, errorResponseSchema, usersDataSchema } from '../schemas/common.schema';

// GET /user
export const getUsersRoute = createRoute({
  path: '/user',
  method: 'get',
  tags: ['User'],
  description: 'ユーザー一覧を取得します（ページネーション対応）',
  request: {
    query: listUsersQuerySchema,
  },
  responses: {
    200: {
      description: 'OK - ユーザー一覧取得成功',
      content: {
        'application/json': {
          schema: successResponseSchema(usersDataSchema),
        },
      },
    },
    403: {
      description: 'Forbidden - 権限エラー',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});
