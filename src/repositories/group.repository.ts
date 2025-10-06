// group.repository.ts
import { Group } from "../domain/group/types";

// TODO: 永続化層差し替え予定
export class GroupRepository {
  private groups = new Map<string, Group>();

  findAll(): Group[] {
    return Array.from(this.groups.values());
  }

  findById(groupId: string): Group | undefined {
    return this.groups.get(groupId);
  }

  create(group: Group): void {
    this.groups.set(group.groupId, group);
  }

  update(groupId: string, group: Group): boolean {
    if (!this.groups.has(groupId)) return false;
    this.groups.set(groupId, group);
    return true;
  }
}
