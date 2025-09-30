// expense.route.ts
import { Hono } from "hono";
import { expenseSchema, updateExpenseBodySchema } from "../schema/expense.schema";
import { ExpenseService } from "../services/expense.service";
import { DomainError } from "../domain/errors";

const expenseService = new ExpenseService();
export const expenseRoute = new Hono();

expenseRoute.post("/group/:groupId/expense", async (c) => {
  try {
    const { groupId } = c.req.param();
    const body = await c.req.json();
    const parsed = expenseSchema.safeParse({ ...body, groupId });
    if (!parsed.success) {
      throw DomainError.from("VALIDATION_ERROR", "入力値が不正です", { details: parsed.error.issues });
    }
    const expense = expenseService.create({ ...body, groupId });
    return c.json({ success: true, data: { expense } });
  } catch (err) {
    return handleError(c, err);
  }
});

expenseRoute.get("/group/:groupId/expense", (c) => {
  try {
    const { groupId } = c.req.param();
    const expenses = expenseService.list(groupId);
    return c.json({ success: true, data: { expenses } });
  } catch (err) {
    return handleError(c, err);
  }
});

expenseRoute.put("/expense/:expenseId", async (c) => {
  try {
    const { expenseId } = c.req.param();
    const body = await c.req.json();
    const parsed = updateExpenseBodySchema.safeParse(body);
    if (!parsed.success) {
      throw DomainError.from("VALIDATION_ERROR", "入力値が不正です", { details: parsed.error.issues });
    }
    const expense = expenseService.update(expenseId, body);
    return c.json({ success: true, data: { expense } });
  } catch (err) {
    return handleError(c, err);
  }
});

expenseRoute.delete("/expense/:expenseId", (c) => {
  try {
    const { expenseId } = c.req.param();
    const result = expenseService.delete(expenseId);
    return c.json({ success: true, data: { deleted: result } });
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

// TODO: participantsにpayerId含む仕様は設計書参照
// TODO: soft deleteか完全削除かは設計書参照
