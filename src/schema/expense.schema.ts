// expense.schema.ts
import { z } from "@hono/zod-openapi";

// 金額は整数cents（0不可）
export const expenseSchema = z.object({
  expenseId: z.string().uuid().openapi({
    description: "支出ID（UUID）",
    example: "e1"
  }),
  groupId: z.string().uuid().openapi({
    description: "グループID（UUID）",
    example: "g1"
  }),
  amount: z.number().int().positive().openapi({
    description: "金額（整数cents, 0不可）",
    example: 1000
  }),
  payerId: z.string().uuid().openapi({
    description: "支払者ID（UUID）",
    example: "u1"
  }),
  participants: z.array(z.string().uuid()).min(1).openapi({
    description: "参加者ID配列（UUID, min1）",
    example: ["u1", "u2"]
  }),
  description: z.string().max(200).optional().openapi({
    description: "説明（任意, 最大200文字）",
    example: "ランチ代"
  }),
  createdAt: z.string().optional().openapi({
    description: "作成日時（ISO文字列, 任意）",
    example: "2025-09-30T08:00:00.000Z"
  }),
  deleted: z.boolean().optional().openapi({
    description: "削除フラグ（soft deleteか完全削除かは設計書参照、未定ならTODO）",
    example: false
  }),
}).passthrough().openapi({
  description: "支出作成・取得・更新用スキーマ",
  example: {
    expenseId: "e1",
    groupId: "g1",
    amount: 1000,
    payerId: "u1",
    participants: ["u1", "u2"],
    description: "ランチ代",
    createdAt: "2025-09-30T08:00:00.000Z",
    deleted: false
  }
});

export const updateExpenseBodySchema = expenseSchema.partial().passthrough();

export type ExpenseInput = z.infer<typeof expenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseBodySchema>;
