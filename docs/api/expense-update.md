# PUT /expense/:expenseId

## Summary
指定支払い情報を更新する。

## Purpose
支払い内容の修正や説明の変更など、記録情報を最新化する。

## Request

### Path Params
- expenseId: string

### Query Params
なし

### Body
```json
{
  "amount": "number",
  "payerId": "string",
  "description": "string"
}
```
(PutExpenseBodyParameter)

### Headers
- Content-Type: application/json
- Authorization: Bearer トークン

## Response

### Success (200 OK)
```json
{
  "expenseId": "string",
  "amount": "number",
  "payerId": "string",
  "description": "string"
}
```
(PutExpenseResponse)

### Error Variants
- 400 Bad Request: パラメータ不正
- 401 Unauthorized: 認証失敗
- 500 Internal Server Error: サーバーエラー

## Validation Rules
- amount: 必須, 数値, 最小値
- payerId: 必須, 文字列
- description: 任意, 文字列

## Error Codes (domain)
- EXPENSE_INVALID_PARAM (400)
- EXPENSE_UNAUTHORIZED (401)
- EXPENSE_INTERNAL_ERROR (500)

## Business Rules (invariants)
- ログインユーザーがグループメンバーかつ支払い登録者のみ更新可能
- 金額は正の数のみ

## OpenAPI hints
- summary: 支払い更新
- description: 支払い情報の修正
- tags: [expense]

## Test Cases

### Normal
- 有効なexpenseId/amount/payerIdで200, 支払い更新

### Edge
- amountが0以下で400
- payerId不正で400

### Error
- 認証失敗で401
- DB障害時に500

## Migration Notes
- 旧APIとの差異: レスポンス構造変更
- エラーコード体系刷新
