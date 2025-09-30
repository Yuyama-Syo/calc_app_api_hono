// settlement.route.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../../src/app";
import { serve } from "bun";

let server: any;
const baseUrl = "http://localhost:8787";

describe("SettlementRoute e2e", () => {
  beforeAll(async () => {
    server = serve({ fetch: app.fetch, port: 8787 });
    await new Promise((r) => setTimeout(r, 100));
  });

  afterAll(() => {
    server.stop();
  });

  it("GET /group/:groupId/settlement 200", async () => {
    const res = await fetch(`${baseUrl}/group/550e8400-e29b-41d4-a716-446655440000/settlement`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data.settlements)).toBe(true);
  });

  it("GET /group/:groupId/settlement empty expenses", async () => {
    const res = await fetch(`${baseUrl}/group/550e8400-e29b-41d4-a716-446655440001/settlement`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.settlements.length).toBe(0);
  });

  it("GET /group/:groupId/settlement invalid groupId", async () => {
    const res = await fetch(`${baseUrl}/group/invalid-uuid/settlement`);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });
});
