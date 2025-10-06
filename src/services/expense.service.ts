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

  async list(groupId: string): Promise<Expense[]> {
    return await this.repo.findAllByGroupId(groupId);
  }

  async get(expenseId: string): Promise<Expense> {
    const expense = await this.repo.findById(expenseId);
    if (!expense) throw new DomainError("EXPENSE_NOT_FOUND", "支出が見つかりません");
    return expense;
  }

  async create(
    input: Omit<Expense, "createdAt" | "deleted"> &
      Partial<Pick<Expense, "createdAt" | "deleted">>
  ): Promise<Expense> {
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
    await this.repo.create(expense);
    return expense;
  }

  async update(expenseId: string, update: Partial<Expense>): Promise<Expense> {
    const expense = await this.repo.findById(expenseId);
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
    await this.repo.update(expenseId, validated);
    return validated;
  }

  async delete(expenseId: string): Promise<boolean> {
    const expense = await this.repo.findById(expenseId);
    if (!expense) throw new DomainError("EXPENSE_NOT_FOUND", "支出が見つかりません");
    return await this.repo.delete(expenseId);
  }
}
