// group.routes.ts - グループ関連のOpenAPIルート定義
import { createRoute, z } from '@hono/zod-openapi';
import { groupSchema } from '../../schema/group.schema';
import { expenseSchema } from '../../schema/expense.schema';
import { successResponseSchema, errorResponseSchema } from '../schemas/common.schema';

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

// グループ作成用のボディスキーマ（groupIdとownerIdを含む）
const createGroupBodySchema = groupSchema;

// グループ更新用のボディスキーマ（groupIdとownerIdを除く）
const updateGroupBodySchema = groupSchema.partial().omit({ groupId: true, ownerId: true });

// グループ一覧レスポンス
const groupsDataSchema = z.object({
  groups: z.array(groupSchema),
}).openapi({
  description: 'グループ一覧データ',
});

// 支出一覧レスポンス
const expensesDataSchema = z.object({
  expenses: z.array(expenseSchema),
}).openapi({
  description: '支出一覧データ',
});

// POST /group
export const createGroupRoute = createRoute({
  path: '/group',
  method: 'post',
  tags: ['Group'],
  description: '新しいグループを作成します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createGroupBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'OK - グループ作成成功',
      content: {
        'application/json': {
          schema: successResponseSchema(groupSchema),
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

// PUT /group/:groupId
export const updateGroupRoute = createRoute({
  path: '/group/{groupId}',
  method: 'put',
  tags: ['Group'],
  description: 'グループ情報を更新します',
  request: {
    params: groupIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: updateGroupBodySchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'OK - グループ更新成功',
      content: {
        'application/json': {
          schema: successResponseSchema(groupSchema),
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

// GET /group
export const getGroupsRoute = createRoute({
  path: '/group',
  method: 'get',
  tags: ['Group'],
  description: 'グループ一覧を取得します',
  responses: {
    200: {
      description: 'OK - グループ一覧取得成功',
      content: {
        'application/json': {
          schema: successResponseSchema(groupsDataSchema),
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

// GET /group/:groupId
export const getGroupRoute = createRoute({
  path: '/group/{groupId}',
  method: 'get',
  tags: ['Group'],
  description: 'グループ詳細を取得します',
  request: {
    params: groupIdParamSchema,
  },
  responses: {
    200: {
      description: 'OK - グループ詳細取得成功',
      content: {
        'application/json': {
          schema: successResponseSchema(groupSchema),
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

// POST /group/:groupId/expense
export const createExpenseRoute = createRoute({
  path: '/group/{groupId}/expense',
  method: 'post',
  tags: ['Group', 'Expense'],
  description: 'グループに新しい支出を登録します',
  request: {
    params: groupIdParamSchema,
    body: {
      content: {
        'application/json': {
          schema: expenseSchema.omit({ expenseId: true, createdAt: true, deleted: true }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'OK - 支出登録成功',
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

// GET /group/:groupId/expense
export const getExpensesRoute = createRoute({
  path: '/group/{groupId}/expense',
  method: 'get',
  tags: ['Group', 'Expense'],
  description: 'グループの支出一覧を取得します',
  request: {
    params: groupIdParamSchema,
  },
  responses: {
    200: {
      description: 'OK - 支出一覧取得成功',
      content: {
        'application/json': {
          schema: successResponseSchema(expensesDataSchema),
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
