// group.service.ts
import { Group, GroupMember } from "../domain/group/types";
import { GroupRepository } from "../repositories/group.repository";
import { DomainError } from "../domain/errors";
import { groupSchema } from "../schema/group.schema";

export class GroupService {
  private repo: GroupRepository;

  constructor(repo?: GroupRepository) {
    this.repo = repo ?? new GroupRepository();
  }

  getAll(): Group[] {
    return this.repo.findAll();
  }

  getById(groupId: string): Group {
    const group = this.repo.findById(groupId);
    if (!group) throw new DomainError("GROUP_NOT_FOUND", "グループが見つかりません");
    return group;
  }

  create(input: Omit<Group, "groupId"> & { groupId: string }): Group {
    // バリデーション
    const parsed = groupSchema.safeParse(input);
    if (!parsed.success) {
      throw DomainError.from("VALIDATION_ERROR", "入力値が不正です", { details: parsed.error.issues });
    }
    // invariant: ownerIdがmembersに含まれる
    if (!input.members.some(m => m.userId === input.ownerId)) {
      throw new DomainError("VALIDATION_ERROR", "オーナーIDがメンバーに含まれていません");
    }
    // invariant: メンバー重複なし
    const memberIds = input.members.map(m => m.userId);
    if (new Set(memberIds).size !== memberIds.length) {
      throw new DomainError("VALIDATION_ERROR", "メンバーIDが重複しています");
    }
    const group: Group = { ...input };
    this.repo.create(group);
    return group;
  }

  update(groupId: string, input: Partial<Omit<Group, "groupId">>): Group {
    const group = this.repo.findById(groupId);
    if (!group) throw new DomainError("GROUP_NOT_FOUND", "グループが見つかりません");
    // owner権限確認はauth middleware実装後
    const updated: Group = { ...group, ...input };
    // バリデーション
    const parsed = groupSchema.safeParse(updated);
    if (!parsed.success) {
      throw DomainError.from("VALIDATION_ERROR", "入力値が不正です", { details: parsed.error.issues });
    }
    // invariant: ownerIdがmembersに含まれる
    if (!updated.members.some(m => m.userId === updated.ownerId)) {
      throw new DomainError("VALIDATION_ERROR", "オーナーIDがメンバーに含まれていません");
    }
    // invariant: メンバー重複なし
    const memberIds = updated.members.map(m => m.userId);
    if (new Set(memberIds).size !== memberIds.length) {
      throw new DomainError("VALIDATION_ERROR", "メンバーIDが重複しています");
    }
    this.repo.update(groupId, updated);
    return updated;
  }
}
