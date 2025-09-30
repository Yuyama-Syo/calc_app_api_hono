// expense.service.test.ts
import { describe, it, expect } from "vitest";
import { ExpenseService } from "../../src/services/expense.service";
import { ExpenseRepository } from "../../src/repositories/expense.repository";
import { DomainError } from "../../src/domain/errors";

describe("ExpenseService", () => {
  const repo = new ExpenseRepository();
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

  it("create → list → update → delete", () => {
    service.create(baseExpense);
    const list = service.list(baseExpense.groupId);
    expect(list.length).toBe(1);
    expect(list[0].amount).toBe(1000);

    service.update(baseExpense.expenseId, { amount: 2000 });
    const updated = service.get(baseExpense.expenseId);
    expect(updated.amount).toBe(2000);

    service.delete(baseExpense.expenseId);
    expect(() => service.get(baseExpense.expenseId)).toThrow(DomainError);
  });

  it("not found", () => {
    expect(() => service.get("99999999-9999-9999-9999-999999999999")).toThrow(DomainError);
  });

  it("invalid expenseId", () => {
    expect(() =>
      service.create({ ...baseExpense, expenseId: "invalid-uuid" })
    ).toThrow(DomainError);
  });

  it("invalid amount", () => {
    expect(() =>
      service.create({ ...baseExpense, amount: 0 })
    ).toThrow(DomainError);
  });

  it("participants空", () => {
    expect(() =>
      service.create({ ...baseExpense, participants: [] })
    ).toThrow(DomainError);
  });

  it("payerIdがparticipantsに含まれない", () => {
    expect(() =>
      service.create({ ...baseExpense, payerId: "55555555-5555-5555-5555-555555555555" })
    ).toThrow(DomainError);
  });
});
