// user.schema.ts
import { z } from "@hono/zod-openapi";

export const listUsersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).openapi({
    description: "ページ番号（1以上）",
    example: 1
  }),
  limit: z.coerce.number().int().min(1).max(100).default(50).openapi({
    description: "1ページあたり取得件数（1〜100）",
    example: 50
  }),
  // filter: z.string().optional(), // 将来拡張用
}).strict().openapi({
  description: "ユーザ一覧取得クエリ",
  example: {
    page: 1,
    limit: 50
  }
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;
