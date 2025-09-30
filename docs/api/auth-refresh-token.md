# POST /auth/refresh-token

## Summary
リフレッシュトークンを用いて新しいアクセストークンを発行する。

## Purpose
既存のリフレッシュトークンを検証し、アクセストークンの再発行を行う。

## Request

### Path Params
なし

### Query Params
なし

### Body
```json
{
  "token": "string"
}
```
(RefreshTokenBodyParameter)

### Headers
- Content-Type: application/json

## Response

### Success (200 OK)
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```
(RefreshTokenResponse)

### Error Variants
- 400 Bad Request: パラメータ不正
- 401 Unauthorized: トークン不正
- 500 Internal Server Error: サーバーエラー

## Validation Rules
- token: 必須, 文字列, JWT形式

## Error Codes (domain)
- AUTH_INVALID_PARAM (400)
- AUTH_UNAUTHORIZED (401)
- AUTH_INTERNAL_ERROR (500)

## Business Rules (invariants)
- 有効なリフレッシュトークンのみ再発行可能
- トークン失効時は401

## OpenAPI hints
- summary: リフレッシュトークン
- description: リフレッシュトークンによるアクセストークン再発行
- tags: [auth]

## Test Cases

### Normal
- 有効なtokenで200, 新トークン返却

### Edge
- 失効済みtokenで401
- 空文字/形式不正で400

### Error
- DB障害時に500
- 必須項目欠落で400

## Migration Notes
- 旧APIとの差異: トークン形式・レスポンス構造変更
- エラーコード体系刷新
