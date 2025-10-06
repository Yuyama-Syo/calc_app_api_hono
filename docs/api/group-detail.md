# GET /group/:groupId

## Summary
指定グループの詳細情報を取得する。

## Purpose
グループIDを指定して、グループの詳細情報を取得し、管理画面等で表示する。

## Request

### Path Params
- groupId: string

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
  "groupId": "string",
  "name": "string",
  "description": "string"
}
```
(GetGroupRespnse)

### Error Variants
- 400 Bad Request: パラメータ不正
- 401 Unauthorized: 認証失敗
- 500 Internal Server Error: サーバーエラー

## Validation Rules
- groupId: 必須, 文字列

## Error Codes (domain)
- GROUP_INVALID_PARAM (400)
- GROUP_UNAUTHORIZED (401)
- GROUP_INTERNAL_ERROR (500)

## Business Rules (invariants)
- ログインユーザーが所属するグループのみ取得可能

## OpenAPI hints
- summary: グループ取得
- description: 指定グループの詳細情報取得
- tags: [group]

## Test Cases

### Normal
- 有効なgroupIdで200, 詳細返却

### Edge
- 存在しないgroupIdで400
- 空文字/形式不正で400

### Error
- 認証失敗で401
- DB障害時に500

## Migration Notes
- 旧APIとの差異: レスポンス構造変更
- エラーコード体系刷新
