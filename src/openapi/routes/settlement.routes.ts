// settlement.routes.ts - 精算関連のOpenAPIルート定義
import { createRoute, z } from '@hono/zod-openapi';
import { successResponseSchema, errorResponseSchema, settlementsDataSchema } from '../schemas/common.schema';

// パラメータスキーマ
const groupIdParamSchema = z.object({
  groupId: z.string().uuid().openapi({
    description: 'グループID（UUID）',
    example: '11111111-1111-1111-1111-111111111111',
    param: {
        name: 'groupId',
      in: 'path',
    },
  }),
});

// GET /group/:groupId/settlement
export const getSettlementsRoute = createRoute({
  path: '/group/{groupId}/settlement',
  method: 'get',
  tags: ['Settlement'],
  description: 'グループの精算情報を取得します',
  request: {
    params: groupIdParamSchema,
  },
  responses: {
    200: {
      description: 'OK - 精算情報取得成功',
      content: {
        'application/json': {
          schema: successResponseSchema(settlementsDataSchema),
        },
      },
    },
    400: {
      description: 'Bad Request - バリデーションエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    401: {
      description: 'Unauthorized - 認証失敗',
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
