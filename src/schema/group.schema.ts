// group.schema.ts

import { z } from "@hono/zod-openapi";

// メンバーはオブジェクト形式
export const groupMemberSchema = z.object({
  userId: z.string().uuid().openapi({
    description: "ユーザーID（UUID）",
    example: "22222222-2222-2222-2222-222222222222"
  })
}).openapi({
  description: "グループメンバー",
});

export const groupSchema = z.object({
  groupId: z.string().uuid().openapi({
    description: "グループID（UUID）",
    example: "11111111-1111-1111-1111-111111111111"
  }),
  name: z.string().min(1).max(100).openapi({
    description: "グループ名（1〜100文字）",
    example: "旅行グループ"
  }),
  members: z.array(groupMemberSchema).min(1).openapi({
    description: "メンバー配列（空不可）",
    example: [{ userId: "22222222-2222-2222-2222-222222222222" }]
  }),
  ownerId: z.string().uuid().openapi({
    description: "オーナーID（UUID）",
    example: "22222222-2222-2222-2222-222222222222"
  }),
}).passthrough().openapi({
  description: "グループ作成・取得・更新用スキーマ",
  example: {
    groupId: "11111111-1111-1111-1111-111111111111",
    name: "旅行グループ",
    members: [{ userId: "22222222-2222-2222-2222-222222222222" }],
    ownerId: "22222222-2222-2222-2222-222222222222"
  }
}); // 不要なら .passthrough() に変更可

export type GroupInput = z.infer<typeof groupSchema>;
