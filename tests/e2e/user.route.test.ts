// user.route.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../../src/app";
import { users, resetAuthService } from "../../src/services/auth.service";
import { serve } from "bun";

let server: any;
const baseUrl = "http://localhost:8787";

describe("UserRoute e2e", () => {
  beforeAll(async () => {
    resetAuthService();
    users.set("test@example.com", { email: "test@example.com", passwordHash: "hashed" });
    server = serve({ fetch: app.fetch, port: 8787 });
    await new Promise((r) => setTimeout(r, 100));
  });

  afterAll(() => {
    server.stop();
  });

  it("GET /user 200", async () => {
    const res = await fetch(`${baseUrl}/user`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data.users)).toBe(true);
    expect(json.data.users[0].email).toBe("test@example.com");
  });

  it("GET /user page/limit指定", async () => {
    for (let i = 1; i <= 60; i++) {
      users.set(`user${i}@example.com`, { email: `user${i}@example.com`, passwordHash: "hashed" });
    }
    const res1 = await fetch(`${baseUrl}/user?page=1&limit=50`);
    const json1 = await res1.json();
    expect(json1.data.users.length).toBe(50);

    const res2 = await fetch(`${baseUrl}/user?page=2&limit=50`);
    const json2 = await res2.json();
    expect(json2.data.users.length).toBe(11); // 1件+60件
  });

  it("GET /user invalid page/limit", async () => {
    const res = await fetch(`${baseUrl}/user?page=0&limit=101`);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });
});
