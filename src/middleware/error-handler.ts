// src/middleware/error-handler.ts
import { DomainError } from "../domain/errors";
import { ERROR_STATUS_MAP } from "../domain/error-map";
import type { Context } from "hono";
import { ContentfulStatusCode } from "hono/utils/http-status";

// ZodError 型判定用
function isZodError(e: unknown): e is { name: string; errors?: unknown[]; format?: () => unknown } {
  return typeof e === "object" && e !== null && "name" in e && (e as any).name === "ZodError";
}

export const errorHandler = (err: unknown, c: Context): Response => {
  // traceId生成・付与
  let traceId = c.req.header("x-request-id");
  if (!traceId) {
    traceId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
  }
  c.header("X-Request-Id", traceId);

  // unknown throw防御
  let errorObj: Error | DomainError;
  if (typeof err === "string") {
    errorObj = DomainError.from("INTERNAL_ERROR", err);
  } else if (isZodError(err)) {
    errorObj = DomainError.from("VALIDATION_ERROR", "Invalid input", { details: err.format ? err.format() : err });
  } else if (err instanceof DomainError || err instanceof Error) {
    errorObj = err as Error;
  } else {
    errorObj = DomainError.from("INTERNAL_ERROR", "Unknown error");
  }

  // status判定
  let status: number = 500;
  let code = "INTERNAL_ERROR";
  let message = "Internal Server Error";
  let details: unknown = undefined;

  if (errorObj instanceof DomainError) {
    code = errorObj.code;
    message = errorObj.message;
    status = errorObj.status ?? ERROR_STATUS_MAP[code] ?? 500;
    details = errorObj.details;
  } else if (errorObj instanceof Error) {
    message = errorObj.message;
    status = 500;
  }

  // logger.errorフック（仮実装: console.error）
  // logger.error({ code, message, traceId, status });
  console.error({ code, message, traceId, status });

  // HEAD/OPTIONS対応
  const method = c.req.method.toUpperCase();
  if (method === "HEAD") {
    c.header("Content-Type", "application/json");
    return c.body(null, status as ContentfulStatusCode);
  }

  const errorBody: Record<string, unknown> = {
    code,
    message,
    ...(details !== undefined ? { details } : {}),
  };

  // production以外はINTERNAL_ERROR時にstackをdetailsに含める
  if (
    code === "INTERNAL_ERROR" &&
    process.env.NODE_ENV !== "production" &&
    errorObj instanceof Error &&
    errorObj.stack
  ) {
    errorBody.details = { ...(errorBody.details as object), stack: errorObj.stack };
  }

  const response = {
    success: false,
    error: errorBody,
  };

  c.header("Content-Type", "application/json");
  return c.json(response, status as ContentfulStatusCode);
};
