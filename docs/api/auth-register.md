# POST /auth/regist

## Summary
新規ユーザー登録を行う。

## Purpose
ユーザー情報を受け取り、アカウントを新規作成する。

## Request

### Path Params
なし

### Query Params
なし

### Body
```json
{
  "email": "string",
  "password": "string",
  "name": "string"
}
```
(RegistBodyParameter)

### Headers
- Content-Type: application/json

## Response

### Success (201 Created)
```json
{
  "userId": "string",
  "accessToken": "string",
  "refreshToken": "string"
}
```
(RegistResponse)

### Error Variants
- 400 Bad Request: パラメータ不正
- 409 Conflict: ユーザー重複
- 500 Internal Server Error: サーバーエラー

## Validation Rules
- email: 必須, メール形式
- password: 必須, 文字列, 最小長・最大長（詳細はDTO参照）
- name: 必須, 文字列

## Error Codes (domain)
- AUTH_INVALID_PARAM (400)
- AUTH_CONFLICT (409)
- AUTH_INTERNAL_ERROR (500)

## Business Rules (invariants)
- email重複不可
- パスワードはハッシュ化保存
- 登録成功時トークン発行

## OpenAPI hints
- summary: ユーザー登録
- description: 新規ユーザーの登録
- tags: [auth]

## Test Cases

### Normal
- 正しいemail/password/nameで201, ユーザー作成

### Edge
- email重複で409
- 空文字/形式不正で400

### Error
- DB障害時に500
- 必須項目欠落で400

## Migration Notes
- 旧APIとの差異: レスポンス構造変更
- エラーコード体系刷新
- パスワードハッシュ方式変更（必要に応じて）
