# POST /auth/login

## Summary
ログイン認証を行い、アクセストークン等を返却する。

## Purpose
ユーザー認証とセッション開始。認証情報に基づきトークンを発行し、以降のAPI利用を許可する。

## Request

### Path Params
なし

### Query Params
なし

### Body
```json
{
  "email": "string",
  "password": "string"
}
```
(LoginBodyParameter)

### Headers
- Content-Type: application/json

## Response

### Success (200 OK)
```json
{
  "accessToken": "string",
  "refreshToken": "string",
  "userId": "string"
}
```
(LoginResponse)

### Error Variants
- 400 Bad Request: パラメータ不正
- 401 Unauthorized: 認証失敗
- 404 Not Found: ユーザー未登録
- 500 Internal Server Error: サーバーエラー

## Validation Rules
- email: 必須, メール形式
- password: 必須, 文字列, 最小長・最大長（詳細はDTO参照）

## Error Codes (domain)
- AUTH_INVALID_PARAM (400)
- AUTH_UNAUTHORIZED (401)
- AUTH_USER_NOT_FOUND (404)
- AUTH_INTERNAL_ERROR (500)

## Business Rules (invariants)
- メールアドレス・パスワード一致時のみ認証成功
- ロックアウト/多重ログイン制限なし（現状）
- トークン発行は1ユーザー1セット

## OpenAPI hints
- summary: ログイン
- description: メールアドレスとパスワードによる認証
- tags: [auth]

## Test Cases

### Normal
- 正しいemail/passwordで200, トークン返却

### Edge
- 存在しないemailで404
- パスワード誤りで401
- 空文字/形式不正で400

### Error
- DB障害時に500
- 必須項目欠落で400

## Migration Notes
- 旧APIとの差異: トークン形式・レスポンス構造変更
- エラーコード体系刷新
- パスワードハッシュ方式変更（必要に応じて）
