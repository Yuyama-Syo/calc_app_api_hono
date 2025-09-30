// tests/e2e/auth.e2e.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import app from "../../src/app";
import { resetAuthService } from "../../src/services/auth.service";

describe("/auth E2E", () => {
  const email = "e2e@example.com";
  const password = "password123";
  let refreshToken: string;

  beforeEach(() => {
    resetAuthService();
  });

  it("register 成功 (201)", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
  });

  it("login 成功 (200 + refreshToken)", async () => {
    await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data?.refreshToken).toBeDefined();
    refreshToken = json.data.refreshToken;
  });

  it("refresh-token 成功", async () => {
    await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const loginRes = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const loginJson = await loginRes.json();
    refreshToken = loginJson.data.refreshToken;

    const res = await app.request("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data?.refreshToken).not.toBe(refreshToken);
  });

  it("login 失敗 (誤りパス → AUTH_INVALID_CREDENTIALS)", async () => {
    await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await app.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: "wrongpass" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error?.code).toBe("AUTH_INVALID_CREDENTIALS");
  });

  it("register バリデーション失敗 (password短い → VALIDATION_ERROR)", async () => {
    const res = await app.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password: "123" }),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error?.code).toBe("VALIDATION_ERROR");
  });
});
