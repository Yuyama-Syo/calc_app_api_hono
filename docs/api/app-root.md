# GET /

## Summary
サンプルAPI。アプリケーションのルートエンドポイント。

## Purpose
動作確認やAPI疎通確認用。

## Request

### Path Params
なし

### Query Params
なし

### Body
なし

### Headers
なし

## Response

### Success (200 OK)
```
"Hello World"
```
(string)

### Error Variants
なし

## Validation Rules
なし

## Error Codes (domain)
なし

## Business Rules (invariants)
なし

## OpenAPI hints
- summary: サンプルAPI
- description: アプリケーションのルート
- tags: [app]

## Test Cases

### Normal
- GETで200, "Hello World"返却

### Edge
- なし

### Error
- なし

## Migration Notes
- 旧APIとの差異: なし
