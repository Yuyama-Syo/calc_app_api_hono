// common.schema.ts - 共通レスポンススキーマ定義
import { z } from '@hono/zod-openapi';

// 成功レスポンスの共通ラッパー
export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true).openapi({
      description: '成功フラグ',
      example: true,
    }),
    data: dataSchema,
  }).openapi({
    description: '成功レスポンス',
  });

// エラー詳細
export const errorDetailSchema = z.object({
  code: z.string().openapi({
    description: 'エラーコード',
    example: 'VALIDATION_ERROR',
  }),
  message: z.string().openapi({
    description: 'エラーメッセージ',
    example: 'Invalid input',
  }),
  details: z.any().optional().openapi({
    description: 'エラー詳細（任意）',
  }),
}).openapi({
  description: 'エラー詳細情報',
});

// エラーレスポンス
export const errorResponseSchema = z.object({
  success: z.literal(false).openapi({
    description: '成功フラグ',
    example: false,
  }),
  error: errorDetailSchema,
}).openapi({
  description: 'エラーレスポンス',
});

// 認証レスポンス用のデータスキーマ
export const authDataSchema = z.object({
  userId: z.string().uuid().openapi({
    description: 'ユーザーID（UUID）',
    example: '11111111-1111-1111-1111-111111111111',
  }),
  email: z.string().email().openapi({
    description: 'メールアドレス',
    example: 'user@example.com',
  }),
  accessToken: z.string().openapi({
    description: 'アクセストークン',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  }),
  refreshToken: z.string().openapi({
    description: 'リフレッシュトークン',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  }),
}).openapi({
  description: '認証データ',
});

// 登録レスポンス用（空オブジェクト）
export const emptyDataSchema = z.object({}).openapi({
  description: '空のデータオブジェクト',
});

// ユーザースキーマ
export const userSchema = z.object({
  userId: z.string().uuid().openapi({
    description: 'ユーザーID（UUID）',
    example: '11111111-1111-1111-1111-111111111111',
  }),
  email: z.string().email().openapi({
    description: 'メールアドレス',
    example: 'user@example.com',
  }),
  createdAt: z.string().optional().openapi({
    description: '作成日時（ISO文字列）',
    example: '2025-09-30T08:00:00.000Z',
  }),
}).openapi({
  description: 'ユーザー情報',
});

// ユーザー一覧データ
export const usersDataSchema = z.object({
  users: z.array(userSchema).openapi({
    description: 'ユーザー配列',
  }),
  total: z.number().int().openapi({
    description: '総件数',
    example: 100,
  }),
  page: z.number().int().openapi({
    description: '現在のページ',
    example: 1,
  }),
  limit: z.number().int().openapi({
    description: '1ページあたりの件数',
    example: 50,
  }),
}).openapi({
  description: 'ユーザー一覧データ',
});

// 精算情報スキーマ
export const settlementItemSchema = z.object({
  from: z.string().uuid().openapi({
    description: '支払う人のID（UUID）',
    example: 'u1',
  }),
  to: z.string().uuid().openapi({
    description: '受け取る人のID（UUID）',
    example: 'u2',
  }),
  amount: z.number().int().positive().openapi({
    description: '精算金額（整数cents）',
    example: 500,
  }),
}).openapi({
  description: '精算アイテム',
});

export const settlementsDataSchema = z.object({
  settlements: z.array(settlementItemSchema).openapi({
    description: '精算情報配列',
  }),
  groupId: z.string().uuid().openapi({
    description: 'グループID（UUID）',
    example: 'g1',
  }),
}).openapi({
  description: '精算データ',
});
