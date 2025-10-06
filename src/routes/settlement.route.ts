// settlement.route.ts
import { Hono } from "hono";
import { settlementParamsSchema } from "../schema/settlement.schema";
import { SettlementService } from "../services/settlement.service";
import { DomainError } from "../domain/errors";

const settlementService = new SettlementService();
export const settlementRoute = new Hono();

settlementRoute.get("/group/:groupId/settlement", async (c) => {
  try {
    const { groupId } = c.req.param();
    const algorithm = c.req.query("algorithm") ?? "equal";
    const parsed = settlementParamsSchema.safeParse({ groupId, algorithm });
    if (!parsed.success) {
      throw DomainError.from("VALIDATION_ERROR", "入力値が不正です", { details: parsed.error.issues });
    }
    const result = settlementService.calculate(groupId, algorithm as "equal");
    return c.json({ success: true, data: result });
  } catch (err) {
    return handleError(c, err);
  }
});

// 共通エラーハンドラ
function handleError(c: any, err: any) {
  if (err instanceof DomainError) {
    return c.json(
      {
        success: false,
        error: {
          code: err.code,
          message: err.message,
          details: err.details,
        },
      },
      err.status ?? 400
    );
  }
  return c.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "予期せぬエラーが発生しました",
      },
    },
    500
  );
}
