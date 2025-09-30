# API エンドポイント一覧

## 凡例
- `current_validation`: `no` = 未実装 / `partial` = 部分実装
- `response_shape`: success / failure ステータス
- `known_errors`: 代表的に想定されているエラー（括弧内 = HTTP ステータス）
- `notes`: 備考・改善余地
- 原文に存在するタイポ（例: `CreateGrouopResponse`, `PutGrouopResponse`, `GetGroupRespnse`）はそのまま記載しています

---

## Auth

### POST `/auth/regist`
| 項目 | 内容 |
|------|------|
| Request Body | `RegistBodyParameter` |
| Success | `RegistResponse` |
| Failure | 400 / 409 / 500 |
| current_validation | partial |
| known_errors | ユーザー重複（409）, バリデーションエラー（400）, サーバーエラー（500） |
| notes | バリデーション強化余地あり |

### POST `/auth/login`
| 項目 | 内容 |
|------|------|
| Request Body | `LoginBodyParameter` |
| Success | `LoginResponse` |
| Failure | 400 / 401 / 404 / 500 |
| current_validation | partial |
| known_errors | 認証失敗（401, 404）, バリデーションエラー（400）, サーバーエラー（500） |
| notes | バリデーション強化余地あり |

### POST `/auth/refresh-token`
| 項目 | 内容 |
|------|------|
| Request Body | `RefreshTokenBodyParameter` |
| Success | `RefreshTokenResponse` |
| Failure | 400 / 401 / 500 |
| current_validation | partial |
| known_errors | トークン不正（401, 400）, サーバーエラー（500） |
| notes | バリデーション強化余地あり |

---

## Group

### POST `/group`
| 項目 | 内容 |
|------|------|
| Request Body | `CreateGroupBodyParameter` |
| Success | `CreateGrouopResponse` |
| Failure | 400 / 401 / 500 |
| current_validation | partial |
| known_errors | バリデーションエラー（400）, 認証失敗（401）, サーバーエラー（500） |
| notes | バリデーション強化余地あり |

### PUT `/group/:groupId`
| 項目 | 内容 |
|------|------|
| Path Params | `PutGroupPathParameter` |
| Body | `PutGroupBodyParameter` |
| Success | `PutGrouopResponse` |
| Failure | 400 / 401 / 500 |
| current_validation | partial |
| known_errors | バリデーションエラー（400）, 認証失敗（401）, サーバーエラー（500） |
| notes | バリデーション強化余地あり |

### GET `/group`
| 項目 | 内容 |
|------|------|
| Success | `GetGroupsResponse` |
| Failure | 401 / 500 |
| current_validation | partial |
| known_errors | 認証失敗（401）, サーバーエラー（500） |
| notes | バリデーション強化余地あり |

### GET `/group/:groupId`
| 項目 | 内容 |
|------|------|
| Path Params | `GetGroupPathParameter` |
| Success | `GetGroupRespnse` |
| Failure | 400 / 401 / 500 |
| current_validation | partial |
| known_errors | バリデーションエラー（400）, 認証失敗（401）, サーバーエラー（500） |
| notes | バリデーション強化余地あり |

### POST `/group/:groupId/expense`
| 項目 | 内容 |
|------|------|
| Path Params | `CreateExpensePathParameter` |
| Body | `CreateExpenseBodyParameter` |
| Success | `CreateExpenseResponse` |
| Failure | 400 / 401 / 500 |
| current_validation | partial |
| known_errors | バリデーションエラー（400）, 認証失敗（401）, サーバーエラー（500） |
| notes | バリデーション強化余地あり |

### GET `/group/:groupId/expense`
| 項目 | 内容 |
|------|------|
| Path Params | `GetExpensePathParameter` |
| Success | `GetExpenseResponse` |
| Failure | 400 / 401 / 500 |
| current_validation | partial |
| known_errors | バリデーションエラー（400）, 認証失敗（401）, サーバーエラー（500） |
| notes | バリデーション強化余地あり |

### GET `/group/:groupId/settlement`
| 項目 | 内容 |
|------|------|
| Path Params | `GetSettlementsPathParameter` |
| Success | `GetSettlementsResponse` |
| Failure | 400 / 401 / 500 |
| current_validation | partial |
| known_errors | バリデーションエラー（400）, 認証失敗（401）, サーバーエラー（500） |
| notes | バリデーション強化余地あり |

---

## Expense

### DELETE `/expense/:expenseId`
| 項目 | 内容 |
|------|------|
| Path Params | `DeleteExpensePathParameter` |
| Success | `void` |
| Failure | 400 / 401 / 500 |
| current_validation | partial |
| known_errors | バリデーションエラー（400）, 認証失敗（401）, サーバーエラー（500） |
| notes | バリデーション強化余地あり |

### PUT `/expense/:expenseId`
| 項目 | 内容 |
|------|------|
| Path Params | `PutExpensePathParameter` |
| Body | `PutExpenseBodyParameter` |
| Success | `PutExpenseResponse` |
| Failure | 400 / 401 / 500 |
| current_validation | partial |
| known_errors | バリデーションエラー（400）, 認証失敗（401）, サーバーエラー（500） |
| notes | バリデーション強化余地あり |

---

## User

### GET `/user`
| 項目 | 内容 |
|------|------|
| Success | `GetUsersResponse` |
| Failure | 403 / 500 |
| current_validation | partial |
| known_errors | 権限エラー（403）, サーバーエラー（500） |
| notes | バリデーション強化余地あり |

---

## App

### GET `/`
| 項目 | 内容 |
|------|------|
| Success | `string` |
| Failure | （なし） |
| current_validation | no |
| known_errors | （なし） |
| notes | サンプルAPI |

---

## 改善提案（オプション）

| 分類 | 提案 | 詳細 |
|------|------|------|
| バリデーション | スキーマ定義強化 | Zod / Joi / TypeScript 型連動、自動生成（OpenAPI） |
| エラー統一 | 標準フォーマット | `{ code, message, details, traceId }` など |
| タイポ修正 | Response 名 | `CreateGrouopResponse` → `CreateGroupResponse` 他 |
| ステータス精度 | 404 の追加検討 | Group / Expense / User 個別取得失敗時 |
| 認可 | 役割設計 | RBAC / ABAC 導入（admin, member など） |
| セキュリティ | リフレッシュトークン運用 | ローテーション / 失効理由区別（expired / revoked / malformed） |
| 運用 | OpenAPI 公開 | `/openapi.json` 提供 & モック生成 |
| ロギング | 監査対応 | 認証失敗・重要操作（作成/更新/削除）トレーサビリティ |
| 可観測性 | メトリクス | 成功率, p95 レイテンシ, バリデーションエラー件数 |

---
