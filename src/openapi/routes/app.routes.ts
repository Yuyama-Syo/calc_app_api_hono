// app.routes.ts - アプリケーションルート定義
import { createRoute, z } from '@hono/zod-openapi';

// レスポンススキーマ
const appRootResponseSchema = z.string().openapi({
  description: 'ルートメッセージ',
  example: 'Calc App API is running',
});

// GET /
export const appRootRoute = createRoute({
  path: '/',
  method: 'get',
  tags: ['App'],
  description: 'APIのルートエンドポイント（ヘルスチェック）',
  responses: {
    200: {
      description: 'OK - API稼働中',
      content: {
        'text/plain': {
          schema: appRootResponseSchema,
        },
      },
    },
  },
});
