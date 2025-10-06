# GET /group

## Summary
グループ一覧を取得する。

## Purpose
ユーザーが所属する全グループ情報を取得し、管理画面等で表示する。

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
  "results": [
    {
      "groupId": "string",
      "name": "string",
      "description": "string"
    }
  ]
}
```
(GetGroupsResponse)

### Error Variants
- 401 Unauthorized: 認証失敗
- 500 Internal Server Error: サーバーエラー

## Validation Rules
- トークン必須

## Error Codes (domain)
- GROUP_UNAUTHORIZED (401)
- GROUP_INTERNAL_ERROR (500)

## Business Rules (invariants)
- ログインユーザーの所属グループのみ返却

## OpenAPI hints
- summary: グループ一覧取得
- description: 所属グループの一覧取得
- tags: [group]

## Test Cases

### Normal
- 有効なトークンで200, グループ一覧返却

### Edge
- 所属グループ0件で空配列返却

### Error
- 認証失敗で401
- DB障害時に500

## Migration Notes
- 旧APIとの差異: レスポンス構造変更
- エラーコード体系刷新
