// expense.routes.ts - 支出関連のOpenAPIルート定義
import { createRoute, z } from '@hono/zod-openapi';
import { expenseSchema, updateExpenseBodySchema } from '../../schema/expense.schema';
import { successResponseSchema, errorResponseSchema, emptyDataSchema } from '../schemas/common.schema';

// パラメータスキーマ
const expenseIdParamSchema = z.object({
  expenseId: z.string().uuid().openapi({
    description: '支出ID（UUID）',
    example: 'e1e1e1e1-e1e1-e1e1-e1e1-e1e1e1e1e1e1',
    param: {
      name: 'expenseId',
      in: 'path',
    },
  }),
});

// DELETE /expense/:expenseId
export const deleteExpenseRoute = createRoute({
  path: '/expense/{expenseId}',
  method: 'delete',
  tags: ['Expense'],
  description: '支出を削除します',
  request: {
    params: expenseIdParamSchema,
  },
  responses: {
    200: {
      description: 'OK - 支出削除成功',
      content: {
        'application/json': {
          schema: successResponseSchema(emptyDataSchema),
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

// PUT /expense/:expenseId
export const updateExpenseRoute = createRoute({
  path: '/expense/{expenseId}',
  method: 'put',
  tags: ['Expense'],
  description: '支出情報を更新します',
  request: {
    params: expenseIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: updateExpenseBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'OK - 支出更新成功',
      content: {
        'application/json': {
          schema: successResponseSchema(expenseSchema),
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
