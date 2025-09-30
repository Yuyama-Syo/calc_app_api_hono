# DELETE /expense/:expenseId

## Summary
指定支払い情報を削除する。

## Purpose
不要または誤った支払い記録を削除し、精算情報を正確に保つ。

## Request

### Path Params
- expenseId: string

### Query Params
なし

### Body
なし

### Headers
- Authorization: Bearer トークン

## Response

### Success (200 OK)
なし（204 No Content推奨）

### Error Variants
- 400 Bad Request: パラメータ不正
- 401 Unauthorized: 認証失敗
- 500 Internal Server Error: サーバーエラー

## Validation Rules
- expenseId: 必須, 文字列

## Error Codes (domain)
- EXPENSE_INVALID_PARAM (400)
- EXPENSE_UNAUTHORIZED (401)
- EXPENSE_INTERNAL_ERROR (500)

## Business Rules (invariants)
- ログインユーザーがグループメンバーかつ支払い登録者のみ削除可能

## OpenAPI hints
- summary: 支払い削除
- description: 支払い情報の削除
- tags: [expense]

## Test Cases

### Normal
- 有効なexpenseIdで200, 支払い削除

### Edge
- 存在しないexpenseIdで400
- 空文字/形式不正で400

### Error
- 認証失敗で401
- DB障害時に500

## Migration Notes
- 旧APIとの差異: レスポンス構造変更
- エラーコード体系刷新
