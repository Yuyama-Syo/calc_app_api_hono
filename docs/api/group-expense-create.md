# POST /group/:groupId/expense

## Summary
指定グループに支払い情報を登録する。

## Purpose
グループ内で発生した支払いを記録し、精算管理を行う。

## Request

### Path Params
- groupId: string

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
(CreateExpenseBodyParameter)

### Headers
- Content-Type: application/json
- Authorization: Bearer トークン

## Response

### Success (201 Created)
```json
{
  "expenseId": "string",
  "groupId": "string",
  "amount": "number",
  "payerId": "string",
  "description": "string"
}
```
(CreateExpenseResponse)

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
- 支払いはグループメンバーのみ登録可能
- 金額は正の数のみ

## OpenAPI hints
- summary: 支払い登録
- description: グループ内の支払い情報登録
- tags: [expense]

## Test Cases

### Normal
- 正しいgroupId/amount/payerIdで201, 支払い登録

### Edge
- amountが0以下で400
- payerId不正で400

### Error
- 認証失敗で401
- DB障害時に500

## Migration Notes
- 旧APIとの差異: レスポンス構造変更
- エラーコード体系刷新
