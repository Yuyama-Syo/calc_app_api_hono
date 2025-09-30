// registry.ts - OpenAPIスキーマとルート定義のレジストリ
import { groupSchema } from "../schema/group.schema";
import { expenseSchema } from "../schema/expense.schema";
import { settlementParamsSchema } from "../schema/settlement.schema";
import { listUsersQuerySchema } from "../schema/user.schema";
import { registerSchema, loginSchema, refreshTokenSchema } from "../schema/auth.schema";

// 全スキーマをOpenAPI用に登録
export const openapiSchemas = {
  // Auth schemas
  RegisterRequest: registerSchema,
  LoginRequest: loginSchema,
  RefreshTokenRequest: refreshTokenSchema,
  
  // Group schemas
  Group: groupSchema,
  
  // Expense schemas
  Expense: expenseSchema,
  
  // Settlement schemas
  SettlementParams: settlementParamsSchema,
  
  // User schemas
  ListUsersQuery: listUsersQuerySchema,
};

// 全ルート定義をエクスポート
export * from './routes';
