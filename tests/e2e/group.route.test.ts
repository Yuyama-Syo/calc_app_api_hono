// group.route.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import app from "../../src/app";
import { serve } from "bun";

let server: any;
const baseUrl = "http://localhost:8787";

describe("GroupRoute e2e", () => {
  beforeAll(async () => {
    server = serve({ fetch: app.fetch, port: 8787 });
    await new Promise((r) => setTimeout(r, 100));
  });

  afterAll(() => {
    server.stop();
  });

  const baseGroup = {
    groupId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Test Group",
    members: [{ userId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8" }],
    ownerId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  };

  it("POST /group 200", async () => {
    const res = await fetch(`${baseUrl}/group`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(baseGroup),
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.name).toBe("Test Group");
  });

  it("GET /group 200", async () => {
    const res = await fetch(`${baseUrl}/group`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data.groups)).toBe(true);
  });

  it("GET /group/:groupId 200", async () => {
    const res = await fetch(`${baseUrl}/group/${baseGroup.groupId}`);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.groupId).toBe(baseGroup.groupId);
  });

  it("PUT /group/:groupId 200", async () => {
    const res = await fetch(`${baseUrl}/group/${baseGroup.groupId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Updated Group" }),
    });
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.name).toBe("Updated Group");
  });

  it("POST /group invalid groupId", async () => {
    const res = await fetch(`${baseUrl}/group`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...baseGroup, groupId: "invalid-uuid" }),
    });
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("VALIDATION_ERROR");
  });

  it("GET /group/:groupId not found", async () => {
    const res = await fetch(`${baseUrl}/group/550e8400-e29b-41d4-a716-446655440999`);
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("GROUP_NOT_FOUND");
  });
});
