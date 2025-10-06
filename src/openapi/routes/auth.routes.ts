// auth.routes.ts - 認証関連のOpenAPIルート定義
import { createRoute } from '@hono/zod-openapi';
import { registerSchema, loginSchema, refreshTokenSchema } from '../../schema/auth.schema';
import { successResponseSchema, errorResponseSchema, authDataSchema, emptyDataSchema } from '../schemas/common.schema';

 // POST /auth/register
export const registerRoute = createRoute({
  path: '/auth/register',
  method: 'post',
  tags: ['Auth'],
  description: '新規ユーザーを登録します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: registerSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Created - ユーザー登録成功',
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
    409: {
      description: 'Conflict - ユーザーが既に存在',
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

// POST /auth/login
export const loginRoute = createRoute({
  path: '/auth/login',
  method: 'post',
  tags: ['Auth'],
  description: 'ユーザーログインを行います',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'OK - ログイン成功',
      content: {
        'application/json': {
          schema: successResponseSchema(authDataSchema),
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
    404: {
      description: 'Not Found - ユーザーが存在しない',
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

// POST /auth/refresh-token
export const refreshTokenRoute = createRoute({
  path: '/auth/refresh-token',
  method: 'post',
  tags: ['Auth'],
  description: 'リフレッシュトークンを使用して新しいアクセストークンを取得します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: refreshTokenSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'OK - トークン更新成功',
      content: {
        'application/json': {
          schema: successResponseSchema(authDataSchema),
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
      description: 'Unauthorized - トークンが不正または期限切れ',
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
