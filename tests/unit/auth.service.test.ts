// tests/unit/auth.service.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import * as AuthService from "../../src/services/auth.service";

describe("AuthService", () => {
  const email = "test@example.com";
  const password = "password123";
  let refreshToken: string;

  beforeEach(() => {
    // テスト用リセット関数で初期化
    AuthService.resetAuthService();
  });

  it("register → login → refresh 正常", () => {
    const reg = AuthService.register(email, password);
    expect(reg.success).toBe(true);

    const login = AuthService.login(email, password);
    expect(login.success).toBe(true);
    expect(login.data?.refreshToken).toBeDefined();

    refreshToken = login.data!.refreshToken;
    const refresh = AuthService.refreshToken(refreshToken);
    expect(refresh.success).toBe(true);
    expect(refresh.data?.refreshToken).not.toBe(refreshToken);
  });

  it("重複メール (EMAIL_ALREADY_USED)", () => {
    AuthService.register(email, password);
    const res = AuthService.register(email, password);
    expect(res.success).toBe(false);
    expect(res.error?.code).toBe("EMAIL_ALREADY_USED");
  });

  it("誤りパスワード (AUTH_INVALID_CREDENTIALS)", () => {
    AuthService.register(email, password);
    const res = AuthService.login(email, "wrongpass");
    expect(res.success).toBe(false);
    expect(res.error?.code).toBe("AUTH_INVALID_CREDENTIALS");
  });

  it("無効 refreshToken (TOKEN_INVALID)", () => {
    const res = AuthService.refreshToken("invalidtoken");
    expect(res.success).toBe(false);
    expect(res.error?.code).toBe("TOKEN_INVALID");
  });
});
