# GET /group/:groupId/settlement

## Summary
指定グループの精算情報を取得する。

## Purpose
グループ内の支払い履歴を元に、最適な精算方法・支払い計画を算出する。

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
  "results": [
    {
      "payerId": "string",
      "payeeId": "string",
      "amount": "number"
    }
  ]
}
```
(GetSettlementsResponse)

### Error Variants
- 400 Bad Request: パラメータ不正
- 401 Unauthorized: 認証失敗
- 500 Internal Server Error: サーバーエラー

## Validation Rules
- groupId: 必須, 文字列

## Error Codes (domain)
- SETTLEMENT_INVALID_PARAM (400)
- SETTLEMENT_UNAUTHORIZED (401)
- SETTLEMENT_INTERNAL_ERROR (500)

## Business Rules (invariants)
- ログインユーザーが所属するグループのみ精算可能
- 支払い履歴に基づき最適化

## OpenAPI hints
- summary: 精算API
- description: グループ内の支払い履歴から精算情報を算出
- tags: [settlement]

## Test Cases

### Normal
- 有効なgroupIdで200, 精算情報返却

### Edge
- 支払い履歴0件で空配列返却

### Error
- 認証失敗で401
- DB障害時に500

## Migration Notes
- 旧APIとの差異: レスポンス構造変更
- エラーコード体系刷新
