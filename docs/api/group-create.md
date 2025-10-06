# POST /group

## Summary
新規グループを作成する。

## Purpose
ユーザーがグループを新規作成し、グループ管理を開始する。

## Request

### Path Params
なし

### Query Params
なし

### Body
```json
{
  "name": "string",
  "description": "string"
}
```
(CreateGroupBodyParameter)

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
(CreateGrouopResponse)

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
- 作成者は自動的にメンバーとなる

## OpenAPI hints
- summary: グループ登録
- description: 新規グループの作成
- tags: [group]

## Test Cases

### Normal
- 正しいname/descriptionで200, グループ作成

### Edge
- name重複で400
- 空文字/形式不正で400

### Error
- 認証失敗で401
- DB障害時に500

## Migration Notes
- 旧APIとの差異: レスポンス構造変更
- エラーコード体系刷新
