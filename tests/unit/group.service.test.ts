// group.service.test.ts
import { describe, it, expect } from "vitest";
import { GroupService } from "../../src/services/group.service";
import { GroupRepository } from "../../src/repositories/group.repository";
import { DomainError } from "../../src/domain/errors";

describe("GroupService", () => {
  const repo = new GroupRepository();
  const service = new GroupService(repo);

  const baseGroup = {
    groupId: "11111111-1111-4111-8111-111111111111",
    name: "Test Group",
    members: [{ userId: "22222222-2222-4222-8222-222222222222" }],
    ownerId: "22222222-2222-4222-8222-222222222222",
  };

  const buildGroup = (overrides: Partial<typeof baseGroup> = {}) => {
    const members = overrides.members ?? baseGroup.members;
    return {
      ...baseGroup,
      ...overrides,
      members: members.map((member) => ({ ...member })),
    };
  };

  it("create→get→update シナリオ", () => {
    const group = buildGroup();
    service.create(group);
    const found = service.getById(group.groupId);
    expect(found.name).toBe("Test Group");

    service.update(group.groupId, { name: "Updated Group" });
    const updated = service.getById(group.groupId);
    expect(updated.name).toBe("Updated Group");
  });

  it("not found", () => {
    expect(() =>
      service.getById("99999999-9999-9999-9999-999999999999")
    ).toThrow(DomainError);
  });

  it("invalid groupId", () => {
    expect(() =>
      service.create(buildGroup({ groupId: "invalid-uuid" }))
    ).toThrow(DomainError);
  });

  it("invalid members (空)", () => {
    expect(() => service.create(buildGroup({ members: [] }))).toThrow(
      DomainError
    );
  });

  it("invalid members (重複)", () => {
    expect(() =>
      service.create(
        buildGroup({
          members: [
            { userId: baseGroup.ownerId },
            { userId: baseGroup.ownerId },
          ],
        })
      )
    ).toThrow(DomainError);
  });

  it("ownerIdがmembersに含まれない", () => {
    expect(() =>
      service.create(
        buildGroup({
          ownerId: "33333333-3333-3333-3333-333333333333",
          members: [{ userId: baseGroup.ownerId }],
        })
      )
    ).toThrow(DomainError);
  });
});
