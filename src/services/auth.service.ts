// AuthService: メモリ上でユーザ・リフレッシュトークン管理
// TODO: 将来 JWT / 永続化へ置換

type User = {
  email: string;
  passwordHash: string;
};

export const users = new Map<string, User>();
const refreshTokens = new Map<string, string>();

// テスト用: ユーザ・トークン初期化
export function resetAuthService() {
  users.clear();
  refreshTokens.clear();
}

// 疑似ハッシュ関数（本番では使用不可）
function simpleHash(password: string): string {
  // 文字列反転＋長さ付与
  return password.split('').reverse().join('') + password.length;
}

export function register(email: string, password: string): { success: boolean; error?: { code: string; message: string } } {
  if (users.has(email)) {
    return { success: false, error: { code: 'EMAIL_ALREADY_USED', message: 'Email already used' } };
  }
  users.set(email, { email, passwordHash: simpleHash(password) });
  return { success: true };
}

export function login(email: string, password: string): { success: boolean; data?: { userId: string; email: string; accessToken: string; refreshToken: string }; error?: { code: string; message: string } } {
  const user = users.get(email);
  if (!user || user.passwordHash !== simpleHash(password)) {
    return { success: false, error: { code: 'AUTH_INVALID_CREDENTIALS', message: 'Invalid credentials' } };
  }
  // refreshToken生成（本番はJWT等）
  const refreshToken = Math.random().toString(36).slice(2) + Date.now();
  const accessToken = Math.random().toString(36).slice(2) + Date.now();
  const userId = email; // 簡易的にemailをuserIdとして使用
  refreshTokens.set(refreshToken, email);
  return { success: true, data: { userId, email, accessToken, refreshToken } };
}

export function refreshToken(token: string): { success: boolean; data?: { userId: string; email: string; accessToken: string; refreshToken: string }; error?: { code: string; message: string } } {
  const email = refreshTokens.get(token);
  if (!email) {
    return { success: false, error: { code: 'TOKEN_INVALID', message: 'Invalid refresh token' } };
  }
  // 新しいrefreshToken発行
  const newToken = Math.random().toString(36).slice(2) + Date.now();
  const accessToken = Math.random().toString(36).slice(2) + Date.now();
  const userId = email; // 簡易的にemailをuserIdとして使用
  refreshTokens.delete(token);
  refreshTokens.set(newToken, email);
  return { success: true, data: { userId, email, accessToken, refreshToken: newToken } };
}
