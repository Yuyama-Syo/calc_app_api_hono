# GET /user

## Summary
ユーザー一覧を取得する。

## Purpose
全ユーザー情報を取得し、管理画面等で表示する。

## Request

### Path Params
なし

### Query Params
なし

### Body
なし

### Headers
- Authorization: Bearer トークン

## Response

### Success (200 OK)
```json
{
  "users": [
    {
      "userId": "string",
      "email": "string",
      "name": "string"
    }
  ]
}
```
(GetUsersResponse)

### Error Variants
- 403 Forbidden: 権限エラー
- 500 Internal Server Error: サーバーエラー

## Validation Rules
- トークン必須

## Error Codes (domain)
- USER_FORBIDDEN (403)
- USER_INTERNAL_ERROR (500)

## Business Rules (invariants)
- 権限のあるユーザーのみ取得可能

## OpenAPI hints
- summary: ユーザー一覧取得
- description: 全ユーザー情報の取得
- tags: [user]

## Test Cases

### Normal
- 有効なトークンで200, ユーザー一覧返却

### Edge
- ユーザー0件で空配列返却

### Error
- 権限エラーで403
- DB障害時に500

## Migration Notes
- 旧APIとの差異: レスポンス構造変更
- エラーコード体系刷新
