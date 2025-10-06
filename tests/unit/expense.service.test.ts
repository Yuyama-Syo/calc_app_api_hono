// expense.service.test.ts
import { describe, it, expect } from "vitest";
import { ExpenseService } from "../../src/services/expense.service";
import { ExpenseRepository } from "../../src/repositories/expense.repository";
import { DomainError } from "../../src/domain/errors";

describe("ExpenseService", () => {
  // メモリ上で動作するモックリポジトリ
  class MockExpenseRepository extends ExpenseRepository {
    private expenses: any[] = [];
    async create(expense: any) {
      this.expenses.push({ ...expense });
    }
    async findAllByGroupId(groupId: string) {
      return this.expenses.filter(e => e.groupId === groupId && !e.deleted);
    }
    async list(groupId: string) {
      return this.findAllByGroupId(groupId);
    }
    async findById(expenseId: string) {
      const found = this.expenses.find(e => e.expenseId === expenseId && !e.deleted);
      return found ?? undefined;
    }
    async get(expenseId: string) {
      const found = await this.findById(expenseId);
      if (!found) throw new DomainError('404', "not found");
      return found;
    }
    async update(expenseId: string, update: any) {
      const idx = this.expenses.findIndex(e => e.expenseId === expenseId && !e.deleted);
      if (idx === -1) throw new DomainError('404', "not found");
      this.expenses[idx] = { ...this.expenses[idx], ...update };
      return true;
    }
    async delete(expenseId: string) {
      const idx = this.expenses.findIndex(e => e.expenseId === expenseId && !e.deleted);
      if (idx === -1) throw new DomainError('404', "not found");
      this.expenses[idx].deleted = true;
      return true;
    }
  }
  const repo = new MockExpenseRepository();
  const service = new ExpenseService(repo);

  const baseExpense = {
    expenseId: "11111111-1111-4111-8111-111111111111",
    groupId: "22222222-2222-4222-8222-222222222222",
    amount: 1000,
    payerId: "33333333-3333-4333-8333-333333333333",
    participants: [
      "33333333-3333-4333-8333-333333333333",
      "44444444-4444-4444-8444-444444444444",
    ],
    description: "テスト支出",
  };

  it("create → list → update → delete", async () => {
    await service.create(baseExpense);
    const list = await service.list(baseExpense.groupId);
    expect(list.length).toBe(1);
    expect(list[0].amount).toBe(1000);

    await service.update(baseExpense.expenseId, { amount: 2000 });
    const updated = await service.get(baseExpense.expenseId);
    expect(updated.amount).toBe(2000);

    await service.delete(baseExpense.expenseId);
    await expect(service.get(baseExpense.expenseId)).rejects.toThrow(DomainError);
  });

  it("not found", async () => {
    await expect(service.get("99999999-9999-9999-9999-999999999999")).rejects.toThrow(DomainError);
  });

  it("invalid expenseId", async () => {
    await expect(
      service.create({ ...baseExpense, expenseId: "invalid-uuid" })
    ).rejects.toThrow(DomainError);
  });

  it("invalid amount", async () => {
    await expect(
      service.create({ ...baseExpense, amount: 0 })
    ).rejects.toThrow(DomainError);
  });

  it("participants空", async () => {
    await expect(
      service.create({ ...baseExpense, participants: [] })
    ).rejects.toThrow(DomainError);
  });

  it("payerIdがparticipantsに含まれない", async () => {
    await expect(
      service.create({ ...baseExpense, payerId: "55555555-5555-5555-5555-555555555555" })
    ).rejects.toThrow(DomainError);
  });
});
