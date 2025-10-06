// 認証ルート定義
import { Hono } from 'hono';
import { registerSchema, loginSchema, refreshTokenSchema } from '../schema/auth.schema';
import * as AuthService from '../services/auth.service';

const authRoute = new Hono();

authRoute.post('/register', async (c) => {
  const body = await c.req.json();
  const result = registerSchema.safeParse(body);
  if (!result.success) {
    return c.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: result.error.format(),
      },
    }, 400);
  }
  const { email, password } = result.data;
  const res = AuthService.register(email, password);
  if (!res.success) {
    return c.json({
      success: false,
      error: res.error,
    }, 409);
  }
  return c.json({ success: true, data: {} }, 201);
});

authRoute.post('/login', async (c) => {
  const body = await c.req.json();
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    return c.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: result.error.format(),
      },
    }, 400);
  }
  const { email, password } = result.data;
  const res = AuthService.login(email, password);
  if (!res.success) {
    return c.json({
      success: false,
      error: res.error,
    }, 401);
  }
  return c.json({ success: true, data: res.data }, 200);
});

authRoute.post('/refresh-token', async (c) => {
  const body = await c.req.json();
  const result = refreshTokenSchema.safeParse(body);
  if (!result.success) {
    return c.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: result.error.format(),
      },
    }, 400);
  }
  const { refreshToken } = result.data;
  const res = AuthService.refreshToken(refreshToken);
  if (!res.success) {
    return c.json({
      success: false,
      error: res.error,
    }, 401);
  }
  return c.json({ success: true, data: res.data }, 200);
});

export default authRoute;

// TODO: 将来 JWT / 永続化へ置換
