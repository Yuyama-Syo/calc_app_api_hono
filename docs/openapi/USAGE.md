# OpenAPI ルート定義の使用方法

## ディレクトリ構成

```
src/
├── openapi/
│   ├── registry.ts              # スキーマとルート定義のレジストリ
│   ├── schemas/
│   │   └── common.schema.ts     # 共通レスポンススキーマ
│   └── routes/                  # OpenAPIルート定義
│       ├── index.ts             # 全ルート定義のエクスポート
│       ├── auth.routes.ts       # 認証関連ルート
│       ├── group.routes.ts      # グループ関連ルート
│       ├── expense.routes.ts    # 支出関連ルート
│       ├── settlement.routes.ts # 精算関連ルート
│       ├── user.routes.ts       # ユーザー関連ルート
│       └── app.routes.ts        # アプリケーションルート
```

## 使用例

### 1. OpenAPIHonoアプリケーションでの使用

```typescript
import { OpenAPIHono } from '@hono/zod-openapi';
import { 
  registerRoute, 
  loginRoute, 
  refreshTokenRoute,
  createGroupRoute,
  getGroupsRoute,
  getGroupRoute,
  updateGroupRoute,
  createExpenseRoute,
  getExpensesRoute,
  deleteExpenseRoute,
  updateExpenseRoute,
  getSettlementsRoute,
  getUsersRoute,
  appRootRoute
} from './openapi/registry';

const app = new OpenAPIHono();

// 認証エンドポイント
app.openapi(registerRoute, async (c) => {
  const { email, password } = c.req.valid('json');
  // 実装...
  return c.json({ success: true, data: {} }, 201);
});

app.openapi(loginRoute, async (c) => {
  const { email, password } = c.req.valid('json');
  // 実装...
  return c.json({ success: true, data: { userId, email, accessToken, refreshToken } });
});

app.openapi(refreshTokenRoute, async (c) => {
  const { refreshToken } = c.req.valid('json');
  // 実装...
  return c.json({ success: true, data: { userId, email, accessToken, refreshToken } });
});

// グループエンドポイント
app.openapi(createGroupRoute, async (c) => {
  const body = c.req.valid('json');
  // 実装...
  return c.json({ success: true, data: group });
});

app.openapi(getGroupsRoute, async (c) => {
  // 実装...
  return c.json({ success: true, data: { groups } });
});

app.openapi(getGroupRoute, async (c) => {
  const { groupId } = c.req.valid('param');
  // 実装...
  return c.json({ success: true, data: group });
});

app.openapi(updateGroupRoute, async (c) => {
  const { groupId } = c.req.valid('param');
  const body = c.req.valid('json');
  // 実装...
  return c.json({ success: true, data: group });
});

// 支出エンドポイント
app.openapi(createExpenseRoute, async (c) => {
  const { groupId } = c.req.valid('param');
  const body = c.req.valid('json');
  // 実装...
  return c.json({ success: true, data: expense });
});

app.openapi(getExpensesRoute, async (c) => {
  const { groupId } = c.req.valid('param');
  // 実装...
  return c.json({ success: true, data: { expenses } });
});

app.openapi(deleteExpenseRoute, async (c) => {
  const { expenseId } = c.req.valid('param');
  // 実装...
  return c.json({ success: true, data: {} });
});

app.openapi(updateExpenseRoute, async (c) => {
  const { expenseId } = c.req.valid('param');
  const body = c.req.valid('json');
  // 実装...
  return c.json({ success: true, data: expense });
});

// 精算エンドポイント
app.openapi(getSettlementsRoute, async (c) => {
  const { groupId } = c.req.valid('param');
  // 実装...
  return c.json({ success: true, data: { settlements, groupId } });
});

// ユーザーエンドポイント
app.openapi(getUsersRoute, async (c) => {
  const { page, limit } = c.req.valid('query');
  // 実装...
  return c.json({ success: true, data: { users, total, page, limit } });
});

// ルートエンドポイント
app.openapi(appRootRoute, async (c) => {
  return c.text('Calc App API is running');
});

// OpenAPI JSONドキュメント
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Calc App API',
    description: '割り勘計算アプリケーションのAPI',
  },
});

export default app;
```

### 2. OpenAPI仕様書の生成

アプリケーションを起動後、以下のエンドポイントでOpenAPI仕様書（JSON形式）を取得できます：

```
GET /openapi.json
```

### 3. Swagger UIでの確認

`/docs`エンドポイントでSwagger UIを使用してAPIドキュメントを確認できます（別途設定が必要）。

## エンドポイント一覧

### 認証 (Auth)
- `POST /auth/regist` - ユーザー登録
- `POST /auth/login` - ログイン
- `POST /auth/refresh-token` - トークン更新

### グループ (Group)
- `POST /group` - グループ作成
- `GET /group` - グループ一覧取得
- `GET /group/{groupId}` - グループ詳細取得
- `PUT /group/{groupId}` - グループ更新
- `POST /group/{groupId}/expense` - 支出登録
- `GET /group/{groupId}/expense` - 支出一覧取得
- `GET /group/{groupId}/settlement` - 精算情報取得

### 支出 (Expense)
- `DELETE /expense/{expenseId}` - 支出削除
- `PUT /expense/{expenseId}` - 支出更新

### ユーザー (User)
- `GET /user` - ユーザー一覧取得（ページネーション対応）

### アプリケーション (App)
- `GET /` - ヘルスチェック

## レスポンス形式

### 成功レスポンス
```json
{
  "success": true,
  "data": { /* データオブジェクト */ }
}
```

### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": { /* 詳細情報（任意） */ }
  }
}
```

## カスタマイズ

新しいエンドポイントを追加する場合：

1. `src/openapi/routes/` に新しいルート定義ファイルを作成
2. `src/openapi/routes/index.ts` に追加したファイルをエクスポート
3. 必要に応じて `src/openapi/schemas/common.schema.ts` に共通スキーマを追加
4. アプリケーションで `app.openapi()` を使用してルートを登録
