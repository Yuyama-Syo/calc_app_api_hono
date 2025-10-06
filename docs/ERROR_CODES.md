# Error Codes (version 0.1)

| Code | HTTP | Meaning | Retryable | Notes |
|------|------|---------|-----------|-------|
| VALIDATION_ERROR | 400 | 入力不正 | No | Zod 詳細は error.details |
| AUTH_INVALID_CREDENTIALS | 401 | メール/パス不一致 | No | login |
| EMAIL_ALREADY_USED | 409 | register 重複 | No | register |
| TOKEN_INVALID | 401 | refreshToken 無効 | No | refresh |
| TOKEN_EXPIRED | 401 | (将来) 有効期限超過 | Yes | 期限管理追加後使用 |
| USER_NOT_FOUND | 404 | ユーザ未存在 | No | - |
| GROUP_NOT_FOUND | 404 | グループ未存在 | No | - |
| EXPENSE_NOT_FOUND | 404 | 経費未存在 | No | - |
| SETTLEMENT_NOT_READY | 400 | 精算不可状態 | Possibly | データ不足等 |
| PERMISSION_DENIED | 403 | 権限不足 | No | - |
| RATE_LIMITED | 429 | レート制限 | Yes | - |
| INTERNAL_ERROR | 500 | 不明な内部エラー | Possibly | ログ確認 |