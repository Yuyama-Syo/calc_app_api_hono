// Zodによる認証関連スキーマ定義
import { z } from '@hono/zod-openapi';

// 未知フィールドは除去する方針（strictモード）
// 必要に応じて .strict() を外し、unknownフィールドでエラーにすることも可能

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}).strict();

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
}).strict();

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
}).strict();
