// expense.service.ts
import { Expense } from "../domain/expense/types";
import { ExpenseRepository } from "../repositories/expense.repository";
import { DomainError } from "../domain/errors";
import { expenseSchema } from "../schema/expense.schema";
import { splitExpense } from "../domain/expense/split";

export class ExpenseService {
  private repo: ExpenseRepository;

  constructor(repo?: ExpenseRepository) {
    this.repo = repo ?? new ExpenseRepository();
  }

  list(groupId: string): Expense[] {
    return this.repo.findAllByGroupId(groupId);
  }

  get(expenseId: string): Expense {
    const expense = this.repo.findById(expenseId);
    if (!expense) throw new DomainError("EXPENSE_NOT_FOUND", "支出が見つかりません");
    return expense;
  }

  create(
    input: Omit<Expense, "createdAt" | "deleted"> &
      Partial<Pick<Expense, "createdAt" | "deleted">>
  ): Expense {
    const parsed = expenseSchema.safeParse({
      ...input,
      createdAt: input.createdAt,
      deleted: input.deleted,
    });
    if (!parsed.success) {
      throw DomainError.from("VALIDATION_ERROR", "入力値が不正です", {
        details: parsed.error.issues,
      });
    }
    const expense = parsed.data;
    if (!expense.participants.includes(expense.payerId)) {
      throw DomainError.from(
        "VALIDATION_ERROR",
        "payerIdはparticipantsに含まれる必要があります"
      );
    }
    splitExpense(expense.amount, expense.participants, "equal");
    this.repo.create(expense);
    return expense;
  }

  update(expenseId: string, update: Partial<Expense>): Expense {
    const expense = this.repo.findById(expenseId);
    if (!expense) {
      throw new DomainError("EXPENSE_NOT_FOUND", "支出が見つかりません");
    }
    const merged = { ...expense, ...update };
    const parsed = expenseSchema.safeParse(merged);
    if (!parsed.success) {
      throw DomainError.from("VALIDATION_ERROR", "入力値が不正です", {
        details: parsed.error.issues,
      });
    }
    const validated = parsed.data;
    if (!validated.participants.includes(validated.payerId)) {
      throw DomainError.from(
        "VALIDATION_ERROR",
        "payerIdはparticipantsに含まれる必要があります"
      );
    }
    splitExpense(validated.amount, validated.participants, "equal");
    this.repo.update(expenseId, validated);
    return validated;
  }

  delete(expenseId: string): boolean {
    const expense = this.repo.findById(expenseId);
    if (!expense) throw new DomainError("EXPENSE_NOT_FOUND", "支出が見つかりません");
    return this.repo.delete(expenseId);
  }
}
