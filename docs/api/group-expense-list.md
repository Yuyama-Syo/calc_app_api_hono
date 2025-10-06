# GET /group/:groupId/expense

## Summary
指定グループの支払い一覧を取得する。

## Purpose
グループ内で記録された全支払い情報を取得し、精算状況を把握する。

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
  "expenses": [
    {
      "expenseId": "string",
      "amount": "number",
      "payerId": "string",
      "description": "string"
    }
  ]
}
```
(GetExpenseResponse)

### Error Variants
- 400 Bad Request: パラメータ不正
- 401 Unauthorized: 認証失敗
- 500 Internal Server Error: サーバーエラー

## Validation Rules
- groupId: 必須, 文字列

## Error Codes (domain)
- EXPENSE_INVALID_PARAM (400)
- EXPENSE_UNAUTHORIZED (401)
- EXPENSE_INTERNAL_ERROR (500)

## Business Rules (invariants)
- ログインユーザーが所属するグループのみ取得可能

## OpenAPI hints
- summary: 支払い一覧取得
- description: グループ内の支払い情報一覧取得
- tags: [expense]

## Test Cases

### Normal
- 有効なgroupIdで200, 支払い一覧返却

### Edge
- 支払い0件で空配列返却

### Error
- 認証失敗で401
- DB障害時に500

## Migration Notes
- 旧APIとの差異: レスポンス構造変更
- エラーコード体系刷新
