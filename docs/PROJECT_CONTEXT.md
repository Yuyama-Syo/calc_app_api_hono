# Project Context: calc_app_api_bun (Bun + Hono + Zod Migration)

## Purpose
既存 calc_app_api をよりモジュール化・型安全・テスト容易な Bun + Hono + Zod 構成へ再構築。

## Non-Goals
- フロントエンド組み込み
- 本段階での重厚な Observability (後段)
- 完全な認証/認可 (将来拡張)

## Stack
Runtime: Bun 1.x  
Framework: Hono  
Validation: Zod  
OpenAPI: (後で) @hono/zod-openapi  
Testing: vitest  
Error: DomainError -> error-handler  

## Layers
routes / services / repositories / domain / schema / middleware / config / utils

## Error Model
DomainError(code, message, status?, details?) → middleware/error-handler.ts

## Error Codes

| Code | Error Type | Description | HTTP Status | Example |
|------|------------|-------------|-------------|---------|
| VALIDATION_ERROR | バリデーションエラー | リクエストパラメータが不正 | 400 | 数値以外の値が入力された |
| DIVIDE_BY_ZERO | ゼロ除算エラー | ゼロで除算しようとした | 400 | 5 ÷ 0 |
| INTERNAL_ERROR | 内部エラー | サーバー内部で予期しないエラー | 500 | データベース接続エラー |
| OPERATION_NOT_SUPPORTED | 操作未対応 | 対応していない計算操作 | 400 | 複素数計算など |
| OVERFLOW_ERROR | オーバーフロー | 計算結果が表現可能範囲を超過 | 400 | 極端に大きな数値の計算 |
| UNDERFLOW_ERROR | アンダーフロー | 計算結果が表現可能範囲を下回る | 400 | 極端に小さな数値の計算 |

### エラーレスポンス形式
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameter",
    "details": "Parameter 'value' must be a valid number"
  }
}
```

## Response Envelope
{ "success": true|false, "data"?: any, "error"?: { code, message, details? } }

## Environment Variables
Validated in src/config/env.ts (Zod). Fail fast.

## Migration Strategy

### Wave 1: Core & User Management (Week 1-2)
- **機能**: 基本計算機能 + ユーザー管理
- **対象**:
  - 四則演算エンドポイント (/calc/add, /calc/subtract, /calc/multiply, /calc/divide)
  - ユーザー登録・ログイン (/auth/regist, /auth/login)
  - 基本認証機能 (JWT トークン発行)
- **成功指標**: 基本計算APIが動作し、ユーザー登録が可能

### Wave 2: Authentication & Authorization (Week 3-4)
- **機能**: 認証・認可システムの拡張
- **対象**:
  - JWT トークン管理・リフレッシュ
  - ロールベースアクセス制御
  - セッション管理
  - パスワードリセット機能
- **成功指標**: セキュアな認証システムが完成

### Wave 3: Analytics & Advanced Features (Week 5-6)
- **機能**: 分析機能と高度な計算機能
- **対象**:
  - 計算履歴の保存・分析 (/history/*)
  - 高度な数学関数 (sin, cos, log等)
  - データ可視化API
  - 統計情報の集計
- **成功指標**: ユーザーの計算履歴が追跡・分析可能

### Wave 4: Performance & Monitoring (Week 7-8)
- **機能**: パフォーマンス最適化と監視
- **対象**:
  - レスポンス時間最適化
  - ログ・メトリクス収集
  - ヘルスチェック機能 (/health)
  - APM統合
- **成功指標**: SLA達成と完全な可観測性

## Test Coverage Policy

### カバレッジ目標
- **Unit Tests**: 95%以上
- **Integration Tests**: 85%以上
- **E2E Tests**: 主要なユーザーフロー100%

### テスト戦略
1. **Unit Tests** (vitest)
   - 各計算ロジックの単体テスト
   - エラーハンドリングのテスト
   - バリデーション機能のテスト (Zod schema)

2. **Integration Tests**
   - APIエンドポイントのテスト
   - ミドルウェアの統合テスト
   - データベース連携のテスト

3. **E2E Tests**
   - 実際のユーザーシナリオのテスト
   - パフォーマンステスト
   - セキュリティテスト

### 必須テストケース
- 基本四則演算（+, -, *, /）
- エラーケース（ゼロ除算、不正入力）
- レスポンス形式の検証
- セキュリティ（SQLインジェクション、XSS対策）
- バリデーション（Zod schema検証）

## Non-Functional Targets

### 性能要件
| メトリクス | 目標値 | 測定方法 |
|-----------|--------|----------|
| レスポンス時間 | < 100ms (P95) | APM監視 |
| スループット | > 1000 req/sec | 負荷テスト |
| 可用性 | 99.9% | アップタイム監視 |
| CPU使用率 | < 70% | システム監視 |
| メモリ使用率 | < 80% | システム監視 |

### 可観測性要件
1. **ログ**
   - 構造化ログ（JSON形式）
   - ログレベル: ERROR, WARN, INFO, DEBUG
   - リクエスト・レスポンスの追跡
   - 相関ID (X-Correlation-ID)

2. **メトリクス**
   - レスポンス時間分布
   - エラー率 (4xx/5xx)
   - スループット (RPS)
   - リソース使用率

3. **トレーシング**
   - 分散トレーシング対応
   - リクエストの完全な追跡
   - パフォーマンスボトルネックの特定

### セキュリティ要件
- HTTPS通信の強制
- 入力値サニタイゼーション (Zod validation)
- レート制限の実装
- セキュリティヘッダーの設定
- 定期的な脆弱性スキャン

### スケーラビリティ要件
- 水平スケーリング対応
- ステートレス設計
- ロードバランサー対応
- データベース接続プール

1. Minimal calc endpoints
2. Wave-based migration for others
3. Add OpenAPI
4. Add security & metrics

## Conventions
- Error code: UPPER_SNAKE
- Commit style: feat:, fix:, refactor:, chore:, test:, docs:
- Branching: feature/*, wave/*, chore/infra, refactor/*