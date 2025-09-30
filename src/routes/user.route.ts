// user.route.ts
import { Hono } from "hono";
import { listUsersQuerySchema } from "../schema/user.schema";
import { UserService } from "../services/user.service";
import { DomainError } from "../domain/errors";

const userService = new UserService();
export const userRoute = new Hono();

userRoute.get("/user", (c) => {
  try {
    const page = Number(c.req.query("page") ?? 1);
    const limit = Number(c.req.query("limit") ?? 50);
    const parsed = listUsersQuerySchema.safeParse({ page, limit });
    if (!parsed.success) {
      throw DomainError.from("VALIDATION_ERROR", "入力値が不正です", { details: parsed.error.issues });
    }
    const users = userService.list(parsed.data);
    return c.json({ success: true, data: { users } });
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

// TODO: email全件返すのは将来セキュリティ検討
