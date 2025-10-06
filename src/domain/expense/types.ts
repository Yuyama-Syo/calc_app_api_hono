// types.ts
export type Expense = {
  expenseId: string; // UUID
  groupId: string; // UUID
  amount: number; // 整数cents
  payerId: string; // UUID
  participants: string[]; // UUID[]
  description?: string;
  createdAt?: string;
  deleted?: boolean; // soft deleteか完全削除かは設計書参照、未定ならTODO
};

export type ExpenseShare = {
  userId: string; // UUID
  amount: number; // cents
};
