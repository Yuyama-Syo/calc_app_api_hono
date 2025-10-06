// types.ts
export type GroupMember = {
  userId: string; // UUID
};

export type Group = {
  groupId: string; // UUID
  name: string;
  members: GroupMember[];
  ownerId: string; // UUID
  // TODO: 永続化層差し替え予定
};
