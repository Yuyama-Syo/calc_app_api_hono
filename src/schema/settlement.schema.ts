// settlement.schema.ts
import { z } from "@hono/zod-openapi";

// groupId: UUID, algorithm: 'equal'|'weighted'（現状equalのみ）
export const settlementParamsSchema = z.object({
  groupId: z.string().uuid().openapi({
    description: "グループID（UUID）",
    example: "g1"
  }),
  algorithm: z.enum(["equal", "weighted"]).optional().openapi({
    description: "精算アルゴリズム（現状equalのみ/TODO: weighted）",
    example: "equal"
  }),
}).strict().openapi({
  description: "グループ精算リクエストパラメータ",
  example: {
    groupId: "g1",
    algorithm: "equal"
  }
});

export type SettlementParams = z.infer<typeof settlementParamsSchema>;
