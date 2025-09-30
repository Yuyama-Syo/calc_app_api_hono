// src/app.ts
import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { errorHandler } from "./middleware/error-handler";
import {
  // Auth routes
  registerRoute,
  loginRoute,
  refreshTokenRoute,
  // Group routes
  createGroupRoute,
  getGroupsRoute,
  getGroupRoute,
  updateGroupRoute,
  createExpenseRoute,
  getExpensesRoute,
  // Settlement routes
  getSettlementsRoute,
  // Expense routes
  deleteExpenseRoute,
  updateExpenseRoute,
  // User routes
  getUsersRoute,
  // App routes
  appRootRoute,
} from "./openapi/registry";
import * as AuthService from "./services/auth.service";
import { GroupService } from "./services/group.service";
import { UserService } from "./services/user.service";
import { DomainError } from "./domain/errors";

const app = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input",
            details: result.error.format(),
          },
        },
        400
      );
    }
  },
});
const groupService = new GroupService();
const userService = new UserService();

// 簡易Expense管理（TODO: ExpenseService実装後に削除）
const expenses = new Map<string, any>();

// エラーハンドラ
app.onError(errorHandler);

// ==================== Auth Routes ====================
app.openapi(registerRoute, async (c) => {
  const body = c.req.valid('json');
  const { email, password } = body;
  const result = AuthService.register(email, password);
  
  if (!result.success) {
    return c.json({
      success: false,
      error: result.error ?? { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    }, 409);
  }
  
  return c.json({ success: true, data: {} }, 201);
});

app.openapi(loginRoute, async (c) => {
  const body = c.req.valid('json');
  const { email, password } = body;
  const result = AuthService.login(email, password);
  
  if (!result.success) {
    return c.json({
      success: false,
      error: result.error ?? { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    }, 401);
  }
  
  return c.json({ success: true, data: result.data! }, 200);
});

app.openapi(refreshTokenRoute, async (c) => {
  const body = c.req.valid('json');
  const { refreshToken } = body;
  const result = AuthService.refreshToken(refreshToken);
  
  if (!result.success) {
    return c.json({
      success: false,
      error: result.error ?? { code: 'UNKNOWN_ERROR', message: 'Unknown error' },
    }, 401);
  }
  
  return c.json({ success: true, data: result.data! }, 200);
});

// ==================== Group Routes ====================
app.openapi(createGroupRoute, async (c) => {
  try {
    const body = c.req.valid('json');
    const group = groupService.create(body as any);
    return c.json({ success: true, data: group });
  } catch (err) {
    return handleError(c, err);
  }
});

app.openapi(getGroupsRoute, async (c) => {
  try {
    const groups = groupService.getAll();
    return c.json({ success: true, data: { groups } });
  } catch (err) {
    return handleError(c, err);
  }
});

app.openapi(getGroupRoute, async (c) => {
  try {
    const { groupId } = c.req.valid('param');
    const group = groupService.getById(groupId);
    return c.json({ success: true, data: group });
  } catch (err) {
    return handleError(c, err);
  }
});

app.openapi(updateGroupRoute, async (c) => {
  try {
    const { groupId } = c.req.valid('param');
    const body = c.req.valid('json');
    const group = groupService.update(groupId, body as any);
    return c.json({ success: true, data: group });
  } catch (err) {
    return handleError(c, err);
  }
});

app.openapi(createExpenseRoute, async (c) => {
  try {
    const { groupId } = c.req.valid('param');
    const body = c.req.valid('json') as any;
    // TODO: ExpenseService実装後に修正
    const expense = { ...body, groupId, createdAt: new Date().toISOString() };
    expenses.set(expense.expenseId, expense);
    return c.json({ success: true, data: expense });
  } catch (err) {
    return handleError(c, err);
  }
});

app.openapi(getExpensesRoute, async (c) => {
  try {
    const { groupId } = c.req.valid('param');
    // TODO: ExpenseService実装後に修正
    const expenses: any[] = [];
    return c.json({ success: true, data: { expenses } });
  } catch (err) {
    return handleError(c, err);
  }
});

// ==================== Settlement Routes ====================
app.openapi(getSettlementsRoute, async (c) => {
  try {
    const { groupId } = c.req.valid('param');
    // TODO: SettlementService実装後に修正
    const settlements: any[] = [];
    return c.json({ success: true, data: { settlements, groupId } });
  } catch (err) {
    return handleError(c, err);
  }
});

// ==================== Expense Routes ====================
app.openapi(deleteExpenseRoute, async (c) => {
  try {
    const { expenseId } = c.req.valid('param');
    // TODO: ExpenseService実装後に修正
    if (!expenses.has(expenseId)) {
      throw DomainError.from("EXPENSE_NOT_FOUND", "Expense not found");
    }
    expenses.delete(expenseId);
    return c.json({ success: true, data: {} });
  } catch (err) {
    return handleError(c, err);
  }
});

app.openapi(updateExpenseRoute, async (c) => {
  try {
    const { expenseId } = c.req.valid('param');
    const body = c.req.valid('json');
    // TODO: ExpenseService実装後に修正
    if (!expenses.has(expenseId)) {
      throw DomainError.from("EXPENSE_NOT_FOUND", "Expense not found");
    }
    const expense = { ...expenses.get(expenseId), ...body };
    expenses.set(expenseId, expense);
    return c.json({ success: true, data: expense });
  } catch (err) {
    return handleError(c, err);
  }
});

// ==================== User Routes ====================
app.openapi(getUsersRoute, async (c) => {
  try {
    const { page, limit } = c.req.valid('query');
    const users = userService.list({ page, limit });
    const total = users.length; // 簡易実装：実際は全体のカウントが必要
    return c.json({ 
      success: true, 
      data: { 
        users: users.map(u => ({ userId: u.id, email: u.email, createdAt: new Date().toISOString() })), 
        total, 
        page, 
        limit 
      } 
    });
  } catch (err) {
    return handleError(c, err);
  }
});

// ==================== App Routes ====================
app.openapi(appRootRoute, async (c) => {
  return c.text('Calc App API is running');
});

// ==================== OpenAPI Documentation ====================
// OpenAPI JSON ドキュメント
app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Calc App API',
    description: '割り勘計算アプリケーションのAPI',
  },
});

// Swagger UI
app.get('/docs', swaggerUI({ url: '/openapi.json' }));

// ==================== Helper Functions ====================
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

export default app;
