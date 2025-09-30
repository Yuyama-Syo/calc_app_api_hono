# PUT /group/:groupId

## Summary
既存グループ情報を更新する。

## Purpose
グループ名や説明などの情報を変更し、管理内容を最新化する。

## Request

### Path Params
- groupId: string

### Query Params
なし

### Body
```json
{
  "name": "string",
  "description": "string"
}
```
(PutGroupBodyParameter)

### Headers
- Content-Type: application/json
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
(PutGrouopResponse)

### Error Variants
- 400 Bad Request: パラメータ不正
- 401 Unauthorized: 認証失敗
- 500 Internal Server Error: サーバーエラー

## Validation Rules
- name: 必須, 文字列, 最大長
- description: 任意, 文字列

## Error Codes (domain)
- GROUP_INVALID_PARAM (400)
- GROUP_UNAUTHORIZED (401)
- GROUP_INTERNAL_ERROR (500)

## Business Rules (invariants)
- グループ名重複不可
- 更新者はグループメンバーである必要あり

## OpenAPI hints
- summary: グループ更新
- description: 既存グループ情報の更新
- tags: [group]

## Test Cases

### Normal
- 正しいgroupId/name/descriptionで200, グループ更新

### Edge
- name重複で400
- 空文字/形式不正で400

### Error
- 認証失敗で401
- DB障害時に500

## Migration Notes
- 旧APIとの差異: レスポンス構造変更
- エラーコード体系刷新
