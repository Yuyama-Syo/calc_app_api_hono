// expense.route.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../../src/app";
import { serve } from "bun";

let server: any;
const baseUrl = "http://localhost:8787";

describe("ExpenseRoute e2e", () => {
  beforeAll(async () => {
    server = serve({ fetch: app.fetch, port: 8787 });
    await new Promise((r) => setTimeout(r, 100));
  });

  afterAll(() => {
    server.stop();
  });

  const baseExpense = {
    expenseId: "550e8400-e29b-41d4-a716-446655440001",
    groupId: "550e8400-e29b-41d4-a716-446655440000",
    amount: 1000,
    payerId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    participants: ["6ba7b810-9dad-11d1-80b4-00c04fd430c8", "6ba7b811-9dad-11d1-80b4-00c04fd430c8"],
    description: "テスト支出",
  };

  it("POST /group/:groupId/expense 200", async () => {
    const res = await fetch(`${baseUrl}/group/${baseExpense.groupId}/expense`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(baseExpense),
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.amount).toBe(1000);
  });

  it("GET /group/:groupId/expense 200", async () => {
    const res = await fetch(`${baseUrl}/group/${baseExpense.groupId}/expense`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data.expenses)).toBe(true);
  });

  it("PUT /expense/:expenseId 200", async () => {
    const res = await fetch(`${baseUrl}/expense/${baseExpense.expenseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 2000 }),
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.amount).toBe(2000);
  });

  it("DELETE /expense/:expenseId 200", async () => {
    const res = await fetch(`${baseUrl}/expense/${baseExpense.expenseId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });

  it("POST /group/:groupId/expense invalid amount", async () => {
    const res = await fetch(`${baseUrl}/group/${baseExpense.groupId}/expense`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...baseExpense, amount: 0 }),
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("GET /expense/:expenseId not found", async () => {
    const res = await fetch(`${baseUrl}/expense/550e8400-e29b-41d4-a716-446655440999`, {
      method: "DELETE",
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("EXPENSE_NOT_FOUND");
  });
});
