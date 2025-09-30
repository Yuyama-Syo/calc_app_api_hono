// group.route.ts
import { Hono } from "hono";
import { groupSchema } from "../schema/group.schema";
import { GroupService } from "../services/group.service";
import { DomainError } from "../domain/errors";

const groupService = new GroupService();
export const groupRoute = new Hono();

groupRoute.post("/group", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = groupSchema.safeParse(body);
    if (!parsed.success) {
      throw DomainError.from("VALIDATION_ERROR", "入力値が不正です", { details: parsed.error.issues });
    }
    // ownerIdはbody.ownerId必須
    const group = groupService.create({ ...body, ownerId: body.ownerId });
    return c.json({ success: true, data: group });
  } catch (err) {
    return handleError(c, err);
  }
});

groupRoute.get("/group", (c) => {
  try {
    const groups = groupService.getAll();
    return c.json({ success: true, data: groups });
  } catch (err) {
    return handleError(c, err);
  }
});

groupRoute.get("/group/:groupId", (c) => {
  try {
    const { groupId } = c.req.param();
    const group = groupService.getById(groupId);
    return c.json({ success: true, data: group });
  } catch (err) {
    return handleError(c, err);
  }
});

groupRoute.put("/group/:groupId", async (c) => {
  try {
    const { groupId } = c.req.param();
    const body = await c.req.json();
    const group = groupService.update(groupId, body);
    return c.json({ success: true, data: group });
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

// TODO: owner権限確認はauth middleware実装後
