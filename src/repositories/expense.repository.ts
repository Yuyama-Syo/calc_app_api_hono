// expense.repository.ts
import { Expense } from "../domain/expense/types";

// TODO: 永続化層差し替え予定
export class ExpenseRepository {
  private expenses = new Map<string, Expense>();

  findAllByGroupId(groupId: string): Expense[] {
    return Array.from(this.expenses.values()).filter(e => e.groupId === groupId && !e.deleted);
  }

  findById(expenseId: string): Expense | undefined {
    const e = this.expenses.get(expenseId);
    return e && !e.deleted ? e : undefined;
  }

  create(expense: Expense): void {
    this.expenses.set(expense.expenseId, expense);
  }

  update(expenseId: string, update: Partial<Expense>): boolean {
    const expense = this.expenses.get(expenseId);
    if (!expense || expense.deleted) return false;
    this.expenses.set(expenseId, { ...expense, ...update });
    return true;
  }

  delete(expenseId: string): boolean {
    const expense = this.expenses.get(expenseId);
    if (!expense || expense.deleted) return false;
    // soft delete（完全削除は設計書参照、未定ならTODO）
    expense.deleted = true;
    this.expenses.set(expenseId, expense);
    return true;
  }
}
