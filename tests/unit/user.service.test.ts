// user.service.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { UserService } from "../../src/services/user.service";
import { users, resetAuthService } from "../../src/services/auth.service";

describe("UserService", () => {
  beforeEach(() => {
    resetAuthService();
  });

  it("1ユーザ登録後 /user で取得", () => {
    users.set("test@example.com", { email: "test@example.com", passwordHash: "hashed" });
    const service = new UserService();
    const result = service.list({ page: 1, limit: 10 });
    expect(result.length).toBe(1);
    expect(result[0].email).toBe("test@example.com");
  });

  it("ページング slice", () => {
    for (let i = 1; i <= 60; i++) {
      users.set(`user${i}@example.com`, { email: `user${i}@example.com`, passwordHash: "hashed" });
    }
    const service = new UserService();
    const page1 = service.list({ page: 1, limit: 50 });
    const page2 = service.list({ page: 2, limit: 50 });
    expect(page1.length).toBe(50);
    expect(page2.length).toBe(10);
  });

  it("limit > 100はエラー", () => {
    const service = new UserService();
    expect(() => service.list({ page: 1, limit: 101 })).toThrow();
  });

  it("page < 1はエラー", () => {
    const service = new UserService();
    expect(() => service.list({ page: 0, limit: 10 })).toThrow();
  });
});
